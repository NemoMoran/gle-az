/**
 * Prüft die laufende Website in echtem Chrome (headless) bei 390, 768 und 1440 px:
 * Konsolenfehler, fehlgeschlagene Requests, horizontales Überlaufen, genau eine h1,
 * geladene Bilder (AVIF, feste Maße, Lazy Loading), axe-core-Barrierefreiheit,
 * mobiles Menü, Formularvalidierung, Tastaturbedienung, Anker-Navigation,
 * Textkontrast auf Fotos (Hero, Abschluss), die bewegten Bausteine der Startseite
 * (Laufband, wechselnde Referenzkarte, Bildflächen, Kennzahlen, Ablauf, Referenzstrecke),
 * die schwebende Kopfleiste, das Schaubild auf der Leistungsseite, das Vorhaben im
 * Kontaktformular, den gemerkten Entwurf, FAQ und reduzierte Bewegung.
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
const routes = ['/', '/leistungen', '/referenzen', '/ueber-uns', '/schulungen', '/kontakt', '/impressum', '/datenschutz', '/gibt-es-nicht']
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
    // Lazy-Loading festhalten, dann alles Sichtbare laden: Fotos in waagerechten Strecken und
    // Laufbändern liegen seitlich außerhalb des Fensters. Bilder ohne Layout (der jeweils
    // ausgeblendete Satz der Ablauf-Fotos) werden nie geladen und zählen nicht.
    const lazyFlags = await page.evaluate(() => [...document.images].filter((i) => i.getClientRects().length > 0).map((i) => i.loading === 'lazy'))
    await page.evaluate(() => [...document.images].filter((i) => i.getClientRects().length > 0).forEach((i) => (i.loading = 'eager')))
    await page.waitForFunction(() => [...document.images].filter((i) => i.getClientRects().length > 0).every((i) => i.complete), null, { timeout: 12000 }).catch(() => {})
    await page.waitForTimeout(300)

    const m = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelectorAll('h1').length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      images: [...document.images].filter((i) => i.getClientRects().length > 0).map((i) => ({
        src: i.currentSrc || i.src,
        ok: i.complete && i.naturalWidth > 0,
        sized: Boolean(i.getAttribute('width') && i.getAttribute('height')),
        alt: i.hasAttribute('alt'),
      })),
      landmarks: ['header', 'nav', 'main', 'footer'].filter((t) => !document.querySelector(t)),
      lang: document.documentElement.lang,
      paragraphs: [...document.querySelectorAll('main p')].filter((p) => p.textContent.trim().length > 90).length,
    }))
    m.images.forEach((image, index) => (image.lazy = lazyFlags[index]))

    const label = `${vp.name.padEnd(7)} ${route.padEnd(16)}`
    report(errors.length === 0, `${label} console errors: ${errors.join(' | ') || 'none'}`)
    report(failedRequests.length === 0, `${label} failed requests: ${failedRequests.join(', ') || 'none'}`)
    report(m.overflow <= 0, `${label} horizontal overflow: ${m.overflow}px`)
    report(m.h1 === 1, `${label} exactly one h1 (found ${m.h1}), title "${m.title}"`)
    report(m.images.every((i) => i.ok), `${label} images loaded ${m.images.filter((i) => i.ok).length}/${m.images.length}${m.images.filter((i) => !i.ok).map((i) => ' MISSING ' + i.src).join('')}`)
    if (m.images.length > 0) {
      report(m.images.every((i) => i.sized && i.alt), `${label} every image has width/height and an alt attribute`)
      // Fotos der Bildpipeline kommen als AVIF; die Projektfotos aus dem Portfolio liegen als WebP vor.
      report(m.images.every((i) => /\/images\/portfolio\/.+\.webp(\?|$)/.test(i.src) || /\.avif(\?|$)/.test(i.src)), `${label} AVIF variant served to Chrome (portfolio photos as WebP)`)
      report(m.images.filter((i) => !i.lazy).length <= 2, `${label} below-the-fold images lazy-loaded (${m.images.filter((i) => !i.lazy).length} eager)`)
    }
    report(m.landmarks.length === 0 && m.lang === 'de', `${label} landmarks present, lang="${m.lang}"`)
    if (route === '/') {
      const motifs = new Set(m.images.map((i) => i.src.replace(/.*\/images\//, '').replace(/-\d+\.\w+(\?.*)?$/, '').replace(/^hero-hoch$/, 'hero')))
      report(motifs.size >= 10, `${label} ${motifs.size} distinct photographs on the homepage (at least 10 expected)`)
      report(m.paragraphs <= 9, `${label} ${m.paragraphs} paragraphs longer than a line or two on the homepage (at most 9)`)
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
  const unclipped = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].every((el) => getComputedStyle(el).clipPath === 'none'))
  report(/Drei Bereiche/.test(await page.locator('h1').innerText()) && (await page.locator('.service__photo img').count()) === 3 && visible && unclipped, 'services page readable without JavaScript, nothing hidden')
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
  await page.waitForTimeout(700)
  report(await page.evaluate(() => document.querySelector('.site-header').classList.contains('is-hidden') && document.querySelector('.site-header').getBoundingClientRect().bottom <= 0), 'header moves out of the way while scrolling down')
  await page.evaluate(() => window.scrollTo(0, 1900))
  await page.waitForTimeout(700)
  report(await page.evaluate(() => !document.querySelector('.site-header').classList.contains('is-hidden') && document.querySelector('.site-header__bar').getBoundingClientRect().top >= 0), 'header returns when scrolling up')
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
  await page.waitForTimeout(700)
  layers = await navLayers('Kontakt')
  report(midway.active.offset > 2 && layers.active.offset < 2, `nav: green pill glides to the new page (${midway.active.offset.toFixed(0)}px away just after the click, then ${layers.active.offset.toFixed(1)}px)`)
  await page.locator('.site-nav').getByRole('link', { name: 'Schulungen' }).hover()
  await page.waitForTimeout(700)
  layers = await navLayers('Schulungen')
  report(layers.hover.opacity === 1 && layers.hover.offset < 2, `nav: highlight follows the pointer (off by ${layers.hover.offset.toFixed(1)}px)`)
  await page.mouse.move(700, 600)
  await page.waitForTimeout(300)
  report((await navLayers('Schulungen')).hover.opacity === 0, 'nav: highlight fades when the pointer leaves')
  await page.locator('.site-nav').getByRole('link', { name: 'Schulungen' }).focus()
  report((await page.locator('.site-nav').getByRole('link').count()) === 5, 'nav: the visual copy adds no extra links')
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  report((await navLayers('Kontakt')).active.opacity === 0, 'nav: no green pill on the home page')
  await context.close()
}

for (const width of [320, 460, 959, 960, 1179, 1180]) {
  const context = await browser.newContext({ viewport: { width, height: 800 }, locale: 'de-DE' })
  const page = await context.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  const fit = await page.evaluate(() => {
    const bar = document.querySelector('.site-header__bar')
    const parts = [...bar.children].filter((el) => getComputedStyle(el).display !== 'none').map((el) => el.getBoundingClientRect())
    const overlap = parts.some((rect, index) => index > 0 && rect.left < parts[index - 1].right - 1)
    return { overflow: bar.scrollWidth - bar.clientWidth, overlap }
  })
  report(fit.overflow <= 0 && !fit.overlap, `header content fits at ${width}px (overflow ${fit.overflow}px, overlap ${fit.overlap})`)
  await context.close()
}

// Startseite (Desktop): Hero, Kopfleiste, Laufband, Referenzkarte, Bildflächen, Kennzahlen, Ablauf, Referenzen, Abschluss
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' })
  const page = await context.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(3200)

  const hero = await page.evaluate(() => {
    const frame = document.querySelector('.hero__frame').getBoundingClientRect()
    const img = document.querySelector('.hero__media img')
    const h1 = document.querySelector('.hero h1')
    return {
      height: frame.height,
      bottom: frame.bottom,
      imgOk: img.complete && getComputedStyle(img).opacity === '1' && getComputedStyle(img).visibility === 'visible',
      imgSrc: img.currentSrc,
      eager: img.loading === 'eager' && img.getAttribute('fetchpriority') === 'high',
      covers: img.getBoundingClientRect().width >= frame.width - 1 && img.getBoundingClientRect().height >= frame.height - 1,
      h1Text: h1.innerText.replace(/\s+/g, ' '),
      h1Size: parseFloat(getComputedStyle(h1).fontSize),
      h1Color: getComputedStyle(h1).color,
      wordsSettled: [...h1.querySelectorAll('.split__w > span')].every((w) => getComputedStyle(w).translate === 'none'),
    }
  })
  report(hero.height >= 620 && hero.bottom <= 900, `hero frame fills the first screen at 1440×900: ${Math.round(hero.height)}px`)
  report(hero.covers && hero.imgOk, 'hero photograph fills its frame and is never hidden')
  report(hero.eager && /hero-\d+\.avif/.test(hero.imgSrc), `hero photo loads eagerly with high priority (${hero.imgSrc.split('/').pop()})`)
  report(hero.h1Text === 'Energie, die weiterdenkt.' && hero.wordsSettled && hero.h1Color === 'rgb(255, 255, 255)', `white hero headline in place after the entrance: "${hero.h1Text}"`)
  report(hero.h1Size >= 96 && hero.h1Size <= 160, `hero headline size on desktop: ${hero.h1Size}px (96 to 160 expected)`)
  const headlineContrast = await contrastBehindWhiteText(page, ['.hero h1'], '.hero__inner')
  report(headlineContrast >= 3, `hero headline contrast against the photo: ${headlineContrast.toFixed(1)}:1 (worst 8×8 block; large text needs 3)`)
  const heroContrast = await contrastBehindWhiteText(page, ['.hero__lead', '.hero__actions .arrow-link'], '.hero__inner')
  report(heroContrast >= 4.5, `hero text contrast against the photo: ${heroContrast.toFixed(1)}:1 (worst 8×8 block, at least 4.5)`)
  report((await page.getByRole('link', { name: 'Leistungen entdecken' }).getAttribute('href')) === '/leistungen', 'hero secondary link leads to the services page')

  // Kopfleiste: schwebt, Schattenzustand beim Scrollen
  const bar = await page.evaluate(() => {
    const el = document.querySelector('.site-header__bar')
    const rect = el.getBoundingClientRect()
    const cta = getComputedStyle(document.querySelector('.site-header__cta'))
    return { top: rect.top, height: rect.height, position: getComputedStyle(el.parentElement).position, ctaBg: cta.backgroundColor, ctaColor: cta.color }
  })
  report(bar.position === 'fixed' && bar.top > 0 && bar.height >= 56, `header floats above the page (${Math.round(bar.top)}px from the top, ${bar.height}px tall)`)
  report(bar.ctaBg === 'rgb(23, 62, 43)' && bar.ctaColor === 'rgb(255, 255, 255)', `header consultation button is forest green with white text (${bar.ctaBg})`)
  await page.evaluate(() => window.scrollTo(0, 300))
  await page.waitForTimeout(250)
  report(await page.evaluate(() => document.querySelector('.site-header').classList.contains('is-scrolled')), 'header shows its scrolled state')
  report((await page.evaluate(() => document.querySelector('.site-header__bar').getBoundingClientRect().height)) === bar.height, `header height unchanged when scrolled (${bar.height}px)`)
  report(await page.evaluate(() => Number(getComputedStyle(document.documentElement).getPropertyValue('--scroll')) > 0), 'scroll progress follows the page position')
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(250)

  // Wechselnde Referenzkarte im Hero
  const spotlight = page.locator('.spotlight')
  const firstHref = await spotlight.locator('.spotlight__card').getAttribute('href')
  report((await spotlight.locator('.spotlight__segment').count()) === 4 && /^\/referenzen#projekt-\d+$/.test(firstHref), `hero card shows a reference and four segments (${firstHref})`)
  await spotlight.getByRole('button', { name: 'Projektwechsel anhalten' }).click()
  report((await spotlight.getAttribute('data-playing')) === null && (await spotlight.getByRole('button', { name: 'Projektwechsel fortsetzen' }).count()) === 1, 'hero card rotation can be paused')
  await spotlight.locator('.spotlight__segment').nth(2).click()
  await page.waitForTimeout(200)
  report((await spotlight.locator('.spotlight__card').getAttribute('href')) === '/referenzen#projekt-18', 'segments select a reference directly')
  await page.waitForTimeout(6500)
  report((await spotlight.locator('.spotlight__card').getAttribute('href')) === '/referenzen#projekt-18', 'paused hero card stays on the chosen reference')

  // Laufband
  const marquee = page.locator('.marquee--words')
  report((await marquee.locator('.marquee__rows').getAttribute('aria-hidden')) === 'true' && (await marquee.locator('a').count()) === 0, 'keyword marquee is decorative: hidden from assistive technology, no links')
  await marquee.getByRole('button', { name: /Laufband .* anhalten/ }).click()
  await page.mouse.move(700, 600)
  report(await page.evaluate(() => getComputedStyle(document.querySelector('.marquee--words .marquee__track')).animationPlayState === 'paused'), 'marquee can be paused with its switch')

  // Leitsatz
  await page.locator('.statement__text').scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollBy(0, 500))
  await page.waitForTimeout(400)
  report(await page.evaluate(() => Number(getComputedStyle(document.querySelector('.statement__text')).getPropertyValue('--p')) > 0.9), 'statement text is fully highlighted once scrolled past')

  // Drei Bildflächen
  const panels = page.locator('.panel')
  report((await panels.count()) === 3 && (await page.locator('.panel.is-active').count()) === 1, 'three service panels, one open')
  const panelFacts = await page.evaluate(() =>
    [...document.querySelectorAll('.panel')].map((panel) => ({
      width: panel.getBoundingClientRect().width,
      href: panel.querySelector('.panel__link').getAttribute('href'),
      src: panel.querySelector('img').currentSrc.split('/').pop(),
      links: panel.querySelectorAll('a, button').length,
    })),
  )
  report(panelFacts.map((p) => p.href).join(' ') === '/leistungen#photovoltaik /leistungen#betrieb-und-pflege /leistungen#gebaeudetechnik', 'panels link to the existing service anchors')
  report(new Set(panelFacts.map((p) => p.src.replace(/-\d+\.\w+$/, ''))).size === 3 && panelFacts.every((p) => p.links === 1), 'panels use three distinct photos and exactly one link each')
  report(panelFacts[0].width > panelFacts[1].width * 2, `open panel is clearly wider (${Math.round(panelFacts[0].width)}px vs ${Math.round(panelFacts[1].width)}px)`)
  await panels.nth(1).scrollIntoViewIfNeeded()
  await panels.nth(1).hover()
  await page.waitForTimeout(1100)
  report(await page.evaluate(() => { const p = [...document.querySelectorAll('.panel')]; return p[1].classList.contains('is-active') && p[1].getBoundingClientRect().width > p[0].getBoundingClientRect().width * 2 }), 'hovering a panel opens it')
  // Mit der Tastatur weiter zur dritten Fläche (nur so gilt der Fokus als sichtbar).
  await page.getByRole('link', { name: 'Betrieb & Pflege', exact: true }).focus()
  await page.keyboard.press('Tab')
  await page.waitForTimeout(1100)
  report(await page.evaluate(() => { const p = document.querySelectorAll('.panel')[2]; return p.classList.contains('is-active') && getComputedStyle(p).outlineStyle !== 'none' }), 'keyboard focus opens a panel and rings the whole panel')
  const mediaBox = await panels.nth(2).boundingBox()
  await page.mouse.click(mediaBox.x + mediaBox.width / 2, mediaBox.y + mediaBox.height / 3)
  await page.waitForURL('**/leistungen#gebaeudetechnik')
  await page.waitForTimeout(400)
  report(page.url().endsWith('/leistungen#gebaeudetechnik'), 'clicking into a panel photo opens the service section')
  await page.goBack()
  await page.waitForURL(base + '/')
  await page.waitForTimeout(400)

  // Kennzahlen
  await page.locator('.stats__grid').scrollIntoViewIfNeeded()
  await page.waitForTimeout(2600)
  const stats = await page.locator('.stat__value .count > [aria-hidden]').allInnerTexts()
  report(stats.join(' ') === '15+ 400+ 51 3', `figures count up to their values (${stats.join(' ')})`)
  report(/Portfolio von Altay Rustamov/.test(await page.locator('.stats__foot').innerText()), 'figures name their source')

  // Ablauf
  report((await page.locator('.process__step').count()) === 3 && (await page.locator('.process__shot').count()) === 3, 'process shows three steps with one photo each')
  await page.locator('.process__step').nth(2).scrollIntoViewIfNeeded()
  await page.evaluate(() => { const r = document.querySelectorAll('.process__step')[2].getBoundingClientRect(); window.scrollBy(0, r.top + r.height / 2 - window.innerHeight / 2) })
  await page.waitForTimeout(900)
  report((await page.locator('.process__badge').innerText()) === '03 / 03' && (await page.locator('.process__shot.is-active img').getAttribute('src')).includes('prozess-3'), 'sticky process photo follows the step in view')

  // Referenzstrecke
  const cards = page.locator('.ref-card')
  report((await cards.count()) === 4 && (await cards.first().locator('a').getAttribute('href')) === '/referenzen#projekt-4', 'reference strip shows the four selected projects')
  await page.locator('.refs__track').scrollIntoViewIfNeeded()
  report(await page.getByRole('button', { name: 'Vorherige Referenz' }).isDisabled(), 'previous button disabled at the start of the strip')
  await page.getByRole('button', { name: 'Nächste Referenz' }).click()
  await page.waitForTimeout(900)
  report(await page.evaluate(() => document.querySelector('.refs__track').scrollLeft > 300), 'next button moves the reference strip')
  report(!(await page.getByRole('button', { name: 'Vorherige Referenz' }).isDisabled()), 'previous button enabled after moving')

  // Schulungen und Abschluss
  report((await page.getByRole('link', { name: 'Schulungen entdecken' }).getAttribute('href')) === '/schulungen', 'training teaser links to the training page')
  const finish = page.locator('.cta__frame--photo')
  report((await finish.count()) === 1 && (await finish.getByRole('link', { name: 'Beratung anfragen' }).getAttribute('href')) === '/kontakt', 'photographic closing section with consultation link')
  await finish.scrollIntoViewIfNeeded()
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in')))
  await page.waitForTimeout(1400)
  const finishContrast = await contrastBehindWhiteText(page, ['.cta__frame--photo h2', '.cta__foot p'], '.cta__inner')
  report(finishContrast >= 4.5, `closing text contrast against the overlaid photo: ${finishContrast.toFixed(1)}:1`)
  await page.screenshot({ path: path.join(outDir, 'desktop-home-abschluss.png') })
  await context.close()
}

