import { Info } from '@phosphor-icons/react'
import { usePageMeta } from '../lib/usePageMeta'
import { PageHead } from '../components/PageHead'
import { Draft } from '../components/Draft'
import { formattedAddress, site } from '../config/site'

export function DatenschutzPage() {
  usePageMeta(
    'Datenschutz · GLE',
    'Datenschutzerklärung der Website von GLE, Green Life Engineering: Verantwortlicher, Hosting, Kontaktformular und Ihre Rechte.',
  )
  const address = formattedAddress()

  return (
    <>
      <PageHead title={"Datenschutz\u00ADerklärung"} />
      <div className="container page-body legal">
        <div className="notice">
          <Info size={22} aria-hidden="true" />
          <p>
            <strong>Entwurf.</strong> Dieser Text beschreibt den aktuellen Stand der Website und muss vor
            der Veröffentlichung um Verantwortlichen, Hosting-Anbieter und den tatsächlichen Versandweg
            des Kontaktformulars ergänzt und rechtlich geprüft werden.
          </p>
        </div>

        <div className="prose">
          <h2>1. Verantwortlicher</h2>
          <p>
            Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:
            <br />
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
                <Draft value={null} hint="Anschrift" />
                <br />
              </>
            )}
            E-Mail: <Draft value={site.contact.email} hint="E-Mail-Adresse" />
          </p>

          <h2>2. Hosting und Server-Logfiles</h2>
          <p>
            Diese Website wird bei <Draft value={null} hint="Hosting-Anbieter, Sitz und Vertragsgrundlage" />{' '}
            betrieben. Beim Aufruf der Seiten verarbeitet der Server technisch notwendige Daten wie
            IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, Browsertyp und Betriebssystem.
            Diese Daten dienen der sicheren und stabilen Auslieferung der Website (Art. 6 Abs. 1 lit. f
            DSGVO). <Draft value={null} hint="Speicherdauer der Logfiles" />
          </p>

          <h2>3. Kontaktformular</h2>
          <p>
            Wenn Sie uns über das Kontaktformular schreiben, verarbeiten wir die von Ihnen eingegebenen
            Angaben (Name, E-Mail-Adresse, optional Telefonnummer, Ihr Interesse und Ihre Nachricht)
            ausschließlich zur Bearbeitung Ihrer Anfrage (Art. 6 Abs. 1 lit. b DSGVO). Die Daten werden
            gelöscht, sobald die Anfrage abgeschlossen ist und keine gesetzlichen Aufbewahrungspflichten
            entgegenstehen.
          </p>
          <p>
            <mark className="todo">
              [Hinweis: In der aktuellen Vorschau überträgt das Formular keine Daten. Vor der Anbindung
              eines Versandwegs sind Empfänger, eingesetzte Dienstleister und Speicherdauer zu ergänzen.]
            </mark>
          </p>

          <h2>4. Keine Cookies, keine Analyse-Dienste</h2>
          <p>
            Diese Website setzt keine Cookies zu Analyse- oder Marketingzwecken und bindet keine
            Tracking-Dienste, Kartendienste oder Social-Media-Plugins ein. Die verwendeten Schriftarten
            werden von unserem eigenen Server geladen; es findet keine Verbindung zu externen
            Schriftanbietern statt.
          </p>

          <h2>5. Ihre Rechte</h2>
          <p>
            Sie haben das Recht auf Auskunft über die zu Ihrer Person gespeicherten Daten, auf
            Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit sowie das
            Recht, einer Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO zu widersprechen.
            Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren. Wenden Sie sich
            dazu an die unter Punkt 1 genannte Kontaktadresse.
          </p>

          <h2>6. Stand</h2>
          <p>
            <Draft value={null} hint="Datum der Veröffentlichung" />
          </p>
        </div>
      </div>
    </>
  )
}
