import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { serviceGroups } from '../config/services'
import { Picture } from './Picture'
import { ArrowLink } from './ArrowLink'

/** Versatz der Einblendung je Karte (0, 1, 2). */
const order = (index: number) => ({ '--i': index }) as CSSProperties

/**
 * Drei Leistungsbereiche als Bildkarten, alle gleichzeitig sichtbar. Die ganze
 * Karte ist klickbar; zugängliche Bezeichnung ist der Titel.
 */
export function ServiceCards() {
  return (
    <section className="section cards" aria-labelledby="services-title">
      <div className="container">
        <div className="cards__head" data-reveal>
          <h2 id="services-title">Was wir für Ihr Gebäude tun.</h2>
          <ArrowLink to="/leistungen">Alle Leistungen</ArrowLink>
        </div>
        <ul className="cards__grid" role="list">
          {serviceGroups.map((group, index) => (
            <li key={group.id} className="card" data-reveal style={order(index)}>
              <div className="card__media">
                <Picture name={group.image} sizes="(min-width: 1296px) 384px, (min-width: 720px) 33vw, 100vw" />
              </div>
              <div className="card__body">
                <h3 className="card__title">
                  <Link to={`/leistungen#${group.id}`} className="card__link">
                    {group.title}
                  </Link>
                </h3>
                <p className="card__text">{group.short}</p>
                <span className="card__more" aria-hidden="true">
                  Mehr erfahren
                  <ArrowRight size={18} />
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
