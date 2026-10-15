'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type TouchEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Project } from '@/lib/projects';
import { prepareCaseStudyArrival } from './case-study-arrival';
import { KaylaCharacter } from './kayla-character';
import { LaptopArt } from './laptop-art';
import { FeedbackBoard } from './feedback-board';
import styles from './listening-room.module.css';

const VINYL_DURATION = 3600;
const MOBILE_VINYL_DURATION = 2400;
const MOBILE_CENTER_DURATION = 1600;
type Flight = {
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  scale: number;
  index: number;
  duration: number;
};

export function ListeningRoom({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState(0);
  const [flipped, setFlipped] = useState<number | null>(null);
  const [lifted, setLifted] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [dragged, setDragged] = useState<number | null>(null);
  const [overPlayer, setOverPlayer] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [laptopFocused, setLaptopFocused] = useState(false);
  const [laptopOpen, setLaptopOpen] = useState(false);
  const [laptopLayerRaised, setLaptopLayerRaised] = useState(false);
  const [laptopInteracted, setLaptopInteracted] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const recordLayerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const laptopTriggerRef = useRef<HTMLButtonElement>(null);
  const sleevesRef = useRef<(HTMLElement | null)[]>([]);
  const frontRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const playRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busy = useRef(false);
  const previousFlip = useRef<number | null>(null);
  const flipStartedAt = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const upright = flipped ?? lifted;

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  useEffect(() => {
    if (flipped !== null && flipped !== previousFlip.current)
      flipStartedAt.current = performance.now();
    if (flipped !== null && !playing)
      playRefs.current[flipped]?.focus({ preventScroll: true });
    else if (flipped === null && previousFlip.current !== null)
      frontRefs.current[selected]?.focus({ preventScroll: true });
    previousFlip.current = flipped;
  }, [flipped, playing, selected]);

  useEffect(() => {
    if (
      (upright === null && !laptopFocused) ||
      !window.matchMedia('(max-width: 700px)').matches
    )
      return;
    let frame = 0;
    let cancelled = false;
    const cancel = () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
    frame = requestAnimationFrame(() => {
      const layer = upright === null ? sceneRef.current : recordLayerRef.current;
      const object =
        upright === null ? laptopRef.current : sleevesRef.current[upright];
      if (!layer || !object) return;
      // Use the final focused size, not the object's transient bounds.
      const size =
        upright === null
          ? Math.min(window.innerWidth * 0.88, 360) / 1.4
          : Math.min(window.innerWidth * 0.88, 350);
      const viewport = window.visualViewport;
      const height = viewport?.height ?? window.innerHeight;
      const topInset = 92;
      const bottomInset = 76;
      const space = Math.max(0, height - topInset - bottomInset - size);
      const top =
        window.scrollY + layer.getBoundingClientRect().top +
        (upright === null ? 165 : layer.offsetHeight * 0.18);
      const target = Math.min(
        Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
        Math.max(0, top - topInset - space / 2 - (viewport?.offsetTop ?? 0)),
      );
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo({ top: target, behavior: 'instant' });
        return;
      }
      // Native smooth scrolling chooses its own (often very short) duration.
      // Keep this gentle movement in time with the mobile sleeve flip instead.
      const start = window.scrollY;
      const started = performance.now();
      function center(now: number) {
        if (cancelled) return;
        const progress = Math.min(1, (now - started) / MOBILE_CENTER_DURATION);
        const eased = progress ** 3 * (progress * (progress * 6 - 15) + 10);
        window.scrollTo({
          top: start + (target - start) * eased,
          behavior: 'instant',
        });
        if (progress < 1) frame = requestAnimationFrame(center);
      }
      frame = requestAnimationFrame(center);
    });
    // Let visitors take control immediately if they scroll or interact again.
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
  }, [upright, laptopFocused]);

  useEffect(() => {
    if (upright === null && !laptopFocused) return;
    function dismiss(event: PointerEvent) {
      if (busy.current || !(event.target instanceof Node)) return;
      if (
        (upright !== null && sleevesRef.current[upright]?.contains(event.target)) ||
        laptopRef.current?.contains(event.target)
      )
        return;
      setFlipped(null);
      setLifted(null);
      setLaptopFocused(false);
      setLaptopOpen(false);
    }
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [upright, laptopFocused]);

  useEffect(() => {
    function keyboard(event: KeyboardEvent) {
      if (event.defaultPrevented || document.activeElement?.closest('dialog[open]')) return;
      if (!sceneRef.current?.contains(document.activeElement)) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        if (timer.current) clearTimeout(timer.current);
        busy.current = false;
        setPlaying(false);
        setFlight(null);
        setFlipped(null);
        setLifted(null);
        setLaptopFocused(false);
        setLaptopOpen(false);
        if (laptopFocused) laptopTriggerRef.current?.focus({ preventScroll: true });
        else frontRefs.current[selected]?.focus({ preventScroll: true });
      } else if (
        !laptopFocused &&
        !busy.current &&
        (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
      ) {
        event.preventDefault();
        const next =
          (selected + (event.key === 'ArrowRight' ? 1 : -1) + projects.length) %
          projects.length;
        setSelected(next);
        setFlipped(null);
        setLifted(null);
        setLaptopFocused(false);
        setLaptopOpen(false);
        setInteracted(true);
        frontRefs.current[next]?.focus({ preventScroll: true });
      }
    }
    document.addEventListener('keydown', keyboard);
    return () => document.removeEventListener('keydown', keyboard);
  }, [selected, projects.length, laptopFocused]);

  function browse(index: number) {
    if (busy.current) return;
    setSelected((index + projects.length) % projects.length);
    setFlipped(null);
    setLifted(null);
    setLaptopFocused(false);
    setLaptopOpen(false);
    setInteracted(true);
  }

  function play(index: number) {
    if (busy.current) return;
    busy.current = true;
    setSelected(index);
    setFlipped(index);
    setPlaying(true);
    setLaptopFocused(false);
    setLaptopOpen(false);
    setInteracted(true);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      router.push(`/work/${projects[index].slug}`);
      return;
    }
    function openProject() {
      prepareCaseStudyArrival(projects[index].slug);
      router.push(`/work/${projects[index].slug}`, { scroll: false });
    }
    // Let a dragged sleeve stand upright before revealing its record.
    timer.current = setTimeout(
      () => {
        const layer = recordLayerRef.current?.getBoundingClientRect();
        const sleeve = sleevesRef.current[index]?.getBoundingClientRect();
        const player = playerRef.current
          ?.querySelector('[data-platter]')
          ?.getBoundingClientRect();
        if (!layer || !sleeve || !player) {
          openProject();
          return;
        }
        const size = sleeve.width * 0.86;
        const x = sleeve.left - layer.left + sleeve.width * 0.07;
        const y = sleeve.top - layer.top + sleeve.height * 0.07;
        const targetWidth = player.width;
        const targetX = player.left - layer.left + player.width / 2;
        const targetY = player.top - layer.top + player.height / 2;
        const mobile = window.matchMedia('(max-width: 700px)').matches;
        const duration = mobile ? MOBILE_VINYL_DURATION : VINYL_DURATION;
        setFlight({
          x,
          y,
          size,
          dx: targetX - x - size / 2,
          dy: targetY - y - size / 2,
          scale: targetWidth / size,
          index,
          duration,
        });
        timer.current = setTimeout(openProject, duration + (mobile ? 0 : 280));
      },
      Math.max(
        0,
        (window.matchMedia('(max-width: 700px)').matches ? 1500 : 1100) -
          (flipped === index ? performance.now() - flipStartedAt.current : 0),
      ),
    );
  }

  function startTouch(event: TouchEvent) {
    if (busy.current) return;
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
    swiped.current = false;
  }

  function endTouch(event: TouchEvent) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || busy.current) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      swiped.current = true;
      browse(selected + (dx < 0 ? 1 : -1));
    }
  }

  return (
    <section className={styles.work} aria-labelledby="work-title">
      <header className={styles.intro}>
        <div>
          <h1 id="work-title">
            <span>Good work.</span>
            <br />
            <span>Good company.</span>
          </h1>
        </div>
        <p className={styles.introNote}>
          Take a peek around—pick an object to explore.
        </p>
      </header>
      <div
        ref={sceneRef}
        className={styles.scene}
        data-interacted={interacted}
        data-flipped={flipped !== null}
        data-upright={upright !== null}
        data-playing={playing}
        data-flight={flight !== null}
        data-laptop-focused={laptopFocused}
        data-laptop-open={laptopOpen}
        data-laptop-raised={laptopFocused || laptopLayerRaised}
        style={
          {
            '--vinyl-duration': `${flight?.duration ?? VINYL_DURATION}ms`,
          } as CSSProperties
        }
      >
        <RoomOutline />
        <FeedbackBoard />
        <KaylaCharacter paused={playing} />
        <span className={styles.laptopStand} aria-hidden="true">
          <Image src="/images/laptop-side-table-v2.png" alt="" width={1402} height={1122} unoptimized />
        </span>
        <div
          ref={recordLayerRef}
          className={styles.sleeves}
          onTouchStart={startTouch}
          onTouchEnd={endTouch}
          onTouchCancel={() => {
            touchStart.current = null;
          }}
        >
          {projects.map((project, index) => (
            <article
              ref={(node) => {
                sleevesRef.current[index] = node;
              }}
              className={styles.sleeve}
              key={project.slug}
              data-front={selected === index}
              data-flipped={flipped === index}
              data-upright={upright === index}
              data-dragged={dragged === index}
              data-project={project.slug}
            >
              <svg
                className={styles.sleeveLedge}
                viewBox="0 0 160 16"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                <g
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 1h158M8 1l8 7h127l16-7M20 8v8m119-8v8" />
                </g>
              </svg>
              <div className={styles.flipShell}>
                <button
                  ref={(node) => {
                    frontRefs.current[index] = node;
                  }}
                  className={styles.front}
                  type="button"
                  draggable={!playing}
                  disabled={playing}
                  inert={flipped === index}
                  aria-hidden={flipped === index}
                  aria-label={lifted === index ? `Flip ${project.shortTitle} for project overview` : `Bring ${project.shortTitle} forward to view its cover`}
                  aria-expanded={flipped === index}
                  aria-controls={`sleeve-back-${project.slug}`}
                  onFocus={() => setInteracted(true)}
                  onClick={(event) => {
                    if (swiped.current) {
                      swiped.current = false;
                      return;
                    }
                    if (busy.current) return;
                    if (event.detail > 1) return;
                    if (lifted !== index) {
                      browse(index);
                      setLifted(index);
                      return;
                    }
                    setSelected(index);
                    setFlipped(index);
                    setInteracted(true);
                  }}
                  onDragStart={(event) => {
                    event.dataTransfer.setData(
                      'application/x-ko-project',
                      project.slug,
                    );
                    event.dataTransfer.effectAllowed = 'copy';
                    setDragged(index);
                    browse(index);
                  }}
                  onDragEnd={() => {
                    setDragged(null);
                    setOverPlayer(false);
                  }}
                >
                  <RecordCover project={project} />
                </button>
                <section
                  id={`sleeve-back-${project.slug}`}
                  className={styles.back}
                  inert={flipped !== index}
                  aria-hidden={flipped !== index}
                  aria-label={`${project.shortTitle} overview`}
                >
                  <span className={styles.backCatalog}>
                    KO · {project.number}
                  </span>
                  <h2>
                    {project.slug === 'handsful'
                      ? 'Handsful'
                      : 'Product Discovery'}
                  </h2>
                  {project.slug === 'handsful' && (
                    <p className={styles.tension}>
                      A baby tracker designed for families raising multiples.
                    </p>
                  )}
                  <p className={styles.overviewSummary}>
                    {project.slug === 'handsful'
                      ? 'Built from concept to launch around the realities of caring for more than one baby—bringing product design and engineering together in one shared caregiving experience.'
                      : 'A legacy retail IVR redesigned with LLM-powered intent recognition and prompt engineering—helping callers find products using their own words.'}
                  </p>
                  <p className={styles.role}>
                    {project.slug === 'handsful'
                      ? 'Design Engineer'
                      : 'AI product + prompt design'}
                  </p>
                  <p className={styles.result}>
                    {project.slug === 'handsful'
                      ? 'Live on iOS and Android.'
                      : 'Resolved 43% of calls without a transfer, up from 15%.'}
                  </p>
                  <a
                    ref={(node) => {
                      playRefs.current[index] = node;
                    }}
                    className={styles.play}
                    href={`/work/${project.slug}`}
                    aria-disabled={playing}
                    onClick={(event) => {
                      if (
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey
                      )
                        return;
                      event.preventDefault();
                      play(index);
                    }}
                  >
                    {playing && selected === index
                      ? 'Putting this one on…'
                      : 'Play this project'}
                    <span aria-hidden="true">▷</span>
                  </a>
                  <button
                    className={styles.backToCover}
                    type="button"
                    disabled={playing}
                    onClick={() => {
                      setFlipped(null);
                      frontRefs.current[index]?.focus({ preventScroll: true });
                    }}
                  >
                    Back to cover
                  </button>
                </section>
              </div>
            </article>
          ))}
          {flight && (
            <div
              className={styles.flight}
              aria-hidden="true"
              style={
                {
                  left: flight.x,
                  top: flight.y,
                  width: flight.size,
                  '--travel-x': `${flight.dx}px`,
                  '--travel-y': `${flight.dy}px`,
                  '--record-scale': flight.scale,
                  '--vinyl-duration': `${flight.duration}ms`,
                } as CSSProperties
              }
            >
              <span>KO · {projects[flight.index].number}</span>
            </div>
          )}
        </div>
        <div
          ref={playerRef}
          className={styles.playerTarget}
          data-ready={dragged !== null}
          data-over={overPlayer}
          onDragOver={(event) => {
            if (dragged === null) return;
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
            setOverPlayer(true);
          }}
          onDragLeave={() => setOverPlayer(false)}
          onDrop={(event) => {
            event.preventDefault();
            const index = projects.findIndex(
              (item) =>
                item.slug ===
                event.dataTransfer.getData('application/x-ko-project'),
            );
            if (dragged !== null && index === dragged) play(index);
            setDragged(null);
            setOverPlayer(false);
          }}
        >
          <RecordPlayer />
        </div>
        <div
          ref={laptopRef}
          className={styles.laptopObject}
          onTransitionEnd={(event) => {
            if (
              event.target === event.currentTarget &&
              event.propertyName === 'width' &&
              !laptopFocused
            ) setLaptopLayerRaised(false);
          }}
          data-stage={
            laptopOpen ? 'open' : laptopFocused ? 'stickers' : 'resting'
          }
        >
          <LaptopArt stage={laptopOpen ? 'open' : laptopFocused ? 'stickers' : 'resting'} invited={!laptopInteracted && upright === null}
          triggerRef={laptopTriggerRef}
          onClose={() => { setLaptopOpen(false); setLaptopFocused(false); }}
          onActivate={() => {
            if (busy.current) return;
            setLaptopInteracted(true);
            setFlipped(null);
            setLifted(null);
            if (!laptopFocused) {
              setLaptopLayerRaised(true);
              setLaptopFocused(true);
              setLaptopOpen(false);
            } else if (!laptopOpen) {
              setLaptopOpen(true);
            } else {
              setLaptopOpen(false);
              setLaptopFocused(false);
            }
            setInteracted(true);
          }} />
        </div>
        <output className={styles.liveStatus} aria-live="polite">
          {laptopOpen
            ? 'Laptop open. Choose an app to explore my toolkit.'
            : laptopFocused
              ? 'Sticker-covered laptop centered. Activate it again to open it.'
              : `${projects[selected].shortTitle}. ${
                  playing
                    ? 'Opening case study.'
                    : flipped === null
                      ? lifted === null ? 'Cover on the wall.' : 'Cover centered. Activate again for project details.'
                      : 'Project overview.'
                }`}
        </output>
      </div>
      <noscript>
        <p>
          Explore the collection:{' '}
          {projects.map((item) => (
            <a key={item.slug} href={`/work/${item.slug}`}>
              {item.shortTitle} ·{' '}
            </a>
          ))}
        </p>
      </noscript>
    </section>
  );
}


