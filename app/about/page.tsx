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

const faqs = [
  {
    question: 'How long have I been in the conversational AI space?',
    answer: "More than five years. I started at a startup with a blank canvas and a lot to figure out. Since then, I've designed conversations for some of the world's largest companies. The space grew, and so did I.",
  },
  {
    question: 'How hands-on am I with the build?',
    answer: "Very. I work across experience design, system logic, prototypes, and implementation. On my mobile products, I use AI tools to help write code, then review and refine it myself. On larger teams, I partner closely with engineering to make sure the experience works in production, not just in a design file.",
  },
  {
    question: 'How long have I been working with LLMs?',
    answer: 'A few years. What began with a single response from a single model and a small experiment with a borrowed team has become regular work transforming legacy IVRs into agentic voice experiences. The models got smarter, and so did the work.',
  },
  {
    question: 'How do I approach a project?',
    answer: "I start with what people need, what the business needs, and what engineering can support. I map the logic before designing the words, flows, or prompts, bringing product and engineering into the work early. After launch, I watch where people get stuck and keep improving the experience.",
  },
  {
    question: 'What got me into conversational AI in the first place?',
    answer: "It started with people. In UX, I learned to obsess over how someone feels when they interact with a product: every click, every moment of confusion, every small win. Then AI entered the picture, and something clicked. Here was a medium where the interface wasn't a button or a screen; it was language itself. The most natural thing humans do. I wanted to be in that space, making something that didn't just work, but felt effortless for the person on the other end. That mission hasn't changed.",
  },
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
            <Link className="button button-primary" href="/work" prefetch={false}>View my work</Link>
          </div>
        </div>
        <AboutCharacter />
      </section>

      <section className="toolkit" aria-labelledby="toolkit-heading">
        <h2 className="eyebrow" id="toolkit-heading">Tools I&apos;ve used</h2>
        <ul className="tool-logo-grid">
          {tools.map(({ name, logo, wide }) => (
            <li className={`tool-logo-card${wide ? ' tool-logo-card-wide' : ''}`} key={name}>
              <Image src={logo} alt={name} width={140} height={84} unoptimized />
            </li>
          ))}
        </ul>
      </section>

      <section className="about-faq" aria-labelledby="about-faq-heading">
        <div className="about-faq-heading">
          <p className="eyebrow">A little more context</p>
          <h2 id="about-faq-heading">Questions about me.</h2>
        </div>
        <div className="about-faq-list">
          {faqs.map(({ question, answer }) => (
            <details key={question} name="about-faq">
              <summary><span>{question}</span><span className="about-faq-toggle" aria-hidden="true">+</span></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
