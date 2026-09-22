'use client';

import { useCallback, useEffect, useRef } from 'react';

type Testimonial = {
  quote: string;
  name: string;
  context: string;
};

export function TestimonialMarquee({ testimonials }: { testimonials: Testimonial[] }) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const repositioningRef = useRef(false);

  const keepScrollLooped = useCallback(() => {
    const marquee = marqueeRef.current;
    const sequence = marquee?.querySelector<HTMLElement>('.testimonial-sequence');

    if (!marquee || !sequence || repositioningRef.current) return;

    const sequenceWidth = sequence.offsetWidth;
    if (!sequenceWidth) return;

    if (marquee.scrollLeft < sequenceWidth * 0.5) {
      repositioningRef.current = true;
      marquee.scrollLeft += sequenceWidth;
    } else if (marquee.scrollLeft > sequenceWidth * 1.5) {
      repositioningRef.current = true;
      marquee.scrollLeft -= sequenceWidth;
    } else {
      return;
    }

    requestAnimationFrame(() => {
      repositioningRef.current = false;
    });
  }, []);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const touchQuery = window.matchMedia('(hover: none), (pointer: coarse)');

    const centerTouchTrack = () => {
      if (!touchQuery.matches) return;
      const sequence = marquee.querySelector<HTMLElement>('.testimonial-sequence');
      if (sequence) marquee.scrollLeft = sequence.offsetWidth;
    };

    centerTouchTrack();
    const resizeObserver = new ResizeObserver(centerTouchTrack);
    resizeObserver.observe(marquee);
    touchQuery.addEventListener('change', centerTouchTrack);

    return () => {
      resizeObserver.disconnect();
      touchQuery.removeEventListener('change', centerTouchTrack);
    };
  }, []);

  return (
    <div
      className="testimonial-marquee"
      ref={marqueeRef}
      role="region"
      aria-label="Recommendations from collaborators"
      tabIndex={0}
      onScroll={keepScrollLooped}
    >
      <div className="testimonial-track">
        {[0, 1, 2].map((sequence) => (
          <div className="testimonial-sequence" aria-hidden={sequence !== 0} key={sequence}>
            {testimonials.map((item) => (
              <figure key={item.name}>
                <blockquote>“{item.quote}”</blockquote>
                <figcaption><strong>{item.name}</strong><span>{item.context}</span></figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
