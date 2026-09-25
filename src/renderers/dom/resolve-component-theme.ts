import type {
  ResolvedTheme,
  ScrollbarTheme,
} from '../../theme/theme-types'
import type {
  ScrollbarConfig,
  ScrollbarSize,
} from '../../core/view-types'
import type { ButtonVariant } from '../../core/button-types'
import type { ProgressMode, ProgressSize } from '../../core/progress-types'
import type { SwitchSize } from '../../core/switch-types'
import {
  color,
  length,
  radius,
} from '../../core/values'
import type { RuntimeStyleDeclarations } from './runtime-class'

const BUTTON_VARIANTS: readonly ButtonVariant[] = [
  'primary',
  'secondary',
  'tertiary',
  'ghost',
  'danger',
]

export function resolveButtonTheme(
  theme: ResolvedTheme,
): RuntimeStyleDeclarations {
  const component = theme.components.Button
  const base = component?.base
  const disabled = component?.states?.disabled
  const output: RuntimeStyleDeclarations = {
    '--weave-button-theme-radius': radius(base?.radius),
    '--weave-button-theme-border-width': length(base?.borderWidth),
    '--weave-button-theme-cursor': base?.cursor,
    '--weave-button-theme-font-weight': base?.fontWeight,
    '--weave-button-theme-focus-outline-width': length(
      base?.focusOutlineWidth,
    ),
    '--weave-button-theme-focus-outline-color': color(
      base?.focusOutlineColor,
    ),
    '--weave-button-theme-focus-outline-style': base?.focusOutlineStyle,
    '--weave-button-theme-focus-outline-offset': length(
      base?.focusOutlineOffset,
    ),
    '--weave-button-theme-disabled-opacity': disabled?.opacity,
    '--weave-button-theme-disabled-cursor': disabled?.cursor,
  }

  for (const size of ['small', 'medium', 'large'] as const) {
    const sized = component?.sizes?.[size]
    output[`--weave-button-theme-${size}-min-height`] =
      length(sized?.minHeight)
    output[`--weave-button-theme-${size}-padding-x`] =
      length(sized?.paddingX)
    output[`--weave-button-theme-${size}-padding-y`] =
      length(sized?.paddingY)
    output[`--weave-button-theme-${size}-gap`] =
      length(sized?.gap)
    output[`--weave-button-theme-${size}-font-size`] =
      length(sized?.fontSize)
  }

  for (const variant of BUTTON_VARIANTS) {
    const value = component?.variants?.[variant]
    output[`--weave-button-theme-${variant}-background`] =
      color(value?.background)
    output[`--weave-button-theme-${variant}-color`] =
      color(value?.color)
    output[`--weave-button-theme-${variant}-border-color`] =
      color(value?.borderColor)
    output[`--weave-button-theme-${variant}-hover-background`] =
      color(value?.hoverBackground)
    output[`--weave-button-theme-${variant}-active-background`] =
      color(value?.activeBackground)
  }

  return output
}

export function resolveSwitchTheme(
  theme: ResolvedTheme,
  size: SwitchSize,
): RuntimeStyleDeclarations {
  const component = theme.components.Switch
  const base = component?.base
  const sized = component?.sizes?.[size]
  const checked = component?.states?.checked
  const disabled = component?.states?.disabled

  return {
    '--weave-switch-width': length(sized?.width),
    '--weave-switch-height': length(sized?.height),
    '--weave-switch-thumb-size': length(sized?.thumbSize),
    '--weave-switch-shift': length(sized?.shift),
    '--weave-switch-background': color(base?.background),
    '--weave-switch-radius': radius(base?.radius),
    '--weave-switch-cursor': base?.cursor,
    '--weave-switch-thumb-background': color(base?.thumbBackground),
    '--weave-switch-thumb-radius': radius(base?.thumbRadius),
    '--weave-switch-thumb-inset': length(base?.thumbInset),
    '--weave-switch-focus-outline-width': length(base?.focusOutlineWidth),
    '--weave-switch-focus-outline-color': color(base?.focusOutlineColor),
    '--weave-switch-focus-outline-style': base?.focusOutlineStyle,
    '--weave-switch-focus-outline-offset': length(base?.focusOutlineOffset),
    '--weave-switch-checked-background': color(checked?.background),
    '--weave-switch-disabled-opacity': disabled?.opacity,
    '--weave-switch-disabled-cursor': disabled?.cursor,
  }
}

export function resolveProgressTheme(
  theme: ResolvedTheme,
  mode: ProgressMode,
  size: ProgressSize,
): RuntimeStyleDeclarations {
  const component = theme.components.Progress
  const base = component?.base
  const sized = component?.sizes?.[size]
  const spin = mode === 'spin'

  return {
    '--weave-progress-width': length(
      spin ? sized?.spinSize : sized?.linearWidth,
    ),
    '--weave-progress-height': length(
      spin ? sized?.spinSize : sized?.linearHeight,
    ),
    '--weave-progress-thickness': length(sized?.spinThickness),
    '--weave-progress-track-color': color(base?.trackColor),
    '--weave-progress-linear-radius': radius(base?.linearRadius),
  }
}

function scrollbarTheme(
  theme: ResolvedTheme,
): ScrollbarTheme | undefined {
  return theme.components.Scrollbar
}

export function resolveScrollbarTheme(
  theme: ResolvedTheme,
  size: ScrollbarSize,
  config: ScrollbarConfig | undefined,
): RuntimeStyleDeclarations {
  const component = scrollbarTheme(theme)
  const base = component?.base
  const sized = component?.sizes?.[size]

  return {
    '--weave-scrollbar-thickness': length(sized?.thickness),
    '--weave-scrollbar-color': color(config?.color ?? base?.color),
    '--weave-scrollbar-track-color': color(
      config?.trackColor ?? base?.trackColor,
    ),
    '--weave-scrollbar-radius': radius(config?.radius ?? base?.radius),
    '--weave-scrollbar-opacity': config?.opacity ?? base?.opacity,
    '--weave-scrollbar-thumb-cursor': base?.thumbCursor,
  }
}
