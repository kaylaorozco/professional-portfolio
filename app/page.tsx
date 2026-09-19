import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { ProjectVisual } from '@/components/project-visual';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { projects } from '@/lib/projects';

const testimonials = [
  {
    quote:
      'She doesn’t just design flows; she builds intelligent systems.',
    name: 'Bobby Nair',
    context: 'Sr. Software Engineering Manager',
  },
  {
    quote:
      'Her ability to move fluidly between technical and functional discussions made collaboration with engineering teams highly efficient.',
    name: 'Ashish Gupta',
    context: 'Senior Software Engineer',
  },
  {
    quote:
      'She shows up in ambiguity—owning prioritization and stakeholder communication while keeping delivery momentum and quality high.',
    name: 'Brett Knight',
    context: 'Director of Product Management',
  },
];

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="brand-hero" id="top">
        <div className="hero-composition">
          <h1>
            <span>Designing the experience.</span>
            <span>Engineering the product.</span>
          </h1>
          <img
            className="hero-figure"
            src="/images/kayla-hero-v2.png"
            alt="Illustration of Kayla building an app on a laptop"
          />
          <span className="hero-inline-spark" aria-hidden="true">✦</span>
          <div className="hero-editorial-side">
            <p>
              I turn ambiguous ideas into working products—from mobile apps to
              conversational AI—combining interaction design, intelligent
              behavior, and code.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">
                See selected work <ArrowDownRight aria-hidden="true" size={18} />
              </a>
              <a className="button button-secondary" href="/kayla-orozco-resume.pdf" target="_blank">
                Résumé <ArrowUpRight aria-hidden="true" size={17} />
              </a>
            </div>
          </div>
        </div>

        <div
          className="hero-ticker"
          role="group"
          aria-label="Areas of practice: Mobile apps, conversational AI, product design, design engineering, and intelligent systems"
        >
          <div className="hero-ticker-track" aria-hidden="true">
            {[0, 1].map((group) => (
              <div className="hero-ticker-group" key={group}>
                <span>Mobile apps</span>
                <span>Conversational AI</span>
                <span>Product design</span>
                <span>Design engineering</span>
                <span>Intelligent systems</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="work-preview" id="work">
        <div className="section-heading">
          <p className="eyebrow">Selected work</p>
          <div>
            <h2>Products and systems built for real-world complexity.</h2>
            <a className="text-link" href="/work">View all five projects <ArrowUpRight aria-hidden="true" size={18} /></a>
          </div>
        </div>

        <div className="project-stack">
          {projects.slice(0, 4).map((project) => (
            <article className="project-row" key={project.slug}>
              <div className="project-meta"><span>{project.number}</span><span>{project.type}</span></div>
              <div className="project-copy">
                <p className="project-status">{project.status}</p>
                <h3><a href={`/work/${project.slug}`}>{project.shortTitle}</a></h3>
                <p>{project.summary}</p>
                <a href={`/work/${project.slug}`}>Explore the project <ArrowUpRight aria-hidden="true" size={18} /></a>
              </div>
              <ProjectVisual project={project} />
            </article>
          ))}
        </div>
      </section>

      <section className="capabilities">
        <p className="eyebrow">One product mind · multiple layers</p>
        <div className="capability-grid">
          <article><span>01</span><h2>Product + interaction</h2><p>Turning ambiguous needs into clear flows, interfaces, and testable product decisions.</p></article>
          <article><span>02</span><h2>AI system design</h2><p>Designing prompts, orchestration, guardrails, and recovery around how models behave in production.</p></article>
          <article><span>03</span><h2>Implementation</h2><p>Shipping mobile and web products with React Native, TypeScript, Firebase, and modern front-end systems.</p></article>
        </div>
      </section>

      <section className="about-preview" id="about">
        <div className="about-image-wrap">
          <img src="/images/kayla-about.png" alt="Illustration of Kayla standing beside a laptop" />
        </div>
        <div className="about-preview-copy">
          <p className="eyebrow">The human in the loop</p>
          <h2>I build technology around how people actually think, decide, and live.</h2>
          <p>I&apos;m a Texas-based design engineer and founder of Mesquite &amp; Thorn Digital. My work spans mobile products, enterprise agentic systems, and the design infrastructure connecting them.</p>
          <a className="text-link" href="/about">More about how I work <ArrowUpRight aria-hidden="true" size={18} /></a>
        </div>
      </section>

      <section className="testimonials">
        <p className="eyebrow">From the teams behind the systems</p>
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <figure key={item.name}>
              <blockquote>“{item.quote}”</blockquote>
              <figcaption><strong>{item.name}</strong><span>{item.context}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
