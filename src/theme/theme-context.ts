import { createContext, useContext, useMemo } from 'react'
import type { ReducedMotionPreference } from '../core/motion-types'
import { defaultTheme } from './default-theme'
import { useResolvedReducedMotion } from './reduced-motion'
import { resolveTheme } from './theme-merge'
import type { ResolvedTheme, ThemeDefinition, ThemeMode } from './theme-types'
import { useDocumentMediaQuery } from './use-media-query'

interface ThemeContextValue {
  provided: boolean
  definition: ThemeDefinition
  theme: ResolvedTheme
  mode: Exclude<ThemeMode, 'system'>
  requestedMode: ThemeMode
  requestedReducedMotion: ReducedMotionPreference
}

export function useResolvedThemeMode(mode: ThemeMode): 'light' | 'dark' {
  const systemMode = useDocumentMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light'
  return mode === 'system' ? systemMode : mode
}

export const ThemeContext = createContext<ThemeContextValue>({
  provided: false,
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
  const context = useContext(ThemeContext)
  const fallbackMode = useResolvedThemeMode(context.requestedMode)
  const mode = context.provided ? context.mode : fallbackMode
  const theme = useMemo(
    () => (context.provided ? context.theme : resolveTheme(context.definition, mode)),
    [context.definition, context.provided, context.theme, mode],
  )
  const reducedMotion = useResolvedReducedMotion(context.requestedReducedMotion)

  return { theme, mode, reducedMotion }
}
