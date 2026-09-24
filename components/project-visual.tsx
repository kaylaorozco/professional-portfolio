import type { Project } from '@/lib/projects';

export function ProjectVisual({ project }: { project: Project }) {
  if (project.visual === 'list') {
    return (
      <div className="project-visual visual-list" aria-label="School list processing model">
        <div className="paper-list">
          <span /> <span /> <span /> <span />
        </div>
        <div className="visual-arrow">→</div>
        <div className="phone-list">
          <p>All supplies</p>
          <span>2 × notebooks</span>
          <span>1 × crayons</span>
          <span>3 × folders</span>
        </div>
      </div>
    );
  }

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
        <img className="discovery-overview-image" src="/images/product-discovery-overview.png" alt="" />
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
