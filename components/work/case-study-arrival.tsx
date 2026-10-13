'use client';

import { useLayoutEffect, useRef } from 'react';

let pendingArrival: { slug: string; top: number; created: number } | null =
  null;

export function prepareCaseStudyArrival(slug: string) {
  pendingArrival = { slug, top: window.scrollY, created: performance.now() };
}

// Only vinyl playback requests this transition. Direct links and browser
// back/forward navigation keep their normal scroll behavior.
export function CaseStudyArrival({ slug }: { slug: string }) {
  const arrivalRef = useRef(pendingArrival);
  useLayoutEffect(() => {
    const arrival = pendingArrival ?? arrivalRef.current;
    arrivalRef.current = arrival;
    pendingArrival = null;
    if (
      !arrival ||
      arrival.slug !== slug ||
      performance.now() - arrival.created > 10000
    )
      return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    const start = Math.min(
      arrival.top,
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
    );
    window.scrollTo({ top: start, behavior: 'instant' });
    const started = performance.now();
    let frame = 0;
    let cancelled = false;
    function cancel() {
      cancelled = true;
      cancelAnimationFrame(frame);
    }
    function settle(now: number) {
      if (cancelled) return;
      const progress = Math.min(1, (now - started) / 1400);
      const eased = progress ** 3 * (progress * (progress * 6 - 15) + 10);
      window.scrollTo({ top: start * (1 - eased), behavior: 'instant' });
      if (progress < 1) frame = requestAnimationFrame(settle);
    }
    frame = requestAnimationFrame(settle);
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    window.addEventListener('pointerdown', cancel, { passive: true });
    window.addEventListener('keydown', cancel);
    return () => {
      cancel();
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('pointerdown', cancel);
      window.removeEventListener('keydown', cancel);
    };
  }, [slug]);

  return null;
}
