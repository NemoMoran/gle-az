/**
 * Zentrale Stammdaten der Website.
 *
 * Alles, was hier `null` ist, ist noch nicht bestätigt. Die Website blendet
 * fehlende Angaben aus (Footer, Kontaktseite) oder markiert sie in den
 * Rechtstext-Entwürfen sichtbar als offenen Punkt. Vor der Veröffentlichung
 * müssen alle Werte ausgefüllt werden, siehe README.md, Abschnitt "Vor dem Launch".
 *
 * Die Kontaktdaten der Referenzseite gle.az werden bewusst nicht übernommen.
 */
export interface SiteConfig {
  brand: {
    /** Kurzform im Header und als Wortmarke. */
    short: string
    /** Ausgeschriebener Name (Arbeitsstand, noch keine eingetragene Firma). */
    name: string
    /** Positionierung in einer Zeile. */
    tagline: string
  }
  legal: {
    companyName: string | null
    legalForm: string | null
    representedBy: string | null
    registerCourt: string | null
    registerNumber: string | null
    vatId: string | null
    contentResponsible: string | null
  }
  address: {
    street: string | null
    postalCode: string | null
    city: string | null
    country: string
  }
  contact: {
    phone: string | null
    email: string | null
  }
  /** Z. B. "Rhein-Main-Gebiet" oder "bundesweit". */
  serviceRegion: string | null
  /** Kanonische Domain ohne Protokoll, z. B. "example.de". */
  domain: string | null
}

export const site: SiteConfig = {
  brand: {
    short: 'GLE',
    name: 'Green Life Engineering',
    tagline: 'Photovoltaik & effiziente Gebäudetechnik',
  },
  legal: {
    companyName: null,
    legalForm: null,
    representedBy: null,
    registerCourt: null,
    registerNumber: null,
    vatId: null,
    contentResponsible: null,
  },
  address: {
    street: null,
    postalCode: null,
    city: null,
    country: 'Deutschland',
  },
  contact: {
    phone: null,
    email: null,
  },
  serviceRegion: null,
  domain: null,
}

/** Vollständige Postanschrift, sobald alle Teile bekannt sind. */
export function formattedAddress(): string[] | null {
  const { street, postalCode, city } = site.address
  if (!street || !postalCode || !city) return null
  return [street, `${postalCode} ${city}`]
}
