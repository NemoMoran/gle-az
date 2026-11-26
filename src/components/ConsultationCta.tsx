import type { PointerEvent } from 'react'
import { ButtonLink } from './ButtonLink'
import { Picture, type ImageName } from './Picture'
import { SplitText } from './SplitText'

interface ConsultationCtaProps {
  title?: string
  text?: string
  /** Foto hinter der Fläche (Startseite). Ohne Foto: einfarbiges Nachtgrün. */
  image?: ImageName
  /** Beschriftung des Buttons. */
  action?: string
}

/** Lichtkegel, der dem Mauszeiger über die Fläche folgt (nur Zeigergeräte, rein dekorativ). */
function followPointer(event: PointerEvent<HTMLDivElement>) {
  if (event.pointerType !== 'mouse') return
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
}

/** Abschluss jeder Seite: eine große nachtgrüne Fläche mit einer einzigen Aktion. */
export function ConsultationCta({
  title = 'Lassen Sie uns über Ihr Vorhaben sprechen.',
  text,
  image,
  action = 'Beratung anfragen',
}: ConsultationCtaProps) {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className={image ? 'cta__frame cta__frame--photo on-night' : 'cta__frame on-night'} onPointerMove={followPointer}>
        {image && (
          <div className="cta__media" aria-hidden="true" data-parallax>
            <Picture name={image} sizes="100vw" alt="" />
          </div>
        )}
        <div className="cta__glow" aria-hidden="true" />
        <div className="container cta__inner">
          <p className="eyebrow" data-reveal>
            Kontakt
          </p>
          <h2 id="cta-title">
            <SplitText>{title}</SplitText>
          </h2>
          <div className="cta__foot" data-reveal>
            {text && <p>{text}</p>}
            <ButtonLink to="/kontakt" variant="accent">
              {action}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
