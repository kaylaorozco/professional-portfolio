import Image from 'next/image';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { tools } from '@/lib/toolkit';
import styles from './laptop-art.module.css';

// Both surfaces share the top edge as their hinge. The same lid and stickers
// stay mounted from the room pose through the close-up and open screen.
export function LaptopArt({
  stage,
  invited,
  onActivate,
  onClose,
  triggerRef,
}: {
  stage: 'resting' | 'stickers' | 'open';
  invited: boolean;
  onActivate: () => void;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (stage === 'open') closeRef.current?.focus({ preventScroll: true });
    else if (wasOpen.current)
      triggerRef.current?.focus({ preventScroll: true });
    wasOpen.current = stage === 'open';
  }, [stage, triggerRef]);
  return (
    <span className={styles.stage} data-stage={stage} data-invited={invited}>
      <span className={styles.body}>
        <button
          ref={triggerRef}
          type="button"
          className={styles.activate}
          tabIndex={stage === 'open' ? -1 : 0}
          aria-hidden={stage === 'open'}
          aria-expanded={stage === 'stickers'}
          aria-label={
            stage === 'stickers'
              ? 'Turn the laptop around and look inside'
              : 'Bring the laptop forward to inspect its stickers'
          }
          onClick={(event) => {
            // A double-click is one request, not a shortcut past the sticker view.
            if (event.detail > 1) return;
            onActivate();
          }}
        />
        <span className={styles.deck} aria-hidden="true">
          <span className={styles.keys}>
            {Array.from({ length: 48 }, (_, i) => (
              <i key={i} />
            ))}
          </span>
          <span className={styles.trackpad} />
        </span>
        <span className={styles.lid}>
          <span className={styles.outside}>
            <span className={`${styles.logo} ${styles.lowes}`}>
              <Image
                src="/experience-logos/lowes.png"
                alt=""
                fill
                style={{ objectFit: 'contain' }}
                unoptimized
              />
            </span>
            <span className={`${styles.logo} ${styles.nice}`}>
              <Image
                src="/experience-logos/nice.svg"
                alt=""
                fill
                style={{ objectFit: 'contain' }}
                unoptimized
              />
            </span>
            <span className={`${styles.logo} ${styles.allstate}`}>
              <Image
                src="/experience-logos/allstate.png"
                alt=""
                fill
                style={{ objectFit: 'contain' }}
                unoptimized
              />
            </span>
            <span className={`${styles.logo} ${styles.smartaction}`}>
              <Image
                src="/experience-logos/smartaction.png"
                alt=""
                fill
                style={{ objectFit: 'contain' }}
                unoptimized
              />
            </span>
            <Image
              className={`${styles.personal} ${styles.paws}`}
              src="/images/stickers/fur-babies.png"
              alt=""
              width={1254}
              height={1254}
              unoptimized
            />
            <Image
              className={`${styles.personal} ${styles.motorcycle}`}
              src="/images/stickers/motorcycle-sage.png"
              alt=""
              width={1254}
              height={1254}
              unoptimized
            />
            <Image
              className={`${styles.personal} ${styles.texas}`}
              src="/images/stickers/texas-brownsville.png"
              alt=""
              width={1254}
              height={1254}
              unoptimized
            />
          </span>
          <span
            className={styles.inside}
            inert={stage !== 'open'}
            aria-hidden={stage !== 'open'}
          >
            <span className={styles.screen}>
              <LaptopScreen
                key={stage === 'open' ? 'open' : 'closed'}
                closeRef={closeRef}
                onClose={onClose}
              />
            </span>
          </span>
        </span>
      </span>
    </span>
  );
}

