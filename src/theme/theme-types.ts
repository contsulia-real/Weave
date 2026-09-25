export type ThemeMode = 'light' | 'dark' | 'system'

export type ThemeTokenScalar = string | number
export type ThemeTokenGroup =
  | Readonly<Record<string, ThemeTokenScalar>>
  | Readonly<Record<string, Readonly<Record<string, ThemeTokenScalar>>>>

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

export interface ThemeDefinition {
  tokens?: ThemeTokens
  components?: Readonly<Record<string, unknown>>
  breakpoints?: Readonly<Record<string, number>>
  layers?: Readonly<Record<string, number>>
  modes?: Partial<Record<'light' | 'dark', ThemeOverride>>
}

export interface ThemeOverride {
  tokens?: ThemeTokens
  components?: Readonly<Record<string, unknown>>
  breakpoints?: Readonly<Record<string, number>>
  layers?: Readonly<Record<string, number>>
}

export interface ResolvedTheme extends ThemeOverride {
  tokens: ThemeTokens
  components: Readonly<Record<string, unknown>>
  breakpoints: Readonly<Record<string, number>>
  layers: Readonly<Record<string, number>>
}

export type ThemeInput = ThemeDefinition
