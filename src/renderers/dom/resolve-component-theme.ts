import type {
  ResolvedTheme,
  ScrollbarTheme,
} from '../../theme/theme-types'
import { typographyStyleVariableReference } from '../../theme/theme-css'
import type {
  ScrollbarConfig,
  ScrollbarSize,
} from '../../core/view-types'
import type { ButtonVariant } from '../../core/button-types'
import type { ProgressMode, ProgressSize } from '../../core/progress-types'
import type { SwitchSize } from '../../core/switch-types'
import type {
  ChoiceControlKind,
  ChoiceControlSize,
} from '../../core/choice-types'
import type { SnackVariant } from '../../core/snack-types'
import {
  color,
  length,
  radius,
} from '../../core/values'
import type {
  RuntimeStyleDeclarations,
  RuntimeStyleValue,
} from './runtime-class'

function shadowToken(
  value: string | undefined,
): string | undefined {
  if (value === undefined) return undefined
  if (value === 'none') return 'none'

  return `var(--weave-shadow-${value})`
}

const BUTTON_VARIANTS: readonly ButtonVariant[] = [
  'primary',
  'secondary',
  'tertiary',
  'ghost',
  'danger',
]

export function resolveInputTheme(
  theme: ResolvedTheme,
): RuntimeStyleDeclarations {
  const component = theme.components.Input
  const base = component?.base
  const disabled = component?.states?.disabled

  return {
    '--weave-input-theme-background': color(base?.background),
    '--weave-input-theme-color': color(base?.color),
    '--weave-input-theme-placeholder-color': color(
      base?.placeholderColor,
    ),
    '--weave-input-theme-border-color': color(base?.borderColor),
    '--weave-input-theme-border-width': length(base?.borderWidth),
    '--weave-input-theme-radius': radius(base?.radius),
    '--weave-input-theme-min-height': length(base?.minHeight),
    '--weave-input-theme-padding-x': length(base?.paddingX),
    '--weave-input-theme-padding-y': length(base?.paddingY),
    '--weave-input-theme-font-size':
      typographyStyleVariableReference(base?.typo, 'fontSize'),
    '--weave-input-theme-font-weight':
      typographyStyleVariableReference(base?.typo, 'fontWeight'),
    '--weave-input-theme-line-height':
      typographyStyleVariableReference(base?.typo, 'lineHeight'),
    '--weave-input-theme-letter-spacing':
      typographyStyleVariableReference(base?.typo, 'letterSpacing'),
    '--weave-input-theme-focus-outline-width': length(
      base?.focusOutlineWidth,
    ),
    '--weave-input-theme-focus-outline-color': color(
      base?.focusOutlineColor,
    ),
    '--weave-input-theme-focus-outline-style':
      base?.focusOutlineStyle,
    '--weave-input-theme-focus-outline-offset': length(
      base?.focusOutlineOffset,
    ),
    '--weave-input-theme-disabled-opacity': disabled?.opacity,
    '--weave-input-theme-disabled-cursor': disabled?.cursor,
  }
}

