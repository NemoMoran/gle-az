import { useState, type CSSProperties } from 'react'
import { ArrowUpRight, DownloadSimple, Images } from '@phosphor-icons/react'
import { usePageMeta } from '../lib/usePageMeta'
import { PageHero } from '../components/PageHero'
import { Lightbox, type LightboxContent, type LightboxImage } from '../components/Lightbox'
import { Marquee } from '../components/Marquee'
import { ConsultationCta } from '../components/ConsultationCta'
import { portfolioImages } from '../components/PortfolioImage'
import { portfolioUrl } from '../config/references'
import { selectedReferences, type SelectedReference } from '../config/selected-references'

const photosOf = (reference: SelectedReference): LightboxImage[] =>
  reference.project.pages
    .flatMap((page) => portfolioImages(page))
    .map((image, index) => ({ ...image, alt: reference.photoAlts[index] }))

const galleryOf = (reference: SelectedReference, startIndex: number): LightboxContent => ({
  kicker: `${reference.project.city} · ${reference.type}`,
  title: reference.project.street,
  images: photosOf(reference),
  startIndex,
  description: reference.description,
  facts: reference.facts,
  source: 'Projektangaben und Originalfotos aus dem Portfolio von Altay Rustamov · Green Life / GLE LLC.',
  closeLabel: 'Projekt schließen',
})

/**
 * Fotos weiterer Anlagen aus dem Portfolio für das Laufband (Seite und Bildnummer im PDF).
 * Bewusst ohne Angaben: Die Projekte dazu stehen im vollständigen Portfolio.
 */
const glimpses: [number, number][][] = [
  [
    [11, 0],
    [20, 0],
    [21, 1],
    [12, 0],
    [13, 0],
    [22, 0],
    [25, 1],
    [18, 1],
  ],
  [
    [21, 0],
    [17, 0],
    [27, 1],
    [28, 1],
    [24, 1],
    [12, 2],
    [26, 0],
    [23, 0],
  ],
]

export function ReferenzenPage() {
  usePageMeta(
    'Ausgewählte Referenzen · GLE',
    'Vier ausgewählte Projekte: Photovoltaik mit Speicher, kombinierte Wärmeversorgung, eine solare Parkplatzüberdachung und Hoteltechnik. Originalfotos aus dem Portfolio von Altay Rustamov.',
  )
  const [gallery, setGallery] = useState<LightboxContent | null>(null)

  return (
    <div className="references-page">
      <PageHero
        eyebrow="Ausgewählte Referenzen"
        title={'Aus Ideen\nwerden Anlagen.'}
        lead="Vier Einblicke in unsere Arbeit: vom eigenen Dach bis zur Energieversorgung eines Hotels. Alle Fotos sind Originalaufnahmen der Projekte."
      />

      <div className="container">
        <ol className="projects" role="list">
          {selectedReferences.map((reference, index) => {
            const photos = photosOf(reference)
            const main = photos[reference.imageIndex]
            const sideIndex = photos.findIndex((_, photoIndex) => photoIndex !== reference.imageIndex)
            const side = photos[sideIndex]
            const place = `${reference.project.street}, ${reference.project.city}`
            return (
              <li key={reference.id}>
                <article
                  className={index % 2 === 1 ? 'project project--flip' : 'project'}
                  id={`projekt-${reference.id}`}
                  aria-labelledby={`title-${reference.id}`}
                >
                  <div className="project__photos">
                    <button
                      type="button"
                      className="project__photo project__photo--main frame"
                      data-reveal="photo"
                      onClick={() => setGallery(galleryOf(reference, reference.imageIndex))}
                      aria-label={`Projektfotos ansehen: ${place}`}
                    >
                      <img
                        src={main.src}
                        width={main.width}
                        height={main.height}
                        alt={main.alt}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                      <span className="project__hint">
                        <Images size={18} aria-hidden="true" /> {photos.length} Fotos
                      </span>
                    </button>
                    {side && (
                      <button
                        type="button"
                        className="project__photo project__photo--side frame"
                        data-reveal="photo"
                        style={{ '--d': 2 } as CSSProperties}
                        onClick={() => setGallery(galleryOf(reference, sideIndex))}
                        aria-label={`Weiteres Projektfoto ansehen: ${place}`}
                      >
                        <img src={side.src} width={side.width} height={side.height} alt={side.alt} loading="lazy" decoding="async" />
                      </button>
                    )}
                  </div>

                  <div className="project__copy" data-reveal="stagger">
                    <div className="project__num num" aria-hidden="true" data-text={`0${index + 1}`} />
                    <p className="eyebrow">
                      {reference.project.city} · {reference.type}
                    </p>
                    <h2 id={`title-${reference.id}`}>{reference.title}</h2>
                    <p className="project__text">{reference.description}</p>
                    <dl className="facts">
                      {reference.facts.map((fact) => (
                        <div key={fact.label}>
                          <dt>{fact.label}</dt>
                          <dd>{fact.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <div>
                      <button
                        type="button"
                        className="btn btn--secondary btn--icon project__open"
                        onClick={() => setGallery(galleryOf(reference, reference.imageIndex))}
                      >
                        <span className="btn__label">
                          Projekt entdecken<span className="visually-hidden">: {reference.project.street}</span>
                        </span>
                        <span className="btn__icon" aria-hidden="true">
                          <ArrowUpRight size={16} weight="bold" />
                          <ArrowUpRight size={16} weight="bold" />
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ol>
      </div>

      <section className="glimpses" aria-labelledby="glimpses-title">
        <div className="container glimpses__head">
          <h2 id="glimpses-title" data-reveal>
            Weitere Einblicke.
          </h2>
          <p className="lead" data-reveal>
            Dächer, Technikräume und Wärmepumpen weiterer Anlagen – Aufnahmen aus dem Portfolio.
          </p>
        </div>
        <Marquee
          className="marquee--photos"
          label="Weitere Einblicke"
          duration={70}
          rows={glimpses.map((row) =>
            row.map(([page, photo]) => {
              const image = portfolioImages(page)[photo]
              return <img key={image.src} src={image.src} width={image.width} height={image.height} alt="" loading="lazy" decoding="async" />
            }),
          )}
        />
      </section>

      <div className="container">
        <aside className="download" aria-labelledby="download-title" data-reveal>
          <div>
            <h2 id="download-title">Das gesamte Portfolio.</h2>
            <p>
              Diese Seite zeigt eine Auswahl aus dem Portfolio von Altay Rustamov · Green Life / GLE LLC. Alle
              Projekte, Fotos und Angaben stehen im Original.
            </p>
          </div>
          <a href={portfolioUrl} download className="download__link">
            <span className="download__icon" aria-hidden="true">
              <DownloadSimple size={22} weight="bold" />
            </span>
            <span>
              <strong>Gesamtes Portfolio</strong>
              <span>PDF · 10,8 MB</span>
            </span>
          </a>
        </aside>
      </div>

      <ConsultationCta title="Und was haben Sie vor?" action="Über Ihr Projekt sprechen" />

      {gallery && <Lightbox key={`${gallery.title}-${gallery.startIndex}`} {...gallery} onClose={() => setGallery(null)} />}
    </div>
  )
}
