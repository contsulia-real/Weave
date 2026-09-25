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
  moved: boolean
  direction: 'forward' | 'backward' | null
}

const DRAG_THRESHOLD = 3
const DRAG_PRESS_SCALE = 0.82

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
  thumb: HTMLDivElement,
  core: HTMLDivElement,
  tail: HTMLDivElement,
  drag: SwitchDragState,
  offset: number,
  shrinkMin: number,
): void {
  const progress = dragProgress(
    offset,
    drag.startOffset,
    drag.maxOffset,
  )
  const scale =
    DRAG_PRESS_SCALE -
    (DRAG_PRESS_SCALE - shrinkMin) * progress

  thumb.style.transform = `translateX(${offset}px)`
  core.style.transform = `scale(${scale})`
  tail.style.transform =
    `translateY(-50%) scaleX(${progress})`

  const direction =
    offset > drag.startOffset
      ? 'forward'
      : offset < drag.startOffset
        ? 'backward'
        : null

  if (direction === drag.direction) return

  drag.direction = direction

  if (direction === null) {
    delete thumb.dataset.weaveSwitchDragDirection
  } else {
    thumb.dataset.weaveSwitchDragDirection = direction
  }
}

function clearDragVisual(
  root: HTMLDivElement,
  thumb: HTMLDivElement,
  core: HTMLDivElement,
  tail: HTMLDivElement,
): void {
  delete root.dataset.weaveSwitchDragging
  delete thumb.dataset.weaveSwitchDragDirection
  thumb.style.removeProperty('transform')
  core.style.removeProperty('transform')
  tail.style.removeProperty('transform')
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
  const switchThemeDeclarations = useMemo(
    () => resolveSwitchTheme(theme, size),
    [size, theme],
  )
  const themeClassName = useRuntimeStyleClass(
    'switch-theme',
    switchThemeDeclarations,
  )

  const [uncontrolledChecked, setUncontrolledChecked] =
    useState(defaultChecked)
  const isControlled = checked !== undefined
  const currentChecked = checked ?? uncontrolledChecked
  const dragShrinkMin =
    theme.components.Switch?.base?.thumbDragShrink ?? 0.68

  const thumbRef = useRef<HTMLDivElement>(null)
  const coreRef = useRef<HTMLDivElement>(null)
  const tailRef = useRef<HTMLDivElement>(null)
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

  const moveDrag = (pointerId: number, clientX: number): boolean => {
    const drag = dragRef.current
    const thumb = thumbRef.current
    const core = coreRef.current
    const tail = tailRef.current

    if (
      drag === null ||
      thumb === null ||
      core === null ||
      tail === null ||
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
      core,
      tail,
      drag,
      nextOffset,
      dragShrinkMin,
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
    const core = coreRef.current
    const tail = tailRef.current

    if (
      drag === null ||
      thumb === null ||
      core === null ||
      tail === null ||
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

    clearDragVisual(root, thumb, core, tail)

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
    const core = coreRef.current
    const tail = tailRef.current
    const target = event.target

    if (
      thumb === null ||
      core === null ||
      tail === null ||
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
      moved: false,
      direction: null,
    }

    dragRef.current = drag
    root.focus()
    root.dataset.weaveSwitchDragging = 'true'
    applyDragVisual(
      thumb,
      core,
      tail,
      drag,
      startOffset,
      dragShrinkMin,
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
      <div
        ref={thumbRef}
        className="weave-switch__thumb"
        data-weave-switch-thumb=""
      >
        <div
          ref={tailRef}
          className="weave-switch__drag-tail"
          aria-hidden="true"
        />
        <div
          ref={coreRef}
          className="weave-switch__thumb-core"
          aria-hidden="true"
        />
      </div>
    </View>
  )
}
