import { useEffect, useState } from "react";
import type { ReactNode } from "react";

function getScriptId() {
  const devId = import.meta.env.VITE_CONTACTS_SCRIPT_ID as string | undefined;
  const prodId =
    (import.meta.env.CONTACTS_SCRIPT_ID as string | undefined) || undefined;
  if (import.meta.env.MODE === "development") return devId || prodId;
  return prodId || devId;
}

export default function ContactUs({
  breadcrumbs,
  onDirtyChange,
  onClose,
}: {
  breadcrumbs?: ReactNode;
  onDirtyChange?: (d: boolean) => void;
  onClose?: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    return () => onDirtyChange?.(false);
  }, [onDirtyChange]);

  useEffect(() => {
    const dirty = Boolean(
      name.trim() || email.trim() || phone.trim() || notes.trim(),
    );
    onDirtyChange?.(dirty);
  }, [name, email, phone, notes, onDirtyChange]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !notes.trim()) {
      setError("Please fill required fields (Name, Email, Note).");
      return;
    }
    const id = getScriptId();
    if (!id) {
      setError("Contacts script ID not configured.");
      return;
    }

    const url = `https://script.google.com/macros/s/${id}/exec`;
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notes: notes.trim(),
      };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setName("");
      setEmail("");
      setPhone("");
      setNotes("");
      onDirtyChange?.(false);
      setSubmitting(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Submit failed");
      setSubmitting(false);
    }
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
            aria-label="Close contact page"
          >
            <img src="/icons/close.svg" alt="" />
          </button>
        </div>
        <h2>Get in Touch</h2>
      </div>

      <div className="home-section">
        <p>
          We work with small teams and coordination-based organizations that
          need clarity, not more tools. If you're interested in our services,
          have a specific challenge in mind, or want to explore a collaboration,
          let's talk.
        </p>
      </div>

      <form className="cm-form" onSubmit={handleSubmit}>
        <label>
          Name *
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Email *
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Phone
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>

        <label>
          Message *
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />
        </label>

        <div className="cm-actions">
          <button type="submit" className="cm-primary" disabled={submitting}>
            {submitting ? "Sending..." : "Contact Us"}
          </button>
        </div>

        {error && <div className="cm-error">{error}</div>}
        {showToast && (
          <div className="toast toast-success" role="status" aria-live="polite">
            Message sent, thank you.
          </div>
        )}
      </form>

      <div className="home-section">
        <p>You can contact us if you want to:</p>
        <ul>
          <li>Get support with digital tools, systems, or workflows</li>
          <li>Discuss branding, product, or service design</li>
          <li>Explore long-term or research-based collaborations</li>
        </ul>
      </div>
    </div>
  );
}
