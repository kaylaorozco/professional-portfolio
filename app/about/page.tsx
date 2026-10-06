import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { AboutCharacter } from '@/components/about-character';

export const metadata: Metadata = {
  title: 'About — Kayla Orozco',
  description: 'About Kayla Orozco, a Texas-based conversational designer and design engineer creating AI experiences across chat, voice, and mobile.',
};

const tools = [
  { name: 'Figma', logo: '/tool-logos/figma.svg' },
  { name: 'Miro', logo: '/tool-logos/miro.svg' },
  { name: 'Axure', logo: '/tool-logos/axure.svg', wide: true },
  { name: 'Lucid', logo: '/tool-logos/lucid.svg' },
  { name: 'Voiceflow', logo: '/tool-logos/voiceflow.png' },
  { name: 'OneReach', logo: '/tool-logos/onereach.svg' },
  { name: 'Cognigy', logo: '/tool-logos/cognigy.svg', wide: true },
  { name: 'Claude', logo: '/tool-logos/claude.svg' },
  { name: 'OpenAI / Codex', logo: '/tool-logos/openai.png' },
  { name: 'Expo', logo: '/tool-logos/expo.svg' },
  { name: 'Xcode', logo: '/tool-logos/xcode.png' },
];

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />
      <section className="about-hero">
        <div className="about-hero-copy">
          <p className="eyebrow">The human in the loop</p>
          <h1>Equal parts systems thinker, interaction designer, <em>and builder.</em></h1>
          <p>I&apos;m a <strong>Texas-based</strong> conversational designer and design engineer building AI experiences across chat, voice, and mobile. I translate complex business needs into natural interactions people can trust, bringing together language, product strategy, and the systems behind the interface.</p>
          <p>I&apos;ve led enterprise-scale transformations alongside product and engineering teams, and now build mobile products through Mesquite &amp; Thorn Digital. I use AI tools to help write code, then review and refine the result. Whether I&apos;m shaping the experience or writing the code, I ground the work in real human behavior and carry it through to something people can use.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/work">View my work</Link>
          </div>
        </div>
        <AboutCharacter />
      </section>

      <section className="toolkit" aria-labelledby="toolkit-heading">
        <h2 className="eyebrow" id="toolkit-heading">Selected tools</h2>
        <ul className="tool-logo-grid">
          {tools.map(({ name, logo, wide }) => (
            <li className={`tool-logo-card${wide ? ' tool-logo-card-wide' : ''}`} key={name}>
              <Image src={logo} alt={name} width={140} height={84} unoptimized />
            </li>
          ))}
        </ul>
      </section>

      <section className="personal-note">
        <p className="eyebrow">Outside the work</p>
        <p>I&apos;m a mother of three navigating <strong>beautiful chaos</strong>, a caretaker to three fur babies, and a motorcycle rider who finds clarity on open roads. That balance of precision and freedom, structure and story, shapes how I design and build: thoughtfully engineered, always alive with personality.</p>
      </section>
      <SiteFooter />
    </main>
  );
}
