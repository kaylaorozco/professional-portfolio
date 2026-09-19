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
      <div className="project-visual visual-care" aria-label="Side-by-side child activity view">
        <div><span>A</span><strong>8:42</strong><small>Fed</small></div>
        <div><span>B</span><strong>8:45</strong><small>Fed</small></div>
        <p>One action · individual context</p>
      </div>
    );
  }

  if (project.visual === 'discovery') {
    return (
      <div className="project-visual visual-discovery" aria-label="Product discovery conversation">
        <p className="voice-input">“I need something safe for a damp basement.”</p>
        <div className="intent-line"><span>context</span><span>intent</span><span>constraints</span></div>
        <p className="voice-output">Three relevant options, explained clearly.</p>
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
