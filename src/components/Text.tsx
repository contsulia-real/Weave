import { createElement, useInsertionEffect } from 'react'
import type { TextHostElement, TextProps, TextResponsiveProps, TextTypo } from '../core/text-types'
import type { ViewProps, ViewResponsiveStyle } from '../core/view-types'
import { breakpointEntries } from '../renderers/dom/breakpoint-utils'
import { resolveTextResponsiveStyle } from '../renderers/dom/resolve-text'
import { ensureTextStylesheet } from '../renderers/dom/text-stylesheet'
import { useTheme } from '../theme/theme-context'
import { useViewHost } from './internal/use-view-host'

type TextTag = 'h1' | 'h2' | 'h3' | 'p' | 'span'

function textTagForTypo(typo: TextTypo | undefined): TextTag {
  if (typo?.startsWith('display-')) return 'h1'
  if (typo?.startsWith('headline-')) return 'h2'
  if (typo?.startsWith('title-')) return 'h3'
  if (typo?.startsWith('body-')) return 'p'
  return 'span'
}

function colorStyle(value: TextResponsiveProps | undefined): ViewResponsiveStyle | undefined {
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

export function Text(props: TextProps) {
  const {
    children,
    viewProps = {},
    typo,
    size,
    weight,
    bold,
    italic,
    color,
    align,
    lineHeight,
    letterSpacing,
    wrap,
    overflow,
    maxLines,
    case: textCase,
    underline,
    strikethrough,
    overline,
  } = props

  const { theme } = useTheme()
  const breakpoints = breakpointEntries(theme.breakpoints)
  const propsRecord = props as unknown as Record<string, unknown>
  const viewPropsRecord = viewProps as unknown as Record<string, unknown>
  const responsiveText: Record<string, TextResponsiveProps | undefined> = {}
  const responsiveAttributes: Record<string, string> = {}

  const hostProps: ViewProps<TextHostElement> = {
    ...viewProps,
    color,
  }
  const writableHostProps = hostProps as unknown as Record<string, unknown>

  for (const breakpoint of breakpoints) {
    const textResponsive = propsRecord[breakpoint.name] as TextResponsiveProps | undefined
    const viewResponsive = viewPropsRecord[breakpoint.name] as ViewResponsiveStyle | undefined

    responsiveText[breakpoint.cssName] = textResponsive

    const merged = mergeResponsive(viewResponsive, colorStyle(textResponsive))

    if (merged !== undefined) {
      writableHostProps[breakpoint.name] = merged
    }

    Object.assign(responsiveAttributes, responsiveData(breakpoint.cssName, textResponsive))
  }

  const componentStyle = resolveTextResponsiveStyle({
    base: {
      typo,
      size,
      weight,
      bold,
      italic,
      align,
      lineHeight,
      letterSpacing,
      wrap,
      overflow,
      maxLines,
      case: textCase,
      underline,
      strikethrough,
      overline,
    },
    responsive: responsiveText,
  })

  const { elementRef, className, inlineStyle, resolved } = useViewHost(
    hostProps,
    componentStyle,
    'text',
  )

  useInsertionEffect(ensureTextStylesheet, [])

  return createElement(
    textTagForTypo(typo),
    {
      ...resolved.domProps,
      ...responsiveAttributes,
      ref: elementRef,
      'data-weave-view': '',
      'data-weave-text': '',
      'data-weave-text-typo': typo,
      'data-weave-layout': resolved.layout,
      'data-weave-text-overflow': overflow,
      'data-weave-text-max-lines': maxLines === undefined ? undefined : String(maxLines),
      className: ['weave-text', className].filter(Boolean).join(' '),
      style: inlineStyle,
    },
    children,
  )
}
