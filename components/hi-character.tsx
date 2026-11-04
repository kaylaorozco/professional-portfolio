'use client';

import { useEffect, useRef, useState } from 'react';

type SpriteFrame = {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  headAnchorX: number;
  baselineY: number;
  accents: Array<{ x: number; y: number; width: number; height: number }>;
};

const spriteSource = '/images/kayla-hi-wave-sprites-v2.png';
const waveFrames = [0, 1, 2, 3, 4, 5, 6, 7, 0] as const;
const frameDuration = 150;
const openingPause = 250;
const restingPause = 2200;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function measureFrames(image: HTMLImageElement): SpriteFrame[] {
  const buffer = document.createElement('canvas');
  buffer.width = image.width;
  buffer.height = image.height;
  const context = buffer.getContext('2d', { willReadFrequently: true });
  if (!context) return [];
  context.drawImage(image, 0, 0);

  const cellWidth = image.width / 4;
  const cellHeight = image.height / 2;

  return Array.from({ length: 8 }, (_, index) => {
    const column = index % 4;
    const row = Math.floor(index / 4);
    const sx = Math.round(column * cellWidth);
    const sy = Math.round(row * cellHeight);
    const sw = Math.round((column + 1) * cellWidth) - sx;
    const sh = Math.round((row + 1) * cellHeight) - sy;
    const pixels = context.getImageData(sx, sy, sw, sh);
    const { data } = pixels;
    let minY = sh;
    let maxY = 0;

    for (let y = 0; y < sh; y += 1) {
      for (let x = 0; x < sw; x += 1) {
        if (data[(y * sw + x) * 4 + 3] > 80) {
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }

    const visited = new Uint8Array(sw * sh);
    const queue = new Int32Array(sw * sh);
    const components: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      size: number;
    }> = [];

    for (let start = 0; start < sw * sh; start += 1) {
      if (visited[start] || data[start * 4 + 3] <= 32) continue;

      let queueStart = 0;
      let queueEnd = 1;
      let componentSize = 0;
      let minX = sw;
      let maxX = 0;
      let componentMinY = sh;
      let componentMaxY = 0;
      queue[0] = start;
      visited[start] = 1;

      while (queueStart < queueEnd) {
        const pixel = queue[queueStart];
        queueStart += 1;
        const x = pixel % sw;
        const y = Math.floor(pixel / sw);
        componentSize += 1;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        componentMinY = Math.min(componentMinY, y);
        componentMaxY = Math.max(componentMaxY, y);

        const neighbors = [pixel - 1, pixel + 1, pixel - sw, pixel + sw];
        for (const neighbor of neighbors) {
          if (neighbor < 0 || neighbor >= sw * sh || visited[neighbor]) continue;
          const neighborX = neighbor % sw;
          if (Math.abs(neighborX - x) > 1 || data[neighbor * 4 + 3] <= 32) continue;
          visited[neighbor] = 1;
          queue[queueEnd] = neighbor;
          queueEnd += 1;
        }
      }

      components.push({
        x: minX,
        y: componentMinY,
        width: maxX - minX + 1,
        height: componentMaxY - componentMinY + 1,
        size: componentSize,
      });
    }

    components.sort((a, b) => b.size - a.size);
    const accents = components.slice(1).filter((component) =>
      component.size > 10 &&
      component.x + component.width < sw * 0.38 &&
      component.y + component.height < sh * 0.34 &&
      component.width < sw * 0.16 &&
      component.height < sh * 0.16
    );

    const headLimit = minY + (maxY - minY) * 0.46;
    let headX = 0;
    let headWeight = 0;
    for (let y = minY; y <= headLimit; y += 1) {
      for (let x = Math.round(sw * 0.3); x < Math.round(sw * 0.76); x += 1) {
        const offset = (y * sw + x) * 4;
        if (
          data[offset + 3] > 180 &&
          data[offset] < 95 &&
          data[offset + 1] < 75 &&
          data[offset + 2] < 135
        ) {
          headX += x;
          headWeight += 1;
        }
      }
    }

    return {
      sx,
      sy,
      sw,
      sh,
      headAnchorX: headWeight ? headX / headWeight : sw / 2,
      baselineY: maxY,
      accents,
    };
  });
}

export function HiCharacter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const activeCanvas = canvas;
    const activeContext = context;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let image: HTMLImageElement | null = null;
    let frames: SpriteFrame[] = [];
    let timer: number | null = null;
    let frameIndex = 0;
    let inView = false;
    let disposed = false;

    function clearTimer() {
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
    }

    function paint(frameNumber: number) {
      if (!image || !frames.length) return;
      const sprite = image;
      const frame = frames[frameNumber];
      const reference = frames[0];
      const scale = activeCanvas.width / reference.sh;
      // The sheet was generated on a shared grid. Keep the animated layer on
      // that exact grid instead of nudging it per frame; otherwise the edge of
      // the clipped layer appears to travel through nearby hair.
      const dx = 0;
      const dy = 0;

      activeContext.clearRect(0, 0, activeCanvas.width, activeCanvas.height);

      // Keep the complete first frame as an immovable base. Generated sprite
      // frames vary slightly in color and silhouette, so swapping the whole
      // illustration makes the character appear to flicker and drift.
      activeContext.drawImage(
        sprite,
        reference.sx,
        reference.sy,
        reference.sw,
        reference.sh,
        0,
        0,
        reference.sw * scale,
        reference.sh * scale,
      );

      function drawCurrentFrame() {
        activeContext.drawImage(
          sprite,
          frame.sx,
          frame.sy,
          frame.sw,
          frame.sh,
          dx,
          dy,
          frame.sw * scale,
          frame.sh * scale,
        );
      }

      function replacePolygon(points: Array<[number, number]>) {
        activeContext.save();
        activeContext.beginPath();
        points.forEach(([x, y], index) => {
          const targetX = x * reference.sw * scale;
          const targetY = y * reference.sh * scale;
          if (index === 0) activeContext.moveTo(targetX, targetY);
          else activeContext.lineTo(targetX, targetY);
        });
        activeContext.closePath();
        activeContext.clip();
        activeContext.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
        drawCurrentFrame();
        activeContext.restore();
      }

      if (frameNumber !== 0) {
        // Only the raised arm is replaced during the wave. The torso, laptop,
        // legs, hair, and page-facing silhouette remain pixel-still.
        replacePolygon([
          [0.22, 0.2],
          [0.36, 0.17],
          [0.415, 0.23],
          [0.415, 0.34],
          [0.37, 0.41],
          [0.37, 0.6],
          [0.32, 0.64],
          [0.26, 0.56],
          [0.27, 0.41],
          [0.22, 0.34],
        ]);

      }

      // The motion marks are separate islands in every sprite frame. Remove
      // the moving set, then redraw frame one's marks at a fixed coordinate.
      for (const accent of frame.accents) {
        const padding = 2 * scale;
        activeContext.clearRect(
          dx + accent.x * scale - padding,
          dy + accent.y * scale - padding,
          accent.width * scale + padding * 2,
          accent.height * scale + padding * 2,
        );
      }

      for (const accent of reference.accents) {
        const padding = 2 * scale;
        activeContext.clearRect(
          accent.x * scale - padding,
          accent.y * scale - padding,
          accent.width * scale + padding * 2,
          accent.height * scale + padding * 2,
        );
      }

      for (const accent of reference.accents) {
        const padding = 2;
        const sourceX = Math.max(0, accent.x - padding);
        const sourceY = Math.max(0, accent.y - padding);
        const sourceWidth = Math.min(reference.sw - sourceX, accent.width + padding * 2);
        const sourceHeight = Math.min(reference.sh - sourceY, accent.height + padding * 2);
        activeContext.drawImage(
          sprite,
          reference.sx + sourceX,
          reference.sy + sourceY,
          sourceWidth,
          sourceHeight,
          sourceX * scale,
          sourceY * scale,
          sourceWidth * scale,
          sourceHeight * scale,
        );
      }
    }

    function canPlay() {
      return Boolean(image) && !disposed && inView && !document.hidden && !reducedMotion.matches;
    }

    function scheduleRest() {
      clearTimer();
      if (!canPlay()) return;
      timer = window.setTimeout(playNextFrame, restingPause);
    }

    function playNextFrame() {
      clearTimer();
      if (!canPlay()) return;
      paint(waveFrames[frameIndex]);
      frameIndex += 1;
      if (frameIndex >= waveFrames.length) {
        frameIndex = 0;
        scheduleRest();
        return;
      }
      timer = window.setTimeout(playNextFrame, frameDuration);
    }

    function syncPlayback() {
      clearTimer();
      if (!canPlay()) {
        paint(0);
        frameIndex = 0;
        return;
      }
      timer = window.setTimeout(playNextFrame, openingPause);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.35 },
    );

    observer.observe(activeCanvas);
    reducedMotion.addEventListener('change', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);

    loadImage(spriteSource)
      .then((loadedImage) => {
        if (disposed) return;
        image = loadedImage;
        frames = measureFrames(loadedImage);
        paint(0);
        setReady(true);
        syncPlayback();
      })
      .catch(() => {
        // The CSS poster remains visible if the animation sheet cannot load.
      });

    return () => {
      disposed = true;
      clearTimer();
      observer.disconnect();
      reducedMotion.removeEventListener('change', syncPlayback);
      document.removeEventListener('visibilitychange', syncPlayback);
    };
  }, []);

  return (
    <div className={`hi-character-stage${ready ? ' is-ready' : ''}`} aria-hidden="true">
      <div className="hi-character-poster" />
      <canvas
        ref={canvasRef}
        className={`hi-character-canvas${ready ? ' is-ready' : ''}`}
        width={1000}
        height={1000}
      />
    </div>
  );
}
