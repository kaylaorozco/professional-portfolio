export type ProjectSection = {
  heading: string;
  body: string[];
  bullets?: string[];
};

export type Project = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  type: string;
  status: string;
  summary: string;
  outcome: string;
  role: string;
  timeline: string;
  platform?: string;
  links?: { label: string; href: string }[];
  tags: string[];
  metrics: { value: string; label: string }[];
  sections: ProjectSection[];
  visual: 'care' | 'discovery' | 'reschedule' | 'callout';
};

export const projects: Project[] = [
  {
    slug: 'handsful',
    number: '01',
    title: 'Handsful — Building a Baby Tracker for Multiples',
    shortTitle: 'Handsful',
    type: 'Mobile product · Design + engineering',
    status: 'Live on the App Store',
    summary:
      'I designed, engineered, and shipped Handsful, a baby tracker built from the ground up for families raising twins, triplets, and other multiples—centering shared caregiving, simultaneous logging, and fewer decisions in the moment.',
    outcome:
      'I took Handsful from product concept through interaction design, system architecture, React Native implementation, and App Store launch—building a shared family system where multiples are the starting point.',
    role: 'Founder & Design Engineer',
    timeline: '2026 – present',
    platform: 'iOS shipped · shared iOS/Android codebase',
    links: [
      { label: 'Website', href: 'https://handsful.app' },
      { label: 'App Store', href: 'https://apps.apple.com/us/app/handsful-multiples-tracker/id6797077032' },
      { label: 'Technical showcase', href: 'https://github.com/kaylaorozco/handsful-showcase' },
    ],
    tags: ['React Native', 'Expo', 'TypeScript', 'Firebase', 'RevenueCat', 'Applied AI'],
    metrics: [
      { value: '2+', label: 'babies in one action' },
      { value: '1', label: 'shared family space' },
      { value: '2', label: 'supported languages' },
    ],
    visual: 'care',
    sections: [
      {
        heading: 'Designed around the family',
        body: [
          'Most baby trackers assume one child, one event, and one primary user. Handsful starts with a family managing multiple babies at once.',
        ],
      },
      {
        heading: 'The interaction challenge',
        body: [
          'The core design problem is balancing speed with specificity. A parent should be able to record a shared event once, adjust details for one child, and understand differences at a glance.',
        ],
        bullets: [
          'Simultaneous multi-child logging without duplicate entry.',
          'Side-by-side views that surface differences instead of raw data volume.',
          'Shared caregiver access with clear ownership and history.',
          'English and Spanish localization accounted for in the product architecture.',
        ],
      },
      {
        heading: 'Building the business with the product',
        body: [
          'I am shaping the data model, subscription tiers, design system, and technical architecture together so the experience can grow without being rebuilt around business constraints later.',
        ],
      },
    ],
  },
  {
    slug: 'intelligent-product-discovery',
    number: '02',
    title: 'From Static Lookup to Intelligent Product Discovery',
    shortTitle: 'Intelligent Product Discovery',
    type: 'Enterprise AI · Voice',
    status: 'Shipped nationwide',
    summary:
      'For a Fortune 50 retailer, the IVR knew how to look up a product. It didn’t know how to understand one. I redesigned the experience from the ground up; weaving LLM-powered intent recognition and prompt engineering into a legacy system to turn a dead-end lookup into a revenue-driving discovery moment.',
    outcome:
      'Containment rose from 15% to 43%, and the successful pilot expanded to stores nationwide.',
    role: 'AI product designer, prompt experience designer, and analyst',
    timeline: 'Initial launch in 1 month · ongoing optimization',
    tags: ['Conversational design', 'Prompt engineering', 'Legacy system modernization'],
    metrics: [
      { value: '+28pt', label: 'containment increase' },
      { value: '43%', label: 'post-launch containment' },
      { value: '~123K', label: 'labor hours saved annually' },
    ],
    visual: 'discovery',
    sections: [
      {
        heading: 'The constraint',
        body: [
          'The legacy experience handled exact item numbers but struggled with natural product descriptions. Customers received vague responses and a generic link rather than meaningful help.',
          'Rigid prompt-by-prompt input rules also forced customers to adapt their language to the system, driving transfers to store associates.',
        ],
      },
      {
        heading: 'My approach',
        body: [
          'I owned the agent experience and prompt architecture across both backend input analysis and the customer-facing response. The goal was to help the system understand enough context to search while keeping the spoken experience focused and useful.',
        ],
        bullets: [
          'Defined instructions for signal quality and intent clarity.',
          'Designed product-summary structure, tone, and information hierarchy.',
          'Piloted in one store, then ten, before nationwide rollout.',
          'Used production conversations to tune API-error handling and search criteria.',
        ],
      },
      {
        heading: 'What production taught us',
        body: [
          'After launch, I analyzed the remaining transfers and found that “product availability” was often umbrella language for a much broader shopping journey. The next opportunity was not simply better prompting—it was deeper support for out-of-stock handling, fulfillment filtering, comparison, and buying guidance.',
        ],
      },
    ],
  },
  {
    slug: 'enterprise-rescheduling',
    number: '03',
    title: 'Rebuilding Enterprise Rescheduling as an Intelligent System',
    shortTitle: 'Enterprise Rescheduling',
    type: 'Agentic AI · API orchestration',
    status: 'Shipped',
    summary:
      'Creating the first self-service path for delivery changes by combining dynamic dialogue, eligibility rules, and API orchestration.',
    outcome:
      'Containment moved from 0% to 10%, while production analysis exposed the business rules limiting further automation.',
    role: 'AI product designer, prompt experience designer, and analyst',
    timeline: 'Initial launch in 1 month · ongoing optimization',
    tags: ['Agentic AI', 'System design', 'API orchestration', 'Voice UX', 'Production analysis'],
    metrics: [
      { value: '0→10%', label: 'containment after launch' },
      { value: '100–120K', label: 'monthly calls in scope' },
      { value: '2–30m', label: 'previous hold time' },
    ],
    visual: 'reschedule',
    sections: [
      {
        heading: 'A missing experience',
        body: [
          'Customers who needed to change a delivery date were transferred directly to an associate—even when their request was simple and eligible for automation. The result was avoidable call volume, long waits, and no self-service option.',
        ],
      },
      {
        heading: 'From flowchart to agent behavior',
        body: [
          'The project began as a deterministic flow and later evolved into a generative agentic experience. I translated the existing business logic into instructions, guardrails, tool-use patterns, and recovery behavior the agent could apply dynamically.',
        ],
        bullets: [
          'Encoded delivery eligibility without exposing internal complexity.',
          'Orchestrated APIs while keeping the conversation clear and human.',
          'Designed recovery for unavailable dates, failed lookups, and ineligible orders.',
          'Reviewed recorded sessions to separate AI failures from policy constraints.',
        ],
      },
      {
        heading: 'The most important finding',
        body: [
          'The primary ceiling was not model quality. Associates could override eligibility rules that the automated system could not. That distinction redirected the roadmap toward business-logic changes, override pathways, and proactive customer messaging.',
        ],
      },
    ],
  },
  {
    slug: 'associate-call-out',
    number: '04',
    title: 'Automated Associate Call-Out',
    shortTitle: 'Automated Associate Call-Out',
    type: 'Conversational system · Voice + SMS',
    status: 'Shipped',
    summary:
      'Replacing repeated calls and manager interruptions with a reliable voice workflow and verifiable confirmation.',
    outcome:
      'The experience reached 77% containment and handled 198K monthly calls that previously required store involvement.',
    role: 'Product and conversation designer',
    timeline: '4 months',
    tags: ['Conversation design', 'NLU', 'Decision logic', 'Voice UX', 'SMS'],
    metrics: [
      { value: '77%', label: 'containment' },
      { value: '198K', label: 'monthly calls contained' },
      { value: '200K', label: 'monthly attempts in scope' },
    ],
    visual: 'callout',
    sections: [
      {
        heading: 'The operational problem',
        body: [
          'Store associates had to call their location, wait for a manager, sometimes call repeatedly, and still risk having no proof that an absence was recorded. Managers had to interrupt store operations to collect and log routine information.',
        ],
      },
      {
        heading: 'Designing for reliability',
        body: [
          'I designed a structured voice workflow for a predictable but high-stakes task. The system had to recognize natural call-out language, gather precise data, recover from invalid input, and provide clear evidence of completion.',
        ],
        bullets: [
          'Analyzed real caller language and created interception intents.',
          'Mapped date phrasing, numeric ID confirmation, PTO logic, and API failures.',
          'Designed retry limits and re-entry paths that avoided full restarts.',
          'Provided a confirmation number with optional SMS documentation.',
        ],
      },
      {
        heading: 'Trust was part of the product',
        body: [
          'The confirmation experience was not a finishing detail. It was the mechanism that allowed associates to trust automation with a consequential workplace task.',
        ],
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
