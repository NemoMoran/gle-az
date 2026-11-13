/**
 * Schritt 1 des Kontaktformulars ("Ihr Vorhaben") und der Entwurf der Anfrage.
 *
 * Links von Leistungs- und Schulungsseite setzen das Interesse per URL
 * (?interesse=…, optional &gebaeude=…). Der Entwurf, also alle Eingaben, wird für
 * die laufende Browsersitzung gemerkt, damit ein Seitenwechsel oder Neuladen nichts
 * löscht. Er bleibt im Browser; übertragen wird nichts.
 */
import { buildingOptions, interestOptions } from '../config/contact'

export const PARAM_INTEREST = 'interesse'
export const PARAM_BUILDING = 'gebaeude'

export function isInterest(value: string | null | undefined): value is string {
  return interestOptions.some((option) => option.value === value)
}

export function isBuilding(value: string | null | undefined): value is string {
  return buildingOptions.some((option) => option.value === value)
}

/** Schulungen betreffen kein Gebäude; die zweite Frage entfällt dann. */
export function isTraining(interest: string): boolean {
  return interest.startsWith('schulung-')
}

const interestPhrase: Record<string, string> = {
  photovoltaik: 'Eine neue Photovoltaikanlage',
  'betrieb-und-pflege': 'Die Betreuung einer bestehenden Anlage',
  gebaeudetechnik: 'Gebäudetechnik',
  'schulung-photovoltaik': 'Eine Schulung zu Photovoltaik',
  'schulung-windenergie': 'Eine Schulung zu Windenergie',
  allgemein: 'Ein offenes Erstgespräch',
}

const buildingPhrase: Record<string, string> = {
  wohnhaus: 'Wohnhaus',
  gewerbe: 'Gewerbegebäude',
}

/** Ein Satz in Alltagssprache, sobald das Interesse gewählt ist, z. B. "Eine neue Photovoltaikanlage für Ihr Wohnhaus." */
export function describeProject(interest: string, building: string): string | null {
  if (!isInterest(interest)) return null
  const topic = interestPhrase[interest]
  if (isTraining(interest) || !isBuilding(building)) return `${topic}.`
  if (building === 'offen') {
    return interest === 'allgemein'
      ? `${topic}. Thema und Gebäude klären wir gemeinsam.`
      : `${topic}. Um welches Gebäude es geht, klären wir gemeinsam.`
  }
  const place = buildingPhrase[building]
  return interest === 'allgemein' ? `${topic} zu Ihrem ${place}.` : `${topic} für Ihr ${place}.`
}

export interface Draft {
  interest: string
  building: string
  name: string
  email: string
  phone: string
  message: string
}

export const emptyDraft: Draft = { interest: '', building: '', name: '', email: '', phone: '', message: '' }

const storageKey = 'gle.anfrage'
const text = (value: unknown, max: number) => (typeof value === 'string' ? value.slice(0, max) : '')

export function loadDraft(): Draft | null {
  try {
    const raw = window.sessionStorage.getItem(storageKey)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<Draft>
    return {
      interest: isInterest(parsed.interest) ? parsed.interest : '',
      building: isBuilding(parsed.building) ? parsed.building : '',
      name: text(parsed.name, 120),
      email: text(parsed.email, 254),
      phone: text(parsed.phone, 40),
      message: text(parsed.message, 4000),
    }
  } catch {
    // Kein Fenster (Server), privater Modus oder blockierter Speicher: das Formular funktioniert trotzdem.
    return null
  }
}

export function saveDraft(draft: Draft): void {
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(draft))
  } catch {
    // siehe oben
  }
}

export function clearDraft(): void {
  try {
    window.sessionStorage.removeItem(storageKey)
  } catch {
    // siehe oben
  }
}
