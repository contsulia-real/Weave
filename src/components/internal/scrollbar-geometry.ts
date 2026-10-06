import type { ScrollbarOverflowIntent, ScrollMetrics } from './scrollbar-types'

const SCROLLBAR_INSET_PX = 4
const MIN_THUMB_LENGTH_PX = 24

interface RadiusAxes {
  x: number
  y: number
}

interface CornerRadii {
  topLeft: RadiusAxes
  topRight: RadiusAxes
  bottomRight: RadiusAxes
  bottomLeft: RadiusAxes
}

interface ScrollbarElements {
  verticalHitRegion: HTMLDivElement
  horizontalHitRegion: HTMLDivElement
  verticalThumb: HTMLDivElement
  horizontalThumb: HTMLDivElement
}

interface ClipRect {
  top: number
  right: number
  bottom: number
  left: number
}

function isAutoScrolling(value: string): boolean {
  return value === 'auto' || value === 'overlay'
}

function clipsOverflow(value: string): boolean {
  return value !== 'visible'
}

function clippingRectForTarget(target: HTMLElement): ClipRect {
  const clip: ClipRect = {
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    left: 0,
  }

  let ancestor = target.parentElement

  while (ancestor !== null && ancestor !== document.body && ancestor !== document.documentElement) {
    const computed = getComputedStyle(ancestor)
    const rect = ancestor.getBoundingClientRect()
    const left = rect.left + ancestor.clientLeft
    const top = rect.top + ancestor.clientTop

    if (clipsOverflow(computed.overflowX)) {
      clip.left = Math.max(clip.left, left)
      clip.right = Math.min(clip.right, left + ancestor.clientWidth)
    }

    if (clipsOverflow(computed.overflowY)) {
      clip.top = Math.max(clip.top, top)
      clip.bottom = Math.min(clip.bottom, top + ancestor.clientHeight)
    }

    ancestor = ancestor.parentElement
  }

  return clip
}

