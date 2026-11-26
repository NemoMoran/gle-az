import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { usePageMeta } from '../lib/usePageMeta'
import { Picture } from '../components/Picture'
import { ButtonLink } from '../components/ButtonLink'
import { ArrowLink } from '../components/ArrowLink'
import { SplitText } from '../components/SplitText'
import { Marquee } from '../components/Marquee'
import { CountUp } from '../components/CountUp'
import { HeroSpotlight } from '../components/HeroSpotlight'
import { ServiceShowcase } from '../components/ServiceShowcase'
import { ProcessScroll } from '../components/ProcessScroll'
import { ReferenceCarousel } from '../components/ReferenceCarousel'
import { ConsultationCta } from '../components/ConsultationCta'
import { companyFacts, factsSource, serviceKeywords } from '../config/facts'
import { trainingTopics } from '../config/training'

/** Der Satz, der beim Scrollen Wort für Wort Farbe annimmt. */
const statement =
  'Gute Energielösungen beginnen nicht mit einem Produkt, sondern mit Ihrem Gebäude: wie es genutzt wird, wie viel Energie es braucht und was sich verändern soll.'

export function HomePage() {
  usePageMeta(
    'GLE · Photovoltaik & effiziente Gebäudetechnik',
    'Photovoltaik, Betrieb & Pflege und effiziente Gebäudetechnik für Wohnhäuser und Unternehmen. GLE, Green Life Engineering, plant, betreut und schult.',
  )
  const words = statement.split(' ')

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__frame on-night">
          <div className="hero__media" data-parallax>
            <Picture name="hero-hoch" art={{ media: '(min-width: 700px)', name: 'hero' }} sizes="100vw" priority />
          </div>
          <div className="hero__shade" aria-hidden="true" />
          <div className="container hero__inner">
            <p className="hero__chip">
              <span className="hero__pulse" aria-hidden="true" />
              Photovoltaik &amp; effiziente Gebäudetechnik
            </p>
            <h1 id="hero-title">
              <SplitText reveal={false}>{'Energie, die\nweiterdenkt.'}</SplitText>
            </h1>
            <div className="hero__foot">
              <div className="hero__copy">
                <p className="hero__lead">
                  Photovoltaik, Betrieb &amp; Pflege und Gebäudetechnik – zusammen geplant für Ihr Zuhause oder Ihr
                  Unternehmen.
                </p>
                <div className="hero__actions">
                  <ButtonLink to="/kontakt" variant="accent">
                    Beratung anfragen
                  </ButtonLink>
                  <ArrowLink to="/leistungen" tone="light">
                    Leistungen entdecken
                  </ArrowLink>
                </div>
              </div>
              <HeroSpotlight />
            </div>
          </div>
        </div>
      </section>

      <Marquee
        className="marquee--words"
        label="Leistungen"
        duration={36}
        rows={[
          serviceKeywords.map((word) => (
            <span className="marquee__word" key={word}>
              {word}
            </span>
          )),
        ]}
      />

      <section className="section statement" aria-labelledby="statement-title">
        <div className="container statement__grid">
          <h2 id="statement-title" className="eyebrow" data-reveal>
            Unser Ansatz
          </h2>
          <p className="statement__text" data-scrub style={{ '--n': words.length } as CSSProperties}>
            {words.map((word, index) => (
              <span key={index} style={{ '--i': index } as CSSProperties}>
                {word}{' '}
              </span>
            ))}
          </p>
          <div className="statement__aside" data-reveal>
            <p>Photovoltaik ist unser Kern. Gebäudetechnik und Schulungen ergänzen ihn.</p>
            <ArrowLink to="/ueber-uns">Mehr über uns</ArrowLink>
          </div>
        </div>
      </section>

      <ServiceShowcase />

      <section className="stats" aria-labelledby="stats-title">
        <div className="stats__frame on-night">
          <div className="container">
            <div className="stats__head">
              <p className="eyebrow" data-reveal>
                Erfahrung
              </p>
              <h2 id="stats-title">
                <SplitText>Erfahrung, die sich nachlesen lässt.</SplitText>
              </h2>
            </div>
            <dl className="stats__grid" data-reveal="stagger">
              {companyFacts.map((fact) => (
                <div className="stat" key={fact.label}>
                  <dt className="stat__label">{fact.label}</dt>
                  <dd className="stat__value">
                    <CountUp value={fact.value} suffix={fact.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
            <div className="stats__foot" data-reveal>
              <p>{factsSource}</p>
              <ArrowLink to="/referenzen" tone="light">
                Referenzen ansehen
              </ArrowLink>
            </div>
          </div>
        </div>
      </section>

      <ProcessScroll />

      <ReferenceCarousel />

      <section className="section training" aria-labelledby="training-title">
        <div className="container training__grid">
          <div className="training__media frame" data-reveal="photo" data-parallax>
            <Picture name="wind" sizes="(min-width: 900px) 50vw, 100vw" />
          </div>
          <div className="training__copy">
            <p className="eyebrow" data-reveal>
              Schulungen
            </p>
            <h2 id="training-title">
              <SplitText>Wissen für die Energiewende.</SplitText>
            </h2>
            <p className="lead" data-reveal>
              Schulungen zu Photovoltaik und Windenergie: verständlich, praxisnah und auf Ihre Fragen zugeschnitten.
            </p>
            <ul className="rows" role="list" data-reveal="stagger">
              {trainingTopics.map((topic) => (
                <li key={topic.id}>
                  <Link to={`/schulungen#${topic.id}`} className="row-link">
                    <span className="row-link__title">{topic.title}</span>
                    <span className="row-link__text">{topic.teaser}</span>
                    <span className="row-link__icon" aria-hidden="true">
                      <ArrowRight size={18} weight="bold" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div data-reveal>
              <ButtonLink to="/schulungen" variant="secondary">
                Schulungen entdecken
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <ConsultationCta
        title="Ihr Vorhaben beginnt mit einem Gespräch."
        text="Beschreiben Sie kurz Ihr Projekt. Gemeinsam klären wir die nächsten Schritte."
        image="leistungen"
      />
    </>
  )
}
