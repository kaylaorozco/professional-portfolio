import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { HandsfulCaseStudy } from '@/components/handsful-case-study';
import { ProjectVisual } from '@/components/project-visual';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { CaseStudyArrival } from '@/components/work/case-study-arrival';
import { BackNavigationLink } from '@/components/work-room-transition';
import { getPublishedProject, publishedProjects } from '@/lib/projects';

export function generateStaticParams() {
  return publishedProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getPublishedProject(slug);
  if (!project) return {};
  return { title: `${project.shortTitle} — Kayla Orozco`, description: project.summary };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getPublishedProject(slug);
  if (!project) notFound();
  const index = publishedProjects.findIndex((item) => item.slug === slug);
  const next = publishedProjects[(index + 1) % publishedProjects.length];
  const projectOverview = project.slug === 'handsful'
    ? [
        {
          label: 'The challenge',
          value: 'Simplify everyday care tracking, especially for families managing multiple babies.',
        },
        { label: 'My role', value: project.role, secondary: project.timeline },
        {
          label: 'What I owned',
          value: 'Product strategy, UX/UI design, engineering, AI integration, and launch.',
        },
        {
          label: 'The outcome',
          value: 'Designed, built, and launched Handsful on iOS and Android.',
          secondary: 'Available in the U.S. and Mexico',
        },
      ]
    : project.slug === 'intelligent-product-discovery'
      ? [
          {
            label: 'The challenge',
            value: 'Help customers get relevant product availability information in their own words, without being transferred to a store associate.',
          },
          { label: 'My role', value: project.role, secondary: '1 month to pilot' },
          {
            label: 'What I owned',
            value: 'Conversation design, AI experience strategy, prompt architecture, pilot testing, and production optimization.',
          },
          {
            label: 'The outcome',
            value: 'Increased containment from 15% to 43%, saving approximately 123,000 labor hours annually.',
            secondary: 'Expanded nationwide.',
          },
        ]
      : null;

  return (
    <main>
      <CaseStudyArrival slug={slug} />
      <SiteHeader staticLogo />
      <article className="case-study">
        <BackNavigationLink className="back-link" href="/work"><ArrowLeft aria-hidden="true" size={17} /> All work</BackNavigationLink>
        <header className={`case-hero${project.slug === 'handsful' ? ' case-hero-handsful' : ''}`}>
          <div className="case-hero-copy">
            <p className="eyebrow">{project.type} · {project.status}</p>
            <h1>{project.title}</h1>
            <p className="case-deck">{project.summary}</p>
            {project.links && (
              <nav className="case-links" aria-label={`${project.shortTitle} links`}>
                {project.links.map((link) => (
                  <a href={link.href} key={link.href} rel="noreferrer" target="_blank">
                    {link.label}<ArrowUpRight aria-hidden="true" size={16} />
                  </a>
                ))}
              </nav>
            )}
          </div>
          <ProjectVisual project={project} />
        </header>

        {projectOverview ? (
          <section className="case-overview" aria-labelledby="project-overview-title">
            <p className="eyebrow" id="project-overview-title">Project overview</p>
            <dl className="case-facts case-facts-four case-overview-grid">
              {projectOverview.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}{fact.secondary && <span className="case-fact-secondary">{fact.secondary}</span>}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : (
          <dl className={`case-facts${project.platform ? ' case-facts-four' : ''}`}>
            <div><dt>Role</dt><dd>{project.role}</dd></div>
            <div><dt>Timeline</dt><dd>{project.timeline}</dd></div>
            {project.platform && <div><dt>Platform</dt><dd>{project.platform}</dd></div>}
            <div><dt>Scope</dt><dd>{project.tags.slice(0, 3).join(' · ')}</dd></div>
          </dl>
        )}

        <section className="outcome-panel">
          <p className="eyebrow">Outcome</p>
          <h2>{project.outcome}</h2>
          <div className="metrics-row">
            {project.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
          </div>
        </section>

        {project.slug === 'handsful' ? (
          <HandsfulCaseStudy />
        ) : (
          <div className="case-body">
            {project.sections.map((section, sectionIndex) => (
              <section className="case-section" key={section.heading}>
                <span className="case-section-number">0{sectionIndex + 1}</span>
                <div>
                  <h2>{section.heading}</h2>
                  {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                </div>
              </section>
            ))}
          </div>
        )}

        <section className="case-tags"><p className="eyebrow">Tools + disciplines</p><div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></section>

        <Link className="next-project" href={`/work/${next.slug}`} prefetch={false}>
          <span>Next project</span><strong>{next.shortTitle}</strong><ArrowRight aria-hidden="true" size={28} />
        </Link>
      </article>
      <SiteFooter />
    </main>
  );
}
