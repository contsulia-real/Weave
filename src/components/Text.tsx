import { useInsertionEffect } from 'react'
import type {
  ValidateDynamicBreakpointProps,
  ViewProps,
  ViewResponsiveStyle,
} from '../core/view-types'
import type {
  TextProps,
  TextResponsiveProps,
} from '../core/text-types'
import { resolveText } from '../core/resolved-text'
import { breakpointEntries } from '../renderers/dom/breakpoint-utils'
import { compileDOMText } from '../renderers/dom/resolve-text'
import { ensureTextStylesheet } from '../renderers/dom/text-stylesheet'
import { useTheme } from '../theme/theme-context'
import { useViewHost } from './internal/use-view-host'

function colorStyle(
  value: TextResponsiveProps | undefined,
): ViewResponsiveStyle | undefined {
  return value?.color === undefined ? undefined : { color: value.color }
}

function mergeResponsive(
  base: ViewResponsiveStyle | undefined,
  addition: ViewResponsiveStyle | undefined,
): ViewResponsiveStyle | undefined {
  if (base === undefined) return addition
  if (addition === undefined) return base
  return { ...base, ...addition }
}

function responsiveData(
  prefix: string,
  value: TextResponsiveProps | undefined,
): Record<string, string> {
  const output: Record<string, string> = {}

  if (value?.overflow !== undefined) {
    output[`data-weave-text-${prefix}-overflow`] = value.overflow
  }
  if (value?.maxLines !== undefined) {
    output[`data-weave-text-${prefix}-max-lines`] = String(value.maxLines)
  }

  return output
}

export function Text<
  TProps extends TextProps,
>(
  props: TProps &
    ValidateDynamicBreakpointProps<
      TProps,
      TextProps,
      TextResponsiveProps
    >,
) {
  const {
    children,
    viewProps = {},
    typo,
    color,
    overflow,
    maxLines,
  } = props

  const { theme } = useTheme()
  const breakpoints = breakpointEntries(theme.breakpoints)
  const propsRecord = props as Record<string, unknown>
  const viewPropsRecord = viewProps as Record<string, unknown>
  const resolvedText = resolveText(
    props,
    theme.breakpoints,
  )
  const responsiveAttributes: Record<string, string> = {}

  const hostProps: ViewProps<HTMLSpanElement> = {
    ...viewProps,
    color,
  }
  const writableHostProps = hostProps as Record<string, unknown>

  for (const breakpoint of breakpoints) {
    const textResponsive = propsRecord[
      breakpoint.name
    ] as TextResponsiveProps | undefined
    const viewResponsive = viewPropsRecord[
      breakpoint.name
    ] as ViewResponsiveStyle | undefined

    const merged = mergeResponsive(
      viewResponsive,
      colorStyle(textResponsive),
    )

    if (merged !== undefined) {
      writableHostProps[breakpoint.name] = merged
    }

    Object.assign(
      responsiveAttributes,
      responsiveData(breakpoint.cssName, textResponsive),
    )
  }

  const componentStyle = compileDOMText(resolvedText)

  const {
    elementRef,
    className,
    inlineStyle,
    resolved,
  } = useViewHost(hostProps, componentStyle, 'text')

  useInsertionEffect(ensureTextStylesheet, [])

  return (
    <span
      {...resolved.domProps}
      {...responsiveAttributes}
      ref={elementRef}
      data-weave-view=""
      data-weave-text=""
      data-weave-text-typo={typo}
      data-weave-layout={resolved.layout}
      data-weave-text-overflow={overflow}
      data-weave-text-max-lines={
        maxLines === undefined ? undefined : String(maxLines)
      }
      className={['weave-text', className].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      {children}
    </span>
  )
}
