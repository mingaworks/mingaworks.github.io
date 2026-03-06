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
    <div className="sticky-page">
      <div className="page-header">
        <div className="page-breadcrumb">
          {breadcrumbs}
          <button
            type="button"
            className="operational-close"
            onClick={onClose}
            aria-label="Close waitlist page"
          >
            ×
          </button>
        </div>
        <h2>Join the Minga waitlist</h2>
      </div>

      <p className="page-section">
        Minga is building a shared space for knowledge, tools, and collective
        practices. The community page is still evolving, and we’re intentionally
        growing it slowly.
      </p>

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
        <button type="submit">Join Us</button>
      </form>

      <div className="waitlist-hero">
        <img
          src="https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780578/ladanse-waitlist-bg_z1qvn2.png"
          alt="Waitlist background"
        />
        <div className="hero-text">
          <p>
            Joining the waitlist means staying close to this process, not just
            receiving updates.
          </p>
        </div>
      </div>

      <p>By joining the waitlist, you will:</p>
      <ul>
        <li>Get early access to the community space when it opens</li>
        <li>
          Be invited to contribute, test, or collaborate on upcoming initiatives
        </li>
        <li>
          Receive occasional updates about new tools, research, and shared
          learnings
        </li>
      </ul>
    </div>
  );
}
