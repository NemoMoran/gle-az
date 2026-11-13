import { usePageMeta } from '../lib/usePageMeta'
import { PageHead } from '../components/PageHead'
import { Picture } from '../components/Picture'
import { ArrowLink } from '../components/ArrowLink'
import { ProcessSteps } from '../components/ProcessSteps'
import { ConsultationCta } from '../components/ConsultationCta'

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

export function UeberUnsPage() {
  usePageMeta(
    'Über uns · GLE',
    'GLE steht für Green Life Engineering: erneuerbare Energien, sorgfältig geplant und praktisch umgesetzt. Unser Ansatz und unsere Arbeitsweise.',
  )

  return (
    <>
      <PageHead
        title="Über uns"
        lead="GLE steht für Green Life Engineering: erneuerbare Energien, sorgfältig geplant und praktisch umgesetzt."
      />
      <div className="container">
        <div className="band band--page" data-reveal="photo">
          <Picture name="montage-breit" sizes="(min-width: 1296px) 1200px, 100vw" />
        </div>
      </div>
      <div className="container page-body">
        <section className="about-page__approach" aria-labelledby="approach-title">
          <div className="prose">
            <h2 id="approach-title">Unser Ansatz</h2>
            <p>
              Gute Energielösungen müssen nicht laut sein: sorgfältig geplant, verständlich erklärt,
              zuverlässig im Betrieb. Photovoltaik ist unser Kern, Gebäudetechnik und Schulungen ergänzen
              ihn. Und weil jedes Gebäude anders ist, beginnen wir nicht mit einem Produkt, sondern mit
              drei Fragen.
            </p>
          </div>
          <ol className="questions" role="list">
            {questions.map((item) => (
              <li key={item.question} data-reveal>
                <h3>{item.question}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-page__steps" aria-labelledby="steps-title">
          <div className="section-head">
            <h2 id="steps-title">In drei Schritten zu Ihrer Energielösung</h2>
          </div>
          <ProcessSteps />
        </section>

        <div className="prose about-page__more">
          <h2>Wissen weitergeben</h2>
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
      <ConsultationCta
        slim
        title="Sie möchten uns kennenlernen?"
        text="Beschreiben Sie kurz Ihr Vorhaben. Wir melden uns, um die nächsten Schritte zu besprechen."
      />
    </>
  )
}
