'use client';

import { useLayoutEffect, useRef } from 'react';

const ARRIVAL_KEY = 'kayla-case-study-arrival';
let pendingArrival: { slug: string; created: number } | null =
  null;

export function prepareCaseStudyArrival(slug: string) {
  pendingArrival = { slug, created: performance.now() };
  try {
    window.sessionStorage.setItem(ARRIVAL_KEY, JSON.stringify(pendingArrival));
  } catch {
    // The in-memory handoff still works without browser storage.
  }
}

// Only vinyl playback requests this scroll reset. Direct links and browser
// back/forward navigation keep their normal scroll behavior.
export function CaseStudyArrival({ slug }: { slug: string }) {
  const arrivalRef = useRef(pendingArrival);
  useLayoutEffect(() => {
    let arrival = pendingArrival ?? arrivalRef.current;
    try {
      const stored = window.sessionStorage.getItem(ARRIVAL_KEY);
      window.sessionStorage.removeItem(ARRIVAL_KEY);
      if (!arrival && stored) arrival = JSON.parse(stored);
    } catch {
      // Ignore unavailable storage or a stale malformed handoff.
    }
    arrivalRef.current = arrival;
    pendingArrival = null;
    if (
      !arrival ||
      arrival.slug !== slug ||
      performance.now() - arrival.created > 10000
    )
      return;
    // Reset before paint: never show the room's scroll position on the project.
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  return null;
}
