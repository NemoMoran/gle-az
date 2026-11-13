import { useState, type ReactNode } from 'react'
import { CaretDown } from '@phosphor-icons/react'

interface DisclosureProps {
  /** Basis für die Element-IDs (Button und Panel). */
  id: string
  summary: ReactNode
  children: ReactNode
  headingLevel?: 2 | 3 | 4
  defaultOpen?: boolean
  className?: string
}

/**
 * Aufklappbarer Abschnitt: Überschrift mit Button (aria-expanded) und Panel.
 * Die Höhe animiert über grid-template-rows; bei reduzierter Bewegung springt sie.
 */
export function Disclosure({ id, summary, children, headingLevel = 3, defaultOpen = false, className }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen)
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4'
  const buttonId = `${id}-button`
  const panelId = `${id}-panel`

  return (
    <div className={['disclosure', className].filter(Boolean).join(' ')} data-open={open}>
      <Heading className="disclosure__heading">
        <button
          type="button"
          id={buttonId}
          className="disclosure__button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="disclosure__summary">{summary}</span>
          <span className="disclosure__icon" aria-hidden="true">
            <CaretDown size={16} weight="bold" />
          </span>
        </button>
      </Heading>
      <div id={panelId} className="disclosure__panel">
        <div className="disclosure__content">
          <div className="disclosure__body">{children}</div>
        </div>
      </div>
    </div>
  )
}
