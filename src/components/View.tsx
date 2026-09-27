import type { CSSProperties } from 'react'
import type {
  ViewProps,
  ViewStyleProps,
} from '../core/view-types'
import {
  breakpointEntries,
  containerBreakpointProp,
} from '../renderers/dom/breakpoint-utils'
import { useTheme } from '../theme/theme-context'
import { AutoScrollbar } from './internal/AutoScrollbar'
import { useViewHost } from './internal/use-view-host'

function scrollableOverflow(
  value: string | undefined,
): boolean {
  return value === 'auto' || value === 'scroll'
}

function styleMayScroll(
  style: ViewStyleProps | undefined,
): boolean {
  if (style === undefined) return false

  return (
    scrollableOverflow(style.overflow) ||
    scrollableOverflow(style.overflowX) ||
    scrollableOverflow(style.overflowY)
  )
}

function rawStyleMayScroll(
  style: CSSProperties | undefined,
): boolean {
  if (style === undefined) return false

  return (
    scrollableOverflow(style.overflow) ||
    scrollableOverflow(style.overflowX) ||
    scrollableOverflow(style.overflowY)
  )
}

function scrollOverflowClass(
  axis: '' | 'x' | 'y',
  value: string | undefined,
): string | undefined {
  if (!scrollableOverflow(value)) return undefined

  const suffix = value === 'scroll' ? 'scroll' : 'auto'
  const axisPart = axis.length === 0 ? '' : `-${axis}`

  return `weave-scroll-host--overflow${axisPart}-${suffix}`
}

function cssString(
  value: CSSProperties['overflow'] | undefined,
): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function overflowIntent(
  props: ViewProps<HTMLDivElement>,
) {
  return {
    styleOverflow: cssString(props.style?.overflow),
    styleOverflowX: cssString(props.style?.overflowX),
    styleOverflowY: cssString(props.style?.overflowY),
  }
}

function viewMayScroll(
  props: ViewProps<HTMLDivElement>,
  breakpoints: Readonly<Record<string, number>>,
): boolean {
  if (props.scrollbar !== undefined) return true

  if (
    styleMayScroll(props) ||
    rawStyleMayScroll(props.style)
  ) {
    return true
  }

  const propsRecord = props as Record<string, unknown>

  return breakpointEntries(breakpoints).some(({ name }) =>
    styleMayScroll(
      propsRecord[name] as ViewStyleProps | undefined,
    ) ||
    styleMayScroll(
      propsRecord[
        containerBreakpointProp(name)
      ] as ViewStyleProps | undefined,
    ),
  )
}

export function View(
  props: ViewProps<HTMLDivElement>,
) {
  const { children } = props
  const { theme } = useTheme()
  const {
    elementRef,
    className,
    inlineStyle,
    resolved,
  } = useViewHost(props)

  const mountsScrollbar = viewMayScroll(props, theme.breakpoints)
  const resolvedClassName = [
    mountsScrollbar ? 'weave-scroll-host' : undefined,
    scrollOverflowClass('', props.overflow),
    scrollOverflowClass('x', props.overflowX),
    scrollOverflowClass('y', props.overflowY),
    className,
  ]
    .filter(Boolean)
    .join(' ') || undefined

  return (
    <>
      <div
        {...resolved.domProps}
        ref={elementRef}
        data-weave-view=""
        data-weave-layout={resolved.layout}
        data-weave-scroll-host={mountsScrollbar ? '' : undefined}
        className={resolvedClassName}
        style={inlineStyle}
      >
        {children}
      </div>

      {mountsScrollbar ? (
        <AutoScrollbar
          targetRef={elementRef}
          config={props.scrollbar}
          overflowIntent={overflowIntent(props)}
        />
      ) : null}
    </>
  )
}
