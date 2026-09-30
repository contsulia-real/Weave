import type { MotionSpring, ViewAnimationConfig } from '../core/motion-types'
import type { TextTypo } from '../core/text-types'

export type ThemeMode = 'light' | 'dark' | 'system'

export type ThemeTokenScalar = string | number
export type ThemeTokenGroup =
  | Readonly<Record<string, ThemeTokenScalar>>
  | Readonly<Record<string, Readonly<Record<string, ThemeTokenScalar>>>>

export type ThemeScaleValue = string | number

export interface ThemeFeedbackTokens {
  restDepth?: ThemeScaleValue
  hoverDepth?: ThemeScaleValue
  hoverLift?: ThemeScaleValue
  pressDepth?: ThemeScaleValue
  pressOffset?: ThemeScaleValue
  hoverScale?: number
  pressScale?: number
  dragScale?: number
}

export interface ThemeTypographyStyle {
  fontSize?: ThemeScaleValue
  fontWeight?: number | string
  lineHeight?: number | string
  letterSpacing?: ThemeScaleValue
}

export interface ThemeTypographyTokens {
  family?: Readonly<Record<string, string>>
  size?: Readonly<Record<string, number | string>>
  weight?: Readonly<Record<string, number | string>>
  lineHeight?: Readonly<Record<string, number | string>>
  letterSpacing?: Readonly<Record<string, number | string>>
  styles?: Readonly<Record<string, ThemeTypographyStyle>>
}

export interface ThemeTokens {
  color?: Readonly<Record<string, string>>
  typography?: ThemeTypographyTokens
  size?: Readonly<Record<string, number | string>>
  spacing?: Readonly<Record<string, number | string>>
  radius?: Readonly<Record<string, number | string>>
  shadow?: Readonly<Record<string, string>>
  feedback?: ThemeFeedbackTokens
  motion?: {
    duration?: Readonly<Record<string, number | string>>
    curve?: Readonly<Record<string, string | readonly [number, number, number, number]>>
    spring?: Readonly<Record<string, MotionSpring>>
    animation?: Readonly<Record<string, ViewAnimationConfig>>
  }
}

export interface InputThemeBase {
  background?: string
  shadow?: string
  color?: string
  placeholderColor?: string
  borderColor?: string
  borderWidth?: ThemeScaleValue
  radius?: ThemeScaleValue
  minHeight?: ThemeScaleValue
  minWidth?: ThemeScaleValue
  paddingX?: ThemeScaleValue
  paddingY?: ThemeScaleValue
  typo?: TextTypo
  focusOutlineWidth?: ThemeScaleValue
  focusOutlineColor?: string
  focusOutlineStyle?: string
  focusOutlineOffset?: ThemeScaleValue
}

export interface InputTheme {
  base?: InputThemeBase
  states?: {
    disabled?: {
      opacity?: number
      cursor?: string
    }
  }
}

export interface SelectThemeBase {
  gap?: ThemeScaleValue
  iconSize?: ThemeScaleValue
}

export interface SelectThemeListbox {
  background?: string
  color?: string
  borderColor?: string
  borderWidth?: ThemeScaleValue
  radius?: ThemeScaleValue
  padding?: ThemeScaleValue
  gap?: ThemeScaleValue
  minWidth?: ThemeScaleValue
  maxWidth?: ThemeScaleValue
  maxHeight?: ThemeScaleValue
  shadow?: string
  motionOffset?: ThemeScaleValue
}

export interface SelectThemeOption {
  background?: string
  activeBackground?: string
  selectedBackground?: string
  color?: string
  selectedColor?: string
  secondaryColor?: string
  radius?: ThemeScaleValue
  paddingX?: ThemeScaleValue
  paddingY?: ThemeScaleValue
  gap?: ThemeScaleValue
  iconSize?: ThemeScaleValue
  checkSize?: ThemeScaleValue
  primaryTypo?: TextTypo
  secondaryTypo?: TextTypo
  disabledOpacity?: number
}

export interface SelectTheme {
  base?: SelectThemeBase
  listbox?: SelectThemeListbox
  option?: SelectThemeOption
}

export interface ComboboxThemeBase {
  iconSize?: ThemeScaleValue
  actionSize?: ThemeScaleValue
  actionGap?: ThemeScaleValue
  actionInset?: ThemeScaleValue
}

