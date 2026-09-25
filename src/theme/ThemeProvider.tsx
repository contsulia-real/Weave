import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ThemeContext, useWeaveTheme } from './theme-context'
import { applyThemeMode, mergeTheme } from './theme-merge'
import { themeVariables } from './theme-vars'
import type { ThemeMode, ThemeProviderProps } from './theme-types'

function getSystemMode(): 'light' | 'dark' {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function useResolvedMode(mode: ThemeMode): 'light' | 'dark' {
  const [systemMode, setSystemMode] = useState(getSystemMode)

  useEffect(() => {
    if (mode !== 'system' || typeof window.matchMedia !== 'function') return

    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setSystemMode(query.matches ? 'dark' : 'light')

    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [mode])

  return mode === 'system' ? systemMode : mode
}

export function ThemeProvider({
  children,
  theme,
  mode,
}: ThemeProviderProps) {
  const parent = useWeaveTheme()
  const requestedMode = mode ?? parent.mode
  const resolvedMode = useResolvedMode(requestedMode)

  const value = useMemo(() => {
    const mergedTheme = mergeTheme(parent.theme, theme)
    const resolvedTheme = applyThemeMode(mergedTheme, resolvedMode)

    return {
      theme: resolvedTheme,
      mode: requestedMode,
      resolvedMode,
      variables: themeVariables(resolvedTheme),
    }
  }, [parent.theme, requestedMode, resolvedMode, theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
