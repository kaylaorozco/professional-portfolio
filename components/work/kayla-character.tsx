'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './listening-room.module.css';

const WIDTH = 1024;
const HEIGHT = 1536;
const BLINK_INTERVALS = [5400, 6800, 6100];
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
    const mobile = window.matchMedia('(max-width: 700px)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const artwork = new window.Image();
    const hand = new window.Image();
    const handLayer = document.createElement('canvas');
    handLayer.width = WIDTH;
    handLayer.height = HEIGHT;
    const handContext = handLayer.getContext('2d');
    if (!handContext) return;
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
      // The prepared layer fades through the palm interior, keeping the
      // original outer wrist contour without a hard rectangular color seam.
      context!.save();
      context!.globalCompositeOperation = 'source-atop';
      context!.drawImage(handLayer, 0, 0);
      context!.restore();
      if (amount === 0) return;

      // Animate only the tiny dot eye, never deforming the head or face.
      const x = mobile.matches ? 383 : 398;
      const y = mobile.matches ? 230 : 179;
      const skin = context!.createLinearGradient(x, y - 14, x, y + 14);
      skin.addColorStop(0, mobile.matches ? '#fecd91' : '#fecf99');
      skin.addColorStop(1, mobile.matches ? '#fecd91' : '#fecd95');
      context!.fillStyle = skin;
      context!.beginPath();
      context!.ellipse(x, y, 12, 13, 0, 0, Math.PI * 2);
      context!.fill();
      // Compress the original eye into a small closed lid, retaining its color
      // and shape instead of redrawing the character's expression.
      const eyeHeight = 22 * (1 - amount) + 2 * amount;
      context!.drawImage(
        artwork,
        x - 10,
        y - 11,
        20,
        22,
        x - 10,
        y - eyeHeight / 2,
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
        // 80ms closing, 40ms closed, 120ms gently reopening.
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
    function loadArtwork() {
      ready = false;
      sync();
      const view = mobile.matches ? 'mobile' : 'desktop';
      artwork.src = `/images/kayla-work-seated-${view}-v1.png`;
      hand.src = `/images/kayla-work-seated-${view}-v2.png`;
    }
    const prepare = () => {
      if (
        disposed ||
        !artwork.complete ||
        !artwork.naturalWidth ||
        !hand.complete ||
        !hand.naturalWidth
      )
        return;
      // Follow the inner palm instead of clipping across its upper outline.
      // Fully replace the fingers, then softly return to the original skin
      // before reaching the wrist. Build once per responsive artwork load.
      const offsetX = mobile.matches ? 10 : 0;
      const offsetY = mobile.matches ? 29 : 0;
      handContext!.clearRect(0, 0, WIDTH, HEIGHT);
      for (let row = 245; row < 410; row++) {
        const left =
          326 + 20 * ease((row - 270) / 30) - Math.max(0, row - 300) * 0.3;
        const fade = ease((row - 245) / 14) * (1 - ease((row - 370) / 40));
        const gradient = handContext!.createLinearGradient(
          left + offsetX,
          0,
          460 + offsetX,
          0,
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(30 / (460 - left), `rgba(0,0,0,${fade})`);
        gradient.addColorStop(0.85, `rgba(0,0,0,${fade})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        handContext!.fillStyle = gradient;
        handContext!.fillRect(left + offsetX, row + offsetY, 460 - left, 1);
      }
      handContext!.globalCompositeOperation = 'source-in';
      handContext!.drawImage(hand, 0, 0, WIDTH, HEIGHT);
      handContext!.globalCompositeOperation = 'source-over';
      ready = true;
      sync();
    };
    artwork.onload = prepare;
    hand.onload = prepare;
    const fail = () => {
      ready = false;
      sync();
    };
    artwork.onerror = fail;
    hand.onerror = fail;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    );
    observer.observe(character);
    mobile.addEventListener('change', loadArtwork);
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    loadArtwork();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      mobile.removeEventListener('change', loadArtwork);
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      artwork.onload = null;
      artwork.onerror = null;
      hand.onload = null;
      hand.onerror = null;
    };
  }, []);

  return (
    <div ref={characterRef} className={styles.character} aria-hidden="true">
      <picture className={styles.characterPoster}>
        <source
          media="(max-width: 700px)"
          srcSet="/images/kayla-work-seated-mobile-v1.png"
        />
        <Image
          src="/images/kayla-work-seated-desktop-v1.png"
          alt=""
          width={1024}
          height={1536}
          unoptimized
          priority
        />
      </picture>
      <canvas
        className={styles.characterCanvas}
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
      />
    </div>
  );
}
