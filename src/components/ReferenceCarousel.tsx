import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react'
import { selectedReferences } from '../config/selected-references'
import { ArrowLink } from './ArrowLink'
import { PortfolioImage } from './PortfolioImage'
import { SplitText } from './SplitText'

/**
 * Die ausgewählten Referenzen als waagerechte Strecke: wischen, mit der Maus ziehen,
 * per Tastatur durch die Karten gehen oder die Pfeile nutzen. Jede Karte führt zum
 * Projekt auf der Referenzseite.
 */
export function ReferenceCarousel() {
  const trackRef = useRef<HTMLUListElement>(null)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  const [progress, setProgress] = useState(0)
  const [edge, setEdge] = useState<'start' | 'middle' | 'end'>('start')

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const update = () => {
      const max = track.scrollWidth - track.clientWidth
      const value = max > 0 ? track.scrollLeft / max : 0
      setProgress(value)
      setEdge(value < 0.01 ? 'start' : value > 0.99 ? 'end' : 'middle')
    }
    update()
    track.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      track.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const step = (direction: 1 | -1) => {
    const track = trackRef.current
    const card = track?.querySelector<HTMLElement>('.ref-card')
    if (!track || !card) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollBy({ left: direction * (card.offsetWidth + 20), behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  // Ziehen mit der Maus. Während des Ziehens rastet nichts ein; danach übernimmt das Einrasten wieder.
  const onPointerDown = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft, moved: false }
  }

  const onPointerMove = (event: PointerEvent<HTMLUListElement>) => {
    const state = drag.current
    if (!state) return
    const distance = event.clientX - state.x
    if (!state.moved && Math.abs(distance) < 6) return
    if (!state.moved) {
      state.moved = true
      event.currentTarget.classList.add('is-dragging')
    }
    event.currentTarget.scrollLeft = state.left - distance
  }

  const endDrag = (event: PointerEvent<HTMLUListElement>) => {
    const state = drag.current
    drag.current = null
    if (!state?.moved) return
    const track = event.currentTarget
    // Der Klick, der das Ziehen beendet, soll keinem Link folgen.
    const swallow = (click: Event) => {
      click.preventDefault()
      click.stopPropagation()
    }
    track.addEventListener('click', swallow, { capture: true, once: true })
    window.setTimeout(() => {
      track.removeEventListener('click', swallow, { capture: true })
      track.classList.remove('is-dragging')
    }, 0)
  }

  return (
    <section className="section refs" aria-labelledby="refs-title">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow" data-reveal>
              Referenzen
            </p>
            <h2 id="refs-title">
              <SplitText>Ein Blick in die Praxis.</SplitText>
            </h2>
          </div>
          <div className="section-head__aside" data-reveal>
            <p className="lead">Photovoltaik und Wärmeversorgung aus dem Portfolio von Altay Rustamov – mit Originalfotos.</p>
            <div className="refs__controls">
              <button type="button" className="round-button" onClick={() => step(-1)} disabled={edge === 'start'}>
                <ArrowLeft size={20} weight="bold" aria-hidden="true" />
                <span className="visually-hidden">Vorherige Referenz</span>
              </button>
              <button type="button" className="round-button" onClick={() => step(1)} disabled={edge === 'end'}>
                <ArrowRight size={20} weight="bold" aria-hidden="true" />
                <span className="visually-hidden">Nächste Referenz</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="refs__track"
        role="list"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        data-reveal
      >
        {selectedReferences.map((reference) => (
          <li key={reference.id} className="ref-card">
            <Link to={`/referenzen#projekt-${reference.id}`} className="ref-card__link" draggable={false}>
              <div className="ref-card__media frame">
                <PortfolioImage
                  page={reference.project.pages[0]}
                  index={reference.imageIndex}
                  alt={reference.photoAlts[reference.imageIndex]}
                />
                <span className="tag">Referenz · {reference.project.city}</span>
                <span className="ref-card__go" aria-hidden="true">
                  <ArrowUpRight size={20} weight="bold" />
                </span>
              </div>
              <div className="ref-card__body">
                <h3>{reference.title}</h3>
                <p>{reference.short}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="container refs__foot">
        <div className="refs__progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${0.2 + progress * 0.8})` }} />
        </div>
        <ArrowLink to="/referenzen">Alle Referenzen ansehen</ArrowLink>
      </div>
    </section>
  )
}
