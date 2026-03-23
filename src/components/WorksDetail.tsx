import type { ReactNode } from "react";

type WorksDetailData = {
  title: string;
  intro: string;
  includes: string[];
  usefulWhen: string[];
};

type NeedCard = {
  title: string;
  description: string;
};

type WorkStep = {
  number: string;
  title: string;
  description: string;
};

type EngagementCard = {
  label: string;
  title: string;
  description: string;
};

const WORKS_DETAILS: Record<string, WorksDetailData> = {
  "ops-automation": {
    title: "Operational Architecture",
    intro:
      'We design systems that reduce coordination effort and cognitive load. Our focus is not on adding more tools, but on refining the right ones so everyday operations become clearer, calmer, and more reliable. We turn "spreadsheet chaos" into "infrastructure you can stand behind."',
    includes: [
      "Workflow and process mapping",
      "Custom internal tools and lightweight web systems",
      "Intelligent automation between existing platforms",
      "Eliminating manual handoffs and repetitive data entry",
      'Turning "invisible" tribal knowledge into visible, manageable data',
    ],
    usefulWhen: [
      "Your team relies on scattered sheets, chats, and emails to run core operations.",
      "A single misclick in a spreadsheet could disrupt your entire workflow.",
      'The system only works because specific people "hold it all together."',
    ],
  },
  "product-archt": {
    title: "Product Architecture & Launch",
    intro:
      "A good idea doesn't fail at the concept stage, it fails when the first version is too heavy to move, too fragile to scale, or too vague to attract investment. We scope, design, and build the version of your product that proves the concept without painting you into a corner.",
    includes: [],
    usefulWhen: [],
  },
  "visual-identity": {
    title: "Visual Identity & UX Design",
    intro:
      'Branding is not decoration; it is the alignment between what you do and how you are experienced. We design visual identities and digital interfaces that communicate purpose without the noise. We build the "digital front door" that reflects your internal quality.',
    includes: [
      "Visual identity systems (Logo, Typography, Color)",
      "Web design with a focus on performance and hierarchy",
      "Messaging clarity and content structure",
      "Design systems that grow as your business scales",
    ],
    usefulWhen: [
      'Your work is high-quality, but your digital presence feels "amateur" or outdated.',
      "Your website explains what you do, but not why it matters.",
      "You have outgrown an old identity that no longer fits your current scale.",
    ],
  },
  "system-advisory": {
    title: "Strategic Systems Advisory",
    intro:
      "We collaborate with decentralized initiatives and local organizations to build socio-digital infrastructure. These projects are driven by shared responsibility and long-term sustainability rather than quick visibility. Technology should serve the community, not extract from it.",
    includes: [
      "Co-design with local stakeholders and grassroots groups",
      "Systems thinking for non-profit and decentralized contexts",
      "Lightweight tech for coordination and transparency",
      "Long-term technical partnership over one-off delivery",
    ],
    usefulWhen: [
      "A social project needs structure without losing its core values.",
      "Coordination and data governance are bigger hurdles than the tech itself.",
      "You want to build digital tools that prioritize user agency and transparency.",
    ],
  },
};

const OPS_NEED_CARDS: NeedCard[] = [
  {
    title: "Your stack is a patchwork",
    description:
      "Multiple tools that don't talk to each other, duplicated data, manual handoffs between systems.",
  },
  {
    title: "Onboarding is tribal knowledge",
    description:
      "New hires rely on someone explaining the undocumented workarounds that keep things running.",
  },
  {
    title: "Reporting takes hours",
    description:
      "Pulling weekly numbers means manually assembling spreadsheets every time.",
  },
  {
    title: "Everything is urgent",
    description:
      "When there's no clear operational flow, everything feels like a fire.",
  },
];

const OPS_WORK_STEPS: WorkStep[] = [
  {
    number: "01",
    title: "Operational Audit",
    description:
      "We shadow your existing workflows, tools, handoffs, and communication patterns; and build a clear map of where cognitive load accumulates and where time is lost. No assumptions, just observation.",
  },
  {
    number: "02",
    title: "Diagnosis & Prioritization",
    description:
      "Not every inefficiency is worth fixing immediately. We rank by impact-to-effort ratio and present a phased roadmap. You decide the pace; we give you the full picture to decide wisely.",
  },
  {
    number: "03",
    title: "System Design & Build",
    description:
      "We design integrations, automations, and data pipelines using tools your team can actually maintain. No black-box solutions. Every system we build comes with documentation and a clear owner.",
  },
  {
    number: "04",
    title: "Handoff & Continuity",
    description:
      "We don't disappear after deployment. We run a structured handoff, monitor for 30 days, and leave you with runbooks so your team owns the operation, not a dependency on us.",
  },
];

