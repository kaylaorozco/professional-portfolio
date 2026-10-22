import type { Metadata } from 'next';
import { ListeningRoom } from '@/components/work/listening-room';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { WorkRoomArrival } from '@/components/work-room-transition';
import { publishedProjects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Work — Kayla Orozco',
  description: 'Explore Kayla Orozco’s projects, toolkit, and notes from the people she’s worked alongside in an interactive workroom.',
};

export default function WorkPage() {
  return (
    <main>
      <WorkRoomArrival>
        <SiteHeader staticLogo />
        <ListeningRoom projects={publishedProjects} />
        <SiteFooter />
      </WorkRoomArrival>
    </main>
  );
}
