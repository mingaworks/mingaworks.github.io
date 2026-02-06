import { useEffect, useMemo, useRef, useState } from 'react'
import treeData from '../data/tree.json'
const DATA = treeData as unknown as { base: TreeNode; branches: TreeNode[] }
import ContactUs from './ContactUs'
import Breadcrumbs from './Breadcrumbs'
import Sidebar from './Sidebar'
import About from './AboutUs'
import JoinUs from './JoinUs'

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

const CUSTOM_PAGES: Record<string, { label: string; kind: 'about' | 'waitlist' | 'contact' }> = {
  about: { label: 'About Us', kind: 'about' },
  waitlist: { label: 'Join Us', kind: 'waitlist' },
  contact: { label: 'Contact us', kind: 'contact' },
}

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

export default function TwoPaneLayout() {
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['base'])
  const [sidebarHover, setSidebarHover] = useState(false)
  const sidebarRef = useRef<HTMLElement | null>(null)
  const prevLen = useRef<number>(breadcrumb.length)
  const [contactDirty, setContactDirty] = useState(false)

  useEffect(() => {
    prevLen.current = breadcrumb.length
  }, [breadcrumb.length])

  function confirmDiscard(): boolean {
    return window.confirm('You have unsaved changes. Discard and continue?')
  }

  const contactOpen = breadcrumb[breadcrumb.length - 1] === 'contact'

  function attemptNavigate(action: () => void) {
    if (contactOpen && contactDirty) {
      if (!confirmDiscard()) return
    }
    setContactDirty(false)
    action()
  }

  function handleSidebarClick(id: string) {
    attemptNavigate(() => {
      if (id === 'base') setBreadcrumb(['base'])
      else setBreadcrumb(['base', id])
      setSidebarHover(false)
    })
  }

  function handleSidebarMouseEnter() {
    const el = sidebarRef.current
    if (!el) return
    const labels = Array.from(el.querySelectorAll<HTMLElement>('.menu-label'))
    let max = 0
    for (const l of labels) {
      const w = l.scrollWidth
      if (w > max) max = w
    }
    const iconArea = 40
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
        if (b.length === 1) return ['base', id]
        return [...b.slice(0, -1), id]
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

  const hasSlotB = breadcrumb.length > 1
  const slotAId = useMemo(() => {
    if (breadcrumb.length === 1) return 'base'
    return breadcrumb[breadcrumb.length - 2]
  }, [breadcrumb])
  const slotBId = useMemo(() => {
    if (!hasSlotB) return null
    return breadcrumb[breadcrumb.length - 1]
  }, [breadcrumb, hasSlotB])

  function getNode(id: string | null) {
    if (!id) return null
    if (id === 'base') return DATA.base
    const b = findBranchById(id)
    if (b) return b
    return findNodeById(id, DATA.branches)
  }

  function getLabel(id: string) {
    if (CUSTOM_PAGES[id]) return CUSTOM_PAGES[id].label
    const n = getNode(id)
    return n?.label ?? n?.title ?? id
  }

  function getBreadcrumbItemsFor(id: string | null) {
    if (!id) return []
    const index = breadcrumb.lastIndexOf(id)
    const slice = index >= 0 ? breadcrumb.slice(0, index + 1) : breadcrumb
    return slice.map((crumbId) => ({ id: crumbId, label: getLabel(crumbId) }))
  }

  function getBreadcrumbVariantFor(id: string | null) {
    if (!id) return 'default' as const
    if (id === 'base') return 'inverted' as const
    return 'default' as const
  }

  function renderContactPage(breadcrumbs: React.ReactNode) {
    return (
      <ContactUs breadcrumbs={breadcrumbs} onDirtyChange={setContactDirty} />
    )
  }

  function renderNodePage(node: Node, slot: 'a' | 'b', breadcrumbs: React.ReactNode) {
    const content = node.content ?? node.summary ?? ''
    const HeadingTag = slot === 'a' ? 'h3' : 'h2'
    const onChildClick = slot === 'a' ? handleSlotAClick : handleSlotBClick
    return (
      <>
        {breadcrumbs}
        <HeadingTag>{node.label ?? node.title}</HeadingTag>
        <p style={{ whiteSpace: 'pre-wrap' }}>{content}</p>
        {node.children && (
          <ul className="children-list">
            {node.children.map((c: Node) => (
              <li key={c.id}>
                <button onClick={() => onChildClick(c.id)}>
                  <span className="menu-label">{c.label ?? c.title}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </>
    )
  }

  function renderSlotContent(id: string | null, slot: 'a' | 'b', breadcrumbs: React.ReactNode) {
    if (!id) return null
    if (id === 'base') {
      return (
        <div className="base-header">
          {breadcrumbs}

          <h1>What is Minga?</h1>

          <p className="lead-strong">Minga is a collaborative design and systems practice focused on making complex operations clearer, safer, and more humane.</p>

          <div className="base-row base-row-intro">
            <div style={{ flex: 3 }}>
              <p>
                We work at the intersection of design, technology, and real-world workflows. Our focus is not on decoration, trends, or surface-level UX, but on reducing risk, cognitive load, and invisible labor inside systems that people rely on every day. Minga exists to turn fragile, people-dependent processes into systems that can be trusted, shared, and scaled.
              </p>
            </div>

            <div style={{ flex: 1 }}>
              <button type="button" className="cta cta-outline" onClick={() => attemptNavigate(() => setBreadcrumb(['base', 'about']))}>
                About Us
              </button>
            </div>
          </div>

          <h2 className="section-subtitle">Future // Community Page // A space for publishing knowledge.</h2>

          <div className="base-row base-row-future">
            <div style={{ flex: 3 }}>
              <p>
                Minga approaches knowledge not as something owned by individuals, but as a practice that grows through sharing. This space is being designed as a community page where research, experiences, and collective learning come together.
              </p>
              <div>
                <button type="button" className="cta cta-outline" onClick={() => attemptNavigate(() => setBreadcrumb(['base', 'waitlist']))}>
                  Join Us
                </button>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <p>
                If you would like to work with us, learn more about our services, or collaborate on future projects, feel free to get in touch.
              </p>
              <div>
                <button type="button" className="cta cta-outline" onClick={() => attemptNavigate(() => setBreadcrumb(['base', 'contact']))}>
                  Contact us
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (CUSTOM_PAGES[id]?.kind === 'about') return <About breadcrumbs={breadcrumbs} />
    if (CUSTOM_PAGES[id]?.kind === 'waitlist') return <JoinUs breadcrumbs={breadcrumbs} />
    if (CUSTOM_PAGES[id]?.kind === 'contact') return renderContactPage(breadcrumbs)

    const node = getNode(id)
    if (!node) return null
    return renderNodePage(node, slot, breadcrumbs)
  }

  const crumbsA = getBreadcrumbItemsFor(slotAId)
  const variantA = getBreadcrumbVariantFor(slotAId)
  const breadcrumbsA = crumbsA.length ? (
    <Breadcrumbs items={crumbsA} onClick={handleBreadcrumbClick} variant={variantA} />
  ) : null

  const crumbsB = getBreadcrumbItemsFor(slotBId)
  const variantB = getBreadcrumbVariantFor(slotBId)
  const breadcrumbsB = crumbsB.length ? (
    <Breadcrumbs items={crumbsB} onClick={handleBreadcrumbClick} variant={variantB} />
  ) : null

  return (
    <div className="layout-root">
      <Sidebar
        ref={sidebarRef}
        branches={DATA.branches}
        breadcrumb={breadcrumb}
        onClick={handleSidebarClick}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
        collapsed={!sidebarHover}
      />

      <div className={`two-pane`}>
        <div className={`slots ${hasSlotB ? 'has-secondary' : 'single'}`}>
          <div className="slot slot-a">
            {renderSlotContent(slotAId, 'a', breadcrumbsA)}
          </div>

          <div className="slot slot-b" aria-hidden={!hasSlotB}>
            {hasSlotB ? renderSlotContent(slotBId, 'b', breadcrumbsB) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
