import {
  useEffect,
  useInsertionEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import type { SwitchProps } from '../core/switch-types'
import { resolveSwitchTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ensureSwitchStylesheet } from '../renderers/dom/switch-stylesheet'
import { useTheme } from '../theme/theme-context'
import { View } from './View'

interface SwitchDragState {
  pointerId: number
  startX: number
  startOffset: number
  maxOffset: number
  currentOffset: number
  thumbSize: number
  moved: boolean
}

const DRAG_THRESHOLD = 3

function dragProgress(
  offset: number,
  startOffset: number,
  maxOffset: number,
): number {
  const thresholdDistance = maxOffset / 2
  if (thresholdDistance <= 0) return 0

  return Math.min(
    1,
    Math.abs(offset - startOffset) / thresholdDistance,
  )
}

function applyDragShape(
  thumb: HTMLDivElement,
  drag: SwitchDragState,
  offset: number,
  shrink: number,
  maxWidth: number,
): void {
  const progress = dragProgress(
    offset,
    drag.startOffset,
    drag.maxOffset,
  )
  const height = drag.thumbSize * shrink
  const widthScale =
    shrink + (maxWidth - shrink) * progress
  const width = drag.thumbSize * widthScale

  const x = offset + (drag.thumbSize - width) / 2
  const y = (drag.thumbSize - height) / 2

  thumb.style.width = `${width}px`
  thumb.style.height = `${height}px`
  thumb.style.transform =
    `translate(${x}px, ${y}px)`
}

function clearDragShape(thumb: HTMLDivElement): void {
  thumb.style.removeProperty('width')
  thumb.style.removeProperty('height')
  thumb.style.removeProperty('transform')
}

export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  size = 'medium',
  viewProps = {},
}: SwitchProps) {
  useInsertionEffect(ensureSwitchStylesheet, [])

  const { theme } = useTheme()
  const themeDeclarations = useMemo(
    () => resolveSwitchTheme(theme, size),
    [size, theme],
  )
  const themeClassName = useRuntimeStyleClass(
    'switch-theme',
    themeDeclarations,
  )

  const [uncontrolledChecked, setUncontrolledChecked] =
    useState(defaultChecked)
  const isControlled = checked !== undefined
  const currentChecked = checked ?? uncontrolledChecked

  const switchBase = theme.components.Switch?.base
  const dragShrink = switchBase?.thumbDragShrink ?? 0.68
  const dragMaxWidth = switchBase?.thumbDragMaxWidth ?? 1.35

  const thumbRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<SwitchDragState | null>(null)
  const nativeDragCleanupRef = useRef<(() => void) | null>(null)
  const suppressClickRef = useRef(false)
  const suppressClickTimerRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      nativeDragCleanupRef.current?.()

      if (
        suppressClickTimerRef.current !== null &&
        typeof window !== 'undefined'
      ) {
        window.clearTimeout(suppressClickTimerRef.current)
      }
    },
    [],
  )

  const commit = (nextChecked: boolean) => {
    if (!isControlled) {
      setUncontrolledChecked(nextChecked)
    }

    onChange?.(nextChecked)
  }

  const toggle = () => {
    if (viewProps.disabled) return
    commit(!currentChecked)
  }

  const suppressFollowUpClick = () => {
    suppressClickRef.current = true

    if (
      suppressClickTimerRef.current !== null &&
      typeof window !== 'undefined'
    ) {
      window.clearTimeout(suppressClickTimerRef.current)
    }

    if (typeof window !== 'undefined') {
      suppressClickTimerRef.current = window.setTimeout(() => {
        suppressClickRef.current = false
        suppressClickTimerRef.current = null
      }, 0)
    }
  }

  const moveDrag = (
    pointerId: number,
    clientX: number,
  ): boolean => {
    const drag = dragRef.current
    const thumb = thumbRef.current

    if (
      drag === null ||
      thumb === null ||
      drag.pointerId !== pointerId
    ) {
      return false
    }

    const delta = clientX - drag.startX
    const nextOffset = Math.min(
      drag.maxOffset,
      Math.max(0, drag.startOffset + delta),
    )

    drag.currentOffset = nextOffset

    if (!drag.moved && Math.abs(delta) >= DRAG_THRESHOLD) {
      drag.moved = true
    }

    applyDragShape(
      thumb,
      drag,
      nextOffset,
      dragShrink,
      dragMaxWidth,
    )

    return true
  }

  const finishDrag = (
    root: HTMLDivElement,
    pointerId: number,
    applyValue: boolean,
    preventDefault?: () => void,
  ) => {
    const drag = dragRef.current
    const thumb = thumbRef.current

    if (
      drag === null ||
      thumb === null ||
      drag.pointerId !== pointerId
    ) {
      return
    }

    nativeDragCleanupRef.current?.()
    nativeDragCleanupRef.current = null

    const nextChecked =
      drag.maxOffset > 0
        ? drag.currentOffset >= drag.maxOffset / 2
        : currentChecked

    clearDragShape(thumb)
    delete root.dataset.weaveSwitchDragging

    if (root.hasPointerCapture?.(pointerId)) {
      root.releasePointerCapture(pointerId)
    }

    dragRef.current = null

    if (drag.moved) {
      suppressFollowUpClick()
      preventDefault?.()
    }

    if (
      applyValue &&
      drag.moved &&
      nextChecked !== currentChecked
    ) {
      commit(nextChecked)
    }
  }

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    viewProps.onClick?.(event)
    if (event.defaultPrevented) return

    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }

    toggle()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    viewProps.onKeyDown?.(event)
    if (event.defaultPrevented) return

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      toggle()
    }
  }

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    viewProps.onPointerDown?.(event)

    if (
      event.defaultPrevented ||
      viewProps.disabled ||
      event.button !== 0
    ) {
      return
    }

    const root = event.currentTarget
    const thumb = thumbRef.current
    const target = event.target

    if (
      thumb === null ||
      !(target instanceof Node) ||
      !thumb.contains(target)
    ) {
      return
    }

    const rootRect = root.getBoundingClientRect()
    const thumbRect = thumb.getBoundingClientRect()
    const inset = currentChecked
      ? Math.max(0, rootRect.right - thumbRect.right)
      : Math.max(0, thumbRect.left - rootRect.left)
    const maxOffset = Math.max(
      0,
      rootRect.width - thumbRect.width - inset * 2,
    )
    const startOffset = currentChecked ? maxOffset : 0

    const drag: SwitchDragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset,
      maxOffset,
      currentOffset: startOffset,
      thumbSize: thumbRect.width,
      moved: false,
    }

    dragRef.current = drag
    root.focus()
    root.dataset.weaveSwitchDragging = 'true'

    applyDragShape(
      thumb,
      drag,
      startOffset,
      dragShrink,
      dragMaxWidth,
    )

    root.setPointerCapture?.(event.pointerId)

    nativeDragCleanupRef.current?.()
    nativeDragCleanupRef.current = null

    const usesReactDragHandlers =
      viewProps.onPointerMove !== undefined ||
      viewProps.onPointerUp !== undefined ||
      viewProps.onPointerCancel !== undefined

    if (!usesReactDragHandlers) {
      const pointerId = event.pointerId

      const onMove = (nativeEvent: globalThis.PointerEvent) => {
        if (nativeEvent.pointerId !== pointerId) return

        if (moveDrag(pointerId, nativeEvent.clientX)) {
          nativeEvent.preventDefault()
        }
      }

      const onUp = (nativeEvent: globalThis.PointerEvent) => {
        if (nativeEvent.pointerId !== pointerId) return

        finishDrag(
          root,
          pointerId,
          true,
          () => nativeEvent.preventDefault(),
        )
      }

      const onCancel = (nativeEvent: globalThis.PointerEvent) => {
        if (nativeEvent.pointerId !== pointerId) return
        finishDrag(root, pointerId, false)
      }

      root.addEventListener('pointermove', onMove)
      root.addEventListener('pointerup', onUp)
      root.addEventListener('pointercancel', onCancel)

      nativeDragCleanupRef.current = () => {
        root.removeEventListener('pointermove', onMove)
        root.removeEventListener('pointerup', onUp)
        root.removeEventListener('pointercancel', onCancel)
      }
    }
  }

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    viewProps.onPointerMove?.(event)
    if (event.defaultPrevented) return

    if (moveDrag(event.pointerId, event.clientX)) {
      event.preventDefault()
    }
  }

  const handlePointerUp = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    viewProps.onPointerUp?.(event)

    finishDrag(
      event.currentTarget,
      event.pointerId,
      !event.defaultPrevented,
      () => event.preventDefault(),
    )
  }

  const handlePointerCancel = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    viewProps.onPointerCancel?.(event)
    finishDrag(event.currentTarget, event.pointerId, false)
  }

  const usesReactDragHandlers =
    viewProps.onPointerMove !== undefined ||
    viewProps.onPointerUp !== undefined ||
    viewProps.onPointerCancel !== undefined

  return (
    <View
      {...viewProps}
      className={[
        'weave-switch',
        `weave-switch--${size}`,
        themeClassName,
        viewProps.className,
      ].filter(Boolean).join(' ')}
      role="switch"
      checked={currentChecked}
      focusable={viewProps.focusable ?? true}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={
        usesReactDragHandlers ? handlePointerMove : undefined
      }
      onPointerUp={
        usesReactDragHandlers ? handlePointerUp : undefined
      }
      onPointerCancel={
        usesReactDragHandlers ? handlePointerCancel : undefined
      }
      data={{
        ...viewProps.data,
        'weave-switch': '',
        'weave-switch-size': size,
      }}
    >
      <View
        ref={thumbRef}
        className="weave-switch__thumb"
        data={{
          'weave-switch-thumb': '',
        }}
      />
    </View>
  )
}
