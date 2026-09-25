import type {
  ThemeDefinition,
  ThemeInput,
  ThemeModeDefinition,
} from './theme-types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function mergeValue(base: unknown, override: unknown): unknown {
  if (override === undefined) return base

  if (isRecord(base) && isRecord(override)) {
    const output: Record<string, unknown> = { ...base }

    for (const [key, value] of Object.entries(override)) {
      output[key] = mergeValue(output[key], value)
    }

    return output
  }

  return override
}

export function mergeTheme(
  base: ThemeDefinition,
  override: ThemeInput | ThemeModeDefinition | undefined,
): ThemeDefinition {
  if (override === undefined) return base
  return mergeValue(base, override) as ThemeDefinition
}

export function applyThemeMode(
  theme: ThemeDefinition,
  mode: 'light' | 'dark',
): ThemeDefinition {
  const modeTheme = theme.modes?.[mode]
  return modeTheme === undefined ? theme : mergeTheme(theme, modeTheme)
}
