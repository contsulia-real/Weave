import type { ReactNode } from 'react'

export type ThemeScaleValue = string | number
export type ThemeCurveValue =
  | string
  | readonly [number, number, number, number]

export interface ThemeTokens {
  color?: Readonly<Record<string, string>>
  typography?: {
    size?: Readonly<Record<string, ThemeScaleValue>>
    weight?: Readonly<Record<string, number>>
  }
  size?: Readonly<Record<string, ThemeScaleValue>>
  spacing?: Readonly<Record<string, ThemeScaleValue>>
  radius?: Readonly<Record<string, ThemeScaleValue>>
  shadow?: Readonly<Record<string, string>>
  motion?: {
    duration?: Readonly<Record<string, number | string>>
    curve?: Readonly<Record<string, ThemeCurveValue>>
  }
}

export interface ThemeModeDefinition {
  tokens?: ThemeTokens
  components?: Readonly<Record<string, unknown>>
  breakpoints?: Readonly<Record<string, ThemeScaleValue>>
  layers?: Readonly<Record<string, number>>
}

export interface ThemeDefinition extends ThemeModeDefinition {
  modes?: Readonly<Record<string, ThemeModeDefinition>>
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends readonly unknown[]
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K]
}

export type ThemeInput = DeepPartial<ThemeDefinition>

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeProviderProps {
  children?: ReactNode
  theme?: ThemeInput
  mode?: ThemeMode
}
