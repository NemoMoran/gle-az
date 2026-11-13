import { faqItems } from '../config/faq'
import { Disclosure } from './Disclosure'
import { ArrowLink } from './ArrowLink'

/** Häufige Fragen in der Begleitspalte der Kontaktseite. */
export function Faq() {
  return (
    <section className="faq" aria-labelledby="faq-title">
      <h2 id="faq-title">Häufige Fragen</h2>
      <div className="faq__list">
        {faqItems.map((item, index) => (
          <Disclosure id={`faq-${index + 1}`} key={item.question} summary={item.question}>
            {item.answer.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {item.link && (
              <p>
                <ArrowLink to={item.link.to}>{item.link.label}</ArrowLink>
              </p>
            )}
          </Disclosure>
        ))}
      </div>
    </section>
  )
}