export function resolveButtonTheme(
  theme: ResolvedTheme,
): RuntimeStyleDeclarations {
  const component = theme.components.Button
  const base = component?.base
  const disabled = component?.states?.disabled
  const output: Record<string, RuntimeStyleValue> = {
    '--weave-button-theme-radius': radius(base?.radius),
    '--weave-button-theme-border-width': length(base?.borderWidth),
    '--weave-button-theme-cursor': base?.cursor,
    '--weave-button-theme-focus-outline-width': length(
      base?.focusOutlineWidth,
    ),
    '--weave-button-theme-focus-outline-color': color(
      base?.focusOutlineColor,
    ),
    '--weave-button-theme-focus-outline-style': base?.focusOutlineStyle,
    '--weave-button-theme-focus-outline-offset': length(
      base?.focusOutlineOffset,
    ),
    '--weave-button-theme-disabled-opacity': disabled?.opacity,
    '--weave-button-theme-disabled-cursor': disabled?.cursor,
  }

  for (const size of ['small', 'medium', 'large'] as const) {
    const sized = component?.sizes?.[size]
    output[`--weave-button-theme-${size}-min-height`] =
      length(sized?.minHeight)
    output[`--weave-button-theme-${size}-padding-x`] =
      length(sized?.paddingX)
    output[`--weave-button-theme-${size}-padding-y`] =
      length(sized?.paddingY)
    output[`--weave-button-theme-${size}-gap`] =
      length(sized?.gap)
    output[`--weave-button-theme-${size}-font-size`] =
      typographyStyleVariableReference(sized?.typo, 'fontSize')
    output[`--weave-button-theme-${size}-font-weight`] =
      typographyStyleVariableReference(sized?.typo, 'fontWeight')
    output[`--weave-button-theme-${size}-line-height`] =
      typographyStyleVariableReference(sized?.typo, 'lineHeight')
    output[`--weave-button-theme-${size}-letter-spacing`] =
      typographyStyleVariableReference(sized?.typo, 'letterSpacing')
  }

  for (const variant of BUTTON_VARIANTS) {
    const value = component?.variants?.[variant]
    output[`--weave-button-theme-${variant}-background`] =
      color(value?.background)
    output[`--weave-button-theme-${variant}-color`] =
      color(value?.color)
    output[`--weave-button-theme-${variant}-border-color`] =
      color(value?.borderColor)
    output[`--weave-button-theme-${variant}-depth-color`] =
      color(value?.depthColor)
    output[`--weave-button-theme-${variant}-hover-background`] =
      color(value?.hoverBackground)
    output[`--weave-button-theme-${variant}-active-background`] =
      color(value?.activeBackground)
  }

  return output
}

export function resolveSwitchTheme(
  theme: ResolvedTheme,
  size: SwitchSize,
): RuntimeStyleDeclarations {
  const component = theme.components.Switch
  const base = component?.base
  const sized = component?.sizes?.[size]
  const checked = component?.states?.checked
  const disabled = component?.states?.disabled

  return {
    '--weave-switch-width': length(sized?.width),
    '--weave-switch-height': length(sized?.height),
    '--weave-switch-thumb-size': length(sized?.thumbSize),
    '--weave-switch-shift': length(sized?.shift),
    '--weave-switch-background': color(base?.background),
    '--weave-switch-radius': radius(base?.radius),
    '--weave-switch-cursor': base?.cursor,
    '--weave-switch-track-shadow': base?.trackShadow,
    '--weave-switch-thumb-background': color(base?.thumbBackground),
    '--weave-switch-thumb-radius': radius(base?.thumbRadius),
    '--weave-switch-thumb-inset': length(base?.thumbInset),
    '--weave-switch-thumb-shadow': base?.thumbShadow,
    '--weave-switch-thumb-hover-shadow': base?.thumbHoverShadow,
    '--weave-switch-thumb-drag-shrink': base?.thumbDragShrink,
    '--weave-switch-thumb-drag-max-width': base?.thumbDragMaxWidth,
    '--weave-switch-focus-outline-width': length(base?.focusOutlineWidth),
    '--weave-switch-focus-outline-color': color(base?.focusOutlineColor),
    '--weave-switch-focus-outline-style': base?.focusOutlineStyle,
    '--weave-switch-focus-outline-offset': length(base?.focusOutlineOffset),
    '--weave-switch-checked-background': color(checked?.background),
    '--weave-switch-disabled-opacity': disabled?.opacity,
    '--weave-switch-disabled-cursor': disabled?.cursor,
  }
}

