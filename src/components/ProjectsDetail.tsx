import type { ReactNode } from "react";

type Props = {
  id: string;
  breadcrumbs: ReactNode;
  onClose?: () => void;
  onOpenCarousel?: (carouselId: string) => void;
};

export default function ProjectsDetail({
  id,
  breadcrumbs,
  onClose,
  onOpenCarousel,
}: Props) {
  if (id === "admin-scheduling-system") {
    return (
      <section className="sticky-page projects-detail-page">
        <div className="page-header">
          <div className="page-breadcrumb">
            {breadcrumbs}
            <button
              type="button"
              className="operational-close"
              onClick={onClose}
              aria-label="Close admin scheduling system case study"
            >
              <img src="/icons/close.svg" alt="" />
            </button>
          </div>
          <h2>Admin Scheduling System</h2>
        </div>

        <div className="page-section projects-detail-section">
          <h3>Redesign/ Operational UX Case Study</h3>

          <div className="projects-meta-grid">
            <div>
              <p className="projects-meta-label">Duration:</p>
              <p>3 weeks build + 1 week support</p>

              <p className="projects-meta-label">Role:</p>
              <p>
                UX Research, System Design, Wireframing, Usability Testing,
                Product Direction
              </p>
            </div>

            <div>
              <p className="projects-meta-label">Context:</p>
              <p>
                An education organization coordinating tutors and students
                across multiple tools, time zones, and availability constraints.
              </p>
            </div>
          </div>

          <p className="projects-lead-statement">
            Redesigning a fragile, manual scheduling workflow <br />
            into a <span> system-enforced</span> operational tool.
          </p>

          <p>
            This project focuses on transforming a spreadsheet-based scheduling
            process into a reliable, scalable admin system where decisions are
            made once and enforced by the system.
          </p>

          <h3>
            Operational Map
            <button
              type="button"
              className="carousel-eye-btn"
              onClick={() => onOpenCarousel?.("carousel-operational-map")}
              aria-label="View Operational Map carousel"
            >
              <img src="/icons/eye.svg" alt="" />
            </button>
          </h3>
          <div
            className="projects-image-block projects-image-block-clickable"
            onClick={() => onOpenCarousel?.("carousel-operational-map")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                onOpenCarousel?.("carousel-operational-map");
            }}
          >
            <img
              src="https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780570/brainstorm-operational-map_viasle.png"
              alt="Operational map of scheduling system"
            />
          </div>
        </div>

        <h2>Background</h2>

        <div className="page-section projects-detail-section">
          <div className="projects-accent-panel">
            <p>
              This project started from direct involvement, not a sales pitch.
            </p>
            <p>
              We were initially volunteering as English tutors within the
              organization. While working inside the system, we noticed that the
              entire scheduling operation relied on manual spreadsheets, visual
              memory, and repeated data entry.
            </p>
            <p className="projects-emphasis-text">
              The system “worked”, but only because a single admin held all the
              logic in their head.
            </p>

            <div className="projects-two-col projects-two-col-tight">
              <div>
                <p>This created silent risks:</p>
                <ul>
                  <li>High error probability</li>
                  <li>No single source of truth</li>
                  <li>No protection against invalid actions</li>
                  <li>Extreme person dependency</li>
                </ul>
              </div>

              <div className="projects-right-column">
                <p>
                  We first proposed improvements voluntarily, addressing
                  critical risks.
                </p>
                <p>
                  After initial alignment and trust, this evolved into a full
                  admin system redesign.
                </p>
              </div>
            </div>
          </div>

          <h3>
            Before State
            <button
              type="button"
              className="carousel-eye-btn"
              onClick={() => onOpenCarousel?.("carousel-before-state")}
              aria-label="View Before State carousel"
            >
              <img src="/icons/eye.svg" alt="" />
            </button>
          </h3>
          <div
            className="projects-image-block projects-image-block-clickable"
            onClick={() => onOpenCarousel?.("carousel-before-state")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                onOpenCarousel?.("carousel-before-state");
            }}
          >
            <img
              src="https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780578/brainstorm-before-state_sar1km.png"
              alt="Before state of manual scheduling process"
            />
          </div>
        </div>

        <h2>The Problem</h2>

        <div className="page-section projects-detail-section">
          <div className="projects-accent-panel">
            <p className="projects-emphasis-text">
              The existing workflow was not designed as a system. It evolved as
              a collection of tools.
            </p>

            <div className="projects-two-col projects-two-col-tight">
              <div>
                <p className="projects-sub-emphasis">Key issues:</p>
                <ul>
                  <li>Availability existed in multiple places</li>
                  <li>Scheduling decisions were recreated manually</li>
                  <li>Status logic lived in colors and memory</li>
                  <li>Conflicts were discovered after they happened</li>
                  <li>Scaling meant exponential cognitive load</li>
                </ul>
              </div>

              <div>
                <p className="projects-sub-emphasis">Core problem:</p>
                <p>One decision, multiple representations, zero enforcement.</p>
              </div>
            </div>
          </div>

          <h3>
            Before Workflow
            <button
              type="button"
              className="carousel-eye-btn"
              onClick={() => onOpenCarousel?.("carousel-before-workflow")}
              aria-label="View Before Workflow carousel"
            >
              <img src="/icons/eye.svg" alt="" />
            </button>
          </h3>
          <div
            className="projects-image-block projects-image-block-clickable"
            onClick={() => onOpenCarousel?.("carousel-before-workflow")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                onOpenCarousel?.("carousel-before-workflow");
            }}
          >
            <img
              src="https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780572/brainstorm-before-workflow_b6m8df.png"
              alt="Before workflow representation"
            />
          </div>

          <h3>Design Goals</h3>
          <p className="projects-emphasis-text">
            The goal was not to add features.
            <br /> It was to remove fragility.
          </p>

          <div className="projects-two-col">
            <div>
              <p className="projects-sub-emphasis">We designed for:</p>
              <ul>
                <li>One source of truth</li>
                <li>Zero duplicate actions</li>
                <li>System enforced availability</li>
                <li>Conflict-proof scheduling</li>
                <li>Reduced cognitive load for admins</li>
              </ul>
            </div>

            <div>
              <p className="projects-sub-emphasis">Explicit non-goals:</p>
              <ul>
                <li>Student self-booking</li>
                <li>Payments</li>
                <li>Curriculum Management</li>
              </ul>
            </div>
          </div>
        </div>

        <h2>Solution Overview</h2>

        <div className="page-section projects-detail-section">
          <div className="projects-accent-panel">
            <p className="projects-emphasis-text">
              We designed an admin-first scheduling system where the system, not
              the admin, carries the logic.
            </p>

            <div className="projects-two-col projects-two-col-tight">
              <div>
                <p className="projects-sub-emphasis">Key components:</p>
                <ul>
                  <li>Availability Explorer as a single entry point</li>
                  <li>System generated time slots</li>
                  <li>Real-time availability calculation</li>
                  <li>Share-ready availability exports</li>
                  <li>Automatic synchronization across views</li>
                </ul>
              </div>

              <div className="projects-right-column projects-bottom-callout">
                <p>
                  Admins no longer interpret data. They select from valid
                  options only.
                </p>
              </div>
            </div>
          </div>

          <h3>Key UX Decisions</h3>
          <div className="projects-decisions-grid">
            <article>
              <p className="projects-decision-title">
                Availability is computed, not edited
              </p>
              <p>Time is treated as structured data, not text.</p>
            </article>
            <article>
              <p className="projects-decision-title">Shallow navigation</p>
              <p>Everything is reachable within two steps.</p>
            </article>
            <article>
              <p className="projects-decision-title">
                Invalid actions are blocked
              </p>
              <p>No warnings after mistakes.</p>
              <p>Mistakes are structurally impossible.</p>
            </article>
            <article>
              <p className="projects-decision-title">
                Sharing is part of the workflow
              </p>
              <p>
                Availability can be copied or exported in one action, optimized
                for Teams.
              </p>
            </article>
          </div>

          <h3>Outcome</h3>
          <div className="projects-two-col projects-two-col-tight">
            <div>
              <p className="projects-sub-emphasis">The final system:</p>
              <ul>
                <li>Eliminated duplicate scheduling work</li>
                <li>Reduced admin cognitive load</li>
                <li>Prevented conflicts by design</li>
                <li>Created a reliable operational backbone</li>
                <li>Scaled without relying on individual memory</li>
              </ul>
            </div>

            <div className="projects-right-column projects-bottom-callout">
              <p>
                What started as a volunteer observation became a
                production-ready operational system.
              </p>
            </div>
          </div>

          <h3>
            After Workflow
            <button
              type="button"
              className="carousel-eye-btn"
              onClick={() => onOpenCarousel?.("carousel-after-workflow")}
              aria-label="View After Workflow carousel"
            >
              <img src="/icons/eye.svg" alt="" />
            </button>
          </h3>
          <div
            className="projects-image-block projects-image-block-clickable"
            onClick={() => onOpenCarousel?.("carousel-after-workflow")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                onOpenCarousel?.("carousel-after-workflow");
            }}
          >
            <img
              src="https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780573/brainstorm-after-workflow_yh7jrq.png"
              alt="After workflow of redesigned admin scheduling system"
            />
          </div>

          <h3>
            High Identity UI
            <button
              type="button"
              className="carousel-eye-btn"
              onClick={() => onOpenCarousel?.("carousel-high-identity-ui")}
              aria-label="View High Identity UI carousel"
            >
              <img src="/icons/eye.svg" alt="" />
            </button>
          </h3>
          <div
            className="projects-ui-stack"
            aria-hidden
            onClick={() => onOpenCarousel?.("carousel-high-identity-ui")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                onOpenCarousel?.("carousel-high-identity-ui");
            }}
            style={{ cursor: "pointer" }}
          >
            <img
              src="https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780571/brainstorm-ui-1_zxm4sa.png"
              alt=""
              className="projects-ui-stack-item projects-ui-stack-item-1"
            />
            <img
              src="https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780571/brainstorm-ui-2_iadknn.png"
              alt=""
              className="projects-ui-stack-item projects-ui-stack-item-2"
            />
            <img
              src="https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780575/brainstorm-ui-3_wmrrze.png"
              alt=""
              className="projects-ui-stack-item projects-ui-stack-item-3"
            />
          </div>

          <div className="projects-why-panel">
            <p className="projects-why-title">Why This Matters</p>
            <p>
              When systems rely on human memory, they do not scale.
              <span className="projects-why-emphasis">
                They break silently.
              </span>
            </p>
            <p>
              This project replaces manual interpretation with enforced logic,
              and fragile workflows with reliable structure.
            </p>
            <p className="projects-why-subtle">
              It represents how Minga approaches work:
              <span>
                by designing for sustainability, <br /> not just usability.
              </span>
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (id === "fishnet-recycling") {
    return (
      <section className="sticky-page projects-detail-page">
        <div className="page-header">
          <div className="page-breadcrumb">
            {breadcrumbs}
            <button
              type="button"
              className="operational-close"
              onClick={onClose}
              aria-label="Close fishnet recycling case study"
            >
              <img src="/icons/close.svg" alt="" />
            </button>
          </div>
          <h2>Fishnet Recycling Management System</h2>
        </div>

        <div className="page-section projects-detail-section">
          <h3>Case Study in Progress</h3>
          <p>
            This inner page is being prepared and will be published with the
            same format soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="sticky-page projects-detail-page">
      <div className="page-header">
        <div className="page-breadcrumb">
          {breadcrumbs}
          <button
            type="button"
            className="operational-close"
            onClick={onClose}
            aria-label="Close project case study"
          >
            <img src="/icons/close.svg" alt="" />
          </button>
        </div>
        <h2>Project Case Study</h2>
      </div>
      <div className="page-section projects-detail-section">
        <h3>Case Study in Progress</h3>
        <p>This project detail page will be added soon.</p>
      </div>
    </section>
  );
}
