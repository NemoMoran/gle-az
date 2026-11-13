import { useSyncExternalStore } from 'react'

/** Reagiert auf eine Media Query, z. B. '(min-width: 900px)'. Ohne Fenster (Tests) immer false. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