export interface ComboboxThemeListbox extends SelectThemeListbox {}

export interface ComboboxThemeOption extends SelectThemeOption {}

export interface ComboboxTheme {
  base?: ComboboxThemeBase
  listbox?: ComboboxThemeListbox
  option?: ComboboxThemeOption
}

export interface SwitchThemeBase {
  background?: string
  radius?: ThemeScaleValue
  cursor?: string
  trackShadow?: string
  thumbBackground?: string
  thumbRadius?: ThemeScaleValue
  thumbInset?: ThemeScaleValue
  thumbShadow?: string
  thumbHoverShadow?: string
  thumbDragShrink?: number
  thumbDragMaxWidth?: number
  focusOutlineWidth?: ThemeScaleValue
  focusOutlineColor?: string
  focusOutlineStyle?: string
  focusOutlineOffset?: ThemeScaleValue
}

export interface SwitchThemeSize {
  width?: ThemeScaleValue
  height?: ThemeScaleValue
  thumbSize?: ThemeScaleValue
  shift?: ThemeScaleValue
}

export interface SwitchTheme {
  base?: SwitchThemeBase
  sizes?: Partial<Record<'small' | 'medium' | 'large', SwitchThemeSize>>
  states?: {
    checked?: {
      background?: string
    }
    disabled?: {
      opacity?: number
      cursor?: string
    }
  }
}

export interface ChoiceControlThemeBase {
  background?: string
  borderColor?: string
  borderWidth?: ThemeScaleValue
  radius?: ThemeScaleValue
  cursor?: string
  shadow?: string
  hoverShadow?: string
  pressShadow?: string
  indicatorShadow?: string
  stateLayerColor?: string
  stateLayerHoverOpacity?: number
  stateLayerFocusOpacity?: number
  stateLayerPressOpacity?: number
  focusOutlineWidth?: ThemeScaleValue
  focusOutlineColor?: string
  focusOutlineStyle?: string
  focusOutlineOffset?: ThemeScaleValue
}

export interface ChoiceControlThemeSize {
  size?: ThemeScaleValue
  indicatorSize?: ThemeScaleValue
  markSize?: ThemeScaleValue
  stateLayerSize?: ThemeScaleValue
}

export interface ChoiceControlTheme {
  base?: ChoiceControlThemeBase
  sizes?: Partial<Record<'small' | 'medium' | 'large', ChoiceControlThemeSize>>
  states?: {
    checked?: {
      background?: string
      borderColor?: string
      shadow?: string
      indicatorBackground?: string
      indicatorColor?: string
      stateLayerColor?: string
    }
    disabled?: {
      opacity?: number
      cursor?: string
    }
  }
}

export interface BadgeThemeBase {
  background?: string
  color?: string
  borderColor?: string
  borderWidth?: ThemeScaleValue
  radius?: ThemeScaleValue
  minHeight?: ThemeScaleValue
  paddingX?: ThemeScaleValue
  dotSize?: ThemeScaleValue
  shadow?: string
  typo?: TextTypo
}

export interface BadgeTheme {
  base?: BadgeThemeBase
}

export interface LinkThemeBase {
  color?: string
  gap?: ThemeScaleValue
  iconSize?: ThemeScaleValue
  underlineColor?: string
  underlineThickness?: ThemeScaleValue
  underlineOffset?: ThemeScaleValue
  focusOutlineWidth?: ThemeScaleValue
  focusOutlineColor?: string
  focusOutlineStyle?: string
  focusOutlineOffset?: ThemeScaleValue
}

export interface LinkTheme {
  base?: LinkThemeBase
}

export interface ButtonThemeBase {
  radius?: ThemeScaleValue
  borderWidth?: ThemeScaleValue
  cursor?: string
  focusOutlineWidth?: ThemeScaleValue
  focusOutlineColor?: string
  focusOutlineStyle?: string
  focusOutlineOffset?: ThemeScaleValue
}

export interface ButtonThemeSize {
  minHeight?: ThemeScaleValue
  paddingX?: ThemeScaleValue
  paddingY?: ThemeScaleValue
  gap?: ThemeScaleValue
  typo?: string
}

export interface ButtonThemeVariant {
  background?: string
  color?: string
  borderColor?: string
  depthColor?: string
  hoverBackground?: string
  activeBackground?: string
}

