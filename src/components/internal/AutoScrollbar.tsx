import {
  useCallback,
  useInsertionEffect,
  useLayoutEffect,
  useRef,
  type PointerEvent,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import type {
  ScrollbarConfig,
  ScrollbarSize,
  ViewProps,
} from '../../core/view-types'
import { resolveScrollbarTheme } from '../../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../../renderers/dom/runtime-class'
import { ensureScrollbarStylesheet } from '../../renderers/dom/scrollbar-stylesheet'
import { themeVariables } from '../../theme/theme-css'
import { useTheme } from '../../theme/theme-context'
import { useViewHost } from './use-view-host'

type Orientation = 'vertical' | 'horizontal'

interface ScrollbarOverflowIntent {
  styleOverflow?: string
  styleOverflowX?: string
  styleOverflowY?: string
}

interface AutoScrollbarProps {
  targetRef: RefObject<HTMLDivElement | null>
  config?: ScrollbarConfig
  overflowIntent: ScrollbarOverflowIntent
}

interface DragState {
  orientation: Orientation
  pointerId: number
  startPointer: number
  startScroll: number
  scrollPerPixel: number
}

function ScrollbarView(props: ViewProps<HTMLDivElement>) {
  const { children } = props
  const {
    elementRef,
    className,
    inlineStyle,
    resolved,
  } = useViewHost(props)

  return (
    <div
      {...resolved.domProps}
      ref={elementRef}
      data-weave-view=""
      data-weave-layout={resolved.layout}
      className={className}
      style={inlineStyle}
    >
      {children}
    </div>
  )
}

function isAutoScrolling(value: string): boolean {
  return value === 'auto' || value === 'overlay'
}

function scrollbarVisible(
  overflow: string,
  scrollSize: number,
  clientSize: number,
): boolean {
  if (overflow === 'scroll') return true

  return (
    isAutoScrolling(overflow) &&
    scrollSize > clientSize + 1
  )
}

function syncScrollbarLayer(
  track: HTMLElement,
  target: HTMLElement,
): void {
  let node: HTMLElement | null = target
  let layer: number | null = null

  while (node !== null) {
    const value = getComputedStyle(node).zIndex
    const numeric = Number(value)

    if (Number.isFinite(numeric)) {
      layer = layer === null
        ? numeric
        : Math.max(layer, numeric)
    }

    node = node.parentElement
  }

  if (layer === null) {
    track.style.removeProperty('z-index')
  } else {
    track.style.zIndex = String(layer + 1)
  }
}

export function AutoScrollbar({
  targetRef,
  config,
  overflowIntent,
}: AutoScrollbarProps) {
  useInsertionEffect(ensureScrollbarStylesheet, [])

  const verticalTrackRef = useRef<HTMLDivElement>(null)
  const horizontalTrackRef = useRef<HTMLDivElement>(null)
  const verticalThumbRef = useRef<HTMLDivElement>(null)
  const horizontalThumbRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)

  const size: ScrollbarSize = config?.size ?? 'medium'
  const tracked = config?.tracked === true
  const { theme } = useTheme()
  const themeTokenClassName = useRuntimeStyleClass(
    'scrollbar-tokens',
    themeVariables(theme),
  )
  const scrollbarThemeClassName = useRuntimeStyleClass(
    'scrollbar-theme',
    resolveScrollbarTheme(theme, size, config),
  )

  const update = useCallback(() => {
    // These generated classes change computed scrollbar geometry. Keep them
    // as dependencies so a theme change immediately recomputes track/thumb
    // sizes instead of waiting for the next scroll or resize event.
    void themeTokenClassName
    void scrollbarThemeClassName

    const target = targetRef.current
    const verticalTrack = verticalTrackRef.current
    const horizontalTrack = horizontalTrackRef.current
    const verticalThumb = verticalThumbRef.current
    const horizontalThumb = horizontalThumbRef.current

    if (
      target === null ||
      verticalTrack === null ||
      horizontalTrack === null ||
      verticalThumb === null ||
      horizontalThumb === null
    ) {
      return
    }

    const computed = getComputedStyle(target)
    const rect = target.getBoundingClientRect()

    syncScrollbarLayer(verticalTrack, target)
    syncScrollbarLayer(horizontalTrack, target)

    const verticalOverflow =
      (
        overflowIntent.styleOverflowY ??
        overflowIntent.styleOverflow
      ) ||
      computed.overflowY ||
      computed.overflow ||
      'visible'

    const horizontalOverflow =
      (
        overflowIntent.styleOverflowX ??
        overflowIntent.styleOverflow
      ) ||
      computed.overflowX ||
      computed.overflow ||
      'visible'

    const verticalVisible =
      scrollbarVisible(
        verticalOverflow,
        target.scrollHeight,
        target.clientHeight,
      ) &&
      rect.height > 0

    const horizontalVisible =
      scrollbarVisible(
        horizontalOverflow,
        target.scrollWidth,
        target.clientWidth,
      ) &&
      rect.width > 0

    verticalTrack.dataset.weaveScrollbarVisible = String(verticalVisible)
    horizontalTrack.dataset.weaveScrollbarVisible = String(horizontalVisible)

    const verticalThickness = verticalVisible
      ? parseFloat(getComputedStyle(verticalTrack).width) || 0
      : 0
    const horizontalThickness = horizontalVisible
      ? parseFloat(getComputedStyle(horizontalTrack).height) || 0
      : 0

    if (verticalVisible) {
      const trackLength = Math.max(
        0,
        rect.height - horizontalThickness,
      )
      const thumbLength = Math.min(
        trackLength,
        Math.max(
          24,
          trackLength * (target.clientHeight / target.scrollHeight),
        ),
      )
      const available = Math.max(0, trackLength - thumbLength)
      const maxScroll = Math.max(
        0,
        target.scrollHeight - target.clientHeight,
      )
      const offset =
        maxScroll === 0
          ? 0
          : (target.scrollTop / maxScroll) * available

      verticalTrack.style.top = `${rect.top}px`
      verticalTrack.style.left = `${rect.right}px`
      verticalTrack.style.height = `${trackLength}px`

      verticalThumb.style.height = `${thumbLength}px`
      verticalThumb.style.transform = `translateY(${offset}px)`
    }

    if (horizontalVisible) {
      const trackLength = Math.max(
        0,
        rect.width - verticalThickness,
      )
      const thumbLength = Math.min(
        trackLength,
        Math.max(
          24,
          trackLength * (target.clientWidth / target.scrollWidth),
        ),
      )
      const available = Math.max(0, trackLength - thumbLength)
      const maxScroll = Math.max(
        0,
        target.scrollWidth - target.clientWidth,
      )
      const offset =
        maxScroll === 0
          ? 0
          : (target.scrollLeft / maxScroll) * available

      horizontalTrack.style.left = `${rect.left}px`
      horizontalTrack.style.top = `${rect.bottom}px`
      horizontalTrack.style.width = `${trackLength}px`

      horizontalThumb.style.width = `${thumbLength}px`
      horizontalThumb.style.transform = `translateX(${offset}px)`
    }
  }, [
    overflowIntent,
    scrollbarThemeClassName,
    targetRef,
    themeTokenClassName,
  ])

  useLayoutEffect(() => {
    const target = targetRef.current
    if (target === null) return

    update()

    const onScroll = () => update()
    const onWindowChange = () => update()

    target.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onWindowChange)
    document.addEventListener('scroll', onWindowChange, true)

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(update)

    resizeObserver?.observe(target)

    for (const child of target.children) {
      if (child instanceof HTMLElement) {
        resizeObserver?.observe(child)
      }
    }

    const mutationObserver =
      typeof MutationObserver === 'undefined'
        ? null
        : new MutationObserver(() => {
            resizeObserver?.disconnect()
            resizeObserver?.observe(target)

            for (const child of target.children) {
              if (child instanceof HTMLElement) {
                resizeObserver?.observe(child)
              }
            }

            update()
          })

    mutationObserver?.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
    })

    return () => {
      target.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onWindowChange)
      document.removeEventListener('scroll', onWindowChange, true)
      resizeObserver?.disconnect()
      mutationObserver?.disconnect()
    }
  }, [targetRef, update])

  const beginDrag = (
    orientation: Orientation,
    event: PointerEvent<HTMLDivElement>,
  ) => {
    const target = targetRef.current
    const track =
      orientation === 'vertical'
        ? verticalTrackRef.current
        : horizontalTrackRef.current
    const thumb =
      orientation === 'vertical'
        ? verticalThumbRef.current
        : horizontalThumbRef.current

    if (target === null || track === null || thumb === null) return

    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.setPointerCapture?.(event.pointerId)

    const trackRect = track.getBoundingClientRect()
    const thumbRect = thumb.getBoundingClientRect()
    const trackLength =
      orientation === 'vertical' ? trackRect.height : trackRect.width
    const thumbLength =
      orientation === 'vertical' ? thumbRect.height : thumbRect.width
    const available = Math.max(0, trackLength - thumbLength)
    const maxScroll =
      orientation === 'vertical'
        ? Math.max(0, target.scrollHeight - target.clientHeight)
        : Math.max(0, target.scrollWidth - target.clientWidth)

    dragRef.current = {
      orientation,
      pointerId: event.pointerId,
      startPointer:
        orientation === 'vertical' ? event.clientY : event.clientX,
      startScroll:
        orientation === 'vertical'
          ? target.scrollTop
          : target.scrollLeft,
      scrollPerPixel: available === 0 ? 0 : maxScroll / available,
    }
  }

  const continueDrag = (
    orientation: Orientation,
    event: PointerEvent<HTMLDivElement>,
  ) => {
    const target = targetRef.current
    const drag = dragRef.current

    if (
      target === null ||
      drag === null ||
      drag.orientation !== orientation ||
      drag.pointerId !== event.pointerId
    ) {
      return
    }

    event.preventDefault()

    const pointer =
      orientation === 'vertical' ? event.clientY : event.clientX
    const next =
      drag.startScroll +
      (pointer - drag.startPointer) * drag.scrollPerPixel

    if (orientation === 'vertical') {
      target.scrollTop = next
    } else {
      target.scrollLeft = next
    }

    update()
  }

  const endDrag = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (dragRef.current?.pointerId !== event.pointerId) return

    event.currentTarget.releasePointerCapture?.(event.pointerId)
    dragRef.current = null
  }

  const pageTrack = (
    orientation: Orientation,
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (event.target !== event.currentTarget) return

    const target = targetRef.current
    const thumb =
      orientation === 'vertical'
        ? verticalThumbRef.current
        : horizontalThumbRef.current

    if (target === null || thumb === null) return

    event.preventDefault()

    const thumbRect = thumb.getBoundingClientRect()
    const before =
      orientation === 'vertical'
        ? event.clientY < thumbRect.top
        : event.clientX < thumbRect.left
    const direction = before ? -1 : 1

    if (orientation === 'vertical') {
      target.scrollTop += direction * target.clientHeight * 0.9
    } else {
      target.scrollLeft += direction * target.clientWidth * 0.9
    }

    update()
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      <ScrollbarView
        ref={verticalTrackRef}
        aria-hidden
        className={[
          'weave-scrollbar',
          `weave-scrollbar--${size}`,
          themeTokenClassName,
          scrollbarThemeClassName,
          'weave-scrollbar--vertical',
          tracked ? 'weave-scrollbar--tracked' : undefined,
        ].filter(Boolean).join(' ')}
        onPointerDown={(event) => pageTrack('vertical', event)}
        data={{
          'weave-scrollbar': '',
          'weave-scrollbar-orientation': 'vertical',
          'weave-scrollbar-visible': 'false',
          'weave-scrollbar-tracked': tracked || undefined,
        }}
      >
        <ScrollbarView
          ref={verticalThumbRef}
          className="weave-scrollbar__thumb"
          onPointerDown={(event) => beginDrag('vertical', event)}
          onPointerMove={(event) => continueDrag('vertical', event)}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          data={{
            'weave-scrollbar-thumb': '',
          }}
        />
      </ScrollbarView>

      <ScrollbarView
        ref={horizontalTrackRef}
        aria-hidden
        className={[
          'weave-scrollbar',
          `weave-scrollbar--${size}`,
          themeTokenClassName,
          scrollbarThemeClassName,
          'weave-scrollbar--horizontal',
          tracked ? 'weave-scrollbar--tracked' : undefined,
        ].filter(Boolean).join(' ')}
        onPointerDown={(event) => pageTrack('horizontal', event)}
        data={{
          'weave-scrollbar': '',
          'weave-scrollbar-orientation': 'horizontal',
          'weave-scrollbar-visible': 'false',
          'weave-scrollbar-tracked': tracked || undefined,
        }}
      >
        <ScrollbarView
          ref={horizontalThumbRef}
          className="weave-scrollbar__thumb"
          onPointerDown={(event) => beginDrag('horizontal', event)}
          onPointerMove={(event) => continueDrag('horizontal', event)}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          data={{
            'weave-scrollbar-thumb': '',
          }}
        />
      </ScrollbarView>
    </>,
    document.body,
  )
}
