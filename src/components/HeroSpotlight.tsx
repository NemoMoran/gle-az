import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Pause, Play } from '@phosphor-icons/react'
import { selectedReferences } from '../config/selected-references'
import { portfolioImages } from './PortfolioImage'

const INTERVAL = 6000

/**
 * Kleine Karte im Hero, die nacheinander die ausgewählten Referenzen zeigt. Der Wechsel
 * läuft erst nach dem Laden an, lässt sich anhalten und bleibt bei reduzierter Bewegung
 * aus; die Segmente darunter wählen ein Projekt direkt.
 */
export function HeroSpotlight() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(true)
  }, [])

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % selectedReferences.length), INTERVAL)
    return () => window.clearTimeout(timer)
  }, [playing, index])

  const reference = selectedReferences[index]
  const image = portfolioImages(reference.project.pages[0])[reference.imageIndex]

  return (
    <aside className="spotlight" aria-label="Aus dem Portfolio" data-playing={playing ? '' : undefined}>
      <div className="spotlight__head">
        <span className="spotlight__label">Aus dem Portfolio</span>
        <button type="button" className="spotlight__toggle" onClick={() => setPlaying((value) => !value)}>
          {playing ? <Pause size={12} weight="fill" aria-hidden="true" /> : <Play size={12} weight="fill" aria-hidden="true" />}
          <span className="visually-hidden">{playing ? 'Projektwechsel anhalten' : 'Projektwechsel fortsetzen'}</span>
        </button>
      </div>

      <Link to={`/referenzen#projekt-${reference.id}`} className="spotlight__card" key={reference.id}>
        <img src={image.src} width={image.width} height={image.height} alt="" decoding="async" />
        <span className="spotlight__text">
          <span className="spotlight__title">{reference.title}</span>
          <span className="spotlight__meta">
            {reference.project.city} · {reference.type}
          </span>
        </span>
        <span className="spotlight__go" aria-hidden="true">
          <ArrowUpRight size={16} weight="bold" />
        </span>
      </Link>

      <div className="spotlight__segments" role="group" aria-label="Projekt wählen">
        {selectedReferences.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            className="spotlight__segment"
            aria-current={itemIndex === index ? 'true' : undefined}
            style={{ '--interval': `${INTERVAL}ms` } as CSSProperties}
            onClick={() => {
              setIndex(itemIndex)
              setPlaying(false)
            }}
          >
            <span className="visually-hidden">
              Projekt {itemIndex + 1}: {item.project.street}, {item.project.city}
            </span>
          </button>
        ))}
      </div>
    </aside>
  )
}
