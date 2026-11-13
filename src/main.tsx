import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import './styles/pages.css'
import { App } from './App'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Vorgerendertes HTML (scripts/prerender.mjs) wird übernommen, wenn es zur aufgerufenen
// Route gehört. Liefert ein Host für einen unbekannten Pfad die Startseite aus
// (SPA-Fallback), wird die Seite stattdessen neu aufgebaut.
const prerendered = root.dataset.route
const current = window.location.pathname.replace(/\/+$/, '') || '/'
if (prerendered !== undefined && (prerendered === '*' || prerendered === current)) {
  hydrateRoot(root, app)
} else {
  root.replaceChildren()
  createRoot(root).render(app)
}
