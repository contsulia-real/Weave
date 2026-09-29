import type {
  ResolvedTheme,
} from '../../../theme/theme-types'
import { typographyStyleVariableReference } from '../../../theme/theme-css'
import type { SwitchSize } from '../../../core/switch-types'
import type {
  ChoiceControlKind,
  ChoiceControlSize,
} from '../../../core/choice-types'
import {
  color,
  length,
  radius,
} from '../../../core/values'
import { shadowToken } from './shared'
import type { RuntimeStyleDeclarations } from '../runtime-class'

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

export function resolveSelectTheme(
  theme: ResolvedTheme,
): RuntimeStyleDeclarations {
  const component = theme.components.Select
  const base = component?.base
  const listbox = component?.listbox
  const option = component?.option

  return {
    '--weave-select-background': color(base?.background),
    '--weave-select-color': color(base?.color),
    '--weave-select-placeholder-color': color(base?.placeholderColor),
    '--weave-select-border-color': color(base?.borderColor),
    '--weave-select-border-width': length(base?.borderWidth),
    '--weave-select-radius': radius(base?.radius),
    '--weave-select-min-height': length(base?.minHeight),
    '--weave-select-min-width': length(base?.minWidth),
    '--weave-select-padding-x': length(base?.paddingX),
    '--weave-select-gap': length(base?.gap),
    '--weave-select-icon-size': length(base?.iconSize),
    '--weave-select-font-size':
      typographyStyleVariableReference(base?.typo, 'fontSize'),
    '--weave-select-font-weight':
      typographyStyleVariableReference(base?.typo, 'fontWeight'),
    '--weave-select-line-height':
      typographyStyleVariableReference(base?.typo, 'lineHeight'),
    '--weave-select-letter-spacing':
      typographyStyleVariableReference(base?.typo, 'letterSpacing'),
    '--weave-select-focus-outline-width': length(
      base?.focusOutlineWidth,
    ),
    '--weave-select-focus-outline-color': color(
      base?.focusOutlineColor,
    ),
    '--weave-select-focus-outline-style':
      base?.focusOutlineStyle,
    '--weave-select-focus-outline-offset': length(
      base?.focusOutlineOffset,
    ),
    '--weave-select-disabled-opacity':
      base?.disabledOpacity,
    '--weave-select-disabled-cursor':
      base?.disabledCursor,

    '--weave-select-listbox-background': color(listbox?.background),
    '--weave-select-listbox-color': color(listbox?.color),
    '--weave-select-listbox-border-color': color(listbox?.borderColor),
    '--weave-select-listbox-border-width': length(listbox?.borderWidth),
    '--weave-select-listbox-radius': radius(listbox?.radius),
    '--weave-select-listbox-padding': length(listbox?.padding),
    '--weave-select-listbox-gap': length(listbox?.gap),
    '--weave-select-listbox-min-width': length(listbox?.minWidth),
    '--weave-select-listbox-max-width': length(listbox?.maxWidth),
    '--weave-select-listbox-max-height': length(listbox?.maxHeight),
    '--weave-select-listbox-shadow': shadowToken(listbox?.shadow),
    '--weave-select-listbox-motion-offset': length(
      listbox?.motionOffset,
    ),

    '--weave-select-option-background': color(option?.background),
    '--weave-select-option-active-background': color(
      option?.activeBackground,
    ),
    '--weave-select-option-selected-background': color(
      option?.selectedBackground,
    ),
    '--weave-select-option-color': color(option?.color),
    '--weave-select-option-selected-color': color(
      option?.selectedColor,
    ),
    '--weave-select-option-secondary-color': color(
      option?.secondaryColor,
    ),
    '--weave-select-option-radius': radius(option?.radius),
    '--weave-select-option-padding-x': length(option?.paddingX),
    '--weave-select-option-padding-y': length(option?.paddingY),
    '--weave-select-option-gap': length(option?.gap),
    '--weave-select-option-icon-size': length(option?.iconSize),
    '--weave-select-option-check-size': length(option?.checkSize),
    '--weave-select-option-disabled-opacity':
      option?.disabledOpacity,
  }
}

