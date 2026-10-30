import type { Project } from '@/lib/projects';
import Image from 'next/image';

export function ProjectVisual({ project }: { project: Project }) {
  if (project.visual === 'care') {
    return (
      <div
        className="project-visual visual-care"
        aria-label="Handsful Today and Quick Actions screens for tracking care across multiple babies"
      >
        <img className="handsful-hero-blob handsful-hero-blob-a" src="/images/handsful/blob-a.svg" alt="" width={100} height={100} />
        <img className="handsful-hero-blob handsful-hero-blob-b" src="/images/handsful/blob-b.svg" alt="" width={100} height={100} />
        <img className="handsful-hero-wordmark" src="/images/handsful/wordmark.svg" alt="" width={800} height={317} />
        <div className="handsful-hero-phone handsful-hero-phone-secondary">
          <img src="/images/handsful/log-diaper-light-device.webp" alt="" width={1200} height={2356} />
        </div>
        <div className="handsful-hero-phone handsful-hero-phone-primary">
          <img src="/images/handsful/today-light-device.webp" alt="" width={1200} height={2356} />
        </div>
      </div>
    );
  }

  if (project.visual === 'discovery') {
    return (
      <div className="project-visual visual-discovery visual-discovery-art"
        aria-label="Lowe’s intelligent product discovery system, from natural voice request through AI interpretation to relevant results">
        <picture>
          <source
            srcSet="/images/product-discovery-overview-v2-768.webp 768w, /images/product-discovery-overview-v2-1152.webp 1152w, /images/product-discovery-overview-v2.webp 1536w"
            sizes="(max-width: 900px) 92vw, 42vw"
            type="image/webp"
          />
          <Image
            className="discovery-overview-image"
            src="/images/product-discovery-overview-v2.webp"
            alt=""
            width={1536}
            height={1024}
            sizes="(max-width: 900px) 92vw, 42vw"
            unoptimized
          />
        </picture>
        <span className="discovery-client-mark" aria-hidden="true">
          <img src="/experience-logos/lowes.png" alt="" />
        </span>
      </div>
    );
  }

  if (project.visual === 'reschedule') {
    return (
      <div className="project-visual visual-reschedule" aria-label="Delivery rescheduling orchestration">
        <div className="route-node">Request</div><span>→</span>
        <div className="route-node">Eligibility</div><span>→</span>
        <div className="route-node route-result">New date</div>
      </div>
    );
  }

  return (
    <div className="project-visual visual-callout" aria-label="Associate call-out confirmation flow">
      <div className="callout-ring">Voice</div><span>→</span>
      <div className="callout-card"><small>CONFIRMED</small><strong>#48291</strong><p>SMS sent</p></div>
    </div>
  );
}
