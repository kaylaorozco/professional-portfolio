'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './listening-room.module.css';

const WIDTH = 1024;
const HEIGHT = 1536;
const EYE_X = 393;
const EYE_Y = 160;
const BLINK_INTERVALS = [3200, 4100, 3600];
const BLINK_DURATION = 240;
const ease = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

export function KaylaCharacter({ paused }: { paused: boolean }) {
  const characterRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const character = characterRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!character || !canvas || !context) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const artwork = new window.Image();
    let ready = false;
    let visible = false;
    let disposed = false;
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    let blinkIndex = 0;
    let lastAmount = -1;

    function paint(amount: number) {
      if (!ready || Math.abs(amount - lastAmount) < 0.0005) return;
      lastAmount = amount;
      context!.clearRect(0, 0, WIDTH, HEIGHT);
      context!.drawImage(artwork, 0, 0, WIDTH, HEIGHT);
      if (amount === 0) return;

      const skin = context!.createLinearGradient(
        EYE_X,
        EYE_Y - 14,
        EYE_X,
        EYE_Y + 14,
      );
      skin.addColorStop(0, '#f7bf89');
      skin.addColorStop(1, '#f8c28f');
      context!.fillStyle = skin;
      context!.beginPath();
      context!.ellipse(EYE_X, EYE_Y, 12, 13, 0, 0, Math.PI * 2);
      context!.fill();

      // Preserve the original eye color and shape, compressing the source
      // artwork into a small closed lid just like the former seated character.
      const eyeHeight = 22 * (1 - amount) + 2 * amount;
      context!.drawImage(
        artwork,
        EYE_X - 10,
        EYE_Y - 11,
        20,
        22,
        EYE_X - 10,
        EYE_Y - eyeHeight / 2,
        20,
        eyeHeight,
      );
    }

    const active = () =>
      ready && visible && !motion.matches && !document.hidden && !disposed;

    function tick(now: number) {
      frame = 0;
      if (!active()) return;
      const delta = Math.min(64, Math.max(0, now - previous));
      previous = now;
      elapsed = pausedRef.current ? 0 : elapsed + delta;
      const blinkTime = elapsed - BLINK_INTERVALS[blinkIndex];
      let amount = 0;
      if (blinkTime >= BLINK_DURATION) {
        elapsed = 0;
        blinkIndex = (blinkIndex + 1) % BLINK_INTERVALS.length;
      } else if (blinkTime >= 0) {
        amount =
          blinkTime < 80
            ? ease(blinkTime / 80)
            : 1 - ease((blinkTime - 120) / 120);
      }
      paint(amount);
      character!.dataset.motion = amount > 0 ? 'blink' : 'still';
      frame = requestAnimationFrame(tick);
    }

    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      elapsed = 0;
      lastAmount = -1;
      character!.dataset.ready = String(ready);
      character!.dataset.motion = 'still';
      if (ready) paint(0);
      if (active()) {
        previous = performance.now();
        frame = requestAnimationFrame(tick);
      }
    }

    artwork.onload = () => {
      if (disposed) return;
      ready = true;
      sync();
    };
    artwork.onerror = () => {
      ready = false;
      sync();
    };
    artwork.src = '/images/kayla-work-standing-v6.png';

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    );
    observer.observe(character);
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      artwork.onload = null;
      artwork.onerror = null;
    };
  }, []);

  return (
    <div ref={characterRef} className={styles.standingCharacter} aria-hidden="true">
      <Image
        className={styles.standingCharacterPoster}
        src="/images/kayla-work-standing-v6.png"
        alt=""
        width={WIDTH}
        height={HEIGHT}
        unoptimized
        priority
      />
      <canvas
        className={styles.standingCharacterCanvas}
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
      />
    </div>
  );
}
