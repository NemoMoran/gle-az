import manifest from '../config/images.json'

/** Alle Bilder außer dem reinen Social-Media-Bild, das nur als JPEG existiert. */
export type ImageName = Exclude<keyof typeof manifest.images, 'og'>

export interface ImageEntry {
  aspect: number[]
  widths: number[]
  alt: string
}

export const images = manifest.images as Record<ImageName, ImageEntry>
