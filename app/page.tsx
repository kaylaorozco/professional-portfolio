import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { HeroCharacter } from '@/components/hero-character';
import { WorkRoomLink } from '@/components/work-room-transition';

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

      <SiteFooter />
    </main>
  );
}
