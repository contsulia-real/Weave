import {
  useInsertionEffect,
  useRef,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import type {
  ScrollbarConfig,
  ScrollbarSize,
} from '../../core/view-types'
import { resolveScrollbarTheme } from '../../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../../renderers/dom/runtime-class'
import { ensureScrollbarStylesheet } from '../../renderers/dom/scrollbar-stylesheet'
import { themeVariables } from '../../theme/theme-css'
import { useTheme } from '../../theme/theme-context'
import { ScrollbarAxis } from './ScrollbarAxis'
import type { ScrollbarOverflowIntent } from './scrollbar-types'
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
  useInsertionEffect(ensureScrollbarStylesheet, [])

  const verticalHitRegionRef = useRef<HTMLDivElement>(null)
  const horizontalHitRegionRef = useRef<HTMLDivElement>(null)
  const verticalThumbRef = useRef<HTMLDivElement>(null)
  const horizontalThumbRef = useRef<HTMLDivElement>(null)

  const size: ScrollbarSize = config?.size ?? 'medium'
  const { theme } = useTheme()
  const themeTokenClassName = useRuntimeStyleClass(
    'scrollbar-tokens',
    themeVariables(theme),
  )
  const scrollbarThemeClassName = useRuntimeStyleClass(
    'scrollbar-theme',
    resolveScrollbarTheme(theme, size, config),
  )

  const { syncThumbOffsets } = useAutoScrollbarSync({
    targetRef,
    overflowIntent,
    verticalHitRegionRef,
    horizontalHitRegionRef,
    verticalThumbRef,
    horizontalThumbRef,
    themeTokenClassName,
    scrollbarThemeClassName,
  })

  const {
    beginDrag,
    continueDrag,
    endDrag,
    handleHitRegionPointerDown,
  } = useAutoScrollbarInteraction({
    targetRef,
    verticalHitRegionRef,
    horizontalHitRegionRef,
    verticalThumbRef,
    horizontalThumbRef,
    syncThumbOffsets,
  })

  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      <ScrollbarAxis
        orientation="vertical"
        size={size}
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
    document.body,
  )
}
