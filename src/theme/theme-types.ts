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
  enterScale?: number
  exitScale?: number
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
  textGap?: ThemeScaleValue
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
  emptyPaddingX?: ThemeScaleValue
  emptyPaddingY?: ThemeScaleValue
}

export interface ComboboxThemeListbox extends SelectThemeListbox {}

export interface ComboboxThemeOption extends SelectThemeOption {}

export interface ComboboxTheme {
  base?: ComboboxThemeBase
  listbox?: ComboboxThemeListbox
  option?: ComboboxThemeOption
}

export interface SliderThemeBase {
  fieldGap?: ThemeScaleValue
  width?: ThemeScaleValue
  trackColor?: string
  trackShadow?: string
  fillColor?: string
  thumbBackground?: string
  thumbBorderColor?: string
  thumbBorderWidth?: ThemeScaleValue
  thumbShadow?: string
  thumbHoverShadow?: string
  thumbPressShadow?: string
  activeTrackShadow?: string
  cursor?: string
  focusOutlineWidth?: ThemeScaleValue
  focusOutlineColor?: string
  focusOutlineStyle?: string
  focusOutlineOffset?: ThemeScaleValue
}

export interface SliderThemeSize {
  trackHeight?: ThemeScaleValue
  thumbSize?: ThemeScaleValue
  thumbTrackGap?: ThemeScaleValue
}

export interface SliderTheme {
  base?: SliderThemeBase
  sizes?: Partial<Record<'small' | 'medium' | 'large', SliderThemeSize>>
  states?: {
    disabled?: {
      opacity?: number
    }
  }
}

export interface SwitchThemeBase {
  fieldGap?: ThemeScaleValue
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
  pressOffset?: ThemeScaleValue
  pressScale?: number
  stateLayerRestScale?: number
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
  motionDistance?: ThemeScaleValue
  motionDiagonal?: ThemeScaleValue
  enterScale?: number
  overshootScale?: number
  exitScale?: number
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
  underlineWidth?: string
  underlineHoverWidth?: string
  underlineActiveWidth?: string
  focusOutlineWidth?: ThemeScaleValue
  focusOutlineColor?: string
  focusOutlineStyle?: string
  focusOutlineOffset?: ThemeScaleValue
}

export interface LinkTheme {
  base?: LinkThemeBase
}

export interface AppBarThemeBase {
  background?: string
  elevatedBackground?: string
  borderColor?: string
  borderWidth?: ThemeScaleValue
  radius?: ThemeScaleValue
  restDepth?: ThemeScaleValue
  depthColor?: string
  floatingMargin?: ThemeScaleValue
}

export interface AppBarThemeSize {
  height?: ThemeScaleValue
  marginX?: ThemeScaleValue
  gap?: ThemeScaleValue
  titleTypo?: TextTypo
}

export interface AppBarTheme {
  base?: AppBarThemeBase
  sizes?: Partial<Record<'small' | 'medium' | 'large', AppBarThemeSize>>
}

export interface CardThemeBase {
  background?: string
  borderColor?: string
  borderWidth?: ThemeScaleValue
  radius?: ThemeScaleValue
  padding?: ThemeScaleValue
  restDepth?: ThemeScaleValue
  hoverDepth?: ThemeScaleValue
  pressDepth?: ThemeScaleValue
  depthColor?: string
  hoverBackground?: string
  activeBackground?: string
  selectedBackground?: string
  selectedBorderColor?: string
  cursor?: string
  focusOutlineWidth?: ThemeScaleValue
  focusOutlineColor?: string
  focusOutlineStyle?: string
  focusOutlineOffset?: ThemeScaleValue
}

export interface CardTheme {
  base?: CardThemeBase
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
  typo?: TextTypo
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
    }
  }
}

export interface AvatarThemeBase {
  defaultSize?: ThemeScaleValue
  background?: string
  color?: string
  borderColor?: string
  borderWidth?: ThemeScaleValue
}

export interface AvatarTheme {
  base?: AvatarThemeBase
}

export interface DividerThemeBase {
  thickness?: number
}

export interface DividerTheme {
  base?: DividerThemeBase
}

export interface IconThemeSize {
  size?: ThemeScaleValue
}

export interface IconTheme {
  sizes?: Partial<Record<'small' | 'medium' | 'large' | 'xlarge', IconThemeSize>>
}

export interface SkeletonThemeBase {
  background?: string
  highlight?: string
  radius?: ThemeScaleValue
  textRadius?: ThemeScaleValue
  shimmerDuration?: number
}

