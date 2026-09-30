import { color, length, radius } from '../../../core/values'
import { typographyStyleVariableReference } from '../../../theme/theme-css'
import type { ResolvedTheme } from '../../../theme/theme-types'
import type { RuntimeStyleDeclarations } from '../runtime-class'

export function resolveTabsTheme(theme: ResolvedTheme): RuntimeStyleDeclarations {
  const base = theme.components.Tabs?.base

  return {
    '--weave-tabs-gap': length(base?.gap),
    '--weave-tabs-list-gap': length(base?.listGap),
    '--weave-tabs-tab-background': color(base?.tabBackground),
    '--weave-tabs-tab-hover-background': color(base?.tabHoverBackground),
    '--weave-tabs-tab-color': color(base?.tabColor),
    '--weave-tabs-tab-selected-color': color(base?.tabSelectedColor),
    '--weave-tabs-pill-list-background': color(base?.pillListBackground),
    '--weave-tabs-pill-list-shadow': base?.pillListShadow,
    '--weave-tabs-pill-list-padding': length(base?.pillListPadding),
    '--weave-tabs-pill-selected-background': color(base?.pillSelectedBackground),
    '--weave-tabs-pill-selected-shadow': base?.pillSelectedShadow,
    '--weave-tabs-tab-radius': radius(base?.tabRadius),
    '--weave-tabs-tab-padding-x': length(base?.tabPaddingX),
    '--weave-tabs-tab-padding-y': length(base?.tabPaddingY),
    '--weave-tabs-indicator-color': color(base?.indicatorColor),
    '--weave-tabs-indicator-thickness':
      base?.indicatorThickness === undefined
        ? undefined
        : `${Math.max(0, base.indicatorThickness)}px`,
    '--weave-tabs-focus-outline-width': length(base?.focusOutlineWidth),
    '--weave-tabs-focus-outline-color': color(base?.focusOutlineColor),
    '--weave-tabs-focus-outline-style': base?.focusOutlineStyle,
    '--weave-tabs-focus-outline-offset': length(base?.focusOutlineOffset),
    '--weave-tabs-disabled-opacity': base?.disabledOpacity,
    '--weave-tabs-tab-font-size': typographyStyleVariableReference(base?.typo, 'fontSize'),
    '--weave-tabs-tab-font-weight': typographyStyleVariableReference(base?.typo, 'fontWeight'),
    '--weave-tabs-tab-line-height': typographyStyleVariableReference(base?.typo, 'lineHeight'),
    '--weave-tabs-tab-letter-spacing': typographyStyleVariableReference(
      base?.typo,
      'letterSpacing',
    ),
  }
}
