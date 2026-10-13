'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from 'react';

const ARRIVAL_KEY = 'kayla-work-room-arrival';
const EXIT_DURATION = 820;

export function WorkRoomLink() {
  const router = useRouter();
  const timerRef = useRef<number | null>(null);
  const leavingRef = useRef(false);

  useEffect(() => {
    router.prefetch('/work');
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      delete document.documentElement.dataset.workRoomTransition;
    };
  }, [router]);

  function enterWorkRoom(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;

    event.preventDefault();
    if (leavingRef.current) return;
    leavingRef.current = true;
    event.currentTarget.setAttribute('aria-disabled', 'true');
    document.documentElement.dataset.workRoomTransition = 'leaving';
    try {
      window.sessionStorage.setItem(ARRIVAL_KEY, 'true');
    } catch {
      // Navigation still works when browser storage is unavailable.
    }
    timerRef.current = window.setTimeout(() => {
      router.push('/work');
    }, EXIT_DURATION);
  }

  return (
    <Link className="button button-primary work-room-cta" href="/work" onClick={enterWorkRoom}>
      Enter the work room
      <span aria-hidden="true">&#8594;</span>
    </Link>
  );
}

export function WorkRoomArrival({ children }: { children: ReactNode }) {
  const shellRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let arriving = false;
    try {
      arriving = window.sessionStorage.getItem(ARRIVAL_KEY) === 'true';
      window.sessionStorage.removeItem(ARRIVAL_KEY);
    } catch {
      // Render normally when browser storage is unavailable.
    }
    if (
      !arriving ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !shellRef.current
    )
      return;

    const shell = shellRef.current;
    shell.dataset.arrival = 'entering';
    let secondFrame = 0;
    let settleTimer = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        shell.dataset.arrival = 'settled';
        settleTimer = window.setTimeout(() => {
          delete shell.dataset.arrival;
        }, 650);
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      window.clearTimeout(settleTimer);
    };
  }, []);

  return (
    <div className="work-room-arrival" ref={shellRef}>
      {children}
    </div>
  );
}
