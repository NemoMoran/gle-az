/** Die drei Schritte auf der Seite „Über uns“. Keine Fristen, keine Garantien. */
export interface ProcessStep {
  title: string
  text: string
}

export const processSteps: ProcessStep[] = [
  {
    title: 'Bedarf klären',
    text: 'Wir sprechen über Ihr Gebäude, Ihren Verbrauch und Ihre Ziele. Daraus ergibt sich, welche Lösung überhaupt sinnvoll ist.',
  },
  {
    title: 'Lösung planen',
    text: 'Auf dieser Grundlage erarbeiten wir einen Vorschlag mit nachvollziehbarer Auslegung, passenden Komponenten und klarem Ablauf.',
  },
  {
    title: 'Umsetzung abstimmen',
    text: 'Zeitplan, beteiligte Gewerke und offene Fragen stimmen wir mit Ihnen ab, bevor es losgeht. Sie wissen jederzeit, was als Nächstes passiert.',
  },
]
