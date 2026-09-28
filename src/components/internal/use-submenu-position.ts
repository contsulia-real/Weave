import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'
import { cssLengthPixels } from './css-length-pixels'
import {
  resolveSubmenuPosition,
  type SubmenuSide,
} from './submenu-position'
import { trackVisualAnchor } from './visual-anchor-tracker'

interface SubmenuPositionState {
  left: number
  top: number
  side: SubmenuSide
  positioned: boolean
}

function samePosition(
  current:
    SubmenuPositionState,
  next:
    SubmenuPositionState,
): boolean {
  return (
    Math.abs(
      current.left - next.left,
    ) < 0.25 &&
    Math.abs(
      current.top - next.top,
    ) < 0.25 &&
    current.side ===
      next.side &&
    current.positioned ===
      next.positioned
  )
}

export function useSubmenuPosition(
  anchorRef:
    RefObject<HTMLDivElement | null>,
  panelRef:
    RefObject<HTMLDivElement | null>,
  present: boolean,
  offset: string,
  viewportPadding: string,
) {
  const [
    state,
    setState,
  ] = useState<SubmenuPositionState>({
    left: 0,
    top: 0,
    side: 'right',
    positioned: false,
  })

  useLayoutEffect(() => {
    const anchor =
      anchorRef.current
    const panel =
      panelRef.current

    if (
      !present ||
      anchor === null ||
      panel === null
    ) {
      setState(
        (current) =>
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
      anchor.ownerDocument
        .defaultView

    if (view === null) {
      return
    }

    const update = () => {
      const targetRect =
        anchor
          .getBoundingClientRect()
      const panelRect =
        panel
          .getBoundingClientRect()
      const next =
        resolveSubmenuPosition(
          targetRect,
          {
            width:
              panel.offsetWidth ||
              panelRect.width,
            height:
              panel.offsetHeight ||
              panelRect.height,
          },
          'right',
          cssLengthPixels(
            panel,
            offset,
          ),
          {
            width:
              view.innerWidth,
            height:
              view.innerHeight,
            padding:
              cssLengthPixels(
                panel,
                viewportPadding,
              ),
          },
        )
      const resolved = {
        ...next,
        positioned: true,
      }

      setState(
        (current) =>
          samePosition(
            current,
            resolved,
          )
            ? current
            : resolved,
      )
    }

    return trackVisualAnchor(
      anchor,
      update,
      {
        additionalTargets: [
          panel,
        ],
        trackScroll: true,
        trackMutations: true,
        interactionEvents: [
          'pointerenter',
          'pointerleave',
          'focusin',
          'focusout',
        ],
        continuousAnimations:
          true,
      },
    )
  }, [
    anchorRef,
    offset,
    panelRef,
    present,
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
    side: state.side,
    placementStyle:
      style,
  }
}
