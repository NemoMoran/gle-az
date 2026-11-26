import { useState, type CSSProperties, type ReactNode } from 'react'
import { Pause, Play } from '@phosphor-icons/react'

interface MarqueeProps {
  /** Eine oder mehrere Zeilen; benachbarte Zeilen laufen gegenläufig. */
  rows: ReactNode[]
  /** Sekunden für einen Durchlauf. */
  duration?: number
  className?: string
  /** Wofür das Laufband steht, z. B. "Leistungen" (für die Beschriftung des Schalters). */
  label: string
}

/**
 * Endlos laufendes Band. Der Inhalt ist Dekoration und für Screenreader ausgeblendet;
 * er darf deshalb nichts enthalten, was nicht auch an anderer Stelle der Seite steht,
 * und keine Links. Anhalten: per Schalter, beim Überfahren mit der Maus und automatisch
 * bei reduzierter Bewegung (dann lässt sich das Band von Hand verschieben).
 */
export function Marquee({ rows, duration = 40, className, label }: MarqueeProps) {
  const [paused, setPaused] = useState(false)
  return (
    <div
      className={['marquee', className].filter(Boolean).join(' ')}
      data-paused={paused ? '' : undefined}
      style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
    >
      <div className="marquee__rows" aria-hidden="true">
        {rows.map((row, index) => (
          <div className="marquee__viewport" key={index}>
            <div className={index % 2 === 1 ? 'marquee__track marquee__track--reverse' : 'marquee__track'}>
              <div className="marquee__group">{row}</div>
              <div className="marquee__group marquee__group--copy">{row}</div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="marquee__toggle" onClick={() => setPaused((value) => !value)}>
        {paused ? <Play size={14} weight="fill" aria-hidden="true" /> : <Pause size={14} weight="fill" aria-hidden="true" />}
        <span className="visually-hidden">
          Laufband „{label}“ {paused ? 'fortsetzen' : 'anhalten'}
        </span>
      </button>
    </div>
  )
}
