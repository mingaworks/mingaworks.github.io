import { useEffect, useMemo, useRef, useState } from 'react'
import treeData from '../data/tree.json'
const DATA = treeData as unknown as { base: TreeNode; branches: TreeNode[] }
import ContactForm from './ContactForm'

type ValueItem = {
  title: string
  desc?: string
}

type TeamMember = {
  name: string
  role?: string
  bio?: string
  avatar?: string
}

type Collaborate = {
  title?: string
  text?: string
  cta?: { label?: string; href?: string }
}

type TreeNode = {
  id: string
  label?: string
  title?: string
  content?: string
  summary?: string
  children?: TreeNode[]
  intro?: string[]
  values?: ValueItem[]
  vision?: string
  team?: TeamMember[]
  collaborate?: Collaborate
}

type Node = TreeNode

function findBranchById(id: string): Node | undefined {
  return DATA.branches.find((b: Node) => b.id === id)
}

function findNodeById(id: string, nodes?: Node[]): Node | undefined {
  if (!nodes) return undefined
  for (const n of nodes) {
    if (n.id === id) return n
    if (n.children) {
      const sub = findNodeById(id, n.children)
      if (sub) return sub
    }
  }
  return undefined
}

export default function TwoPaneLayout({ onRequestContact }: { onRequestContact?: () => void }) {
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['base'])
  const [sidebarHover, setSidebarHover] = useState(false)
  const sidebarRef = useRef<HTMLElement | null>(null)
  const prevLen = useRef<number>(breadcrumb.length)
  const [contactOpen, setContactOpen] = useState(false)
  const [contactDirty, setContactDirty] = useState(false)

  useEffect(() => {
    prevLen.current = breadcrumb.length
  }, [breadcrumb.length])

  function confirmDiscard(): boolean {
    return window.confirm('You have unsaved changes. Discard and continue?')
  }

  function attemptNavigate(action: () => void) {
    if (contactOpen && contactDirty) {
      if (!confirmDiscard()) return
    }
    setContactOpen(false)
    setContactDirty(false)
    action()
  }

  function handleSidebarClick(id: string) {
    attemptNavigate(() => {
      if (id === 'base') setBreadcrumb(['base'])
      else setBreadcrumb([id])
      setSidebarHover(false)
    })
  }

  function handleSidebarMouseEnter() {
    // measure label widths and expand to fit longest
    const el = sidebarRef.current
    if (!el) return
    const labels = Array.from(el.querySelectorAll<HTMLElement>('.menu-label'))
    let max = 0
    for (const l of labels) {
      const w = l.scrollWidth
      if (w > max) max = w
    }
    const iconArea = 40 // icon + padding
    const padding = 40
    const desired = Math.min(360, Math.ceil(max + iconArea + padding))
    el.style.setProperty('--expanded-width', `${desired}px`)
    setSidebarHover(true)
  }

  function handleSidebarMouseLeave() {
    setSidebarHover(false)
    if (sidebarRef.current) sidebarRef.current.style.removeProperty('--expanded-width')
  }

  function handleSlotAClick(id: string) {
    attemptNavigate(() => {
      setBreadcrumb((b) => {
        if (b.length === 1 && b[0] !== 'base') {
          return [...b, id]
        }
        return [...b.slice(0, 1), id]
      })
    })
  }

  function handleSlotBClick(id: string) {
    attemptNavigate(() => {
      setBreadcrumb((b) => [...b, id])
    })
  }

  function handleBreadcrumbClick(index: number) {
    attemptNavigate(() => {
      setBreadcrumb((b) => b.slice(0, index + 1))
    })
  }

  const isBase = breadcrumb.length === 1 && breadcrumb[0] === 'base'
  const slotAId = useMemo(() => {
    if (isBase) return null
    if (breadcrumb.length === 1) return breadcrumb[0]
    return breadcrumb[breadcrumb.length - 2]
  }, [breadcrumb, isBase])
  const slotBId = useMemo(() => {
    if (isBase) return 'base'
    if (breadcrumb.length === 1) return 'base'
    return breadcrumb[breadcrumb.length - 1]
  }, [breadcrumb, isBase])

  function getNode(id: string | null) {
    if (!id) return null
    if (id === 'base') return DATA.base
    const b = findBranchById(id)
    if (b) return b
    return findNodeById(id, DATA.branches)
  }

  const slotA = getNode(slotAId)
  const slotB = getNode(slotBId)
  const slotAContent = slotA ? (slotA.content ?? slotA.summary ?? '') : ''
  const slotBContent = slotB ? (slotB.content ?? slotB.summary ?? '') : ''

  return (
    <div className={`two-pane`}>
      <aside
        ref={sidebarRef}
        className={`sidebar ${!sidebarHover ? 'collapsed' : 'expanded'}`}
        aria-label="Primary"
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      >
        <ul>
          <li>
            <button onClick={() => handleSidebarClick('base')} className={breadcrumb[0] === 'base' ? 'active' : ''}>
              <img src={`/icons/base.svg`} alt="base" className="submenu-icon" />
              <span className="menu-label">.base</span>
            </button>
          </li>
          {DATA.branches.map((b: Node) => (
            <li key={b.id}>
              <button onClick={() => handleSidebarClick(b.id)} className={breadcrumb[0] === b.id ? 'active' : ''}>
                <img src={`/icons/${b.id}.svg`} alt={b.label} className="submenu-icon" />
                <span className="menu-label">{b.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="slots">
        <div className="slot slot-a" aria-hidden={isBase && !contactOpen}>
          {contactOpen ? (
            <ContactForm onClose={() => attemptNavigate(() => { })} onDirtyChange={setContactDirty} />
          ) : slotA ? (
            <>
              <div className="breadcrumbs" role="navigation" aria-label="Breadcrumbs">
                {breadcrumb.map((id, i) => {
                  const n = getNode(id)
                  const label = n?.label ?? n?.title ?? id
                  return (
                    <button key={id + i} onClick={() => handleBreadcrumbClick(i)} className="crumb">
                      {label}
                    </button>
                  )
                })}
              </div>

              <h3>{slotA.label ?? slotA.title}</h3>
              <p>{slotAContent}</p>
              {slotA.children && (
                <ul className="children-list">
                  {slotA.children.map((c: Node) => (
                    <li key={c.id}>
                      <button onClick={() => handleSlotAClick(c.id)}>
                        <span className="menu-label">{c.label ?? c.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : null}
        </div>

        <div className="slot slot-b">
          {slotB ? (
            <>
              {slotBId === 'base' ? (
                <>
                  <div className="hero-block">
                    <img src="/images/mingaworks.svg" alt="Mingaworks" />
                    <h1 className="visually-hidden">Mingaworks</h1>
                  </div>
                  <div className="base-header">
                    {/* Intro */}
                    {Array.isArray(slotB.intro) && slotB.intro.map((p: string, idx: number) => (
                      <p key={idx} className="leading">{p}</p>
                    ))}

                    {/* Values */}
                    <div>
                      <h2 className="section-subtitle">Values</h2>
                      <ul className="values-list">
                        {Array.isArray(slotB.values) && slotB.values.map((v: ValueItem) => (
                          <li key={v.title}><strong>{v.title}</strong> {v.desc}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Vision */}
                    <div style={{ marginTop: 20 }}>
                      <h2 className="section-subtitle">Vision</h2>
                      <p className="leading">{slotB.vision}</p>
                    </div>

                    {/* Collaborate Callout */}
                    {slotB.collaborate && (
                      <div className="callout card">
                        <h3>{slotB.collaborate.title}</h3>
                        <p>{slotB.collaborate.text}</p>
                        <button
                          type="button"
                          className="cta"
                          onClick={() => { setContactOpen(true); onRequestContact?.() }}
                        >
                          Contact
                        </button>
                      </div>
                    )}

                    {/* Team */}
                    <div style={{ marginTop: 20 }}>
                      <h2 className="section-subtitle">Core Members</h2>
                      <div className="team-grid">
                        {Array.isArray(slotB.team) && slotB.team.map((m: TeamMember) => (
                          <div key={m.name} className="member card">
                            {m.avatar && <img src={m.avatar} alt={m.name} className="member-avatar" />}
                            <div>
                              <h4>{m.name}</h4>
                              <p className="muted">{m.role ? <><strong>{m.role}</strong><br /></> : null}{m.bio}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <footer className="site-footer">
                      <span>© {new Date().getFullYear()} - from Minga with <span aria-hidden>❤️</span> –</span>
                      <svg className="github-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 012-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.001 8.001 0 0016 8c0-4.42-3.58-8-8-8z" />
                      </svg>
                    </footer>
                  </div>
                </>
              ) : (
                <>
                  <h2>{slotB.label ?? slotB.title}</h2>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{slotBContent}</p>
                  {slotB.children && (
                    <ul className="children-list">
                      {slotB.children.map((c: Node) => (
                        <li key={c.id}>
                          <button onClick={() => handleSlotBClick(c.id)}>
                            {c.label ?? c.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
