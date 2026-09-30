import { color, length } from '../../../core/values'
import type { ResolvedTheme } from '../../../theme/theme-types'
import type { RuntimeStyleDeclarations } from '../runtime-class'

export function resolveSplitBoxTheme(theme: ResolvedTheme): RuntimeStyleDeclarations {
  const base = theme.components.SplitBox?.base

  return {
    '--weave-splitbox-theme-thickness': length(base?.thickness),
    '--weave-splitbox-hit-size': length(base?.hitSize),
    '--weave-splitbox-color': color(base?.color),
    '--weave-splitbox-hover-color': color(base?.hoverColor),
    '--weave-splitbox-active-color': color(base?.activeColor),
    '--weave-splitbox-focus-outline-width': length(base?.focusOutlineWidth),
    '--weave-splitbox-focus-outline-color': color(base?.focusOutlineColor),
    '--weave-splitbox-focus-outline-style': base?.focusOutlineStyle,
    '--weave-splitbox-focus-outline-offset': length(base?.focusOutlineOffset),
  }
}
