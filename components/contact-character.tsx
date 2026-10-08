'use client';
import { useEffect, useRef } from 'react';
import { useMusicTime } from './site-sound';
const W = 1056,
  H = 976,
  cropX = 240,
  cropY = 20,
  duration = 6000;
const ease = (t: number) => {
  const u = Math.max(0, Math.min(1, t));
  return u * u * (3 - 2 * u);
};
export function ContactCharacter() {
  const getMusicTime = useMusicTime();
  const stageRef = useRef<HTMLDivElement>(null),
    canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const stage = stageRef.current,
      canvas = canvasRef.current,
      ctx = canvas?.getContext('2d');
    if (!stage || !canvas || !ctx) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const requested =
      process.env.NODE_ENV === 'development'
        ? new URLSearchParams(window.location.search).get('contact-preview-ms')
        : null;
    const preview =
      requested !== null && Number.isFinite(Number(requested))
        ? Math.max(0, Number(requested)) % duration
        : null;
    const original = new Image(),
      clean = new Image();
    let ready = false,
      visible = false,
      disposed = false,
      raf = 0,
      previous = 0,
      elapsed = 0;
    const ink = '#2b1828';
    function path(d: string, fill: string | CanvasGradient, width = 3) {
      ctx!.fillStyle = fill;
      ctx!.strokeStyle = ink;
      ctx!.lineWidth = width;
      ctx!.lineJoin = 'round';
      ctx!.lineCap = 'round';
      const p = new Path2D(d);
      ctx!.fill(p);
      ctx!.stroke(p);
    }
    function typingHand(f: number) {
      // Only replace the hand. The original forearm, cuff, and cup remain
      // intact, including their original shared outline and shading.
      ctx!.save();
      ctx!.beginPath();
      ctx!.rect(692, 383, 114, 60);
      ctx!.clip();
      ctx!.drawImage(clean, 0, 0);
      const skin = ctx!.createLinearGradient(748, 0, 802, 0);
      skin.addColorStop(0, '#f9c693');
      skin.addColorStop(1, '#f0b985');
      const index = f * 0.7,
        middle = -f,
        ring = f * 0.6;
      path(
        `M970 357 L955 382
        C916 384 844 396 811 395
        C789 395 768 385 752 385
        L725 391 Q719 392 714 397
        L699 ${414 + index}
        Q694 ${420 + index} 698 ${423 + index}
        Q702 ${426 + index} 708 ${420 + index}
        L721 407
        L705 ${424 + middle}
        Q702 ${429 + middle} 707 ${431 + middle}
        Q712 ${433 + middle} 718 ${427 + middle}
        L734 414
        L721 ${430 + ring}
        Q718 ${434 + ring} 724 ${436 + ring}
        Q729 ${438 + ring} 736 ${432 + ring}
        L748 425
        C763 421 785 435 806 432
        L825 430 C880 431 955 440 992 439
        Q1018 439 1024 407
        Q1016 387 970 357 Z`,
        skin,
        2.7,
      );
      // Short, parallel knuckle lines, with no crossing or duplicate outlines.
      ctx!.strokeStyle = ink;
      ctx!.lineWidth = 2.7;
      ctx!.stroke(
        new Path2D(
          'M721 407 Q725 402 730 401 L749 396 M734 414 Q740 408 758 405',
        ),
      );

      ctx!.restore();
    }
    function toes(amount: number) {
      // Deformation is zero before the heel. Draw the full alpha silhouette;
      // there is no circular mask, moving ankle, or exposed cut edge.
      ctx!.clearRect(440, 835, 195, 132);
      for (let x = 440; x < 635; x++) {
        const weight = ease((550 - x) / 95);
        ctx!.drawImage(
          original,
          x,
          835,
          1,
          132,
          x,
          835 - 6 * amount * weight,
          1.02,
          132,
        );
      }
    }
    function paint(time: number) {
      ctx!.setTransform(1, 0, 0, 1, -cropX, -cropY);
      ctx!.clearRect(cropX, cropY, W, H);
      if (motion.matches) {
        ctx!.drawImage(original, 0, 0);
        return;
      }
      ctx!.drawImage(original, 0, 0);
      if (time % duration >= 30 && time % duration < 150) {
        // A closed eyelid in the eye's own skin palette; it never moves the face.
        ctx!.fillStyle = '#f9c28b';
        ctx!.beginPath();
        ctx!.ellipse(916, 123.5, 6.8, 7.6, 0, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.strokeStyle = ink;
        ctx!.lineWidth = 2;
        ctx!.beginPath();
        ctx!.moveTo(912, 123);
        ctx!.quadraticCurveTo(916, 127, 921, 122.5);
        ctx!.stroke();
      }
      // Slightly quicker custom cadence: 1.10s per tap, previously 1.28s.
      // Follow playback time when music is on; this cadence is not beat-locked.
      const musicTime = preview === null ? getMusicTime() : null;
      const tapClock = musicTime === null ? time : musicTime * 1000 - 430;
      const tapPeriod = 1100;
      const tapPhase = (((tapClock % tapPeriod) + tapPeriod) % tapPeriod) / tapPeriod;
      toes((1 - Math.cos(tapPhase * Math.PI * 2)) / 2);
      stage!.dataset.tapClock = musicTime === null ? 'silent' : 'music';

      // Type for 1.8 seconds, rest for 1.2, then repeat. Ease finger motion
      // into and out of each burst without moving the palm, wrist, or arm.
      const typingTime = time % 3000;
      const typing = typingTime < 1800;
      const envelope = ease(typingTime / 180) * ease((1800 - typingTime) / 180);
      const finger = typing
        ? Math.sin((typingTime / 120) * Math.PI) * 2.1 * envelope
        : 0;
      typingHand(finger);
      stage!.dataset.phase = typing ? 'typing' : 'pause';
      stage!.dataset.frame = String(Math.floor(time / (1000 / 60)));
    }
    const active = () =>
      ready &&
      visible &&
      !motion.matches &&
      !document.hidden &&
      !disposed &&
      preview === null;
    const tick = (now: number) => {
      raf = 0;
      if (!active()) return;
      elapsed += Math.min(now - previous, 80);
      previous = now;
      paint(elapsed);
      raf = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (motion.matches) elapsed = 0;
      if (ready) paint(preview ?? elapsed);
      stage.dataset.ready = String(ready && !motion.matches);
      if (active()) {
        previous = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.2 },
    );
    observer.observe(stage);
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    const prepare = () => {
      if (
        disposed ||
        ready ||
        !original.complete ||
        !original.naturalWidth ||
        !clean.complete ||
        !clean.naturalWidth
      )
        return;
      ready = true;
      sync();
    };
    original.onload = prepare;
    clean.onload = prepare;
    original.src = '/images/kayla-contact-base-v1.png';
    clean.src = '/images/kayla-contact-clean-v3.png';
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [getMusicTime]);
  return (
    <div
      className="contact-character"
      ref={stageRef}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="img"
      aria-label="Kayla at her desk with an orange laptop, a little plant, and coffee"
    >
      <div className="contact-character-still" aria-hidden="true" />
      <canvas ref={canvasRef} width={W} height={H} aria-hidden="true" />
    </div>
  );
}
