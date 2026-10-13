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
  const [playing, setPlaying] = useState(false);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [dragged, setDragged] = useState<number | null>(null);
  const [overPlayer, setOverPlayer] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const recordLayerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLButtonElement>(null);
  const sleevesRef = useRef<(HTMLElement | null)[]>([]);
  const frontRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const playRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busy = useRef(false);
  const previousFlip = useRef<number | null>(null);
  const flipStartedAt = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

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
    if (flipped === null || !window.matchMedia('(max-width: 700px)').matches)
      return;
    let frame = 0;
    let cancelled = false;
    const cancel = () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
    frame = requestAnimationFrame(() => {
      const layer = recordLayerRef.current;
      const sleeve = sleevesRef.current[flipped];
      if (!layer || !sleeve) return;
      // Use the final square size, not the rotating sleeve's transient bounds.
      const size = Math.min(window.innerWidth * 0.88, 350);
      const viewport = window.visualViewport;
      const height = viewport?.height ?? window.innerHeight;
      const topInset = 92;
      const bottomInset = 76;
      const space = Math.max(0, height - topInset - bottomInset - size);
      const top =
        window.scrollY + layer.getBoundingClientRect().top + sleeve.offsetTop;
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
  }, [flipped]);

  useEffect(() => {
    if (flipped === null) return;
    function dismiss(event: PointerEvent) {
      if (busy.current || !(event.target instanceof Node)) return;
      if (
        sleevesRef.current[flipped!]?.contains(event.target) ||
        playerRef.current?.contains(event.target)
      )
        return;
      setFlipped(null);
    }
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [flipped]);

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
        frontRefs.current[selected]?.focus({ preventScroll: true });
      } else if (
        !busy.current &&
        (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
      ) {
        event.preventDefault();
        const next =
          (selected + (event.key === 'ArrowRight' ? 1 : -1) + projects.length) %
          projects.length;
        setSelected(next);
        setFlipped(null);
        setInteracted(true);
        frontRefs.current[next]?.focus({ preventScroll: true });
      }
    }
    document.addEventListener('keydown', keyboard);
    return () => document.removeEventListener('keydown', keyboard);
  }, [selected, projects.length]);

  function browse(index: number) {
    if (busy.current) return;
    setSelected((index + projects.length) % projects.length);
    setFlipped(null);
    setInteracted(true);
  }

  function play(index: number) {
    if (busy.current) return;
    busy.current = true;
    setSelected(index);
    setFlipped(index);
    setPlaying(true);
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
          ?.querySelector('svg')
          ?.getBoundingClientRect();
        if (!layer || !sleeve || !player) {
          openProject();
          return;
        }
        const size = sleeve.width * 0.86;
        const x = sleeve.left - layer.left + sleeve.width * 0.07;
        const y = sleeve.top - layer.top + sleeve.height * 0.07;
        const targetWidth = player.width * (166 / 330);
        const targetX = player.left - layer.left + player.width * (146 / 330);
        const targetY = player.top - layer.top + player.height * (155 / 240);
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
          <p className={styles.eyebrow}>KO · Selected work</p>
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
        data-playing={playing}
        data-flight={flight !== null}
        style={
          {
            '--vinyl-duration': `${flight?.duration ?? VINYL_DURATION}ms`,
          } as CSSProperties
        }
      >
        <RoomOutline />
        <KaylaCharacter
          paused={flipped !== null || playing || dragged !== null}
        />
        <svg
          className={styles.table}
          viewBox="0 0 1200 800"
          fill="none"
          aria-hidden="true"
        >
          <g stroke="#957966" strokeWidth="1.7" strokeLinejoin="round">
            <g fill="#e1ccb0">
              <path d="M72 516H114L92 790H68Z" />
              <path d="M1074 523H1116L1140 790H1116Z" />
              <path d="m62 514 1070 8-2 26-1066-8Z" />
            </g>
            <path
              d="m104 542-20 231m1001-225 38 225"
              stroke="#b79b7c"
              opacity=".5"
            />
            <path d="m134 372 861 8 155 130-1120-8Z" fill="#eee1cf" />
            <path d="m30 502 1120 8v15L30 517Z" fill="#dfc9ac" />
            <path d="m145 389 806 8m-839 91 942 8" opacity=".25" />
          </g>
        </svg>
        <svg
          className={styles.mobileTable}
          viewBox="0 0 400 470"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <g stroke="#957966" strokeWidth="1.5" strokeLinejoin="round">
            <g fill="#e1ccb0">
              <path d="M20 362H42L27 466H13Z" />
              <path d="M358 362H380L387 466H373Z" />
              <path d="M-10 362H410v16H-10Z" />
            </g>
            <path
              d="m35 381-13 75m343-75 13 75"
              stroke="#b79b7c"
              opacity=".5"
            />
            <path d="M-60 180H430L500 355H-100Z" fill="#eee1cf" />
            <path d="M-100 355H500v10H-100Z" fill="#dfc9ac" />
            <path d="M-30 194h460M-70 342h540" opacity=".4" />
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
              data-dragged={dragged === index}
              data-project={project.slug}
            >
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
                    if (mobile && selected !== index) {
                      browse(index);
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
                  <p className={styles.tension}>
                    {project.slug === 'handsful'
                      ? 'A baby tracker built around families raising multiples.'
                      : 'Natural product questions, understood by a legacy IVR.'}
                  </p>
                  <p className={styles.role}>
                    {project.slug === 'handsful'
                      ? 'Founder & Design Engineer'
                      : 'AI product + prompt design'}
                  </p>
                  <p className={styles.result}>
                    {project.slug === 'handsful'
                      ? 'Built independently. Live on iOS.'
                      : '15% → 43% containment.'}
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
        <output className={styles.liveStatus} aria-live="polite">
          {projects[selected].shortTitle}.{' '}
          {playing
            ? 'Opening case study.'
            : flipped === null
              ? 'Cover.'
              : 'Project overview.'}
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
      </div>
      {handsful ? (
        <>
          <span className={styles.coverOrbit} />
          <div className={styles.coverTitle}>
            <strong>Handsful</strong>
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
    <svg className={styles.player} viewBox="0 0 330 240" aria-hidden="true">
      <g stroke="#48291e" strokeWidth="2.5" strokeLinejoin="round">
        <path d="m28 137 25-111 246 12-8 110Z" fill="#f0c08c" />
        <path d="m40 128 22-91 224 11-6 89Z" fill="#e7ab72" />
        <path d="m19 142 247 13 39 34-249-9Z" fill="#c77548" />
        <path d="m19 142 37 38v27l-37-35Z" fill="#ad593b" />
        <path d="m56 180 249 9v26l-249-8Z" fill="#b86340" />
        <path d="m29 140 234 12 29 27-234-10Z" fill="#e6b77e" />
        <ellipse cx="146" cy="155" rx="83" ry="19" fill="#342b27" />
        <g stroke="#716054" strokeWidth=".8" fill="none">
          <ellipse cx="146" cy="155" rx="73" ry="15" />
          <ellipse cx="146" cy="155" rx="64" ry="12" />
          <ellipse cx="146" cy="155" rx="54" ry="9" />
        </g>
        <ellipse cx="146" cy="155" rx="23" ry="6" fill="#d6a355" />
        <path d="M146 155v-5" strokeWidth="3" />
        <circle cx="250" cy="148" r="7" fill="#7a8060" />
        <path d="m250 148-12 19-52-3" strokeWidth="5" fill="none" />
        <path d="m185 161-12 1v5l12 1Z" fill="#ead8bc" />
        <circle cx="277" cy="202" r="5" fill="#e7be88" />
        <path d="m77 209 2 9h13l2-8m178 6 2 8h13l2-8" fill="#48291e" />
        <path d="m75 195 57 2" stroke="#e7be88" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
