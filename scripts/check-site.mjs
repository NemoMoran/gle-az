/**
 * Prüft die laufende Website in echtem Chrome (headless) bei 390, 768 und 1440 px:
 * Konsolenfehler, fehlgeschlagene Requests, horizontales Überlaufen, genau eine h1,
 * geladene Bilder (AVIF, feste Maße, Lazy Loading), axe-core-Barrierefreiheit,
 * mobiles Menü, Formularvalidierung, Tastaturbedienung, Anker-Navigation,
 * Textkontrast auf Fotos (Hero, Abschluss), die Bildkarten und Links der Startseite,
 * das Schaubild auf der Leistungsseite, das Vorhaben im Kontaktformular, den gemerkten
 * Entwurf, FAQ, Header-Schatten und reduzierte Bewegung.
 * Screenshots landen im Ordner SHOT_DIR (Standard: ./screenshots).
 *
 * Voraussetzung: Google Chrome ist installiert (CHROME_PATH überschreibt den Pfad)
 * und die Website läuft unter SITE_URL (Standard: http://127.0.0.1:5173).
 *
 * Aufruf: node scripts/check-site.mjs
 */
import { chromium } from 'playwright-core'
import sharp from 'sharp'
import { mkdir, readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const axeSource = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8')

const base = (process.env.SITE_URL ?? 'http://127.0.0.1:5173').replace(/\/$/, '')
const outDir = process.env.SHOT_DIR ?? 'screenshots'
const executablePath =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const routes = ['/', '/leistungen', '/ueber-uns', '/schulungen', '/kontakt', '/impressum', '/datenschutz', '/gibt-es-nicht']
const viewports = [
  { name: 'mobile', width: 390, height: 844, scale: 2 },
  { name: 'tablet', width: 768, height: 1024, scale: 2 },
  { name: 'desktop', width: 1440, height: 900, scale: 1 },
]

await mkdir(outDir, { recursive: true })
let failures = 0
const report = (ok, message) => {
  if (!ok) failures += 1
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${message}`)
}
const shotName = (vp, route) => `${vp}${route === '/' ? '-home' : route.replaceAll('/', '-')}.png`

const srgb = (v) => {
  v /= 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}
const luminance = (r, g, b) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b)

/**
 * Kontrast von weißem Text gegen den hellsten 8×8-Pixel-Block hinter den genannten
 * Elementen. Der Text wird dafür kurz ausgeblendet; die Elemente müssen im Viewport liegen.
 */
async function contrastBehindWhiteText(page, selectors, hideSelector) {
  const rects = await page.evaluate(
    (sels) =>
      sels.map((s) => {
        const r = document.querySelector(s).getBoundingClientRect()
        return { x: Math.max(0, r.left), y: Math.max(0, r.top), width: Math.round(r.width), height: Math.round(r.height) }
      }),
    selectors,
  )
  await page.evaluate((s) => document.querySelectorAll(s).forEach((el) => (el.style.visibility = 'hidden')), hideSelector)
  let worst = Infinity
  for (const rect of rects) {
    const { data, info } = await sharp(await page.screenshot({ clip: rect })).raw().toBuffer({ resolveWithObject: true })
    const cell = 8
    let maxL = 0
    for (let y = 0; y + cell <= info.height; y += cell) {
      for (let x = 0; x + cell <= info.width; x += cell) {
        let r = 0
        let g = 0
        let b = 0
        for (let dy = 0; dy < cell; dy++) {
          for (let dx = 0; dx < cell; dx++) {
            const i = ((y + dy) * info.width + (x + dx)) * info.channels
            r += data[i]
            g += data[i + 1]
            b += data[i + 2]
          }
        }
        const n = cell * cell
        maxL = Math.max(maxL, luminance(r / n, g / n, b / n))
      }
    }
    worst = Math.min(worst, 1.05 / (maxL + 0.05))
  }
  await page.evaluate((s) => document.querySelectorAll(s).forEach((el) => (el.style.visibility = '')), hideSelector)
  return worst
}

const browser = await chromium.launch({ executablePath, headless: true })

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.scale,
    locale: 'de-DE',
  })
  for (const route of routes) {
    const page = await context.newPage()
    const errors = []
    const failedRequests = []
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('requestfailed', (r) => failedRequests.push(`${r.failure()?.errorText ?? 'failed'} ${r.url()}`))
    page.on('response', (r) => r.status() >= 400 && failedRequests.push(`${r.status()} ${r.url()}`))

    await page.goto(base + route, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in')))
    // Einmal durch die Seite scrollen, damit lazy geladene Bilder angefordert werden.
    await page.evaluate(async () => {
      const step = Math.max(200, window.innerHeight * 0.8)
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: 'instant' })
        await new Promise((resolve) => setTimeout(resolve, 40))
      }
      window.scrollTo({ top: 0, behavior: 'instant' })
    })
    await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 8000 }).catch(() => {})
    await page.waitForTimeout(300)

    const m = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelectorAll('h1').length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      images: [...document.images].map((i) => ({
        src: i.currentSrc || i.src,
        ok: i.complete && i.naturalWidth > 0,
        sized: Boolean(i.getAttribute('width') && i.getAttribute('height')),
        lazy: i.loading === 'lazy',
        alt: i.hasAttribute('alt'),
      })),
      landmarks: ['header', 'nav', 'main', 'footer'].filter((t) => !document.querySelector(t)),
      lang: document.documentElement.lang,
      paragraphs: document.querySelectorAll('main p').length,
    }))
    const label = `${vp.name.padEnd(7)} ${route.padEnd(16)}`
    report(errors.length === 0, `${label} console errors: ${errors.join(' | ') || 'none'}`)
    report(failedRequests.length === 0, `${label} failed requests: ${failedRequests.join(', ') || 'none'}`)
    report(m.overflow <= 0, `${label} horizontal overflow: ${m.overflow}px`)
    report(m.h1 === 1, `${label} exactly one h1 (found ${m.h1}), title "${m.title}"`)
    report(m.images.every((i) => i.ok), `${label} images loaded ${m.images.filter((i) => i.ok).length}/${m.images.length}${m.images.filter((i) => !i.ok).map((i) => ' MISSING ' + i.src).join('')}`)
    if (m.images.length > 0) {
      report(m.images.every((i) => i.sized && i.alt), `${label} every image has width/height and an alt attribute`)
      report(m.images.every((i) => /\.avif(\?|$)/.test(i.src)), `${label} AVIF variant served to Chrome`)
      report(m.images.filter((i) => i.lazy).length >= m.images.length - 1, `${label} below-the-fold images lazy-loaded (${m.images.filter((i) => !i.lazy).length} eager)`)
    }
    report(m.landmarks.length === 0 && m.lang === 'de', `${label} landmarks present, lang="${m.lang}"`)
    if (route === '/') {
      const motifs = new Set(m.images.map((i) => i.src.replace(/.*\/images\//, '').replace(/-\d+\.\w+(\?.*)?$/, '')))
      report(motifs.size >= 7 && motifs.size <= 9, `${label} ${motifs.size} distinct photographs on the homepage (7 to 9 expected)`)
      report(m.paragraphs <= 8, `${label} ${m.paragraphs} paragraphs of visible prose (at most 8)`)
    }

    if (vp.name !== 'tablet') {
      await page.addScriptTag({ content: axeSource })
      const violations = await page.evaluate(async () => {
        const result = await window.axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] },
        })
        return result.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.length,
          targets: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
        }))
      })
      report(violations.length === 0, `${label} axe violations: ${violations.length ? JSON.stringify(violations) : 'none'}`)
    }

    if (route === '/') {
      await page.screenshot({ path: path.join(outDir, `${vp.name}-home-erster-bildschirm.png`), fullPage: false })
    }
    await page.screenshot({ path: path.join(outDir, shotName(vp.name, route)), fullPage: true })
    await page.close()
  }
  await context.close()
}

// Mobiles Menü
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'de-DE' })
  const page = await context.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  const toggle = page.getByRole('button', { name: 'Menü öffnen' })
  await toggle.click()
  const menu = page.locator('#mobile-nav')
  report(await menu.isVisible(), 'mobile menu opens on click')
  report((await page.getByRole('button', { name: 'Menü schließen' }).getAttribute('aria-expanded')) === 'true', 'toggle reports aria-expanded="true"')
  await page.screenshot({ path: path.join(outDir, 'mobile-menu-open.png') })
  await page.keyboard.press('Escape')
  report(!(await menu.isVisible()), 'mobile menu closes on Escape')
  report(await page.evaluate(() => document.activeElement?.classList.contains('menu-toggle')), 'focus returns to the menu toggle after Escape')
  await page.getByRole('button', { name: 'Menü öffnen' }).click()
  await menu.getByRole('link', { name: 'Schulungen' }).click()
  await page.waitForURL('**/schulungen')
  await page.waitForTimeout(200)
  report(!(await menu.isVisible()), 'mobile menu closes after navigation')
  report((await page.title()).startsWith('Schulungen'), `document title after navigation: "${await page.title()}"`)
  await context.close()
}

// Vorgerenderte Routen: fertiges HTML mit eigenem Titel, auch ohne JavaScript lesbar
{
  for (const route of routes.filter((r) => r !== '/gibt-es-nicht')) {
    const html = await (await fetch(base + route)).text()
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''
    const ownTitle = route === '/' ? /GLE/.test(title) : !/^GLE ·/.test(title)
    report(/<h1[^>]*>/.test(html) && html.includes(`data-route="${route}"`) && ownTitle, `${route} is prerendered with its own title ("${title}")`)
  }
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(base + '/leistungen', { waitUntil: 'load' })
  const visible = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].every((el) => getComputedStyle(el).opacity === '1'))
  report((await page.locator('h1').innerText()) === 'Leistungen' && (await page.locator('.service__band img').count()) === 3 && visible, 'services page readable without JavaScript, nothing hidden')
  await context.close()
}

// Formular, Tastatur, Anker, Scroll
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' })
  const page = await context.newPage()
  await page.goto(base + '/kontakt', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Anfrage senden' }).click()
  report(await page.getByRole('alert').isVisible(), 'error summary (role=alert) shown on empty submit')
  const invalidFields = await page.locator('[aria-invalid="true"]:not([type="radio"])').count()
  const invalidChips = await page.locator('input[name="interest"][aria-invalid="true"]').count()
  report(invalidFields === 3 && invalidChips === 6, `invalid marked: ${invalidFields} fields + interest group (${invalidChips} chips)`)
  report((await page.evaluate(() => document.activeElement?.getAttribute('name'))) === 'interest', 'focus moved to the first invalid group (interest)')
  await page.screenshot({ path: path.join(outDir, 'desktop-kontakt-fehler.png'), fullPage: true })

  await page.getByRole('radio', { name: 'Neue Photovoltaikanlage', exact: true }).check()
  await page.getByLabel('Name', { exact: true }).fill('Testperson')
  await page.getByLabel('E-Mail-Adresse').fill('test@example.com')
  await page.getByLabel('Telefon (optional)').fill('abc')
  await page.getByLabel('Ihre Nachricht').fill('Wir planen eine Anlage auf einem Flachdach in Hessen.')
  await page.getByRole('button', { name: 'Anfrage senden' }).click()
  report((await page.locator('[aria-invalid="true"]').count()) === 1, 'invalid phone number caught, other fields accepted')
  await page.getByLabel('Telefon (optional)').fill('+49 30 1234567')
  await page.getByRole('button', { name: 'Anfrage senden' }).click()
  const status = page.locator('.form__result[role="status"]')
  await status.waitFor({ timeout: 5000 })
  const statusText = await status.innerText()
  report(/Demo-Modus/.test(statusText) && !/erfolgreich/i.test(statusText), `demo result after valid submit: "${statusText.slice(0, 60)}…"`)
  report(await page.evaluate(() => document.activeElement?.classList.contains('form__result')), 'result panel receives focus after submit')
  await page.screenshot({ path: path.join(outDir, 'desktop-kontakt-demo.png'), fullPage: true })

  await page.goto(base + '/kontakt?interesse=schulung-windenergie', { waitUntil: 'networkidle' })
  report(await page.getByRole('radio', { name: 'Schulung Windenergie', exact: true }).isChecked(), 'interest preselected from query string')
  report((await page.getByRole('radio', { name: 'Wohnhaus', exact: true }).count()) === 0, 'training interest hides the building question')

  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.keyboard.press('Tab')
  report(await page.evaluate(() => document.activeElement?.classList.contains('skip-link')), 'first Tab focuses the skip link')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(100)
  report(await page.evaluate(() => location.hash === '#inhalt'), 'skip link targets main content')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  report(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle !== 'none'), 'keyboard focus ring visible on focused link')

  await page.goto(base + '/leistungen#gebaeudetechnik', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  const anchorTop = await page.evaluate(() => document.getElementById('gebaeudetechnik')?.getBoundingClientRect().top)
  report(anchorTop >= 0 && anchorTop < 200, `anchor section near top after direct hash load: ${Math.round(anchorTop)}px`)

  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.evaluate(() => window.scrollTo(0, 2000))
  await page.locator('.site-nav').getByRole('link', { name: 'Über uns' }).click()
  await page.waitForURL('**/ueber-uns')
  await page.waitForTimeout(200)
  report((await page.evaluate(() => window.scrollY)) === 0, 'scroll position reset on client-side navigation')
  report(await page.evaluate(() => document.activeElement?.id === 'inhalt'), 'focus moved to main on client-side navigation')

  // Hauptnavigation: Die Flächen liegen genau auf dem jeweiligen Link.
  const navLayers = (linkName) =>
    page.evaluate((name) => {
      const link = [...document.querySelectorAll('.site-nav a')].find((a) => a.textContent === name)
      const box = link.getBoundingClientRect()
      const measure = (selector) => {
        const layer = document.querySelector(selector)
        const rail = layer.getBoundingClientRect()
        const inset = getComputedStyle(layer).clipPath.match(/inset\(([\d.]+)px ([\d.]+)px ([\d.]+)px ([\d.]+)px/)
        const left = rail.left + Number(inset?.[4] ?? 0)
        const right = rail.right - Number(inset?.[2] ?? 0)
        return { opacity: Number(getComputedStyle(layer).opacity), offset: Math.abs(left - box.left) + Math.abs(right - box.right) }
      }
      return { active: measure('.site-nav__active'), hover: measure('.site-nav__hover') }
    }, linkName)
  await page.waitForTimeout(400)
  let layers = await navLayers('Über uns')
  report(layers.active.opacity === 1 && layers.active.offset < 2, `nav: green pill sits on the current page (off by ${layers.active.offset.toFixed(1)}px)`)
  await page.locator('.site-nav').getByRole('link', { name: 'Kontakt' }).click()
  await page.waitForURL('**/kontakt')
  const midway = await navLayers('Kontakt')
  await page.waitForTimeout(400)
  layers = await navLayers('Kontakt')
  report(midway.active.offset > 2 && layers.active.offset < 2, `nav: green pill glides to the new page (${midway.active.offset.toFixed(0)}px away just after the click, then ${layers.active.offset.toFixed(1)}px)`)
  await page.locator('.site-nav').getByRole('link', { name: 'Schulungen' }).hover()
  await page.waitForTimeout(400)
  layers = await navLayers('Schulungen')
  report(layers.hover.opacity === 1 && layers.hover.offset < 2, `nav: highlight follows the pointer (off by ${layers.hover.offset.toFixed(1)}px)`)
  await page.mouse.move(700, 600)
  await page.waitForTimeout(300)
  report((await navLayers('Schulungen')).hover.opacity === 0, 'nav: highlight fades when the pointer leaves')
  await page.locator('.site-nav').getByRole('link', { name: 'Schulungen' }).focus()
  report((await page.locator('.site-nav').getByRole('link').count()) === 4, 'nav: the visual copy adds no extra links')
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  report((await navLayers('Kontakt')).active.opacity === 0, 'nav: no green pill on the home page')
  await context.close()
}

for (const width of [900, 1099, 1100]) {
  const context = await browser.newContext({ viewport: { width, height: 800 }, locale: 'de-DE' })
  const page = await context.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  const fit = await page.evaluate(() => {
    const inner = document.querySelector('.site-header__inner')
    return inner.scrollWidth - inner.clientWidth
  })
  report(fit <= 0, `header content fits at ${width}px (overflow ${fit}px)`)
  await context.close()
}

// Startseite (Desktop): Hero, Bildkarten, Bildmotiv, Ablauf, Schulungen, Abschluss
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' })
  const page = await context.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(900)

  const hero = await page.evaluate(() => {
    const section = document.querySelector('.hero').getBoundingClientRect()
    const img = document.querySelector('.hero__media img')
    return {
      height: section.height,
      imgOk: img.complete && getComputedStyle(img).opacity === '1',
      imgSrc: img.currentSrc,
      eager: img.loading === 'eager' && img.getAttribute('fetchpriority') === 'high',
      coversWidth: img.getBoundingClientRect().width >= window.innerWidth - 1,
      h1Opacity: getComputedStyle(document.querySelector('.hero h1')).opacity,
      h1Size: parseFloat(getComputedStyle(document.querySelector('.hero h1')).fontSize),
      h1Color: getComputedStyle(document.querySelector('.hero h1')).color,
      caption: document.querySelectorAll('.hero figcaption, .hero__caption').length,
    }
  })
  report(hero.height >= 560 && hero.height <= 680, `hero height at 1440×900: ${Math.round(hero.height)}px (560 to 680 expected)`)
  report(hero.coversWidth && hero.imgOk, 'hero photograph spans the full width and is never hidden')
  report(hero.eager && /hero-\d+\.avif/.test(hero.imgSrc), `hero photo loads eagerly with high priority (${hero.imgSrc.split('/').pop()})`)
  report(hero.h1Opacity === '1' && hero.h1Color === 'rgb(255, 255, 255)', 'white hero headline visible after the entrance sequence')
  report(hero.h1Size >= 56 && hero.h1Size <= 72, `hero headline size on desktop: ${hero.h1Size}px (56 to 72 expected)`)
  report(hero.caption === 0, 'hero has no caption tab')
  const heroContrast = await contrastBehindWhiteText(page, ['.hero h1', '.hero__lead'], '.hero__content')
  report(heroContrast >= 4.5, `hero text contrast against the darkened photo: ${heroContrast.toFixed(1)}:1 (worst 8×8 block, at least 4.5)`)
  report((await page.getByRole('link', { name: 'Leistungen entdecken' }).getAttribute('href')) === '/leistungen', 'hero secondary link leads to the services page')
  const headingTop = await page.evaluate(() => document.getElementById('services-title').getBoundingClientRect().top)
  report(headingTop < 860, `next section heading starts within the first screen (${Math.round(headingTop)}px)`)

  const headerHeight = () => page.evaluate(() => document.querySelector('.site-header').getBoundingClientRect().height)
  const heightAtTop = await headerHeight()
  report(await page.evaluate(() => getComputedStyle(document.querySelector('.site-header')).backgroundColor === 'rgb(255, 255, 255)'), 'header is white')
  const ctaColors = await page.evaluate(() => {
    const s = getComputedStyle(document.querySelector('.site-header__cta'))
    return { bg: s.backgroundColor, color: s.color }
  })
  report(ctaColors.bg === 'rgb(43, 122, 75)' && ctaColors.color === 'rgb(255, 255, 255)', `header consultation button is green with white text (${ctaColors.bg})`)
  await page.evaluate(() => window.scrollTo(0, 400))
  await page.waitForTimeout(150)
  report(await page.evaluate(() => document.querySelector('.site-header').classList.contains('is-scrolled')), 'header shows its scrolled state')
  report((await headerHeight()) === heightAtTop, `header height unchanged when scrolled (${heightAtTop}px)`)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(150)

  // Keine erklärenden Bausteine mehr auf der Startseite
  const removed = await page.evaluate(() => ({
    tabs: document.querySelectorAll('[role="tab"]').length,
    flow: document.querySelectorAll('.flow-section').length,
    selector: document.querySelectorAll('#vorhaben').length,
    faq: document.querySelectorAll('.faq').length,
    disclosures: document.querySelectorAll('.disclosure').length,
    lists: document.querySelectorAll('main .check-list, main .dash-list, main ol').length,
  }))
  report(Object.values(removed).every((n) => n === 0), `homepage without tabs, diagram, selector, FAQ and disclosures (${JSON.stringify(removed)})`)

  // Drei Bildkarten
  const cards = page.locator('.card')
  report((await cards.count()) === 3, 'three service cards visible at once')
  const cardFacts = await page.evaluate(() =>
    [...document.querySelectorAll('.card')].map((card) => {
      const media = card.querySelector('.card__media').getBoundingClientRect()
      const total = card.getBoundingClientRect()
      return {
        share: media.height / total.height,
        href: card.querySelector('.card__link').getAttribute('href'),
        src: card.querySelector('img').currentSrc.split('/').pop(),
        bullets: card.querySelectorAll('li').length,
      }
    }),
  )
  report(cardFacts.every((c) => c.share >= 0.55 && c.share <= 0.75), `card photos take roughly two thirds of each card (${cardFacts.map((c) => Math.round(c.share * 100) + '%').join(', ')})`)
  report(cardFacts.map((c) => c.href).join(' ') === '/leistungen#photovoltaik /leistungen#betrieb-und-pflege /leistungen#gebaeudetechnik', 'cards link to the existing service anchors')
  report(new Set(cardFacts.map((c) => c.src.replace(/-\d+\.\w+$/, ''))).size === 3 && cardFacts.every((c) => c.bullets === 0), 'cards use three distinct photos and no bullet lists')
  await cards.nth(1).hover()
  await page.waitForTimeout(700)
  report(await page.evaluate(() => getComputedStyle(document.querySelectorAll('.card img')[1]).transform !== 'none'), 'card photo zooms slightly on hover')
  await page.getByRole('link', { name: 'Betrieb & Pflege' }).focus()
  report(await page.evaluate(() => getComputedStyle(document.querySelectorAll('.card')[1]).outlineStyle !== 'none'), 'focused card shows a focus ring around the whole card')
  // Die ganze Karte ist Link: Klick mitten ins Foto (der gestreckte Link liegt darüber).
  const mediaBox = await cards.nth(2).locator('.card__media').boundingBox()
  await page.mouse.click(mediaBox.x + mediaBox.width / 2, mediaBox.y + mediaBox.height / 2)
  await page.waitForURL('**/leistungen#gebaeudetechnik')
  await page.waitForTimeout(400)
  report(page.url().endsWith('/leistungen#gebaeudetechnik'), 'clicking a card photo opens the service section')
  await page.goBack()
  await page.waitForURL(base + '/')
  await page.waitForTimeout(300)

  // Bildmotiv, Ablauf, Schulungen, Abschluss
  report((await page.getByRole('link', { name: 'Photovoltaik entdecken' }).getAttribute('href')) === '/leistungen#photovoltaik', 'feature panel links to the photovoltaics section')
  report(await page.evaluate(() => { const m = document.querySelector('.feature__media').getBoundingClientRect(); const s = document.querySelector('.feature__strip').getBoundingClientRect(); return s.top >= m.bottom - 1 && s.left >= m.left }), 'feature copy sits in a strip directly under the panorama, nothing overlaps the photo')
  report((await page.locator('.work__photo img').count()) === 2 && (await page.locator('.labels li').allInnerTexts()).join(' ') === 'Beraten. Planen. Umsetzen.', 'process section shows two photos and the three labels')
  report((await page.getByRole('link', { name: 'Mehr über uns' }).getAttribute('href')) === '/ueber-uns', 'process section links to the about page')
  report((await page.getByRole('link', { name: 'Schulungen entdecken' }).getAttribute('href')) === '/schulungen', 'training teaser links to the training page')
  const finish = page.locator('.cta--photo')
  report((await finish.count()) === 1 && (await finish.getByRole('link', { name: 'Beratung anfragen' }).getAttribute('href')) === '/kontakt', 'photographic closing section with consultation link')
  await finish.scrollIntoViewIfNeeded()
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in')))
  await page.waitForTimeout(600)
  const finishContrast = await contrastBehindWhiteText(page, ['.cta--photo h2'], '.cta--photo .cta__grid')
  report(finishContrast >= 4.5, `closing headline contrast against the overlaid photo: ${finishContrast.toFixed(1)}:1`)
  await page.screenshot({ path: path.join(outDir, 'desktop-home-abschluss.png') })
  await context.close()
}

// Leistungsseite: Bilder, Schaubild, Beratungslinks
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' })
  const page = await context.newPage()
  await page.goto(base + '/leistungen', { waitUntil: 'networkidle' })
  report((await page.locator('.band img').count()) === 0 && (await page.locator('.service__band img').count()) === 3, 'services page opens with the photovoltaics photo band; one wide photo per service group')
  report(await page.evaluate(() => [...document.querySelectorAll('.service__band img')].every((img) => Number(img.getAttribute('width')) / Number(img.getAttribute('height')) > 2.2)), 'service photos are wide crops (21:9 or 5:2)')
  const consult = page.getByRole('link', { name: 'Dazu beraten lassen' })
  report((await consult.count()) === 3 && (await consult.nth(1).getAttribute('href')) === '/kontakt?interesse=betrieb-und-pflege', 'each service group keeps its interest-prefilled consultation link')
  const flowHeading = page.locator('#flow-title')
  report((await flowHeading.evaluate((el) => el.tagName)) === 'H2' && (await flowHeading.evaluate((el) => el.closest('#photovoltaik + .flow-section') !== null)), 'energy flow diagram is its own section directly after photovoltaics')
  await flowHeading.scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  report((await page.locator('.flow__hit').count()) === 3, 'energy flow has 3 selectable nodes')
  await page.getByRole('button', { name: 'Wechselrichter' }).click()
  await page.waitForTimeout(300)
  report((await page.getByRole('button', { name: 'Wechselrichter' }).getAttribute('aria-pressed')) === 'true', 'selected flow node reports aria-pressed="true"')
  report(/Wechselrichter/.test(await page.locator('.flow__info').innerText()), 'flow explanation follows the selection')
  report(/Vereinfachte Darstellung/.test(await page.locator('.flow__caption').innerText()), 'flow diagram labelled as simplified')
  await page.screenshot({ path: path.join(outDir, 'desktop-leistungen-schaubild.png') })
  await context.close()
}

// Kontaktseite: Vorhaben im Formular, gemerkter Entwurf, Übergabe per Link, FAQ
{
  let context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' })
  let page = await context.newPage()
  await page.goto(base + '/kontakt', { waitUntil: 'networkidle' })
  const legends = await page.locator('.form__group > legend').allInnerTexts()
  report(legends.join(' | ') === 'Ihr Vorhaben | Ihre Kontaktdaten | Ihre Nachricht', `form steps: ${legends.join(' | ')}`)
  report((await page.locator('.contact__aside .steps-list').count()) === 1 && (await page.locator('.contact__aside .faq').count()) === 1, 'steps and FAQ sit in the side column next to the form')
  report(await page.evaluate(() => getComputedStyle(document.querySelector('.contact__aside')).position === 'sticky'), 'side column follows the form while scrolling')
  report((await page.locator('.contact__aside img').count()) === 0, 'no decorative photo beside the form')
  await page.getByRole('radio', { name: 'Gewerbe', exact: true }).check()
  await page.getByRole('radio', { name: 'Bestehende Anlage betreuen', exact: true }).check()
  const summary = await page.locator('.form__summary').innerText()
  report(/Gewerbegebäude/.test(summary), `choice summary: "${summary.slice(0, 70)}"`)
  await page.getByLabel('Ihre Nachricht').fill('Meine eigene Nachricht bleibt erhalten.')
  await page.getByRole('button', { name: 'Auswahl zurücksetzen' }).click()
  report((await page.getByRole('radio', { checked: true }).count()) === 0, 'reset clears both choices')
  report(await page.evaluate(() => document.activeElement?.tagName === 'LEGEND'), 'focus moves to the step heading after reset')
  report((await page.getByLabel('Ihre Nachricht').inputValue()) === 'Meine eigene Nachricht bleibt erhalten.', 'written message preserved after reset')

  // Der Entwurf überlebt den Datenschutz-Link, "Zurück" und Neuladen.
  await page.getByRole('radio', { name: 'Gebäudetechnik', exact: true }).check()
  await page.getByLabel('Name', { exact: true }).fill('Entwurf Person')
  await page.getByRole('link', { name: 'Datenschutzerklärung' }).click()
  await page.waitForURL('**/datenschutz')
  await page.goBack()
  await page.waitForURL('**/kontakt')
  await page.waitForTimeout(300)
  report((await page.getByLabel('Name', { exact: true }).inputValue()) === 'Entwurf Person' && (await page.getByRole('radio', { name: 'Gebäudetechnik', exact: true }).isChecked()), 'draft restored after the privacy link and Back')
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  report((await page.getByLabel('Ihre Nachricht').inputValue()) === 'Meine eigene Nachricht bleibt erhalten.', 'draft survives a reload')

  await page.goto(base + '/kontakt?interesse=photovoltaik&gebaeude=wohnhaus', { waitUntil: 'networkidle' })
  report((await page.getByRole('radio', { name: 'Wohnhaus', exact: true }).isChecked()) && (await page.getByRole('radio', { name: 'Neue Photovoltaikanlage', exact: true }).isChecked()), 'direct link with both parameters sets the choice')
  report(/Wohnhaus/.test(await page.locator('.form__summary').innerText()), 'summary describes the linked choice')
  report((await page.getByLabel('Name', { exact: true }).inputValue()) === 'Entwurf Person', 'linked choice keeps the saved draft text')
  await page.screenshot({ path: path.join(outDir, 'desktop-kontakt-vorhaben.png'), fullPage: true })
  await context.close()

  context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' })
  page = await context.newPage()
  await page.goto(base + '/kontakt', { waitUntil: 'networkidle' })
  report((await page.getByRole('radio', { checked: true }).count()) === 0 && (await page.getByLabel('Name', { exact: true }).inputValue()) === '', 'a new session starts with an empty form')

  report((await page.locator('.faq .disclosure__button').count()) === 4, 'contact page carries the 4 FAQ questions')
  const faqButton = page.getByRole('button', { name: 'Kann ich eine bestehende Anlage betreuen lassen?' })
  await page.getByRole('heading', { name: 'Häufige Fragen' }).click()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  report(await page.evaluate(() => document.activeElement?.textContent?.includes('bestehende Anlage betreuen lassen')), 'FAQ question reachable by keyboard')
  report(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle !== 'none'), 'focused FAQ question shows a focus ring')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(400)
  report((await faqButton.getAttribute('aria-expanded')) === 'true', 'FAQ question opens with the keyboard')
  report(await page.getByRole('link', { name: 'Mehr zu Betrieb & Pflege' }).isVisible(), 'opened FAQ answer is visible and reachable')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(400)
  report((await faqButton.getAttribute('aria-expanded')) === 'false', 'FAQ question closes again')
  await context.close()
}

// Über uns und Schulungen: Bildbänder, Prozesslinie, Interessenlinks
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' })
  const page = await context.newPage()
  await page.goto(base + '/ueber-uns', { waitUntil: 'networkidle' })
  report((await page.locator('.band img').count()) === 1, 'about page shows a photo band')
  await page.locator('.steps').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1300)
  report(await page.evaluate(() => getComputedStyle(document.querySelector('.step'), '::before').transform === 'none'), 'process connecting line drawn after entering view')
  await page.goto(base + '/schulungen', { waitUntil: 'networkidle' })
  report((await page.locator('.band img').count()) === 1, 'training page shows a photo band')
  const interest = page.getByRole('link', { name: 'Schulung anfragen' })
  report((await interest.count()) === 2 && (await interest.first().getAttribute('href')) === '/kontakt?interesse=schulung-photovoltaik', 'training topics keep their interest links')
  await context.close()
}

// Mobil: Hero-Kontrast, gestapelte Karten, kompakte Kontaktseite
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'de-DE' })
  const page = await context.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(900)
  const mobileHero = await page.evaluate(() => {
    const hero = document.querySelector('.hero').getBoundingClientRect()
    const h1 = document.querySelector('.hero h1')
    const img = document.querySelector('.hero__media img')
    return { height: hero.height, h1Size: parseFloat(getComputedStyle(h1).fontSize), h1Inside: h1.getBoundingClientRect().bottom <= hero.bottom, src: img.currentSrc.split('/').pop() }
  })
  report(mobileHero.height >= 520 && mobileHero.h1Inside, `mobile hero sized by its content (${Math.round(mobileHero.height)}px) with the headline inside`)
  report(mobileHero.h1Size >= 36 && mobileHero.h1Size <= 44, `mobile hero headline size: ${mobileHero.h1Size}px (36 to 44 expected)`)
  report(/^hero-hoch-/.test(mobileHero.src), `mobile hero uses the portrait crop (${mobileHero.src})`)
  const mobileContrast = await contrastBehindWhiteText(page, ['.hero h1', '.hero__lead'], '.hero__content')
  report(mobileContrast >= 4.5, `mobile hero text contrast: ${mobileContrast.toFixed(1)}:1`)
  const stacked = await page.evaluate(() => {
    const rects = [...document.querySelectorAll('.card')].map((c) => c.getBoundingClientRect())
    return rects.every((r, i) => r.width > window.innerWidth * 0.8 && (i === 0 || r.top >= rects[i - 1].bottom))
  })
  report(stacked, 'service cards stack vertically on mobile')
  report(await page.evaluate(() => { const l = document.querySelector('.work__photo--large').getBoundingClientRect(); const s = document.querySelector('.work__photo--small').getBoundingClientRect(); return s.top < l.bottom && s.bottom > l.bottom }), 'small process photo overlaps the large one on mobile')
  await page.goto(base + '/kontakt', { waitUntil: 'networkidle' })
  const formTop = await page.evaluate(() => document.querySelector('form').getBoundingClientRect().top + window.scrollY)
  report(formTop < 700, `contact form starts within ${Math.round(formTop)}px on mobile`)
  report(await page.evaluate(() => document.querySelector('.contact__aside').getBoundingClientRect().top >= document.querySelector('form').getBoundingClientRect().bottom), 'steps and FAQ follow the form on mobile')
  await page.getByRole('radio', { name: 'Wohnhaus', exact: true }).check()
  report((await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)) <= 0, 'no horizontal overflow on the mobile contact page')
  await context.close()
}

// Reduzierte Bewegung: keine Animationen, alles sofort sichtbar
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', locale: 'de-DE' })
  const page = await context.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter((el) => getComputedStyle(el).opacity !== '1').length)
  report(hidden === 0, `reduced motion: all reveal elements visible (${hidden} hidden)`)
  report((await page.evaluate(() => getComputedStyle(document.querySelector('.hero h1')).animationName)) === 'none', 'reduced motion: hero entrance disabled')
  await page.locator('.card').first().hover()
  await page.waitForTimeout(400)
  report(await page.evaluate(() => getComputedStyle(document.querySelector('.card img')).transform === 'none'), 'reduced motion: no photo zoom on hover')
  await page.goto(base + '/leistungen', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Gebäude', exact: true }).click()
  await page.waitForTimeout(200)
  report((await page.evaluate(() => getComputedStyle(document.querySelector('.flow__pulse')).animationName)) === 'none', 'reduced motion: flow pulse disabled')
  report(/Gebäude/.test(await page.locator('.flow__info').innerText()), 'reduced motion: flow selection still works')
  await page.goto(base + '/ueber-uns', { waitUntil: 'networkidle' })
  report(await page.evaluate(() => getComputedStyle(document.querySelector('.step'), '::before').transform === 'none'), 'reduced motion: process line visible without animation')
  await context.close()
}

await browser.close()
console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed')
process.exit(failures ? 1 : 0)
