import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { ProjectVisual } from '@/components/project-visual';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { projects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Work — Kayla Orozco',
  description: 'Selected mobile products, agentic AI systems, and conversational experiences designed and built by Kayla Orozco.',
};

export default function WorkPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-intro">
        <p className="eyebrow">Selected work · 2021—now</p>
        <h1>From first question to working system.</h1>
        <p>Mobile products I own end to end and enterprise AI systems shaped inside complex, real-world constraints.</p>
      </section>
      <section className="work-page-list">
        {projects.map((project) => (
          <article className="work-index-row" key={project.slug}>
            <div className="project-meta"><span>{project.number}</span><span>{project.type}</span></div>
            <ProjectVisual project={project} />
            <div className="work-index-copy">
              <p className="project-status">{project.status}</p>
              <h2>{project.shortTitle}</h2>
              <p>{project.summary}</p>
              <div className="tag-list">{project.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
              <a href={`/work/${project.slug}`}>Read the case study <ArrowUpRight aria-hidden="true" size={18} /></a>
            </div>
          </article>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
