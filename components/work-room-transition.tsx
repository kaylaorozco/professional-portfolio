'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from 'react';

const ARRIVAL_KEY = 'kayla-work-room-arrival';
const EXIT_DURATION = 820;
const RETURN_KEY = 'kayla-room-return-arrival';

export function BackNavigationLink({
  href,
  children,
  className,
  'aria-label': ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const timerRef = useRef<number | null>(null);
  const leavingRef = useRef(false);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    if (leavingRef.current) delete document.documentElement.dataset.workRoomTransition;
  }, []);

  function goBack(event: MouseEvent<HTMLAnchorElement>) {
    const destination = href.split('#')[0] || '/';
    if (
      destination === pathname || event.defaultPrevented || event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;

    event.preventDefault();
    if (leavingRef.current) return;
    leavingRef.current = true;
    event.currentTarget.setAttribute('aria-disabled', 'true');
    document.documentElement.dataset.workRoomTransition = 'returning';
    try {
      window.sessionStorage.setItem(RETURN_KEY, destination);
    } catch {
      // The exit and navigation still work without session storage.
    }
    timerRef.current = window.setTimeout(() => router.push(href), EXIT_DURATION);
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel} prefetch={false} onClick={goBack}>
      {children}
    </Link>
  );
}

// Lives above the routes so both Home and Work can receive a backward arrival.
export function BackNavigationArrival() {
  const pathname = usePathname();
  useLayoutEffect(() => {
    let destination: string | null = null;
    try {
      destination = window.sessionStorage.getItem(RETURN_KEY);
      window.sessionStorage.removeItem(RETURN_KEY);
    } catch {
      return;
    }
    if (destination !== pathname) return;
    const root = document.documentElement;
    delete root.dataset.workRoomTransition;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root.dataset.roomReturnArrival = 'entering';
    let secondFrame = 0;
    let settleTimer = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        root.dataset.roomReturnArrival = 'settled';
        settleTimer = window.setTimeout(() => {
          delete root.dataset.roomReturnArrival;
        }, 650);
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      window.clearTimeout(settleTimer);
      delete root.dataset.roomReturnArrival;
    };
  }, [pathname]);
  return null;
}

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
