import { useEffect, useState } from 'react'

function getScriptId() {
    const devId = import.meta.env.VITE_CONTACTS_SCRIPT_ID as string | undefined
    const prodId = (import.meta.env.CONTACTS_SCRIPT_ID as string | undefined) || undefined
    if (import.meta.env.MODE === 'development') return devId || prodId
    return prodId || devId
}

export default function ContactForm({ onClose, onDirtyChange }: { onClose?: () => void; onDirtyChange?: (d: boolean) => void }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [notes, setNotes] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        // reset when unmounted
        return () => {
            setSubmitting(false)
            onDirtyChange?.(false)
        }
    }, [onDirtyChange])

    useEffect(() => {
        const dirty = Boolean(name.trim() || email.trim() || phone.trim() || notes.trim())
        onDirtyChange?.(dirty)
    }, [name, email, phone, notes, onDirtyChange])

    async function handleSubmit(e?: React.FormEvent) {
        e?.preventDefault()
        setError(null)
        setSuccess(false)
        if (!name.trim() || !email.trim() || !notes.trim()) {
            setError('Please fill required fields (Name, Email, Note).')
            return
        }
        const id = getScriptId()
        if (!id) {
            setError('Contacts script ID not configured.');
            return
        }
        const url = `https://script.google.com/macros/s/${id}/exec`
        setSubmitting(true)
        try {
            const payload = { name: name.trim(), email: email.trim(), phone: phone.trim(), notes: notes.trim() }
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain; charset=utf-8' },
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error(`Status ${res.status}`)
            setSuccess(true)
            setTimeout(() => {
                setSubmitting(false)
                onDirtyChange?.(false)
                onClose?.()
            }, 900)
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err)
            setError(msg || 'Submit failed')
            setSubmitting(false)
        }
    }

    return (
        <div className="cm-dialog">
            <header className="cm-header">
                <h2>Contact</h2>
                <button className="cm-close" onClick={() => onClose?.()} aria-label="Close">✕</button>
            </header>

            <form className="cm-form" onSubmit={handleSubmit}>
                <label>
                    Name *
                    <input value={name} onChange={(e) => setName(e.target.value)} required />
                </label>

                <label>
                    Email *
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>

                <label>
                    Phone
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>

                <label>
                    Note *
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} required />
                </label>

                <div className="cm-actions">
                    <button type="button" className="cm-secondary" onClick={() => onClose?.()} disabled={submitting}>Cancel</button>
                    <button type="submit" className="cm-primary" disabled={submitting}>{submitting ? 'Sending...' : 'Send'}</button>
                </div>

                {error && <div className="cm-error">{error}</div>}
                {success && <div className="cm-success">Message sent — thank you.</div>}
            </form>
        </div>
    )
}
