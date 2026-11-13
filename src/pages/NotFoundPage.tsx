import { Link } from 'react-router-dom'
import { usePageMeta } from '../lib/usePageMeta'

export function NotFoundPage() {
  usePageMeta('Seite nicht gefunden · GLE', 'Die aufgerufene Seite existiert nicht.')
  return (
    <div className="container not-found">
      <h1>Seite nicht gefunden</h1>
      <p className="lead">
        Die aufgerufene Adresse gibt es nicht oder nicht mehr. Über die Startseite finden Sie alle
        Inhalte.
      </p>
      <Link to="/" className="btn btn--primary">
        Zur Startseite
      </Link>
    </div>
  )
}
