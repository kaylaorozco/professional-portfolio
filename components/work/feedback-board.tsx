'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { testimonials } from '@/lib/testimonials';
import styles from './feedback-board.module.css';

const wallNotes = [
  { index: 1, excerpt: 'she builds intelligent systems.' },
  { index: 2, excerpt: 'thinks beyond the obvious' },
  { index: 0, excerpt: 'an exceptional strategic partner' },
  { index: 7, excerpt: 'she’s excited to learn.' },
];

export function FeedbackBoard() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [selected, setSelected] = useState(1);
  const [origin, setOrigin] = useState<CSSProperties>({});
  const boardRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const quoteRef = useRef<HTMLElement>(null);
  const note = testimonials[selected];

  useEffect(() => {
    quoteRef.current?.scrollTo({ top: 0 });
  }, [selected, open]);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      dialog.close();
    };
  }, [open]);

  function browse(direction: number) {
    setSelected(
      (current) =>
        (current + direction + testimonials.length) % testimonials.length,
    );
    quoteRef.current?.scrollTo({ top: 0 });
  }

  function finishClose() {
    setOpen(false);
    setClosing(false);
    requestAnimationFrame(() =>
      boardRef.current?.focus({ preventScroll: true }),
    );
  }

  function close() {
    if (closing) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishClose();
      return;
    }
    const board = boardRef.current;
    const dialog = dialogRef.current;
    if (!board || !dialog) {
      finishClose();
      return;
    }
    // Measure again at close in case the viewport changed while reading.
    const wall = board.getBoundingClientRect();
    const panel = dialog.getBoundingClientRect();
    setOrigin({
      '--board-x': `${wall.left + wall.width / 2 - panel.left - panel.width / 2}px`,
      '--board-y': `${wall.top + wall.height / 2 - panel.top - panel.height / 2}px`,
      '--board-scale-x': board.offsetWidth / panel.width,
      '--board-scale-y': board.offsetHeight / panel.height,
    } as CSSProperties);
    setClosing(true);
  }

  return (
    <>
      <button
        ref={boardRef}
        className={styles.wallBoard}
        type="button"
        aria-label="Read feedback from collaborators"
        aria-haspopup="dialog"
        aria-expanded={open}
        data-open={open}
        data-closing={closing}
        onClick={(event) => {
          const target =
            event.target instanceof Element
              ? event.target.closest('[data-note-index]')
              : null;
          setSelected(
            target ? Number(target.getAttribute('data-note-index')) : 1,
          );
          const rect = event.currentTarget.getBoundingClientRect();
          setOrigin({
            '--board-x': `${rect.left + rect.width / 2 - window.innerWidth / 2}px`,
            '--board-y': `${rect.top + rect.height / 2 - window.innerHeight / 2}px`,
            '--board-scale':
              rect.width / Math.min(window.innerWidth * 0.92, 640),
          } as CSSProperties);
          setClosing(false);
          setOpen(true);
        }}
      >
        <span className={styles.surface}>
          <Image
            className={styles.boardArt}
            src="/images/feedback-corkboard-v2.png"
            alt=""
            width={1327}
            height={1185}
            unoptimized
          />
          <span className={styles.papers} aria-hidden="true">
            {wallNotes.map(({ index, excerpt }) => (
              <span
                className={styles.paper}
                data-note-index={index}
                key={index}
              >
                <span>{excerpt}</span>
                <small>— {testimonials[index].name.split(' ')[0]}</small>
              </span>
            ))}
          </span>
        </span>
      </button>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        style={origin}
        aria-labelledby="feedback-board-title"
        data-closing={closing}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            close();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            close();
          }
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            event.stopPropagation();
            browse(event.key === 'ArrowRight' ? 1 : -1);
          }
        }}
      >
        <div
          className={styles.panel}
          onAnimationEnd={(event) => {
            if (closing && event.target === event.currentTarget) finishClose();
          }}
        >
          <header className={styles.header}>
            <div>
              <p>Notes from collaborators</p>
              <h2 id="feedback-board-title">A few kind words.</h2>
            </div>
            <button
              type="button"
              className={styles.close}
              aria-label="Close feedback board"
              onClick={close}
            >
              ×
            </button>
          </header>
          <figure
            ref={quoteRef}
            className={styles.note}
            aria-live="polite"
            aria-atomic="true"
          >
            <blockquote>“{note.quote}”</blockquote>
            <figcaption>
              <strong>{note.name}</strong>
              <span>{note.context}</span>
            </figcaption>
          </figure>
          <nav
            className={styles.navigation}
            aria-label="Browse collaborator feedback"
          >
            <button
              type="button"
              aria-label="Previous feedback note"
              onClick={() => browse(-1)}
            >
              ← <span>Previous</span>
            </button>
            <span>
              {String(selected + 1).padStart(2, '0')} /{' '}
              {String(testimonials.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              aria-label="Next feedback note"
              onClick={() => browse(1)}
            >
              <span>Next</span> →
            </button>
          </nav>
        </div>
      </dialog>
    </>
  );
}
