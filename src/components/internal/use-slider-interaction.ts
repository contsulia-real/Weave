import { type PointerEvent as ReactPointerEvent, type RefObject, useRef } from 'react'
import type { SliderViewProps } from '../../core/slider-types'
import { switchDragShapeScales } from './switch-drag'

const DRAG_THRESHOLD = 3

interface SliderInteractionCallbacks {
  onPointerDown?: SliderViewProps['onPointerDown']
  onPointerMove?: SliderViewProps['onPointerMove']
  onPointerUp?: SliderViewProps['onPointerUp']
  onPointerCancel?: SliderViewProps['onPointerCancel']
}

interface UseSliderInteractionProps {
  inputRef: RefObject<HTMLInputElement | null>
  controlRef: RefObject<HTMLSpanElement | null>
  thumbRef: RefObject<HTMLSpanElement | null>
  disabled: boolean
  dragShrink: number
  dragMaxWidth: number
  callbacks: SliderInteractionCallbacks
}

interface SliderDragState {
  pointerId: number
  startX: number
  maxDistance: number
  thumbWidth: number
  thumbHeight: number
  moved: boolean
}

export function useSliderInteraction({
  inputRef,
  controlRef,
  thumbRef,
  disabled,
  dragShrink,
  dragMaxWidth,
  callbacks,
}: UseSliderInteractionProps) {
  const dragRef = useRef<SliderDragState | null>(null)

  const applyShape = (distance: number) => {
    const drag = dragRef.current
    const thumb = thumbRef.current
    if (drag === null || thumb === null) return

    const { widthScale, heightScale } = switchDragShapeScales(
      distance,
      drag.maxDistance,
      dragShrink,
      dragMaxWidth,
    )

    thumb.style.width = `${drag.thumbWidth * widthScale}px`
    thumb.style.height = `${drag.thumbHeight * heightScale}px`
  }

  const clearInteraction = (pointerId: number) => {
    const drag = dragRef.current
    const input = inputRef.current
    const control = controlRef.current
    const thumb = thumbRef.current

    if (drag === null || drag.pointerId !== pointerId) return

    if (thumb !== null) {
      thumb.style.removeProperty('width')
      thumb.style.removeProperty('height')
    }

    if (control !== null) {
      delete control.dataset.weaveSliderPointerActive
      delete control.dataset.weaveSliderDragging
    }

    if (input?.hasPointerCapture?.(pointerId)) {
      input.releasePointerCapture(pointerId)
    }

    dragRef.current = null
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLInputElement>) => {
    callbacks.onPointerDown?.(event)

    if (disabled || event.defaultPrevented || event.button !== 0) return

    const input = event.currentTarget
    const control = controlRef.current
    const thumb = thumbRef.current
    if (control === null || thumb === null) return

    const inputRect = input.getBoundingClientRect()
    const thumbRect = thumb.getBoundingClientRect()

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      maxDistance: Math.max(0, inputRect.width - thumbRect.width),
      thumbWidth: thumbRect.width,
      thumbHeight: thumbRect.height,
      moved: false,
    }

    control.dataset.weaveSliderPointerActive = 'true'
    applyShape(0)
    input.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLInputElement>) => {
    callbacks.onPointerMove?.(event)
    if (event.defaultPrevented) return

    const drag = dragRef.current
    const control = controlRef.current
    if (drag === null || drag.pointerId !== event.pointerId || control === null) return

    const distance = event.clientX - drag.startX

    if (!drag.moved && Math.abs(distance) >= DRAG_THRESHOLD) {
      drag.moved = true
      control.dataset.weaveSliderDragging = 'true'
    }

    applyShape(distance)
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLInputElement>) => {
    callbacks.onPointerUp?.(event)
    clearInteraction(event.pointerId)
  }

  const handlePointerCancel = (event: ReactPointerEvent<HTMLInputElement>) => {
    callbacks.onPointerCancel?.(event)
    clearInteraction(event.pointerId)
  }

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  }
}
