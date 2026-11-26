import { Link } from 'react-router-dom'
import { ArrowUp } from '@phosphor-icons/react'
import { legalNavigation, navigation } from '../config/navigation'
import { formattedAddress, site } from '../config/site'
import { Wordmark } from './Wordmark'

function toTop() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  document.getElementById('inhalt')?.focus({ preventScroll: true })
}

export function SiteFooter() {
  const year = new Date().getFullYear()
  const address = formattedAddress()
  const hasContact = Boolean(site.contact.phone || site.contact.email || address)

  return (
    <footer className="site-footer on-night">
      <div className="site-footer__frame">
        <div className="container">
          <div className={hasContact ? 'site-footer__grid site-footer__grid--with-contact' : 'site-footer__grid'}>
            <div className="site-footer__brand">
              <Link to="/" className="wordmark wordmark--inverse" aria-label={`${site.brand.name}, zur Startseite`}>
                <Wordmark />
              </Link>
              <p>
                Photovoltaik, Betrieb &amp; Pflege und effiziente Gebäudetechnik für Wohnhäuser und
                Unternehmen.
              </p>
              {site.serviceRegion && <p>Tätig in: {site.serviceRegion}</p>}
            </div>

            <nav aria-label="Fußzeile: Seiten">
              <h2 className="site-footer__title">Seiten</h2>
              <ul>
                {navigation.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Fußzeile: Rechtliches">
              <h2 className="site-footer__title">Rechtliches</h2>
              <ul>
                {legalNavigation.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            {hasContact && (
              <div>
                <h2 className="site-footer__title">Kontakt</h2>
                <ul>
                  {site.contact.phone && (
                    <li>
                      <a href={`tel:${site.contact.phone.replace(/[^+\d]/g, '')}`}>{site.contact.phone}</a>
                    </li>
                  )}
                  {site.contact.email && (
                    <li>
                      <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                    </li>
                  )}
                  {address && (
                    <li>
                      {address.map((line) => (
                        <span key={line} className="site-footer__line">
                          {line}
                        </span>
                      ))}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Reine Zierde: Der Text kommt per CSS aus data-text und steht nicht im Dokument. */}
          <div className="site-footer__giant" aria-hidden="true" data-text={site.brand.name} />

          <div className="site-footer__bottom">
            <p>
              © {year} {site.brand.name}
            </p>
            <button type="button" className="site-footer__top" onClick={toTop}>
              Nach oben
              <ArrowUp size={16} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
