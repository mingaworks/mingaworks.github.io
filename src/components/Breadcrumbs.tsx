type Crumb = { id: string; label: string }
type Variant = 'inverted' | 'default'

export default function Breadcrumbs({
  items,
  onClick,
  variant = 'inverted',
}: {
  items: Crumb[]
  onClick?: (index: number) => void
  variant?: Variant
}) {
  return (
    <nav className={`floating-breadcrumb variant-${variant}`} aria-label="Breadcrumbs">
      {items.map((it, i) => (
        <button
          key={it.id + i}
          className="crumb"
          type="button"
          onClick={() => onClick?.(i)}
        >
          {it.label}
        </button>
      ))}
    </nav>
  )
}
