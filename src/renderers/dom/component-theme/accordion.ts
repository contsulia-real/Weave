import { color, length, radius } from '../../../core/values'
import { typographyStyleVariableReference } from '../../../theme/theme-css'
import type { ResolvedTheme } from '../../../theme/theme-types'
import type { RuntimeStyleDeclarations } from '../runtime-class'

export function resolveAccordionTheme(theme: ResolvedTheme): RuntimeStyleDeclarations {
  const base = theme.components.Accordion?.base

  return {
    '--weave-accordion-divider-color': color(base?.dividerColor),
    '--weave-accordion-trigger-background': color(base?.triggerBackground),
    '--weave-accordion-trigger-hover-background': color(base?.triggerHoverBackground),
    '--weave-accordion-trigger-pressed-background': color(base?.triggerPressedBackground),
    '--weave-accordion-trigger-color': color(base?.triggerColor),
    '--weave-accordion-trigger-padding-x': length(base?.triggerPaddingX),
    '--weave-accordion-trigger-padding-y': length(base?.triggerPaddingY),
    '--weave-accordion-panel-padding-x': length(base?.panelPaddingX),
    '--weave-accordion-panel-padding-y': length(base?.panelPaddingY),
    '--weave-accordion-radius': radius(base?.radius),
    '--weave-accordion-indicator-size': length(base?.indicatorSize),
    '--weave-accordion-focus-outline-width': length(base?.focusOutlineWidth),
    '--weave-accordion-focus-outline-color': color(base?.focusOutlineColor),
    '--weave-accordion-focus-outline-style': base?.focusOutlineStyle,
    '--weave-accordion-focus-outline-offset': length(base?.focusOutlineOffset),
    '--weave-accordion-disabled-opacity': base?.disabledOpacity,
    '--weave-accordion-font-size': typographyStyleVariableReference(base?.typo, 'fontSize'),
    '--weave-accordion-font-weight': typographyStyleVariableReference(base?.typo, 'fontWeight'),
    '--weave-accordion-line-height': typographyStyleVariableReference(base?.typo, 'lineHeight'),
    '--weave-accordion-letter-spacing': typographyStyleVariableReference(
      base?.typo,
      'letterSpacing',
    ),
  }
}
