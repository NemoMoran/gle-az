import { useState } from 'react'
import { usePageMeta } from '../lib/usePageMeta'
import { PageHero } from '../components/PageHero'
import { ArrowLink } from '../components/ArrowLink'
import { SplitText } from '../components/SplitText'
import { CountUp } from '../components/CountUp'
import { ProcessSteps } from '../components/ProcessSteps'
import { ConsultationCta } from '../components/ConsultationCta'
import { Lightbox, type LightboxContent } from '../components/Lightbox'
import { portfolioImages } from '../components/PortfolioImage'
import { collaborations, crossBorder, exchange, founder, locations, portfolioCredit } from '../config/company'
import { companyFacts } from '../config/facts'
import { portfolioUrl } from '../config/references'

/** Die drei Fragen, mit denen jede Planung beginnt. */
const questions = [
  {
    question: 'Wie wird das Gebäude genutzt?',
    text: 'Wohnen oder arbeiten, tagsüber oder rund um die Uhr: Die Nutzung bestimmt, wann Energie gebraucht wird.',
  },
  {
    question: 'Wie viel Energie braucht es?',
    text: 'Verbrauch und Lastspitzen entscheiden über die Größe einer Anlage, nicht die Dachfläche allein.',
  },
  {
    question: 'Was soll sich verändern?',
    text: 'Weniger Strombezug, mehr Unabhängigkeit, ein besseres Raumklima: Das Ziel bestimmt die Technik.',
  },
]

const fairPhotos = portfolioImages(exchange.page).map((image, index) => ({
  ...image,
  alt: `Messestand von Green Life / GLE, Aufnahme ${index + 1}`,
}))

