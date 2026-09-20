'use client';

import { useEffect, useRef, useState } from 'react';

type Region = readonly [number, number, number, number];
type Pose = { image: HTMLImageElement; box: Region; headHeight: number; headAnchor: number };
const riseRegions: Region[] = [
  [0, 0, 510, 420], [530, 0, 395, 420], [970, 0, 340, 420], [1410, 0, 364, 420],
  [100, 425, 320, 450], [575, 425, 270, 450], [1035, 425, 230, 450], [1490, 425, 220, 450],
];
// Crown-to-chin measurements keep scale independent of the pose's height.
const riseHeadHeights = [87, 90, 90, 90, 79, 80, 79, 87];
const delay = 2500;
const closingDuration = 2000;
const standingDuration = 1400;
const walkingDuration = 4400;

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
    const { data } = context.getImageData(x, y, w, h);
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
    return { image, headHeight: headHeights[index], box,
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
    let closing: Pose[] = [], rising: Pose[] = [], walking: Pose[] = [];

    const paintPose = (pose: Pose, scale: number, headPosition: number) => {
      const [x, y, w, h] = pose.box;
      const ratio = 145 * scale / pose.headHeight;
      ctx.globalAlpha = 1;
      ctx.drawImage(pose.image, x, y, w, h, 500 + (headPosition - 500) * scale - pose.headAnchor * ratio,
        1000 - 50 * scale - h * ratio, w * ratio, h * ratio);
      ctx.globalAlpha = 1;
    };
    const paintSequence = (poses: Pose[], time: number, frameDuration: number, scale: number, headPosition: number, loop = false) => {
      const position = time / frameDuration;
      const frame = loop ? Math.floor(position) % poses.length : Math.min(poses.length - 1, Math.floor(position));
      // Draw one solid pose per frame. Overlapping translucent poses caused
      // opacity dips and double outlines; more poses supply the in-between motion.
      paintPose(poses[frame], scale, headPosition);
    };
    const draw = () => {
      if (elapsed < delay) return;
      const t = elapsed - delay;
      const scale = parseFloat(getComputedStyle(stage).getPropertyValue('--character-scale')) || 1;
      ctx.clearRect(0, 0, 1000, 1000);
      if (t < closingDuration) {
        stage.dataset.animationPhase = 'closing';
        paintSequence(closing, t, closingDuration / closing.length, scale, 215);
      } else if (t < closingDuration + standingDuration) {
        stage.dataset.animationPhase = 'standing';
        const riseTime = t - closingDuration;
        const progress = Math.min(1, riseTime / (standingDuration - standingDuration / rising.length));
        const headPosition = 215 + 285 * (progress * progress * (3 - 2 * progress));
        paintSequence(rising, riseTime, standingDuration / rising.length, scale, headPosition);
      } else {
        stage.dataset.animationPhase = 'walking';
        const walkTime = t - closingDuration - standingDuration;
        paintSequence(walking, walkTime, 90, scale, 500, true);
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
      loadImage('/images/kayla-close-sprites-v1.png'),
      loadImage('/images/kayla-rise-sprites-v2.png'),
      loadImage('/images/kayla-walk-sprites-v2.png'),
      loadImage('/images/kayla-hero-v2.png'),
    ]).then(([closeSheet, riseSheet, walkSheet]) => {
      if (disposed) return;
      const w = Math.floor(closeSheet.width / 3), h = Math.floor(closeSheet.height / 2);
      const closeRegions: Region[] = Array.from({ length: 6 }, (_, i) =>
        [i % 3 * w, Math.floor(i / 3) * h, w, h]);
      closing = measurePoses(closeSheet, closeRegions, [112, 112, 112, 112, 112, 112]);
      rising = measurePoses(riseSheet, riseRegions, riseHeadHeights);
      const walkW = Math.floor(walkSheet.width / 4), walkH = Math.floor(walkSheet.height / 3);
      const walkRegions: Region[] = Array.from({ length: 12 }, (_, i) =>
        [i % 4 * walkW, Math.floor(i / 4) * walkH, walkW, walkH]);
      walking = measurePoses(walkSheet, walkRegions, Array(12).fill(70));
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
      <img className={'hero-character-still' + (moving ? ' is-hidden' : '')}
        src="/images/kayla-hero-v2.png" alt="" />
      <canvas ref={canvasRef} width={1000} height={1000}
        className={'hero-character-frames' + (moving ? ' is-visible' : '')} aria-hidden="true" />
    </div>
  );
}
