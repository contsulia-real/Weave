import type { RefObject } from 'react'

export type ScrollbarOrientation = 'vertical' | 'horizontal'

export interface ScrollbarOverflowIntent {
  styleOverflow?: string
  styleOverflowX?: string
  styleOverflowY?: string
}

export interface ScrollbarElementRefs {
  verticalHitRegionRef: RefObject<HTMLDivElement | null>
  horizontalHitRegionRef: RefObject<HTMLDivElement | null>
  verticalThumbRef: RefObject<HTMLDivElement | null>
  horizontalThumbRef: RefObject<HTMLDivElement | null>
}

export interface ScrollMetrics {
  verticalAvailable: number
  verticalMaxScroll: number
  horizontalAvailable: number
  horizontalMaxScroll: number
}

export const EMPTY_SCROLL_METRICS: ScrollMetrics = {
  verticalAvailable: 0,
  verticalMaxScroll: 0,
  horizontalAvailable: 0,
  horizontalMaxScroll: 0,
}
