import { useEffect } from 'react'

/** Beim Vorrendern (ohne DOM) merkt sich der Server hier Titel und Beschreibung der gerenderten Route. */
export const serverMeta = { title: '', description: '' }

/** Setzt Seitentitel und Meta-Description pro Route. */
export function usePageMeta(title: string, description: string) {
  if (typeof document === 'undefined') {
    serverMeta.title = title
    serverMeta.description = description
  }

  useEffect(() => {
    document.title = title
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description
  }, [title, description])
}
