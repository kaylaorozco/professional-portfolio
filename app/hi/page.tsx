import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HiCharacter } from '@/components/hi-character';
import { HiSocialWave } from '@/components/hi-social-wave';

export const metadata: Metadata = {
  title: 'Hi, I’m Kayla — Design Engineer',
  description: 'Design engineer for web, mobile, and AI-powered experiences.',
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

export default function HiPage() {
  const currentYear = new Date().getFullYear();

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
              <Image src="/images/hi/handsful-icon.png" alt="" width="180" height="180" unoptimized />
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
              <Image src="/images/hi/school-supplied-icon.png" alt="" width="180" height="180" unoptimized />
              <span className="hi-app-copy">
                <strong>School Supplied</strong>
                <span>Every kid&apos;s school year, organized.</span>
              </span>
              <span className="hi-app-action"><ArrowIcon /></span>
            </a>
          </div>
        </section>

        <section className="hi-podcasts" aria-labelledby="hi-podcasts-heading">
          <h2 id="hi-podcasts-heading"><span>Hear me talk</span></h2>
          <div className="hi-podcast-list">
            <a
              className="hi-podcast-card"
              href="https://open.spotify.com/episode/77byjVTa3NOYF7HUdWtGKv"
              target="_blank"
              rel="noreferrer"
              aria-label="Listen to Kayla on App Minded on Spotify"
            >
              <Image src="/images/hi/app-minded-cover.jpg" alt="" width="300" height="300" unoptimized />
              <span className="hi-podcast-copy">
                <small>Guest on App Minded</small>
                <strong>How to Build Your First App With AI: A School Supply List App</strong>
              </span>
              <span className="hi-app-action"><ArrowIcon /></span>
            </a>
            <a
              className="hi-podcast-card"
              href="https://open.spotify.com/episode/4be018H4t0FrUStDHo7F7o"
              target="_blank"
              rel="noreferrer"
              aria-label="Listen to Kayla on Own Your Next on Spotify"
            >
              <Image src="/images/hi/own-your-next-cover.jpg" alt="" width="300" height="300" unoptimized />
              <span className="hi-podcast-copy">
                <small>Guest on Own Your Next</small>
                <strong>Nobody&apos;s Ready for What AI Can Build, with Kayla Orozco</strong>
              </span>
              <span className="hi-app-action"><ArrowIcon /></span>
            </a>
          </div>
        </section>

        <aside className="hi-socials" aria-labelledby="hi-socials-heading">
          <p id="hi-socials-heading">Find me elsewhere</p>
          <HiSocialWave>
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
              href="https://github.com/kaylaorozco"
              target="_blank"
              rel="noreferrer"
              aria-label="Find Kayla on GitHub"
              title="GitHub"
            >
              <svg className="hi-social-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943" />
              </svg>
            </a>
            <a
              href="https://x.com/kayoroz"
              target="_blank"
              rel="noreferrer"
              aria-label="Find Kayla on X"
              title="X"
            >
              <svg className="hi-social-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@kaylamorozco"
              target="_blank"
              rel="noreferrer"
              aria-label="Find Kayla on YouTube"
              title="YouTube"
            >
              <svg className="hi-social-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
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
              href="mailto:hello@kaylaorozco.com"
              aria-label="Email Kayla"
              title="Email"
            >
              <svg className="hi-social-icon hi-social-icon-stroke" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2.25" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </a>
          </HiSocialWave>
        </aside>

        <footer className="hi-footer">
          <p>© 2020–{currentYear} Kayla Orozco</p>
          <Link href="/privacy">Privacy</Link>
        </footer>

        <span className="hi-spark hi-spark-one" aria-hidden="true">✦</span>
        <span className="hi-spark hi-spark-two" aria-hidden="true">✦</span>
      </section>
    </main>
  );
}
