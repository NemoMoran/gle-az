import { useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { useReveal } from '../lib/useReveal'

/**
 * Fokussiert ein Element, das selbst nicht fokussierbar ist (main, Abschnitte).
 * Das tabindex gilt nur bis zum nächsten Blur: So bleibt ein Mausklick in den
 * Inhalt ohne Folgen für die Tab-Reihenfolge, Tab setzt danach beim Klickpunkt fort.
 */
function focusTemporarily(element: HTMLElement) {
  const hadTabIndex = element.hasAttribute('tabindex')
  if (!hadTabIndex) element.setAttribute('tabindex', '-1')
  element.focus({ preventScroll: true })
  if (!hadTabIndex) {
    element.addEventListener('blur', () => element.removeAttribute('tabindex'), { once: true })
  }
}

export function Layout() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const mainRef = useRef<HTMLElement>(null)
  const previousPath = useRef<string | null>(null)
  // Jeder Verlaufseintrag wird genau einmal behandelt; im Entwicklungsmodus (StrictMode)
  // laufen Effekte doppelt und würden sonst die Startposition überschreiben.
  const handledKey = useRef<string | null>(null)
  // Scrollposition je Verlaufseintrag, damit "Zurück" dorthin führt, wo man war.
  const positions = useRef(new Map<string, number>())

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
  }, [])

  useEffect(() => {
    const key = location.key
    const remember = () => positions.current.set(key, window.scrollY)
    window.addEventListener('scroll', remember, { passive: true })
    return () => window.removeEventListener('scroll', remember)
  }, [location.key])

  useEffect(() => {
    if (handledKey.current === location.key) return
    handledKey.current = location.key
    const firstRun = previousPath.current === null
    const pathChanged = previousPath.current !== location.pathname
    previousPath.current = location.pathname

    if (navigationType === 'POP' && !firstRun) {
      window.scrollTo({ top: positions.current.get(location.key) ?? 0, left: 0, behavior: 'instant' })
      if (pathChanged && mainRef.current) focusTemporarily(mainRef.current)
      return
    }

    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
      if (target) {
        // Direkter Aufruf oder Seitenwechsel: sofort springen. Innerhalb der Seite: sanft.
        target.scrollIntoView({ block: 'start', behavior: pathChanged ? 'instant' : 'auto' })
        focusTemporarily(target)
        return
      }
    }
    if (firstRun || !pathChanged) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    if (mainRef.current) focusTemporarily(mainRef.current)
  }, [location.pathname, location.hash, location.key, navigationType])

  useReveal(location.pathname)

  return (
    <>
      <a className="skip-link" href="#inhalt">
        Zum Inhalt springen
      </a>
      <SiteHeader />
      <main id="inhalt" ref={mainRef}>
        <Outlet />
      </main>
      <SiteFooter />
    </>
  )
}
