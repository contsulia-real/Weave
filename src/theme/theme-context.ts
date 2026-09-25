import { createContext, useContext } from 'react'
import { defaultTheme } from './default-theme'
import { themeVariables, type ThemeVariableStyle } from './theme-vars'
import type { ThemeDefinition, ThemeMode } from './theme-types'

export interface ThemeContextValue {
  theme: ThemeDefinition
  mode: ThemeMode
  resolvedMode: 'light' | 'dark'
  variables: ThemeVariableStyle
}

export const defaultThemeContext: ThemeContextValue = {
  theme: defaultTheme,
  mode: 'system',
  resolvedMode: 'light',
  variables: themeVariables(defaultTheme),
}

export const ThemeContext =
  createContext<ThemeContextValue>(defaultThemeContext)

export function useWeaveTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
