import { defaultTheme } from './default-theme'
import type {
  ResolvedTheme,
  ThemeDefinition,
  ThemeMode,
  ThemeOverride,
} from './theme-types'

type PlainObject = Record<string, unknown>

const isPlainObject = (value: unknown): value is PlainObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

function mergeValue<T>(base: T, override: unknown): T {
  if (override === undefined) return base

  if (isPlainObject(base) && isPlainObject(override)) {
    const output: PlainObject = { ...base }

    for (const [key, value] of Object.entries(override)) {
      output[key] =
        key in output ? mergeValue(output[key], value) : value
    }

    return output as T
  }

  return override as T
}

function withoutModes(theme: ThemeDefinition): ThemeOverride {
  const { modes: _modes, ...rest } = theme
  return rest
}

export function mergeThemeDefinitions(
  parent: ThemeDefinition,
  input: ThemeDefinition,
): ThemeDefinition {
  return mergeValue(parent, input)
}

export function resolveTheme(
  definition: ThemeDefinition,
  activeMode: Exclude<ThemeMode, 'system'>,
): ResolvedTheme {
  const base = mergeValue(defaultTheme, withoutModes(definition))
  const modeOverride = definition.modes?.[activeMode]

  return modeOverride === undefined
    ? base
    : mergeValue(base, modeOverride)
}
