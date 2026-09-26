import { resolveView } from '../../core/resolved-view'
import type {
  ResolvedView,
} from '../../core/resolved-view'
import type { ResolvedSwitch } from '../../core/resolved-switch'
import type { ResolvedTheme } from '../../theme/theme-types'
import {
  compileDiCView,
  type DiCViewNode,
  type DiCViewPaint,
} from './compile-view'

export interface CompileDiCSwitchOptions {
  onChange?: (checked: boolean) => void
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

function thumbNode(
  theme: ResolvedTheme,
  value: ResolvedSwitch,
): DiCViewNode {
  const component = theme.components.Switch
  const base = component?.base
  const sized = component?.sizes?.[value.size]
  const inset = base?.thumbInset ?? 0
  const shift =
    value.checked
      ? sized?.shift ?? 0
      : 0

  return compileDiCView(
    resolveView(
      {
        width: sized?.thumbSize,
        height: sized?.thumbSize,
        background: base?.thumbBackground,
        radius: base?.thumbRadius,
        pointerEvents: 'auto',
        transform: [
          {
            translate: [
              inset,
              inset,
            ],
          },
          {
            translateX: shift,
          },
        ],
      },
      theme.breakpoints,
    ),
  )
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
  const toggle = () => {
    if (value.disabled) return
    options.onChange?.(!value.checked)
  }

  const node = compileDiCView(
    view,
    {
      children: [
        thumbNode(theme, value),
      ],
      semantics: {
        role: 'switch',
        checked: value.checked,
        disabled: value.disabled,
      },
      interaction: {
        focusable:
          view.interaction.focusable ??
          true,
        onClick: (event) => {
          if (value.disabled) return
          event.preventDefault()
          toggle()
        },
        onKeyDown: (event) => {
          if (value.disabled) return

          if (
            event.key === ' ' ||
            event.key === 'Enter'
          ) {
            event.preventDefault()
            toggle()
          }
        },
      },
    },
  )
  const disabled =
    theme.components.Switch?.states?.disabled

  return {
    ...node,
    paint: {
      ...switchPaint(theme, value),
      ...node.paint,
    },
    states: {
      ...node.states,
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