function LaptopScreen({
  closeRef,
  onClose,
}: {
  closeRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) {
  const [view, setView] = useState<'notes' | 'toolkit'>('toolkit');

  return (
    <>
      <span className={styles.menubar}>
        <span className={styles.screenTabs} aria-label="Laptop sections">
          <button
            type="button"
            className={styles.screenTab}
            aria-pressed={view === 'toolkit'}
            onClick={() => setView('toolkit')}
          >
            Toolkit
          </button>
          <button
            type="button"
            className={styles.screenTab}
            aria-pressed={view === 'notes'}
            onClick={() => setView('notes')}
          >
            Notes
          </button>
        </span>
        <button
          ref={closeRef}
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close laptop and return it to the stand"
        >
          ×
        </button>
      </span>
      {view === 'notes' ? <AboutNotes /> : <LaptopDock />}
    </>
  );
}

function AboutNotes() {
  return (
    <span className={styles.notes}>
      <span className={styles.notesLabel}>About me</span>
      <strong className={styles.notesTitle}>The human in the loop.</strong>
      <span className={styles.notesParagraph}>
        I&apos;m a Texas-based conversational designer and design engineer with
        5+ years creating AI experiences across chat, voice, and mobile. I turn
        complex business needs into natural interactions people can trust,
        connecting language, product strategy, and system logic. I&apos;ve led
        enterprise transformations and now build mobile products through my
        personal studio, staying hands-on from concept through implementation.
      </span>
    </span>
  );
}

function LaptopDock() {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const tool = selected === null ? null : tools[selected];
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const backRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (selected !== null && window.matchMedia('(max-width: 700px)').matches) {
      backRef.current?.focus({ preventScroll: true });
    }
  }, [selected]);
  return (
    <span className={styles.toolkit} data-selected={selected !== null}>
      <span className={styles.detail} aria-live="polite" aria-atomic="true">
        <button
          ref={backRef}
          type="button"
          className={styles.back}
          onClick={() => {
            const previous = selected;
            setSelected(null);
            setHovered(null);
            requestAnimationFrame(() => {
              if (previous !== null)
                buttons.current[previous]?.focus({ preventScroll: true });
            });
          }}
        >
          ← All apps
        </button>
        <span className={styles.category}>
          {tool?.category ?? 'Design · Conversations · Code'}
        </span>
        <strong>{tool?.name ?? 'A peek inside my toolkit.'}</strong>
        <span>
          {tool?.description ?? 'Pick an app below to explore my toolkit.'}
        </span>
      </span>
      <span className={styles.dockViewport}>
        <span className={styles.dock} role="toolbar" aria-label="Tools I use">
          {tools.map((item, index) => (
            <button
              key={item.name}
              ref={(node) => {
                buttons.current[index] = node;
              }}
              type="button"
              className={styles.app}
              aria-label={item.name}
              data-tool={item.name}
              aria-pressed={selected === index}
              data-hovered={hovered === index}
              data-neighbor={
                hovered !== null && Math.abs(hovered - index) === 1
              }
              onClick={() => setSelected(index)}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') setHovered(index);
              }}
              onPointerLeave={() => setHovered(null)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
              onKeyDown={(event) => {
                if (
                  ![
                    'ArrowLeft',
                    'ArrowRight',
                    'ArrowUp',
                    'ArrowDown',
                    'Home',
                    'End',
                  ].includes(event.key)
                )
                  return;
                event.preventDefault();
                event.stopPropagation();
                const next =
                  event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? tools.length - 1
                      : (index +
                          (event.key === 'ArrowDown'
                            ? 4
                            : event.key === 'ArrowUp'
                              ? -4
                              : event.key === 'ArrowRight'
                                ? 1
                                : -1) +
                          tools.length) %
                        tools.length;
                buttons.current[next]?.focus({ preventScroll: true });
                buttons.current[next]?.scrollIntoView({
                  block: 'nearest',
                  inline: 'nearest',
                });
              }}
            >
              <span className={styles.appLabel} aria-hidden="true">
                {item.name}
              </span>
              <span className={styles.tile}>
                <Image
                  src={`/tool-logos/${item.logo}`}
                  className={
                    item.logo === 'openai.png' ? styles.roundedIcon : undefined
                  }
                  alt=""
                  width={64}
                  height={64}
                  unoptimized
                  style={{ objectFit: 'contain' }}
                />
              </span>
              <span className={styles.dot} aria-hidden="true" />
            </button>
          ))}
        </span>
      </span>
    </span>
  );
}