// Leistungsseite: Bilder, Schaubild, Beratungslinks
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' })
  const page = await context.newPage()
  await page.goto(base + '/leistungen', { waitUntil: 'networkidle' })
  report((await page.locator('.page-hero__media img').count()) === 1 && (await page.locator('.service__photo img').count()) === 3, 'services page opens with a photo band; one photo per service group')
  report((await page.locator('.jump-link').count()) === 3 && (await page.locator('.jump-link').nth(2).getAttribute('href')) === '/leistungen#gebaeudetechnik', 'jump links lead to the three service groups')
  report(await page.evaluate(() => getComputedStyle(document.querySelector('.service__media')).position === 'sticky'), 'service photo stays in view beside the text')
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
  report((await page.locator('.page-hero__media img').count()) === 1, 'about page shows a photo band')
  report((await page.locator('.ledger li').count()) === 6 && (await page.locator('.location').count()) === 3 && (await page.locator('.mosaic__item').count()) === 3, 'about page shows six collaborations, three locations and three fair photos')
  await page.locator('.mosaic__item').first().scrollIntoViewIfNeeded()
  await page.locator('.mosaic__item').first().click()
  await page.locator('dialog.lightbox').waitFor({ state: 'visible' })
  report((await page.locator('dialog.lightbox h2').innerText()) === 'Im fachlichen Austausch', 'fair photos open in the gallery')
  await page.keyboard.press('Escape')
  await page.locator('dialog.lightbox').waitFor({ state: 'detached' })
  await page.locator('.steps').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1300)
  report(await page.evaluate(() => getComputedStyle(document.querySelector('.step'), '::before').transform === 'none'), 'process connecting line drawn after entering view')
  await page.goto(base + '/schulungen', { waitUntil: 'networkidle' })
  report((await page.locator('.page-hero__media img').count()) === 1, 'training page shows a photo band')
  report((await page.locator('.activity').count()) === 5, 'training page lists the five documented courses and seminars')
  const interest = page.locator('.topic').getByRole('link', { name: 'Schulung anfragen' })
  report((await interest.count()) === 2 && (await interest.first().getAttribute('href')) === '/kontakt?interesse=schulung-photovoltaik', 'training topics keep their interest links')
  await context.close()
}