const PRODUCT_NEED_CARDS: NeedCard[] = [
  {
    title: "You've outgrown no-code",
    description:
      "The Notion + Zapier + Webflow setup worked until it didn't. You need a real foundation now.",
  },
  {
    title: "Investors want a working demo",
    description:
      "Decks and notebooks are no longer enough. You need something people can actually interact with.",
  },
  {
    title: "Your MVP became a liability",
    description:
      "The prototype is running in production and nobody wants to touch it.",
  },
  {
    title: "You don't know what to build first",
    description:
      "The backlog has 80 items. The runway has 6 months. The priorities aren't clear.",
  },
];

const PRODUCT_WORK_STEPS: WorkStep[] = [
  {
    number: "01",
    title: "Scope & Reality Check",
    description:
      "We sit down with your vision and stress-test it against time, budget, and market. We define what the product must do to be useful, and cut everything else. Clarity before code.",
  },
  {
    number: "02",
    title: "Architecture Decision Records",
    description:
      "Before writing a line, we document the key technical decisions and their trade-offs. Stack, data model, auth, third-party dependencies... Each choice is explicit and reasoned, not assumed.",
  },
  {
    number: "03",
    title: "Design & Prototype",
    description:
      "We build high-fidelity wireframes and interactive prototypes that can be tested with real users before a single endpoint is written. This is where we catch expensive misunderstandings cheaply.",
  },
  {
    number: "04",
    title: "Build & Ship",
    description:
      "We develop with CI/CD from day one. Every feature is behind a feature flag, every deployment is automated, and every environment from dev to production is consistent and observable.",
  },
  {
    number: "05",
    title: "Launch & Stabilize",
    description:
      "We don't hand off at deployment. We monitor the first weeks of live traffic, address real-world edge cases, and ensure your team is equipped to own the product going forward.",
  },
];

const VISUAL_NEED_CARDS: NeedCard[] = [
  {
    title: "Your product works, but confuses",
    description:
      "Users need training to do things that should feel obvious. Support tickets are symptom reports.",
  },
  {
    title: "Your brand doesn't match your ambition",
    description:
      "The logo was made fast. The site was built by a developer. It shows, and it costs you credibility.",
  },
  {
    title: "You're rebuilding and need a clean slate",
    description:
      "A new product or major version is a rare window to rethink the experience from first principles.",
  },
  {
    title: "Design and engineering don't speak the same language",
    description:
      "Handoffs break down. Figma files don't survive contact with the codebase.",
  },
];

const VISUAL_DELIVER_STEPS: WorkStep[] = [
  {
    number: "01",
    title: "Brand",
    description:
      "Logo system, color palette, typography, tone of voice, and usage guidelines",
  },
  {
    number: "02",
    title: "Web presence",
    description:
      "Marketing site design, landing pages, content structure, conversion flow",
  },
  {
    number: "03",
    title: "UX",
    description:
      "User journey maps, wireframes, information architecture, interaction patterns",
  },
  {
    number: "04",
    title: "UI",
    description:
      "High-fidelity Figma designs with a component library ready for engineering handoff",
  },
  {
    number: "05",
    title: "Design system",
    description:
      "Tokens, variants, and documented patterns your team can extend without breaking",
  },
];

const VISUAL_WORK_STEPS: WorkStep[] = [
  {
    number: "01",
    title: "Discovery & Positioning",
    description:
      "We understand who you're talking to, what they already believe, and where your product sits in their mental map. Brand direction without this is decoration; with it, it's strategy.",
  },
  {
    number: "02",
    title: "Visual Language",
    description:
      "We explore directions, moodboards, typography pairings, color systems, and converge on a single cohesive visual language that holds across digital and print. No cherry-picking from multiple directions.",
  },
  {
    number: "03",
    title: "UX Flows & Wireframes",
    description:
      "We map the user's journey through your product before designing any pixel. Every screen answers a question: what does this person need to do next, and what do they need to feel confident doing it?",
  },
  {
    number: "04",
    title: "High-Fidelity Design & Handoff",
    description:
      "Final screens are built as a living component library, not a static snapshot. Spacing, states, and edge cases are explicit. Engineering receives what they need to build exactly what was designed.",
  },
];

