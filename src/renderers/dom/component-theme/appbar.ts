import { color, length, radius } from '../../../core/values'
import type { ResolvedTheme } from '../../../theme/theme-types'
import type { RuntimeStyleDeclarations, RuntimeStyleValue } from '../runtime-class'

export function resolveAppBarTheme(theme: ResolvedTheme): RuntimeStyleDeclarations {
  const component = theme.components.AppBar
  const base = component?.base
  const output: Record<string, RuntimeStyleValue> = {
    '--weave-appbar-theme-background': color(base?.background),
    '--weave-appbar-theme-elevated-background': color(base?.elevatedBackground),
    '--weave-appbar-theme-border-color': color(base?.borderColor),
    '--weave-appbar-theme-border-width': length(base?.borderWidth),
    '--weave-appbar-theme-radius': radius(base?.radius),
    '--weave-appbar-theme-rest-depth': length(base?.restDepth),
    '--weave-appbar-theme-depth-color': color(base?.depthColor),
    '--weave-appbar-theme-floating-margin': length(base?.floatingMargin),
  }

  for (const size of ['small', 'medium', 'large'] as const) {
    const sized = component?.sizes?.[size]
    output[`--weave-appbar-theme-${size}-height`] = length(sized?.height)
    output[`--weave-appbar-theme-${size}-margin-x`] = length(sized?.marginX)
    output[`--weave-appbar-theme-${size}-gap`] = length(sized?.gap)
  }

  return output
}
