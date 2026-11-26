import images from '../config/portfolio-images.json'
export function portfolioImages(page: number) {
  return (images as Record<string, { src: string; width: number; height: number }[]>)[String(page)] ?? []
}
export function PortfolioImage({ page, index = 0, alt, className = '', priority = false }: { page: number; index?: number; alt: string; className?: string; priority?: boolean }) {
  const image = portfolioImages(page)[index]
  return image ? <img {...image} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" className={className} /> : null
}
