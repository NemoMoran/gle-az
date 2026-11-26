/**
 * Inhalte der Seiten „Über uns“ und „Schulungen“, die aus dem vom Betreiber bereitgestellten
 * Portfolio von Altay Rustamov stammen (Zuordnung und offene Punkte: PORTFOLIO-REVIEW.md).
 * Die Formulierungen bleiben bei dem, was das Portfolio belegt; nichts ist ergänzt.
 * Die Anschriften sind Standorte laut Portfolio, nicht der rechtliche Betreiber der Website
 * (der steht, sobald bestätigt, in site.ts).
 */
export const founder = {
  kicker: 'Gründer · Green Life Germany / GLE LLC',
  name: 'Altay Rustamov',
  paragraphs: [
    'Altay Rustamov verbindet mehr als 15 Jahre Berufserfahrung in Europa mit der Planung und Umsetzung erneuerbarer Energiesysteme. Auf seine technische Ausbildung in Aserbaidschan folgten ein Studium in Deutschland und die Arbeit an Photovoltaik, Gebäudetechnik und integrierten Energielösungen.',
    'Sein Portfolio umfasst nach eigenen Angaben mehr als 400 umgesetzte PV- und Wärmepumpensysteme sowie Projekte für kommunale Gebäude und Wohnhäuser. In Deutschland gründete er sein Unternehmen mit dem Schwerpunkt Photovoltaik, Wärmepumpen und kombinierte Energiekonzepte.',
  ],
}

export const crossBorder = {
  title: 'Erfahrung über Grenzen hinweg.',
  paragraphs: [
    '2021 gründete Altay Rustamov GLE LLC in Aserbaidschan, um europäische Praxiserfahrung in die lokale Energiewirtschaft und technische Ausbildung einzubringen. Das Portfolio beschreibt außerdem gemeinsame Projekte mit GREEN LIFE GMBH sp. z o.o. in Polen.',
    'Die Arbeit umfasst private, gewerbliche und industrielle Vorhaben, Beratung, erneuerbare Energieprojekte und Investitionskonzepte. Photovoltaik und Wärmepumpen werden dabei gemeinsam mit dem Energiebedarf des Gebäudes betrachtet.',
    'Für Mobilfunkstandorte ohne Netzanschluss entwickelte GLE LLC Off-Grid-Solarlösungen; dokumentiert sind PV-Planungsarbeiten für vier Dörfer in Karabach.',
  ],
}

export interface PortfolioLocation {
  country: string
  organisation?: string
  lines: string[]
}

export const locations: PortfolioLocation[] = [
  { country: 'Deutschland', lines: ['Neusser Straße 723', '50737 Köln'] },
  { country: 'Aserbaidschan', organisation: 'GLE LLC', lines: ['Ahmed Rajabli 1/25', 'Baku AZ 1142'] },
  { country: 'Polen', organisation: 'GREEN LIFE GMBH sp. z o.o.', lines: ['Bartycka 22B/21A', '00-716 Warszawa'] },
]

export const collaborations = [
  {
    title: 'Photovoltaiklabor für die Lehre',
    text: 'An der Azerbaijan University of Architecture and Construction (AzMIU) stellte GLE LLC dem Fachbereich Heiztechnik ein kleines Photovoltaiklabor zur Verfügung.',
  },
  {
    title: 'Technologietransfer für die Industrie',
    text: 'Über das Technologietransferzentrum entstehen Vorschläge für alternative Energielösungen in der Industrie, darunter für Holcim Azerbaijan OJSC.',
  },
  {
    title: 'Patent für ein energieeffizientes Haus',
    text: 'Das Portfolio nennt Altay Rustamov als Spezialisten am Technologietransferzentrum und Inhaber eines bei der aserbaidschanischen Agentur für geistiges Eigentum registrierten Patents für ein energieeffizientes Haus.',
  },
  {
    title: 'Strom aus Wasserdruck',
    text: 'Die Zusammenarbeit mit İSST richtet sich auf die Nutzung von Wasserdruck in überregionalen Wasserleitungen zur Stromerzeugung mit Turbinen.',
  },
  {
    title: 'Weiterbildung zu Wärmepumpen',
    text: 'Mit Azeristiliktəchizat OJSC verbindet GLE die technische Weiterbildung zu Wärmepumpen.',
  },
  {
    title: 'Schulungsinitiative für Schaltanlagen',
    text: 'Eine gemeinsame Schulungsinitiative mit Azerishiq und der Sumgait State University zum Betrieb von Schaltanlagen befindet sich laut Portfolio in Entwicklung.',
  },
]

export const exchange = {
  title: 'Im fachlichen Austausch.',
  text: 'Fachmessen in Europa und Aserbaidschan sind Teil des Austauschs mit der Branche – als Besucher und mit eigenen Ausstellungsständen.',
  /** Seite des Portfolios mit den Messefotos. */
  page: 36,
}

export interface TrainingActivity {
  /** Seite des Portfolios mit den zugehörigen Fotos. */
  page: number
  title: string
  kind: 'Kurs' | 'Weiterbildung'
  text: string
}

export const trainingActivities: TrainingActivity[] = [
  {
    page: 32,
    kind: 'Kurs',
    title: 'Photovoltaik planen und installieren',
    text: 'Einmonatiger Fachkurs von GLE LLC in Zusammenarbeit mit der staatlichen Arbeitsagentur in Aserbaidschan. Die Schulungsunterlagen wurden vom Team auf Basis deutscher Praxiserfahrung entwickelt.',
  },
  {
    page: 33,
    kind: 'Kurs',
    title: 'Windenergie verstehen',
    text: 'Kurs von GLE LLC mit der staatlichen Arbeitsagentur: Grundlagen der Windenergie, elektrische und mechanische Komponenten, Anlagenkonzepte sowie Planung, Betrieb und Service von Windparks.',
  },
  {
    page: 34,
    kind: 'Kurs',
    title: 'Wärmepumpen im Betrieb',
    text: 'Im Rahmen eines Memorandums mit Azeristiliktəchizat OJSC organisiert GLE Schulungen für Mitarbeitende zur Installation, zum Betrieb und zur Wartung von Wärmepumpensystemen.',
  },
  {
    page: 29,
    kind: 'Weiterbildung',
    title: 'Herstellerseminar bei WOLF',
    text: 'Auch die eigene Weiterbildung gehört zur Praxis: Das Portfolio dokumentiert die Teilnahme an einer technischen Wärmepumpenschulung bei WOLF.',
  },
  {
    page: 30,
    kind: 'Weiterbildung',
    title: 'Herstellerseminar bei Clivet',
    text: 'Dokumentierte Weiterbildung zu den Wärmepumpensystemen SPHERA und EDGE EVO 2.0 „HOME“ von Clivet.',
  },
]

export const portfolioCredit = 'Unternehmensgeschichte und Referenzen nach dem Portfolio von Altay Rustamov.'
