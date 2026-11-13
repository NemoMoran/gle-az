/**
 * Erzeugt aus den Originalfotos in assets-src/ optimierte, zugeschnittene
 * Varianten in public/images/ (AVIF, WebP und JPEG in mehreren Breiten) und
 * schreibt public/images/SOURCES.md mit allen Bildquellen und Lizenzen.
 * Varianten ohne Manifest-Eintrag werden aus public/images/ entfernt.
 *
 * Aufruf: npm run images
 * Konfiguration: src/config/images.json
 */
import sharp from 'sharp'
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const manifestPath = path.join(root, 'src/config/images.json')
const srcDir = path.join(root, 'assets-src')
const outDir = path.join(root, 'public/images')
const defaultFormats = ['avif', 'webp', 'jpg']

const encoders = {
  avif: (image) => image.avif({ quality: 62, effort: 4 }),
  webp: (image) => image.webp({ quality: 80 }),
  jpg: (image) => image.jpeg({ quality: 82, mozjpeg: true, progressive: true }),
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
await mkdir(outDir, { recursive: true })

const expected = new Set(['SOURCES.md'])
for (const [name, image] of Object.entries(manifest.images)) {
  for (const width of image.widths) {
    for (const format of image.formats ?? defaultFormats) expected.add(`${name}-${width}.${format}`)
  }
}
for (const file of await readdir(outDir)) {
  if (!expected.has(file)) {
    await unlink(path.join(outDir, file))
    console.log(`entfernt: ${file}`)
  }
}

for (const [name, image] of Object.entries(manifest.images)) {
  // Einmal EXIF-korrekt ausrichten, dann den Ausschnitt um den Fokuspunkt bestimmen.
  const oriented = await sharp(path.join(srcDir, image.source)).rotate().toBuffer()
  const { width: sourceWidth, height: sourceHeight } = await sharp(oriented).metadata()
  const targetAspect = image.aspect[0] / image.aspect[1]
  let cropWidth = sourceWidth
  let cropHeight = Math.round(sourceWidth / targetAspect)
  if (cropHeight > sourceHeight) {
    cropHeight = sourceHeight
    cropWidth = Math.round(sourceHeight * targetAspect)
  }
  // zoom < 1 verkleinert den Ausschnitt (engerer Bildausschnitt um den Fokuspunkt).
  const zoom = image.zoom ?? 1
  cropWidth = Math.round(cropWidth * zoom)
  cropHeight = Math.round(cropHeight * zoom)
  const [focusX, focusY] = image.focus ?? [0.5, 0.5]
  const region = {
    left: Math.round((sourceWidth - cropWidth) * focusX),
    top: Math.round((sourceHeight - cropHeight) * focusY),
    width: cropWidth,
    height: cropHeight,
  }
  const formats = image.formats ?? defaultFormats
  for (const width of image.widths) {
    const height = Math.round(width / targetAspect)
    if (width > cropWidth) {
      console.warn(`Warnung: ${name}-${width} ist breiter als der Ausschnitt (${cropWidth} px) und wird hochskaliert.`)
    }
    const resized = sharp(oriented).extract(region).resize({ width, height, fit: 'cover' })
    for (const format of formats) {
      await encoders[format](resized.clone()).toFile(path.join(outDir, `${name}-${width}.${format}`))
    }
    console.log(`${name}-${width} (${width}x${height}) ${formats.join('+')}`)
  }
}

const lines = [
  '# Bildquellen',
  '',
  'Alle Fotos wurden aus den unten genannten Quellen heruntergeladen, zugeschnitten und komprimiert',
  '(`npm run images`). Die Originale liegen lokal in `assets-src/` und sind nicht im Repository.',
  'Stockfotos zeigen keine Projekte, Mitarbeitenden oder Kundinnen und Kunden von GLE.',
  '',
]
for (const [name, image] of Object.entries(manifest.images)) {
  const c = image.credit
  if (!c?.title) continue
  lines.push(
    `## ${name}`,
    '',
    `- Titel: ${c.title}`,
    `- Urheber: ${c.author}${c.authorUrl ? ` (${c.authorUrl})` : ''}`,
    `- Lizenz: ${c.license}${c.licenseUrl ? ` (${c.licenseUrl})` : ''}`,
    `- Quelle: ${c.sourceUrl}`,
    `- Original: assets-src/${image.source}`,
    `- Zuschnitt: ${image.aspect.join(':')}, Breiten ${image.widths.join(', ')} px`,
    '',
  )
}
await writeFile(path.join(outDir, 'SOURCES.md'), lines.join('\n'))
console.log('SOURCES.md geschrieben')
