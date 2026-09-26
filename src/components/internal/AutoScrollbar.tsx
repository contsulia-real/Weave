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

const SCROLLBAR_INSET_PX = 4

interface ScrollbarOverflowIntent {
  styleOverflow?: string
  styleOverflowX?: string
  styleOverflowY?: string
}

interface AutoScrollbarProps<TTarget extends HTMLElement> {
  targetRef: RefObject<TTarget | null>
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

interface ScrollMetrics {
  verticalAvailable: number
  verticalMaxScroll: number
  horizontalAvailable: number
  horizontalMaxScroll: number
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

interface RadiusAxes {
  x: number
  y: number
}

interface CornerRadii {
  topLeft: RadiusAxes
  topRight: RadiusAxes
  bottomRight: RadiusAxes
  bottomLeft: RadiusAxes
}

function cssLengthPixels(value: string, reference: number): number {
  const trimmed = value.trim()
  if (trimmed.endsWith('%')) {
    const percent = Number.parseFloat(trimmed)
    return Number.isFinite(percent)
      ? reference * percent / 100
      : 0
  }

  const numeric = Number.parseFloat(trimmed)
  return Number.isFinite(numeric) ? numeric : 0
}

function radiusAxes(
  value: string,
  width: number,
  height: number,
): RadiusAxes {
  const [xValue = '0', yValue = xValue] =
    value.trim().split(/\s+/)

  return {
    x: Math.max(0, cssLengthPixels(xValue, width)),
    y: Math.max(0, cssLengthPixels(yValue, height)),
  }
}

function effectiveCornerRadii(
  computed: CSSStyleDeclaration,
  rect: DOMRect,
): CornerRadii {
  const radii: CornerRadii = {
    topLeft: radiusAxes(
      computed.borderTopLeftRadius,
      rect.width,
      rect.height,
    ),
    topRight: radiusAxes(
      computed.borderTopRightRadius,
      rect.width,
      rect.height,
    ),
    bottomRight: radiusAxes(
      computed.borderBottomRightRadius,
      rect.width,
      rect.height,
    ),
    bottomLeft: radiusAxes(
      computed.borderBottomLeftRadius,
      rect.width,
      rect.height,
    ),
  }

  const ratio = (available: number, requested: number) =>
    requested <= 0 ? 1 : available / requested

  const scale = Math.min(
    1,
    ratio(rect.width, radii.topLeft.x + radii.topRight.x),
    ratio(rect.width, radii.bottomLeft.x + radii.bottomRight.x),
    ratio(rect.height, radii.topLeft.y + radii.bottomLeft.y),
    ratio(rect.height, radii.topRight.y + radii.bottomRight.y),
  )

  if (scale >= 1) return radii

  for (const radius of Object.values(radii)) {
    radius.x *= scale
    radius.y *= scale
  }

  return radii
}

function syncScrollbarLayer(
  hitRegion: HTMLElement,
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
    hitRegion.style.removeProperty('z-index')
  } else {
    hitRegion.style.zIndex = String(layer + 1)
  }
}

export function AutoScrollbar<TTarget extends HTMLElement>({
  targetRef,
  config,
  overflowIntent,
}: AutoScrollbarProps<TTarget>) {
  useInsertionEffect(ensureScrollbarStylesheet, [])

  const verticalHitRegionRef = useRef<HTMLDivElement>(null)
  const horizontalHitRegionRef = useRef<HTMLDivElement>(null)
  const verticalThumbRef = useRef<HTMLDivElement>(null)
  const horizontalThumbRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const metricsRef = useRef<ScrollMetrics>({
    verticalAvailable: 0,
    verticalMaxScroll: 0,
    horizontalAvailable: 0,
    horizontalMaxScroll: 0,
  })

  const size: ScrollbarSize = config?.size ?? 'medium'
  const { theme } = useTheme()
  const themeTokenClassName = useRuntimeStyleClass(
    'scrollbar-tokens',
    themeVariables(theme),
  )
  const scrollbarThemeClassName = useRuntimeStyleClass(
    'scrollbar-theme',
    resolveScrollbarTheme(theme, size, config),
  )

  const syncThumbOffsets = useCallback(() => {
    const target = targetRef.current
    const verticalThumb = verticalThumbRef.current
    const horizontalThumb = horizontalThumbRef.current

    if (
      target === null ||
      verticalThumb === null ||
      horizontalThumb === null
    ) {
      return
    }

    const metrics = metricsRef.current

    const verticalOffset =
      metrics.verticalMaxScroll === 0
        ? 0
        : (
            target.scrollTop /
            metrics.verticalMaxScroll
          ) * metrics.verticalAvailable

    const horizontalOffset =
      metrics.horizontalMaxScroll === 0
        ? 0
        : (
            target.scrollLeft /
            metrics.horizontalMaxScroll
          ) * metrics.horizontalAvailable

    verticalThumb.style.transform =
      `translateY(${verticalOffset}px)`
    horizontalThumb.style.transform =
      `translateX(${horizontalOffset}px)`
  }, [targetRef])

  const updateGeometry = useCallback(() => {
    // Theme classes can change scrollbar thickness and therefore geometry.
    void themeTokenClassName
    void scrollbarThemeClassName

    const target = targetRef.current
    const verticalHitRegion = verticalHitRegionRef.current
    const horizontalHitRegion = horizontalHitRegionRef.current
    const verticalThumb = verticalThumbRef.current
    const horizontalThumb = horizontalThumbRef.current

    if (
      target === null ||
      verticalHitRegion === null ||
      horizontalHitRegion === null ||
      verticalThumb === null ||
      horizontalThumb === null
    ) {
      return
    }

    const computed = getComputedStyle(target)
    const rect = target.getBoundingClientRect()
    const borderTop = parseFloat(computed.borderTopWidth) || 0
    const borderRight = parseFloat(computed.borderRightWidth) || 0
    const borderBottom = parseFloat(computed.borderBottomWidth) || 0
    const borderLeft = parseFloat(computed.borderLeftWidth) || 0
    const inset = SCROLLBAR_INSET_PX
    const radii = effectiveCornerRadii(computed, rect)

    syncScrollbarLayer(verticalHitRegion, target)
    syncScrollbarLayer(horizontalHitRegion, target)

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

    verticalHitRegion.dataset.weaveScrollbarVisible = String(verticalVisible)
    horizontalHitRegion.dataset.weaveScrollbarVisible = String(horizontalVisible)

    const verticalThickness = verticalVisible
      ? parseFloat(getComputedStyle(verticalThumb).width) || 0
      : 0
    const horizontalThickness = horizontalVisible
      ? parseFloat(getComputedStyle(horizontalThumb).height) || 0
      : 0

    const verticalStartInset = Math.max(
      borderTop + inset,
      radii.topRight.y,
    )
    const verticalEndInset = Math.max(
      borderBottom + inset,
      radii.bottomRight.y,
      horizontalVisible
        ? borderBottom + inset * 2 + horizontalThickness
        : 0,
    )
    const horizontalStartInset = Math.max(
      borderLeft + inset,
      radii.bottomLeft.x,
    )
    const horizontalEndInset = Math.max(
      borderRight + inset,
      radii.bottomRight.x,
      verticalVisible
        ? borderRight + inset * 2 + verticalThickness
        : 0,
    )

    let verticalAvailable = 0
    let verticalMaxScroll = 0
    let horizontalAvailable = 0
    let horizontalMaxScroll = 0

    if (verticalVisible) {
      const hitRegionLength = Math.max(
        0,
        rect.height - verticalStartInset - verticalEndInset,
      )
      const thumbLength = Math.min(
        hitRegionLength,
        Math.max(
          24,
          hitRegionLength * (target.clientHeight / target.scrollHeight),
        ),
      )

      verticalAvailable = Math.max(0, hitRegionLength - thumbLength)
      verticalMaxScroll = Math.max(
        0,
        target.scrollHeight - target.clientHeight,
      )

      verticalHitRegion.style.top =
        `${rect.top + verticalStartInset}px`
      verticalHitRegion.style.left = `${rect.right}px`
      verticalHitRegion.style.height = `${hitRegionLength}px`
      verticalHitRegion.style.setProperty(
        '--weave-scrollbar-edge-inset',
        `${borderRight + inset}px`,
      )
      verticalThumb.style.height = `${thumbLength}px`
    }

    if (horizontalVisible) {
      const hitRegionLength = Math.max(
        0,
        rect.width - horizontalStartInset - horizontalEndInset,
      )
      const thumbLength = Math.min(
        hitRegionLength,
        Math.max(
          24,
          hitRegionLength * (target.clientWidth / target.scrollWidth),
        ),
      )

      horizontalAvailable = Math.max(0, hitRegionLength - thumbLength)
      horizontalMaxScroll = Math.max(
        0,
        target.scrollWidth - target.clientWidth,
      )

      horizontalHitRegion.style.left =
        `${rect.left + horizontalStartInset}px`
      horizontalHitRegion.style.top = `${rect.bottom}px`
      horizontalHitRegion.style.width = `${hitRegionLength}px`
      horizontalHitRegion.style.setProperty(
        '--weave-scrollbar-edge-inset',
        `${borderBottom + inset}px`,
      )
      horizontalThumb.style.width = `${thumbLength}px`
    }

    metricsRef.current = {
      verticalAvailable,
      verticalMaxScroll,
      horizontalAvailable,
      horizontalMaxScroll,
    }

    syncThumbOffsets()
  }, [
    overflowIntent,
    scrollbarThemeClassName,
    syncThumbOffsets,
    targetRef,
    themeTokenClassName,
  ])

  useLayoutEffect(() => {
    const target = targetRef.current
    if (target === null) return

    updateGeometry()

    const onScroll = () => syncThumbOffsets()
    const onWindowResize = () => updateGeometry()
    const onDocumentScroll = (event: Event) => {
      if (event.target === target) return
      updateGeometry()
    }

    target.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onWindowResize)
    document.addEventListener('scroll', onDocumentScroll, true)

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(updateGeometry)

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

            updateGeometry()
          })

