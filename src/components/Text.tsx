import {
  createElement,
  useInsertionEffect,
} from 'react'
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
import { resolveView } from '../core/resolved-view'
import {
  breakpointEntries as coreBreakpointEntries,
} from '../core/breakpoints'
import {
  breakpointEntries as domBreakpointEntries,
} from '../renderers/dom/breakpoint-utils'
import { compileDOMText } from '../renderers/dom/resolve-text'
import { ensureTextStylesheet } from '../renderers/dom/text-stylesheet'
import { assertDiCViewPropsSupported } from '../renderers/dic/react-compat'
import { DIC_TEXT_HOST } from '../renderers/dic/react-host-types'
import { useWeaveRenderer } from '../renderers/renderer-context'
import { useTheme } from '../theme/theme-context'
import { useViewHost } from './internal/use-view-host'

function colorStyle(
  value: TextResponsiveProps | undefined,
): ViewResponsiveStyle | undefined {
  return value?.color === undefined
    ? undefined
    : {
        color: value.color,
      }
}

function mergeResponsive(
  base: ViewResponsiveStyle | undefined,
  addition: ViewResponsiveStyle | undefined,
): ViewResponsiveStyle | undefined {
  if (base === undefined) return addition
  if (addition === undefined) return base

  return {
    ...base,
    ...addition,
  }
}

function textHostProps(
  props: TextProps,
  breakpoints: Readonly<Record<string, number>>,
): ViewProps<HTMLSpanElement> {
  const {
    viewProps = {},
    color,
  } = props
  const hostProps: ViewProps<HTMLSpanElement> = {
    ...viewProps,
    color,
  }
  const writable =
    hostProps as unknown as Record<
      string,
      unknown
    >
  const propsRecord =
    props as unknown as Record<
      string,
      unknown
    >
  const viewRecord =
    viewProps as unknown as Record<
      string,
      unknown
    >

  for (
    const breakpoint of
      coreBreakpointEntries(breakpoints)
  ) {
    const textResponsive =
      propsRecord[
        breakpoint.name
      ] as TextResponsiveProps | undefined
    const viewResponsive =
      viewRecord[
        breakpoint.name
      ] as ViewResponsiveStyle | undefined
    const merged = mergeResponsive(
      viewResponsive,
      colorStyle(textResponsive),
    )

    if (merged !== undefined) {
      writable[breakpoint.name] = merged
    }
  }

  return hostProps
}

function responsiveData(
  prefix: string,
  value: TextResponsiveProps | undefined,
): Record<string, string> {
  const output: Record<string, string> = {}

  if (value?.overflow !== undefined) {
    output[
      `data-weave-text-${prefix}-overflow`
    ] = value.overflow
  }
  if (value?.maxLines !== undefined) {
    output[
      `data-weave-text-${prefix}-max-lines`
    ] = String(value.maxLines)
  }

  return output
}

function DOMText(
  props: TextProps,
) {
  const {
    children,
    typo,
    overflow,
    maxLines,
  } = props
  const { theme } = useTheme()
  const resolvedText = resolveText(
    props,
    theme.breakpoints,
  )
  const hostProps = textHostProps(
    props,
    theme.breakpoints,
  )
  const responsiveAttributes:
    Record<string, string> = {}
  const propsRecord =
    props as unknown as Record<
      string,
      unknown
    >

  for (
    const breakpoint of
      domBreakpointEntries(theme.breakpoints)
  ) {
    Object.assign(
      responsiveAttributes,
      responsiveData(
        breakpoint.cssName,
        propsRecord[
          breakpoint.name
        ] as TextResponsiveProps | undefined,
      ),
    )
  }

  const componentStyle =
    compileDOMText(resolvedText)
  const {
    elementRef,
    className,
    inlineStyle,
    resolved,
  } = useViewHost(
    hostProps,
    componentStyle,
    'text',
  )

  useInsertionEffect(
    ensureTextStylesheet,
    [],
  )

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
        maxLines === undefined
          ? undefined
          : String(maxLines)
      }
      className={[
        'weave-text',
        className,
      ].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      {children}
    </span>
  )
}

function DiCText(
  props: TextProps,
) {
  const { theme } = useTheme()
  const hostProps = textHostProps(
    props,
    theme.breakpoints,
  )

  assertDiCViewPropsSupported(
    hostProps as ViewProps<HTMLElement>,
    theme.breakpoints,
    'Text.viewProps',
  )

  const view = resolveView(
    hostProps,
    theme.breakpoints,
  )
  const text = resolveText(
    props,
    theme.breakpoints,
  )

  return createElement(
    DIC_TEXT_HOST,
    {
      view,
      text,
      theme,
    },
    props.children,
  )
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
  const renderer = useWeaveRenderer()
  const runtimeProps = props as TextProps

  return renderer === 'dic'
    ? <DiCText {...runtimeProps} />
    : <DOMText {...runtimeProps} />
}
