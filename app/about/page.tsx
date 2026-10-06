import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { AboutCharacter } from '@/components/about-character';

export const metadata: Metadata = {
  title: 'About — Kayla Orozco',
  description: 'About Kayla Orozco, a Texas-based conversational designer and design engineer creating AI experiences across chat, voice, and mobile.',
};

const skills = [
  ['Design', 'Design systems, interaction design, responsive UI, prototyping, accessibility'],
  ['AI', 'Prompt engineering, LLM orchestration, agentic dialogue, RAG, batch testing'],
  ['Engineering', 'React Native, Expo, TypeScript, Next.js, Firebase, APIs, HTML/CSS'],
  ['Leadership', '0-to-1 ownership, technical discovery, workshops, mentoring, cross-functional alignment'],
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

      <section className="principles">
        <p className="eyebrow">How I work</p>
        <div className="principle-grid">
          <article><span>01</span><h2>Start with behavior</h2><p>I look past the requested interface to understand the decisions, constraints, and work happening around it.</p></article>
          <article><span>02</span><h2>Design the whole system</h2><p>Prompts, state, data, APIs, recovery, and UI are all parts of one experience—not separate implementation concerns.</p></article>
          <article><span>03</span><h2>Learn from production</h2><p>Real behavior exposes what prototypes cannot. I treat launch as the beginning of the next design cycle.</p></article>
        </div>
      </section>

      <section className="toolkit">
        <div><p className="eyebrow">Toolkit</p><h2>Broad enough to own the outcome.</h2></div>
        <div className="skill-list">{skills.map(([title, content]) => <div key={title}><h3>{title}</h3><p>{content}</p></div>)}</div>
      </section>

      <section className="personal-note">
        <p className="eyebrow">Outside the work</p>
        <p>I&apos;m a mother of three navigating <strong>beautiful chaos</strong>, a caretaker to three fur babies, and a motorcycle rider who finds clarity on open roads. That balance of precision and freedom, structure and story, shapes how I design and build: thoughtfully engineered, always alive with personality.</p>
      </section>
      <SiteFooter />
    </main>
  );
}
