export type ThemeMode = 'light' | 'dark' | 'system'

export type ThemeTokenScalar = string | number
export type ThemeTokenGroup =
  | Readonly<Record<string, ThemeTokenScalar>>
  | Readonly<Record<string, Readonly<Record<string, ThemeTokenScalar>>>>

export type ThemeScaleValue = string | number

export interface ThemeTokens {
  color?: Readonly<Record<string, string>>
  typography?: {
    size?: Readonly<Record<string, number | string>>
    weight?: Readonly<Record<string, number | string>>
  }
  size?: Readonly<Record<string, number | string>>
  spacing?: Readonly<Record<string, number | string>>
  radius?: Readonly<Record<string, number | string>>
  shadow?: Readonly<Record<string, string>>
  motion?: {
    duration?: Readonly<Record<string, number | string>>
    curve?: Readonly<
      Record<string, string | readonly [number, number, number, number]>
    >
  }
}

export interface SwitchThemeBase {
  background?: string
  radius?: ThemeScaleValue
  cursor?: string
  thumbBackground?: string
  thumbRadius?: ThemeScaleValue
  thumbInset?: ThemeScaleValue
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
  trackColor?: string
  radius?: ThemeScaleValue
  opacity?: number
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