function RecordCover({ project }: { project: Project }) {
  const handsful = project.slug === 'handsful';
  return (
    <div
      className={`${styles.cover} ${handsful ? styles.handsfulCover : styles.discoveryCover}`}
      aria-hidden="true"
    >
      <div className={styles.coverMeta}>
        <span>KO · {project.number}</span>
        {!handsful && (
          <Image
            className={styles.coverClientLogo}
            src="/experience-logos/lowes.png"
            alt=""
            draggable={false}
            width={1357}
            height={623}
            unoptimized
          />
        )}
      </div>
      {handsful ? (
        <>
          <span className={styles.coverOrbit} />
          <div className={styles.coverTitle}>
            <Image
              className={styles.handsfulWordmark}
              src="/images/handsful/wordmark.svg"
              alt=""
              draggable={false}
              width={1024}
              height={406}
              unoptimized
            />
            <span>A little less juggling.</span>
          </div>
          <Image
            className={styles.phoneOne}
            src="/images/handsful/today-light-device.webp"
            alt=""
            draggable={false}
            width={1200}
            height={2356}
            unoptimized
          />
          <Image
            className={styles.phoneTwo}
            src="/images/handsful/log-diaper-light-device.webp"
            alt=""
            draggable={false}
            width={1200}
            height={2356}
            unoptimized
          />
          <span className={styles.coverFoot}>
            Built for the beautifully full hands.
          </span>
        </>
      ) : (
        <>
          <div className={styles.discoveryRings}>
            <i />
            <i />
            <i />
          </div>
          <div className={styles.coverTitle}>
            <span>From static lookup to</span>
            <strong>
              Intelligent
              <br />
              Product
              <br />
              Discovery.
            </strong>
          </div>
          <span className={styles.discoverySpark}>✦</span>
          <span className={styles.coverFoot}>
            Natural language. Real understanding.
          </span>
        </>
      )}
    </div>
  );
}

