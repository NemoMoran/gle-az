import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { ArrowLeft, ArrowRight, X } from '@phosphor-icons/react'

export interface LightboxImage {
  src: string
  width: number
  height: number
  alt: string
}

export interface LightboxContent {
  /** Kleine Zeile über dem Titel, z. B. "Wesseling · Einfamilienhaus". */
  kicker: string
  title: string
  images: LightboxImage[]
  /** Foto, mit dem die Galerie öffnet. */
  startIndex?: number
  description?: string
  facts?: { label: string; value: string }[]
  source?: string
  closeLabel?: string
}

interface LightboxProps extends LightboxContent {
  onClose: () => void
}

/**
 * Fotogalerie als natives <dialog>: Fokus bleibt im Dialog, Escape und ein Klick
 * neben die Fläche schließen ihn, der Fokus kehrt zum Auslöser zurück. Blättern per
 * Schaltfläche, Pfeiltasten, Vorschaubild oder Wischen.
 */
export function Lightbox({
  kicker,
  title,
  images,
  startIndex = 0,
  description,
  facts,
  source,
  closeLabel = 'Galerie schließen',
  onClose,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState(startIndex)
  const [direction, setDirection] = useState<1 | -1>(1)
  const swipeStart = useRef<number | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current!
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      dialog.close()
      document.documentElement.style.overflow = previousOverflow
    }
  }, [])

  const move = (step: 1 | -1) => {
    setDirection(step)
    setIndex((current) => (current + step + images.length) % images.length)
  }

  const show = (next: number) => {
    setDirection(next >= index ? 1 : -1)
    setIndex(next)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swipeStart.current = event.pointerType === 'mouse' ? null : event.clientX
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (swipeStart.current === null) return
    const distance = event.clientX - swipeStart.current
    swipeStart.current = null
    if (Math.abs(distance) > 48) move(distance < 0 ? 1 : -1)
  }

  const image = images[index]
  const many = images.length > 1

  return (
    <dialog
      ref={dialogRef}
      className="lightbox on-night"
      aria-labelledby="lightbox-title"
      onClose={() => {
        if (!dialogRef.current?.open) onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close()
      }}
      onKeyDown={(event) => {
        if (!many) return
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          move(1)
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          move(-1)
        }
      }}
    >
      <div className="lightbox__panel">
        <button
          type="button"
          className="lightbox__control lightbox__close"
          aria-label={closeLabel}
          onClick={() => dialogRef.current?.close()}
          autoFocus
        >
          <X size={20} weight="bold" aria-hidden="true" />
        </button>

        <div className="lightbox__stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          <img
            key={image.src}
            className={direction === 1 ? 'lightbox__img lightbox__img--next' : 'lightbox__img lightbox__img--prev'}
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
            decoding="async"
            draggable={false}
          />
          {many && (
            <div className="lightbox__nav">
              <button type="button" className="lightbox__control" aria-label="Vorheriges Foto" onClick={() => move(-1)}>
                <ArrowLeft size={20} weight="bold" aria-hidden="true" />
              </button>
              <p className="lightbox__count num" aria-live="polite" aria-atomic="true">
                Foto {index + 1} von {images.length}
              </p>
              <button type="button" className="lightbox__control" aria-label="Nächstes Foto" onClick={() => move(1)}>
                <ArrowRight size={20} weight="bold" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <div className="lightbox__side">
          <header className="lightbox__header">
            <p className="eyebrow">{kicker}</p>
            <h2 id="lightbox-title">{title}</h2>
          </header>
          {description && <p className="lightbox__text">{description}</p>}
          {facts && facts.length > 0 && (
            <dl className="lightbox__facts">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {many && (
            <ul className="lightbox__thumbs" role="list">
              {images.map((thumb, thumbIndex) => (
                <li key={thumb.src}>
                  <button
                    type="button"
                    aria-label={`Foto ${thumbIndex + 1} anzeigen`}
                    aria-current={thumbIndex === index ? 'true' : undefined}
                    onClick={() => show(thumbIndex)}
                  >
                    <img src={thumb.src} width={thumb.width} height={thumb.height} alt="" loading="lazy" decoding="async" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {source && <p className="lightbox__source">{source}</p>}
        </div>
      </div>
    </dialog>
  )
}
