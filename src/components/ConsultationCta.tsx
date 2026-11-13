import { ButtonLink } from './ButtonLink'
import { Picture, type ImageName } from './Picture'

interface ConsultationCtaProps {
  slim?: boolean
  title?: string
  text?: string
  /** Foto unter der waldgrünen Abdunkelung (Startseite). Ohne Foto: einfarbige Fläche. */
  image?: ImageName
}

export function ConsultationCta({
  slim = false,
  title = 'Lassen Sie uns über Ihr Vorhaben sprechen.',
  text,
  image,
}: ConsultationCtaProps) {
  const classes = ['cta', slim && 'cta--slim', image && 'cta--photo'].filter(Boolean).join(' ')
  return (
    <section className={classes} aria-labelledby="cta-title">
      {image && (
        <div className="cta__media" aria-hidden="true">
          <Picture name={image} sizes="100vw" alt="" />
        </div>
      )}
      <div className="container cta__grid">
        <div>
          <h2 id="cta-title">{title}</h2>
          {text && <p>{text}</p>}
        </div>
        <ButtonLink to="/kontakt" variant="inverse">
          Beratung anfragen
        </ButtonLink>
      </div>
    </section>
  )
}
