import { ArrowUpRight } from 'lucide-react';
import { ProjectVisual } from '@/components/project-visual';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { HeroCharacter } from '@/components/hero-character';
import { projects } from '@/lib/projects';

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

const testimonials = [
  {
    quote:
      'What truly sets Kayla apart is how she shows up in ambiguity: she stepped in to lead our design team for 10 weeks during a planned leave, owning prioritization and stakeholder communication while keeping delivery momentum and quality high. She’s also an exceptional strategic partner—most recently authoring a thorough, data-driven proposal to evolve a “Product Availability” IVR into a more effective “Product Help” experience, with a clear approach and rationale.',
    name: 'Brett Knight',
    context: 'Director of Product Management @ Lowe’s',
  },
  {
    quote:
      `Kayla is exceptionally thorough, ensuring that every edge case in both IVR and SMS channels is accounted for. Her deep knowledge of conversational design allowed us to move away from rigid menus toward a more fluid, autonomous AI experience that truly understands user intent. She doesn't just design flows; she builds intelligent systems.`,
    name: 'Bobby Nair',
    context: 'Sr. Software Engineering Manager @ Lowe’s',
  },
  {
    quote:
      'Kayla thinks beyond the obvious and asks the most thoughtful questions, ensuring that all the unknowns of a project are accounted for. She communicates clearly, confidently and logically; everyone who interacts with her is inspired by her knowledge and confidence.',
    name: 'Katie Brake',
    context: 'Lead Conversation Designer @ Lowe’s',
  },
  {
    quote:
      'She is extremely organized, thoughtful in her approach, and brings a strong sense of ownership to her work. Whenever there was an opportunity, she naturally stepped into a leadership role and handled it very impressively, helping the team move forward with clarity and confidence.',
    name: 'Romit Jain',
    context: 'Lead Product Manager @ Lowe’s',
  },
  {
    quote:
      "Kayla's an absolute rockstar. She's got the attitude and drive as a great conversational designer and team player. She's often the first to volunteer for new challenges and is often our go-to for new projects. She goes above and beyond to coach and inspire those around her.",
    name: 'Julia Thayer',
    context: 'VP of Product @ SmartAction',
  },
  {
    quote:
      'She quickly grasped both functional requirements and technical bottlenecks, often identifying root causes and helping streamline solutions with impressive speed. Her ability to move fluidly between technical and functional discussions made collaboration with engineering teams highly efficient and productive.',
    name: 'Ashish Gupta',
    context: 'Senior Software Engineer @ Lowe’s',
  },
  {
    quote:
      'One of Kayla’s standout strengths is her talent for writing clear, effective agentic instructions. Her work brings order and consistency to complex conversational flows, making them more intuitive for users and more reliable for the teams who maintain them. She is methodical, dependable, and always focused on delivering high-quality results.',
    name: 'Melanie Wells',
    context: 'Product Manager @ Lowe’s',
  },
  {
    quote:
      'Kayla is not only knowledgeable, but always striving to be better. Whatever she doesn’t know, she’s excited to learn.',
    name: 'Celeste Fondeur',
    context: 'Senior Conversation Designer @ Allstate',
  },
];

export default function Home() {
  return (
    <main id="top">
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
              <a className="button button-primary" href="/work">
                See selected work
              </a>
            </div>
          </div>
        </div>

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
      </section>

      <section className="work-preview" id="work">
        <div className="section-heading section-heading-work">
          <div>
            <h2>Products and systems built for real-world complexity.</h2>
            <a className="text-link" href="/work">View all projects <ArrowUpRight aria-hidden="true" size={18} /></a>
          </div>
        </div>

        <div className="project-stack">
          {featuredProjects.map((project) => (
            <article className="project-row" key={project.slug}>
              <div className="project-copy">
                <p className="project-status">{project.status}</p>
                <h3><a href={`/work/${project.slug}`}>{project.title}</a></h3>
                <p>{project.summary}</p>
                <div className="project-tags" aria-label="Project disciplines">
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <a href={`/work/${project.slug}`}>Explore the project <ArrowUpRight aria-hidden="true" size={18} /></a>
              </div>
              <ProjectVisual project={project} />
            </article>
          ))}
        </div>
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
        <div className="testimonial-marquee" role="region" aria-label="Recommendations from collaborators" tabIndex={0}>
          <div className="testimonial-track">
            {[0, 1].map((sequence) => (
              <div className="testimonial-sequence" aria-hidden={sequence === 1} key={sequence}>
                {testimonials.map((item) => (
                  <figure key={item.name}>
                    <blockquote>“{item.quote}”</blockquote>
                    <figcaption><strong>{item.name}</strong><span>{item.context}</span></figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
