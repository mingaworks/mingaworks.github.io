import React, { useState } from "react";

export default function JoinUs({
  breadcrumbs,
  onClose,
}: {
  breadcrumbs: React.ReactNode;
  onClose?: () => void;
}) {
  const [email, setEmail] = useState("");
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert(`Thanks — we'll keep you posted: ${email}`);
    setEmail("");
  }

  return (
    <div className="sticky-page works-detail-page">
      <div className="page-header">
        <div className="page-breadcrumb">
          {breadcrumbs}
          <button
            type="button"
            className="operational-close"
            onClick={onClose}
            aria-label="Close waitlist page"
          >
            <img src="/icons/close.svg" alt="" />
          </button>
        </div>
        <h2>Join the Minga waitlist</h2>
      </div>

      <div className="home-section">
        <p>
          Minga is building a shared space for knowledge, tools, and collective
          practices. The community page is still evolving, and we're
          intentionally growing it slowly.
        </p>
      </div>

      <form
        className="waitlist-row"
        onSubmit={handleSubmit}
        aria-label="Join waitlist"
      >
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="cm-primary" type="submit">
          Join Us
        </button>
      </form>

      <div className="waitlist-hero">
        <div className="hero-text">
          <p>
            Joining the waitlist means staying close to this process, <br />
            not just receiving updates.
          </p>
        </div>
        <img
          src="https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780578/ladanse-waitlist-bg_z1qvn2.png"
          alt="Waitlist background"
        />
      </div>

      <div className="home-section">
        <p>By joining the waitlist, you will:</p>
        <ul style={{ marginBottom: "4rem" }}>
          <li>Get early access to the community space when it opens</li>
          <li>
            Be invited to contribute, test, or collaborate on upcoming
            initiatives
          </li>
          <li>
            Receive occasional updates about new tools, research, and shared
            learnings
          </li>
        </ul>
      </div>
    </div>
  );
}
