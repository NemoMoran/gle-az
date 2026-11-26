import { useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from '@phosphor-icons/react'
import { serviceGroups } from '../config/services'
import { ArrowLink } from './ArrowLink'
import { Picture } from './Picture'
import { SplitText } from './SplitText'

/**
 * Die drei Leistungsbereiche als Bildflächen. Ab 900 px stehen sie nebeneinander und die
 * gewählte Fläche öffnet sich (Maus, Tastaturfokus oder Tippen); darunter stapeln sie
 * sich und zeigen alles. Jede Fläche ist ein einziger Link zum Abschnitt der Leistungsseite.
 */
export function ServiceShowcase() {
  const [active, setActive] = useState(0)

  // Tippen auf eine geschlossene Fläche öffnet sie zuerst; Maus und Tastatur haben sie
  // zu diesem Zeitpunkt schon geöffnet und folgen dem Link direkt.
  const onLinkClick = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    if (index === active || !window.matchMedia('(min-width: 900px)').matches) return
    event.preventDefault()
    setActive(index)
  }

  return (
    <section className="section services" aria-labelledby="services-title">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow" data-reveal>
              Leistungen
            </p>
            <h2 id="services-title">
              <SplitText>Was wir für Ihr Gebäude tun.</SplitText>
            </h2>
          </div>
          <div className="section-head__aside" data-reveal>
            <p className="lead">Drei Bereiche, die wir zusammen denken: erzeugen, betreiben und effizient nutzen.</p>
            <ArrowLink to="/leistungen">Alle Leistungen</ArrowLink>
          </div>
        </div>

        <ul className="panels" role="list" data-reveal>
          {serviceGroups.map((group, index) => (
            <li
              key={group.id}
              className={index === active ? 'panel is-active' : 'panel'}
              onPointerEnter={(event) => {
                if (event.pointerType !== 'touch') setActive(index)
              }}
              onFocus={() => setActive(index)}
            >
              <div className="panel__media">
                <Picture name={group.image} sizes="(min-width: 900px) 62vw, 100vw" />
              </div>
              <span className="panel__index num" aria-hidden="true">
                0{index + 1}
              </span>
              <div className="panel__body">
                <h3 className="panel__title">
                  <Link to={`/leistungen#${group.id}`} className="panel__link" onClick={(event) => onLinkClick(event, index)}>
                    {group.title}
                  </Link>
                </h3>
                <div className="panel__detail">
                  <div className="panel__detail-inner">
                    <p>{group.short}</p>
                    <ul className="panel__tags" role="list">
                      {group.includes.slice(0, 3).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <span className="panel__go" aria-hidden="true">
                <ArrowUpRight size={20} weight="bold" />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
