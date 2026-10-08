'use client';

import { useEffect, useRef, type Ref } from 'react';

// The generated sheet has 384px column spacing and 418px row spacing.
// Always draw the same opening pose; replace only the eye and fingertips.
// This keeps the podium, laptop, silhouette and ground contact stationary.
const sheetUrl = '/images/kayla-about-idle-v2.png';
const width = 300;
const height = 418;
const cropX = 100;
const gesture = [
  [0, 0], [90, 1], [180, 2], [270, 1], [360, 0],
  [700, 4], [850, 5], [1030, 4], [1170, 0],
  [1440, 4], [1590, 5], [1770, 4], [1930, 0],
] as const;

export function AboutCharacter({ onOpenToolkit, toolkitOpen, laptopFrame, explored, triggerRef }: {
  onOpenToolkit: () => void;
  toolkitOpen: boolean;
  laptopFrame: number;
  explored: boolean;
  triggerRef: Ref<HTMLButtonElement>;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lidProgressRef = useRef(laptopFrame / 2);
  const repaintRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const target = laptopFrame / 2;
    const from = lidProgressRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animation = 0;
    const start = performance.now();
    const duration = target > from ? 560 : 360;
    const advance = (now: number) => {
      const elapsed = preference.matches ? 1 : Math.min(1, (now - start) / duration);
      const eased = elapsed * elapsed * (3 - 2 * elapsed);
      lidProgressRef.current = from + (target - from) * eased;
      repaintRef.current?.();
      if (elapsed < 1) animation = requestAnimationFrame(advance);
    };
    animation = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(animation);
  }, [laptopFrame]);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!stage || !canvas || !context) return;
    context.setTransform(2, 0, 0, 2, 0, 0);
    context.imageSmoothingQuality = 'high';

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sheet = new Image();
    let disposed = false;
    let ready = false;
    let visible = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let step = 0;
    let currentGesture = 0;
    const patches = new Map<number, { image: HTMLCanvasElement; x: number; y: number }>();
    const lid = document.createElement('canvas');
    lid.width = width;
    lid.height = height;
    type Point = readonly [number, number];
    const sourceLid: Point[] = [[8, 65], [73, 65], [89, 140], [24, 130]];
    const polygon = (painter: CanvasRenderingContext2D, points: Point[]) => {
      painter.beginPath();
      points.forEach(([x, y], index) => index ? painter.lineTo(x, y) : painter.moveTo(x, y));
      painter.closePath();
    };
    const drawTriangle = (source: Point[], destination: Point[]) => {
      const [s0, s1, s2] = source;
      const [d0, d1, d2] = destination;
      const ux = s1[0] - s0[0], uy = s1[1] - s0[1];
      const vx = s2[0] - s0[0], vy = s2[1] - s0[1];
      const det = ux * vy - uy * vx;
      const a = ((d1[0] - d0[0]) * vy - (d2[0] - d0[0]) * uy) / det;
      const b = ((d1[1] - d0[1]) * vy - (d2[1] - d0[1]) * uy) / det;
      const c = (ux * (d2[0] - d0[0]) - vx * (d1[0] - d0[0])) / det;
      const d = (ux * (d2[1] - d0[1]) - vx * (d1[1] - d0[1])) / det;
      context.save();
      // A subpixel overlap prevents a hairline between the texture triangles.
      const center = [destination.reduce((sum, p) => sum + p[0], 0) / 3, destination.reduce((sum, p) => sum + p[1], 0) / 3];
      polygon(context, destination.map(([x, y]) => [center[0] + (x - center[0]) * 1.012, center[1] + (y - center[1]) * 1.012]));
      context.clip();
      context.transform(a, b, c, d, d0[0] - a * s0[0] - c * s0[1], d0[1] - b * s0[0] - d * s0[1]);
      context.drawImage(lid, 0, 0);
      context.restore();
    };

    const preparePatch = (frame: number, x: number, y: number, w: number, h: number, offsetX = 0, offsetY = 0) => {
      const patch = document.createElement('canvas');
      patch.width = w;
      patch.height = h;
      const painter = patch.getContext('2d');
      if (!painter) return;
      painter.drawImage(sheet, x + frame % 3 * 384 + offsetX, y + Math.floor(frame / 3) * 418 + offsetY,
        w, h, 0, 0, w, h);
      // Feather only the outer two pixels, well outside the moving features.
      // The opaque center replaces the original fingers without double outlines.
      const pixels = painter.getImageData(0, 0, w, h);
      for (let py = 0; py < h; py++) for (let px = 0; px < w; px++) {
        const edge = Math.min(px, py, w - 1 - px, h - 1 - py);
        pixels.data[(py * w + px) * 4 + 3] *= Math.min(1, edge / 2);
      }
      painter.putImageData(pixels, 0, 0);
      patches.set(frame, { image: patch, x: x - cropX, y });
    };

    const paint = (frame: number) => {
      currentGesture = frame;
      context.clearRect(0, 0, width, height);
      context.drawImage(sheet, cropX, 0, width, height, 0, 0, width, height);
      const progress = lidProgressRef.current;
      if (progress < 1) {
        context.save();
        // Protect the original podium rim from BOTH the cutout and moving lid.
        // Its left corner sits above the hinge baseline; preserving only the
        // pixels below that baseline lets the animated texture cover the edge.
        context.beginPath();
        context.rect(0, 0, width, height);
        context.moveTo(0, 132);
        context.lineTo(24, 128);
        context.lineTo(94, 140);
        context.lineTo(94, height);
        context.lineTo(0, height);
        context.closePath();
        context.clip('evenodd');
        // Remove the raised lid only ABOVE its hinge. Keep the original lower
        // three pixels of the lid, dark hinge, and complete podium rim intact.
        // Clearing through that edge and repainting it introduced the gaps.
        context.save();
        // Include the raised outline's antialiased fringe at the top/sides,
        // but stop short of the fixed hinge from (24, 130) to (89, 140).
        polygon(context, [[0, 60], [77, 60], [89, 137], [23, 127]]);
        context.clip();
        context.clearRect(0, 55, 95, 90);
        context.restore();
        const angle = progress * Math.PI / 2;
        const cos = Math.cos(angle), sin = Math.sin(angle);
        const destination: Point[] = [
          [24 + 51 * cos - 16 * sin, 130 - 15 * cos - 65 * sin],
          [89 + 51 * cos - 16 * sin, 140 - 15 * cos - 75 * sin],
          sourceLid[2], sourceLid[3],
        ];
        context.save();
        // Triangle overlap is permitted only inside the moving lid silhouette.
        polygon(context, destination);
        context.clip();
        drawTriangle([sourceLid[0], sourceLid[1], sourceLid[2]], [destination[0], destination[1], destination[2]]);
        drawTriangle([sourceLid[0], sourceLid[2], sourceLid[3]], [destination[0], destination[2], destination[3]]);
        context.restore();
        context.restore();
        // The original forearm stays in front of the lid as it folds down.
        context.save();
        polygon(context, [[118, 106], [165, 116], [174, 148], [149, 151], [140, 133], [116, 130], [107, 126], [106, 119], [111, 112]]);
        context.clip();
        context.drawImage(sheet, cropX, 0, width, height, 0, 0, width, height);
        context.restore();
      }
      const patch = patches.get(frame);
      if (patch) context.drawImage(patch.image, patch.x, patch.y);
      stage.dataset.frame = String(frame);
      stage.dataset.lidProgress = progress.toFixed(3);
    };
    repaintRef.current = () => { if (ready) paint(currentGesture); };

    const canPlay = () => ready && visible && !preference.matches && !document.hidden && !disposed;
    const advance = () => {
      if (!canPlay()) return;
      paint(gesture[step][1]);
      if (step < gesture.length - 1) {
        const wait = gesture[step + 1][0] - gesture[step][0];
        step++;
        timer = setTimeout(advance, wait);
      } else {
        step = 0;
        // Keep the gesture easy to notice without making the pauses mechanical.
        timer = setTimeout(advance, 1200 + Math.random() * 600);
      }
    };
    const sync = () => {
      clearTimeout(timer);
      step = 0;
      if (ready) paint(0);
      if (canPlay()) timer = setTimeout(advance, 150);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.35 });
    observer.observe(stage);
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    const onImagesLoaded = () => {
      if (disposed || ready || !sheet.complete || !sheet.naturalWidth) return;
      const painter = lid.getContext('2d');
      if (!painter) return;
      polygon(painter, sourceLid);
      painter.clip();
      painter.drawImage(sheet, cropX, 0, width, height, 0, 0, width, height);
      preparePatch(1, 247, 35, 17, 14);
      preparePatch(2, 247, 35, 17, 14);
      // Register the dress/podium seam beneath each generated hand.
      preparePatch(4, 238, 106, 42, 48, 1, -2);
      preparePatch(5, 238, 106, 42, 48, 2, -2);
      ready = true;
      stage.dataset.ready = 'true';
      sync();
    };
    sheet.onload = onImagesLoaded;
    // The CSS opening pose remains available if loading or canvas fails.
    sheet.src = sheetUrl;

    return () => {
      disposed = true;
      repaintRef.current = null;
      clearTimeout(timer);
      observer.disconnect();
      preference.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <div className="about-portrait" data-laptop-open={laptopFrame > 0}>
      <span className="about-spark" aria-hidden="true">✦</span>
      <button className="toolkit-invitation" type="button" onClick={onOpenToolkit}
        ref={triggerRef} aria-haspopup="dialog" aria-expanded={toolkitOpen} aria-controls="about-toolkit" data-explored={explored}>
        <span>Psst—see what<br />I build with</span>
        <svg viewBox="0 0 80 64" fill="none" aria-hidden="true">
          <path d="M68 5C39 0 16 12 23 35c3 10 16 10 18 0 2-9-14-13-23-1C12 41 14 50 18 57m-10-7 10 8 6-12" />
        </svg>
      </button>
      {/* A single accessible image represents the canvas and CSS fallback together. */}
      {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
      <div className="about-character" ref={stageRef} role="img"
        aria-label="Illustration of Kayla leaning on a podium beside an orange laptop"
        data-frame="0" data-laptop-frame={laptopFrame}>
        <div className="about-character-still" aria-hidden="true" />
        <canvas ref={canvasRef} width={width * 2} height={height * 2} aria-hidden="true" />
      </div>
      <button type="button" className="about-laptop-hotspot" onClick={onOpenToolkit}
        aria-label="Open my toolkit" aria-haspopup="dialog" aria-expanded={toolkitOpen} aria-controls="about-toolkit" />
    </div>
  );
}
