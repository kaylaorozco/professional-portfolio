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
  const [laptopInteracted, setLaptopInteracted] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const recordLayerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLButtonElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const laptopTriggerRef = useRef<HTMLButtonElement>(null);
  const laptopMovedAt = useRef(-Infinity);
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
        (upright === null ? 165 : object.offsetTop);
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
        laptopRef.current?.contains(event.target) ||
        playerRef.current?.contains(event.target)
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
          <p className={styles.eyebrow}>Selected work</p>
          <h1 id="work-title">
            Good work.
            <br />
            On repeat.
          </h1>
        </div>
        <p className={styles.introNote}>
          A small collection of products and intelligent systems.
          <br />
          Designed, built, and put out into the world.
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
        style={
          {
            '--vinyl-duration': `${flight?.duration ?? VINYL_DURATION}ms`,
          } as CSSProperties
        }
      >
        <RoomOutline />
        <KaylaCharacter paused={playing} />
        <svg
          className={styles.furniture}
          viewBox="0 0 1200 640"
          fill="none"
          aria-hidden="true"
        >
          <g stroke="#957966" strokeWidth="1.7" strokeLinejoin="round">
            <g>
              <path d="m914 401 150 3 30 18-166-2Z" fill="#dfc9ac" />
              <path d="m928 420 166 2v18l-166-2Z" fill="#cba67f" />
              <path d="m947 438 13 174m111-172 17 172" stroke="#8e6d59" strokeWidth="8" />
              <path d="m938 520 145 2" opacity=".5" />
            </g>
          </g>
        </svg>
        <svg
          className={styles.mobileFurniture}
          viewBox="0 0 400 470"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <g stroke="#957966" strokeWidth="1.5" strokeLinejoin="round">
            <g>
              <path d="m304 267 76 2 17 11-86-1Z" fill="#dfc9ac" />
              <path d="m311 279 86 1v12l-86-1Z" fill="#cba67f" />
              <path d="m321 291 7 158m56-157 10 157" stroke="#8e6d59" strokeWidth="5" />
              <path d="m316 372 73 1" opacity=".5" />
            </g>
          </g>
        </svg>
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
                  aria-label={`Flip ${project.shortTitle} for project overview`}
                  aria-expanded={flipped === index}
                  aria-controls={`sleeve-back-${project.slug}`}
                  onFocus={() => setInteracted(true)}
                  onClick={() => {
                    if (swiped.current) {
                      swiped.current = false;
                      return;
                    }
                    if (busy.current) return;
                    const mobile =
                      window.matchMedia('(max-width: 700px)').matches;
                    if (mobile && lifted !== index) {
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
        <button
          ref={playerRef}
          className={styles.playerTarget}
          type="button"
          data-ready={dragged !== null}
          data-over={overPlayer}
          disabled={playing}
          aria-label={
            flipped === null
              ? `View ${projects[selected].shortTitle} overview`
              : `Play ${projects[selected].shortTitle}`
          }
          onClick={() => {
            setLaptopFocused(false);
            setLaptopOpen(false);
            if (flipped === selected) play(selected);
            else {
              setFlipped(selected);
              setInteracted(true);
            }
          }}
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
        </button>
        <div
          ref={laptopRef}
          className={styles.laptopObject}
          data-stage={
            laptopOpen ? 'open' : laptopFocused ? 'stickers' : 'resting'
          }
        >
          <LaptopArt stage={laptopOpen ? 'open' : laptopFocused ? 'stickers' : 'resting'} invited={!laptopInteracted && upright === null}
          triggerRef={laptopTriggerRef}
          onClose={() => { setLaptopOpen(false); setLaptopFocused(false); }}
          onActivate={() => {
            if (busy.current) return;
            if (performance.now() - laptopMovedAt.current < 1100) return;
            laptopMovedAt.current = performance.now();
            setLaptopInteracted(true);
            setFlipped(null);
            setLifted(null);
            if (!laptopFocused) {
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
                      ? 'Cover.'
                      : 'Project overview.'
                }`}
        </output>
      </div>
      <div className={styles.collectionNote}>
        <span>
          01—{String(projects.length).padStart(2, '0')} / The current rotation
        </span>
        <p>From an idea of my own to systems used nationwide.</p>
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
    <svg
      className={styles.roomOutline}
      viewBox="0 0 1200 640"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g opacity=".42">
          <path d="M48 510V90h228v420M60 510V102h204v408M60 220h204M60 336h204M60 448h204" />
          <path d="M74 218v-79h14v79m8 0v-96h20v96m9 0v-87h12v87m10 0-8-67 17-2 8 69m13 0v-91h20v91m8 0v-72h15v72m10 0 16-81 16 3-16 78" />
          <path d="M78 334v-86h18v86m10 0v-71h13v71m10 0v-82h21v82m9 0 18-64 15 4-18 60m25 0v-89h17v89m9 0v-75h21v75" />
          <rect x="77" y="365" width="68" height="80" rx="2" />
          <circle cx="111" cy="405" r="25" />
          <circle cx="111" cy="405" r="5" />
          <path d="M159 445v-55h15v55m9 0v-68h18v68m10 0 12-57 19 4-12 53M55 511v25m213-25v25M0 538h130m950 0h120" />
        </g>
        <g opacity=".28">
          <rect x="363" y="36" width="120" height="143" rx="1" />
          <rect x="373" y="46" width="100" height="123" />
          <circle cx="423" cy="100" r="31" />
          <path d="m401 140 22-18 23 18M545 99h144m-135 0V58h42v41m-33-41c-22-22-9-36 0-22 9-25 25-18 18 0 19-8 27 5 3 22m33 41V71h54v28" />
        </g>
        <g opacity=".53">
          <path d="M1000 463v-77h119v77m-108-77v-13h96v13" />
          <rect x="1013" y="397" width="92" height="111" rx="4" />
          <circle cx="1059" cy="430" r="12" />
          <circle cx="1059" cy="476" r="23" />
          <circle cx="1059" cy="476" r="6" />
          <path d="M1117 376h37l7-51h-51l7 51Zm18-51c-14-25-22-49-9-61 14 13 13 33 9 61Zm0-8c3-27 15-43 27-40 4 19-8 32-27 40Zm-6-6c-20-3-35-16-33-30 17-2 30 8 33 30Z" />
        </g>
      </g>
    </svg>
  );
}

function RecordPlayer() {
  return (
    <span className={styles.playerArt} aria-hidden="true">
      <Image
        className={styles.player}
        src="/images/record-console-v2.png"
        alt=""
        width={1536}
        height={1024}
        unoptimized
      />
      <span className={styles.platterTarget} data-platter />
    </span>
  );
}
