import type { ButtonVariant } from '../../../core/button-types'
import { color, length, radius, shadow } from '../../../core/values'
import { typographyStyleVariableReference } from '../../../theme/theme-css'
import type { ResolvedTheme } from '../../../theme/theme-types'
import type { RuntimeStyleDeclarations, RuntimeStyleValue } from '../runtime-class'

const BUTTON_VARIANTS: readonly ButtonVariant[] = [
  'primary',
  'secondary',
  'tertiary',
  'ghost',
  'danger',
]

export function resolveBadgeTheme(theme: ResolvedTheme): RuntimeStyleDeclarations {
  const base = theme.components.Badge?.base

  return {
    '--weave-badge-theme-background': color(base?.background),
    '--weave-badge-theme-color': color(base?.color),
    '--weave-badge-theme-border-color': color(base?.borderColor),
    '--weave-badge-theme-border-width': length(base?.borderWidth),
    '--weave-badge-theme-radius': radius(base?.radius),
    '--weave-badge-theme-min-height': length(base?.minHeight),
    '--weave-badge-theme-padding-x': length(base?.paddingX),
    '--weave-badge-theme-dot-size': length(base?.dotSize),
    '--weave-badge-theme-shadow': base?.shadow,
    '--weave-badge-theme-font-size': typographyStyleVariableReference(base?.typo, 'fontSize'),
    '--weave-badge-theme-font-weight': typographyStyleVariableReference(base?.typo, 'fontWeight'),
    '--weave-badge-theme-line-height': typographyStyleVariableReference(base?.typo, 'lineHeight'),
    '--weave-badge-theme-letter-spacing': typographyStyleVariableReference(
      base?.typo,
      'letterSpacing',
    ),
  }
}

export function resolveLinkTheme(theme: ResolvedTheme): RuntimeStyleDeclarations {
  const base = theme.components.Link?.base

  return {
    '--weave-link-theme-color': color(base?.color),
    '--weave-link-theme-gap': length(base?.gap),
    '--weave-link-theme-icon-size': length(base?.iconSize),
    '--weave-link-theme-underline-color': color(base?.underlineColor),
    '--weave-link-theme-underline-thickness': length(base?.underlineThickness),
    '--weave-link-theme-underline-offset': length(base?.underlineOffset),
    '--weave-link-theme-focus-outline-width': length(base?.focusOutlineWidth),
    '--weave-link-theme-focus-outline-color': color(base?.focusOutlineColor),
    '--weave-link-theme-focus-outline-style': base?.focusOutlineStyle,
    '--weave-link-theme-focus-outline-offset': length(base?.focusOutlineOffset),
  }
}

export function resolveCardTheme(theme: ResolvedTheme): RuntimeStyleDeclarations {
  const base = theme.components.Card?.base

  return {
    '--weave-card-theme-background': color(base?.background),
    '--weave-card-theme-border-color': color(base?.borderColor),
    '--weave-card-theme-border-width': length(base?.borderWidth),
    '--weave-card-theme-radius': radius(base?.radius),
    '--weave-card-theme-padding': length(base?.padding),
    '--weave-card-theme-shadow': shadow(base?.shadow),
    '--weave-card-theme-selected-background': color(base?.selectedBackground),
    '--weave-card-theme-selected-border-color': color(base?.selectedBorderColor),
    '--weave-card-theme-cursor': base?.cursor,
    '--weave-card-theme-focus-outline-width': length(base?.focusOutlineWidth),
    '--weave-card-theme-focus-outline-color': color(base?.focusOutlineColor),
    '--weave-card-theme-focus-outline-style': base?.focusOutlineStyle,
    '--weave-card-theme-focus-outline-offset': length(base?.focusOutlineOffset),
  }
}

export function resolveButtonTheme(theme: ResolvedTheme): RuntimeStyleDeclarations {
  const component = theme.components.Button
  const base = component?.base
  const disabled = component?.states?.disabled
  const output: Record<string, RuntimeStyleValue> = {
    '--weave-button-theme-radius': radius(base?.radius),
    '--weave-button-theme-border-width': length(base?.borderWidth),
    '--weave-button-theme-cursor': base?.cursor,
    '--weave-button-theme-focus-outline-width': length(base?.focusOutlineWidth),
    '--weave-button-theme-focus-outline-color': color(base?.focusOutlineColor),
    '--weave-button-theme-focus-outline-style': base?.focusOutlineStyle,
    '--weave-button-theme-focus-outline-offset': length(base?.focusOutlineOffset),
    '--weave-button-theme-disabled-opacity': disabled?.opacity,
    '--weave-button-theme-disabled-cursor': disabled?.cursor,
  }

  for (const size of ['small', 'medium', 'large'] as const) {
    const sized = component?.sizes?.[size]
    output[`--weave-button-theme-${size}-min-height`] = length(sized?.minHeight)
    output[`--weave-button-theme-${size}-padding-x`] = length(sized?.paddingX)
    output[`--weave-button-theme-${size}-padding-y`] = length(sized?.paddingY)
    output[`--weave-button-theme-${size}-gap`] = length(sized?.gap)
    output[`--weave-button-theme-${size}-font-size`] = typographyStyleVariableReference(
      sized?.typo,
      'fontSize',
    )
    output[`--weave-button-theme-${size}-font-weight`] = typographyStyleVariableReference(
      sized?.typo,
      'fontWeight',
    )
    output[`--weave-button-theme-${size}-line-height`] = typographyStyleVariableReference(
      sized?.typo,
      'lineHeight',
    )
    output[`--weave-button-theme-${size}-letter-spacing`] = typographyStyleVariableReference(
      sized?.typo,
      'letterSpacing',
    )
  }

  for (const variant of BUTTON_VARIANTS) {
    const value = component?.variants?.[variant]
    output[`--weave-button-theme-${variant}-background`] = color(value?.background)
    output[`--weave-button-theme-${variant}-color`] = color(value?.color)
    output[`--weave-button-theme-${variant}-border-color`] = color(value?.borderColor)
    output[`--weave-button-theme-${variant}-depth-color`] = color(value?.depthColor)
    output[`--weave-button-theme-${variant}-hover-background`] = color(value?.hoverBackground)
    output[`--weave-button-theme-${variant}-active-background`] = color(value?.activeBackground)
  }

  return output
}