export function UeberUnsPage() {
  usePageMeta(
    'Über uns · GLE',
    'GLE steht für Green Life Engineering: erneuerbare Energien, sorgfältig geplant und praktisch umgesetzt. Unser Ansatz und unsere Arbeitsweise.',
  )
  const [gallery, setGallery] = useState<LightboxContent | null>(null)

  const openFair = (startIndex: number) =>
    setGallery({ kicker: 'Fachmessen', title: 'Im fachlichen Austausch', images: fairPhotos, startIndex, source: portfolioCredit })

  return (
    <>
      <PageHero
        eyebrow="Über uns"
        title={'Sorgfältig geplant,\npraktisch umgesetzt.'}
        lead="GLE steht für Green Life Engineering: erneuerbare Energien, sorgfältig geplant und praktisch umgesetzt."
        image="montage-breit"
      />

      <section className="section about-founder" aria-labelledby="founder-title">
        <div className="container duo">
          <div className="duo__head">
            <p className="eyebrow" data-reveal>
              {founder.kicker}
            </p>
            <h2 id="founder-title">
              <SplitText>{founder.name}</SplitText>
            </h2>
          </div>
          <div className="duo__body">
            <div className="prose prose--large" data-reveal>
              {founder.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <dl className="mini-stats" data-reveal="stagger">
              {companyFacts.slice(0, 2).map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>
                    <CountUp value={fact.value} suffix={fact.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
            <p data-reveal>
              <ArrowLink to="/referenzen">Projekte kennenlernen</ArrowLink>
            </p>
          </div>
        </div>
      </section>

      <section className="about-reach" aria-labelledby="reach-title">
        <div className="about-reach__frame on-night">
          <div className="container duo">
            <div className="duo__head">
              <p className="eyebrow" data-reveal>
                Deutschland · Aserbaidschan · Polen
              </p>
              <h2 id="reach-title">
                <SplitText>{crossBorder.title}</SplitText>
              </h2>
            </div>
            <div className="duo__body">
              <div className="prose" data-reveal>
                {crossBorder.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="container">
            <h3 className="about-reach__label" data-reveal>
              Standorte im Unternehmensportfolio
            </h3>
            <ul className="locations" role="list" data-reveal="stagger">
              {locations.map((location) => (
                <li key={location.country} className="location">
                  <p className="location__country">{location.country}</p>
                  {location.organisation && <p className="location__org">{location.organisation}</p>}
                  <p className="location__address">
                    {location.lines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section about-research" aria-labelledby="research-title">
        <div className="container duo">
          <div className="duo__head">
            <p className="eyebrow" data-reveal>
              Hochschule und Industrie
            </p>
            <h2 id="research-title">
              <SplitText>Forschung und Zusammenarbeit.</SplitText>
            </h2>
          </div>
          <ol className="ledger" role="list">
            {collaborations.map((item, index) => (
              <li key={item.title} data-reveal>
                <span className="ledger__num num" aria-hidden="true">
                  0{index + 1}
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section about-exchange" aria-labelledby="exchange-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow" data-reveal>
                Fachmessen
              </p>
              <h2 id="exchange-title">
                <SplitText>{exchange.title}</SplitText>
              </h2>
            </div>
            <div className="section-head__aside" data-reveal>
              <p className="lead">{exchange.text}</p>
            </div>
          </div>
          <ul className="mosaic" role="list">
            {fairPhotos.map((photo, index) => (
              <li key={photo.src}>
                <button
                  type="button"
                  className="mosaic__item frame"
                  data-reveal="photo"
                  onClick={() => openFair(index)}
                  aria-label={`Foto vergrößern: ${photo.alt}`}
                >
                  <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" decoding="async" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-approach" aria-labelledby="approach-title">
        <div className="about-approach__frame">
          <div className="container">
            <div className="section-head section-head--split">
              <div>
                <p className="eyebrow" data-reveal>
                  Unser Ansatz
                </p>
                <h2 id="approach-title">
                  <SplitText>Drei Fragen vor jedem Produkt.</SplitText>
                </h2>
              </div>
              <div className="section-head__aside" data-reveal>
                <p className="lead">
                  Gute Energielösungen müssen nicht laut sein: sorgfältig geplant, verständlich erklärt,
                  zuverlässig im Betrieb. Photovoltaik ist unser Kern, Gebäudetechnik und Schulungen ergänzen
                  ihn. Und weil jedes Gebäude anders ist, beginnen wir nicht mit einem Produkt, sondern mit
                  drei Fragen.
                </p>
              </div>
            </div>
            <ol className="questions" role="list" data-reveal="stagger">
              {questions.map((item, index) => (
                <li key={item.question}>
                  <span className="questions__num num" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <h3>{item.question}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section about-steps" aria-labelledby="steps-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow" data-reveal>
              Ablauf
            </p>
            <h2 id="steps-title">
              <SplitText>In drei Schritten zu Ihrer Energielösung.</SplitText>
            </h2>
          </div>
          <ProcessSteps />

          <div className="about-more">
            <div data-reveal>
              <h2>Wissen weitergeben.</h2>
            </div>
            <div data-reveal>
              <p>
                Energiewende gelingt dort, wo Menschen die Technik verstehen. Deshalb bieten wir neben
                Planung und Umsetzung auch Schulungen zu Photovoltaik und Windenergie an, für Eigentümerinnen
                und Eigentümer, Unternehmen und Interessierte aus Kommunen und Bildung.
              </p>
              <p>
                <ArrowLink to="/schulungen">Zu den Schulungen</ArrowLink>
              </p>
            </div>
          </div>

          <p className="source-note">
            Unternehmensgeschichte und Referenzen nach dem <a href={portfolioUrl}>Portfolio von Altay Rustamov</a>.
          </p>
        </div>
      </section>

      <ConsultationCta
        title="Sie möchten uns kennenlernen?"
        text="Beschreiben Sie kurz Ihr Vorhaben. Wir melden uns, um die nächsten Schritte zu besprechen."
      />

      {gallery && <Lightbox key={gallery.startIndex} {...gallery} onClose={() => setGallery(null)} />}
    </>
  )
}
