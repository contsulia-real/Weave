import { type CSSProperties, type RefObject, useLayoutEffect, useState } from 'react'
import type { ToolTipPlacement } from '../../core/tooltip-types'
import { trackVisualAnchor } from './visual-anchor-tracker'

interface AnchorPosition {
  left: number
  top: number
}

function anchorPosition(target: HTMLElement, placement: ToolTipPlacement): AnchorPosition {
  const rect = target.getBoundingClientRect()

  if (placement === 'top' || placement === 'bottom') {
    return {
      left: rect.left + rect.width / 2,
      top: placement === 'top' ? rect.top : rect.bottom,
    }
  }

  return {
    left: placement === 'left' ? rect.left : rect.right,
    top: rect.top + rect.height / 2,
  }
}

function positionedStyle(
  position: AnchorPosition,
  placement: ToolTipPlacement,
  offset: string,
): CSSProperties {
  switch (placement) {
    case 'top':
      return {
        left: position.left,
        top: position.top,
        transform: `translate(-50%, calc(-100% - ${offset}))`,
      }

    case 'bottom':
      return {
        left: position.left,
        top: position.top,
        transform: `translate(-50%, ${offset})`,
      }

    case 'left':
      return {
        left: position.left,
        top: position.top,
        transform: `translate(calc(-100% - ${offset}), -50%)`,
      }

    case 'right':
      return {
        left: position.left,
        top: position.top,
        transform: `translate(${offset}, -50%)`,
      }
  }
}

export function useToolTipPosition(
  targetRef: RefObject<HTMLElement | null>,
  present: boolean,
  placement: ToolTipPlacement,
  offset: string,
) {
  const [position, setPosition] = useState<AnchorPosition>({
    left: 0,
    top: 0,
  })
  const [positioned, setPositioned] = useState(false)

  useLayoutEffect(() => {
    const target = targetRef.current

    if (!present || target === null) {
      setPositioned(false)
      return
    }

    const applyPosition = () => {
      setPosition(anchorPosition(target, placement))
      setPositioned(true)
    }

    return trackVisualAnchor(target, applyPosition, {
      trackScroll: true,
    })
  }, [placement, present, targetRef])

  return {
    positioned,
    placementStyle: positionedStyle(position, placement, offset),
  }
}
