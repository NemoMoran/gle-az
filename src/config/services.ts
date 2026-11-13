/**
 * Leistungsgruppen. Die drei Bereiche sind aus dem Referenzangebot abgeleitet;
 * ob und in welchem Umfang sie für das deutsche Unternehmen gelten, ist noch
 * nicht bestätigt. Texte, Reihenfolge und Umfang bitte hier zentral anpassen.
 *
 * Bewusst nicht als bestätigte Leistungen aufgenommen: Wallboxen, Speicherverkauf,
 * Wärmepumpen-Installation, Windkraft im Großmaßstab.
 */
import type { ImageName } from '../lib/images'

export interface ServiceGroup {
  /** URL-Anker auf der Leistungsseite und Wert im Feld "Ihr Interesse", z. B. /leistungen#photovoltaik */
  id: string
  title: string
  /** Ein Satz für die Bildkarte der Startseite. */
  short: string
  /** Foto der Bildkarte und des Abschnitts auf der Leistungsseite (Schlüssel aus src/config/images.json). */
  image: ImageName
  /** Breites Foto (5:2) über dem Abschnitt auf der Leistungsseite. */
  band: ImageName
  /** Absätze für die Leistungsseite. */
  description: string[]
  /** Liste "Was dazugehört" auf der Leistungsseite. */
  includes: string[]
  /** Optionaler Hinweis am Ende des Abschnitts. */
  note?: string
}

export const serviceGroups: ServiceGroup[] = [
  {
    id: 'photovoltaik',
    title: 'Photovoltaik',
    short: 'Planung und Installation für Wohnhaus und Gewerbe.',
    image: 'pv',
    band: 'leistungen',
    description: [
      'Eine Photovoltaikanlage ist dann gut, wenn sie zum Gebäude passt. Deshalb beginnen wir mit Dachfläche, Ausrichtung, Verschattung und Ihrem Stromverbrauch, nicht mit einem Produkt.',
      'Daraus entsteht eine Auslegung, die wir Ihnen Schritt für Schritt erklären. Erst wenn Sie den Vorschlag nachvollziehen können, stimmen wir Installation und Inbetriebnahme ab.',
    ],
    includes: [
      'Bestandsaufnahme vor Ort oder anhand Ihrer Unterlagen',
      'Analyse von Verbrauch und Bedarf',
      'Auslegung von Modulen, Wechselrichter und Montagesystem',
      'Planung für Wohnhäuser und Gewerbegebäude',
      'Abstimmung von Installation und Inbetriebnahme',
      'Verständliche Dokumentation der Anlage',
    ],
  },
  {
    id: 'betrieb-und-pflege',
    title: 'Betrieb & Pflege',
    short: 'Monitoring, Wartung und Reinigung bestehender Anlagen.',
    image: 'pflege',
    band: 'pflege-breit',
    description: [
      'Nach der Inbetriebnahme beginnt der eigentliche Alltag Ihrer Anlage. Monitoring zeigt, ob die Erträge den Erwartungen entsprechen, und macht Auffälligkeiten früh sichtbar.',
      'Regelmäßige Wartung und eine fachgerechte Reinigung halten die Anlage in dem Zustand, für den sie geplant wurde. Beides stimmen wir auf Standort, Verschmutzung und Anlagengröße ab.',
    ],
    includes: [
      'Monitoring und Auswertung der Erträge',
      'Wartung und Sichtprüfung der Komponenten',
      'Professionelle Reinigung der Module',
      'Unterstützung bei Auffälligkeiten im Betrieb',
    ],
  },
  {
    id: 'gebaeudetechnik',
    title: 'Gebäudetechnik',
    short: 'Heizen, Kühlen und Lüften, abgestimmt auf Gebäude und Nutzung.',
    image: 'technik',
    band: 'technik-breit',
    description: [
      'Heizen, Kühlen und Lüften bestimmen einen großen Teil des Energiebedarfs eines Gebäudes. Wir betrachten diese Systeme im Zusammenhang mit Ihrer Stromerzeugung und mit der tatsächlichen Nutzung der Räume.',
      'Das Ergebnis sind Lösungen, die einfach zu betreiben sind und sich sinnvoll mit einer Photovoltaikanlage verbinden lassen.',
    ],
    includes: ['Heizung', 'Kühlung', 'Lüftung', 'Abstimmung mit der Photovoltaikanlage'],
    note: 'Welche Systeme und Komponenten für Ihr Gebäude infrage kommen, klären wir im Gespräch. Wir legen uns vorab nicht auf bestimmte Produkte fest.',
  },
]
