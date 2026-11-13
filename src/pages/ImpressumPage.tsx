import { Info } from '@phosphor-icons/react'
import { usePageMeta } from '../lib/usePageMeta'
import { PageHead } from '../components/PageHead'
import { Draft } from '../components/Draft'
import { formattedAddress, site } from '../config/site'
import manifest from '../config/images.json'

interface Credit {
  title: string
  author: string
  authorUrl?: string
  license: string
  licenseUrl?: string
  sourceUrl: string
}

const credits = Object.values(manifest.images as Record<string, { credit?: Credit }>)
  .map((image) => image.credit)
  .filter((credit): credit is Credit => Boolean(credit?.title))
  .filter((credit, index, all) => all.findIndex((other) => other.sourceUrl === credit.sourceUrl) === index)

export function ImpressumPage() {
  usePageMeta('Impressum · GLE', 'Anbieterkennzeichnung und Bildnachweise der Website von GLE, Green Life Engineering.')
  const address = formattedAddress()

  return (
    <>
      <PageHead title="Impressum" />
      <div className="container page-body legal">
        <div className="notice">
          <Info size={22} aria-hidden="true" />
          <p>
            <strong>Entwurf.</strong> Angaben in eckigen Klammern müssen vor der Veröffentlichung ergänzt
            und der gesamte Text rechtlich geprüft werden. Dieser Entwurf ist keine Rechtsberatung.
          </p>
        </div>

        <div className="prose">
          <h2>Angaben gemäß § 5 DDG</h2>
          <p>
            <Draft value={site.legal.companyName} hint="Firmenname" />{' '}
            <Draft value={site.legal.legalForm} hint="Rechtsform" />
            <br />
            {address ? (
              address.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))
            ) : (
              <>
                <Draft value={null} hint="Straße und Hausnummer" />
                <br />
                <Draft value={null} hint="Postleitzahl und Ort" />
                <br />
              </>
            )}
            {site.address.country}
          </p>

          <h2>Vertreten durch</h2>
          <p>
            <Draft value={site.legal.representedBy} hint="Name der vertretungsberechtigten Person" />
          </p>

          <h2>Kontakt</h2>
          <p>
            Telefon: <Draft value={site.contact.phone} hint="Telefonnummer" />
            <br />
            E-Mail: <Draft value={site.contact.email} hint="E-Mail-Adresse" />
          </p>

          <h2>Registereintrag</h2>
          <p>
            Registergericht: <Draft value={site.legal.registerCourt} hint="Registergericht, falls eingetragen" />
            <br />
            Registernummer: <Draft value={site.legal.registerNumber} hint="Registernummer, falls eingetragen" />
          </p>

          <h2>Umsatzsteuer-Identifikationsnummer</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:{' '}
            <Draft value={site.legal.vatId} hint="USt-IdNr., falls vorhanden" />
          </p>

          <h2>Verantwortlich für den Inhalt</h2>
          <p>
            <Draft value={site.legal.contentResponsible} hint="Name und Anschrift der verantwortlichen Person" />
          </p>

          <h2>Verbraucherstreitbeilegung</h2>
          <p>
            <mark className="todo">[Zu prüfen: Teilnahmebereitschaft nach § 36 VSBG]</mark> Wir sind nicht
            bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>

          <h2>Bildnachweise</h2>
          {credits.length > 0 ? (
            <ul>
              {credits.map((credit) => (
                <li key={credit.sourceUrl}>
                  „{credit.title}“ von{' '}
                  {credit.authorUrl ? <a href={credit.authorUrl}>{credit.author}</a> : credit.author},{' '}
                  {credit.licenseUrl ? (
                    <a href={credit.licenseUrl} rel="license">
                      {credit.license}
                    </a>
                  ) : (
                    credit.license
                  )}
                  , <a href={credit.sourceUrl}>Quelle</a>. Zuschnitt und
                  Komprimierung durch uns.
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <mark className="todo">[Noch zu ergänzen: Bildnachweise]</mark>
            </p>
          )}
        </div>
      </div>
    </>
  )
}
