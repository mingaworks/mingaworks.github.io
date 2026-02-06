import { forwardRef } from 'react'
import Icon from './Icon'

type Branch = { id: string; label?: string }

type Props = {
  branches: Branch[]
  breadcrumb: string[]
  onClick: (id: string) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  collapsed: boolean
}

const Sidebar = forwardRef<HTMLElement, Props>(function Sidebar(
  { branches, breadcrumb, onClick, onMouseEnter, onMouseLeave, collapsed },
  ref,
) {
  return (
    <aside
      ref={ref}
      className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}
      aria-label="Primary"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="sidebar-brand">
        <img src="/images/minga-initiative.svg" alt="Minga Initiative" />
      </div>
      <ul>
        <li className="base-item">
          <div className="base-toggle">
            <button onClick={() => onClick('base')} className={breadcrumb[0] === 'base' ? 'active' : ''}>
              <Icon name="base" className="submenu-icon" title="base" />
              <span className="menu-label">.base</span>
            </button>
            <span className="collapse-icon" aria-hidden>⌄</span>
          </div>

          <ul className="sub-menu" aria-hidden>
            <li>
              <button onClick={() => onClick('about')}>About</button>
            </li>
            <li>
              <button onClick={() => onClick('waitlist')}>Join</button>
            </li>
            <li>
              <button onClick={() => onClick('contact')}>Contact</button>
            </li>
          </ul>
        </li>
        {branches.map((b) => (
          <li key={b.id}>
            <button onClick={() => onClick(b.id)} className={breadcrumb[0] === b.id ? 'active' : ''}>
              <Icon name={b.id} className="submenu-icon" title={b.label} />
              <span className="menu-label">{b.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
})

export default Sidebar
