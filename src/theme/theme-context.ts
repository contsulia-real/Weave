import {
  createContext,
  useContext,
} from 'react'
import { defaultTheme } from './default-theme'
import type {
  ResolvedTheme,
  ThemeDefinition,
  ThemeMode,
} from './theme-types'

export interface ThemeContextValue {
  definition: ThemeDefinition
  theme: ResolvedTheme
  mode: Exclude<ThemeMode, 'system'>
  requestedMode: ThemeMode
}

export const ThemeContext = createContext<ThemeContextValue>({
  definition: {},
  theme: defaultTheme,
  mode: 'light',
  requestedMode: 'system',
})

export type UseThemeResult = Pick<ThemeContextValue, 'theme' | 'mode'>

export function useTheme(): UseThemeResult {
  const { theme, mode } = useContext(ThemeContext)
  return { theme, mode }
}
