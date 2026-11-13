import { useEffect, useLayoutEffect, useRef, type PointerEvent } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { navigation } from '../config/navigation'

/** Schneidet eine Fläche auf einen Link zu. Ohne `animate` sitzt sie sofort an der neuen Stelle. */
function clipTo(layer: HTMLElement, link: HTMLElement, animate: boolean) {
  const top = link.offsetTop
  const left = link.offsetLeft
  const right = layer.offsetWidth - left - link.offsetWidth
  const bottom = layer.offsetHeight - top - link.offsetHeight
  if (!animate) layer.style.transition = 'none'
  layer.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round var(--radius-s))`
  if (!animate) {
    layer.getBoundingClientRect()
    layer.style.transition = ''
  }
}

/** Gleitet nur, wenn die Fläche schon sichtbar ist; sonst blendet sie am Ziel ein. */
function showOn(layer: HTMLElement, link: HTMLElement, animate = true) {
  clipTo(layer, link, animate && layer.style.opacity === '1')
  layer.style.opacity = '1'
}

function placeActive(list: HTMLElement, layer: HTMLElement, animate = true) {
  const link = list.querySelector<HTMLElement>('a[aria-current="page"]')
  if (link) showOn(layer, link, animate)
  else layer.style.opacity = '0'
}

export function SiteNav() {
  const listRef = useRef<HTMLUListElement>(null)
  const hoverRef = useRef<HTMLSpanElement>(null)
  const activeRef = useRef<HTMLUListElement>(null)
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    if (listRef.current && activeRef.current) placeActive(listRef.current, activeRef.current)
  }, [pathname])

  // Schriftwechsel und Fensterbreite ändern die Maße der Links.
  useEffect(() => {
    const list = listRef.current
    const active = activeRef.current
    if (!list || !active) return
    const observer = new ResizeObserver(() => placeActive(list, active, false))
    observer.observe(list)
    return () => observer.disconnect()
  }, [])

  const onPointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    if (hoverRef.current && event.pointerType !== 'touch') showOn(hoverRef.current, event.currentTarget)
  }

  const onPointerLeave = () => {
    if (hoverRef.current) hoverRef.current.style.opacity = '0'
  }

  return (
    <nav className="site-nav" aria-label="Hauptnavigation">
      <div className="site-nav__rail" onPointerLeave={onPointerLeave}>
        <span ref={hoverRef} className="site-nav__hover" aria-hidden="true" />
        <ul ref={listRef}>
          {navigation.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} onPointerEnter={onPointerEnter}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <ul ref={activeRef} className="site-nav__active" aria-hidden="true">
          {navigation.map((item) => (
            <li key={item.to}>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
