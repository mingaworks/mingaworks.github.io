import type { ReactNode } from "react";

type Props = {
  breadcrumbs: ReactNode;
  onJoinClick: () => void;
  onClose?: () => void;
};

export default function InitiativeDonate({
  breadcrumbs,
  onJoinClick,
  onClose,
}: Props) {
  return (
    <section className="sticky-page initiative-donate-page">
      <div className="page-header">
        <div className="page-breadcrumb">
          {breadcrumbs}
          <button
            type="button"
            className="operational-close"
            onClick={onClose}
            aria-label="Close donate page"
          >
            <img src="/icons/close.svg" alt="" />
          </button>
        </div>
        <h2>Support collective work</h2>
      </div>
      <p className="page-section">
        Some of the work carried through Minga Initiative exists outside
        commercial structures. It requires time, care, and continuity rather
        than short-term delivery. Donations help sustain this work and allow
        initiatives to grow without compromising their values.
      </p>

      <h3>What donations support</h3>
      <ul>
        <li>Long-term community and ecological projects</li>
        <li>Research, documentation, and knowledge sharing</li>
        <li>Tools and resources used collectively</li>
        <li>Care work that often remains invisible but essential</li>
      </ul>

      <h3>A note on transparency</h3>
      <p>
        We aim to keep our use of shared resources clear and responsible.
        Donations are directed toward initiative-driven work and the people
        involved in sustaining it. Whenever relevant, outcomes and learnings are
        shared openly with the community.
      </p>

      <h2>How to donate</h2>

      <div className="initiative-donate-columns">
        <section>
          <h3>Ways to support</h3>
          <div className="initiative-donate-button-group">
            <p>One-time donation</p>
            <button type="button" className="cm-primary">
              Donate
            </button>
          </div>

          <div className="initiative-donate-button-group">
            <p>Ongoing support</p>
            <button type="button" className="cm-primary">
              Donate
            </button>
          </div>
        </section>

        <section>
          <h3>Other ways to contribute</h3>
          <p>
            Support does not have to be financial. If you want to contribute
            time, skills, or knowledge, joining the waitlist is another way to
            stay connected.
          </p>
          <div className="initiative-action-row">
            <button type="button" className="cm-primary" onClick={onJoinClick}>
              Join Us
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}