export interface SkeletonTheme {
  base?: SkeletonThemeBase
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
  enterScale?: number
  exitScale?: number
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
  enterScale?: number
  exitScale?: number
}

export interface DialogTheme {
  base?: DialogThemeBase
}

export interface DrawerThemeBase {
  background?: string
  color?: string
  borderColor?: string
  borderWidth?: ThemeScaleValue
  radius?: ThemeScaleValue
  paddingX?: ThemeScaleValue
  paddingY?: ThemeScaleValue
  maxWidth?: ThemeScaleValue
  shadow?: string
  backdropColor?: string
}

export interface DrawerTheme {
  base?: DrawerThemeBase
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
  enterScale?: number
  exitScale?: number
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
  enterScale?: number
  exitScale?: number
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
  textGap?: ThemeScaleValue
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

export interface SplitBoxThemeBase {
  thickness?: ThemeScaleValue
  hitSize?: ThemeScaleValue
  color?: string
  hoverColor?: string
  activeColor?: string
  focusOutlineWidth?: ThemeScaleValue
  focusOutlineColor?: string
  focusOutlineStyle?: string
  focusOutlineOffset?: ThemeScaleValue
}

export interface SplitBoxTheme {
  base?: SplitBoxThemeBase
}

export interface FormThemeBase {
  formGap?: ThemeScaleValue
  fieldGap?: ThemeScaleValue
  fieldsetGap?: ThemeScaleValue
  labelColor?: string
  labelTypo?: TextTypo
  descriptionColor?: string
  descriptionTypo?: TextTypo
  errorColor?: string
  errorTypo?: TextTypo
  legendColor?: string
  legendTypo?: TextTypo
}

export interface FormTheme {
  base?: FormThemeBase
}

export interface AccordionThemeBase {
  dividerColor?: string
  triggerBackground?: string
  triggerHoverBackground?: string
  triggerOpenBackground?: string
  triggerPressedBackground?: string
  triggerColor?: string
  triggerPaddingX?: ThemeScaleValue
  triggerPaddingY?: ThemeScaleValue
  panelPaddingX?: ThemeScaleValue
  panelPaddingY?: ThemeScaleValue
  radius?: ThemeScaleValue
  typo?: TextTypo
  disabledOpacity?: number
  focusOutlineWidth?: ThemeScaleValue
  focusOutlineColor?: string
  focusOutlineStyle?: string
  focusOutlineOffset?: ThemeScaleValue
  indicatorSize?: ThemeScaleValue
}

export interface AccordionTheme {
  base?: AccordionThemeBase
}

export interface TabsThemeBase {
  gap?: ThemeScaleValue
  listGap?: ThemeScaleValue
  tabBackground?: string
  tabHoverBackground?: string
  tabColor?: string
  tabSelectedColor?: string
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

export interface TableThemeBase {
  background?: string
  borderColor?: string
  borderWidth?: ThemeScaleValue
  radius?: ThemeScaleValue
  restDepth?: ThemeScaleValue
  depthColor?: string
  headerBackground?: string
  rowHoverBackground?: string
  rowSelectedBackground?: string
  cellSelectedBackground?: string
  dividerColor?: string
  dividerWidth?: ThemeScaleValue
  color?: string
  headerColor?: string
  headerTypo?: TextTypo
  cellTypo?: TextTypo
}

export interface TableThemeDensity {
  paddingX?: ThemeScaleValue
  paddingY?: ThemeScaleValue
}

export interface TableTheme {
  base?: TableThemeBase
  densities?: Partial<Record<'normal' | 'dense', TableThemeDensity>>
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
  textGap?: ThemeScaleValue
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
  SplitBox?: SplitBoxTheme
  Form?: FormTheme
  Accordion?: AccordionTheme
  AppBar?: AppBarTheme
  Badge?: BadgeTheme
  Link?: LinkTheme
  Button?: ButtonTheme
  Card?: CardTheme
  Input?: InputTheme
  Select?: SelectTheme
  Combobox?: ComboboxTheme
  Slider?: SliderTheme
  Switch?: SwitchTheme
  Radio?: ChoiceControlTheme
  Checkbox?: ChoiceControlTheme
  Avatar?: AvatarTheme
  Divider?: DividerTheme
  Icon?: IconTheme
  Skeleton?: SkeletonTheme
  Progress?: ProgressTheme
  Scrollbar?: ScrollbarTheme
  ToolTip?: ToolTipTheme
  Dialog?: DialogTheme
  Drawer?: DrawerTheme
  Popover?: PopoverTheme
  Menu?: MenuTheme
  Snack?: SnackTheme
  Tabs?: TabsTheme
  Table?: TableTheme
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
