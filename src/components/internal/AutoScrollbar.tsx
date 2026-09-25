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
import { ensureScrollbarStylesheet } from '../../renderers/dom/scrollbar-stylesheet'
import { useViewHost } from './use-view-host'

type Orientation = 'vertical' | 'horizontal'

interface AutoScrollbarProps {
  targetRef: RefObject<HTMLDivElement | null>
  config?: ScrollbarConfig
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
    mergedStyle,
    resolved,
  } = useViewHost(props)

  return (
    <div
      {...resolved.domProps}
      ref={elementRef}
      data-weave-view=""
      data-weave-layout={resolved.layout}
      className={className}
      style={mergedStyle}
    >
      {children}
    </div>
  )
}

function allowsNativeScrolling(value: string): boolean {
  return value === 'auto' || value === 'scroll' || value === 'overlay'
}

const TOKEN_NAME = /^[A-Za-z][A-Za-z0-9_-]*$/

function copyToken(
  track: HTMLElement,
  computed: CSSStyleDeclaration,
  variable: string,
): void {
  const value = computed.getPropertyValue(variable).trim()
  if (value.length > 0) {
    track.style.setProperty(variable, value)
  }
}

function syncScrollbarTheme(
  track: HTMLElement,
  computed: CSSStyleDeclaration,
  config: ScrollbarConfig | undefined,
): void {
  track.style.removeProperty('--weave-scrollbar-color')
  track.style.removeProperty('--weave-scrollbar-track-color')
  track.style.removeProperty('--weave-scrollbar-radius')
  track.style.removeProperty('--weave-scrollbar-opacity')

  copyToken(track, computed, '--weave-color-secondary')
  copyToken(track, computed, '--weave-radius-full')

  if (config?.color !== undefined) {
    if (TOKEN_NAME.test(config.color)) {
      copyToken(
        track,
        computed,
        `--weave-color-${config.color}`,
      )
      track.style.setProperty(
        '--weave-scrollbar-color',
        `var(--weave-color-${config.color}, ${config.color})`,
      )
    } else {
      track.style.setProperty('--weave-scrollbar-color', config.color)
    }
  }

  if (config?.trackColor !== undefined) {
    if (TOKEN_NAME.test(config.trackColor)) {
      copyToken(
        track,
        computed,
        `--weave-color-${config.trackColor}`,
      )
      track.style.setProperty(
        '--weave-scrollbar-track-color',
        `var(--weave-color-${config.trackColor}, ${config.trackColor})`,
      )
    } else {
      track.style.setProperty(
        '--weave-scrollbar-track-color',
        config.trackColor,
      )
    }
  }

  if (config?.radius !== undefined) {
    if (
      typeof config.radius === 'string' &&
      ['small', 'medium', 'large', 'full'].includes(config.radius)
    ) {
      copyToken(
        track,
        computed,
        `--weave-radius-${config.radius}`,
      )
      track.style.setProperty(
        '--weave-scrollbar-radius',
        `var(--weave-radius-${config.radius})`,
      )
    } else if (config.radius === 'none') {
      track.style.setProperty('--weave-scrollbar-radius', '0')
    } else {
      track.style.setProperty(
        '--weave-scrollbar-radius',
        typeof config.radius === 'number'
          ? `${config.radius}rem`
          : config.radius,
      )
    }
  }

  if (config?.opacity !== undefined) {
    track.style.setProperty(
      '--weave-scrollbar-opacity',
      String(config.opacity),
    )
  }
}

export function AutoScrollbar({
  targetRef,
  config,
}: AutoScrollbarProps) {
  useInsertionEffect(ensureScrollbarStylesheet, [])

  const verticalTrackRef = useRef<HTMLDivElement>(null)
  const horizontalTrackRef = useRef<HTMLDivElement>(null)
  const verticalThumbRef = useRef<HTMLDivElement>(null)
  const horizontalThumbRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)

  const size: ScrollbarSize = config?.size ?? 'medium'

  const update = useCallback(() => {
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

    syncScrollbarTheme(verticalTrack, computed, config)
    syncScrollbarTheme(horizontalTrack, computed, config)

    const verticalVisible =
      allowsNativeScrolling(computed.overflowY) &&
      target.scrollHeight > target.clientHeight + 1 &&
      rect.height > 0

    const horizontalVisible =
      allowsNativeScrolling(computed.overflowX) &&
      target.scrollWidth > target.clientWidth + 1 &&
      rect.width > 0

    verticalTrack.dataset.weaveScrollbarVisible = String(verticalVisible)
    horizontalTrack.dataset.weaveScrollbarVisible = String(horizontalVisible)

    if (verticalVisible) {
      const trackLength = rect.height
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
      const trackLength = rect.width
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
    config,
    targetRef,
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
        className={`weave-scrollbar weave-scrollbar--${size} weave-scrollbar--vertical`}
        onPointerDown={(event) => pageTrack('vertical', event)}
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
        className={`weave-scrollbar weave-scrollbar--${size} weave-scrollbar--horizontal`}
        onPointerDown={(event) => pageTrack('horizontal', event)}
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
