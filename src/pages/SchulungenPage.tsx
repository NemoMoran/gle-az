import { Link } from 'react-router-dom'
import { usePageMeta } from '../lib/usePageMeta'
import { PageHead } from '../components/PageHead'
import { Picture } from '../components/Picture'
import { trainingTopics } from '../config/training'

export function SchulungenPage() {
  usePageMeta(
    'Schulungen · GLE',
    'Schulungen zu Photovoltaik und Windenergie: verständlich, praxisnah und auf Ihre Fragen zugeschnitten. Format, Umfang und Termine nach Absprache.',
  )

  return (
    <>
      <PageHead
        title="Schulungen"
        lead="Wissen für die Energiewende: zwei Themen, die wir verständlich und praxisnah vermitteln. Format, Umfang und Termine stimmen wir individuell mit Ihnen ab."
      />
      <div className="container">
        <div className="band band--page" data-reveal="photo">
          <Picture name="wind-breit" sizes="(min-width: 1296px) 1200px, 100vw" />
        </div>
      </div>
      <div className="container page-body">
        {trainingTopics.map((topic) => (
          <section key={topic.id} id={topic.id} className="detail" aria-labelledby={`${topic.id}-title`}>
            <div className="detail__head">
              <h2 id={`${topic.id}-title`}>{topic.title}</h2>
            </div>
            <div className="detail__body">
              <div className="prose">
                {topic.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div>
                <h3>Für wen</h3>
                <p className="measure">{topic.audience}</p>
              </div>
              <div>
                <h3>Inhalte</h3>
                <ul className="check-list" role="list">
                  {topic.contents.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="detail__actions">
                <Link to={`/kontakt?interesse=${topic.interestValue}`} className="btn btn--primary">
                  Schulung anfragen
                </Link>
              </div>
            </div>
          </section>
        ))}
        <div className="detail-note">
          <p className="muted measure">
            Wir nennen hier bewusst keine festen Termine oder Preise. Beides richtet sich nach Gruppe, Umfang
            und Ort und wird nach Ihrer Anfrage gemeinsam festgelegt.
          </p>
        </div>
      </div>
    </>
  )
}
