import type { Metadata } from 'next';
import Link from 'next/link';
import { HiCharacter } from '@/components/hi-character';

export const metadata: Metadata = {
  title: 'Hi, I’m Kayla — Design Engineer',
  description: 'Design engineer for web, mobile, and conversational experiences.',
};

export default function HiPage() {
  return (
    <main className="hi-page">
      <section className="hi-intro" aria-labelledby="hi-heading">
        <figure className="hi-character">
          <HiCharacter />
          <figcaption className="hi-character-caption">
            Illustrated Kayla seated with her laptop and waving hello.
          </figcaption>
        </figure>

        <div className="hi-intro-copy">
          <h1 id="hi-heading">
            Hi, I&apos;m <em>Kayla.</em>
          </h1>
          <p className="hi-kicker">
            Design engineer for web, mobile,
            <br />
            and AI-powered experiences.
          </p>
        </div>

        <nav className="hi-links" aria-label="Featured links">
          <Link className="hi-link-card hi-link-card-primary" href="/hi/book">
            <span className="hi-link-copy">
              <span className="hi-link-title">Work with me</span>
              <span className="hi-link-description">Book a 1:1 product design or AI strategy session</span>
            </span>
            <span className="hi-link-arrow" aria-hidden="true">→</span>
          </Link>
          <Link className="hi-link-card" href="/work">
            <span className="hi-link-copy">
              <span className="hi-link-title">Explore my work</span>
              <span className="hi-link-description">Web, mobile, and AI-powered experiences</span>
            </span>
            <span className="hi-link-arrow" aria-hidden="true">→</span>
          </Link>
          <a
            className="hi-link-card hi-link-card-studio"
            href="https://mesquiteandthorn.digital"
            target="_blank"
            rel="noreferrer"
          >
            <span className="hi-link-copy">
              <span className="hi-link-title">Visit my studio</span>
              <span className="hi-link-description">Mesquite &amp; Thorn Digital · my product studio</span>
            </span>
            <span className="hi-link-arrow" aria-hidden="true">↗</span>
          </a>
        </nav>

        <span className="hi-spark hi-spark-one" aria-hidden="true">✦</span>
        <span className="hi-spark hi-spark-two" aria-hidden="true">✦</span>
      </section>
    </main>
  );
}
