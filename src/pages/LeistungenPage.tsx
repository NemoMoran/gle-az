import { Fragment } from 'react'
import { usePageMeta } from '../lib/usePageMeta'
import { PageHead } from '../components/PageHead'
import { Picture } from '../components/Picture'
import { ButtonLink } from '../components/ButtonLink'
import { EnergyFlow } from '../components/EnergyFlow'
import { ConsultationCta } from '../components/ConsultationCta'
import { serviceGroups } from '../config/services'

export function LeistungenPage() {
  usePageMeta(
    'Leistungen · GLE',
    'Photovoltaik planen und installieren, Anlagen überwachen, warten und reinigen, Gebäudetechnik für Heizen, Kühlen und Lüften. Die Leistungen von GLE im Überblick.',
  )

  return (
    <>
      <PageHead
        title="Leistungen"
        lead="Photovoltaik, Betrieb & Pflege und Gebäudetechnik: drei Bereiche, die wir zusammen denken. Was für Ihr Gebäude sinnvoll ist, klären wir im Gespräch."
      />
      {serviceGroups.map((group, index) => (
        <Fragment key={group.id}>
          {/* Je Bereich ein breites Foto, darunter Titel und Text; die Spalten wechseln die Seite.
              Das erste Foto ist zugleich der fotografische Einstieg der Seite. */}
          <section
            id={group.id}
            className={index % 2 === 1 ? 'service service--flip' : 'service'}
            aria-labelledby={`${group.id}-title`}
          >
            <div className="container">
              <div className="service__band" data-reveal="photo">
                <Picture name={group.band} sizes="(min-width: 1296px) 1200px, 100vw" />
              </div>
              <div className="service__grid">
                <div className="service__intro" data-reveal>
                  <h2 id={`${group.id}-title`}>{group.title}</h2>
                  <p className="service__claim">{group.short}</p>
                </div>
                <div className="service__body" data-reveal>
                  <div className="prose">
                    {group.description.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  <div>
                    <h3>Was dazugehört</h3>
                    <ul className="check-list" role="list">
                      {group.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  {group.note && <p className="muted measure">{group.note}</p>}
                  <div className="service__actions">
                    <ButtonLink to={`/kontakt?interesse=${group.id}`} variant="secondary">
                      Dazu beraten lassen
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {group.id === 'photovoltaik' && <EnergyFlow />}
        </Fragment>
      ))}
      <ConsultationCta
        slim
        title="Welche Leistung passt zu Ihrem Gebäude?"
        text="Beschreiben Sie kurz Ihre Situation. Wir ordnen ein, was sinnvoll ist, und schlagen die nächsten Schritte vor."
      />
    </>
  )
}
