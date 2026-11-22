'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function HiSocialWave({ children }: { children: ReactNode }) {
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const links = linksRef.current;
    if (!links) return;

    if (!('IntersectionObserver' in window)) {
      links.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        links.classList.add('is-visible');
        observer.disconnect();
      },
      { threshold: 0.45 },
    );

    observer.observe(links);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={linksRef} className="hi-social-links">
      {children}
    </div>
  );
}
