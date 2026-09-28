import type { ResolvedTheme } from '../../../theme/theme-types'
import {
  color,
  length,
  radius,
} from '../../../core/values'
import type { RuntimeStyleDeclarations } from '../runtime-class'

export function resolveListTheme(
  theme: ResolvedTheme,
): RuntimeStyleDeclarations {
  const base = theme.components.List?.base

  return {
    '--weave-list-background': color(base?.background),
    '--weave-list-border-color': color(base?.borderColor),
    '--weave-list-border-width': length(base?.borderWidth),
    '--weave-list-radius': radius(base?.radius),
    '--weave-list-padding': length(base?.padding),
    '--weave-list-gap': length(base?.gap),
  }
}

export function resolveListItemTheme(
  theme: ResolvedTheme,
): RuntimeStyleDeclarations {
  const base = theme.components.ListItem?.base

  return {
    '--weave-list-item-background': color(base?.background),
    '--weave-list-item-hover-background': color(base?.hoverBackground),
    '--weave-list-item-active-background': color(base?.activeBackground),
    '--weave-list-item-selected-background': color(
      base?.selectedBackground,
    ),
    '--weave-list-item-selected-hover-background': color(
      base?.selectedHoverBackground,
    ),
    '--weave-list-item-color': color(base?.color),
    '--weave-list-item-secondary-color': color(base?.secondaryColor),
    '--weave-list-item-selected-color': color(base?.selectedColor),
    '--weave-list-item-radius': radius(base?.radius),
    '--weave-list-item-padding-x': length(base?.paddingX),
    '--weave-list-item-padding-y': length(base?.paddingY),
    '--weave-list-item-gap': length(base?.gap),
    '--weave-list-item-icon-size': length(base?.iconSize),
    '--weave-list-item-focus-outline-width': length(
      base?.focusOutlineWidth,
    ),
    '--weave-list-item-focus-outline-color': color(
      base?.focusOutlineColor,
    ),
    '--weave-list-item-focus-outline-style':
      base?.focusOutlineStyle,
    '--weave-list-item-focus-outline-offset': length(
      base?.focusOutlineOffset,
    ),
    '--weave-list-item-disabled-opacity':
      base?.disabledOpacity,
  }
}
