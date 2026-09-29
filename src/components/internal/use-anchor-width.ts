import { type RefObject, useLayoutEffect, useState } from 'react'
import { trackVisualAnchor } from './visual-anchor-tracker'

export function useAnchorWidth(anchorRef: RefObject<HTMLElement | null>, active: boolean): number {
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    if (!active) return

    const anchor = anchorRef.current

    if (anchor === null) {
      return
    }

    const update = () => {
      const next = anchor.getBoundingClientRect().width

      setWidth((current) => (Math.abs(current - next) < 0.25 ? current : next))
    }

    return trackVisualAnchor(anchor, update, {
      trackScroll: true,
      trackMutations: true,
      interactionEvents: ['focusin', 'focusout', 'pointerdown', 'pointerup'],
      continuousAnimations: true,
    })
  }, [active, anchorRef])

  return width
}
