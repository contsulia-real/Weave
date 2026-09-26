export interface BreakpointEntry {
  name: string
  minWidth: number
}

export function breakpointEntries(
  breakpoints: Readonly<Record<string, number>>,
): readonly BreakpointEntry[] {
  return Object.entries(breakpoints)
    .filter(
      ([name, minWidth]) =>
        name.length > 0 &&
        Number.isFinite(minWidth) &&
        minWidth >= 0,
    )
    .map(([name, minWidth]) => ({
      name,
      minWidth,
    }))
    .sort(
      (left, right) =>
        left.minWidth - right.minWidth ||
        left.name.localeCompare(right.name),
    )
}

export function containerBreakpointProp(name: string): string {
  if (name.length === 0) return 'container'
  return `container${name[0]?.toUpperCase() ?? ''}${name.slice(1)}`
}