const SYSTEM_NEED_CARDS: NeedCard[] = [
  {
    title: "You're about to make an expensive decision",
    description:
      "A new platform, a rebuild, or a major hire... the kind of call that's hard to reverse without a costly detour.",
  },
  {
    title: "Your technical team needs direction, not management",
    description:
      "Good engineers are in place but there's no senior voice shaping priorities and trade-offs.",
  },
  {
    title: "Investors are asking questions you can't answer",
    description:
      "Due diligence surfaces gaps in your architecture story, data practices, or scalability narrative.",
  },
  {
    title: "Growth exposed structural debt",
    description:
      "What worked for 10 users is buckling at 1,000. The product needs a clear path forward, not a patch.",
  },
];

const SYSTEM_ENGAGEMENT_MODELS: EngagementCard[] = [
  {
    label: "Ongoing",
    title: "Fractional CTO / CDO",
    description:
      "A fixed number of hours per month dedicated to your planning sessions, reviewing your architecture, and being available when fast decisions are required.",
  },
  {
    label: "Fixed scope",
    title: "Technical Due Diligence",
    description:
      "A structured review of your codebase, infrastructure, and team practices. Delivered as a clear report for your board, your investors, or your own roadmap.",
  },
  {
    label: "Fixed scope",
    title: "Architecture Review",
    description:
      "A deep look at a specific system or decision. We stress-test your current design and propose alternatives with explicit trade-off analysis.",
  },
  {
    label: "Workshop",
    title: "Strategic Planning Session",
    description:
      "A facilitated half-day with your leadership team. We align on priorities, expose assumptions, and leave with a shared technical and product direction.",
  },
];

const SYSTEM_WORK_STEPS: WorkStep[] = [
  {
    number: "01",
    title: "Alignment Call",
    description:
      "We start by understanding the decision landscape, including what has been decided, what is still in flux, and where the real uncertainty lies. We do not charge for this conversation.",
  },
  {
    number: "02",
    title: "Context Immersion",
    description:
      "We review what exists, including architecture diagrams, the codebase, team structure, and past decisions. We ask the uncomfortable questions before forming any opinion.",
  },
  {
    number: "03",
    title: "Structured Perspective",
    description:
      "We present our findings with clarity and without agendas. We outline options with trade-offs, not just recommendations. You decide; we ensure the decision is informed.",
  },
  {
    number: "04",
    title: "Ongoing Presence (if needed)",
    description:
      "For retainer engagements, we stay involved in planning sessions, critical reviews, and remain available when decisions need a senior check before they are made.",
  },
];

