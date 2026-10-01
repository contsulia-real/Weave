import type { ThemeDefinition } from './theme-types'

function mix(seed: string, seedPercent: number, other: string): string {
  return `color-mix(in srgb, ${seed} ${seedPercent}%, ${other})`
}

export function createThemeFromColorSeed(seed: string): ThemeDefinition {
  const colorSeed = seed.trim()

  if (colorSeed.length === 0) {
    throw new TypeError('createThemeFromColorSeed(seed) requires a non-empty CSS color')
  }

  return {
    tokens: {
      color: {
        primary: colorSeed,
        onPrimary: '#ffffff',
        primaryHover: mix(colorSeed, 88, 'black'),
        primaryActive: mix(colorSeed, 78, 'black'),
        secondary: mix(colorSeed, 24, '#756f69'),
        tertiary: mix(colorSeed, 18, '#3f3a36'),
        disabled: mix(colorSeed, 8, '#aaa39d'),
        surface: mix(colorSeed, 3, 'white'),
        surfaceHover: mix(colorSeed, 8, 'white'),
        success: '#20a464',
        warning: '#d78b00',
        danger: '#d94040',
        outline: mix(colorSeed, 12, '#d8cec4'),
        focus: colorSeed,
      },
    },
    modes: {
      dark: {
        tokens: {
          color: {
            primary: mix(colorSeed, 72, 'white'),
            onPrimary: mix(colorSeed, 12, '#121016'),
            primaryHover: mix(colorSeed, 80, 'white'),
            primaryActive: mix(colorSeed, 62, 'white'),
            secondary: mix(colorSeed, 18, '#aaa3b5'),
            tertiary: mix(colorSeed, 10, '#e9e5ef'),
            disabled: mix(colorSeed, 8, '#716b78'),
            surface: mix(colorSeed, 6, '#18161b'),
            surfaceHover: mix(colorSeed, 12, '#242129'),
            success: '#55d792',
            warning: '#f4b44c',
            danger: '#ff7272',
            outline: mix(colorSeed, 16, '#5b5262'),
            focus: mix(colorSeed, 80, 'white'),
          },
        },
      },
    },
  }
}
