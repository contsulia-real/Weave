import { color, length } from '../../../core/values'
import { typographyStyleVariableReference } from '../../../theme/theme-css'
import type { ResolvedTheme } from '../../../theme/theme-types'
import type { RuntimeStyleDeclarations } from '../runtime-class'

export function resolveFormTheme(theme: ResolvedTheme): RuntimeStyleDeclarations {
  const base = theme.components.Form?.base

  return {
    '--weave-form-gap': length(base?.formGap),
    '--weave-form-field-gap': length(base?.fieldGap),
    '--weave-form-fieldset-gap': length(base?.fieldsetGap),
    '--weave-form-label-color': color(base?.labelColor),
    '--weave-form-description-color': color(base?.descriptionColor),
    '--weave-form-error-color': color(base?.errorColor),
    '--weave-form-legend-color': color(base?.legendColor),
    '--weave-form-legend-font-size': typographyStyleVariableReference(base?.legendTypo, 'fontSize'),
    '--weave-form-legend-font-weight': typographyStyleVariableReference(
      base?.legendTypo,
      'fontWeight',
    ),
    '--weave-form-legend-line-height': typographyStyleVariableReference(
      base?.legendTypo,
      'lineHeight',
    ),
    '--weave-form-legend-letter-spacing': typographyStyleVariableReference(
      base?.legendTypo,
      'letterSpacing',
    ),
  }
}
