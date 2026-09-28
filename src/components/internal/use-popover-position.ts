import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'
import type {
  PopoverPlacement,
} from '../../core/popover-types'
import {
  resolvePopoverPosition,
} from './popover-position'
import { trackVisualAnchor } from './visual-anchor-tracker'

interface PopoverPositionState {
  left: number
  top: number
  placement: PopoverPlacement
  positioned: boolean
}

const INTERACTION_EVENTS = [
  'pointerenter',
  'pointerleave',
  'pointerdown',
  'pointerup',
  'pointercancel',
  'focusin',
  'focusout',
] as const

function numericCssLength(
  element: HTMLElement,
  value: string,
): number {
  const normalized =
    value.trim()

  if (
    normalized.length === 0 ||
    normalized === '0'
  ) {
    return 0
  }

  const direct =
    /^(-?\d*\.?\d+)(px|rem)$/.exec(
      normalized,
    )

  if (direct !== null) {
    const amount =
      Number.parseFloat(
        direct[1] ?? '0',
      )

    if (direct[2] === 'px') {
      return amount
    }

    const rootSize =
      Number.parseFloat(
        element.ownerDocument
          .defaultView
          ?.getComputedStyle(
            element.ownerDocument
              .documentElement,
          )
          .fontSize ??
          '16',
      ) || 16

    return amount * rootSize
  }

  const probe =
    element.ownerDocument
      .createElement('div')

  probe.style.position =
    'fixed'
  probe.style.visibility =
    'hidden'
  probe.style.pointerEvents =
    'none'
  probe.style.width =
    normalized
  probe.style.height = '0'
  probe.style.fontSize =
    element.ownerDocument
      .defaultView
      ?.getComputedStyle(element)
      .fontSize ??
    ''

  element.ownerDocument.body
    .append(probe)

  const pixels =
    probe.getBoundingClientRect()
      .width

  probe.remove()
  return pixels
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
  offset: string,
  viewportPadding: string,
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
          numericCssLength(
            panel,
            offset,
          ),
          {
            width:
              view.innerWidth,
            height:
              view.innerHeight,
            padding:
              numericCssLength(
                panel,
                viewportPadding,
              ),
          },
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
          INTERACTION_EVENTS,
        continuousAnimations:
          true,
      },
    )
  }, [
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
