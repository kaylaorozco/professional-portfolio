import Link from 'next/link';
import { ProjectVisual } from '@/components/project-visual';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { HeroCharacter } from '@/components/hero-character';
import { TestimonialMarquee } from '@/components/testimonial-marquee';
import { WorkRoomLink } from '@/components/work-room-transition';
import { projects } from '@/lib/projects';
import { testimonials } from '@/lib/testimonials';

const areasOfPractice = [
  'Human-computer interaction',
  'Artificial intelligence',
  'Mobile apps',
  'Product design',
  'Design engineering',
  'Intelligent systems',
  'Conversational AI',
];

const featuredProjects = projects.filter(({ slug }) =>
  ['handsful', 'intelligent-product-discovery'].includes(slug),
);

export default function Home() {
  return (
    <main className="home-page" id="top">
      <SiteHeader />

      <section className="brand-hero">
        <div className="hero-composition">
          <h1>
            <span>Designing the experience.</span>
            <span>Engineering the product.</span>
          </h1>
          <HeroCharacter />
          <span className="hero-inline-spark" aria-hidden="true">✦</span>
          <div className="hero-editorial-side">
            <p>
              I turn ambiguous ideas into working products—from mobile apps to
              conversational AI—combining interaction design, intelligent
              behavior, and code.
            </p>
            <div className="hero-actions">
              <WorkRoomLink />
            </div>
          </div>
        </div>

      </section>

      <div
        className="hero-ticker"
        role="group"
        aria-label={`Areas of practice: ${areasOfPractice.join(', ')}`}
      >
        <div className="hero-ticker-track" aria-hidden="true">
          {[0, 1].map((sequence) => (
            <div className="hero-ticker-sequence" key={sequence}>
              {[0, 1].map((repeat) => (
                <div className="hero-ticker-group" key={repeat}>
                  {areasOfPractice.map((area) => (
                    <span key={area}>{area}</span>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="work-preview" id="work">
        <div className="section-heading section-heading-work">
          <div className="work-heading-copy">
            <h2>Products and systems built for real-world complexity.</h2>
          </div>
        </div>

        <div className="project-stack">
          {featuredProjects.map((project) => (
            <article className={`project-row${project.slug === 'handsful' ? ' project-row-handsful' : ''}`} key={project.slug}>
              <div className="project-copy">
                <p className="project-status">{project.status}</p>
                <h3><Link href={`/work/${project.slug}`} prefetch={false}>{project.title}</Link></h3>
                <p>{project.summary}</p>
                <div className="project-tags" aria-label="Project disciplines">
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <Link href={`/work/${project.slug}`} prefetch={false}>Explore the project</Link>
              </div>
              <ProjectVisual project={project} />
            </article>
          ))}
        </div>
        <Link className="text-link projects-all-link" href="/work" prefetch={false}>View all projects</Link>
      </section>

      <section className="capabilities">
        <div className="capabilities-intro">
          <h2>
            <span>Systems-first.</span>
            <span>Human-focused.</span>
            <span>AI-enabled.</span>
          </h2>
          <p>Designing intelligent systems that solve real-world problems at scale.</p>
        </div>
        <div className="capability-grid">
          <article><span className="section-spark" aria-hidden="true">✦</span><h2>Product + interaction</h2><p>Turning real human needs into clear flows, interfaces, and product decisions.</p></article>
          <article><span className="section-spark" aria-hidden="true">✦</span><h2>AI system design</h2><p>Designing prompts, orchestration, guardrails, and recovery for production systems.</p></article>
          <article><span className="section-spark" aria-hidden="true">✦</span><h2>Design engineering</h2><p>Translating product decisions into working mobile, web, and voice experiences.</p></article>
        </div>
      </section>

      <section className="testimonials">
        <p className="eyebrow">Voices from the teams behind the systems <span className="section-spark" aria-hidden="true">✦</span></p>
        <TestimonialMarquee testimonials={testimonials} />
      </section>

      <SiteFooter />
    </main>
  );
}
