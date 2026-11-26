import { useEffect, useRef, useState } from 'react'
import { processSteps } from '../config/process'
import { Picture, type ImageName } from './Picture'
import { SplitText } from './SplitText'

/** Je Schritt ein Foto: Bestandsaufnahme, das geplante Ergebnis, die Montage. */
const shots: ImageName[] = ['prozess-1', 'prozess-2', 'prozess-3']

/**
 * Die drei Schritte als Scroll-Strecke. Ab 900 px bleibt links ein Foto stehen und wechselt
 * mit dem Schritt, der gerade in der Bildmitte liegt; eine Linie füllt sich mit dem Fortschritt.
 * Schmal steht jedes Foto bei seinem Schritt. Ohne JavaScript sind alle Schritte gleich sichtbar.
 */
export function ProcessScroll() {
  const [active, setActive] = useState(0)
  const steps = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    let observer: IntersectionObserver
    try {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step))
          }
        },
        { rootMargin: '-48% 0px -48% 0px', threshold: 0 },
      )
    } catch {
      return
    }
    for (const element of steps.current) if (element) observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section process" aria-labelledby="process-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow" data-reveal>
            Ablauf
          </p>
          <h2 id="process-title">
            <SplitText>Von der Idee bis zur Umsetzung.</SplitText>
          </h2>
        </div>

        <div className="process__grid">
          <div className="process__media">
            <div className="process__stack frame" data-reveal="photo">
              {shots.map((name, index) => (
                <div key={name} className={index === active ? 'process__shot is-active' : 'process__shot'}>
                  <Picture name={name} sizes="(min-width: 1340px) 560px, 44vw" />
                </div>
              ))}
              <span className="process__badge num" aria-hidden="true">
                0{active + 1} / 0{processSteps.length}
              </span>
            </div>
          </div>

          <ol className="process__steps" role="list" data-scrub>
            {processSteps.map((step, index) => (
              <li
                key={step.title}
                ref={(element) => {
                  steps.current[index] = element
                }}
                data-step={index}
                className={index === active ? 'process__step is-active' : 'process__step'}
              >
                <span className="process__num num" aria-hidden="true">
                  0{index + 1}
                </span>
                <div className="process__inline frame">
                  <Picture name={shots[index]} sizes="(min-width: 900px) 1px, 100vw" />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
