import {
  breakpointEntries as coreBreakpointEntries,
  containerBreakpointProp,
  type BreakpointEntry as CoreBreakpointEntry,
} from '../../core/breakpoints'

export interface BreakpointEntry extends CoreBreakpointEntry {
  cssName: string
}

export function breakpointCSSName(name: string): string {
  if (/^[a-z][a-z0-9-]*$/.test(name)) return name

  return `bp-${Array.from(name)
    .map(
      (character) =>
        character.codePointAt(0)?.toString(16) ?? '0',
    )
    .join('-')}`
}

export function breakpointEntries(
  breakpoints: Readonly<Record<string, number>>,
): readonly BreakpointEntry[] {
  return coreBreakpointEntries(breakpoints).map(
    ({ name, minWidth }) => ({
      name,
      cssName: breakpointCSSName(name),
      minWidth,
    }),
  )
}

export { containerBreakpointProp }
