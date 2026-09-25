import {
  useInsertionEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
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

function applyDragVisual(
  thumb: HTMLElement,
  offset: number,
  startOffset: number,
  maxOffset: number,
  thumbSize: number,
  shrinkMin: number,
  stretchMax: number,
): void {
  const progress = dragProgress(offset, startOffset, maxOffset)
  const pressScale = 0.82
  const scale =
    pressScale - (pressScale - shrinkMin) * progress
  const extension = thumbSize * stretchMax * progress

  thumb.style.transform =
    `translateX(${offset}px) scale(${scale})`
  thumb.style.setProperty(
    '--weave-switch-drag-extension',
    `${extension}px`,
  )

  if (offset > startOffset) {
    thumb.dataset.weaveSwitchDragDirection = 'forward'
  } else if (offset < startOffset) {
    thumb.dataset.weaveSwitchDragDirection = 'backward'
  } else {
    delete thumb.dataset.weaveSwitchDragDirection
  }
}

function switchThumb(root: HTMLDivElement): HTMLDivElement | null {
  return root.querySelector<HTMLDivElement>(
    '[data-weave-switch-thumb]',
  )
}

function clearDragVisual(root: HTMLDivElement): void {
  delete root.dataset.weaveSwitchDragging

  const thumb = switchThumb(root)
  if (thumb === null) return

  thumb.style.removeProperty('transform')
  thumb.style.removeProperty('--weave-switch-drag-extension')
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
  const dragStretchMax = switchBase?.thumbDragStretch ?? 0.7
  const isControlled = checked !== undefined
  const currentChecked = checked ?? uncontrolledChecked
  const dragRef = useRef<SwitchDragState | null>(null)
  const suppressClickRef = useRef(false)
  const suppressClickTimerRef = useRef<number | null>(null)

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

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    viewProps.onPointerDown?.(event)

    if (
      event.defaultPrevented ||
      viewProps.disabled ||
      event.button !== 0
    ) {
      return
    }

    const target = event.target
    if (!(target instanceof Element)) return

    const thumb = target.closest<HTMLElement>(
      '[data-weave-switch-thumb]',
    )

    if (thumb === null || !event.currentTarget.contains(thumb)) return

    const root = event.currentTarget
    const rootRect = root.getBoundingClientRect()
    const thumbRect = thumb.getBoundingClientRect()
    const inset = parseFloat(getComputedStyle(thumb).left) || 0
    const maxOffset = Math.max(
      0,
      rootRect.width - thumbRect.width - inset * 2,
    )
    const startOffset = currentChecked ? maxOffset : 0

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset,
      maxOffset,
      currentOffset: startOffset,
      thumbSize: thumbRect.width,
      moved: false,
    }

    root.focus()
    root.dataset.weaveSwitchDragging = 'true'
    applyDragVisual(
      thumb,
      startOffset,
      startOffset,
      maxOffset,
      thumbRect.width,
      dragShrinkMin,
      dragStretchMax,
    )
    root.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    viewProps.onPointerMove?.(event)
    if (event.defaultPrevented) return

    const drag = dragRef.current

    if (drag === null || drag.pointerId !== event.pointerId) return

    const delta = event.clientX - drag.startX
    const nextOffset = Math.min(
      drag.maxOffset,
      Math.max(0, drag.startOffset + delta),
    )

    drag.currentOffset = nextOffset
    if (Math.abs(delta) >= DRAG_THRESHOLD) {
      drag.moved = true
    }

    const thumb = switchThumb(event.currentTarget)
    if (thumb !== null) {
      applyDragVisual(
        thumb,
        nextOffset,
        drag.startOffset,
        drag.maxOffset,
        drag.thumbSize,
        dragShrinkMin,
        dragStretchMax,
      )
    }

    event.preventDefault()
  }

  const finishDrag = (
    event: PointerEvent<HTMLDivElement>,
    applyValue: boolean,
  ) => {
    const drag = dragRef.current
    if (drag === null || drag.pointerId !== event.pointerId) return

    const root = event.currentTarget
    const nextChecked =
      drag.maxOffset > 0
        ? drag.currentOffset >= drag.maxOffset / 2
        : currentChecked

    clearDragVisual(root)
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

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    viewProps.onPointerUp?.(event)
    finishDrag(event, !event.defaultPrevented)
  }

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
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
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      data={{
        ...viewProps.data,
        'weave-switch': '',
        'weave-switch-size': size,
      }}
    >
      <View
        className="weave-switch__thumb"
        data={{
          'weave-switch-thumb': '',
        }}
      />
    </View>
  )
}
