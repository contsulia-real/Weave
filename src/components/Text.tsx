import { useInsertionEffect } from 'react'
import type { ViewProps, ViewResponsiveStyle } from '../core/view-types'
import type {
  TextProps,
  TextResponsiveProps,
} from '../core/text-types'
import { resolveTextResponsiveStyle } from '../renderers/dom/resolve-text'
import { ensureTextStylesheet } from '../renderers/dom/text-stylesheet'
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

export function Text({
  children,
  viewProps,
  size,
  weight,
  color,
  align,
  lineHeight,
  letterSpacing,
  wrap,
  overflow,
  maxLines,
  case: textCase,
  sm,
  md,
  lg,
  xl,
}: TextProps) {
  const hostProps: ViewProps<HTMLSpanElement> = {
    ...viewProps,
    color,
    sm: mergeResponsive(viewProps?.sm, colorStyle(sm)),
    md: mergeResponsive(viewProps?.md, colorStyle(md)),
    lg: mergeResponsive(viewProps?.lg, colorStyle(lg)),
    xl: mergeResponsive(viewProps?.xl, colorStyle(xl)),
  }

  const componentStyle = resolveTextResponsiveStyle({
    base: {
      size,
      weight,
      align,
      lineHeight,
      letterSpacing,
      wrap,
      overflow,
      maxLines,
      case: textCase,
    },
    sm,
    md,
    lg,
    xl,
  })

  const {
    elementRef,
    className,
    mergedStyle,
    resolved,
  } = useViewHost(hostProps, componentStyle)

  useInsertionEffect(ensureTextStylesheet, [])

  return (
    <span
      {...resolved.domProps}
      {...responsiveData('sm', sm)}
      {...responsiveData('md', md)}
      {...responsiveData('lg', lg)}
      {...responsiveData('xl', xl)}
      ref={elementRef}
      data-weave-view=""
      data-weave-text=""
      data-weave-layout={resolved.layout}
      data-weave-text-overflow={overflow}
      data-weave-text-max-lines={
        maxLines === undefined ? undefined : String(maxLines)
      }
      className={['weave-text', className].filter(Boolean).join(' ')}
      style={mergedStyle}
    >
      {children}
    </span>
  )
}
