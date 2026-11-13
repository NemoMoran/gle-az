/**
 * Häufige Fragen auf der Kontaktseite. Die Antworten bleiben bewusst im Rahmen
 * des beschriebenen Leistungsumfangs und Ablaufs; keine Fristen, Preise oder Garantien.
 */
export interface FaqItem {
  question: string
  answer: string[]
  link?: { to: string; label: string }
}

export const faqItems: FaqItem[] = [
  {
    question: 'Welche Angaben helfen beim ersten Gespräch?',
    answer: [
      'Hilfreich sind Art und Lage des Gebäudes, die ungefähre Dachfläche und Ausrichtung, Ihr jährlicher Stromverbrauch und das, was Sie erreichen möchten. Fotos vom Dach oder vorhandene Unterlagen sind willkommen, aber keine Voraussetzung.',
      'Es muss nichts vollständig sein. Offene Punkte klären wir in der Bestandsaufnahme gemeinsam.',
    ],
  },
  {
    question: 'Kann ich eine bestehende Anlage betreuen lassen?',
    answer: [
      'Ja. Der Bereich Betrieb & Pflege umfasst das Monitoring der Erträge, Wartung und Sichtprüfung sowie die professionelle Reinigung der Module. Umfang und Rhythmus stimmen wir auf Standort, Verschmutzung und Anlagengröße ab.',
    ],
    link: { to: '/leistungen#betrieb-und-pflege', label: 'Mehr zu Betrieb & Pflege' },
  },
  {
    question: 'Ist eine Anfrage auch ohne konkrete Planung möglich?',
    answer: [
      'Ja. Viele Gespräche beginnen mit einer offenen Frage. Im ersten Schritt klären wir Ihren Bedarf, erst danach entsteht ein Vorschlag. Wählen Sie im Formular einfach „Noch unsicher“.',
    ],
  },
  {
    question: 'Bieten Sie auch Schulungen an?',
    answer: [
      'Ja, zu Photovoltaik und Windenergie: verständlich, praxisnah und auf Ihre Fragen zugeschnitten. Format, Umfang und Termine stimmen wir individuell mit Ihnen ab.',
    ],
    link: { to: '/schulungen', label: 'Zu den Schulungen' },
  },
]
