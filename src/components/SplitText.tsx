import { Fragment, type CSSProperties } from 'react'

interface SplitTextProps {
  /** Der Text; `\n` erzwingt einen Zeilenumbruch. */
  children: string
  /** Beim Sichtbarwerden Wort für Wort einblenden (Standard). `false`, wenn die Seite die Bewegung selbst steuert, z. B. im Hero. */
  reveal?: boolean
  /** Verzögerung in Schritten von 90 ms. */
  delay?: number
}

/**
 * Zerlegt eine Überschrift in Wörter, die einzeln hinter einer Maske aufsteigen.
 * Für Screenreader bleibt es fortlaufender Text; ohne Animation ändert sich nichts am Satzbild.
 */
export function SplitText({ children, reveal = true, delay }: SplitTextProps) {
  let index = 0
  return (
    <span
      className="split"
      data-reveal={reveal ? 'words' : undefined}
      style={delay ? ({ '--d': delay } as CSSProperties) : undefined}
    >
      {children.split('\n').map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 && <br />}
          {line.split(' ').map((word, wordIndex, words) => {
            const i = index++
            return (
              <Fragment key={i}>
                <span className="split__w" style={{ '--i': i } as CSSProperties}>
                  <span>{word}</span>
                </span>
                {wordIndex < words.length - 1 ? ' ' : null}
              </Fragment>
            )
          })}
        </Fragment>
      ))}
    </span>
  )
}
