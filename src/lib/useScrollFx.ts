import { useEffect } from 'react'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * Eine gemeinsame Scroll-Schleife für alles, was der Seitenposition folgt:
 *
 * - `--scroll` auf <html>: Fortschritt der ganzen Seite (0 bis 1), für die Leiste am oberen Rand.
 * - `[data-parallax]`: `--py` von -1 (Element tritt unten ein) bis 1 (verlässt oben); das Foto
 *   im Rahmen wandert entsprechend (siehe base.css).
 * - `[data-scrub]`: `--p` von 0 bis 1, während das Element durch die Bildmitte läuft, z. B. für
 *   Text, der Wort für Wort Farbe annimmt, oder die Linie im Ablauf.
 *
 * Gerechnet wird höchstens einmal pro Bild. Bei reduzierter Bewegung bleiben Fotos stehen und
 * `--p` unberührt (die Vorgabe im CSS ist der fertige Zustand).
 */
export function useScrollFx(routeKey: string) {
  useEffect(() => {
    const root = document.documentElement
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const parallax = reduceMotion ? [] : Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
    const scrub = reduceMotion ? [] : Array.from(document.querySelectorAll<HTMLElement>('[data-scrub]'))
    let frame = 0

    const update = () => {
      frame = 0
      const viewport = window.innerHeight
      const max = root.scrollHeight - viewport
      root.style.setProperty('--scroll', max > 0 ? clamp(window.scrollY / max, 0, 1).toFixed(4) : '0')

      for (const element of parallax) {
        const rect = element.getBoundingClientRect()
        if (rect.bottom < -80 || rect.top > viewport + 80) continue
        const centre = rect.top + rect.height / 2
        const progress = clamp((centre - viewport / 2) / (viewport / 2 + rect.height / 2), -1, 1)
        element.style.setProperty('--py', progress.toFixed(4))
      }

      for (const element of scrub) {
        const rect = element.getBoundingClientRect()
        if (rect.bottom < -viewport || rect.top > viewport * 2) continue
        const start = viewport * 0.82
        const distance = rect.height + viewport * 0.32
        element.style.setProperty('--p', clamp((start - rect.top) / distance, 0, 1).toFixed(4))
      }
    }

    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    return () => {
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [routeKey])
}
