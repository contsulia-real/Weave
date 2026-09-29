import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'
import type {
  PopoverPlacement,
} from '../../core/popover-types'
import type { Length } from '../../core/view-types'
import { length } from '../../core/values'
import { cssLengthPixels } from './css-length-pixels'
import {
  resolvePopoverPosition,
  type PopoverCrossAlignment,
} from './popover-position'
import {
  trackVisualAnchor,
  visualAnchorInteractionEvents,
} from './visual-anchor-tracker'

interface PopoverPositionState {
  left: number
  top: number
  placement: PopoverPlacement
  positioned: boolean
}

function samePosition(
  current: PopoverPositionState,
  next: PopoverPositionState,
): boolean {
  return (
    Math.abs(
      current.left - next.left,
    ) < 0.25 &&
    Math.abs(
      current.top - next.top,
    ) < 0.25 &&
    current.placement ===
      next.placement &&
    current.positioned ===
      next.positioned
  )
}

export function usePopoverPosition(
  targetRef:
    RefObject<HTMLElement | null>,
  panelRef:
    RefObject<HTMLDivElement | null>,
  present: boolean,
  placement: PopoverPlacement,
  offset: Length,
  viewportPadding: Length,
  crossAlignment:
    PopoverCrossAlignment =
      'center',
) {
  const [
    state,
    setState,
  ] = useState<PopoverPositionState>({
    left: 0,
    top: 0,
    placement,
    positioned: false,
  })

  useLayoutEffect(() => {
    const target =
      targetRef.current
    const panel =
      panelRef.current

    if (
      !present ||
      target === null ||
      panel === null
    ) {
      setState((current) =>
        current.positioned
          ? {
              ...current,
              positioned: false,
            }
          : current,
      )
      return
    }

    const view =
      target.ownerDocument
        .defaultView

    if (view === null) {
      return
    }

    const applyPosition = () => {
      const targetRect =
        target.getBoundingClientRect()
      const panelRect =
        panel.getBoundingClientRect()
      const width =
        panel.offsetWidth ||
        panelRect.width
      const height =
        panel.offsetHeight ||
        panelRect.height
      const next =
        resolvePopoverPosition(
          targetRect,
          {
            width,
            height,
          },
          placement,
          cssLengthPixels(
            panel,
            length(offset) ?? '0rem',
          ),
          {
            width:
              view.innerWidth,
            height:
              view.innerHeight,
            padding:
              cssLengthPixels(
                panel,
                length(viewportPadding) ??
                  '0rem',
              ),
          },
          crossAlignment,
        )
      const resolved = {
        ...next,
        positioned: true,
      }

      setState((current) =>
        samePosition(
          current,
          resolved,
        )
          ? current
          : resolved,
      )
    }

    return trackVisualAnchor(
      target,
      applyPosition,
      {
        additionalTargets: [
          panel,
        ],
        trackScroll: true,
        trackMutations: true,
        interactionEvents:
          visualAnchorInteractionEvents,
        continuousAnimations:
          true,
      },
    )
  }, [
    crossAlignment,
    offset,
    panelRef,
    placement,
    present,
    targetRef,
    viewportPadding,
  ])

  const style:
    CSSProperties = {
      left: state.left,
      top: state.top,
    }

  return {
    positioned:
      state.positioned,
    placement:
      state.placement,
    placementStyle:
      style,
  }
}
