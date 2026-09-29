import type { ProgressMode, ProgressSize } from '../../../core/progress-types'
import { color, length, radius } from '../../../core/values'
import type { ScrollbarConfig, ScrollbarSize } from '../../../core/view-types'
import type { ResolvedTheme, ScrollbarTheme } from '../../../theme/theme-types'
import type { RuntimeStyleDeclarations } from '../runtime-class'

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
    '--weave-progress-width': length(spin ? sized?.spinSize : sized?.linearWidth),
    '--weave-progress-height': length(spin ? sized?.spinSize : sized?.linearHeight),
    '--weave-progress-thickness': length(sized?.spinThickness),
    '--weave-progress-track-color': color(base?.trackColor),
    '--weave-progress-track-shadow': base?.trackShadow,
    '--weave-progress-value-shadow': base?.valueShadow,
    '--weave-progress-linear-radius': radius(base?.linearRadius),
  }
}

function scrollbarTheme(theme: ResolvedTheme): ScrollbarTheme | undefined {
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

  const resolvedColor = color(config?.color ?? base?.color)

  return {
    '--weave-scrollbar-thickness': length(sized?.thickness),
    '--weave-scrollbar-hit-size': length(base?.hitSize),
    '--weave-scrollbar-color': resolvedColor,
    '--weave-scrollbar-hover-color':
      config?.color === undefined
        ? color(base?.hoverColor)
        : `color-mix(in srgb, ${resolvedColor} 88%, black)`,
    '--weave-scrollbar-drag-color':
      config?.color === undefined
        ? color(base?.dragColor)
        : `color-mix(in srgb, ${resolvedColor} 76%, black)`,
    '--weave-scrollbar-radius': radius(config?.radius ?? base?.radius),
    '--weave-scrollbar-opacity': config?.opacity ?? base?.opacity,
    '--weave-scrollbar-thumb-cursor': base?.thumbCursor,
  }
}
