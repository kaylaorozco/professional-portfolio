'use client';

import { useEffect, useRef } from 'react';

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

export function AboutCharacter() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!stage || !canvas || !context) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sheet = new Image();
    let disposed = false;
    let ready = false;
    let visible = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let step = 0;
    const patches = new Map<number, { image: HTMLCanvasElement; x: number; y: number }>();

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
      context.clearRect(0, 0, width, height);
      context.drawImage(sheet, cropX, 0, width, height, 0, 0, width, height);
      const patch = patches.get(frame);
      if (patch) context.drawImage(patch.image, patch.x, patch.y);
      stage.dataset.frame = String(frame);
    };

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
    sheet.onload = () => {
      if (disposed) return;
      preparePatch(1, 247, 35, 17, 14);
      preparePatch(2, 247, 35, 17, 14);
      // Register the dress/podium seam beneath each generated hand.
      preparePatch(4, 238, 106, 42, 48, 1, -2);
      preparePatch(5, 238, 106, 42, 48, 2, -2);
      ready = true;
      stage.dataset.ready = 'true';
      sync();
    };
    // The CSS opening pose remains available if loading or canvas fails.
    sheet.src = sheetUrl;

    return () => {
      disposed = true;
      clearTimeout(timer);
      observer.disconnect();
      preference.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <div className="about-portrait">
      <span className="about-spark" aria-hidden="true">✦</span>
      <span className="about-dots" aria-hidden="true" />
      {/* A single accessible image represents the canvas and CSS fallback together. */}
      {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
      <div className="about-character" ref={stageRef} role="img"
        aria-label="Illustration of Kayla leaning on a podium beside an orange laptop"
        data-frame="0">
        <div className="about-character-still" aria-hidden="true" />
        <canvas ref={canvasRef} width={width} height={height} aria-hidden="true" />
      </div>
    </div>
  );
}
