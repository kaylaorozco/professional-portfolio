import Image from 'next/image';

const workflowShots = [
  {
    title: 'Timeline',
    detail: 'Side-by-side history makes patterns and simultaneous care visible without switching profiles.',
    image: '/images/handsful/timeline-light-device.webp',
    width: 1200,
    height: 2481,
    className: 'handsful-shot-wide',
  },
  {
    title: 'Log for everyone',
    detail: 'Both babies are selected by default, turning a repeated task into one shared action.',
    image: '/images/handsful/log-diaper-light-device.webp',
    width: 1200,
    height: 2356,
    className: '',
  },
  {
    title: 'Today view',
    detail: 'Status, live care, and recent activity stay visible in one shared family view.',
    image: '/images/handsful/today-light-device.webp',
    width: 1200,
    height: 2356,
    className: '',
  },
];

function WorkflowShot({ title, detail, image, width, height, className = '' }: (typeof workflowShots)[number]) {
  return (
    <figure className={`handsful-workflow-shot ${className}`.trim()}>
      <figcaption>
        <strong>{title}</strong>
        <small>{detail}</small>
      </figcaption>
      <div className="handsful-workflow-device">
        <Image src={image} alt="" width={width} height={height} />
      </div>
    </figure>
  );
}

function AiProductGraphic() {
  return (
    <figure
      className="handsful-ai-visual"
      aria-label="Handsful structured AI visit-prep summary"
    >
      <div className="handsful-ai-summary-device">
        <Image src="/images/handsful/ai-summary-light-device.webp" alt="" width={1200} height={2481} />
      </div>
    </figure>
  );
}

