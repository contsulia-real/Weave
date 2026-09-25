import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { defaultTheme } from './default-theme'
import {
  mergeThemeDefinitions,
  resolveTheme,
} from './theme-merge'
import { themeVariables } from './theme-css'
import type {
  ResolvedTheme,
  ThemeDefinition,
  ThemeMode,
} from './theme-types'

interface ThemeContextValue {
  definition: ThemeDefinition
  theme: ResolvedTheme
  mode: Exclude<ThemeMode, 'system'>
}

const ThemeContext = createContext<ThemeContextValue>({
  definition: {},
  theme: defaultTheme,
  mode: 'light',
})

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
  mode = 'system',
  children,
}: ThemeProviderProps) {
  const parent = useContext(ThemeContext)
  const activeMode = useResolvedMode(mode)

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
    }),
    [activeMode, definition, resolvedTheme],
  )

  const variables = useMemo(
    () => themeVariables(resolvedTheme),
    [resolvedTheme],
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      <span
        data-weave-theme=""
        data-weave-theme-mode={activeMode}
        style={{
          display: 'contents',
          ...variables,
        }}
      >
        {children}
      </span>
    </ThemeContext.Provider>
  )
}

export function useTheme(): Omit<ThemeContextValue, 'definition'> {
  const { theme, mode } = useContext(ThemeContext)
  return { theme, mode }
}
