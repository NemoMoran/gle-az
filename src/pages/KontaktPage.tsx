import { Envelope, Phone } from '@phosphor-icons/react'
import { usePageMeta } from '../lib/usePageMeta'
import { PageHero } from '../components/PageHero'
import { ContactForm } from '../components/ContactForm'
import { Faq } from '../components/Faq'
import { site } from '../config/site'

export function KontaktPage() {
  usePageMeta(
    'Kontakt · GLE',
    'Beratung anfragen: Beschreiben Sie kurz Ihr Vorhaben zu Photovoltaik, Betrieb & Pflege, Gebäudetechnik oder Schulungen. Wir melden uns bei Ihnen.',
  )
  const hasDetails = Boolean(site.contact.phone || site.contact.email)

  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title={'Sprechen wir über\nIhr Vorhaben.'}
        lead="Beschreiben Sie kurz Ihr Vorhaben. Wir melden uns bei Ihnen, um die nächsten Schritte zu besprechen."
        size="compact"
      />
      <div className="container page-body contact__grid">
        <div className="contact__form">
          <ContactForm />
        </div>
        <aside className="contact__aside" aria-label="Ablauf und häufige Fragen">
          <div className="contact__next">
            <h2 id="next-steps-title">So geht es weiter</h2>
            <ol className="steps-list" role="list">
              <li>Sie schildern Ihr Anliegen über das Formular.</li>
              <li>Wir melden uns mit Rückfragen oder einem Terminvorschlag.</li>
              <li>Im Gespräch klären wir, ob und wie wir Sie unterstützen können.</li>
            </ol>
          </div>
          {hasDetails && (
            <div className="contact__details">
              {site.contact.phone && (
                <p>
                  <Phone size={20} aria-hidden="true" />
                  <a href={`tel:${site.contact.phone.replace(/[^+\d]/g, '')}`}>{site.contact.phone}</a>
                </p>
              )}
              {site.contact.email && (
                <p>
                  <Envelope size={20} aria-hidden="true" />
                  <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                </p>
              )}
            </div>
          )}
          <Faq />
        </aside>
      </div>
    </>
  )
}