export interface ButtonTheme {
  base?: ButtonThemeBase
  sizes?: Partial<Record<'small' | 'medium' | 'large', ButtonThemeSize>>
  variants?: Partial<
    Record<'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger', ButtonThemeVariant>
  >
  states?: {
    disabled?: {
      opacity?: number
      cursor?: string
    }
  }
}

export interface ProgressThemeBase {
  trackColor?: string
  trackShadow?: string
  valueShadow?: string
  linearRadius?: ThemeScaleValue
}

export interface ProgressThemeSize {
  spinSize?: ThemeScaleValue
  spinThickness?: ThemeScaleValue
  linearWidth?: ThemeScaleValue
  linearHeight?: ThemeScaleValue
}

export interface ProgressTheme {
  base?: ProgressThemeBase
  sizes?: Partial<Record<'small' | 'medium' | 'large', ProgressThemeSize>>
}

export interface ScrollbarThemeBase {
  color?: string
  hoverColor?: string
  dragColor?: string
  radius?: ThemeScaleValue
  opacity?: number
  hitSize?: ThemeScaleValue
  hoverScale?: number
  thumbCursor?: string
}

export interface ScrollbarThemeSize {
  thickness?: ThemeScaleValue
}

export interface ScrollbarTheme {
  base?: ScrollbarThemeBase
  sizes?: Partial<Record<'small' | 'medium' | 'large', ScrollbarThemeSize>>
}

export interface ToolTipThemeBase {
  background?: string
  color?: string
  borderColor?: string
  borderWidth?: ThemeScaleValue
  radius?: ThemeScaleValue
  paddingX?: ThemeScaleValue
  paddingY?: ThemeScaleValue
  maxWidth?: ThemeScaleValue
  shadow?: string
  arrowSize?: ThemeScaleValue
  motionOffset?: ThemeScaleValue
  typo?: TextTypo
}

export interface ToolTipTheme {
  base?: ToolTipThemeBase
}

export interface DialogThemeBase {
  background?: string
  color?: string
  borderColor?: string
  borderWidth?: ThemeScaleValue
  radius?: ThemeScaleValue
  paddingX?: ThemeScaleValue
  paddingY?: ThemeScaleValue
  width?: ThemeScaleValue
  maxWidth?: ThemeScaleValue
  maxHeight?: ThemeScaleValue
  shadow?: string
  depthColor?: string
  backdropColor?: string
  motionOffset?: ThemeScaleValue
}

export interface DialogTheme {
  base?: DialogThemeBase
}

export interface PopoverThemeBase {
  background?: string
  color?: string
  borderColor?: string
  borderWidth?: ThemeScaleValue
  radius?: ThemeScaleValue
  paddingX?: ThemeScaleValue
  paddingY?: ThemeScaleValue
  minWidth?: ThemeScaleValue
  maxWidth?: ThemeScaleValue
  shadow?: string
  motionOffset?: ThemeScaleValue
}

export interface PopoverTheme {
  base?: PopoverThemeBase
}

export interface MenuThemeBase {
  background?: string
  color?: string
  borderColor?: string
  borderWidth?: ThemeScaleValue
  radius?: ThemeScaleValue
  padding?: ThemeScaleValue
  gap?: ThemeScaleValue
  minWidth?: ThemeScaleValue
  maxWidth?: ThemeScaleValue
  shadow?: string
  motionOffset?: ThemeScaleValue
}

export interface MenuThemeItem {
  background?: string
  hoverBackground?: string
  activeBackground?: string
  color?: string
  secondaryColor?: string
  dangerColor?: string
  dangerBackground?: string
  radius?: ThemeScaleValue
  paddingX?: ThemeScaleValue
  paddingY?: ThemeScaleValue
  gap?: ThemeScaleValue
  iconSize?: ThemeScaleValue
  submenuIconSize?: ThemeScaleValue
  primaryTypo?: TextTypo
  secondaryTypo?: TextTypo
  focusOutlineWidth?: ThemeScaleValue
  focusOutlineColor?: string
  focusOutlineStyle?: string
  focusOutlineOffset?: ThemeScaleValue
  disabledOpacity?: number
}

export interface MenuTheme {
  base?: MenuThemeBase
  item?: MenuThemeItem
}

