import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUpRight } from '@phosphor-icons/react'

interface ButtonLinkProps {
  to: string
  children: ReactNode
  /** `accent` (sonnengrün) für dunkle Flächen und Fotos; `inverse` ist dessen früherer Name. */
  variant?: 'primary' | 'secondary' | 'accent' | 'inverse'
  size?: 'default' | 'sm'
  /** Pfeil (Standard), nach unten für Sprünge innerhalb der Seite, oder keiner. */
  icon?: 'right' | 'down' | 'none'
  className?: string
}

/**
 * Link in Button-Optik. Der Pfeil sitzt in einem eigenen Kreis; beim Hover verlässt
 * er ihn in Pfeilrichtung, während ein zweiter nachrückt.
 */
export function ButtonLink({ to, children, variant = 'primary', size = 'default', icon = 'right', className }: ButtonLinkProps) {
  const tone = variant === 'inverse' ? 'accent' : variant
  const classes = ['btn', `btn--${tone}`, size === 'sm' && 'btn--sm', icon !== 'none' && `btn--icon btn--icon-${icon}`, className]
    .filter(Boolean)
    .join(' ')
  const Icon = icon === 'down' ? ArrowDown : ArrowUpRight
  return (
    <Link to={to} className={classes}>
      <span className="btn__label">{children}</span>
      {icon !== 'none' && (
        <span className="btn__icon" aria-hidden="true">
          <Icon size={16} weight="bold" />
          <Icon size={16} weight="bold" />
        </span>
      )}
    </Link>
  )
}
