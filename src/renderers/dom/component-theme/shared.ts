export function shadowToken(
  value: string | undefined,
): string | undefined {
  if (value === undefined) return undefined
  if (value === 'none') return 'none'

  return `var(--weave-shadow-${value})`
}