export function resolveChoiceControlTheme(
  theme: ResolvedTheme,
  kind: ChoiceControlKind,
  size: ChoiceControlSize,
): RuntimeStyleDeclarations {
  const component =
    kind === 'radio'
      ? theme.components.Radio
      : theme.components.Checkbox
  const base = component?.base
  const sized = component?.sizes?.[size]
  const checked = component?.states?.checked
  const disabled = component?.states?.disabled

  return {
    '--weave-choice-size': length(sized?.size),
    '--weave-choice-indicator-size': length(
      sized?.indicatorSize,
    ),
    '--weave-choice-mark-size': length(
      sized?.markSize,
    ),
    '--weave-choice-state-layer-size': length(
      sized?.stateLayerSize,
    ),
    '--weave-choice-background': color(base?.background),
    '--weave-choice-border-color': color(base?.borderColor),
    '--weave-choice-border-width': length(base?.borderWidth),
    '--weave-choice-radius': radius(base?.radius),
    '--weave-choice-cursor': base?.cursor,
    '--weave-choice-shadow': base?.shadow,
    '--weave-choice-hover-shadow': base?.hoverShadow,
    '--weave-choice-press-shadow': base?.pressShadow,
    '--weave-choice-indicator-shadow': base?.indicatorShadow,
    '--weave-choice-state-layer-color': color(
      base?.stateLayerColor,
    ),
    '--weave-choice-state-layer-hover-opacity':
      base?.stateLayerHoverOpacity,
    '--weave-choice-state-layer-focus-opacity':
      base?.stateLayerFocusOpacity,
    '--weave-choice-state-layer-press-opacity':
      base?.stateLayerPressOpacity,
    '--weave-choice-label-gap': length(base?.labelGap),
    '--weave-choice-focus-outline-width': length(
      base?.focusOutlineWidth,
    ),
    '--weave-choice-focus-outline-color': color(
      base?.focusOutlineColor,
    ),
    '--weave-choice-focus-outline-style':
      base?.focusOutlineStyle,
    '--weave-choice-focus-outline-offset': length(
      base?.focusOutlineOffset,
    ),
    '--weave-choice-checked-background': color(
      checked?.background ?? base?.background,
    ),
    '--weave-choice-checked-border-color': color(
      checked?.borderColor ?? base?.borderColor,
    ),
    '--weave-choice-checked-shadow':
      checked?.shadow ?? base?.shadow,
    '--weave-choice-checked-indicator-background': color(
      checked?.indicatorBackground,
    ),
    '--weave-choice-checked-indicator-color': color(
      checked?.indicatorColor,
    ),
    '--weave-choice-checked-state-layer-color': color(
      checked?.stateLayerColor ?? base?.stateLayerColor,
    ),
    '--weave-choice-disabled-opacity': disabled?.opacity,
    '--weave-choice-disabled-cursor': disabled?.cursor,
  }
}

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
    '--weave-progress-width': length(
      spin ? sized?.spinSize : sized?.linearWidth,
    ),
    '--weave-progress-height': length(
      spin ? sized?.spinSize : sized?.linearHeight,
    ),
    '--weave-progress-thickness': length(sized?.spinThickness),
    '--weave-progress-track-color': color(base?.trackColor),
    '--weave-progress-track-shadow': base?.trackShadow,
    '--weave-progress-value-shadow': base?.valueShadow,
    '--weave-progress-linear-radius': radius(base?.linearRadius),
  }
}

