import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { App } from './App'
import { serverMeta } from './lib/usePageMeta'

/**
 * Rendert eine Route zu HTML samt Titel und Beschreibung. Läuft nur im Build
 * (scripts/prerender.mjs); im Browser übernimmt src/main.tsx das fertige HTML.
 */
export function render(url: string) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
  return { html, title: serverMeta.title, description: serverMeta.description }
}
