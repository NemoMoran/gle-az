import type { CSSProperties } from 'react'
import { usePageMeta } from '../lib/usePageMeta'
import { Picture } from '../components/Picture'
import { ButtonLink } from '../components/ButtonLink'
import { ArrowLink } from '../components/ArrowLink'
import { ServiceCards } from '../components/ServiceCards'
import { ConsultationCta } from '../components/ConsultationCta'

/** Reihenfolge in der Einstiegsanimation des Heros (0, 1, 2). */
const seq = (index: number) => ({ '--seq': index }) as CSSProperties

export function HomePage() {
  usePageMeta(
    'GLE · Photovoltaik & effiziente Gebäudetechnik',
    'Photovoltaik, Betrieb & Pflege und effiziente Gebäudetechnik für Wohnhäuser und Unternehmen. GLE, Green Life Engineering, plant, betreut und schult.',
  )

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <Picture
          className="hero__media"
          name="hero-hoch"
          art={{ media: '(min-width: 700px)', name: 'hero' }}
          sizes="100vw"
          priority
        />
        <div className="hero__scrim" aria-hidden="true" />
        <div className="container hero__content">
          <h1 id="hero-title" className="hero__seq" style={seq(0)}>
            Erneuerbare Energie für Ihr Gebäude.
          </h1>
          <p className="hero__lead hero__seq" style={seq(1)}>
            Photovoltaik, Betrieb & Pflege und Gebäudetechnik – zusammen geplant für Ihr Zuhause oder Ihr
            Unternehmen.
          </p>
          <div className="hero__actions hero__seq" style={seq(2)}>
            <ButtonLink to="/kontakt">Beratung anfragen</ButtonLink>
            <ArrowLink to="/leistungen" tone="light">
              Leistungen entdecken
            </ArrowLink>
          </div>
        </div>
      </section>

      <ServiceCards />

      <section className="feature" aria-labelledby="feature-title">
        <div className="feature__media" data-reveal="photo">
          <Picture name="haus-panorama" sizes="100vw" />
        </div>
        <div className="container feature__strip" data-reveal>
          <h2 id="feature-title">Energie vom eigenen Dach.</h2>
          <div className="feature__copy">
            <p>
              Eine Photovoltaikanlage, die zu Dach, Verbrauch und Budget passt{' '}– sorgfältig geplant und
              verständlich erklärt.
            </p>
            <ButtonLink to="/leistungen#photovoltaik">Photovoltaik entdecken</ButtonLink>
          </div>
        </div>
      </section>

      <section className="section work" aria-labelledby="work-title">
        <div className="container work__grid">
          <div className="work__photos">
            <div className="work__photo work__photo--large" data-reveal="photo">
              <Picture name="montage" sizes="(min-width: 1296px) 600px, (min-width: 900px) 48vw, 84vw" />
            </div>
            <div className="work__photo work__photo--small" data-reveal="photo">
              <Picture name="detail" sizes="(min-width: 1296px) 340px, (min-width: 900px) 28vw, 50vw" />
            </div>
          </div>
          <div className="work__copy" data-reveal>
            <h2 id="work-title">Von der Idee bis zur Umsetzung.</h2>
            <p>
              Wir beginnen mit Ihrem Gebäude, Ihrem Verbrauch und Ihren Zielen. Daraus entsteht eine Lösung, die
              wir mit Ihnen abstimmen und sorgfältig umsetzen.
            </p>
            <ul className="labels" role="list">
              <li>Beraten.</li>
              <li>Planen.</li>
              <li>Umsetzen.</li>
            </ul>
            <ArrowLink to="/ueber-uns">Mehr über uns</ArrowLink>
          </div>
        </div>
      </section>

      <section className="teaser" aria-labelledby="training-title">
        <div className="teaser__media" data-reveal="photo">
          <Picture name="wind" sizes="(min-width: 900px) 50vw, 100vw" />
        </div>
        <div className="teaser__copy" data-reveal>
          <h2 id="training-title">Wissen für die Energiewende.</h2>
          <p>Schulungen zu Photovoltaik und Windenergie: verständlich, praxisnah und auf Ihre Fragen zugeschnitten.</p>
          <ButtonLink to="/schulungen" variant="secondary">
            Schulungen entdecken
          </ButtonLink>
        </div>
      </section>

      <ConsultationCta title="Ihr Vorhaben beginnt mit einem Gespräch." image="abschluss" />
    </>
  )
}
