import { site } from '../config/site'

/** Einfache typografische Wortmarke, bis ein freigegebenes Logo vorliegt. */
export function Wordmark() {
  return (
    <>
      <span className="wordmark__short">{site.brand.short}</span>
      <span className="wordmark__name">{site.brand.name}</span>
    </>
  )
}
