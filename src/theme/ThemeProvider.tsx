import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { defaultTheme } from './default-theme'
import { resolveTheme } from './theme-merge'
import { themeVariables } from './theme-css'
import type {
  ResolvedTheme,
  ThemeDefinition,
  ThemeMode,
} from './theme-types'

interface ThemeContextValue {
  theme: ResolvedTheme
  mode: Exclude<ThemeMode, 'system'>
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  mode: 'light',
})

function getSystemMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function useResolvedMode(mode: ThemeMode): 'light' | 'dark' {
  const [systemMode, setSystemMode] = useState(getSystemMode)

  useEffect(() => {
    if (mode !== 'system') return

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

  const resolvedTheme = useMemo(
    () => resolveTheme(parent.theme, theme, activeMode),
    [activeMode, parent.theme, theme],
  )

  const contextValue = useMemo(
    () => ({ theme: resolvedTheme, mode: activeMode }),
    [activeMode, resolvedTheme],
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

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
