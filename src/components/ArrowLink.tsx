import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'

interface ArrowLinkProps {
  to: string
  children: ReactNode
  /** `light` für Links auf Fotos und dunklen Flächen. */
  tone?: 'default' | 'light'
  className?: string
}

/** Textlink mit Pfeil; die Unterstreichung zeichnet sich beim Hover von links nach. */
export function ArrowLink({ to, children, tone = 'default', className }: ArrowLinkProps) {
  const classes = ['arrow-link', tone === 'light' && 'arrow-link--light', className].filter(Boolean).join(' ')
  return (
    <Link to={to} className={classes}>
      <span className="arrow-link__label">{children}</span>
      <ArrowRight size={18} weight="bold" aria-hidden="true" />
    </Link>
  )
}
