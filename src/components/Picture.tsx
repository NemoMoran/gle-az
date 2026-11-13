import { images, type ImageName } from '../lib/images'

export type { ImageName } from '../lib/images'

type Format = 'avif' | 'webp' | 'jpg'

interface ArtDirection {
  /** Media Query, ab der die alternative Variante gilt, z. B. "(min-width: 700px)". */
  media: string
  /** Schlüssel der alternativen Variante (anderer Zuschnitt desselben Motivs). */
  name: ImageName
  sizes?: string
}

interface PictureProps {
  name: ImageName
  /** `sizes`-Attribut, z. B. "(min-width: 900px) 50vw, 100vw" */
  sizes: string
  /** Für das Hero-Bild: sofort und mit hoher Priorität laden. */
  priority?: boolean
  alt?: string
  className?: string
  /** Optionaler zweiter Zuschnitt für größere Viewports (Art Direction). */
  art?: ArtDirection
}

const mime: Record<Format, string> = { avif: 'image/avif', webp: 'image/webp', jpg: 'image/jpeg' }
const modern: Format[] = ['avif', 'webp']

const srcSet = (name: ImageName, ext: Format) =>
  images[name].widths.map((width) => `/images/${name}-${width}.${ext} ${width}w`).join(', ')

/**
 * Responsives Bild aus /public/images: AVIF, WebP und JPEG in mehreren Breiten.
 * Die Dateien werden mit `npm run images` aus den Originalen in assets-src/ erzeugt.
 */
export function Picture({ name, sizes, priority = false, alt, className, art }: PictureProps) {
  const image = images[name]
  const maxWidth = Math.max(...image.widths)
  const height = Math.round((maxWidth * image.aspect[1]) / image.aspect[0])

  return (
    <picture className={className}>
      {art &&
        ([...modern, 'jpg'] as Format[]).map((ext) => (
          <source
            key={`${art.name}-${ext}`}
            media={art.media}
            type={mime[ext]}
            srcSet={srcSet(art.name, ext)}
            sizes={art.sizes ?? sizes}
          />
        ))}
      {modern.map((ext) => (
        <source key={ext} type={mime[ext]} srcSet={srcSet(name, ext)} sizes={sizes} />
      ))}
      <img
        src={`/images/${name}-${maxWidth}.jpg`}
        srcSet={srcSet(name, 'jpg')}
        sizes={sizes}
        width={maxWidth}
        height={height}
        alt={alt ?? image.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  )
}
