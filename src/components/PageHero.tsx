import type { ReactNode } from 'react'
import { Picture, type ImageName } from './Picture'
import { SplitText } from './SplitText'

interface PageHeroProps {
  /** Kleine Zeile über der Überschrift, in der Regel der Name der Seite. */
  eyebrow?: string
  /** Überschrift der Seite (h1); `\n` setzt einen Zeilenumbruch. */
  title: string
  lead?: string
  /** Breites Foto unter dem Kopf, mit Parallaxe. */
  image?: ImageName
  /** Zusätzlicher Inhalt neben dem Einleitungssatz, z. B. Sprungmarken. */
  children?: ReactNode
  /** `compact` für Seiten, deren Inhalt früh beginnen soll (Kontakt, Rechtstexte). */
  size?: 'default' | 'compact'
}

/** Kopf der Unterseiten: große Überschrift links, Einleitung rechts, darunter optional ein Bildband. */
export function PageHero({ eyebrow, title, lead, image, children, size = 'default' }: PageHeroProps) {
  const classes = ['page-hero', image && 'page-hero--photo', size === 'compact' && 'page-hero--compact'].filter(Boolean).join(' ')
  return (
    <header className={classes}>
      <div className="container page-hero__inner">
        <div className="page-hero__title">
          {eyebrow && <p className="eyebrow page-hero__eyebrow">{eyebrow}</p>}
          <h1>
            <SplitText reveal={false}>{title}</SplitText>
          </h1>
        </div>
        {(lead || children) && (
          <div className="page-hero__aside">
            {lead && <p className="lead">{lead}</p>}
            {children}
          </div>
        )}
      </div>
      {image && (
        <div className="page-hero__band">
          <div className="page-hero__media frame" data-parallax>
            <Picture name={image} sizes="100vw" priority />
          </div>
        </div>
      )}
    </header>
  )
}
