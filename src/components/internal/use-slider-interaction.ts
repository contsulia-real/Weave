import { type PointerEvent as ReactPointerEvent, type RefObject, useRef } from 'react'
import type { SliderDirection, SliderViewProps } from '../../core/slider-types'
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
  direction: SliderDirection
  dragShrink: number
  dragMaxWidth: number
  callbacks: SliderInteractionCallbacks
  interactionId?: string
  onPointerValue?: (pointerPosition: number, input: HTMLInputElement) => void
}

interface SliderDragState {
  pointerId: number
  startPosition: number
  maxDistance: number
  thumbWidth: number
  thumbHeight: number
  moved: boolean
}

function pointerPosition(
  event: ReactPointerEvent<HTMLInputElement>,
  direction: SliderDirection,
): number {
  return direction === 'horizontal' ? event.clientX : event.clientY
}

export function useSliderInteraction({
  inputRef,
  controlRef,
  thumbRef,
  disabled,
  direction,
  dragShrink,
  dragMaxWidth,
  callbacks,
  interactionId,
  onPointerValue,
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

    if (direction === 'horizontal') {
      thumb.style.width = `${drag.thumbWidth * widthScale}px`
      thumb.style.height = `${drag.thumbHeight * heightScale}px`
    } else {
      thumb.style.width = `${drag.thumbWidth * heightScale}px`
      thumb.style.height = `${drag.thumbHeight * widthScale}px`
    }
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
      const interactionValue = interactionId ?? 'true'

      if (control.dataset.weaveSliderPointerActive === interactionValue) {
        delete control.dataset.weaveSliderPointerActive
      }
      if (control.dataset.weaveSliderDragging === interactionValue) {
        delete control.dataset.weaveSliderDragging
      }
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
    const startPosition = pointerPosition(event, direction)

    dragRef.current = {
      pointerId: event.pointerId,
      startPosition,
      maxDistance: Math.max(
        0,
        (direction === 'horizontal' ? inputRect.width : inputRect.height) -
          (direction === 'horizontal' ? thumbRect.width : thumbRect.height),
      ),
      thumbWidth: thumbRect.width,
      thumbHeight: thumbRect.height,
      moved: false,
    }

    if (onPointerValue !== undefined) {
      event.preventDefault()
      input.focus({ preventScroll: true })
      onPointerValue(startPosition, input)
    }

    control.dataset.weaveSliderPointerActive = interactionId ?? 'true'
    applyShape(0)
    input.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLInputElement>) => {
    callbacks.onPointerMove?.(event)
    if (event.defaultPrevented) return

    const drag = dragRef.current
    const control = controlRef.current
    if (drag === null || drag.pointerId !== event.pointerId || control === null) return

    const currentPosition = pointerPosition(event, direction)
    const distance = currentPosition - drag.startPosition

    if (!drag.moved && Math.abs(distance) >= DRAG_THRESHOLD) {
      drag.moved = true
      control.dataset.weaveSliderDragging = interactionId ?? 'true'
    }

    if (onPointerValue !== undefined) {
      event.preventDefault()
      onPointerValue(currentPosition, event.currentTarget)
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
