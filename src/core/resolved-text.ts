import type {
  TextResponsiveProps,
  TextStyleProps,
} from './text-types'
import { breakpointEntries } from './breakpoints'

export interface ResolvedTextBreakpoint {
  name: string
  minWidth: number
  style: Readonly<TextResponsiveProps>
}

export interface ResolvedText {
  base: Readonly<TextStyleProps>
  responsive: readonly ResolvedTextBreakpoint[]
}

function pickTextStyle(
  input: TextStyleProps | TextResponsiveProps | undefined,
): TextResponsiveProps {
  if (input === undefined) return {}

  return {
    typo: input.typo,
    size: input.size,
    weight: input.weight,
    color: input.color,
    align: input.align,
    lineHeight: input.lineHeight,
    letterSpacing: input.letterSpacing,
    wrap: input.wrap,
    overflow: input.overflow,
    maxLines: input.maxLines,
    case: input.case,
  }
}

export function resolveText(
  props: TextStyleProps,
  breakpoints: Readonly<Record<string, number>>,
): ResolvedText {
  const responsive: ResolvedTextBreakpoint[] = []
  const record = props as unknown as Readonly<Record<string, unknown>>

  for (const breakpoint of breakpointEntries(breakpoints)) {
    const value = record[breakpoint.name]

    if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    ) {
      responsive.push({
        name: breakpoint.name,
        minWidth: breakpoint.minWidth,
        style: pickTextStyle(
          value as TextResponsiveProps,
        ),
      })
    }
  }

  return {
    base: pickTextStyle(props),
    responsive,
  }
}
