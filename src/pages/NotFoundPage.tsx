import { usePageMeta } from '../lib/usePageMeta'
import { ButtonLink } from '../components/ButtonLink'
import { ArrowLink } from '../components/ArrowLink'

export function NotFoundPage() {
  usePageMeta('Seite nicht gefunden · GLE', 'Die aufgerufene Seite existiert nicht.')
  return (
    <div className="container not-found">
      <div className="not-found__code num" aria-hidden="true" data-text="404" />
      <h1>Seite nicht gefunden</h1>
      <p className="lead">
        Die aufgerufene Adresse gibt es nicht oder nicht mehr. Über die Startseite finden Sie alle
        Inhalte.
      </p>
      <div className="not-found__actions">
        <ButtonLink to="/">Zur Startseite</ButtonLink>
        <ArrowLink to="/kontakt">Kontakt aufnehmen</ArrowLink>
      </div>
    </div>
  )
}
