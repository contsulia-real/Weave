import type {
  ButtonProps,
  ButtonResponsiveProps,
  ButtonSize,
  ButtonVariant,
} from './button-types'
import { breakpointEntries } from './breakpoints'

export interface ResolvedButtonBreakpoint {
  name: string
  minWidth: number
  variant?: ButtonVariant
  size?: ButtonSize
}

export interface ResolvedButton {
  variant: ButtonVariant
  size: ButtonSize
  loading: boolean
  disabled: boolean
  iconOnly: boolean
  responsive: readonly ResolvedButtonBreakpoint[]
}

export function resolveButton(
  props: ButtonProps,
  breakpoints: Readonly<Record<string, number>>,
): ResolvedButton {
  const responsive: ResolvedButtonBreakpoint[] = []
  const record = props as Readonly<Record<string, unknown>>

  for (const breakpoint of breakpointEntries(breakpoints)) {
    const value = record[
      breakpoint.name
    ] as ButtonResponsiveProps | undefined

    if (
      value?.variant !== undefined ||
      value?.size !== undefined
    ) {
      responsive.push({
        name: breakpoint.name,
        minWidth: breakpoint.minWidth,
        variant: value.variant,
        size: value.size,
      })
    }
  }

  const loading = props.loading ?? false
  const disabled =
    loading ||
    props.viewProps?.disabled === true

  const iconOnly =
    'icon' in props &&
    props.icon !== undefined &&
    props.text === undefined

  return {
    variant: props.variant ?? 'primary',
    size: props.size ?? 'medium',
    loading,
    disabled,
    iconOnly,
    responsive,
  }
}
