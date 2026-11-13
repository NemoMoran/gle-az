import { processSteps } from '../config/process'

/** Drei Schritte, verbunden durch eine feine Linie (waagerecht ab 760 px, sonst senkrecht). */
export function ProcessSteps() {
  return (
    <ol className="steps" role="list" data-reveal>
      {processSteps.map((step, index) => (
        <li className="step" key={step.title}>
          <span className="step__marker" aria-hidden="true">
            {index + 1}
          </span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </li>
      ))}
    </ol>
  )
}
