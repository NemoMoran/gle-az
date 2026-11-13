/**
 * Schulungsthemen. Bewusst ohne Termine, Preise, Zertifikate oder Partner.
 * `interestValue` muss zu einer Option in src/config/contact.ts passen.
 */
export interface TrainingTopic {
  id: string
  title: string
  /** Kurzform, z. B. für Teaser. */
  teaser: string
  description: string[]
  audience: string
  contents: string[]
  interestValue: string
}

export const trainingTopics: TrainingTopic[] = [
  {
    id: 'photovoltaik',
    title: 'Photovoltaik verstehen',
    teaser:
      'Wie eine Anlage aufgebaut ist, was die Erträge beeinflusst und worauf es bei Planung und Betrieb ankommt.',
    description: [
      'Diese Schulung erklärt Photovoltaik von Grund auf: vom Modul bis zum Zählerschrank, vom ersten Entwurf bis zum laufenden Betrieb. Fachbegriffe werden eingeordnet, nicht vorausgesetzt.',
      'Wir arbeiten mit Beispielen aus der Praxis und nehmen uns Zeit für die Fragen der Teilnehmenden.',
    ],
    audience:
      'Eigentümerinnen und Eigentümer, Unternehmen, Hausverwaltungen und alle, die eine Anlage planen, betreiben oder beurteilen möchten.',
    contents: [
      'Aufbau und Komponenten einer Photovoltaikanlage',
      'Was Erträge beeinflusst: Ausrichtung, Verschattung, Temperatur',
      'Planung, Betrieb und Pflege im Überblick',
      'Lesen und Einordnen von Monitoring-Daten',
      'Fragen und Beispiele der Teilnehmenden',
    ],
    interestValue: 'schulung-photovoltaik',
  },
  {
    id: 'windenergie',
    title: 'Windenergie verstehen',
    teaser: 'Grundlagen der Windkraft: Technik, Standortfaktoren und ihre Rolle im Energiesystem.',
    description: [
      'Windenergie ist neben der Photovoltaik die zweite tragende Säule der Energiewende. Diese Schulung vermittelt, wie Windenergieanlagen funktionieren, wovon ihr Ertrag abhängt und wie sie mit anderen Erzeugern zusammenspielen.',
      'Der Schwerpunkt liegt auf Verständnis und Einordnung, nicht auf Planung oder Bau von Anlagen.',
    ],
    audience:
      'Interessierte aus Kommunen, Unternehmen, Bildung und Verwaltung, die Windenergie fundiert einordnen möchten.',
    contents: [
      'Wie eine Windenergieanlage funktioniert',
      'Standortfaktoren und Ertrag',
      'Die Rolle der Windenergie im Energiesystem',
      'Zusammenspiel mit Photovoltaik und Speichern',
      'Fragen und Diskussion',
    ],
    interestValue: 'schulung-windenergie',
  },
]
