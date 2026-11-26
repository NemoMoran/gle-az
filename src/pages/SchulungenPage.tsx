import { useState } from 'react'
import { Check } from '@phosphor-icons/react'
import { usePageMeta } from '../lib/usePageMeta'
import { PageHero } from '../components/PageHero'
import { ButtonLink } from '../components/ButtonLink'
import { SplitText } from '../components/SplitText'
import { ConsultationCta } from '../components/ConsultationCta'
import { Lightbox, type LightboxContent } from '../components/Lightbox'
import { portfolioImages } from '../components/PortfolioImage'
import { portfolioCredit, trainingActivities, type TrainingActivity } from '../config/company'
import { trainingTopics } from '../config/training'

const photosOf = (activity: TrainingActivity) =>
  portfolioImages(activity.page).map((image, index) => ({
    ...image,
    alt: `${activity.title} – Portfolioaufnahme ${index + 1}`,
  }))

export function SchulungenPage() {
  usePageMeta(
    'Schulungen · GLE',
    'Schulungen zu Photovoltaik und Windenergie: verständlich, praxisnah und auf Ihre Fragen zugeschnitten. Format, Umfang und Termine nach Absprache.',
  )
  const [gallery, setGallery] = useState<LightboxContent | null>(null)

  return (
    <>
      <PageHero
        eyebrow="Schulungen"
        title={'Wissen für die\nEnergiewende.'}
        lead="Zwei Themen, die wir verständlich und praxisnah vermitteln. Format, Umfang und Termine stimmen wir individuell mit Ihnen ab."
        image="wind-breit"
      />

      <section className="section topics" aria-label="Schulungsthemen">
        <div className="container topics__grid">
          {trainingTopics.map((topic, index) => (
            <article key={topic.id} id={topic.id} className="topic" aria-labelledby={`${topic.id}-title`} data-reveal>
              <span className="topic__num num" aria-hidden="true">
                0{index + 1}
              </span>
              <h2 id={`${topic.id}-title`}>{topic.title}</h2>
              <div className="prose">
                {topic.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="topic__block">
                <h3>Für wen</h3>
                <p>{topic.audience}</p>
              </div>
              <div className="topic__block">
                <h3>Inhalte</h3>
                <ul className="check-list check-list--single" role="list">
                  {topic.contents.map((item) => (
                    <li key={item}>
                      <Check size={14} weight="bold" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="topic__actions">
                <ButtonLink to={`/kontakt?interesse=${topic.interestValue}`}>Schulung anfragen</ButtonLink>
              </div>
            </article>
          ))}
        </div>
        <div className="container">
          <p className="topics__note" data-reveal>
            Wir nennen hier bewusst keine festen Termine oder Preise. Beides richtet sich nach Gruppe, Umfang
            und Ort und wird nach Ihrer Anfrage gemeinsam festgelegt.
          </p>
        </div>
      </section>

      <section className="practice" aria-labelledby="training-portfolio-title">
        <div className="practice__frame">
          <div className="container">
            <div className="section-head section-head--split">
              <div>
                <p className="eyebrow" data-reveal>
                  Aus dem Portfolio
                </p>
                <h2 id="training-portfolio-title">
                  <SplitText>Wissen aus der Praxis weitergeben.</SplitText>
                </h2>
              </div>
              <div className="section-head__aside" data-reveal>
                <p className="lead">
                  Durchgeführte Kurse von GLE LLC in Aserbaidschan und eigene Herstellerweiterbildungen aus dem
                  Portfolio.
                </p>
              </div>
            </div>

            <ol className="activities" role="list">
              {trainingActivities.map((activity) => {
                const photos = photosOf(activity)
                return (
                  <li key={activity.page} className="activity" data-reveal>
                    <div className="activity__copy">
                      <p className="activity__kind">{activity.kind}</p>
                      <h3>{activity.title}</h3>
                      <p>{activity.text}</p>
                    </div>
                    <ul className="activity__photos" role="list">
                      {photos.map((photo, photoIndex) => (
                        <li key={photo.src}>
                          <button
                            type="button"
                            className="activity__photo frame"
                            onClick={() =>
                              setGallery({
                                kicker: activity.kind,
                                title: activity.title,
                                images: photos,
                                startIndex: photoIndex,
                                description: activity.text,
                                source: portfolioCredit,
                              })
                            }
                            aria-label={`Foto vergrößern: ${photo.alt}`}
                          >
                            <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" decoding="async" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </section>

      <ConsultationCta
        title="Eine Schulung für Ihr Team?"
        text="Nennen Sie uns Thema, Gruppe und Ort. Format und Umfang stimmen wir gemeinsam ab."
        action="Schulung anfragen"
      />

      {gallery && <Lightbox key={`${gallery.title}-${gallery.startIndex}`} {...gallery} onClose={() => setGallery(null)} />}
    </>
  )
}