export interface SnackThemeBase {
  background?: string
  color?: string
  borderColor?: string
  borderWidth?: ThemeScaleValue
  radius?: ThemeScaleValue
  paddingX?: ThemeScaleValue
  paddingY?: ThemeScaleValue
  gap?: ThemeScaleValue
  shadow?: string
  iconSize?: ThemeScaleValue
  progressHeight?: ThemeScaleValue
  typo?: TextTypo
  motionOffset?: ThemeScaleValue
}

export interface SnackThemeVariant {
  accentColor?: string
}

export interface SnackTheme {
  base?: SnackThemeBase
  variants?: Partial<
    Record<'default' | 'success' | 'warning' | 'danger' | 'info', SnackThemeVariant>
  >
}

export interface TabsThemeBase {
  gap?: ThemeScaleValue
  listGap?: ThemeScaleValue
  tabBackground?: string
  tabHoverBackground?: string
  tabColor?: string
  tabSelectedColor?: string
  pillListBackground?: string
  pillListShadow?: string
  pillListPadding?: ThemeScaleValue
  pillSelectedBackground?: string
  pillSelectedShadow?: string
  tabRadius?: ThemeScaleValue
  tabPaddingX?: ThemeScaleValue
  tabPaddingY?: ThemeScaleValue
  indicatorColor?: string
  indicatorThickness?: number
  typo?: TextTypo
  focusOutlineWidth?: ThemeScaleValue
  focusOutlineColor?: string
  focusOutlineStyle?: string
  focusOutlineOffset?: ThemeScaleValue
  disabledOpacity?: number
}

export interface TabsTheme {
  base?: TabsThemeBase
}

export interface ListThemeBase {
  background?: string
  borderColor?: string
  borderWidth?: ThemeScaleValue
  radius?: ThemeScaleValue
  padding?: ThemeScaleValue
  gap?: ThemeScaleValue
}

export interface ListTheme {
  base?: ListThemeBase
}

export interface ListItemThemeBase {
  background?: string
  hoverBackground?: string
  activeBackground?: string
  selectedBackground?: string
  selectedHoverBackground?: string
  color?: string
  secondaryColor?: string
  selectedColor?: string
  radius?: ThemeScaleValue
  paddingX?: ThemeScaleValue
  paddingY?: ThemeScaleValue
  gap?: ThemeScaleValue
  iconSize?: ThemeScaleValue
  primaryTypo?: TextTypo
  secondaryTypo?: TextTypo
  focusOutlineWidth?: ThemeScaleValue
  focusOutlineColor?: string
  focusOutlineStyle?: string
  focusOutlineOffset?: ThemeScaleValue
  disabledOpacity?: number
}

export interface ListItemTheme {
  base?: ListItemThemeBase
}

export interface ThemeComponents {
  Badge?: BadgeTheme
  Link?: LinkTheme
  Button?: ButtonTheme
  Input?: InputTheme
  Select?: SelectTheme
  Combobox?: ComboboxTheme
  Switch?: SwitchTheme
  Radio?: ChoiceControlTheme
  Checkbox?: ChoiceControlTheme
  Progress?: ProgressTheme
  Scrollbar?: ScrollbarTheme
  ToolTip?: ToolTipTheme
  Dialog?: DialogTheme
  Popover?: PopoverTheme
  Menu?: MenuTheme
  Snack?: SnackTheme
  Tabs?: TabsTheme
  List?: ListTheme
  ListItem?: ListItemTheme
  readonly [name: string]: unknown
}

export interface ThemeDefinition {
  tokens?: ThemeTokens
  components?: ThemeComponents
  breakpoints?: Readonly<Record<string, number>>
  layers?: Readonly<Record<string, number>>
  modes?: Partial<Record<'light' | 'dark', ThemeOverride>>
}

export interface ThemeOverride {
  tokens?: ThemeTokens
  components?: ThemeComponents
  breakpoints?: Readonly<Record<string, number>>
  layers?: Readonly<Record<string, number>>
}

export interface ResolvedTheme extends ThemeOverride {
  tokens: ThemeTokens
  components: ThemeComponents
  breakpoints: Readonly<Record<string, number>>
  layers: Readonly<Record<string, number>>
}

export type ThemeInput = ThemeDefinition