function RoomOutline() {
  return (
    <>
      <svg className={`${styles.roomOutline} ${styles.desktopRoom}`} viewBox="0 0 1200 640" fill="none" aria-hidden="true">
        <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          {/* Match the cabinet's long edge on the left and the table's
              roughly 9-degree descending plane on the right. */}
          <g opacity=".3">
            <path d="M450 8V280L0 535M450 280l750 120" />
            <path d="M0 523l450-255 750 120M450 268v12" />
          </g>
          <g opacity=".38">
            {/* Slim window, projected onto the left wall. */}
            <path d="M24 92l86-13v179l-86 32ZM32 100l70-11v161l-70 25Z" />
            <path d="M67 95v172M32 188l70-19M18 294l98-37-7 8-91 35Z" />
          </g>
          <g opacity=".38" transform="matrix(1 .16 0 1 965 145)">
            <path d="M0 0h167l-9 8H-9ZM15 8v15m131-15v15" />
            <path d="M28-1l-5-38h42L60-1ZM44-39v-43m0 28c-24-3-35-17-30-30 20 1 30 14 30 30Zm0-13c-4-22 2-39 13-43 11 16 6 33-13 43Zm1 15c2-20 17-31 32-29-1 17-14 28-32 29Z" />
            <path d="M93-1v-34h11v34m5 0v-43h12v43m6 0 8-34 11 3-7 31" />
          </g>
        </g>
      </svg>
      <svg className={`${styles.roomOutline} ${styles.mobileRoom}`} viewBox="0 0 400 490" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <g opacity=".28">
            <path d="M175 0v308L0 397m175-89 225 36M0 389l175-89 225 36" />
          </g>
          <g opacity=".34" transform="matrix(1 .16 0 1 240 65)">
            <path d="M0 0h82l-6 5H-6ZM9 5v9m61-9v9" />
            <path d="m20 0-3-22h25L39 0ZM29-22v-19m0 9c-14-1-22-10-19-18 13 0 19 8 19 18Zm0-9c-3-12 0-22 7-25 7 10 4 20-7 25Zm1 10c1-13 10-20 20-19-1 11-9 18-20 19Z" />
            <path d="M55 0v-22h8V0m4 0v-28h8V0" />
          </g>
        </g>
      </svg>
    </>
  );
}

function RecordPlayer() {
  return (
    <span className={styles.playerArt} aria-hidden="true">
      <Image
        className={styles.player}
        src="/images/record-console-empty-v3.png"
        alt=""
        width={1536}
        height={1024}
        unoptimized
      />
      <span className={styles.platterTarget} data-platter />
    </span>
  );
}
