import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'About — Kayla Orozco',
  description: 'About Kayla Orozco, a Texas-based design engineer and AI product builder.',
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
          <h1>Equal parts product thinker, interaction designer, and builder.</h1>
          <p>I&apos;m a Texas-based design engineer who owns both the experience and the implementation of what I ship—from early product framing to production code.</p>
          <p>As founder of Mesquite &amp; Thorn Digital, I design and build mobile products with React Native, TypeScript, Firebase, OCR, and LLM-powered workflows. My enterprise background taught me how to make AI useful inside systems where the edge cases are real and the stakes extend well beyond the interface.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="mailto:kaylamarieorozco@gmail.com">Start a conversation <ArrowUpRight aria-hidden="true" size={17} /></a>
            <a className="button button-secondary" href="/kayla-orozco-resume.pdf" target="_blank">View résumé <ArrowUpRight aria-hidden="true" size={17} /></a>
          </div>
        </div>
        <div className="about-portrait"><img src="/images/kayla-about.png" alt="Illustration of Kayla standing beside a laptop" /></div>
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
        <p>I&apos;m a mother of three—including twins—a caretaker to three fur babies, and a motorcycle rider who finds clarity on open roads. That balance of precision and freedom, structure and story, shapes how I build: thoughtfully engineered, but always alive with personality.</p>
      </section>
      <SiteFooter />
    </main>
  );
}