export function HandsfulCaseStudy() {
  return (
    <div className="case-body handsful-body">
      <section className="case-section handsful-problem">
        <span className="case-section-number">01</span>
        <div>
          <p className="eyebrow">The problem</p>
          <h2>“Supports multiple children” is not the same as designing for multiples.</h2>
          <p>
            Standard baby trackers usually begin with one baby, then add more profiles. For a caregiver of twins or triplets, that means repeated logging, constant profile switching, fragmented comparison, and more work to answer a simple question like “Which baby ate last?”
          </p>
          <p>
            The product problem was reducing cognitive load during shared, often overnight care—not adding another configuration layer for parents to manage.
          </p>
          <blockquote>
            Handsful starts from a different assumption: the caregiver is managing multiple babies at the same time.
          </blockquote>
        </div>
      </section>

      <section className="case-section">
        <span className="case-section-number">02</span>
        <div>
          <p className="eyebrow">Product model</p>
          <h2>Designing around the family, not the profile.</h2>
          <p>
            I modeled activity around a shared family space so comparison and coordination are native to the product. Logs stay attributable to the caregiver who created them, while the family sees one coherent history.
          </p>
          <div className="handsful-decision-grid">
            <article><strong>One action, multiple babies</strong><p>All babies are pre-selected for common shared actions, reducing duplicate entry.</p></article>
            <article><strong>Shared events stay connected</strong><p>Simultaneous entries share a group ID without erasing each baby’s details.</p></article>
            <article><strong>Comparison is foundational</strong><p>Side-by-side status comes from the data model instead of a view added later.</p></article>
            <article><strong>Parent activity stays singular</strong><p>Pumping belongs to the caregiver, so it is not duplicated across baby profiles.</p></article>
          </div>
        </div>
      </section>

      <section className="case-section handsful-night-section">
        <span className="case-section-number">03</span>
        <div>
          <p className="eyebrow">Interaction design</p>
          <h2>Designing for 3 a.m.</h2>
          <p>
            Parents may be exhausted, holding a baby, working one-handed, or reconstructing what happened hours earlier. I prioritized fewer taps, quick access to core actions, live timers, and clear identity colors over extra setup choices.
          </p>
          <ul className="handsful-principles">
            <li><strong>Default intelligently.</strong><span>Everyone is selected for shared actions, with easy exceptions.</span></li>
            <li><strong>Commit immediately.</strong><span>No unnecessary save step stands between an action and a trusted log.</span></li>
            <li><strong>Keep the core available.</strong><span>Local-first writes keep logging responsive when connectivity is poor.</span></li>
            <li><strong>Show, do not ask.</strong><span>Side-by-side status reduces the need to remember or navigate.</span></li>
          </ul>
        </div>
      </section>

      <section className="case-section handsful-workflows" id="key-workflows">
        <span className="case-section-number">04</span>
        <div>
          <p className="eyebrow">Key workflows</p>
          <h2>One shared picture of care.</h2>
          <p>
            The core experience brings feeding, sleep, diaper, and pumping logs into the Today view and Timeline. Family sharing, onboarding, bilingual English and Spanish support, light and dark modes, and a doctor-visit PDF export extend that shared record.
          </p>
          <div className="handsful-shot-grid">
            {workflowShots.map((shot) => <WorkflowShot key={shot.title} {...shot} />)}
          </div>
        </div>
      </section>

      <section className="case-section">
        <span className="case-section-number">05</span>
        <div>
          <p className="eyebrow">Architecture</p>
          <h2>Local-first where speed matters.</h2>
          <p>
            Handsful uses React Native, Expo, and TypeScript in one iOS and Android codebase. Firestore offline persistence supports local-first writes and background sync so core logging does not feel blocked by connectivity.
          </p>
          <figure className="handsful-architecture" aria-label="Handsful architecture from local app through background sync to shared family data and trusted server operations">
            <div><small>On device</small><strong>React Native app</strong><span>Local-first writes</span></div>
            <b aria-hidden="true">→</b>
            <div><small>Sync layer</small><strong>Firestore</strong><span>Offline persistence</span></div>
            <b aria-hidden="true">→</b>
            <div><small>Shared system</small><strong>Family data</strong><span>Caregiver attribution</span></div>
            <b aria-hidden="true">→</b>
            <div><small>Trusted operations</small><strong>Serverless functions</strong><span>AI + entitlements</span></div>
          </figure>
          <p>
            Firebase supports shared family data and serverless trusted operations. RevenueCat manages subscription state, while the client remains focused on fast capture and clear feedback.
          </p>
        </div>
      </section>

      <section className="case-section" id="applied-ai">
        <span className="case-section-number">06</span>
        <div>
          <p className="eyebrow">Applied AI</p>
          <h2>Adding AI without making an “AI app.”</h2>
          <p>
            AI supports weekly insights, visit-prep summaries, and translate-on-view. It is not the primary interaction and it does not turn caregiving into a chat experience.
          </p>
          <p>
            Before the first insight, each caregiver must give informed consent on their own device. The plain-language flow explains what data is sent, what is never shared, how long generated summaries are retained, and where AI can make mistakes—so participation is an explicit choice rather than a hidden product default.
          </p>
          <div className="handsful-ai-split">
            <div>
              <h3>Why structured summaries</h3>
              <p>Fixed sections are more predictable, easier to constrain, and easier to evaluate than an open conversation. They keep the experience focused on caregiving rather than model interaction.</p>
            </div>
            <AiProductGraphic />
          </div>
        </div>
      </section>

      <section className="case-section">
        <span className="case-section-number">07</span>
        <div>
          <p className="eyebrow">Guardrails</p>
          <h2>Risk controls are part of the product design.</h2>
          <p>
            The model is called server-side and receives only data permitted by the product’s consent and classification rules. Guardrails reduce risk; they do not guarantee medical safety, and generated output is not medical advice.
          </p>
          <ol className="handsful-guardrail-flow">
            <li><span>01</span><strong>Classify</strong><small>Compile-time rules define which log types may be sent. Pediatrician-visit notes are excluded.</small></li>
            <li><span>02</span><strong>Filter by consent</strong><small>Family and caregiver-level choices determine which eligible data can be processed.</small></li>
            <li><span>03</span><strong>Generate structurally</strong><small>Fixed output sections keep summaries bounded; parent notes are treated as untrusted input.</small></li>
            <li><span>04</span><strong>Validate or refuse</strong><small>Diagnostic-language checks cover summaries and translations. After one retry, invalid output is not saved.</small></li>
          </ol>
          <p>
            Rate limits and cost controls protect the system at a high level, and an evaluation harness supports model comparison without making model behavior invisible to product decisions.
          </p>
        </div>
      </section>

      <section className="case-section">
        <span className="case-section-number">08</span>
        <div>
          <p className="eyebrow">Trust + launch readiness</p>
          <h2>Privacy decisions had to exist in the interface, backend, and policy.</h2>
          <p>
            I mapped what the app collects, stores, shares, and deletes, then carried those choices through the Privacy Policy, Terms of Service, Cookie Policy and consent behavior where relevant, account deletion, and data deletion flows.
          </p>
          <div className="handsful-trust-callout">
            <strong>Minimize first.</strong>
            <p>AI processing stays server-side, generated summaries use a retention limit, consent is tracked at family and caregiver level, and sensitive categories that do not belong in model context are excluded.</p>
          </div>
          <p>
            Although Handsful is currently available only in the U.S., I designed its data, consent, and deletion patterns with broader privacy requirements in mind. That includes minimizing data sent to third parties, reviewing analytics choices, and leaving room for stricter requirements without claiming compliance guarantees.
          </p>
        </div>
      </section>

      <section className="case-section">
        <span className="case-section-number">09</span>
        <div>
          <p className="eyebrow">Business model + quality</p>
          <h2>Entitlements are shared; authority stays on the server.</h2>
          <p>
            A 14-day trial and RevenueCat power subscriptions. The client cannot write entitlement state directly. A verified store receipt unlocks the buyer immediately while server state propagates access to the rest of the family.
          </p>
          <div className="handsful-quality-grid">
            <div><strong>TypeScript strict mode</strong><span>Safer shared product logic</span></div>
            <div><strong>Jest</strong><span>Application behavior</span></div>
            <div><strong>Security rules tests</strong><span>Firestore access boundaries</span></div>
            <div><strong>AI evaluation harness</strong><span>Structured model comparison</span></div>
            <div><strong>Real-device testing</strong><span>Mobile interaction and timing</span></div>
            <div><strong>Bilingual locale testing</strong><span>English and Spanish flows</span></div>
            <div><strong>Build + deployment workflows</strong><span>Repeatable release checks</span></div>
          </div>
        </div>
      </section>

      <section className="case-section">
        <span className="case-section-number">10</span>
        <div>
          <p className="eyebrow">What shipped</p>
          <h2>A real product, not a prototype.</h2>
          <p>
            The implemented scope includes core logging, shared family care, Timeline, authentication, family sharing, doctor-visit PDF export, English and Spanish support, subscriptions on iOS, and AI Insights.
          </p>
          <p>
            The iOS app is available on the App Store. The React Native implementation shares a codebase with Android, without implying that every production feature is launched there.
          </p>
        </div>
      </section>

      <section className="case-section handsful-reflection">
        <span className="case-section-number">11</span>
        <div>
          <p className="eyebrow">Reflection</p>
          <h2>Product decisions become architecture.</h2>
          <p>
            Designing from the data model outward made it clear that family structure, comparison, consent, privacy, and entitlement behavior could not be solved only in the interface. AI evaluation and guardrails were product-design work, just as much as the summary screen itself.
          </p>
          <p>
            Shipping independently meant crossing product, design, engineering, policy, testing, and launch boundaries—and making tradeoffs that prototypes rarely expose.
          </p>
          <blockquote>
            I designed the underlying system so new capabilities, policy requirements, and product changes can be introduced without rebuilding the core model around multiples.
          </blockquote>
        </div>
      </section>
    </div>
  );
}
