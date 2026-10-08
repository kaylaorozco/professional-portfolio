'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const TRACK = '/audio/lofi-chill-vlog-beats.mp3';
const MUSIC_VOLUME = 0.09;

type SoundContextValue = {
  enabled: boolean;
  toggle: () => void;
  getMusicTime: () => number | null;
};
const SoundContext = createContext<SoundContextValue | null>(null);
const silentClock = () => null;

// Read the real playback clock without rerendering on every animation frame.
export function useMusicTime() {
  return useContext(SoundContext)?.getMusicTime ?? silentClock;
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const enabledRef = useRef(false);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const fadeRef = useRef<number | null>(null);
  const getMusicTime = useCallback(() => {
    const music = musicRef.current;
    return enabledRef.current && music && !music.paused
      ? music.currentTime
      : null;
  }, []);

  useEffect(() => {
    const music = new Audio(TRACK);
    music.loop = true;
    music.preload = 'none';
    music.volume = 0;
    musicRef.current = music;

    return () => {
      if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current);
      music.pause();
      musicRef.current = null;
      void audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    function playClick(event: MouseEvent) {
      if (!enabledRef.current || !(event.target instanceof Element)) return;
      const control = event.target.closest('a, button, summary');
      if (
        !control ||
        control.closest('.sound-toggle') ||
        control.hasAttribute('disabled')
      )
        return;

      const context = audioContextRef.current;
      if (!context || context.state !== 'running') return;

      // A brief tonal tick gives controls a tactile feel without lingering over the music.
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(620, now);
      oscillator.frequency.exponentialRampToValueAtTime(270, now + 0.045);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.058, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.06);
    }

    document.addEventListener('click', playClick);
    return () => document.removeEventListener('click', playClick);
  }, []);

  function fadeTo(
    music: HTMLAudioElement,
    target: number,
    onComplete?: () => void,
  ) {
    if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current);
    const startVolume = music.volume;
    const startTime = performance.now();
    const duration = target === 0 ? 220 : 420;

    function frame(now: number) {
      const progress = Math.max(0, Math.min((now - startTime) / duration, 1));
      music.volume = startVolume + (target - startVolume) * progress;
      if (progress < 1) {
        fadeRef.current = requestAnimationFrame(frame);
      } else {
        fadeRef.current = null;
        onComplete?.();
      }
    }

    fadeRef.current = requestAnimationFrame(frame);
  }

  function toggle() {
    const music = musicRef.current;
    if (!music) return;

    if (enabledRef.current) {
      enabledRef.current = false;
      setEnabled(false);
      fadeTo(music, 0, () => music.pause());
      return;
    }

    if (typeof AudioContext !== 'undefined') {
      if (!audioContextRef.current)
        audioContextRef.current = new AudioContext();
      void audioContextRef.current.resume().catch(() => {});
    }
    // play() is called directly in the button's click handler to satisfy browser gesture rules.
    void music
      .play()
      .then(() => {
        enabledRef.current = true;
        setEnabled(true);
        fadeTo(music, MUSIC_VOLUME);
      })
      .catch(() => {
        enabledRef.current = false;
        setEnabled(false);
      });
  }

  return (
    <SoundContext.Provider value={{ enabled, toggle, getMusicTime }}>
      {children}
      <SoundToggle />
    </SoundContext.Provider>
  );
}

function SoundToggle() {
  const sound = useContext(SoundContext);
  const [expanded, setExpanded] = useState(true);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    collapseTimerRef.current = setTimeout(() => setExpanded(false), 4000);
    return () => {
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    };
  }, []);

  if (!sound) return null;

  function handleToggle() {
    sound?.toggle();
    setExpanded(true);
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    collapseTimerRef.current = setTimeout(() => setExpanded(false), 3200);
  }

  return (
    <button
      className={`sound-toggle${expanded ? ' is-expanded' : ''}${sound.enabled ? ' is-on' : ''}`}
      type="button"
      aria-label={sound.enabled ? 'Turn site sound off' : 'Turn site sound on'}
      aria-pressed={sound.enabled}
      title="Music: Lofi Chill Vlog Beats by alex-morgan via Pixabay"
      onClick={handleToggle}
    >
      <span className="sound-vinyl" aria-hidden="true" />
      <span className="sound-toggle-label" aria-hidden="true">
        Sound {sound.enabled ? 'on' : 'off'}
      </span>
    </button>
  );
}
