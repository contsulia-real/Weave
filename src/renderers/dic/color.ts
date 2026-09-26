import type { ResolvedTheme } from '../../theme/theme-types'

const COLOR_VAR =
  /var\(--weave-color-([a-zA-Z0-9_-]+)\)/g

function replaceColorVariables(
  value: string,
  theme: ResolvedTheme,
  depth: number,
): string {
  if (depth > 12) {
    throw new Error(
      'DiC color token resolution exceeded recursion limit',
    )
  }

  let replaced = false
  const output = value.replace(
    COLOR_VAR,
    (match, name: string) => {
      const token = theme.tokens.color?.[name]
      if (token === undefined) return match

      replaced = true
      return replaceColorVariables(
        token,
        theme,
        depth + 1,
      )
    },
  )

  return replaced
    ? replaceColorVariables(
        output,
        theme,
        depth + 1,
      )
    : output
}

export function resolveDiCColor(
  value: string,
  theme: ResolvedTheme,
): string {
  const token =
    theme.tokens.color?.[value] ??
    value
  const resolved = replaceColorVariables(
    token,
    theme,
    0,
  )

  if (resolved.includes('var(')) {
    throw new Error(
      `Unsupported DiC color variable "${resolved}"`,
    )
  }

  return resolved
}
