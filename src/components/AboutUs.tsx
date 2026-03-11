import React from "react";

export default function About({
  breadcrumbs,
  onClose,
  onWorksClick,
  onInitiativeClick,
}: {
  breadcrumbs: React.ReactNode;
  onClose?: () => void;
  onWorksClick?: () => void;
  onInitiativeClick?: () => void;
}) {
  return (
    <div className="sticky-page about-page">
      <div className="page-header">
        <div className="page-breadcrumb">
          {breadcrumbs}
          <button
            type="button"
            className="operational-close"
            onClick={onClose}
            aria-label="Close about page"
          >
            <img src="/icons/close.svg" alt="" />
          </button>
        </div>
        <h2>Vision</h2>
      </div>
      <div className="page-section">
        <section>
          <p>
            We believe that many operational problems are not caused by people,
            but by systems that ask too much from human memory, attention, and
            discipline.
          </p>
          <p>Our vision is a world where systems:</p>
          <ul>
            <li>prevent mistakes instead of reacting to them,</li>
            <li>make the right action obvious,</li>
            <li>protect people from carrying invisible operational stress</li>
          </ul>
          <p>
            Good systems do not demand heroics. They support calm, sustainable
            work.
          </p>
        </section>
      </div>

      <h2>Mission</h2>
      <div className="page-section">
        <section>
          <p>Minga’s mission is to design operational clarity.</p>
          <p>We do this by:</p>
          <ul>
            <li>identifying structural risks inside workflows</li>
            <li>translating human decisions into system rules</li>
            <li>
              designing interfaces that enforce correctness, not just suggest it
            </li>
            <li>creating tools that remain understandable as they scale</li>
          </ul>
          <p>Our starting point is always reality.</p>
          <p>We work closely with real operations, not hypothetical users.</p>
        </section>
      </div>

      <div className="about-image-wrap">
        <img
          className="about-image"
          src="https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780577/inspiration_dbk05e.png"
          alt="Matisse dance"
        />
      </div>

      <h2>Inspirations</h2>
      <div className="page-section inspirations-content">
        <p style={{ fontSize: "1.25rem" }}>
          Minga is inspired by collective ways of working where responsibility
          moves through the group rather than sitting on individuals.
        </p>

        <p>
          We value systems thinking over feature accumulation, calm technology
          over constant stimulation, and humane interfaces that quietly support
          people instead of demanding attention. We believe the best design is
          the one that disappears once it works.
        </p>

        <div>
          <p style={{ margin: "0" }}>
            The name Minga comes from a tradition of communal effort:
          </p>
          <p style={{ fontSize: "1.2rem", margin: "0" }}>
            People coming together to solve a shared problem, not for individual
            recognition, but for collective stability.
          </p>
        </div>

        <p>
          This idea of moving together, responding to one another, and adjusting
          in rhythm also connects to dance as a form of shared intelligence.
        </p>

        <p
          style={{ textAlign: "center", fontSize: "1.4rem", margin: "4rem 0" }}
        >
          Like a dance, Minga is not about standing out,
          <br /> but about staying in relation.
        </p>

        <div className="about-logos">
          <div
            style={{ cursor: "pointer" }}
            onClick={onWorksClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onWorksClick?.()}
            aria-label="Navigate to Works"
          >
            <img src="/images/mingaworks.svg" alt="Minga Works" />
          </div>
          <div
            style={{ cursor: "pointer" }}
            onClick={onInitiativeClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onInitiativeClick?.()}
            aria-label="Navigate to Initiative"
          >
            <img src="/images/mingainitiative.svg" alt="Minga Initiative" />
          </div>
        </div>
      </div>
    </div>
  );
}
