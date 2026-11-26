import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, Check } from '@phosphor-icons/react'
import { usePageMeta } from '../lib/usePageMeta'
import { PageHero } from '../components/PageHero'
import { Picture } from '../components/Picture'
import { ButtonLink } from '../components/ButtonLink'
import { SplitText } from '../components/SplitText'
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
      <PageHero
        eyebrow="Leistungen"
        title={'Drei Bereiche,\nein Konzept.'}
        lead="Photovoltaik, Betrieb & Pflege und Gebäudetechnik denken wir zusammen. Was für Ihr Gebäude sinnvoll ist, klären wir im Gespräch."
        image="leistungen"
      >
        <nav aria-label="Leistungsbereiche">
          <ul className="jump-list" role="list">
            {serviceGroups.map((group, index) => (
              <li key={group.id}>
                <Link to={`/leistungen#${group.id}`} className="jump-link">
                  <span className="jump-link__num num" aria-hidden="true">
                    0{index + 1}
                  </span>
                  {group.title}
                  <ArrowDown size={16} weight="bold" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {serviceGroups.map((group, index) => (
        <Fragment key={group.id}>
          <section
            id={group.id}
            className={index % 2 === 1 ? 'service service--flip' : 'service'}
            aria-labelledby={`${group.id}-title`}
          >
            <div className="container service__grid">
              <div className="service__media">
                <div className="service__photo frame" data-reveal="photo" data-parallax>
                  <Picture name={group.image} sizes="(min-width: 900px) 50vw, 100vw" />
                </div>
              </div>
              <div className="service__copy">
                <span className="service__num num" aria-hidden="true">
                  0{index + 1}
                </span>
                <h2 id={`${group.id}-title`}>
                  <SplitText>{group.title}</SplitText>
                </h2>
                <p className="service__claim" data-reveal>
                  {group.short}
                </p>
                <div className="prose" data-reveal>
                  {group.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <div className="service__includes">
                  <h3 data-reveal>Was dazugehört</h3>
                  <ul className="check-list" role="list" data-reveal="stagger">
                    {group.includes.map((item) => (
                      <li key={item}>
                        <Check size={14} weight="bold" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {group.note && (
                  <p className="service__note" data-reveal>
                    {group.note}
                  </p>
                )}
                <div className="service__actions" data-reveal>
                  <ButtonLink to={`/kontakt?interesse=${group.id}`}>Dazu beraten lassen</ButtonLink>
                </div>
              </div>
            </div>
          </section>
          {group.id === 'photovoltaik' && <EnergyFlow />}
        </Fragment>
      ))}

      <ConsultationCta
        title="Welche Leistung passt zu Ihrem Gebäude?"
        text="Beschreiben Sie kurz Ihre Situation. Wir ordnen ein, was sinnvoll ist, und schlagen die nächsten Schritte vor."
      />
    </>
  )
}
