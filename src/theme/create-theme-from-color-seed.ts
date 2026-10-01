import { defaultDarkTheme, defaultTheme } from './default-theme'
import type { ThemeDefinition, ThemeTokens } from './theme-types'

type ColorTokens = NonNullable<ThemeTokens['color']>

function defaultLightColors(): ColorTokens {
  const colors = defaultTheme.tokens.color

  if (colors === undefined) {
    throw new Error('Weave default theme is missing color tokens')
  }

  return colors
}

const DEFAULT_SEED = defaultLightColors().primary

function mix(seed: string, seedPercent: number, other: string): string {
  return `color-mix(in srgb, ${seed} ${seedPercent}%, ${other})`
}

function defaultDarkColors(): ColorTokens {
  const colors = defaultDarkTheme.tokens?.color

  if (colors === undefined) {
    throw new Error('Weave default dark theme is missing color tokens')
  }

  return colors
}

function matchesDefaultSeed(seed: string): boolean {
  return seed.toLowerCase() === DEFAULT_SEED.toLowerCase()
}

export function createThemeFromColorSeed(seed: string): ThemeDefinition {
  const colorSeed = seed.trim()

  if (colorSeed.length === 0) {
    throw new TypeError('createThemeFromColorSeed(seed) requires a non-empty CSS color')
  }

  const lightBase = defaultLightColors()
  const darkBase = defaultDarkColors()

  if (matchesDefaultSeed(colorSeed)) {
    return {
      tokens: {
        color: { ...lightBase },
      },
      modes: {
        dark: {
          tokens: {
            color: { ...darkBase },
          },
        },
      },
    }
  }

  return {
    tokens: {
      color: {
        ...lightBase,
        primary: colorSeed,
        onPrimary: lightBase.onPrimary,
        primaryHover: mix(colorSeed, 88, 'black'),
        primaryActive: mix(colorSeed, 76, 'black'),
        focus: colorSeed,
      },
    },
    modes: {
      dark: {
        tokens: {
          color: {
            ...darkBase,
            primary: mix(colorSeed, 64, 'white'),
            onPrimary: mix(colorSeed, 14, '#121016'),
            primaryHover: mix(colorSeed, 72, 'white'),
            primaryActive: mix(colorSeed, 56, 'white'),
            focus: mix(colorSeed, 72, 'white'),
          },
        },
      },
    },
  }
}
