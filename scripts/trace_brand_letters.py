from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/images/kayla-hero-original.png"
LOGO_SOURCE = ROOT / "public/images/ko-logo-transparent.png"
OUTPUT = ROOT / "public/brand-letters"
TARGET = np.array([254, 243, 224], dtype=np.int16)

GLYPH_BOXES = {
    "k": (104, 211, 172, 306),
    "a": (177, 239, 242, 306),
    "y": (245, 239, 314, 334),
    "l": (316, 211, 348, 305),
    "o": (968, 241, 1040, 313),
    "r": (1045, 241, 1108, 311),
    "z": (1189, 242, 1251, 311),
    "c": (1256, 241, 1320, 313),
}


def connected_components(mask: np.ndarray) -> list[tuple[int, int, int, int, int]]:
    height, width = mask.shape
    seen = np.zeros_like(mask, dtype=bool)
    components: list[tuple[int, int, int, int, int]] = []

    for y in range(height):
        for x in range(width):
            if not mask[y, x] or seen[y, x]:
                continue
            queue = deque([(x, y)])
            seen[y, x] = True
            points: list[tuple[int, int]] = []
            while queue:
                px, py = queue.popleft()
                points.append((px, py))
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if 0 <= nx < width and 0 <= ny < height and mask[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        queue.append((nx, ny))
            if len(points) >= 60:
                xs = [point[0] for point in points]
                ys = [point[1] for point in points]
                components.append((min(xs), min(ys), max(xs) + 1, max(ys) + 1, len(points)))

    return sorted(components, key=lambda item: item[0])


def boundary_edges(mask: np.ndarray) -> dict[tuple[int, int], list[tuple[int, int]]]:
    height, width = mask.shape
    edges: dict[tuple[int, int], list[tuple[int, int]]] = {}

    def add(start: tuple[int, int], end: tuple[int, int]) -> None:
        edges.setdefault(start, []).append(end)

    for y in range(height):
        for x in range(width):
            if not mask[y, x]:
                continue
            if y == 0 or not mask[y - 1, x]:
                add((x, y), (x + 1, y))
            if x == width - 1 or not mask[y, x + 1]:
                add((x + 1, y), (x + 1, y + 1))
            if y == height - 1 or not mask[y + 1, x]:
                add((x + 1, y + 1), (x, y + 1))
            if x == 0 or not mask[y, x - 1]:
                add((x, y + 1), (x, y))

    return edges


def direction(start: tuple[int, int], end: tuple[int, int]) -> int:
    dx, dy = end[0] - start[0], end[1] - start[1]
    return {(1, 0): 0, (0, 1): 1, (-1, 0): 2, (0, -1): 3}[(dx, dy)]


def trace_loops(mask: np.ndarray) -> list[list[tuple[int, int]]]:
    edges = boundary_edges(mask)
    loops: list[list[tuple[int, int]]] = []
    turn_priority = {1: 0, 0: 1, 3: 2, 2: 3}

    while edges:
        start = min(edges)
        current = start
        previous_direction = 0
        loop = [start]

        while True:
            candidates = edges.get(current, [])
            if not candidates:
                break
            if len(loop) == 1:
                next_point = candidates[0]
            else:
                next_point = min(
                    candidates,
                    key=lambda point: turn_priority[(direction(current, point) - previous_direction) % 4],
                )
            candidates.remove(next_point)
            if not candidates:
                del edges[current]
            previous_direction = direction(current, next_point)
            current = next_point
            if current == start:
                break
            loop.append(current)

        if len(loop) > 4:
            loops.append(loop)

    return loops


def simplify_collinear(loop: list[tuple[int, int]]) -> list[tuple[int, int]]:
    simplified: list[tuple[int, int]] = []
    count = len(loop)
    for index, point in enumerate(loop):
        previous = loop[index - 1]
        following = loop[(index + 1) % count]
        if (point[0] - previous[0], point[1] - previous[1]) == (
            following[0] - point[0],
            following[1] - point[1],
        ):
            continue
        simplified.append(point)
    return simplified


def write_svg(letter: str, mask: np.ndarray) -> None:
    rows, columns = np.where(mask)
    x0, x1 = columns.min(), columns.max() + 1
    y0, y1 = rows.min(), rows.max() + 1
    trimmed = mask[y0:y1, x0:x1]
    loops = [simplify_collinear(loop) for loop in trace_loops(trimmed)]
    commands = []
    for loop in loops:
        commands.append("M " + " L ".join(f"{x} {y}" for x, y in loop) + " Z")
    width, height = trimmed.shape[1], trimmed.shape[0]
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">\n'
        f'  <path fill="#000" fill-rule="evenodd" d="{" ".join(commands)}"/>\n'
        "</svg>\n"
    )
    (OUTPUT / f"{letter}.svg").write_text(svg)
    print(f"{letter}: {width}×{height}, {len(loops)} contours")


def write_canvas_svg(name: str, mask: np.ndarray) -> None:
    loops = [simplify_collinear(loop) for loop in trace_loops(mask)]
    commands = []
    for loop in loops:
        commands.append("M " + " L ".join(f"{x} {y}" for x, y in loop) + " Z")
    width, height = mask.shape[1], mask.shape[0]
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">\n'
        f'  <path fill="#000" fill-rule="evenodd" d="{" ".join(commands)}"/>\n'
        "</svg>\n"
    )
    (OUTPUT / f"{name}.svg").write_text(svg)
    print(f"{name}: {width}×{height}, {len(loops)} contours")


def main() -> None:
    image = np.asarray(Image.open(SOURCE).convert("RGB"), dtype=np.int16)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for letter, (x0, y0, x1, y1) in GLYPH_BOXES.items():
        crop = image[y0:y1, x0:x1]
        distance = np.linalg.norm(crop - TARGET, axis=2)
        write_svg(letter, distance < 42)

    logo = np.asarray(Image.open(LOGO_SOURCE).convert("RGBA"), dtype=np.int16)
    red, green, blue, alpha = (logo[:, :, index] for index in range(4))
    dark = (alpha > 60) & (red < 170) & (green < 115) & (blue < 95)
    orange = (alpha > 60) & (red >= 150) & (green < 180) & (blue < 130)
    rows = np.indices(alpha.shape)[0]
    write_canvas_svg("ko-letters", dark)
    write_canvas_svg("ko-swoosh", orange & (rows >= 62))
    write_canvas_svg("ko-stars", orange & (rows < 62))


if __name__ == "__main__":
    main()
