/**
 * Auswahl im ersten Schritt des Kontaktformulars ("Ihr Vorhaben").
 * Die Werte bleiben stabil: Links von Leistungs- und Schulungsseite setzen
 * sie per ?interesse=…, und der Versandadapter erhält sie unverändert.
 */
export interface ContactOption {
  value: string
  label: string
}

/** "Worum geht es?", Pflichtangabe. */
export const interestOptions: ContactOption[] = [
  { value: 'photovoltaik', label: 'Neue Photovoltaikanlage' },
  { value: 'betrieb-und-pflege', label: 'Bestehende Anlage betreuen' },
  { value: 'gebaeudetechnik', label: 'Gebäudetechnik' },
  { value: 'schulung-photovoltaik', label: 'Schulung Photovoltaik' },
  { value: 'schulung-windenergie', label: 'Schulung Windenergie' },
  { value: 'allgemein', label: 'Noch unsicher' },
]

/** "Für welches Gebäude?", optional; bei Schulungen ausgeblendet. */
export const buildingOptions: ContactOption[] = [
  { value: 'wohnhaus', label: 'Wohnhaus' },
  { value: 'gewerbe', label: 'Gewerbe' },
  { value: 'offen', label: 'Noch offen' },
]
