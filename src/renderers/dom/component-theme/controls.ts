import type { ChoiceControlKind, ChoiceControlSize } from '../../../core/choice-types'
import type { SwitchSize } from '../../../core/switch-types'
import { color, length, radius } from '../../../core/values'
import { typographyStyleVariableReference } from '../../../theme/theme-css'
import type {
  ResolvedTheme,
  SelectThemeListbox,
  SelectThemeOption,
} from '../../../theme/theme-types'
import type { RuntimeStyleDeclarations } from '../runtime-class'
import { shadowToken } from './shared'

function resolveOptionCollectionTheme(
  listbox: SelectThemeListbox | undefined,
  option: SelectThemeOption | undefined,
): RuntimeStyleDeclarations {
  return {
    '--weave-option-listbox-background': color(listbox?.background),
    '--weave-option-listbox-color': color(listbox?.color),
    '--weave-option-listbox-border-color': color(listbox?.borderColor),
    '--weave-option-listbox-border-width': length(listbox?.borderWidth),
    '--weave-option-listbox-radius': radius(listbox?.radius),
    '--weave-option-listbox-padding': length(listbox?.padding),
    '--weave-option-listbox-gap': length(listbox?.gap),
    '--weave-option-listbox-min-width': length(listbox?.minWidth),
    '--weave-option-listbox-max-width': length(listbox?.maxWidth),
    '--weave-option-listbox-max-height': length(listbox?.maxHeight),
    '--weave-option-listbox-shadow': shadowToken(listbox?.shadow),
    '--weave-option-listbox-motion-offset': length(listbox?.motionOffset),

    '--weave-option-background': color(option?.background),
    '--weave-option-active-background': color(option?.activeBackground),
    '--weave-option-selected-background': color(option?.selectedBackground),
    '--weave-option-color': color(option?.color),
    '--weave-option-selected-color': color(option?.selectedColor),
    '--weave-option-secondary-color': color(option?.secondaryColor),
    '--weave-option-radius': radius(option?.radius),
    '--weave-option-padding-x': length(option?.paddingX),
    '--weave-option-padding-y': length(option?.paddingY),
    '--weave-option-gap': length(option?.gap),
    '--weave-option-icon-size': length(option?.iconSize),
    '--weave-option-check-size': length(option?.checkSize),
    '--weave-option-disabled-opacity': option?.disabledOpacity,
  }
}

export function resolveInputTheme(theme: ResolvedTheme): RuntimeStyleDeclarations {
  const component = theme.components.Input
  const base = component?.base
  const disabled = component?.states?.disabled
  const switchBase = theme.components.Switch?.base

  return {
    '--weave-input-background': color(base?.background ?? switchBase?.background),
    '--weave-input-shadow': switchBase?.trackShadow,
    '--weave-input-color': color(base?.color),
    '--weave-input-placeholder-color': color(base?.placeholderColor),
    '--weave-input-border-color': color(base?.borderColor),
    '--weave-input-border-width': length(base?.borderWidth),
    '--weave-input-radius': radius(base?.radius),
    '--weave-input-min-height': length(base?.minHeight),
    '--weave-input-min-width': length(base?.minWidth),
    '--weave-input-padding-x': length(base?.paddingX),
    '--weave-input-padding-y': length(base?.paddingY),
    '--weave-input-font-size': typographyStyleVariableReference(base?.typo, 'fontSize'),
    '--weave-input-font-weight': typographyStyleVariableReference(base?.typo, 'fontWeight'),
    '--weave-input-line-height': typographyStyleVariableReference(base?.typo, 'lineHeight'),
    '--weave-input-letter-spacing': typographyStyleVariableReference(base?.typo, 'letterSpacing'),
    '--weave-input-focus-outline-width': length(base?.focusOutlineWidth),
    '--weave-input-focus-outline-color': color(base?.focusOutlineColor),
    '--weave-input-focus-outline-style': base?.focusOutlineStyle,
    '--weave-input-focus-outline-offset': length(base?.focusOutlineOffset),
    '--weave-input-disabled-opacity': disabled?.opacity,
    '--weave-input-disabled-cursor': disabled?.cursor,
  }
}

export function resolveSelectTheme(theme: ResolvedTheme): RuntimeStyleDeclarations {
  const component = theme.components.Select
  const base = component?.base
  const listbox = component?.listbox
  const option = component?.option

  return {
    '--weave-select-gap': length(base?.gap),
    '--weave-select-icon-size': length(base?.iconSize),

    ...resolveOptionCollectionTheme(listbox, option),
  }
}

export function resolveComboboxTheme(theme: ResolvedTheme): RuntimeStyleDeclarations {
  const component = theme.components.Combobox
  const base = component?.base
  const listbox = component?.listbox
  const option = component?.option

  return {
    '--weave-combobox-icon-size': length(base?.iconSize),
    '--weave-combobox-action-size': length(base?.actionSize),
    '--weave-combobox-action-gap': length(base?.actionGap),
    '--weave-combobox-action-inset': length(base?.actionInset),

    ...resolveOptionCollectionTheme(listbox, option),
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
  const component = kind === 'radio' ? theme.components.Radio : theme.components.Checkbox
  const base = component?.base
  const sized = component?.sizes?.[size]
  const checked = component?.states?.checked
  const disabled = component?.states?.disabled

  return {
    '--weave-choice-size': length(sized?.size),
    '--weave-choice-indicator-size': length(sized?.indicatorSize),
    '--weave-choice-mark-size': length(sized?.markSize),
    '--weave-choice-state-layer-size': length(sized?.stateLayerSize),
    '--weave-choice-background': color(base?.background),
    '--weave-choice-border-color': color(base?.borderColor),
    '--weave-choice-border-width': length(base?.borderWidth),
    '--weave-choice-radius': radius(base?.radius),
    '--weave-choice-cursor': base?.cursor,
    '--weave-choice-shadow': base?.shadow,
    '--weave-choice-hover-shadow': base?.hoverShadow,
    '--weave-choice-press-shadow': base?.pressShadow,
    '--weave-choice-indicator-shadow': base?.indicatorShadow,
    '--weave-choice-state-layer-color': color(base?.stateLayerColor),
    '--weave-choice-state-layer-hover-opacity': base?.stateLayerHoverOpacity,
    '--weave-choice-state-layer-focus-opacity': base?.stateLayerFocusOpacity,
    '--weave-choice-state-layer-press-opacity': base?.stateLayerPressOpacity,
    '--weave-choice-focus-outline-width': length(base?.focusOutlineWidth),
    '--weave-choice-focus-outline-color': color(base?.focusOutlineColor),
    '--weave-choice-focus-outline-style': base?.focusOutlineStyle,
    '--weave-choice-focus-outline-offset': length(base?.focusOutlineOffset),
    '--weave-choice-checked-background': color(checked?.background ?? base?.background),
    '--weave-choice-checked-border-color': color(checked?.borderColor ?? base?.borderColor),
    '--weave-choice-checked-shadow': checked?.shadow ?? base?.shadow,
    '--weave-choice-checked-indicator-background': color(checked?.indicatorBackground),
    '--weave-choice-checked-indicator-color': color(checked?.indicatorColor),
    '--weave-choice-checked-state-layer-color': color(
      checked?.stateLayerColor ?? base?.stateLayerColor,
    ),
    '--weave-choice-disabled-opacity': disabled?.opacity,
    '--weave-choice-disabled-cursor': disabled?.cursor,
  }
}
