import { useEffect, useId, useRef, useState } from 'react'
import { HouseLine, Lightning, SolarPanel, Sun, WaveSine, type Icon } from '@phosphor-icons/react'
import { flowCaption, flowExplanations, flowLabels, type FlowNodeId, type FlowSelectableId } from '../config/flow'
import { useMediaQuery } from '../lib/useMediaQuery'

interface Box {
  x: number
  y: number
  w: number
  h: number
}

interface Edge {
  from: FlowNodeId
  to: FlowNodeId
  d: string
  label: string
  lx: number
  ly: number
  anchor: 'start' | 'middle' | 'end'
  bidirectional?: boolean
}

interface FlowLayout {
  width: number
  height: number
  /** Symbol über dem Text (breite Knoten) oder links daneben (schmale Darstellung). */
  stacked: boolean
  sunRadius: number
  nodes: Record<FlowNodeId, Box>
  edges: Edge[]
}

const icons: Record<FlowNodeId, Icon> = {
  sonne: Sun,
  module: SolarPanel,
  wechselrichter: WaveSine,
  gebaeude: HouseLine,
  netz: Lightning,
}

const selectable: FlowSelectableId[] = ['module', 'wechselrichter', 'gebaeude']

/** Breite Darstellung ab 700 px: eine Zeile von links nach rechts, Netz unter dem Gebäude. */
const wide: FlowLayout = {
  width: 800,
  height: 296,
  stacked: true,
  sunRadius: 34,
  nodes: {
    sonne: { x: 16, y: 40, w: 68, h: 68 },
    module: { x: 170, y: 28, w: 140, h: 92 },
    wechselrichter: { x: 400, y: 28, w: 140, h: 92 },
    gebaeude: { x: 630, y: 28, w: 140, h: 92 },
    netz: { x: 625, y: 200, w: 150, h: 72 },
  },
  edges: [
    { from: 'sonne', to: 'module', d: 'M84 74 H170', label: 'Sonnenlicht', lx: 127, ly: 62, anchor: 'middle' },
    { from: 'module', to: 'wechselrichter', d: 'M310 74 H400', label: 'Gleichstrom', lx: 355, ly: 62, anchor: 'middle' },
    { from: 'wechselrichter', to: 'gebaeude', d: 'M540 74 H630', label: 'Wechselstrom', lx: 585, ly: 62, anchor: 'middle' },
    { from: 'gebaeude', to: 'netz', d: 'M700 120 V200', label: 'Einspeisung und Bezug', lx: 686, ly: 165, anchor: 'end', bidirectional: true },
  ],
}

/** Schmale Darstellung: eine Spalte von oben nach unten. */
const narrow: FlowLayout = {
  width: 360,
  height: 612,
  stacked: false,
  sunRadius: 32,
  nodes: {
    sonne: { x: 148, y: 12, w: 64, h: 64 },
    module: { x: 80, y: 118, w: 200, h: 84 },
    wechselrichter: { x: 80, y: 250, w: 200, h: 84 },
    gebaeude: { x: 80, y: 382, w: 200, h: 84 },
    netz: { x: 80, y: 530, w: 200, h: 68 },
  },
  edges: [
    { from: 'sonne', to: 'module', d: 'M180 76 V118', label: 'Sonnenlicht', lx: 192, ly: 101, anchor: 'start' },
    { from: 'module', to: 'wechselrichter', d: 'M180 202 V250', label: 'Gleichstrom', lx: 192, ly: 230, anchor: 'start' },
    { from: 'wechselrichter', to: 'gebaeude', d: 'M180 334 V382', label: 'Wechselstrom', lx: 192, ly: 362, anchor: 'start' },
    { from: 'gebaeude', to: 'netz', d: 'M180 466 V530', label: 'Einspeisung und Bezug', lx: 192, ly: 502, anchor: 'start', bidirectional: true },
  ],
}

const pct = (value: number, total: number) => `${(value / total) * 100}%`

function FlowNode({
  id,
  layout,
  selected,
  hovered,
}: {
  id: FlowNodeId
  layout: FlowLayout
  selected: boolean
  hovered: boolean
}) {
  const box = layout.nodes[id]
  const NodeIcon = icons[id]
  const isSelectable = (selectable as FlowNodeId[]).includes(id)
  const className = [
    'flow__node',
    isSelectable ? 'flow__node--select' : 'flow__node--context',
    selected && 'is-selected',
    hovered && 'is-hover',
  ]
    .filter(Boolean)
    .join(' ')
  const cx = box.x + box.w / 2
  const cy = box.y + box.h / 2

  if (id === 'sonne') {
    return (
      <g className={className}>
        <circle cx={cx} cy={cy} r={layout.sunRadius} />
        <NodeIcon x={cx - 15} y={cy - 15} size={30} />
        <text
          x={layout.stacked ? cx : box.x + box.w + 10}
          y={layout.stacked ? box.y + box.h + 24 : cy + 5}
          textAnchor={layout.stacked ? 'middle' : 'start'}
          className="flow__node-label"
        >
          {flowLabels[id]}
        </text>
      </g>
    )
  }

  // Niedrige Knoten (Stromnetz) zeigen Symbol und Text nebeneinander, auch in der breiten Darstellung.
  const stacked = layout.stacked && box.h >= 90
  return (
    <g className={className}>
      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={12} />
      <NodeIcon x={stacked ? cx - 14 : box.x + 18} y={stacked ? box.y + 16 : cy - 14} size={28} />
      <text
        x={stacked ? cx : box.x + 60}
        y={stacked ? box.y + 74 : cy + 5}
        textAnchor={stacked ? 'middle' : 'start'}
        className="flow__node-label"
      >
        {flowLabels[id]}
      </text>
    </g>
  )
}

