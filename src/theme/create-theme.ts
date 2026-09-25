import type { ThemeDefinition } from './theme-types'

export function createTheme<const T extends ThemeDefinition>(theme: T): T {
  return theme
}
