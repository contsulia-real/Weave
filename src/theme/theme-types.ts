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

export interface ThemeTypographyTokens {
  family?: Readonly<Record<string, string>>
  size?: Readonly<Record<string, number | string>>
  weight?: Readonly<Record<string, number | string>>
  lineHeight?: Readonly<Record<string, number | string>>
  letterSpacing?: Readonly<Record<string, number | string>>
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
    curve?: Readonly<
      Record<string, string | readonly [number, number, number, number]>
    >
  }
}

export interface InputThemeBase {
  background?: string
  color?: string
  placeholderColor?: string
  borderColor?: string
  borderWidth?: ThemeScaleValue
  radius?: ThemeScaleValue
  minHeight?: ThemeScaleValue
  paddingX?: ThemeScaleValue
  paddingY?: ThemeScaleValue
  fontSize?: ThemeScaleValue
  lineHeight?: ThemeScaleValue
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

export interface SwitchThemeBase {
  background?: string
  radius?: ThemeScaleValue
  cursor?: string
  trackShadow?: string
  thumbBackground?: string
  thumbRadius?: ThemeScaleValue
  thumbInset?: ThemeScaleValue
  thumbShadow?: string
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
  sizes?: Partial<
    Record<'small' | 'medium' | 'large', SwitchThemeSize>
  >
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

export interface ButtonThemeBase {
  radius?: ThemeScaleValue
  borderWidth?: ThemeScaleValue
  cursor?: string
  fontWeight?: number | string
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
  fontSize?: ThemeScaleValue
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
  sizes?: Partial<
    Record<'small' | 'medium' | 'large', ButtonThemeSize>
  >
  variants?: Partial<
    Record<
      'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger',
      ButtonThemeVariant
    >
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
  sizes?: Partial<
    Record<'small' | 'medium' | 'large', ProgressThemeSize>
  >
}

export interface ScrollbarThemeBase {
  color?: string
  hoverColor?: string
  dragColor?: string
  trackColor?: string
  radius?: ThemeScaleValue
  opacity?: number
  hitSize?: ThemeScaleValue
  thumbCursor?: string
}

export interface ScrollbarThemeSize {
  thickness?: ThemeScaleValue
}

export interface ScrollbarTheme {
  base?: ScrollbarThemeBase
  sizes?: Partial<
    Record<'small' | 'medium' | 'large', ScrollbarThemeSize>
  >
}

export interface ThemeComponents {
  Button?: ButtonTheme
  Input?: InputTheme
  Switch?: SwitchTheme
  Progress?: ProgressTheme
  Scrollbar?: ScrollbarTheme
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
