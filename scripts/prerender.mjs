/**
 * Vorrendern aller Routen, Teil von `npm run build` nach `vite build`.
 *
 * Jede Route bekommt eigene HTML-Dateien in dist/ (dist/leistungen/index.html für Hosts
 * mit Verzeichnis-Index und dist/leistungen.html für Hosts mit Clean URLs, darunter auch
 * `vite preview`) mit fertigem Inhalt, Titel und Beschreibung; unbekannte Pfade bekommen
 * dist/404.html.
 * Der Browser zeigt die Seite damit vor dem JavaScript, Suchmaschinen lesen sie ohne
 * Skript, und ein statischer Host braucht keine Umschreibung auf index.html mehr.
 * Im Browser übernimmt React das fertige HTML (src/main.tsx).
 */
import { build } from 'vite'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const routes = ['/', '/leistungen', '/ueber-uns', '/schulungen', '/kontakt', '/impressum', '/datenschutz']
const dist = path.resolve('dist')
const ssrDir = path.resolve('dist-ssr')

await build({
  configFile: 'vite.config.ts',
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.tsx', outDir: ssrDir, emptyOutDir: true },
})
const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const template = await readFile(path.join(dist, 'index.html'), 'utf8')
if (!template.includes('<!--app-html-->')) throw new Error('index.html: Platzhalter <!--app-html--> fehlt')

const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
const setMeta = (html, attribute, value, content) =>
  html.replace(new RegExp(`(<meta\\s+${attribute}="${value}"\\s+content=")[^"]*(")`), `$1${escape(content)}$2`)

for (const route of [...routes, '*']) {
  const { html, title, description } = render(route === '*' ? '/seite-nicht-gefunden' : route)
  const page = template
    .replace('<div id="root">', `<div id="root" data-route="${route}">`)
    .replace('<!--app-html-->', html)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escape(description)}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${escape(title)}$2`)
  const output = setMeta(page, 'property', 'og:description', description)
  const files =
    route === '/' ? ['index.html'] : route === '*' ? ['404.html'] : [path.join(route.slice(1), 'index.html'), `${route.slice(1)}.html`]
  for (const file of files) {
    await mkdir(path.dirname(path.join(dist, file)), { recursive: true })
    await writeFile(path.join(dist, file), output)
  }
  console.log(`vorgerendert: ${files.join(', ')} („${title}“)`)
}

await rm(ssrDir, { recursive: true, force: true })
