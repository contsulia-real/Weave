import { type PointerEvent, type RefObject, useCallback, useRef } from 'react'
import type { ScrollbarElementRefs, ScrollbarOrientation } from './scrollbar-types'

interface DragState {
  orientation: ScrollbarOrientation
  pointerId: number
  startPointer: number
  startScroll: number
  scrollPerPixel: number
}

interface UseAutoScrollbarInteractionProps<TTarget extends HTMLElement>
  extends ScrollbarElementRefs {
  targetRef: RefObject<TTarget | null>
  syncThumbOffsets: () => void
}

export function useAutoScrollbarInteraction<TTarget extends HTMLElement>({
  targetRef,
  verticalHitRegionRef,
  horizontalHitRegionRef,
  verticalThumbRef,
  horizontalThumbRef,
  syncThumbOffsets,
}: UseAutoScrollbarInteractionProps<TTarget>) {
  const dragRef = useRef<DragState | null>(null)

  const beginDrag = useCallback(
    (orientation: ScrollbarOrientation, event: PointerEvent<HTMLDivElement>) => {
      const target = targetRef.current
      const hitRegion =
        orientation === 'vertical' ? verticalHitRegionRef.current : horizontalHitRegionRef.current
      const thumb =
        orientation === 'vertical' ? verticalThumbRef.current : horizontalThumbRef.current

      if (target === null || hitRegion === null || thumb === null) return

      event.preventDefault()
      event.stopPropagation()
      hitRegion.setPointerCapture?.(event.pointerId)
      hitRegion.dataset.weaveScrollbarDragging = 'true'

      const hitRegionRect = hitRegion.getBoundingClientRect()
      const thumbRect = thumb.getBoundingClientRect()
      const hitRegionLength =
        orientation === 'vertical' ? hitRegionRect.height : hitRegionRect.width
      const thumbLength = orientation === 'vertical' ? thumbRect.height : thumbRect.width
      const available = Math.max(0, hitRegionLength - thumbLength)
      const maxScroll =
        orientation === 'vertical'
          ? Math.max(0, target.scrollHeight - target.clientHeight)
          : Math.max(0, target.scrollWidth - target.clientWidth)

      dragRef.current = {
        orientation,
        pointerId: event.pointerId,
        startPointer: orientation === 'vertical' ? event.clientY : event.clientX,
        startScroll: orientation === 'vertical' ? target.scrollTop : target.scrollLeft,
        scrollPerPixel: available === 0 ? 0 : maxScroll / available,
      }
    },
    [horizontalHitRegionRef, horizontalThumbRef, targetRef, verticalHitRegionRef, verticalThumbRef],
  )

  const continueDrag = useCallback(
    (orientation: ScrollbarOrientation, event: PointerEvent<HTMLDivElement>) => {
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

      const pointer = orientation === 'vertical' ? event.clientY : event.clientX
      const next = drag.startScroll + (pointer - drag.startPointer) * drag.scrollPerPixel

      if (orientation === 'vertical') {
        target.scrollTop = next
      } else {
        target.scrollLeft = next
      }

      syncThumbOffsets()
    },
    [syncThumbOffsets, targetRef],
  )

  const endDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
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
    },
    [horizontalHitRegionRef, verticalHitRegionRef],
  )

  const pageHitRegion = useCallback(
    (orientation: ScrollbarOrientation, event: PointerEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return

      const target = targetRef.current
      const thumb =
        orientation === 'vertical' ? verticalThumbRef.current : horizontalThumbRef.current

      if (target === null || thumb === null) return

      event.preventDefault()

      const thumbRect = thumb.getBoundingClientRect()
      const before =
        orientation === 'vertical' ? event.clientY < thumbRect.top : event.clientX < thumbRect.left
      const direction = before ? -1 : 1

      if (orientation === 'vertical') {
        target.scrollTop += direction * target.clientHeight * 0.9
      } else {
        target.scrollLeft += direction * target.clientWidth * 0.9
      }

      syncThumbOffsets()
    },
    [horizontalThumbRef, syncThumbOffsets, targetRef, verticalThumbRef],
  )

  const handleHitRegionPointerDown = useCallback(
    (orientation: ScrollbarOrientation, event: PointerEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return

      const thumb =
        orientation === 'vertical' ? verticalThumbRef.current : horizontalThumbRef.current

      if (thumb === null) return

      const thumbRect = thumb.getBoundingClientRect()
      const pointer = orientation === 'vertical' ? event.clientY : event.clientX
      const start = orientation === 'vertical' ? thumbRect.top : thumbRect.left
      const end = orientation === 'vertical' ? thumbRect.bottom : thumbRect.right

      if (pointer >= start && pointer <= end) {
        beginDrag(orientation, event)
        return
      }

      pageHitRegion(orientation, event)
    },
    [beginDrag, horizontalThumbRef, pageHitRegion, verticalThumbRef],
  )

  return {
    beginDrag,
    continueDrag,
    endDrag,
    handleHitRegionPointerDown,
  }
}
