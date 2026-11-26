import { useEffect, useRef } from 'react'

interface CountUpProps {
  value: number
  suffix?: string
  /** Dauer in Millisekunden. */
  duration?: number
}

const format = (value: number) => value.toLocaleString('de-DE')

/**
 * Zählt beim ersten Sichtbarwerden von 0 auf den Wert. Vorgerendert und für Screenreader
 * steht immer der Endwert da; bei reduzierter Bewegung und wenn die Zahl beim Laden schon
 * im Bild ist, wird nicht gezählt.
 */
export function CountUp({ value, suffix = '', duration = 1800 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = element.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) return

    let frame = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          element.textContent = format(Math.round(value * (1 - Math.pow(1 - t, 4))))
          if (t < 1) frame = window.requestAnimationFrame(tick)
        }
        element.textContent = '0'
        frame = window.requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
      element.textContent = format(value)
    }
  }, [value, duration])

  return (
    <span className="count num">
      <span className="visually-hidden">
        {format(value)}
        {suffix}
      </span>
      <span aria-hidden="true">
        <span ref={ref}>{format(value)}</span>
        {suffix && <span className="count__suffix">{suffix}</span>}
      </span>
    </span>
  )
}
