import type {
  CSSProperties,
} from 'react'
import type {
  ViewProps,
  ViewStyleProps,
} from '../core/view-types'
import { AutoScrollbar } from './internal/AutoScrollbar'
import { useViewHost } from './internal/use-view-host'

function scrollableOverflow(
  value: CSSProperties['overflow'] | undefined,
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
        />
      ) : null}
    </>
  )
}
