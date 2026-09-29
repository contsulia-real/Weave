import { createContext, useContext } from 'react'
import type { ReducedMotionPreference } from '../core/motion-types'
import { defaultTheme } from './default-theme'
import { useResolvedReducedMotion } from './reduced-motion'
import type { ResolvedTheme, ThemeDefinition, ThemeMode } from './theme-types'

interface ThemeContextValue {
  definition: ThemeDefinition
  theme: ResolvedTheme
  mode: Exclude<ThemeMode, 'system'>
  requestedMode: ThemeMode
  requestedReducedMotion: ReducedMotionPreference
}

export const ThemeContext = createContext<ThemeContextValue>({
  definition: {},
  theme: defaultTheme,
  mode: 'light',
  requestedMode: 'system',
  requestedReducedMotion: 'system',
})

export interface UseThemeResult {
  theme: ResolvedTheme
  mode: Exclude<ThemeMode, 'system'>
  reducedMotion: boolean
}

export function useTheme(): UseThemeResult {
  const { theme, mode, requestedReducedMotion } = useContext(ThemeContext)
  const reducedMotion = useResolvedReducedMotion(requestedReducedMotion)

  return { theme, mode, reducedMotion }
}
