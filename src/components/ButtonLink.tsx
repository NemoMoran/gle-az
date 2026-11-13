import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight } from '@phosphor-icons/react'

interface ButtonLinkProps {
  to: string
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'inverse'
  size?: 'default' | 'sm'
  /** Pfeil rechts (Standard), nach unten für Sprünge innerhalb der Seite, oder keiner. */
  icon?: 'right' | 'down' | 'none'
  className?: string
}

/** Link in Button-Optik mit Pfeil, der sich beim Hover leicht in Linkrichtung bewegt. */
export function ButtonLink({ to, children, variant = 'primary', size = 'default', icon = 'right', className }: ButtonLinkProps) {
  const classes = ['btn', `btn--${variant}`, size === 'sm' && 'btn--sm', icon !== 'none' && `btn--icon btn--icon-${icon}`, className]
    .filter(Boolean)
    .join(' ')
  const Icon = icon === 'down' ? ArrowDown : ArrowRight
  return (
    <Link to={to} className={classes}>
      {children}
      {icon !== 'none' && <Icon size={18} aria-hidden="true" />}
    </Link>
  )
}
