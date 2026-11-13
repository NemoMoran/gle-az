/**
 * Versandadapter für das Kontaktformular.
 *
 * Der lokale Prototyp verwendet den Demo-Adapter: Er überträgt nichts und
 * meldet das ehrlich zurück. Für den Live-Betrieb wird hier ein echter Adapter
 * eingesetzt, z. B. ein POST an einen eigenen Endpunkt oder einen
 * Formular-Dienst. Die Formularkomponente muss dafür nicht geändert werden.
 * Siehe README.md, Abschnitt "Kontaktformular anbinden".
 */
export interface ContactRequest {
  name: string
  email: string
  phone: string
  interest: string
  message: string
  /** Gebäudetyp aus der Projektauswahl der Startseite (wohnhaus, gewerbe, offen), falls vorhanden. */
  building?: string
}

export type SubmitResult =
  | { kind: 'demo' }
  | { kind: 'sent' }
  | { kind: 'error'; message: string }

export interface ContactAdapter {
  submit(request: ContactRequest): Promise<SubmitResult>
}

export const demoAdapter: ContactAdapter = {
  async submit() {
    // Bewusst keine Übertragung und kein Logging personenbezogener Daten.
    await new Promise((resolve) => setTimeout(resolve, 350))
    return { kind: 'demo' }
  },
}

/*
 * Beispiel für einen echten Adapter (nicht aktiv):
 *
 * export const httpAdapter: ContactAdapter = {
 *   async submit(request) {
 *     const response = await fetch('/api/kontakt', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify(request),
 *     })
 *     if (!response.ok) return { kind: 'error', message: 'Der Server hat die Anfrage nicht angenommen.' }
 *     return { kind: 'sent' }
 *   },
 * }
 */

export const contactAdapter: ContactAdapter = demoAdapter
