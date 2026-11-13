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

export function ArrowLink({ to, children, tone = 'default', className }: ArrowLinkProps) {
  const classes = ['arrow-link', tone === 'light' && 'arrow-link--light', className].filter(Boolean).join(' ')
  return (
    <Link to={to} className={classes}>
      {children}
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  )
}
