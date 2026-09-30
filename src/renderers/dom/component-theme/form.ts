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
    '--weave-form-label-font-size': typographyStyleVariableReference(base?.labelTypo, 'fontSize'),
    '--weave-form-label-font-weight': typographyStyleVariableReference(
      base?.labelTypo,
      'fontWeight',
    ),
    '--weave-form-label-line-height': typographyStyleVariableReference(
      base?.labelTypo,
      'lineHeight',
    ),
    '--weave-form-label-letter-spacing': typographyStyleVariableReference(
      base?.labelTypo,
      'letterSpacing',
    ),
    '--weave-form-description-font-size': typographyStyleVariableReference(
      base?.descriptionTypo,
      'fontSize',
    ),
    '--weave-form-description-font-weight': typographyStyleVariableReference(
      base?.descriptionTypo,
      'fontWeight',
    ),
    '--weave-form-description-line-height': typographyStyleVariableReference(
      base?.descriptionTypo,
      'lineHeight',
    ),
    '--weave-form-description-letter-spacing': typographyStyleVariableReference(
      base?.descriptionTypo,
      'letterSpacing',
    ),
    '--weave-form-error-font-size': typographyStyleVariableReference(base?.errorTypo, 'fontSize'),
    '--weave-form-error-font-weight': typographyStyleVariableReference(
      base?.errorTypo,
      'fontWeight',
    ),
    '--weave-form-error-line-height': typographyStyleVariableReference(
      base?.errorTypo,
      'lineHeight',
    ),
    '--weave-form-error-letter-spacing': typographyStyleVariableReference(
      base?.errorTypo,
      'letterSpacing',
    ),
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