function scrollbarTheme(
  theme: ResolvedTheme,
): ScrollbarTheme | undefined {
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


export function resolveToolTipTheme(
  theme: ResolvedTheme,
): RuntimeStyleDeclarations {
  const base =
    theme.components.ToolTip?.base

  return {
    '--weave-tooltip-background':
      color(base?.background),
    '--weave-tooltip-color':
      color(base?.color),
    '--weave-tooltip-border-color':
      color(base?.borderColor),
    '--weave-tooltip-border-width':
      length(base?.borderWidth),
    '--weave-tooltip-radius':
      radius(base?.radius),
    '--weave-tooltip-padding-x':
      length(base?.paddingX),
    '--weave-tooltip-padding-y':
      length(base?.paddingY),
    '--weave-tooltip-max-width':
      length(base?.maxWidth),
    '--weave-tooltip-shadow':
      shadowToken(base?.shadow),
    '--weave-tooltip-arrow-size':
      length(base?.arrowSize),
    '--weave-tooltip-motion-offset':
      length(base?.motionOffset),
  }
}


const SNACK_VARIANTS: readonly SnackVariant[] = [
  'default',
  'success',
  'warning',
  'danger',
  'info',
]

export function resolveSnackTheme(
  theme: ResolvedTheme,
): RuntimeStyleDeclarations {
  const component =
    theme.components.Snack
  const base =
    component?.base
  const output: Record<
    string,
    RuntimeStyleValue
  > = {
    '--weave-snack-background':
      color(base?.background),
    '--weave-snack-color':
      color(base?.color),
    '--weave-snack-border-color':
      color(base?.borderColor),
    '--weave-snack-border-width':
      length(base?.borderWidth),
    '--weave-snack-radius':
      radius(base?.radius),
    '--weave-snack-padding-x':
      length(base?.paddingX),
    '--weave-snack-padding-y':
      length(base?.paddingY),
    '--weave-snack-gap':
      length(base?.gap),
    '--weave-snack-shadow':
      shadowToken(base?.shadow),
    '--weave-snack-icon-size':
      length(base?.iconSize),
    '--weave-snack-progress-height':
      length(base?.progressHeight),
    '--weave-snack-motion-offset':
      length(base?.motionOffset),
  }

  for (const variant of SNACK_VARIANTS) {
    output[
      `--weave-snack-${variant}-accent`
    ] = color(
      component?.variants?.[
        variant
      ]?.accentColor,
    )
  }

  return output
}

export function resolveListTheme(
  theme: ResolvedTheme,
): RuntimeStyleDeclarations {
  const base =
    theme.components.List?.base

  return {
    '--weave-list-background':
      color(base?.background),
    '--weave-list-border-color':
      color(base?.borderColor),
    '--weave-list-border-width':
      length(base?.borderWidth),
    '--weave-list-radius':
      radius(base?.radius),
    '--weave-list-padding':
      length(base?.padding),
    '--weave-list-gap':
      length(base?.gap),
  }
}

export function resolveListItemTheme(
  theme: ResolvedTheme,
): RuntimeStyleDeclarations {
  const base =
    theme.components.ListItem?.base

  return {
    '--weave-list-item-background':
      color(base?.background),
    '--weave-list-item-hover-background':
      color(base?.hoverBackground),
    '--weave-list-item-active-background':
      color(base?.activeBackground),
    '--weave-list-item-selected-background':
      color(base?.selectedBackground),
    '--weave-list-item-selected-hover-background':
      color(base?.selectedHoverBackground),
    '--weave-list-item-color':
      color(base?.color),
    '--weave-list-item-secondary-color':
      color(base?.secondaryColor),
    '--weave-list-item-selected-color':
      color(base?.selectedColor),
    '--weave-list-item-radius':
      radius(base?.radius),
    '--weave-list-item-padding-x':
      length(base?.paddingX),
    '--weave-list-item-padding-y':
      length(base?.paddingY),
    '--weave-list-item-gap':
      length(base?.gap),
    '--weave-list-item-icon-size':
      length(base?.iconSize),
    '--weave-list-item-focus-outline-width':
      length(base?.focusOutlineWidth),
    '--weave-list-item-focus-outline-color':
      color(base?.focusOutlineColor),
    '--weave-list-item-focus-outline-style':
      base?.focusOutlineStyle,
    '--weave-list-item-focus-outline-offset':
      length(base?.focusOutlineOffset),
    '--weave-list-item-disabled-opacity':
      base?.disabledOpacity,
  }
}

