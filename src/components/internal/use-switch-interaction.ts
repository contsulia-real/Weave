import {
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useEffect,
  useRef,
} from 'react'
import type { ViewProps } from '../../core/view-types'
import {
  applySwitchAutoDragShape,
  applySwitchDragShape,
  clearSwitchDragShape,
  moveSwitchDrag,
  type SwitchDragState,
  switchDragGeometry,
} from './switch-drag'

interface SwitchInteractionCallbacks {
  onClick?: ViewProps<HTMLButtonElement>['onClick']
  onKeyDown?: ViewProps<HTMLButtonElement>['onKeyDown']
  onPointerDown?: ViewProps<HTMLButtonElement>['onPointerDown']
  onPointerMove?: ViewProps<HTMLButtonElement>['onPointerMove']
  onPointerUp?: ViewProps<HTMLButtonElement>['onPointerUp']
  onPointerCancel?: ViewProps<HTMLButtonElement>['onPointerCancel']
}

interface UseSwitchInteractionProps {
  rootRef: RefObject<HTMLButtonElement | null>
  thumbRef: RefObject<HTMLDivElement | null>
  checked: boolean
  disabled: boolean
  dragShrink: number
  dragMaxWidth: number
  autoDragDuration: number
  callbacks: SwitchInteractionCallbacks
  onCommit: (checked: boolean) => void
}

