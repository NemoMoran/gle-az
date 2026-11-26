import { referenceProjects } from './references'

/** A short, varied selection. The complete source remains in the downloadable portfolio. */
const selection = [
  {
    id: 4,
    title: 'Sonnenstrom fürs eigene Zuhause.',
    type: 'Einfamilienhaus',
    description: 'Eine Dachanlage mit GoodWe-Technik und Batteriespeicher – umgesetzt am Finkenweg in Wesseling.',
    short: 'Photovoltaik mit Batteriespeicher',
    imageIndex: 0,
    photoAlts: ['Solarmodule auf dem Hausdach am Finkenweg in Wesseling', 'GoodWe-Wechselrichter und Batteriespeicher im Technikraum'],
    facts: [{ label: 'PV · laut Portfolio', value: '15 kWp' }, { label: 'Batteriespeicher', value: '10 kWh' }],
  },
  {
    id: 6,
    title: 'Strom und Wärme zusammen.',
    type: 'Mehrfamilienhaus',
    description: 'Sungrow-Photovoltaik mit Speicher und Stiebel-Eltron-Wärmepumpen in Kaskade für ein Haus mit zehn Wohnungen.',
    short: 'Photovoltaik und Wärmepumpen für zehn Wohnungen.',
    imageIndex: 1,
    photoAlts: ['Photovoltaikmodule auf dem Flachdach am Engelshof in Köln', 'Zwei Stiebel-Eltron-Wärmepumpen am Engelshof in Köln'],
    facts: [{ label: 'Gebäude', value: '10 Wohnungen' }, { label: 'Batteriespeicher', value: '10 kWh' }],
  },
  {
    id: 18,
    title: 'Ein Parkplatz wird zur Energiefläche.',
    type: 'Photovoltaik-Überdachung',
    description: 'Eine mit Photovoltaik belegte Parkplatzüberdachung an der Germaniastraße in Köln, mit GoodWe-Technik und Batteriespeicher.',
    short: 'Photovoltaik mit Speicher auf einer Parkplatzüberdachung.',
    imageIndex: 0,
    photoAlts: ['Solare Parkplatzüberdachung an der Germaniastraße in Köln', 'Unterseite der Photovoltaikmodule auf der Parkplatzüberdachung'],
    facts: [{ label: 'PV · laut Portfolio', value: '30 kWp' }, { label: 'Batteriespeicher', value: '10 kWh' }],
  },
  {
    id: 1,
    title: 'Wärme und Kälte fürs Hotel.',
    type: 'Golden Tulip Parkhotel',
    description: 'Daikin-Systemtechnik für die Heizungs- und Kühlversorgung des Golden Tulip Parkhotels an der Silcherstraße in Neu-Ulm.',
    short: 'Daikin-Systemtechnik für Heizung und Kühlung.',
    imageIndex: 1,
    photoAlts: ['Daikin-Systemkomponenten am Golden Tulip Parkhotel', 'Wärmepumpentechnik vor dem Golden Tulip Parkhotel in Neu-Ulm', 'Rohrleitungen der Daikin-Anlage am Parkhotel'],
    facts: [{ label: 'Nutzung', value: 'Hotel' }, { label: 'Systemtechnik', value: 'Daikin' }],
  },
]

export const selectedReferences = selection.map(item => ({
  ...item,
  project: referenceProjects.find(project => project.id === item.id)!,
}))

export type SelectedReference = typeof selectedReferences[number]
