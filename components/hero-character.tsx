'use client';

import { useEffect, useRef, useState } from 'react';

type Region = readonly [number, number, number, number];
type Pose = { image: HTMLCanvasElement; box: Region; headHeight: number; headAnchor: number };
// Pixel registration against frame zero's face/hair. Translation only: never
// resize the seated body based on small differences in generated outlines.
const closingOffsets = [0, 0, 0, -1, -1, -1, -1, -2, -2, -2, -2, -2];
const riseRegions: Region[] = [
  [0, 0, 510, 420], [530, 0, 395, 420], [970, 0, 340, 420], [1410, 0, 364, 420],
  [100, 425, 320, 450], [575, 425, 270, 450], [1035, 425, 230, 450], [1490, 425, 220, 450],
];
// Crown-to-chin measurements keep scale independent of the pose's height.
const riseHeadHeights = [87, 90, 90, 90, 79, 80, 79, 87];
const delay = 500;
const closingDuration = 2000;
const standingDuration = 1400;
const walkingDuration = 4400;
const walkingSize = 1.08;
// Sampled from the opening pose's dark hair, rather than the lighter walk sheet.
const hairColor = [19, 7, 42] as const;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function measurePoses(image: HTMLImageElement, regions: Region[], headHeights: number[]): Pose[] {
  const buffer = document.createElement('canvas');
  buffer.width = image.width;
  buffer.height = image.height;
  const context = buffer.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas unavailable');
  context.drawImage(image, 0, 0);
  return regions.map(([x, y, w, h], index) => {
    const pixels = context.getImageData(x, y, w, h);
    const { data } = pixels;
    let minX = w, minY = h, maxX = 0, maxY = 0;
    for (let py = 0; py < h; py++) for (let px = 0; px < w; px++) {
      if (data[(py * w + px) * 4 + 3] > 100) {
        minX = Math.min(minX, px); maxX = Math.max(maxX, px);
        minY = Math.min(minY, py); maxY = Math.max(maxY, py);
      }
    }
    const box: Region = maxX >= minX
      ? [x + minX, y + minY, maxX - minX + 1, maxY - minY + 1] : [x, y, w, h];
    // Anchor to the dark hair at the crown, rather than the overall silhouette.
    // Extended hands and feet otherwise shift the character's center each frame.
    let headX = 0, headWeight = 0;
    for (let py = minY; py < Math.min(h, minY + headHeights[index]); py++) {
      for (let px = minX; px <= maxX; px++) {
        const offset = (py * w + px) * 4;
        if (data[offset + 3] > 200 && data[offset] < 85 && data[offset + 1] < 65 && data[offset + 2] < 120) {
          headX += px;
          headWeight++;
        }
      }
    }
    // Normalize the dark hair palette once when loading, not every animation
    // tick. Limit the recolor to the head/hair area; keep skin and clothing intact.
    for (let py = minY; py < Math.min(h, minY + headHeights[index] * 2); py++) {
      for (let px = minX; px <= maxX; px++) {
        const offset = (py * w + px) * 4;
        if (data[offset + 3] > 0 && data[offset] < 60 && data[offset + 1] < 45 && data[offset + 2] < 100) {
          data[offset] = hairColor[0];
          data[offset + 1] = hairColor[1];
          data[offset + 2] = hairColor[2];
        }
      }
    }
    context.putImageData(pixels, x, y);
    return { image: buffer, headHeight: headHeights[index], box,
      headAnchor: headWeight ? headX / headWeight - minX : box[2] / 2 };
  });
}

