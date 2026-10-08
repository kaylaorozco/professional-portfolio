'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AboutCharacter } from '@/components/about-character';

const tools = [
  { name: 'Figma', logo: 'figma.svg', category: 'Design & prototype', description: 'Interfaces, design systems, and interactive prototypes.' },
  { name: 'Miro', logo: 'miro.svg', category: 'Explore & collaborate', description: 'Ideas, workshops, and the big picture behind an experience.' },
  { name: 'Axure', logo: 'axure.svg', category: 'Design & prototype', description: 'Detailed prototypes for complex interactions and conditional logic.', wide: true },
  { name: 'Lucid', logo: 'lucid.svg', category: 'Map the system', description: 'User journeys, conversation flows, and the systems connecting them.' },
  { name: 'Voiceflow', logo: 'voiceflow.png', category: 'Build conversations', description: 'Prototyping and testing conversational AI experiences.' },
  { name: 'OneReach', logo: 'onereach.svg', category: 'Build conversations', description: 'Orchestrating conversational experiences and automation.' },
  { name: 'Cognigy', logo: 'cognigy.svg', category: 'Build conversations', description: 'Enterprise conversational AI across voice and chat.', wide: true },
  { name: 'Claude', logo: 'claude.svg', category: 'Think & build with AI', description: 'Exploring ideas, refining prompts, and working through code.' },
  { name: 'OpenAI / Codex', logo: 'openai.png', category: 'Think & build with AI', description: 'Experimenting with language models and turning ideas into working code.' },
  { name: 'Expo', logo: 'expo.svg', category: 'Build for mobile', description: 'Building and iterating on mobile app experiences.' },
  { name: 'Xcode', logo: 'xcode.png', category: 'Build for mobile', description: 'Testing, refining, and preparing iOS apps for release.' },
  { name: 'GitHub', logo: 'github.svg', category: 'Code & project management', description: 'Managing code, tracking changes, and organizing project work.' },
];

export function AboutToolkit({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [explored, setExplored] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [laptopFrame, setLaptopFrame] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const openingRef = useRef(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const tool = selected === null ? null : tools[selected];

  const closeToolkit = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    dialogRef.current?.close();
    setOpen(false);
    setHovered(null);
    openingRef.current = false;
    setLaptopFrame(0);
    (returnFocusRef.current ?? triggerRef.current)?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    headingRef.current?.focus({ preventScroll: true });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let pointerStartedOutside = false;
    const isOutside = (event: MouseEvent) => {
      const bounds = dialog.getBoundingClientRect();
      return event.clientX < bounds.left || event.clientX > bounds.right
        || event.clientY < bounds.top || event.clientY > bounds.bottom;
    };
    const handlePointerDown = (event: PointerEvent) => {
      pointerStartedOutside = event.button === 0 && event.target === dialog && isOutside(event);
    };
    const handleBackdropClick = (event: MouseEvent) => {
      if (pointerStartedOutside && event.target === dialog && isOutside(event)) closeToolkit();
      pointerStartedOutside = false;
    };
    dialog.addEventListener('pointerdown', handlePointerDown);
    dialog.addEventListener('click', handleBackdropClick);
    return () => {
      dialog.removeEventListener('pointerdown', handlePointerDown);
      dialog.removeEventListener('click', handleBackdropClick);
      document.body.style.overflow = previousOverflow;
      dialog.close();
    };
  }, [open, closeToolkit]);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  function openToolkit() {
    if (openingRef.current || open) return;
    timersRef.current.forEach(clearTimeout);
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setExplored(true);
    openingRef.current = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLaptopFrame(2);
      setOpen(true);
      return;
    }
    setLaptopFrame(2);
    timersRef.current = [
      setTimeout(() => setOpen(true), 660),
    ];
  }

  return (
    <>
      <section className="about-hero">
        {children}
        <AboutCharacter onOpenToolkit={openToolkit} toolkitOpen={open} laptopFrame={laptopFrame} explored={explored} triggerRef={triggerRef} />
      </section>
      <dialog className="toolkit-modal" id="about-toolkit" aria-labelledby="toolkit-heading"
        ref={dialogRef} onCancel={(event) => { event.preventDefault(); closeToolkit(); }}>
            <div className="toolkit-menubar">
              <button type="button" className="toolkit-close" onClick={closeToolkit}>Close <span aria-hidden="true">×</span></button>
            </div>
            <div className="toolkit-desktop">
              <div className="toolkit-desktop-title">
                <p className="eyebrow">From the first sketch to the final build</p>
                <h2 id="toolkit-heading" ref={headingRef} tabIndex={-1}>A peek inside <em>my toolkit.</em></h2>
              </div>
              <div className="toolkit-detail" aria-live="polite" aria-atomic="true">
                <p className="toolkit-category">{tool?.category ?? 'Design · Conversations · Code'}</p>
                <h3>{tool?.name ?? 'A few familiar creative companions.'}</h3>
                <p>{tool?.description ?? 'Pick an app to take a look around my toolkit.'}</p>
              </div>
              <ul className="toolkit-dock" aria-label="Tools I use">
                {tools.map((item, index) => (
                  <li key={item.name} data-neighbor={hovered !== null && Math.abs(hovered - index) === 1}>
                    <button type="button" className={`toolkit-app${item.wide ? ' toolkit-app-wide' : ''}`}
                      aria-label={item.name} aria-pressed={selected === index}
                      onClick={() => setSelected(index)} onMouseEnter={() => setHovered(index)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(index)} onBlur={() => setHovered(null)}>
                      <span className="toolkit-app-label" aria-hidden="true">{item.name}</span>
                      <span className="toolkit-app-tile"><Image src={`/tool-logos/${item.logo}`} alt="" width={64} height={64} unoptimized /></span>
                      <span className="toolkit-app-dot" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
              <p className="toolkit-dock-hint">A little design. A little logic. A lot of making things work.</p>
            </div>
      </dialog>
      <noscript>
        <section className="toolkit-fallback" aria-label="Tools I use">
          <h2>What I build with</h2>
          <p>{tools.map((item) => item.name).join(' · ')}</p>
        </section>
      </noscript>
    </>
  );
}
