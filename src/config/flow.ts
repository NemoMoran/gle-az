/**
 * Inhalte des Schaubilds "So wird aus Sonne Strom." im Bereich Photovoltaik der Leistungsseite.
 * Es ist eine vereinfachte, erklärende Darstellung, keine Anlagenplanung und
 * keine Live-Daten. Speicher und Wallboxen sind bewusst nicht abgebildet.
 */
export type FlowNodeId = 'sonne' | 'module' | 'wechselrichter' | 'gebaeude' | 'netz'
export type FlowSelectableId = Extract<FlowNodeId, 'module' | 'wechselrichter' | 'gebaeude'>

export interface FlowExplanation {
  id: FlowSelectableId
  label: string
  title: string
  text: string
}

export const flowLabels: Record<FlowNodeId, string> = {
  sonne: 'Sonne',
  module: 'Solarmodule',
  wechselrichter: 'Wechselrichter',
  gebaeude: 'Gebäude',
  netz: 'Stromnetz',
}

export const flowExplanations: FlowExplanation[] = [
  {
    id: 'module',
    label: 'Solarmodule',
    title: 'Solarmodule: aus Licht wird Gleichstrom',
    text: 'Die Module auf dem Dach wandeln Sonnenlicht in Gleichstrom um. Wie viel, hängt von Fläche, Ausrichtung, Verschattung und Wetter ab. Genau diese Faktoren betrachten wir bei der Auslegung.',
  },
  {
    id: 'wechselrichter',
    title: 'Wechselrichter: die Schaltstelle der Anlage',
    label: 'Wechselrichter',
    text: 'Der Wechselrichter macht aus dem Gleichstrom der Module den Wechselstrom, den Ihr Gebäude nutzt. Er liefert außerdem die Betriebsdaten, auf die ein Monitoring zurückgreift.',
  },
  {
    id: 'gebaeude',
    label: 'Gebäude',
    title: 'Gebäude: direkt nutzen, Überschuss abgeben',
    text: 'Was gerade verbraucht wird, kommt direkt von der Anlage. Erzeugt sie mehr, fließt der Überschuss ins Stromnetz. Reicht die Erzeugung nicht aus, bezieht das Gebäude Strom wie gewohnt von dort.',
  },
]

export const flowCaption =
  'Vereinfachte Darstellung. Zähler, Leitungen, Schutztechnik und weitere Komponenten sind nicht abgebildet; welche Bestandteile zu Ihrem Gebäude passen, klären wir im Gespräch.'
