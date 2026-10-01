import { color, length, radius } from '../../../core/values'
import { typographyStyleVariableReference } from '../../../theme/theme-css'
import type { ResolvedTheme } from '../../../theme/theme-types'
import type { RuntimeStyleDeclarations } from '../runtime-class'

export function resolveTableTheme(theme: ResolvedTheme): RuntimeStyleDeclarations {
  const base = theme.components.Table?.base
  const normal = theme.components.Table?.densities?.normal
  const dense = theme.components.Table?.densities?.dense
  const headerTypo = base?.headerTypo ?? 'label-medium'
  const cellTypo = base?.cellTypo ?? 'body-medium'

  return {
    '--weave-table-background': color(base?.background),
    '--weave-table-border-color': color(base?.borderColor),
    '--weave-table-border-width': length(base?.borderWidth),
    '--weave-table-radius': radius(base?.radius),
    '--weave-table-rest-depth': length(base?.restDepth),
    '--weave-table-depth-color': color(base?.depthColor),
    '--weave-table-header-background': color(base?.headerBackground),
    '--weave-table-row-hover-background': color(base?.rowHoverBackground),
    '--weave-table-row-selected-background': color(base?.rowSelectedBackground),
    '--weave-table-cell-selected-background': color(base?.cellSelectedBackground),
    '--weave-table-divider-color': color(base?.dividerColor),
    '--weave-table-divider-width': length(base?.dividerWidth),
    '--weave-table-color': color(base?.color),
    '--weave-table-header-color': color(base?.headerColor),
    '--weave-table-normal-padding-x': length(normal?.paddingX),
    '--weave-table-normal-padding-y': length(normal?.paddingY),
    '--weave-table-dense-padding-x': length(dense?.paddingX),
    '--weave-table-dense-padding-y': length(dense?.paddingY),
    '--weave-table-header-font-size': typographyStyleVariableReference(headerTypo, 'fontSize'),
    '--weave-table-header-font-weight': typographyStyleVariableReference(headerTypo, 'fontWeight'),
    '--weave-table-header-line-height': typographyStyleVariableReference(headerTypo, 'lineHeight'),
    '--weave-table-header-letter-spacing': typographyStyleVariableReference(
      headerTypo,
      'letterSpacing',
    ),
    '--weave-table-cell-font-size': typographyStyleVariableReference(cellTypo, 'fontSize'),
    '--weave-table-cell-font-weight': typographyStyleVariableReference(cellTypo, 'fontWeight'),
    '--weave-table-cell-line-height': typographyStyleVariableReference(cellTypo, 'lineHeight'),
    '--weave-table-cell-letter-spacing': typographyStyleVariableReference(
      cellTypo,
      'letterSpacing',
    ),
  }
}
