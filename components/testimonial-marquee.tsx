'use client';

import { useEffect, useRef, useState } from 'react';

/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The overflow region must be focusable for keyboard scrolling. */

type Testimonial = {
  quote: string;
  name: string;
  context: string;
};

export function TestimonialMarquee({ testimonials }: { testimonials: Testimonial[] }) {
  const marqueeRef = useRef<HTMLElement>(null);
  const dragStartRef = useRef({ pointerX: 0, scrollLeft: 0 });
  const repositioningRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;
    const sequence = marquee.querySelector<HTMLElement>('.testimonial-sequence');
    if (!sequence) return;

    const centerLoop = () => {
      if (sequence.offsetWidth) marquee.scrollLeft = sequence.offsetWidth;
    };

    const keepScrollLooped = () => {
      const sequenceWidth = sequence.offsetWidth;
      if (!sequenceWidth || repositioningRef.current) return;

      let adjustment = 0;
      if (marquee.scrollLeft < sequenceWidth * 0.5) adjustment = sequenceWidth;
      if (marquee.scrollLeft > sequenceWidth * 1.5) adjustment = -sequenceWidth;
      if (!adjustment) return;

      repositioningRef.current = true;
      marquee.scrollLeft += adjustment;
      dragStartRef.current.scrollLeft += adjustment;
      requestAnimationFrame(() => {
        repositioningRef.current = false;
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      marquee.scrollBy({
        behavior: 'smooth',
        left: event.key === 'ArrowRight' ? 360 : -360,
      });
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      dragStartRef.current = { pointerX: event.clientX, scrollLeft: marquee.scrollLeft };
      marquee.setPointerCapture(event.pointerId);
      setIsDragging(true);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!marquee.hasPointerCapture(event.pointerId)) return;
      marquee.scrollLeft = dragStartRef.current.scrollLeft - (event.clientX - dragStartRef.current.pointerX);
    };

    const finishDrag = (event: PointerEvent) => {
      if (marquee.hasPointerCapture(event.pointerId)) marquee.releasePointerCapture(event.pointerId);
      setIsDragging(false);
    };

    marquee.addEventListener('keydown', handleKeyDown);
    marquee.addEventListener('pointerdown', handlePointerDown);
    marquee.addEventListener('pointermove', handlePointerMove);
    marquee.addEventListener('pointerup', finishDrag);
    marquee.addEventListener('pointercancel', finishDrag);
    marquee.addEventListener('scroll', keepScrollLooped);

    centerLoop();
    const resizeObserver = new ResizeObserver(centerLoop);
    resizeObserver.observe(marquee);
    resizeObserver.observe(sequence);

    return () => {
      resizeObserver.disconnect();
      marquee.removeEventListener('keydown', handleKeyDown);
      marquee.removeEventListener('pointerdown', handlePointerDown);
      marquee.removeEventListener('pointermove', handlePointerMove);
      marquee.removeEventListener('pointerup', finishDrag);
      marquee.removeEventListener('pointercancel', finishDrag);
      marquee.removeEventListener('scroll', keepScrollLooped);
    };
  }, []);

  return (
    <section
      className={`testimonial-marquee${isDragging ? ' is-dragging' : ''}`}
      ref={marqueeRef}
      aria-label="Recommendations from collaborators. Scroll horizontally to see more."
      tabIndex={0}
    >
      <div className="testimonial-track">
        {[0, 1, 2].map((sequenceIndex) => (
          <div className="testimonial-sequence" aria-hidden={sequenceIndex !== 1} key={sequenceIndex}>
            {testimonials.map((item) => (
              <figure key={item.name}>
                <blockquote>“{item.quote}”</blockquote>
                <figcaption><strong>{item.name}</strong><span>{item.context}</span></figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