    mutationObserver?.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
    })

    return () => {
      target.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onWindowResize)
      document.removeEventListener('scroll', onDocumentScroll, true)
      resizeObserver?.disconnect()
      mutationObserver?.disconnect()
    }
  }, [syncThumbOffsets, targetRef, updateGeometry])

  const beginDrag = (
    orientation: Orientation,
    event: PointerEvent<HTMLDivElement>,
  ) => {
    const target = targetRef.current
    const hitRegion =
      orientation === 'vertical'
        ? verticalHitRegionRef.current
        : horizontalHitRegionRef.current
    const thumb =
      orientation === 'vertical'
        ? verticalThumbRef.current
        : horizontalThumbRef.current

    if (target === null || hitRegion === null || thumb === null) return

    event.preventDefault()
    event.stopPropagation()
    hitRegion.setPointerCapture?.(event.pointerId)
    hitRegion.dataset.weaveScrollbarDragging = 'true'

    const hitRegionRect = hitRegion.getBoundingClientRect()
    const thumbRect = thumb.getBoundingClientRect()
    const hitRegionLength =
      orientation === 'vertical' ? hitRegionRect.height : hitRegionRect.width
    const thumbLength =
      orientation === 'vertical' ? thumbRect.height : thumbRect.width
    const available = Math.max(0, hitRegionLength - thumbLength)
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

    syncThumbOffsets()
  }

  const endDrag = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    const drag = dragRef.current
    if (drag === null || drag.pointerId !== event.pointerId) return

    const hitRegion =
      drag.orientation === 'vertical'
        ? verticalHitRegionRef.current
        : horizontalHitRegionRef.current
    hitRegion?.releasePointerCapture?.(event.pointerId)
    if (hitRegion !== null) {
      delete hitRegion.dataset.weaveScrollbarDragging
    }

    dragRef.current = null
  }

  const pageHitRegion = (
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

    syncThumbOffsets()
  }

  const handleHitRegionPointerDown = (
    orientation: Orientation,
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (event.target !== event.currentTarget) return

    const thumb =
      orientation === 'vertical'
        ? verticalThumbRef.current
        : horizontalThumbRef.current

    if (thumb === null) return

    const thumbRect = thumb.getBoundingClientRect()
    const pointer =
      orientation === 'vertical' ? event.clientY : event.clientX
    const start =
      orientation === 'vertical' ? thumbRect.top : thumbRect.left
    const end =
      orientation === 'vertical' ? thumbRect.bottom : thumbRect.right

    if (pointer >= start && pointer <= end) {
      beginDrag(orientation, event)
      return
    }

    pageHitRegion(orientation, event)
  }


  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      <ScrollbarView
        ref={verticalHitRegionRef}
        aria-hidden
        className={[
          'weave-scrollbar',
          `weave-scrollbar--${size}`,
          themeTokenClassName,
          scrollbarThemeClassName,
          'weave-scrollbar--vertical',
        ].filter(Boolean).join(' ')}
        onPointerDown={(event) =>
          handleHitRegionPointerDown('vertical', event)
        }
        onPointerMove={(event) => continueDrag('vertical', event)}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        data={{
          'weave-scrollbar': '',
          'weave-scrollbar-orientation': 'vertical',
          'weave-scrollbar-visible': 'false',
        }}
      >
        <ScrollbarView
          ref={verticalThumbRef}
          className="weave-scrollbar__thumb"
          onPointerDown={(event) => beginDrag('vertical', event)}
          data={{
            'weave-scrollbar-thumb': '',
          }}
        />
      </ScrollbarView>

      <ScrollbarView
        ref={horizontalHitRegionRef}
        aria-hidden
        className={[
          'weave-scrollbar',
          `weave-scrollbar--${size}`,
          themeTokenClassName,
          scrollbarThemeClassName,
          'weave-scrollbar--horizontal',
        ].filter(Boolean).join(' ')}
        onPointerDown={(event) =>
          handleHitRegionPointerDown('horizontal', event)
        }
        onPointerMove={(event) => continueDrag('horizontal', event)}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        data={{
          'weave-scrollbar': '',
          'weave-scrollbar-orientation': 'horizontal',
          'weave-scrollbar-visible': 'false',
        }}
      >
        <ScrollbarView
          ref={horizontalThumbRef}
          className="weave-scrollbar__thumb"
          onPointerDown={(event) => beginDrag('horizontal', event)}
          data={{
            'weave-scrollbar-thumb': '',
          }}
        />
      </ScrollbarView>
    </>,
    document.body,
  )
}