// Mobil: Hero-Kontrast, gestapelte Karten, kompakte Kontaktseite
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'de-DE' })
  const page = await context.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(3200)
  const mobileHero = await page.evaluate(() => {
    const hero = document.querySelector('.hero').getBoundingClientRect()
    const h1 = document.querySelector('.hero h1')
    const img = document.querySelector('.hero__media img')
    return { height: hero.height, h1Size: parseFloat(getComputedStyle(h1).fontSize), h1Inside: h1.getBoundingClientRect().bottom <= hero.bottom, src: img.currentSrc.split('/').pop() }
  })
  report(mobileHero.height >= 520 && mobileHero.h1Inside, `mobile hero sized by its content (${Math.round(mobileHero.height)}px) with the headline inside`)
  report(mobileHero.h1Size >= 44 && mobileHero.h1Size <= 60, `mobile hero headline size: ${mobileHero.h1Size}px (44 to 60 expected)`)
  report(/^hero-hoch-/.test(mobileHero.src), `mobile hero uses the portrait crop (${mobileHero.src})`)
  const mobileHeadline = await contrastBehindWhiteText(page, ['.hero h1'], '.hero__inner')
  report(mobileHeadline >= 3, `mobile hero headline contrast: ${mobileHeadline.toFixed(1)}:1 (large text needs 3)`)
  const mobileContrast = await contrastBehindWhiteText(page, ['.hero__lead'], '.hero__inner')
  report(mobileContrast >= 4.5, `mobile hero text contrast: ${mobileContrast.toFixed(1)}:1`)
  const stacked = await page.evaluate(() => {
    const rects = [...document.querySelectorAll('.panel')].map((c) => c.getBoundingClientRect())
    return rects.every((r, i) => r.width > window.innerWidth * 0.8 && (i === 0 || r.top >= rects[i - 1].bottom))
  })
  report(stacked, 'service panels stack vertically on mobile')
  report(await page.evaluate(() => [...document.querySelectorAll('.panel__detail')].every((d) => getComputedStyle(d).opacity === '1' && d.getBoundingClientRect().height > 40)), 'stacked panels show their details without interaction')
  report(await page.evaluate(() => getComputedStyle(document.querySelector('.process__media')).display === 'none' && [...document.querySelectorAll('.process__inline')].every((el) => getComputedStyle(el).display !== 'none')), 'process photos sit with their steps on mobile')
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
  report(await page.evaluate(() => ['.hero .split__w > span', '.hero__media img', '.hero__foot'].every((s) => getComputedStyle(document.querySelector(s)).animationName === 'none')), 'reduced motion: hero entrance disabled')
  report(await page.evaluate(() => [...document.querySelectorAll('.marquee__track')].every((t) => getComputedStyle(t).animationName === 'none')), 'reduced motion: marquee stands still')
  report((await page.locator('.spotlight').getAttribute('data-playing')) === null, 'reduced motion: hero card does not rotate')
  report(await page.evaluate(() => [...document.querySelectorAll('[data-parallax] img')].every((img) => getComputedStyle(img).translate === 'none')), 'reduced motion: photos do not move with the scroll position')
  await page.locator('.ref-card').first().scrollIntoViewIfNeeded()
  await page.locator('.ref-card').first().hover()
  await page.waitForTimeout(400)
  report(await page.evaluate(() => getComputedStyle(document.querySelector('.ref-card img')).transform === 'none'), 'reduced motion: no photo zoom on hover')
  report((await page.locator('.stat__value .count > [aria-hidden]').first().innerText()) === '15+', 'reduced motion: figures show their value without counting')
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
