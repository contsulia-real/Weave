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
  moved: boolean
}

const DRAG_THRESHOLD = 3

function switchThumb(root: HTMLDivElement): HTMLDivElement | null {
  return root.querySelector<HTMLDivElement>(
    '[data-weave-switch-thumb]',
  )
}

function clearDragVisual(root: HTMLDivElement): void {
  delete root.dataset.weaveSwitchDragging
  switchThumb(root)?.style.removeProperty('transform')
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
      moved: false,
    }

    root.focus()
    root.dataset.weaveSwitchDragging = 'true'
    thumb.style.transform = `translateX(${startOffset}px)`
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
      thumb.style.transform = `translateX(${nextOffset}px)`
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