export function resolveComboboxTheme(
  theme: ResolvedTheme,
): RuntimeStyleDeclarations {
  const component =
    theme.components.Combobox
  const base = component?.base
  const listbox =
    component?.listbox
  const option =
    component?.option

  return {
    '--weave-combobox-background': color(base?.background),
    '--weave-combobox-color': color(base?.color),
    '--weave-combobox-placeholder-color': color(base?.placeholderColor),
    '--weave-combobox-border-color': color(base?.borderColor),
    '--weave-combobox-border-width': length(base?.borderWidth),
    '--weave-combobox-radius': radius(base?.radius),
    '--weave-combobox-min-height': length(base?.minHeight),
    '--weave-combobox-min-width': length(base?.minWidth),
    '--weave-combobox-padding-x': length(base?.paddingX),
    '--weave-combobox-gap': length(base?.gap),
    '--weave-combobox-icon-size': length(base?.iconSize),
    '--weave-combobox-action-size': length(base?.actionSize),
    '--weave-combobox-action-color': color(base?.actionColor),
    '--weave-combobox-action-hover-background': color(
      base?.actionHoverBackground,
    ),
    '--weave-combobox-font-size':
      typographyStyleVariableReference(base?.typo, 'fontSize'),
    '--weave-combobox-font-weight':
      typographyStyleVariableReference(base?.typo, 'fontWeight'),
    '--weave-combobox-line-height':
      typographyStyleVariableReference(base?.typo, 'lineHeight'),
    '--weave-combobox-letter-spacing':
      typographyStyleVariableReference(base?.typo, 'letterSpacing'),
    '--weave-combobox-focus-outline-width': length(
      base?.focusOutlineWidth,
    ),
    '--weave-combobox-focus-outline-color': color(
      base?.focusOutlineColor,
    ),
    '--weave-combobox-focus-outline-style':
      base?.focusOutlineStyle,
    '--weave-combobox-focus-outline-offset': length(
      base?.focusOutlineOffset,
    ),
    '--weave-combobox-disabled-opacity':
      base?.disabledOpacity,
    '--weave-combobox-disabled-cursor':
      base?.disabledCursor,

    '--weave-combobox-listbox-background': color(listbox?.background),
    '--weave-combobox-listbox-color': color(listbox?.color),
    '--weave-combobox-listbox-border-color': color(listbox?.borderColor),
    '--weave-combobox-listbox-border-width': length(listbox?.borderWidth),
    '--weave-combobox-listbox-radius': radius(listbox?.radius),
    '--weave-combobox-listbox-padding': length(listbox?.padding),
    '--weave-combobox-listbox-gap': length(listbox?.gap),
    '--weave-combobox-listbox-min-width': length(listbox?.minWidth),
    '--weave-combobox-listbox-max-width': length(listbox?.maxWidth),
    '--weave-combobox-listbox-max-height': length(listbox?.maxHeight),
    '--weave-combobox-listbox-shadow': shadowToken(listbox?.shadow),
    '--weave-combobox-listbox-motion-offset': length(
      listbox?.motionOffset,
    ),

    '--weave-combobox-option-background': color(option?.background),
    '--weave-combobox-option-active-background': color(
      option?.activeBackground,
    ),
    '--weave-combobox-option-selected-background': color(
      option?.selectedBackground,
    ),
    '--weave-combobox-option-color': color(option?.color),
    '--weave-combobox-option-selected-color': color(
      option?.selectedColor,
    ),
    '--weave-combobox-option-secondary-color': color(
      option?.secondaryColor,
    ),
    '--weave-combobox-option-radius': radius(option?.radius),
    '--weave-combobox-option-padding-x': length(option?.paddingX),
    '--weave-combobox-option-padding-y': length(option?.paddingY),
    '--weave-combobox-option-gap': length(option?.gap),
    '--weave-combobox-option-icon-size': length(option?.iconSize),
    '--weave-combobox-option-check-size': length(option?.checkSize),
    '--weave-combobox-option-disabled-opacity':
      option?.disabledOpacity,
  }
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
