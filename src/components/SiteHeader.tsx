import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { navigation } from '../config/navigation'
import { site } from '../config/site'
import { useMediaQuery } from '../lib/useMediaQuery'
import { ButtonLink } from './ButtonLink'
import { SiteNav } from './SiteNav'
import { Wordmark } from './Wordmark'

/**
 * Schwebende Kopfleiste. Sie weicht beim Scrollen nach unten aus und kehrt zurück,
 * sobald man nach oben scrollt, ein Element darin den Fokus hat oder das Menü offen ist.
 * Das mobile Menü ist ein Geschwisterelement: So bleibt es an das Fenster gebunden,
 * auch während sich die Leiste bewegt.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const location = useLocation()
  const toggleRef = useRef<HTMLButtonElement>(null)

  const desktop = useMediaQuery('(min-width: 960px)')

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  // Wird das Fenster bei offenem Menü breit, gibt es das Menü nicht mehr.
  useEffect(() => {
    if (desktop) setOpen(false)
  }, [desktop])

  // Offenes Menü: Die Seite dahinter ist weder scroll- noch bedienbar.
  useEffect(() => {
    const behind = [document.getElementById('inhalt'), document.querySelector('footer')]
    document.documentElement.classList.toggle('menu-open', open)
    for (const element of behind) element?.toggleAttribute('inert', open)
    return () => {
      document.documentElement.classList.remove('menu-open')
      for (const element of behind) element?.removeAttribute('inert')
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Schatten, sobald Inhalt unter der Leiste liegt; ausweichen beim Scrollen nach unten.
  useEffect(() => {
    let last = window.scrollY
    const update = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      if (Math.abs(y - last) < 6) return
      setHidden(y > last && y > 520)
      last = y
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const classes = ['site-header', scrolled && 'is-scrolled', hidden && !open && 'is-hidden', open && 'is-open']
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <header className={classes}>
        <div className="site-header__bar">
          <Link to="/" className="wordmark" aria-label={`${site.brand.name}, zur Startseite`}>
            <Wordmark />
          </Link>

          <SiteNav />

          <div className="site-header__actions">
            <ButtonLink to="/kontakt" size="sm" className="site-header__cta">
              Beratung anfragen
            </ButtonLink>
            <button
              ref={toggleRef}
              type="button"
              className="menu-toggle"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((value) => !value)}
            >
              <span className="menu-toggle__lines" aria-hidden="true">
                <span />
                <span />
              </span>
              <span className="visually-hidden">{open ? 'Menü schließen' : 'Menü öffnen'}</span>
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-nav" className="mobile-nav on-night" hidden={!open}>
        <nav className="mobile-nav__inner" aria-label="Mobile Navigation">
          <ul>
            {navigation.map((item, index) => (
              <li key={item.to} style={{ '--i': index } as CSSProperties}>
                <NavLink to={item.to}>
                  <span className="mobile-nav__num num" aria-hidden="true">
                    0{index + 1}
                  </span>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="mobile-nav__cta" style={{ '--i': navigation.length } as CSSProperties}>
              <ButtonLink to="/kontakt" variant="accent">
                Beratung anfragen
              </ButtonLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