export function useSwitchInteraction({
  rootRef,
  thumbRef,
  checked,
  disabled,
  dragShrink,
  dragMaxWidth,
  autoDragDuration,
  callbacks,
  onCommit,
}: UseSwitchInteractionProps) {
  const dragRef = useRef<SwitchDragState | null>(null)
  const nativeDragCleanupRef = useRef<(() => void) | null>(null)
  const autoDragFrameRef = useRef<number | null>(null)
  const suppressClickRef = useRef(false)
  const suppressClickTimerRef = useRef<number | null>(null)

  const stopAutoDrag = () => {
    const root = rootRef.current
    const thumb = thumbRef.current

    if (autoDragFrameRef.current !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(autoDragFrameRef.current)
      autoDragFrameRef.current = null
    }

    if (thumb !== null) {
      clearSwitchDragShape(thumb)
    }

    if (root !== null && dragRef.current === null) {
      delete root.dataset.weaveSwitchDragging
    }
  }

  useEffect(
    () => () => {
      nativeDragCleanupRef.current?.()

      if (autoDragFrameRef.current !== null && typeof window !== 'undefined') {
        window.cancelAnimationFrame(autoDragFrameRef.current)
      }

      if (suppressClickTimerRef.current !== null && typeof window !== 'undefined') {
        window.clearTimeout(suppressClickTimerRef.current)
      }
    },
    [],
  )

  const playAutoDrag = (nextChecked: boolean) => {
    const root = rootRef.current
    const thumb = thumbRef.current

    if (
      root === null ||
      thumb === null ||
      dragRef.current !== null ||
      typeof window === 'undefined'
    ) {
      return
    }

    const geometry = switchDragGeometry(root, thumb, checked)

    if (geometry.maxOffset <= 0 || geometry.thumbSize <= 0) {
      return
    }

    stopAutoDrag()

    const endOffset = nextChecked ? geometry.maxOffset : 0
    const drag: SwitchDragState = {
      pointerId: -1,
      startX: 0,
      startOffset: geometry.startOffset,
      maxOffset: geometry.maxOffset,
      currentOffset: geometry.startOffset,
      thumbSize: geometry.thumbSize,
      moved: true,
    }
    let startedAt: number | null = null

    root.dataset.weaveSwitchDragging = 'true'
    applySwitchDragShape(thumb, drag, geometry.startOffset, dragShrink, dragMaxWidth)

    const frame = (time: number) => {
      if (startedAt === null) startedAt = time

      const linear = Math.min(1, Math.max(0, (time - startedAt) / autoDragDuration))
      const progress = 1 - Math.pow(1 - linear, 3)
      const offset = geometry.startOffset + (endOffset - geometry.startOffset) * progress

      drag.currentOffset = offset
      applySwitchAutoDragShape(thumb, drag, offset, linear, dragShrink, dragMaxWidth)

      if (linear < 1) {
        autoDragFrameRef.current = window.requestAnimationFrame(frame)
        return
      }

      autoDragFrameRef.current = null
      clearSwitchDragShape(thumb)
      if (dragRef.current === null) {
        delete root.dataset.weaveSwitchDragging
      }
    }

    autoDragFrameRef.current = window.requestAnimationFrame(frame)
  }

  const toggle = () => {
    if (disabled) return

    const nextChecked = !checked
    playAutoDrag(nextChecked)
    onCommit(nextChecked)
  }

  const suppressFollowUpClick = () => {
    suppressClickRef.current = true

    if (suppressClickTimerRef.current !== null && typeof window !== 'undefined') {
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

    if (drag === null || thumb === null || drag.pointerId !== pointerId) {
      return false
    }

    const nextOffset = moveSwitchDrag(drag, clientX)

    applySwitchDragShape(thumb, drag, nextOffset, dragShrink, dragMaxWidth)

    return true
  }

  const finishDrag = (
    root: HTMLButtonElement,
    pointerId: number,
    applyValue: boolean,
    preventDefault?: () => void,
  ) => {
    const drag = dragRef.current
    const thumb = thumbRef.current

    if (drag === null || thumb === null || drag.pointerId !== pointerId) {
      return
    }

    nativeDragCleanupRef.current?.()
    nativeDragCleanupRef.current = null

    const nextChecked = drag.maxOffset > 0 ? drag.currentOffset >= drag.maxOffset / 2 : checked

    clearSwitchDragShape(thumb)
    delete root.dataset.weaveSwitchDragging

    if (root.hasPointerCapture?.(pointerId)) {
      root.releasePointerCapture(pointerId)
    }

    dragRef.current = null

    if (drag.moved) {
      suppressFollowUpClick()
      preventDefault?.()
    }

    if (applyValue && drag.moved && nextChecked !== checked) {
      onCommit(nextChecked)
    }
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault()
      return
    }

    callbacks.onClick?.(event)
    if (event.defaultPrevented) return

    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }

    toggle()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault()
      return
    }

    callbacks.onKeyDown?.(event)
    if (event.defaultPrevented) return

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      toggle()
    }
  }

  const usesReactDragHandlers =
    callbacks.onPointerMove !== undefined ||
    callbacks.onPointerUp !== undefined ||
    callbacks.onPointerCancel !== undefined

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault()
      return
    }

    callbacks.onPointerDown?.(event)

    if (event.defaultPrevented || event.button !== 0) {
      return
    }

    const root = event.currentTarget
    const thumb = thumbRef.current

    if (thumb === null) return

    stopAutoDrag()

    const geometry = switchDragGeometry(root, thumb, checked)
    const drag: SwitchDragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: geometry.startOffset,
      maxOffset: geometry.maxOffset,
      currentOffset: geometry.startOffset,
      thumbSize: geometry.thumbSize,
      moved: false,
    }

    dragRef.current = drag
    root.focus()
    root.dataset.weaveSwitchDragging = 'true'

    applySwitchDragShape(thumb, drag, geometry.startOffset, dragShrink, dragMaxWidth)

    root.setPointerCapture?.(event.pointerId)

    nativeDragCleanupRef.current?.()
    nativeDragCleanupRef.current = null

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

        finishDrag(root, pointerId, true, () => nativeEvent.preventDefault())
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

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    callbacks.onPointerMove?.(event)
    if (event.defaultPrevented) return

    if (moveDrag(event.pointerId, event.clientX)) {
      event.preventDefault()
    }
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    callbacks.onPointerUp?.(event)

    finishDrag(event.currentTarget, event.pointerId, !event.defaultPrevented, () =>
      event.preventDefault(),
    )
  }

  const handlePointerCancel = (event: ReactPointerEvent<HTMLButtonElement>) => {
    callbacks.onPointerCancel?.(event)
    finishDrag(event.currentTarget, event.pointerId, false)
  }

  return {
    handleClick,
    handleKeyDown,
    handlePointerDown,
    handlePointerMove: usesReactDragHandlers ? handlePointerMove : undefined,
    handlePointerUp: usesReactDragHandlers ? handlePointerUp : undefined,
    handlePointerCancel: usesReactDragHandlers ? handlePointerCancel : undefined,
  }
}