export default function WorksDetail({
  id,
  breadcrumbs,
  onClose,
  onOpenProjects,
  onContact,
  onSelectProject,
}: {
  id: string;
  breadcrumbs: ReactNode;
  onClose?: () => void;
  onOpenProjects?: () => void;
  onContact?: () => void;
  onSelectProject?: (id: string) => void;
}) {
  const detail = WORKS_DETAILS[id];
  if (!detail) return null;

  if (id === "ops-automation") {
    return (
      <section className="sticky-page works-detail-page operational-detail-page">
        <div className="page-header">
          <div className="page-breadcrumb">
            {breadcrumbs}
            <button
              type="button"
              className="operational-close"
              onClick={onClose}
              aria-label="Close operational architecture details"
            >
              <img src="/icons/close.svg" alt="" />
            </button>
          </div>
          <h2>{detail.title}</h2>
        </div>

        <div className="home-section">
          <p>
            Most teams don't have a productivity problem, they have a systems
            problem. We map how your team actually moves, locate where effort
            disappears into friction, and replace that friction with automated,
            maintainable infrastructure. Less coordination overhead. More work
            that matters.
            <br />
            <br />
            <br />
            You might need this if...
          </p>
        </div>
        <div className="needs-grid" role="list">
          {OPS_NEED_CARDS.map((card) => (
            <article key={card.title} className="needs-card" role="listitem">
              <h4>{card.title}</h4>
              <p>{card.description}</p>
            </article>
          ))}
        </div>

        <h2>How we work</h2>

        <section className="operational-how-we-work works-detail-section-block">
          <div className="page-section">
            <div className="operational-how-grid">
              <div className="operational-steps" role="list">
                {OPS_WORK_STEPS.map((step) => (
                  <article
                    key={step.number}
                    className="operational-step"
                    role="listitem"
                  >
                    <span className="operational-step-number">
                      {step.number}
                    </span>
                    <div className="operational-step-content">
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="operational-how-image" aria-hidden>
                <img
                  src="https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780580/operational-how_vanlvd.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>

        <h2>Related projects</h2>

        <section className="detail-related works-detail-section-block">
          <div className="page-section">
            <div className="detail-related-panel">
              <article
                className="detail-related-card"
                onClick={() => onSelectProject?.("admin-scheduling-system")}
                style={{ cursor: "pointer" }}
              >
                <div className="detail-related-icon" aria-hidden>
                  <img
                    src="/icons/projects/admin-scheduling-system.svg"
                    alt=""
                  />
                </div>
                <div className="detail-related-content">
                  <h4>Admin Scheduling System Redesign</h4>
                  <div className="detail-related-desc-area">
                    <div className="detail-related-tags">
                      <p>Operational Architecture</p>
                      <p>Digital Infrastructure</p>
                    </div>
                    <p className="detail-related-hover-desc">
                      A scheduling system redesign focused on reducing cognitive
                      load for administrators working across fragmented tools.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="detail-related-view-link"
                  onClick={() => onSelectProject?.("admin-scheduling-system")}
                >
                  View case study
                </button>
              </article>

              <button
                type="button"
                className="detail-related-link"
                onClick={onOpenProjects}
              >
                View all projects
              </button>
            </div>
          </div>
        </section>

        <div className="operational-cta-section">
          <p>Ready to see</p>
          <p>
            where the <span> gaps</span> are?
          </p>
          <button type="button" className="cm-primary" onClick={onContact}>
            Contact Us
          </button>
        </div>
      </section>
    );
  }

  if (id === "product-archt") {
    return (
      <section className="sticky-page works-detail-page operational-detail-page">
        <div className="page-header">
          <div className="page-breadcrumb">
            {breadcrumbs}
            <button
              type="button"
              className="operational-close"
              onClick={onClose}
              aria-label="Close product architecture and launch details"
            >
              <img src="/icons/close.svg" alt="" />
            </button>
          </div>
          <h2>{detail.title}</h2>
        </div>

        <div className="home-section">
          <p>
            A good idea doesn't fail at the concept stage, it fails when the
            first version is too heavy to move, too fragile to scale, or too
            vague to attract investment. We scope, design, and build the version
            of your product that proves the concept without painting you into a
            corner.
            <br />
            <br />
            <br />
            You might need this if...
          </p>
        </div>
        <div className="needs-grid" role="list">
          {PRODUCT_NEED_CARDS.map((card) => (
            <article key={card.title} className="needs-card" role="listitem">
              <h4>{card.title}</h4>
              <p>{card.description}</p>
            </article>
          ))}
        </div>

        <h2>How we work</h2>

        <section className="operational-how-we-work works-detail-section-block">
          <div className="page-section">
            <div className="operational-how-grid">
              <div className="operational-steps" role="list">
                {PRODUCT_WORK_STEPS.map((step) => (
                  <article
                    key={step.number}
                    className="operational-step"
                    role="listitem"
                  >
                    <span className="operational-step-number">
                      {step.number}
                    </span>
                    <div className="operational-step-content">
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="operational-how-image" aria-hidden>
                <img
                  src="https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780582/product-how_e3lwy4.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>

        <h2>Related projects</h2>

        <section className="detail-related works-detail-section-block">
          <div className="page-section">
            <div className="detail-related-panel">
              <article
                className="detail-related-card"
                onClick={() => onSelectProject?.("fishnet-recycling")}
                style={{ cursor: "pointer" }}
              >
                <div className="detail-related-icon" aria-hidden>
                  <img src="/icons/projects/fishnet-recycling.svg" alt="" />
                </div>
                <div className="detail-related-content">
                  <h4>Fishnet Recycling Management System</h4>
                  <div className="detail-related-desc-area">
                    <div className="detail-related-tags">
                      <p>Community Project</p>
                      <p>Initiative-driven project</p>
                    </div>
                    <p className="detail-related-hover-desc">
                      A management system developed to support the collection,
                      tracking, and reuse of discarded fishnets through
                      community collaboration.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="detail-related-view-link"
                  onClick={() => onSelectProject?.("fishnet-recycling")}
                >
                  View case study
                </button>
              </article>

              <button
                type="button"
                className="detail-related-link"
                onClick={onOpenProjects}
              >
                View all projects
              </button>
            </div>
          </div>
        </section>

        <div className="operational-cta-section">
          <p>Have an idea that needs a</p>
          <span>solid foundation?</span>
          <button type="button" className="cm-primary" onClick={onContact}>
            Contact Us
          </button>
        </div>
      </section>
    );
  }

  if (id === "visual-identity") {
    return (
      <section className="sticky-page works-detail-page operational-detail-page visual-detail-page">
        <div className="page-header">
          <div className="page-breadcrumb">
            {breadcrumbs}
            <button
              type="button"
              className="operational-close"
              onClick={onClose}
              aria-label="Close visual identity and ux design details"
            >
              <img src="/icons/close.svg" alt="" />
            </button>
          </div>
          <h2>{detail.title}</h2>
        </div>

        <div className="home-section">
          <p>
            A system that works but feels wrong will be abandoned. We design the
            space between your backend logic and your user's intuition. A brand
            that communicates trust, interfaces that guide without friction, and
            experiences that make digitalization feel like an upgrade, not an
            imposition.
            <br />
            <br />
            <br />
            You might need this if...
          </p>
        </div>
        <div className="needs-grid" role="list">
          {VISUAL_NEED_CARDS.map((card) => (
            <article key={card.title} className="needs-card" role="listitem">
              <h4>{card.title}</h4>
              <p>{card.description}</p>
            </article>
          ))}
        </div>

        <h2>What we deliver</h2>

        <section className="operational-how-we-work works-detail-section-block">
          <div className="page-section">
            <div className="operational-how-grid visual-deliver-grid">
              <div
                className="operational-how-image visual-deliver-image"
                aria-hidden
              >
                <img
                  src="https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780581/visual-what_iw8puv.png"
                  alt=""
                />
              </div>

              <div className="operational-steps" role="list">
                {VISUAL_DELIVER_STEPS.map((step) => (
                  <article
                    key={step.number}
                    className="operational-step"
                    role="listitem"
                  >
                    <span className="operational-step-number">
                      {step.number}
                    </span>
                    <div className="operational-step-content">
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <h2>How we work</h2>

        <section className="operational-how-we-work works-detail-section-block">
          <div className="page-section">
            <div className="operational-how-grid">
              <div className="operational-steps" role="list">
                {VISUAL_WORK_STEPS.map((step) => (
                  <article
                    key={step.number}
                    className="operational-step"
                    role="listitem"
                  >
                    <span className="operational-step-number">
                      {step.number}
                    </span>
                    <div className="operational-step-content">
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="operational-how-image" aria-hidden>
                <img
                  src="https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780579/visual-how_hatmzf.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>

        <h2>Related projects</h2>

        <section className="detail-related works-detail-section-block">
          <div className="page-section">
            <div className="detail-related-panel">
              <article
                className="detail-related-card"
                onClick={() => onSelectProject?.("admin-scheduling-system")}
                style={{ cursor: "pointer" }}
              >
                <div className="detail-related-icon" aria-hidden>
                  <img
                    src="/icons/projects/admin-scheduling-system.svg"
                    alt=""
                  />
                </div>
                <div className="detail-related-content">
                  <h4>Admin Scheduling System Redesign</h4>
                  <div className="detail-related-desc-area">
                    <div className="detail-related-tags">
                      <p>Operational Architecture</p>
                      <p>Digital Infrastructure</p>
                    </div>
                    <p className="detail-related-hover-desc">
                      A scheduling system redesign focused on reducing cognitive
                      load for administrators working across fragmented tools.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="detail-related-view-link"
                  onClick={() => onSelectProject?.("admin-scheduling-system")}
                >
                  View case study
                </button>
              </article>

              <button
                type="button"
                className="detail-related-link"
                onClick={onOpenProjects}
              >
                View all projects
              </button>
            </div>
          </div>
        </section>

        <div className="operational-cta-section">
          <p>Ready for a brand that</p>
          <span>earns trust</span>
          <p>on first contact?</p>
          <button type="button" className="cm-primary" onClick={onContact}>
            Contact Us
          </button>
        </div>
      </section>
    );
  }

  if (id === "system-advisory") {
    return (
      <section className="sticky-page works-detail-page operational-detail-page system-advisory-detail-page">
        <div className="page-header">
          <div className="page-breadcrumb">
            {breadcrumbs}
            <button
              type="button"
              className="operational-close"
              onClick={onClose}
              aria-label="Close strategic systems advisory details"
            >
              <img src="/icons/close.svg" alt="" />
            </button>
          </div>
          <h2>{detail.title}</h2>
        </div>

        <div className="home-section">
          <p>
            Some problems don't need more execution. They need clearer thinking.
            We act as fractional CTO and CDO for founders and teams who need a
            senior technical and creative perspective at the table: on
            architecture choices, tooling decisions, hiring sequencing, and the
            long arc of the product.
            <br />
            <br />
            <br />
            You might need this if...
          </p>
        </div>
        <div className="needs-grid" role="list">
          {SYSTEM_NEED_CARDS.map((card) => (
            <article key={card.title} className="needs-card" role="listitem">
              <h4>{card.title}</h4>
              <p>{card.description}</p>
            </article>
          ))}
        </div>

        <h2>Engagement models</h2>

        <section className="works-engagement">
          <div className="works-engagement-media" aria-hidden>
            <img
              src="https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780577/systems-advisory_ycgbld.png"
              alt=""
            />
          </div>

          <div className="works-engagement-cards" role="list">
            {SYSTEM_ENGAGEMENT_MODELS.map((item) => (
              <article
                key={item.title}
                className="works-engagement-card"
                role="listitem"
              >
                <p>{item.label}</p>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <h2>How we engage</h2>

        <section className="operational-how-we-work works-detail-section-block">
          <div className="page-section">
            <div className="operational-how-grid">
              <div className="operational-steps" role="list">
                {SYSTEM_WORK_STEPS.map((step) => (
                  <article
                    key={step.number}
                    className="operational-step"
                    role="listitem"
                  >
                    <span className="operational-step-number">
                      {step.number}
                    </span>
                    <div className="operational-step-content">
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="operational-how-image" aria-hidden>
                <img
                  src="https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780577/systems-how_g1zvzt.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>

        <h2>Related projects</h2>

        <section className="detail-related works-detail-section-block">
          <div className="page-section">
            <div className="detail-related-panel">
              <article
                className="detail-related-card"
                onClick={() => onSelectProject?.("fishnet-recycling")}
                style={{ cursor: "pointer" }}
              >
                <div className="detail-related-icon" aria-hidden>
                  <img src="/icons/projects/fishnet-recycling.svg" alt="" />
                </div>
                <div className="detail-related-content">
                  <h4>Fishnet Recycling Management System</h4>
                  <div className="detail-related-desc-area">
                    <div className="detail-related-tags">
                      <p>Community Project</p>
                      <p>Initiative-driven project</p>
                    </div>
                    <p className="detail-related-hover-desc">
                      A management system developed to support the collection,
                      tracking, and reuse of discarded fishnets through
                      community collaboration.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="detail-related-view-link"
                  onClick={() => onSelectProject?.("fishnet-recycling")}
                >
                  View case study
                </button>
              </article>

              <button
                type="button"
                className="detail-related-link"
                onClick={onOpenProjects}
              >
                View all projects
              </button>
            </div>
          </div>
        </section>

        <div className="operational-cta-section">
          <p>Facing a decision that needs a</p>
          <span>clearer head</span>
          <p>in the room?</p>
          <button type="button" className="cm-primary" onClick={onContact}>
            Contact Us
          </button>
        </div>
      </section>
    );
  }
}