/**
 * Schaubild "So wird aus Sonne Strom.": SVG-Zeichnung mit überlagerten HTML-Buttons
 * für Solarmodule, Wechselrichter und Gebäude. Der Fluss animiert einmal beim
 * Sichtbarwerden und beim Wechsel der Auswahl; bei reduzierter Bewegung bleibt er statisch.
 * `embedded` rendert es als Unterabschnitt (h3) innerhalb einer Seite, z. B. im
 * Bereich Photovoltaik der Leistungsseite, statt als eigenständigen Abschnitt.
 */
export function EnergyFlow({ embedded = false }: { embedded?: boolean }) {
  const isWide = useMediaQuery('(min-width: 700px)')
  const layout = isWide ? wide : narrow
  const [selected, setSelected] = useState<FlowSelectableId>('module')
  const [hovered, setHovered] = useState<FlowSelectableId | null>(null)
  const [run, setRun] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const markerId = `${uid}-arrow`

  useEffect(() => {
    const element = sectionRef.current
    if (!element || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let observer: IntersectionObserver
    try {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setRun((value) => value + 1)
            observer.disconnect()
          }
        },
        { threshold: 0.3 },
      )
      observer.observe(element)
    } catch {
      return
    }
    return () => observer.disconnect()
  }, [])

  const select = (id: FlowSelectableId) => {
    if (id === selected) return
    setSelected(id)
    setRun((value) => value + 1)
  }

  const info = flowExplanations.find((entry) => entry.id === selected) ?? flowExplanations[0]
  const nodeIds = Object.keys(layout.nodes) as FlowNodeId[]
  const Heading = embedded ? 'h3' : 'h2'

  return (
    <section
      ref={sectionRef}
      className={embedded ? 'flow-section flow-embed' : 'section section--mist flow-section'}
      aria-labelledby="flow-title"
    >
      <div className={embedded ? undefined : 'container'}>
        <div className="section-head" data-reveal>
          <Heading id="flow-title">So wird aus Sonne Strom.</Heading>
          <p className="lead">
            Vier Stationen, ein Prinzip. Wählen Sie Solarmodule, Wechselrichter oder Gebäude, um mehr zu erfahren.
          </p>
        </div>

        <div className="flow__grid" data-reveal>
          <div className={run > 0 ? 'flow is-live' : 'flow'}>
            <div className="flow__sheet">
              <div className="flow__canvas">
                <svg viewBox={`0 0 ${layout.width} ${layout.height}`} className="flow__svg" aria-hidden="true" focusable="false">
                  <defs>
                    <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M0 0 L10 5 L0 10 z" className="flow__arrow" />
                    </marker>
                  </defs>
                  {layout.edges.map((edge, index) => (
                    <g key={`${edge.from}-${edge.to}`}>
                      <path
                        d={edge.d}
                        className="flow__edge"
                        markerEnd={`url(#${markerId})`}
                        markerStart={edge.bidirectional ? `url(#${markerId})` : undefined}
                      />
                      <path key={run} d={edge.d} className="flow__pulse" style={{ animationDelay: `${index * 160}ms` }} />
                      <text x={edge.lx} y={edge.ly} textAnchor={edge.anchor} className="flow__edge-label">
                        {edge.label}
                      </text>
                    </g>
                  ))}
                  {nodeIds.map((id) => (
                    <FlowNode key={id} id={id} layout={layout} selected={selected === id} hovered={hovered === id} />
                  ))}
                </svg>
                <div className="flow__hits" role="group" aria-label="Bestandteile der Anlage">
                  {selectable.map((id) => {
                    const box = layout.nodes[id]
                    return (
                      <button
                        key={id}
                        type="button"
                        className="flow__hit"
                        style={{
                          left: pct(box.x, layout.width),
                          top: pct(box.y, layout.height),
                          width: pct(box.w, layout.width),
                          height: pct(box.h, layout.height),
                        }}
                        aria-pressed={selected === id}
                        onClick={() => select(id)}
                        onPointerEnter={() => setHovered(id)}
                        onPointerLeave={() => setHovered(null)}
                        onFocus={() => setHovered(id)}
                        onBlur={() => setHovered(null)}
                      >
                        <span className="visually-hidden">{flowLabels[id]}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            <p className="flow__caption">{flowCaption}</p>
          </div>

          <div className="flow__info" aria-live="polite">
            <div className="flow__info-inner" key={info.id}>
              <h3>{info.title}</h3>
              <p>{info.text}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
