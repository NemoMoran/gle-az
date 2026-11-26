import { useEffect } from 'react'

/**
 * Blendet Elemente mit `data-reveal` ein, sobald sie in den Viewport kommen.
 * Ausgeblendet wird erst, wenn feststeht, was gerade zu sehen ist (Klasse `js`
 * auf <html>): Vorgerenderte Inhalte bleiben so bis dahin sichtbar, und was
 * schon im Bild ist, verschwindet nie. Bei reduzierter Bewegung, ohne
 * IntersectionObserver oder bei Fehlern bleibt alles sofort sichtbar.
 */
export function useReveal(routeKey: string) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'))
    if (elements.length === 0) return

    const showAll = () => elements.forEach((el) => el.classList.add('is-in'))
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      showAll()
      return
    }

    // Beim allerersten Laden ist das Vorgerenderte schon zu sehen: Was dann im Bild liegt,
    // gilt ohne Bewegung als eingeblendet (`is-instant`), damit nichts aufblitzt.
    let initial = !document.documentElement.classList.contains('js')
    let observer: IntersectionObserver
    try {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in')
              if (initial) entry.target.classList.add('is-instant')
              observer.unobserve(entry.target)
            }
          }
          initial = false
          document.documentElement.classList.add('js')
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0 },
      )
      elements.forEach((el) => observer.observe(el))
    } catch {
      showAll()
      return
    }
    return () => observer.disconnect()
  }, [routeKey])
}