function clipScrollbarToAncestors(hitRegion: HTMLElement, clip: ClipRect): void {
  const rect = hitRegion.getBoundingClientRect()

  if (
    rect.width <= 0 ||
    rect.height <= 0 ||
    clip.right <= rect.left ||
    clip.left >= rect.right ||
    clip.bottom <= rect.top ||
    clip.top >= rect.bottom
  ) {
    hitRegion.style.clipPath = 'inset(100%)'
    return
  }

  const top = Math.max(0, clip.top - rect.top)
  const right = Math.max(0, rect.right - clip.right)
  const bottom = Math.max(0, rect.bottom - clip.bottom)
  const left = Math.max(0, clip.left - rect.left)

  hitRegion.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`
}

function visualOpacityForTarget(target: HTMLElement, portalElement: HTMLElement): number {
  let opacity = 1
  let node: HTMLElement | null = target

  while (node !== null && !node.contains(portalElement)) {
    const value = Number.parseFloat(getComputedStyle(node).opacity)
    if (Number.isFinite(value)) {
      opacity *= value
    }
    node = node.parentElement
  }

  return Math.max(0, Math.min(1, opacity))
}

function syncScrollbarVisualOpacity(hitRegion: HTMLElement, target: HTMLElement): void {
  const themeOpacity = Number.parseFloat(
    getComputedStyle(hitRegion).getPropertyValue('--weave-scrollbar-opacity'),
  )
  const baseOpacity = Number.isFinite(themeOpacity) ? themeOpacity : 1

  hitRegion.style.setProperty(
    '--weave-component-opacity',
    String(baseOpacity * visualOpacityForTarget(target, hitRegion)),
  )
}

function scrollbarVisible(overflow: string, scrollSize: number, clientSize: number): boolean {
  if (overflow === 'scroll') return true

  return isAutoScrolling(overflow) && scrollSize > clientSize + 1
}

function cssLengthPixels(value: string, reference: number): number {
  const trimmed = value.trim()
  if (trimmed.endsWith('%')) {
    const percent = Number.parseFloat(trimmed)
    return Number.isFinite(percent) ? (reference * percent) / 100 : 0
  }

  const numeric = Number.parseFloat(trimmed)
  return Number.isFinite(numeric) ? numeric : 0
}

function radiusAxes(value: string, width: number, height: number): RadiusAxes {
  const [xValue = '0', yValue = xValue] = value.trim().split(/\s+/)

  return {
    x: Math.max(0, cssLengthPixels(xValue, width)),
    y: Math.max(0, cssLengthPixels(yValue, height)),
  }
}

function effectiveCornerRadii(computed: CSSStyleDeclaration, rect: DOMRect): CornerRadii {
  const radii: CornerRadii = {
    topLeft: radiusAxes(computed.borderTopLeftRadius, rect.width, rect.height),
    topRight: radiusAxes(computed.borderTopRightRadius, rect.width, rect.height),
    bottomRight: radiusAxes(computed.borderBottomRightRadius, rect.width, rect.height),
    bottomLeft: radiusAxes(computed.borderBottomLeftRadius, rect.width, rect.height),
  }

  const ratio = (available: number, requested: number) =>
    requested <= 0 ? 1 : available / requested

  const scale = Math.min(
    1,
    ratio(rect.width, radii.topLeft.x + radii.topRight.x),
    ratio(rect.width, radii.bottomLeft.x + radii.bottomRight.x),
    ratio(rect.height, radii.topLeft.y + radii.bottomLeft.y),
    ratio(rect.height, radii.topRight.y + radii.bottomRight.y),
  )

  if (scale >= 1) return radii

  for (const radius of Object.values(radii)) {
    radius.x *= scale
    radius.y *= scale
  }

  return radii
}

function syncScrollbarLayer(hitRegion: HTMLElement, target: HTMLElement): void {
  let node: HTMLElement | null = target
  let layer: number | null = null

  while (node !== null) {
    const value = getComputedStyle(node).zIndex
    const numeric = Number(value)

    if (Number.isFinite(numeric)) {
      layer = layer === null ? numeric : Math.max(layer, numeric)
    }

    node = node.parentElement
  }

  if (layer === null) {
    hitRegion.style.removeProperty('z-index')
  } else {
    hitRegion.style.zIndex = String(layer + 1)
  }
}

export function syncScrollbarThumbOffsets(
  target: HTMLElement,
  elements: Pick<ScrollbarElements, 'verticalThumb' | 'horizontalThumb'>,
  metrics: ScrollMetrics,
): void {
  const verticalOffset =
    metrics.verticalMaxScroll === 0
      ? 0
      : (target.scrollTop / metrics.verticalMaxScroll) * metrics.verticalAvailable

  const horizontalOffset =
    metrics.horizontalMaxScroll === 0
      ? 0
      : (target.scrollLeft / metrics.horizontalMaxScroll) * metrics.horizontalAvailable

  elements.verticalThumb.style.transform = `translateY(${verticalOffset}px)`
  elements.horizontalThumb.style.transform = `translateX(${horizontalOffset}px)`
}

export function updateScrollbarGeometry(
  target: HTMLElement,
  elements: ScrollbarElements,
  overflowIntent: ScrollbarOverflowIntent,
): ScrollMetrics {
  const { verticalHitRegion, horizontalHitRegion, verticalThumb, horizontalThumb } = elements

  const computed = getComputedStyle(target)
  const rect = target.getBoundingClientRect()
  const borderTop = parseFloat(computed.borderTopWidth) || 0
  const borderRight = parseFloat(computed.borderRightWidth) || 0
  const borderBottom = parseFloat(computed.borderBottomWidth) || 0
  const borderLeft = parseFloat(computed.borderLeftWidth) || 0
  const inset = SCROLLBAR_INSET_PX
  const radii = effectiveCornerRadii(computed, rect)
  const clippingRect = clippingRectForTarget(target)

  syncScrollbarLayer(verticalHitRegion, target)
  syncScrollbarLayer(horizontalHitRegion, target)
  syncScrollbarVisualOpacity(verticalHitRegion, target)
  syncScrollbarVisualOpacity(horizontalHitRegion, target)

  const verticalOverflow =
    (overflowIntent.styleOverflowY ?? overflowIntent.styleOverflow) ||
    computed.overflowY ||
    computed.overflow ||
    'visible'

  const horizontalOverflow =
    (overflowIntent.styleOverflowX ?? overflowIntent.styleOverflow) ||
    computed.overflowX ||
    computed.overflow ||
    'visible'

  const verticalVisible =
    scrollbarVisible(verticalOverflow, target.scrollHeight, target.clientHeight) && rect.height > 0

  const horizontalVisible =
    scrollbarVisible(horizontalOverflow, target.scrollWidth, target.clientWidth) && rect.width > 0

  verticalHitRegion.dataset.weaveScrollbarVisible = String(verticalVisible)
  horizontalHitRegion.dataset.weaveScrollbarVisible = String(horizontalVisible)

  const verticalThickness = verticalVisible
    ? parseFloat(getComputedStyle(verticalThumb).width) || 0
    : 0
  const horizontalThickness = horizontalVisible
    ? parseFloat(getComputedStyle(horizontalThumb).height) || 0
    : 0

  const verticalStartInset = Math.max(borderTop + inset, radii.topRight.y)
  const verticalEndInset = Math.max(
    borderBottom + inset,
    radii.bottomRight.y,
    horizontalVisible ? borderBottom + inset * 2 + horizontalThickness : 0,
  )
  const horizontalStartInset = Math.max(borderLeft + inset, radii.bottomLeft.x)
  const horizontalEndInset = Math.max(
    borderRight + inset,
    radii.bottomRight.x,
    verticalVisible ? borderRight + inset * 2 + verticalThickness : 0,
  )

  let verticalAvailable = 0
  let verticalMaxScroll = 0
  let horizontalAvailable = 0
  let horizontalMaxScroll = 0

  if (verticalVisible) {
    const hitRegionLength = Math.max(0, rect.height - verticalStartInset - verticalEndInset)
    const thumbLength = Math.min(
      hitRegionLength,
      Math.max(MIN_THUMB_LENGTH_PX, hitRegionLength * (target.clientHeight / target.scrollHeight)),
    )

    verticalAvailable = Math.max(0, hitRegionLength - thumbLength)
    verticalMaxScroll = Math.max(0, target.scrollHeight - target.clientHeight)

    verticalHitRegion.style.top = `${rect.top + verticalStartInset}px`
    verticalHitRegion.style.left = `${rect.right}px`
    verticalHitRegion.style.height = `${hitRegionLength}px`
    verticalHitRegion.style.setProperty('--weave-scrollbar-edge-inset', `${borderRight + inset}px`)
    verticalThumb.style.height = `${thumbLength}px`
    clipScrollbarToAncestors(verticalHitRegion, clippingRect)
  }

  if (horizontalVisible) {
    const hitRegionLength = Math.max(0, rect.width - horizontalStartInset - horizontalEndInset)
    const thumbLength = Math.min(
      hitRegionLength,
      Math.max(MIN_THUMB_LENGTH_PX, hitRegionLength * (target.clientWidth / target.scrollWidth)),
    )

    horizontalAvailable = Math.max(0, hitRegionLength - thumbLength)
    horizontalMaxScroll = Math.max(0, target.scrollWidth - target.clientWidth)

    horizontalHitRegion.style.left = `${rect.left + horizontalStartInset}px`
    horizontalHitRegion.style.top = `${rect.bottom}px`
    horizontalHitRegion.style.width = `${hitRegionLength}px`
    horizontalHitRegion.style.setProperty(
      '--weave-scrollbar-edge-inset',
      `${borderBottom + inset}px`,
    )
    horizontalThumb.style.width = `${thumbLength}px`
    clipScrollbarToAncestors(horizontalHitRegion, clippingRect)
  }

  return {
    verticalAvailable,
    verticalMaxScroll,
    horizontalAvailable,
    horizontalMaxScroll,
  }
}
