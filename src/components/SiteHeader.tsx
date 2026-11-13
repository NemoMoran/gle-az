import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { List, X } from '@phosphor-icons/react'
import { navigation } from '../config/navigation'
import { site } from '../config/site'
import { useMediaQuery } from '../lib/useMediaQuery'
import { SiteNav } from './SiteNav'
import { Wordmark } from './Wordmark'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const toggleRef = useRef<HTMLButtonElement>(null)

  const desktop = useMediaQuery('(min-width: 900px)')

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

  // Dezenter Schatten, sobald Inhalt unter den Header gescrollt ist. Höhe und Layout bleiben gleich.
  useEffect(() => {
    const update = () => {
      const next = window.scrollY > 4
      setScrolled((current) => (current === next ? current : next))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
      <div className="container site-header__inner">
        <Link to="/" className="wordmark" aria-label={`${site.brand.short}, ${site.brand.name}, zur Startseite`}>
          <Wordmark />
        </Link>

        <SiteNav />

        <div className="site-header__actions">
          <Link to="/kontakt" className="btn btn--primary btn--sm site-header__cta">
            Beratung anfragen
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={24} aria-hidden="true" /> : <List size={24} aria-hidden="true" />}
            <span className="visually-hidden">{open ? 'Menü schließen' : 'Menü öffnen'}</span>
          </button>
        </div>
      </div>

      <div id="mobile-nav" className="mobile-nav" hidden={!open}>
        <nav className="container" aria-label="Mobile Navigation">
          <ul>
            {navigation.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to}>{item.label}</NavLink>
              </li>
            ))}
            <li className="mobile-nav__cta">
              <Link to="/kontakt" className="btn btn--primary">
                Beratung anfragen
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
