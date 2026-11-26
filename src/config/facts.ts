/**
 * Kennzahlen für die Startseite, die Referenzen und „Über uns“. Jede Zahl stammt aus dem
 * vom Betreiber bereitgestellten Portfolio von Altay Rustamov (siehe PORTFOLIO-REVIEW.md);
 * nichts davon ist gemessen oder unabhängig geprüft. Die Website nennt die Quelle deshalb
 * immer mit. Vor dem Launch bitte bestätigen oder anpassen.
 */
import { referenceProjects } from './references'

export interface CompanyFact {
  value: number
  suffix?: string
  label: string
}

export const companyFacts: CompanyFact[] = [
  { value: 15, suffix: '+', label: 'Jahre Berufserfahrung in Europa' },
  { value: 400, suffix: '+', label: 'umgesetzte PV- und Wärmepumpensysteme nach eigenen Angaben' },
  // Zeilen der Referenzliste (Portfolio S. 7–8), nicht als Zahl einzelner Projekte zu lesen.
  { value: referenceProjects.length, label: 'Einträge in der Referenzliste des Portfolios' },
  { value: 3, label: 'Länder: Deutschland, Aserbaidschan und Polen' },
]

export const factsSource = 'Angaben nach dem Portfolio von Altay Rustamov, Gründer von GLE.'

/** Stichworte für das Laufband der Startseite: nur, was in services.ts und training.ts steht. */
export const serviceKeywords = [
  'Photovoltaik',
  'Monitoring',
  'Wartung',
  'Modulreinigung',
  'Heizung',
  'Kühlung',
  'Lüftung',
  'Schulungen',
]
