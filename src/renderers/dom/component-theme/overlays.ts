import type { ResolvedTheme } from '../../../theme/theme-types'
import type { SnackVariant } from '../../../core/snack-types'
import {
  color,
  length,
  radius,
} from '../../../core/values'
import type {
  RuntimeStyleDeclarations,
  RuntimeStyleValue,
} from '../runtime-class'
import { shadowToken } from './shared'

const SNACK_VARIANTS: readonly SnackVariant[] = [
  'default',
  'success',
  'warning',
  'danger',
  'info',
]

export function resolveToolTipTheme(
  theme: ResolvedTheme,
): RuntimeStyleDeclarations {
  const base = theme.components.ToolTip?.base

  return {
    '--weave-tooltip-background': color(base?.background),
    '--weave-tooltip-color': color(base?.color),
    '--weave-tooltip-border-color': color(base?.borderColor),
    '--weave-tooltip-border-width': length(base?.borderWidth),
    '--weave-tooltip-radius': radius(base?.radius),
    '--weave-tooltip-padding-x': length(base?.paddingX),
    '--weave-tooltip-padding-y': length(base?.paddingY),
    '--weave-tooltip-max-width': length(base?.maxWidth),
    '--weave-tooltip-shadow': shadowToken(base?.shadow),
    '--weave-tooltip-arrow-size': length(base?.arrowSize),
    '--weave-tooltip-motion-offset': length(base?.motionOffset),
  }
}

export function resolvePopoverTheme(
  theme: ResolvedTheme,
): RuntimeStyleDeclarations {
  const base = theme.components.Popover?.base

  return {
    '--weave-popover-background': color(base?.background),
    '--weave-popover-color': color(base?.color),
    '--weave-popover-border-color': color(base?.borderColor),
    '--weave-popover-border-width': length(base?.borderWidth),
    '--weave-popover-radius': radius(base?.radius),
    '--weave-popover-padding-x': length(base?.paddingX),
    '--weave-popover-padding-y': length(base?.paddingY),
    '--weave-popover-min-width': length(base?.minWidth),
    '--weave-popover-max-width': length(base?.maxWidth),
    '--weave-popover-shadow': shadowToken(base?.shadow),
    '--weave-popover-motion-offset': length(base?.motionOffset),
  }
}

export function resolveSnackTheme(
  theme: ResolvedTheme,
): RuntimeStyleDeclarations {
  const component = theme.components.Snack
  const base = component?.base
  const output: Record<string, RuntimeStyleValue> = {
    '--weave-snack-background': color(base?.background),
    '--weave-snack-color': color(base?.color),
    '--weave-snack-border-color': color(base?.borderColor),
    '--weave-snack-border-width': length(base?.borderWidth),
    '--weave-snack-radius': radius(base?.radius),
    '--weave-snack-padding-x': length(base?.paddingX),
    '--weave-snack-padding-y': length(base?.paddingY),
    '--weave-snack-gap': length(base?.gap),
    '--weave-snack-shadow': shadowToken(base?.shadow),
    '--weave-snack-icon-size': length(base?.iconSize),
    '--weave-snack-progress-height': length(base?.progressHeight),
    '--weave-snack-motion-offset': length(base?.motionOffset),
  }

  for (const variant of SNACK_VARIANTS) {
    output[`--weave-snack-${variant}-accent`] = color(
      component?.variants?.[variant]?.accentColor,
    )
  }

  return output
}
