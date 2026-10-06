import { type RefObject, useCallback, useLayoutEffect, useRef } from 'react'
import { scheduleAnimationFrame } from './schedule-animation-frame'
import { syncScrollbarThumbOffsets, updateScrollbarGeometry } from './scrollbar-geometry'
import {
  EMPTY_SCROLL_METRICS,
  type ScrollbarElementRefs,
  type ScrollbarOverflowIntent,
} from './scrollbar-types'
import { trackVisualAnchor } from './visual-anchor-tracker'

interface UseAutoScrollbarSyncProps<TTarget extends HTMLElement> extends ScrollbarElementRefs {
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

function visualAncestors(target: HTMLElement): HTMLElement[] {
  const output: HTMLElement[] = []
  const document = target.ownerDocument
  let ancestor = target.parentElement

  while (ancestor !== null && ancestor !== document.body && ancestor !== document.documentElement) {
    output.push(ancestor)
    ancestor = ancestor.parentElement
  }

  return output
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

    metricsRef.current = updateScrollbarGeometry(target, elements, overflowIntent)
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

    let cancelThumbFrame: (() => void) | undefined
    let cancelGeometryFrame: (() => void) | undefined

    const scheduleThumbSync = () => {
      if (cancelThumbFrame !== undefined) return
      cancelThumbFrame = scheduleAnimationFrame(() => {
        cancelThumbFrame = undefined
        syncThumbOffsets()
      })
    }

    const scheduleGeometrySync = () => {
      if (cancelGeometryFrame !== undefined) return
      cancelGeometryFrame = scheduleAnimationFrame(() => {
        cancelGeometryFrame = undefined
        updateGeometry()
      })
    }

    // Native scroll state remains the source of truth. Scroll listeners only
    // schedule main-thread projection work for the next animation frame so
    // Firefox APZ never observes positioning/style mutation inside the scroll callback.
    const onScroll = () => scheduleThumbSync()
    const onWindowResize = () => updateGeometry()
    const onDocumentScroll = (event: Event) => {
      if (event.target === target) return
      scheduleGeometrySync()
    }

    target.addEventListener('scroll', onScroll, { passive: true })
    target.addEventListener('input', scheduleGeometrySync)
    window.addEventListener('resize', onWindowResize)
    document.addEventListener('scroll', onDocumentScroll, true)

    const stopVisualTracking = trackVisualAnchor(target, updateGeometry, {
      additionalTargets: visualAncestors(target),
      trackMutations: true,
      continuousAnimations: true,
    })

    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateGeometry)

    const isIgnoredPortalMutation = (node: Node) =>
      node instanceof Element && node.closest('[data-weave-modal-portal-host]') !== null

    const observeTargetAndChildren = () => {
      resizeObserver?.disconnect()
      resizeObserver?.observe(target)

      for (const child of target.children) {
        if (child instanceof HTMLElement && child.dataset.weaveModalPortalHost === undefined) {
          resizeObserver?.observe(child)
        }
      }
    }

    observeTargetAndChildren()

    const mutationObserver =
      typeof MutationObserver === 'undefined'
        ? null
        : new MutationObserver((records) => {
            if (records.every((record) => isIgnoredPortalMutation(record.target))) {
              return
            }

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
      target.removeEventListener('input', scheduleGeometrySync)
      window.removeEventListener('resize', onWindowResize)
      document.removeEventListener('scroll', onDocumentScroll, true)
      stopVisualTracking()
      cancelThumbFrame?.()
      cancelGeometryFrame?.()
      resizeObserver?.disconnect()
      mutationObserver?.disconnect()
    }
  }, [syncThumbOffsets, targetRef, updateGeometry])

  return {
    syncThumbOffsets,
    updateGeometry,
  }
}
