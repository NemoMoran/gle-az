import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, Info, WarningCircle } from '@phosphor-icons/react'
import { buildingOptions, interestOptions, type ContactOption } from '../config/contact'
import { contactAdapter, type ContactRequest, type SubmitResult } from '../lib/contact/adapter'
import {
  PARAM_BUILDING,
  PARAM_INTEREST,
  clearDraft,
  describeProject,
  isBuilding,
  isInterest,
  isTraining,
  loadDraft,
  saveDraft,
} from '../lib/vorhaben'

type FieldName = 'interest' | 'name' | 'email' | 'phone' | 'message'
type TextField = Exclude<FieldName, 'interest'>
type Errors = Partial<Record<FieldName, string>>

const fieldOrder: FieldName[] = ['interest', 'name', 'email', 'phone', 'message']
const textFields: TextField[] = ['name', 'email', 'phone', 'message']
const labels: Record<FieldName, string> = {
  interest: 'Ihr Vorhaben',
  name: 'Name',
  email: 'E-Mail-Adresse',
  phone: 'Telefon',
  message: 'Ihre Nachricht',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const phonePattern = /^\+?[0-9][0-9\s()/.-]{5,}$/

function validate(values: ContactRequest): Errors {
  const errors: Errors = {}
  if (!values.interest) {
    errors.interest = 'Bitte wählen Sie aus, worum es geht.'
  }
  if (values.name.length < 2) {
    errors.name = 'Bitte geben Sie Ihren Namen ein.'
  }
  if (!values.email) {
    errors.email = 'Bitte geben Sie Ihre E-Mail-Adresse ein, damit wir antworten können.'
  } else if (!emailPattern.test(values.email)) {
    errors.email = 'Diese E-Mail-Adresse sieht unvollständig aus. Bitte prüfen Sie Schreibweise und @-Zeichen.'
  }
  if (values.phone && !phonePattern.test(values.phone)) {
    errors.phone = 'Bitte geben Sie eine Telefonnummer mit Ziffern ein oder lassen Sie das Feld leer.'
  }
  if (values.message.trim().length < 10) {
    errors.message = 'Bitte beschreiben Sie Ihr Anliegen in mindestens einem Satz.'
  }
  return errors
}

function ErrorText({ id, children }: { id?: string; children: string }) {
  return (
    <p id={id} className="field__error">
      <WarningCircle size={18} weight="fill" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

interface FieldProps {
  id: string
  label: string
  optional?: boolean
  hint?: string
  error?: string
  children: (props: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: true }) => ReactNode
}

/** Beschriftung, Feld, darunter Hinweis und Fehler. So bleiben die Felder einer Zeile auf gleicher Höhe. */
function Field({ id, label, optional, hint, error, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {optional && <span className="field__optional"> (optional)</span>}
      </label>
      {children({ id, 'aria-describedby': describedBy, ...(error ? { 'aria-invalid': true as const } : {}) })}
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
      {hint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
    </div>
  )
}

interface ChoiceGroupProps {
  id: string
  legend: string
  optional?: boolean
  name: string
  options: ContactOption[]
  value: string
  onChange: (value: string) => void
  error?: string
}

/** Eine Frage mit Auswahl-Chips (Radio-Buttons in Button-Optik). */
function ChoiceGroup({ id, legend, optional, name, options, value, onChange, error }: ChoiceGroupProps) {
  const errorId = error ? `${id}-error` : undefined
  return (
    <fieldset className="choice" aria-describedby={errorId}>
      <legend id={id}>
        {legend}
        {optional && <span className="field__optional"> (optional)</span>}
      </legend>
      <div className="choice__options">
        {options.map((option) => (
          <label key={option.value} className="chip">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              aria-invalid={error ? true : undefined}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </fieldset>
  )
}

/** Ergebnis nach dem Absenden: deutlich abgesetzt und fokussiert, damit es niemand übersieht. */
function ResultNotice({ result }: { result: SubmitResult }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [result])

  if (result.kind === 'sent') {
    return (
      <div ref={ref} tabIndex={-1} className="form__result form__result--sent" role="status">
        <CheckCircle size={24} weight="fill" aria-hidden="true" />
        <p>
          <strong>Vielen Dank, Ihre Anfrage ist eingegangen.</strong> Wir melden uns bei Ihnen.
        </p>
      </div>
    )
  }
  if (result.kind === 'error') {
    return (
      <div ref={ref} tabIndex={-1} className="form__result form__result--error" role="alert">
        <WarningCircle size={24} weight="fill" aria-hidden="true" />
        <p>
          <strong>Senden derzeit nicht möglich.</strong> {result.message} Bitte versuchen Sie es später noch einmal;
          Ihre Eingaben bleiben erhalten.
        </p>
      </div>
    )
  }
  return (
    <div ref={ref} tabIndex={-1} className="form__result" role="status">
      <Info size={24} weight="fill" aria-hidden="true" />
      <p>
        <strong>Demo-Modus, nichts versendet.</strong> Dieses Formular ist noch nicht mit einem Postfach verbunden.
        Ihre Eingaben wurden nicht übertragen und bleiben hier erhalten.
      </p>
    </div>
  )
}

/**
 * Anfrage in drei Schritten: Vorhaben (Auswahl-Chips), Kontaktdaten, Nachricht.
 * Das Interesse kommt per ?interesse=… von Leistungs- und Schulungsseite; eine vom
 * Besucher getroffene Wahl wird nie überschrieben. Der Entwurf wird in der Sitzung
 * gemerkt (siehe vorhaben.ts) und erst nach einem echten Versand gelöscht.
 */
export function ContactForm() {
  const [searchParams] = useSearchParams()
  const urlInterestParam = searchParams.get(PARAM_INTEREST)
  const urlInterest = isInterest(urlInterestParam) ? urlInterestParam : ''
  const urlBuildingParam = searchParams.get(PARAM_BUILDING)
  const urlBuilding = isBuilding(urlBuildingParam) ? urlBuildingParam : ''

  const id = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const stepOneRef = useRef<HTMLLegendElement>(null)
  const [interest, setInterest] = useState('')
  const [building, setBuilding] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')
  const [result, setResult] = useState<SubmitResult | null>(null)

  // Erst nach dem Einhängen: gemerkten Entwurf und URL-Vorauswahl übernehmen. Das erste
  // Rendern bleibt so identisch mit dem vorgerenderten HTML. Ein Link mit ?interesse=…
  // ist ein ausdrücklicher Wunsch und geht dem gemerkten Interesse vor.
  const appliedPreset = useRef('')
  useEffect(() => {
    const saved = loadDraft()
    appliedPreset.current = urlInterest
    setInterest(urlInterest || saved?.interest || '')
    setBuilding(urlBuilding || saved?.building || '')
    const form = formRef.current
    if (!saved || !form) return
    for (const name of textFields) {
      const element = form.elements.namedItem(name)
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        if (!element.value) element.value = saved[name]
      }
    }
    // Einmal beim Einhängen; danach zählt nur, was der Besucher tut.
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Folgt der Besucher auf dieser Seite später einem Link mit ?interesse=…, gilt der.
  useEffect(() => {
    if (!urlInterest || urlInterest === appliedPreset.current) return
    appliedPreset.current = urlInterest
    setInterest(urlInterest)
    if (urlBuilding) setBuilding(urlBuilding)
  }, [urlInterest, urlBuilding])

  const readText = (name: TextField) => {
    const element = formRef.current?.elements.namedItem(name)
    return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement ? element.value : ''
  }

  const persist = (choice: { interest?: string; building?: string } = {}) => {
    saveDraft({
      interest: choice.interest ?? interest,
      building: choice.building ?? building,
      name: readText('name'),
      email: readText('email'),
      phone: readText('phone'),
      message: readText('message'),
    })
  }

  const chooseInterest = (value: string) => {
    setInterest(value)
    persist({ interest: value })
  }

  const chooseBuilding = (value: string) => {
    setBuilding(value)
    persist({ building: value })
  }

  const resetChoice = () => {
    setInterest('')
    setBuilding('')
    persist({ interest: '', building: '' })
    stepOneRef.current?.focus()
  }

  const fieldId = (name: FieldName) => `${id}-${name}`
  const focusField = (name: FieldName) => {
    formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus()
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'submitting') return
    const read = (name: TextField) => readText(name).trim()
    const values: ContactRequest = {
      name: read('name'),
      email: read('email'),
      phone: read('phone'),
      interest,
      message: read('message'),
      ...(building && !isTraining(interest) ? { building } : {}),
    }

    const nextErrors = validate(values)
    // Fehler synchron rendern, damit das fokussierte Feld bereits aria-invalid trägt.
    flushSync(() => {
      setErrors(nextErrors)
      setResult(null)
    })

    const firstInvalid = fieldOrder.find((name) => nextErrors[name])
    if (firstInvalid) {
      focusField(firstInvalid)
      return
    }

    setStatus('submitting')
    let outcome: SubmitResult
    try {
      outcome = await contactAdapter.submit(values)
    } catch {
      outcome = { kind: 'error', message: 'Die Verbindung wurde unterbrochen.' }
    }
    if (outcome.kind === 'sent') clearDraft()
    setResult(outcome)
    setStatus('done')
  }

  const errorEntries = fieldOrder.filter((name) => errors[name])
  const summary = describeProject(interest, building)

  return (
    <form
      ref={formRef}
      className="form form--steps form-card"
      noValidate
      onSubmit={onSubmit}
      onInput={() => persist()}
      aria-describedby={`${id}-demo`}
    >
      <p id={`${id}-demo`} className="form__demo">
        <Info size={20} aria-hidden="true" />
        <span>
          <strong>Vorschau ohne Versand.</strong> Dieses Formular ist noch nicht mit einem Postfach verbunden;
          Eingaben werden nicht übertragen.
        </span>
      </p>

      {errorEntries.length > 0 && (
        <div className="notice notice--error" role="alert">
          <WarningCircle size={22} aria-hidden="true" />
          <div>
            <p>
              <strong>
                Bitte prüfen Sie {errorEntries.length === 1 ? 'eine Angabe' : `${errorEntries.length} Angaben`}:
              </strong>
            </p>
            <ul>
              {errorEntries.map((name) => (
                <li key={name}>
                  <a
                    href={`#${fieldId(name)}`}
                    onClick={(event) => {
                      event.preventDefault()
                      focusField(name)
                    }}
                  >
                    {labels[name]}
                  </a>
                  : {errors[name]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <fieldset className="form__group">
        <legend ref={stepOneRef} tabIndex={-1}>
          Ihr Vorhaben
        </legend>
        <ChoiceGroup
          id={fieldId('interest')}
          legend="Worum geht es?"
          name="interest"
          options={interestOptions}
          value={interest}
          onChange={chooseInterest}
          error={errors.interest}
        />
        {!isTraining(interest) && (
          <ChoiceGroup
            id={`${id}-building`}
            legend="Für welches Gebäude?"
            optional
            name="building"
            options={buildingOptions}
            value={building}
            onChange={chooseBuilding}
          />
        )}
        <div className="form__choice-result">
          <p className="form__summary" aria-live="polite">
            {summary}
          </p>
          {(interest || building) && (
            <button type="button" className="text-button" onClick={resetChoice}>
              Auswahl zurücksetzen
            </button>
          )}
        </div>
      </fieldset>

      <fieldset className="form__group">
        <legend>Ihre Kontaktdaten</legend>
        <div className="form__row">
          <Field id={fieldId('name')} label={labels.name} error={errors.name}>
            {(a11y) => <input {...a11y} name="name" type="text" autoComplete="name" maxLength={120} required />}
          </Field>
          <Field id={fieldId('email')} label={labels.email} error={errors.email}>
            {(a11y) => (
              <input
                {...a11y}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                maxLength={254}
                required
              />
            )}
          </Field>
        </div>
        <div className="form__row">
          <Field
            id={fieldId('phone')}
            label={labels.phone}
            optional
            hint="Falls Sie einen Rückruf bevorzugen."
            error={errors.phone}
          >
            {(a11y) => (
              <input {...a11y} name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={40} />
            )}
          </Field>
        </div>
      </fieldset>

      <fieldset className="form__group">
        <legend>Ihre Nachricht</legend>
        <Field
          id={fieldId('message')}
          label={labels.message}
          hint="Was planen Sie, und was sollten wir vorab wissen?"
          error={errors.message}
        >
          {(a11y) => <textarea {...a11y} name="message" rows={6} maxLength={4000} required />}
        </Field>
      </fieldset>

      <div className="form__footer">
        <button type="submit" className="btn btn--primary">
          {status === 'submitting' ? 'Wird geprüft …' : 'Anfrage senden'}
        </button>
        <p className="form__legal">
          Ihre Angaben verwenden wir ausschließlich zur Bearbeitung Ihrer Anfrage. Mehr dazu in der{' '}
          <Link to="/datenschutz">Datenschutzerklärung</Link>.
        </p>
      </div>

      {result && <ResultNotice result={result} />}
    </form>
  )
}
