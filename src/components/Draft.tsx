/**
 * Zeigt einen bestätigten Wert oder einen sichtbar markierten offenen Punkt.
 * Nur für die Rechtstext-Entwürfe gedacht.
 */
export function Draft({ value, hint }: { value: string | null | undefined; hint: string }) {
  if (value) return <>{value}</>
  return <mark className="todo">[Noch zu ergänzen: {hint}]</mark>
}
