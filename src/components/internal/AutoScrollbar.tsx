import { type RefObject, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import type { ScrollbarConfig, ScrollbarSize } from '../../core/view-types'
import { useWeaveDocument } from '../../renderers/dom/document-context'
import { resolveScrollbarTheme } from '../../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../../renderers/dom/runtime-class'
import { ensureScrollbarStylesheet } from '../../renderers/dom/scrollbar-stylesheet'
import { useStaticStylesheet } from '../../renderers/dom/static-stylesheet'
import { useTheme } from '../../theme/theme-context'
import { themeVariables } from '../../theme/theme-css'
import { ScrollbarAxis } from './ScrollbarAxis'
import type { ScrollbarOverflowIntent } from './scrollbar-types'
import {
  modalPortalHostForElement,
  subscribeTopLayerHost,
  topLayerHostRevision,
} from './top-layer-host'
import { useAutoScrollbarInteraction } from './use-auto-scrollbar-interaction'
import { useAutoScrollbarSync } from './use-auto-scrollbar-sync'

interface AutoScrollbarProps<TTarget extends HTMLElement> {
  targetRef: RefObject<TTarget | null>
  config?: ScrollbarConfig
  overflowIntent: ScrollbarOverflowIntent
}

export function AutoScrollbar<TTarget extends HTMLElement>({
  targetRef,
  config,
  overflowIntent,
}: AutoScrollbarProps<TTarget>) {
  useStaticStylesheet(ensureScrollbarStylesheet)

  const ownerDocument = useWeaveDocument()
  const verticalHitRegionRef = useRef<HTMLDivElement>(null)
  const horizontalHitRegionRef = useRef<HTMLDivElement>(null)
  const verticalThumbRef = useRef<HTMLDivElement>(null)
  const horizontalThumbRef = useRef<HTMLDivElement>(null)
  const [portalTarget, setPortalTarget] = useState<Element | null>(null)
  const topLayerRevision = useSyncExternalStore(
    subscribeTopLayerHost,
    topLayerHostRevision,
    () => 0,
  )

  const size: ScrollbarSize = config?.size ?? 'medium'
  const { theme } = useTheme()
  const themeTokenClassName = useRuntimeStyleClass('scrollbar-tokens', themeVariables(theme))
  const scrollbarThemeClassName = useRuntimeStyleClass(
    'scrollbar-theme',
    resolveScrollbarTheme(theme, size, config),
  )

  /* oxlint-disable react/set-state-in-effect */
  useLayoutEffect(() => {
    if (ownerDocument === null) return
    setPortalTarget(modalPortalHostForElement(targetRef.current) ?? ownerDocument.body)
  }, [ownerDocument, targetRef, topLayerRevision])
  /* oxlint-enable react/set-state-in-effect */

  const { syncThumbOffsets, updateGeometry } = useAutoScrollbarSync({
    targetRef,
    overflowIntent,
    verticalHitRegionRef,
    horizontalHitRegionRef,
    verticalThumbRef,
    horizontalThumbRef,
    themeTokenClassName,
    scrollbarThemeClassName,
  })

  useLayoutEffect(() => {
    if (portalTarget === null) return
    updateGeometry()
  }, [portalTarget, updateGeometry])

  const { beginDrag, continueDrag, endDrag, handleHitRegionPointerDown } =
    useAutoScrollbarInteraction({
      targetRef,
      verticalHitRegionRef,
      horizontalHitRegionRef,
      verticalThumbRef,
      horizontalThumbRef,
      syncThumbOffsets,
    })

  if (portalTarget === null) return null

  return createPortal(
    <>
      <ScrollbarAxis
        orientation="vertical"
        size={size}
        outside={config?.outside}
        themeTokenClassName={themeTokenClassName}
        scrollbarThemeClassName={scrollbarThemeClassName}
        hitRegionRef={verticalHitRegionRef}
        thumbRef={verticalThumbRef}
        onHitRegionPointerDown={handleHitRegionPointerDown}
        onPointerMove={continueDrag}
        onPointerEnd={endDrag}
        onThumbPointerDown={beginDrag}
      />
      <ScrollbarAxis
        orientation="horizontal"
        size={size}
        outside={config?.outside}
        themeTokenClassName={themeTokenClassName}
        scrollbarThemeClassName={scrollbarThemeClassName}
        hitRegionRef={horizontalHitRegionRef}
        thumbRef={horizontalThumbRef}
        onHitRegionPointerDown={handleHitRegionPointerDown}
        onPointerMove={continueDrag}
        onPointerEnd={endDrag}
        onThumbPointerDown={beginDrag}
      />
    </>,
    portalTarget,
  )
}
