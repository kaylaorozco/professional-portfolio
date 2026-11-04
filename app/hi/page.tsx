import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HiCharacter } from '@/components/hi-character';

export const metadata: Metadata = {
  title: 'Hi, I’m Kayla — Design Engineer',
  description: 'Design engineer for web, mobile, and conversational experiences.',
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

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
              <span className="hi-link-title">Book a session</span>
              <span className="hi-link-description">1:1 product design and AI strategy</span>
            </span>
            <span className="hi-link-arrow"><ArrowIcon /></span>
          </Link>
          <Link className="hi-link-card" href="/work">
            <span className="hi-link-copy">
              <span className="hi-link-title">Explore my work</span>
              <span className="hi-link-description">Web, mobile, and AI-powered experiences</span>
            </span>
            <span className="hi-link-arrow"><ArrowIcon /></span>
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
            <span className="hi-link-arrow"><ArrowIcon /></span>
          </a>
        </nav>

        <section className="hi-apps" aria-labelledby="hi-apps-heading">
          <h2 id="hi-apps-heading"><span>Apps I&apos;ve built</span></h2>
          <div className="hi-app-list">
            <a
              className="hi-app-card"
              href="https://handsful.app"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit the Handsful app website"
            >
              <Image src="/images/hi/handsful-icon.png" alt="" width="180" height="180" />
              <span className="hi-app-copy">
                <strong>Handsful</strong>
                <span>For new parents with their hands full.</span>
              </span>
              <span className="hi-app-action"><ArrowIcon /></span>
            </a>
            <a
              className="hi-app-card"
              href="https://www.schoolsupplied.app/"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit the School Supplied app website"
            >
              <Image src="/images/hi/school-supplied-icon.png" alt="" width="180" height="180" />
              <span className="hi-app-copy">
                <strong>School Supplied</strong>
                <span>Every kid&apos;s school year, organized.</span>
              </span>
              <span className="hi-app-action"><ArrowIcon /></span>
            </a>
          </div>
        </section>

        <aside className="hi-socials" aria-labelledby="hi-socials-heading">
          <p id="hi-socials-heading">Find me elsewhere</p>
          <div className="hi-social-links">
            <a
              href="https://www.linkedin.com/in/kaylaorozco/"
              target="_blank"
              rel="noreferrer"
              aria-label="Find Kayla on LinkedIn"
              title="LinkedIn"
            >
              <svg className="hi-social-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5.2 7.8a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2ZM3.4 20.4H7V9.5H3.4v10.9ZM9.2 9.5h3.45v1.49h.05c.48-.91 1.65-1.87 3.4-1.87 3.64 0 4.31 2.4 4.31 5.51v5.77h-3.59v-5.12c0-1.22-.02-2.79-1.7-2.79-1.7 0-1.96 1.33-1.96 2.7v5.21H9.2V9.5Z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@_korozco"
              target="_blank"
              rel="noreferrer"
              aria-label="Find Kayla on TikTok"
              title="TikTok"
            >
              <svg className="hi-social-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.53.02c1.3-.02 2.6-.01 3.9-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.72-.02-.5-.03-1-.01-1.48.18-1.9 1.12-3.72 2.58-4.96 1.66-1.45 3.99-2.14 6.16-1.73.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/_kaylaorozco/"
              target="_blank"
              rel="noreferrer"
              aria-label="Find Kayla on Instagram"
              title="Instagram"
            >
              <svg className="hi-social-icon hi-social-icon-stroke" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4.25" />
                <circle className="hi-social-icon-dot" cx="17.35" cy="6.75" r="1.05" />
              </svg>
            </a>
            <a
              href="mailto:kayla@mesquiteandthorn.digital"
              aria-label="Email Kayla"
              title="Email"
            >
              <svg className="hi-social-icon hi-social-icon-stroke" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2.25" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </a>
          </div>
        </aside>

        <span className="hi-spark hi-spark-one" aria-hidden="true">✦</span>
        <span className="hi-spark hi-spark-two" aria-hidden="true">✦</span>
      </section>
    </main>
  );
}
