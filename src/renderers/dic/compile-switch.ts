import { resolveView } from '../../core/resolved-view'
import type { ResolvedView } from '../../core/resolved-view'
import type { ResolvedSwitch } from '../../core/resolved-switch'
import type { Length } from '../../core/view-types'
import type {
  ResolvedTheme,
  ThemeScaleValue,
} from '../../theme/theme-types'
import {
  compileDiCView,
  type DiCKeyboardEvent,
  type DiCPointerEvent,
  type DiCViewNode,
  type DiCViewPaint,
} from './compile-view'

export interface CompileDiCSwitchOptions {
  onChange?: (checked: boolean) => void
  rem?: number
}

interface SwitchDragState {
  pointerId: number
  startX: number
  startOffset: number
  maxOffset: number
  currentOffset: number
  thumbSize: number
  moved: boolean
}

const DRAG_THRESHOLD = 3

function length(
  value: ThemeScaleValue | undefined,
): Length | undefined {
  return value
}

function pixels(
  value: ThemeScaleValue | undefined,
  rem: number,
): number {
  if (value === undefined) return 0
  if (typeof value === 'number') {
    return value * rem
  }

  const input = value.trim()
  if (input === '0') return 0

  if (input.endsWith('rem')) {
    const parsed = Number.parseFloat(input)
    if (Number.isFinite(parsed)) {
      return parsed * rem
    }
  }

  if (input.endsWith('px')) {
    const parsed = Number.parseFloat(input)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  throw new Error(
    `Unsupported DiC Switch length "${value}"`,
  )
}

function pixelString(
  value: number,
): string {
  const rounded =
    Math.round(value * 1_000_000) /
    1_000_000
  const normalized =
    Object.is(rounded, -0)
      ? 0
      : rounded

  return `${normalized}px`
}

function switchPaint(
  theme: ResolvedTheme,
  value: ResolvedSwitch,
): DiCViewPaint {
  const component = theme.components.Switch
  const base = component?.base
  const sized = component?.sizes?.[value.size]

  return {
    layout: 'stack',
    width: sized?.width,
    height: sized?.height,
    background:
      value.checked
        ? component?.states?.checked?.background ??
          base?.background
        : base?.background,
    radiusTopLeft: base?.radius,
    radiusTopRight: base?.radius,
    radiusBottomRight: base?.radius,
    radiusBottomLeft: base?.radius,
    cursor: base?.cursor,
  }
}

function stateDefaults(
  node: DiCViewNode,
  defaults: DiCViewPaint,
  user: DiCViewPaint | undefined,
): DiCViewPaint | undefined {
  const filtered = Object.fromEntries(
    Object.entries(defaults).filter(
      ([key, value]) =>
        value !== undefined &&
        node.paint[
          key as keyof DiCViewPaint
        ] === undefined,
    ),
  ) as DiCViewPaint

  const merged = {
    ...filtered,
    ...user,
  }

  return Object.keys(merged).length === 0
    ? undefined
    : merged
}

export function compileDiCSwitch(
  view: ResolvedView,
  value: ResolvedSwitch,
  theme: ResolvedTheme,
  options: CompileDiCSwitchOptions = {},
): DiCViewNode {
  const component = theme.components.Switch
  const base = component?.base
  const sized = component?.sizes?.[value.size]
  const disabled =
    component?.states?.disabled
  const rem = options.rem ?? 16

  const thumbSize = pixels(
    sized?.thumbSize,
    rem,
  )
  const inset = pixels(
    base?.thumbInset,
    rem,
  )
  const maxOffset = pixels(
    sized?.shift,
    rem,
  )
  const dragShrink =
    base?.thumbDragShrink ?? 0.68
  const dragMaxWidth =
    base?.thumbDragMaxWidth ?? 1.35
  let drag: SwitchDragState | undefined

  const restingTransform = () => [
    {
      translate: [
        pixelString(
          inset + (
            value.checked
              ? maxOffset
              : 0
          ),
        ),
        pixelString(inset),
      ] as const,
    },
  ]

  const thumb = compileDiCView(
    resolveView(
      {
        width: sized?.thumbSize,
        height: sized?.thumbSize,
        background: base?.thumbBackground,
        radius: base?.thumbRadius,
        pointerEvents: 'auto',
        transform: restingTransform(),
      },
      theme.breakpoints,
    ),
  )

  const resetThumb = () => {
    thumb.paint.width =
      length(sized?.thumbSize)
    thumb.paint.height =
      length(sized?.thumbSize)
    thumb.paint.transform =
      restingTransform()
  }

  const moveDrag = (
    event: DiCPointerEvent,
  ) => {
    if (
      drag === undefined ||
      drag.pointerId !== event.pointerId
    ) {
      return
    }

    const delta = event.x - drag.startX
    const nextOffset = Math.min(
      drag.maxOffset,
      Math.max(
        0,
        drag.startOffset + delta,
      ),
    )
    drag.currentOffset = nextOffset

    if (
      !drag.moved &&
      Math.abs(delta) >= DRAG_THRESHOLD
    ) {
      drag.moved = true
    }

    const thresholdDistance =
      drag.maxOffset / 2
    const progress =
      thresholdDistance <= 0
        ? 0
        : Math.min(
            1,
            Math.abs(
              nextOffset -
              drag.startOffset,
            ) / thresholdDistance,
          )
    const height =
      drag.thumbSize * dragShrink
    const widthScale =
      dragShrink +
      (
        dragMaxWidth -
        dragShrink
      ) * progress
    const width =
      drag.thumbSize * widthScale
    const centeredX =
      nextOffset +
      (drag.thumbSize - width) / 2
    const maxX = Math.max(
      0,
      drag.maxOffset +
        drag.thumbSize -
        width,
    )
    const x = Math.min(
      maxX,
      Math.max(0, centeredX),
    )
    const y =
      (drag.thumbSize - height) / 2

    thumb.paint.width = pixelString(width)
    thumb.paint.height = pixelString(height)
    thumb.paint.transform = [
      {
        translate: [
          pixelString(inset + x),
          pixelString(inset + y),
        ],
      },
    ]

    event.preventDefault()
    event.requestRender()
  }

  const finishDrag = (
    event: DiCPointerEvent,
    apply: boolean,
  ) => {
    if (
      drag === undefined ||
      drag.pointerId !== event.pointerId
    ) {
      return
    }

    const finished = drag
    drag = undefined
    resetThumb()
    event.releasePointer()
    event.requestRender()

    if (!finished.moved) return

    event.preventDefault()

    if (!apply || value.disabled) {
      return
    }

    const nextChecked =
      finished.maxOffset > 0
        ? finished.currentOffset >=
          finished.maxOffset / 2
        : value.checked

    if (nextChecked !== value.checked) {
      options.onChange?.(nextChecked)
    }
  }

  const toggle = () => {
    if (value.disabled) return
    options.onChange?.(!value.checked)
  }

  const node = compileDiCView(
    view,
    {
      children: [thumb],
      semantics: {
        role:
          view.semantics.role ??
          'switch',
        checked: value.checked,
        disabled: value.disabled,
      },
      interaction: {
        focusable:
          view.interaction.focusable ??
          true,
        autoFocus:
          view.interaction.autoFocus,
        tabIndex:
          view.interaction.tabIndex,
        onClick: (event) => {
          if (!event.defaultPrevented) {
            toggle()
          }
        },
        onKeyDown: (
          event: DiCKeyboardEvent,
        ) => {
          if (
            value.disabled ||
            event.defaultPrevented
          ) {
            return
          }

          if (
            event.key === ' ' ||
            event.key === 'Enter'
          ) {
            event.preventDefault()
            toggle()
          }
        },
        onPointerDown: (
          event: DiCPointerEvent,
        ) => {
          if (
            value.disabled ||
            event.defaultPrevented ||
            event.button !== 0 ||
            event.target !== thumb
          ) {
            return
          }

          const startOffset =
            value.checked
              ? maxOffset
              : 0

          drag = {
            pointerId: event.pointerId,
            startX: event.x,
            startOffset,
            maxOffset,
            currentOffset: startOffset,
            thumbSize,
            moved: false,
          }

          event.capturePointer()
          moveDrag(event)
        },
        onPointerMove: moveDrag,
        onPointerUp: (event) => {
          finishDrag(
            event,
            !event.defaultPrevented,
          )
        },
        onPointerCancel: (event) => {
          finishDrag(event, false)
        },
      },
    },
  )

  return {
    ...node,
    paint: {
      ...switchPaint(theme, value),
      ...node.paint,
    },
    states: {
      ...node.states,
      focusVisible: stateDefaults(
        node,
        {
          outlineWidth:
            base?.focusOutlineWidth,
          outlineColor:
            base?.focusOutlineColor,
          outlineStyle:
            base?.focusOutlineStyle,
          outlineOffset:
            base?.focusOutlineOffset,
        },
        node.states.focusVisible,
      ),
      disabled: stateDefaults(
        node,
        {
          opacity: disabled?.opacity,
          cursor: disabled?.cursor,
        },
        node.states.disabled,
      ),
    },
  }
}
