import {
  useCallback,
  useLayoutEffect,
  useRef,
  type RefObject,
} from 'react'
import {
  syncScrollbarThumbOffsets,
  updateScrollbarGeometry,
} from './scrollbar-geometry'
import {
  EMPTY_SCROLL_METRICS,
  type ScrollbarElementRefs,
  type ScrollbarOverflowIntent,
} from './scrollbar-types'

interface UseAutoScrollbarSyncProps<TTarget extends HTMLElement>
  extends ScrollbarElementRefs {
  targetRef: RefObject<TTarget | null>
  overflowIntent: ScrollbarOverflowIntent
  themeTokenClassName?: string
  scrollbarThemeClassName?: string
}

function elementsFromRefs(refs: ScrollbarElementRefs) {
  const verticalHitRegion = refs.verticalHitRegionRef.current
  const horizontalHitRegion = refs.horizontalHitRegionRef.current
  const verticalThumb = refs.verticalThumbRef.current
  const horizontalThumb = refs.horizontalThumbRef.current

  if (
    verticalHitRegion === null ||
    horizontalHitRegion === null ||
    verticalThumb === null ||
    horizontalThumb === null
  ) {
    return null
  }

  return {
    verticalHitRegion,
    horizontalHitRegion,
    verticalThumb,
    horizontalThumb,
  }
}

export function useAutoScrollbarSync<TTarget extends HTMLElement>({
  targetRef,
  overflowIntent,
  verticalHitRegionRef,
  horizontalHitRegionRef,
  verticalThumbRef,
  horizontalThumbRef,
  themeTokenClassName,
  scrollbarThemeClassName,
}: UseAutoScrollbarSyncProps<TTarget>) {
  const metricsRef = useRef(EMPTY_SCROLL_METRICS)

  const syncThumbOffsets = useCallback(() => {
    const target = targetRef.current
    const elements = elementsFromRefs({
      verticalHitRegionRef,
      horizontalHitRegionRef,
      verticalThumbRef,
      horizontalThumbRef,
    })

    if (target === null || elements === null) return

    syncScrollbarThumbOffsets(target, elements, metricsRef.current)
  }, [
    horizontalHitRegionRef,
    horizontalThumbRef,
    targetRef,
    verticalHitRegionRef,
    verticalThumbRef,
  ])

  const updateGeometry = useCallback(() => {
    // Theme classes own scrollbar thickness and therefore geometry.
    void themeTokenClassName
    void scrollbarThemeClassName

    const target = targetRef.current
    const elements = elementsFromRefs({
      verticalHitRegionRef,
      horizontalHitRegionRef,
      verticalThumbRef,
      horizontalThumbRef,
    })

    if (target === null || elements === null) return

    metricsRef.current = updateScrollbarGeometry(
      target,
      elements,
      overflowIntent,
    )
    syncScrollbarThumbOffsets(target, elements, metricsRef.current)
  }, [
    horizontalHitRegionRef,
    horizontalThumbRef,
    overflowIntent,
    scrollbarThemeClassName,
    targetRef,
    themeTokenClassName,
    verticalHitRegionRef,
    verticalThumbRef,
  ])

  useLayoutEffect(() => {
    const target = targetRef.current
    if (target === null) return

    updateGeometry()

    // Native scroll state remains the source of truth. These listeners only
    // project that state into the overlay scrollbar geometry.
    const onScroll = () => syncThumbOffsets()
    const onWindowResize = () => updateGeometry()
    const onDocumentScroll = (event: Event) => {
      if (event.target === target) return
      updateGeometry()
    }

    target.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onWindowResize)
    document.addEventListener('scroll', onDocumentScroll, true)

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(updateGeometry)

    const observeTargetAndChildren = () => {
      resizeObserver?.disconnect()
      resizeObserver?.observe(target)

      for (const child of target.children) {
        if (child instanceof HTMLElement) {
          resizeObserver?.observe(child)
        }
      }
    }

    observeTargetAndChildren()

    const mutationObserver =
      typeof MutationObserver === 'undefined'
        ? null
        : new MutationObserver(() => {
            observeTargetAndChildren()
            updateGeometry()
          })

    mutationObserver?.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
    })

    return () => {
      target.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onWindowResize)
      document.removeEventListener('scroll', onDocumentScroll, true)
      resizeObserver?.disconnect()
      mutationObserver?.disconnect()
    }
  }, [syncThumbOffsets, targetRef, updateGeometry])

  return {
    syncThumbOffsets,
    updateGeometry,
  }
}
