import {
  useEffect,
  useInsertionEffect,
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

type DragDirection = 'forward' | 'backward' | null

interface SwitchDragState {
  pointerId: number
  startX: number
  startOffset: number
  maxOffset: number
  currentOffset: number
  moved: boolean
  direction: DragDirection
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

function dragDirection(
  offset: number,
  startOffset: number,
): DragDirection {
  if (offset > startOffset) return 'forward'
  if (offset < startOffset) return 'backward'
  return null
}

function applyDragVisual(
  thumb: HTMLDivElement,
  drag: SwitchDragState,
  offset: number,
  shrinkMin: number,
  stretchMax: number,
): void {
  const progress = dragProgress(
    offset,
    drag.startOffset,
    drag.maxOffset,
  )
  const pressScale = 0.82
  const scale =
    pressScale - (pressScale - shrinkMin) * progress
  thumb.style.transform =
    `translateX(${offset}px) scale(${scale})`
  thumb.style.setProperty(
    '--weave-switch-drag-progress',
    String(progress),
  )

  const nextDirection = dragDirection(offset, drag.startOffset)
  if (nextDirection === drag.direction) return

  drag.direction = nextDirection

  if (nextDirection === null) {
    delete thumb.dataset.weaveSwitchDragDirection
  } else {
    thumb.dataset.weaveSwitchDragDirection = nextDirection
  }
}

function clearDragVisual(
  root: HTMLDivElement,
  thumb: HTMLDivElement | null,
): void {
  delete root.dataset.weaveSwitchDragging
  if (thumb === null) return

  thumb.style.removeProperty('transform')
  thumb.style.removeProperty('--weave-switch-drag-progress')
  delete thumb.dataset.weaveSwitchDragDirection
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
  const themeClassName = useRuntimeStyleClass(
    'switch-theme',
    resolveSwitchTheme(theme, size),
  )

  const [uncontrolledChecked, setUncontrolledChecked] =
    useState(defaultChecked)
  const switchBase = theme.components.Switch?.base
  const dragShrinkMin = switchBase?.thumbDragShrink ?? 0.72
  const isControlled = checked !== undefined
  const currentChecked = checked ?? uncontrolledChecked
  const dragRef = useRef<SwitchDragState | null>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const nativeMoveCleanupRef = useRef<(() => void) | null>(null)
  const suppressClickRef = useRef(false)
  const suppressClickTimerRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      nativeMoveCleanupRef.current?.()
      nativeMoveCleanupRef.current = null

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

    applyDragVisual(
      thumb,
      drag,
      nextOffset,
      dragShrinkMin,
      dragStretchMax,
    )

    return true
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

    const thumb = thumbRef.current
    const target = event.target

    if (
      thumb === null ||
      !(target instanceof Node) ||
      !thumb.contains(target)
    ) {
      return
    }

    const root = event.currentTarget
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
      moved: false,
      direction: null,
    }

    dragRef.current = drag

    root.focus()
    root.dataset.weaveSwitchDragging = 'true'
    applyDragVisual(
      thumb,
      drag,
      startOffset,
      dragShrinkMin,
      dragStretchMax,
    )
    root.setPointerCapture?.(event.pointerId)

    nativeMoveCleanupRef.current?.()
    nativeMoveCleanupRef.current = null

    if (viewProps.onPointerMove === undefined) {
      const pointerId = event.pointerId
      const onNativePointerMove = (
        nativeEvent: globalThis.PointerEvent,
      ) => {
        if (nativeEvent.pointerId !== pointerId) return

        if (moveDrag(pointerId, nativeEvent.clientX)) {
          nativeEvent.preventDefault()
        }
      }

      root.addEventListener('pointermove', onNativePointerMove)
      nativeMoveCleanupRef.current = () => {
        root.removeEventListener('pointermove', onNativePointerMove)
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

  const finishDrag = (
    event: ReactPointerEvent<HTMLDivElement>,
    applyValue: boolean,
  ) => {
    const drag = dragRef.current
    if (drag === null || drag.pointerId !== event.pointerId) return

    nativeMoveCleanupRef.current?.()
    nativeMoveCleanupRef.current = null

    const root = event.currentTarget
    const nextChecked =
      drag.maxOffset > 0
        ? drag.currentOffset >= drag.maxOffset / 2
        : currentChecked

    clearDragVisual(root, thumbRef.current)

    if (root.hasPointerCapture?.(event.pointerId)) {
      root.releasePointerCapture(event.pointerId)
    }

    dragRef.current = null

    if (drag.moved) {
      suppressFollowUpClick()
      event.preventDefault()
    }

    if (
      applyValue &&
      drag.moved &&
      nextChecked !== currentChecked
    ) {
      commit(nextChecked)
    }
  }

  const handlePointerUp = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    viewProps.onPointerUp?.(event)
    finishDrag(event, !event.defaultPrevented)
  }

  const handlePointerCancel = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    viewProps.onPointerCancel?.(event)
    finishDrag(event, false)
  }

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
        viewProps.onPointerMove === undefined
          ? undefined
          : handlePointerMove
      }
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
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
