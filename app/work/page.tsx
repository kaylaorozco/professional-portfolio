import type { Metadata } from 'next';
import { ListeningRoom } from '@/components/work/listening-room';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { publishedProjects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Work — Kayla Orozco',
  description: 'Selected mobile products, agentic AI systems, and conversational experiences designed and built by Kayla Orozco.',
};

export default function WorkPage() {
  return (
    <main>
      <SiteHeader />
      <ListeningRoom projects={publishedProjects} />
      <SiteFooter />
    </main>
  );
}
