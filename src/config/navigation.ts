export interface NavItem {
  to: string
  label: string
}

/** Hauptnavigation im Header, Footer und mobilen Menü. */
export const navigation: NavItem[] = [
  { to: '/leistungen', label: 'Leistungen' },
  { to: '/ueber-uns', label: 'Über uns' },
  { to: '/schulungen', label: 'Schulungen' },
  { to: '/kontakt', label: 'Kontakt' },
]

export const legalNavigation: NavItem[] = [
  { to: '/impressum', label: 'Impressum' },
  { to: '/datenschutz', label: 'Datenschutz' },
]
