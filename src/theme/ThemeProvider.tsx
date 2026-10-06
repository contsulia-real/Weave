import { type ReactNode, useContext, useMemo } from 'react'
import type { ReducedMotionPreference } from '../core/motion-types'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useResolvedReducedMotion } from './reduced-motion'
import { ThemeContext, useResolvedThemeMode } from './theme-context'
import { themeVariables } from './theme-css'
import { mergeThemeDefinitions, resolveTheme } from './theme-merge'
import type { ThemeDefinition, ThemeMode } from './theme-types'

export interface ThemeProviderProps {
  theme?: ThemeDefinition
  mode?: ThemeMode
  reducedMotion?: ReducedMotionPreference
  children?: ReactNode
}

export function ThemeProvider({
  theme = {},
  mode,
  reducedMotion,
  children,
}: ThemeProviderProps): import('react').JSX.Element {
  const parent = useContext(ThemeContext)
  const requestedMode = mode ?? parent.requestedMode
  const activeMode = useResolvedThemeMode(requestedMode)
  const requestedReducedMotion = reducedMotion ?? parent.requestedReducedMotion
  const activeReducedMotion = useResolvedReducedMotion(requestedReducedMotion)

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
      provided: true,
      definition,
      theme: resolvedTheme,
      mode: activeMode,
      requestedMode,
      requestedReducedMotion,
    }),
    [activeMode, definition, requestedMode, requestedReducedMotion, resolvedTheme],
  )

  const variables = useMemo(
    () => ({
      display: 'contents',
      color: 'var(--weave-color-tertiary)',
      'color-scheme': activeMode,
      'font-family': 'var(--weave-typography-family-body)',
      'font-size': 'var(--weave-typography-style-body-large-font-size)',
      'font-weight': 'var(--weave-typography-style-body-large-font-weight)',
      'line-height': 'var(--weave-typography-style-body-large-line-height)',
      'letter-spacing': 'var(--weave-typography-style-body-large-letter-spacing)',
      ...themeVariables(resolvedTheme),
    }),
    [activeMode, resolvedTheme],
  )

  const className = useRuntimeStyleClass('theme', variables)

  return (
    <ThemeContext.Provider value={contextValue}>
      <div
        data-weave-theme=""
        data-weave-theme-mode={activeMode}
        data-weave-reduced-motion={activeReducedMotion ? 'reduce' : 'no-preference'}
        className={['weave-theme', className].filter(Boolean).join(' ')}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
