import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReducedMotionPreference } from '../core/motion-types'
import { defaultTheme } from './default-theme'
import { useResolvedReducedMotion } from './reduced-motion'
import { resolveTheme } from './theme-merge'
import type { ResolvedTheme, ThemeDefinition, ThemeMode } from './theme-types'

interface ThemeContextValue {
  provided: boolean
  definition: ThemeDefinition
  theme: ResolvedTheme
  mode: Exclude<ThemeMode, 'system'>
  requestedMode: ThemeMode
  requestedReducedMotion: ReducedMotionPreference
}

function getSystemMode(): 'light' | 'dark' {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useResolvedThemeMode(mode: ThemeMode): 'light' | 'dark' {
  const [systemMode, setSystemMode] = useState(getSystemMode)

  useEffect(() => {
    if (
      mode !== 'system' ||
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setSystemMode(media.matches ? 'dark' : 'light')

    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [mode])

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
