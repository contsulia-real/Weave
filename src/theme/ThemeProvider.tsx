import {
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ThemeContext } from './theme-context'
import {
  mergeThemeDefinitions,
  resolveTheme,
} from './theme-merge'
import { themeVariables } from './theme-css'
import type {
  ThemeDefinition,
  ThemeMode,
} from './theme-types'

function getSystemMode(): 'light' | 'dark' {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function useResolvedMode(mode: ThemeMode): 'light' | 'dark' {
  const [systemMode, setSystemMode] = useState(getSystemMode)

  useEffect(() => {
    if (
      mode !== 'system' ||
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

export interface ThemeProviderProps {
  theme?: ThemeDefinition
  mode?: ThemeMode
  children?: ReactNode
}

export function ThemeProvider({
  theme = {},
  mode,
  children,
}: ThemeProviderProps) {
  const parent = useContext(ThemeContext)
  const requestedMode = mode ?? parent.requestedMode
  const activeMode = useResolvedMode(requestedMode)

  const definition = useMemo(
    () => mergeThemeDefinitions(parent.definition, theme),
    [parent.definition, theme],
  )

  const resolvedTheme = useMemo(
    () => resolveTheme(definition, activeMode),
    [activeMode, definition],
  )

  const contextValue = useMemo(
    () => ({
      definition,
      theme: resolvedTheme,
      mode: activeMode,
      requestedMode,
    }),
    [activeMode, definition, requestedMode, resolvedTheme],
  )

  const variables = useMemo(
    () => ({
      display: 'contents',
      'font-family': 'var(--weave-typography-family-body)',
      'font-size': 'var(--weave-typography-style-body-medium-font-size)',
      'font-weight': 'var(--weave-typography-style-body-medium-font-weight)',
      'line-height': 'var(--weave-typography-style-body-medium-line-height)',
      'letter-spacing':
        'var(--weave-typography-style-body-medium-letter-spacing)',
      ...themeVariables(resolvedTheme),
    }),
    [resolvedTheme],
  )

  const className = useRuntimeStyleClass('theme', variables)

  return (
    <ThemeContext.Provider value={contextValue}>
      <span
        data-weave-theme=""
        data-weave-theme-mode={activeMode}
        className={['weave-theme', className].filter(Boolean).join(' ')}
      >
        {children}
      </span>
    </ThemeContext.Provider>
  )
}
