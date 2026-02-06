import React, { useState } from 'react'

export default function JoinUs({ breadcrumbs }: { breadcrumbs: React.ReactNode }) {
    const [email, setEmail] = useState('')
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        alert(`Thanks — we'll keep you posted: ${email}`)
        setEmail('')
    }

    return (
        <div className="inner-page waitlist-page">
            {breadcrumbs}

            <h2>Join the Minga waitlist</h2>

            <p style={{ fontSize: '1.25rem' }}>
                Minga is building a shared space for knowledge, tools, and collective practices. The
                community page is still evolving, and we’re intentionally growing it slowly.
            </p>

            <form className="waitlist-row" onSubmit={handleSubmit} aria-label="Join waitlist">
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
                <img src="/images/ladanse-waitlist-bg.png" alt="Waitlist background" />
                <div className="hero-text">
                    <p>
                        Joining the waitlist means staying close to this process, not just receiving updates.
                    </p>
                </div>
            </div>

            <p>By joining the waitlist, you will:</p>
            <ul>
                <li>Get early access to the community space when it opens</li>
                <li>Be invited to contribute, test, or collaborate on upcoming initiatives</li>
                <li>Receive occasional updates about new tools, research, and shared learnings</li>
            </ul>
        </div>
    )
}