export function HeroCharacter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !stage || !ctx) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false, loaded = false, inView = false, finished = false;
    let raf = 0, last = 0, elapsed = 0;
    let rising: Pose[] = [], walking: Pose[] = [];
    let standingExitSize = 1;
    let closingSheet: HTMLImageElement;
    let closingCorrections: HTMLImageElement;
    let lidCorrections: HTMLImageElement;

    const paintClosing = (frame: number, scale: number) => {
      const w = closingSheet.width / 3, h = closingSheet.height / 4;
      const ratio = 1000 * scale / w;
      // Keep each approved frame; the lid correction is limited to frames 9–10.
      const sheet = frame === 8 || frame === 9 ? lidCorrections
        : frame === 7 ? closingCorrections : closingSheet;
      ctx.drawImage(sheet, frame % 3 * w, Math.floor(frame / 3) * h, w, h,
        500 - w * ratio / 2 - closingOffsets[frame] * ratio,
        1000 - h * ratio, w * ratio, h * ratio);
    };

    const paintPose = (pose: Pose, scale: number, headPosition: number, size = 1) => {
      const [x, y, w, h] = pose.box;
      const ratio = 145 * scale * size / pose.headHeight;
      ctx.globalAlpha = 1;
      ctx.drawImage(pose.image, x, y, w, h, 500 + (headPosition - 500) * scale - pose.headAnchor * ratio,
        1000 - 50 * scale - h * ratio, w * ratio, h * ratio);
      ctx.globalAlpha = 1;
    };
    const paintSequence = (poses: Pose[], time: number, frameDuration: number, scale: number, headPosition: number, loop = false, size = 1) => {
      const position = time / frameDuration;
      const frame = loop ? Math.floor(position) % poses.length : Math.min(poses.length - 1, Math.floor(position));
      // Draw one solid pose per frame. Overlapping translucent poses caused
      // opacity dips and double outlines; more poses supply the in-between motion.
      paintPose(poses[frame], scale, headPosition, size);
    };
    const draw = () => {
      if (elapsed < delay) return;
      const t = elapsed - delay;
      const scale = parseFloat(getComputedStyle(stage).getPropertyValue('--character-scale')) || 1;
      ctx.clearRect(0, 0, 1000, 1000);
      if (t < closingDuration) {
        stage.dataset.animationPhase = 'closing';
        const frame = Math.min(closingOffsets.length - 1, Math.floor(t / closingDuration * closingOffsets.length));
        paintClosing(frame, scale);
      } else if (t < closingDuration + standingDuration) {
        stage.dataset.animationPhase = 'standing';
        const riseTime = t - closingDuration;
        const progress = Math.min(1, riseTime / (standingDuration - standingDuration / rising.length));
        const headPosition = 215 + 285 * (progress * progress * (3 - 2 * progress));
        const frame = Math.min(rising.length - 1, Math.floor(riseTime / (standingDuration / rising.length)));
        paintPose(rising[frame], scale, headPosition,
          frame === rising.length - 1 ? standingExitSize : 1);
      } else {
        stage.dataset.animationPhase = 'walking';
        const walkTime = t - closingDuration - standingDuration;
        paintSequence(walking, walkTime, 90, scale, 500, true, walkingSize);
        const distance = walkTime / walkingDuration *
          (window.innerWidth - stage.getBoundingClientRect().left + stage.clientWidth * 0.55);
        canvas.style.transform = 'translateX(' + distance + 'px)';
        if (walkTime >= walkingDuration) {
          finished = true;
          stage.dataset.animationPhase = 'finished';
          ctx.clearRect(0, 0, 1000, 1000);
        }
      }
      setMoving(true);
    };
    const tick = (now: number) => {
      raf = 0;
      if (disposed || preference.matches || !inView || document.hidden || finished) return;
      elapsed += now - last;
      last = now;
      draw();
      if (!finished) raf = requestAnimationFrame(tick);
    };
    const syncPlayback = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (disposed || !loaded || preference.matches || !inView || document.hidden || finished) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const onPreference = () => {
      if (preference.matches) {
        elapsed = 0;
        finished = true;
        setMoving(false);
        ctx.clearRect(0, 0, 1000, 1000);
        canvas.style.transform = '';
      }
      syncPlayback();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.65 });
    observer.observe(stage);
    preference.addEventListener('change', onPreference);
    document.addEventListener('visibilitychange', syncPlayback);

    Promise.all([
      loadImage('/images/kayla-close-sprites-v3.png'),
      loadImage('/images/kayla-rise-sprites-v2.png'),
      loadImage('/images/kayla-walk-sprites-v2.png'),
      loadImage('/images/kayla-close-corrections-v4.png'),
      loadImage('/images/kayla-lid-corrections-v5.png'),
    ]).then(([closeSheet, riseSheet, walkSheet, correctionSheet, lidSheet]) => {
      if (disposed) return;
      closingSheet = closeSheet;
      closingCorrections = correctionSheet;
      lidCorrections = lidSheet;
      rising = measurePoses(riseSheet, riseRegions, riseHeadHeights);
      const walkW = Math.floor(walkSheet.width / 4), walkH = Math.floor(walkSheet.height / 3);
      const walkRegions: Region[] = Array.from({ length: 12 }, (_, i) =>
        [i % 4 * walkW, Math.floor(i / 4) * walkH, walkW, walkH]);
      walking = measurePoses(walkSheet, walkRegions, Array(12).fill(70));
      // The final upright drawing was smaller than both the preceding rise
      // pose and the enlarged walk. Match its crown-to-floor height exactly
      // to the first walk pose while retaining the shared ground baseline.
      const upright = rising[rising.length - 1];
      standingExitSize = (walking[0].box[3] / walking[0].headHeight * walkingSize)
        / (upright.box[3] / upright.headHeight);
      loaded = true;
      syncPlayback();
    }).catch(() => { /* Retain the original if an animation asset cannot load. */ });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      preference.removeEventListener('change', onPreference);
      document.removeEventListener('visibilitychange', syncPlayback);
    };
  }, []);

  return (
    <div className="hero-figure hero-character" ref={stageRef} role="img"
      data-animation-phase="waiting"
      aria-label="Illustration of Kayla working on a laptop, then getting up and walking away">
      <div className={'hero-character-still' + (moving ? ' is-hidden' : '')} aria-hidden="true" />
      <canvas ref={canvasRef} width={1000} height={1000}
        className={'hero-character-frames' + (moving ? ' is-visible' : '')} aria-hidden="true" />
    </div>
  );
}
