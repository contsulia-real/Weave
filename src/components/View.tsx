import type { CSSProperties } from 'react'
import type {
  ViewProps,
  ViewStyleProps,
} from '../core/view-types'
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
    propOverflow: props.overflow,
    propOverflowX: props.overflowX,
    propOverflowY: props.overflowY,
  }
}

function viewMayScroll(
  props: ViewProps<HTMLDivElement>,
): boolean {
  if (props.scrollbar !== undefined) return true

  return (
    styleMayScroll(props) ||
    rawStyleMayScroll(props.style) ||
    styleMayScroll(props.sm) ||
    styleMayScroll(props.md) ||
    styleMayScroll(props.lg) ||
    styleMayScroll(props.xl) ||
    styleMayScroll(props.containerSm) ||
    styleMayScroll(props.containerMd) ||
    styleMayScroll(props.containerLg) ||
    styleMayScroll(props.containerXl)
  )
}

export function View(props: ViewProps<HTMLDivElement>) {
  const { children } = props
  const {
    elementRef,
    className,
    mergedStyle,
    resolved,
  } = useViewHost(props)

  const mountsScrollbar = viewMayScroll(props)
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
        style={mergedStyle}
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
