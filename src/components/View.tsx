import type { CSSProperties } from 'react'
import type {
  ValidateDynamicBreakpointProps,
  ViewProps,
  ViewResponsiveStyle,
} from '../core/view-types'
import type {
  ResolvedView,
  ResolvedViewStyle,
} from '../core/resolved-view'
import { AutoScrollbar } from './internal/AutoScrollbar'
import { useViewHost } from './internal/use-view-host'

function scrollableOverflow(
  value: string | undefined,
): boolean {
  return value === 'auto' || value === 'scroll'
}

function styleMayScroll(
  style: ResolvedViewStyle | undefined,
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
  view: ResolvedView,
  style: CSSProperties | undefined,
  hasExplicitScrollbar: boolean,
): boolean {
  if (hasExplicitScrollbar) return true

  if (
    styleMayScroll(view.style) ||
    rawStyleMayScroll(style)
  ) {
    return true
  }

  return view.responsive.some((responsive) =>
    styleMayScroll(responsive.style),
  )
}

export function View<
  TProps extends ViewProps<HTMLDivElement>,
>(
  props: TProps &
    ValidateDynamicBreakpointProps<
      TProps,
      ViewProps<HTMLDivElement>,
      ViewResponsiveStyle
    >,
) {
  const { children } = props
  const {
    elementRef,
    view,
    className,
    inlineStyle,
    resolved,
  } = useViewHost(props)

  const mountsScrollbar = viewMayScroll(
    view,
    props.style,
    props.scrollbar !== undefined,
  )
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
