import type { Dimension } from '../../core/view-types'
import type {
  DiCIntrinsicSize,
  DiCTypographyContext,
  DiCViewNode,
  DiCViewPaint,
} from './compile-view'
import type { ResolvedTheme } from '../../theme/theme-types'
import type { DiCViewFrame } from './draw-view'
import { resolveDiCLength } from './layout-view'
import {
  resolveDiCViewPaint,
  type DiCInteractionState,
} from './resolve-paint'
import {
  createRootDiCTypography,
  resolveDiCNodeTypography,
} from './text-style'

export interface DiCTreeLayoutEnvironment {
  viewportWidth: number
  rem?: number
  containerWidth?: number
  context?: CanvasRenderingContext2D
  theme?: ResolvedTheme
  typography?: DiCTypographyContext
  imageResources?: import('./image-resource').DiCImageResourceManager
  stateForNode?: (
    node: DiCViewNode,
  ) => DiCInteractionState | undefined
}

export interface DiCTreeConstraints {
  x?: number
  y?: number
  width: number
  height: number
  root?: boolean
  forceWidth?: number
  forceHeight?: number
}

export interface DiCViewTreeLayout {
  node: DiCViewNode
  paint: DiCViewPaint
  typography?: DiCTypographyContext
  frame: DiCViewFrame
  contentFrame: DiCViewFrame
  children: readonly DiCViewTreeLayout[]
}

interface Size {
  width: number
  height: number
}

function finite(value: number): number {
  return Number.isFinite(value)
    ? Math.max(0, value)
    : 0
}

function gapValue(
  paint: DiCViewPaint,
  width: number,
  rem: number,
): number {
  if (paint.gap === undefined) return 0

  const value = resolveDiCLength(
    paint.gap,
    width,
    rem,
  )

  if (value === undefined) {
    throw new Error(
      `Unsupported DiC gap "${String(paint.gap)}"`,
    )
  }

  return finite(value)
}

function paddingValue(
  value: DiCViewPaint['paddingTop'],
  width: number,
  rem: number,
): number {
  if (value === undefined) return 0

  const resolved = resolveDiCLength(
    value,
    width,
    rem,
  )

  if (resolved === undefined) {
    throw new Error(
      `Unsupported DiC padding "${String(value)}"`,
    )
  }

  return finite(resolved)
}

function explicitDimension(
  value: Dimension | undefined,
  available: number,
  rem: number,
): number | undefined {
  if (
    value === undefined ||
    value === 'content' ||
    value === 'fit'
  ) {
    return undefined
  }

  if (value === 'fill') return available

  const resolved = resolveDiCLength(
    value,
    available,
    rem,
  )

  if (resolved === undefined) {
    throw new Error(
      `Unsupported DiC dimension "${String(value)}"`,
    )
  }

  return finite(resolved)
}

function finalDimension(
  value: Dimension | undefined,
  available: number,
  intrinsic: number,
  rem: number,
  root: boolean,
): number {
  if (value === undefined) {
    return root ? available : intrinsic
  }

  if (value === 'content') return intrinsic
  if (value === 'fit') return Math.min(intrinsic, available)
  if (value === 'fill') return available

  return explicitDimension(value, available, rem) ?? intrinsic
}

function resolvedPaint(
  node: DiCViewNode,
  environment: DiCTreeLayoutEnvironment,
  containerWidth: number,
): DiCViewPaint {
  return resolveDiCViewPaint(
    node,
    {
      viewportWidth: environment.viewportWidth,
      containerWidth,
      rem: environment.rem,
      state: environment.stateForNode?.(node),
    },
  )
}

function childContainerWidth(
  node: DiCViewNode,
  inherited: number,
  contentWidth: number,
): number {
  return node.container === undefined
    ? inherited
    : contentWidth
}

function typographyForNode(
  node: DiCViewNode,
  paint: DiCViewPaint,
  inherited: DiCTypographyContext | undefined,
  environment: DiCTreeLayoutEnvironment,
): DiCTypographyContext | undefined {
  const theme = environment.theme
  if (theme === undefined) return inherited

  const rem = environment.rem ?? 16
  const base =
    inherited ??
    environment.typography ??
    createRootDiCTypography(theme, rem)

  return resolveDiCNodeTypography(
    node,
    base,
    theme,
    rem,
    paint.color,
  )
}

function intrinsicChildrenSize(
  node: DiCViewNode,
  paint: DiCViewPaint,
  maxWidth: number,
  maxHeight: number,
  environment: DiCTreeLayoutEnvironment,
  containerWidth: number,
  typography: DiCTypographyContext | undefined,
  resolvedWidth?: number,
  resolvedHeight?: number,
): Size {
  const rem = environment.rem ?? 16

  if (paint.layout === 'grid') {
    throw new Error(
      'DiC grid tree layout is not implemented yet',
    )
  }
  if (paint.layout === 'absolute') {
    throw new Error(
      'DiC absolute tree layout is not implemented yet',
    )
  }

  const measured = node.measure?.(
    {
      maxWidth,
      maxHeight,
      rem,
      resolvedWidth,
      resolvedHeight,
      widthMode: paint.width,
      heightMode: paint.height,
    },
    {
      context: environment.context,
      theme: environment.theme,
      typography,
      viewportWidth: environment.viewportWidth,
      containerWidth,
      rem,
      imageResources: environment.imageResources,
    },
  )

  const childSizes = node.children.map((child) =>
    measureDiCViewTree(
      child,
      {
        width: maxWidth,
        height: maxHeight,
      },
      environment,
      containerWidth,
      false,
      typography,
    ),
  )

  if (childSizes.length === 0) {
    return {
      width: measured?.width ?? 0,
      height: measured?.height ?? 0,
    }
  }

  if (paint.layout === 'flex' && paint.wrap) {
    throw new Error(
      'DiC flex wrap tree layout is not implemented yet',
    )
  }

  const gap =
    paint.layout === 'flex'
      ? gapValue(paint, maxWidth, rem)
      : 0
  const direction =
    paint.layout === 'flex'
      ? paint.direction ?? 'row'
      : 'column'
  const row =
    direction === 'row' ||
    direction === 'row-reverse'

  if (paint.layout === 'stack') {
    return {
      width: Math.max(
        measured?.width ?? 0,
        ...childSizes.map((size) => size.width),
      ),
      height: Math.max(
        measured?.height ?? 0,
        ...childSizes.map((size) => size.height),
      ),
    }
  }

  if (row) {
    return {
      width:
        childSizes.reduce(
          (sum, size) => sum + size.width,
          0,
        ) +
        gap * Math.max(0, childSizes.length - 1),
      height: Math.max(
        measured?.height ?? 0,
        ...childSizes.map((size) => size.height),
      ),
    }
  }

  return {
    width: Math.max(
      measured?.width ?? 0,
      ...childSizes.map((size) => size.width),
    ),
    height:
      childSizes.reduce(
        (sum, size) => sum + size.height,
        0,
      ) +
      gap * Math.max(0, childSizes.length - 1),
  }
}

function measureDiCViewTree(
  node: DiCViewNode,
  constraints: Size,
  environment: DiCTreeLayoutEnvironment,
  containerWidth: number,
  root: boolean,
  inheritedTypography?: DiCTypographyContext,
): Size {
  const rem = environment.rem ?? 16
  const paint = resolvedPaint(
    node,
    environment,
    containerWidth,
  )
  const typography = typographyForNode(
    node,
    paint,
    inheritedTypography,
    environment,
  )

  const top = paddingValue(
    paint.paddingTop,
    constraints.width,
    rem,
  )
  const right = paddingValue(
    paint.paddingRight,
    constraints.width,
    rem,
  )
  const bottom = paddingValue(
    paint.paddingBottom,
    constraints.width,
    rem,
  )
  const left = paddingValue(
    paint.paddingLeft,
    constraints.width,
    rem,
  )

  const explicitWidth = explicitDimension(
    paint.width,
    constraints.width,
    rem,
  )
  const explicitHeight = explicitDimension(
    paint.height,
    constraints.height,
    rem,
  )

  const provisionalContentWidth = Math.max(
    0,
    (explicitWidth ?? constraints.width) -
      left -
      right,
  )
  const provisionalContentHeight = Math.max(
    0,
    (explicitHeight ?? constraints.height) -
      top -
      bottom,
  )
  const nextContainerWidth = childContainerWidth(
    node,
    containerWidth,
    provisionalContentWidth,
  )
  const intrinsic = intrinsicChildrenSize(
    node,
    paint,
    provisionalContentWidth,
    provisionalContentHeight,
    environment,
    nextContainerWidth,
    typography,
    explicitWidth === undefined
      ? undefined
      : provisionalContentWidth,
    explicitHeight === undefined
      ? undefined
      : provisionalContentHeight,
  )

  return {
    width: finalDimension(
      paint.width,
      constraints.width,
      intrinsic.width + left + right,
      rem,
      root,
    ),
    height: finalDimension(
      paint.height,
      constraints.height,
      intrinsic.height + top + bottom,
      rem,
      root,
    ),
  }
}

function justifyOffsets(
  justify: DiCViewPaint['justify'],
  free: number,
  itemCount: number,
  baseGap: number,
): {
  start: number
  gap: number
} {
  const remaining = Math.max(0, free)

  switch (justify) {
    case 'center':
      return {
        start: remaining / 2,
        gap: baseGap,
      }
    case 'end':
      return {
        start: remaining,
        gap: baseGap,
      }
    case 'space-between':
      return {
        start: 0,
        gap:
          itemCount > 1
            ? baseGap + remaining / (itemCount - 1)
            : baseGap,
      }
    case 'space-around': {
      const share =
        itemCount > 0
          ? remaining / itemCount
          : 0
      return {
        start: share / 2,
        gap: baseGap + share,
      }
    }
    case 'space-evenly': {
      const share =
        itemCount > 0
          ? remaining / (itemCount + 1)
          : 0
      return {
        start: share,
        gap: baseGap + share,
      }
    }
    default:
      return {
        start: 0,
        gap: baseGap,
      }
  }
}

function crossOffset(
  align: DiCViewPaint['align'],
  available: number,
  item: number,
): number {
  const free = Math.max(0, available - item)

  switch (align) {
    case 'center':
      return free / 2
    case 'end':
      return free
    default:
      return 0
  }
}

function layoutChildren(
  node: DiCViewNode,
  paint: DiCViewPaint,
  contentFrame: DiCViewFrame,
  environment: DiCTreeLayoutEnvironment,
  containerWidth: number,
  typography: DiCTypographyContext | undefined,
): readonly DiCViewTreeLayout[] {
  if (node.children.length === 0) return []

  if (paint.layout === 'grid') {
    throw new Error(
      'DiC grid tree layout is not implemented yet',
    )
  }
  if (paint.layout === 'absolute') {
    throw new Error(
      'DiC absolute tree layout is not implemented yet',
    )
  }

  const rem = environment.rem ?? 16
  const nextContainerWidth = childContainerWidth(
    node,
    containerWidth,
    contentFrame.width,
  )

  if (paint.layout === 'stack') {
    return node.children.map((child) =>
      layoutDiCViewTreeInternal(
        child,
        {
          x: contentFrame.x,
          y: contentFrame.y,
          width: contentFrame.width,
          height: contentFrame.height,
        },
        environment,
        nextContainerWidth,
        false,
        typography,
      ),
    )
  }

  if (paint.layout === 'flex' && paint.wrap) {
    throw new Error(
      'DiC flex wrap tree layout is not implemented yet',
    )
  }

  const direction =
    paint.layout === 'flex'
      ? paint.direction ?? 'row'
      : 'column'
  const row =
    direction === 'row' ||
    direction === 'row-reverse'
  const reverse =
    direction === 'row-reverse' ||
    direction === 'column-reverse'
  const gap =
    paint.layout === 'flex'
      ? gapValue(paint, contentFrame.width, rem)
      : 0

  const childPaints = node.children.map((child) =>
    resolvedPaint(
      child,
      environment,
      nextContainerWidth,
    ),
  )
  const desired = node.children.map((child) =>
    measureDiCViewTree(
      child,
      {
        width: contentFrame.width,
        height: contentFrame.height,
      },
      environment,
      nextContainerWidth,
      false,
      typography,
    ),
  )

  const mainAvailable = row
    ? contentFrame.width
    : contentFrame.height
  const crossAvailable = row
    ? contentFrame.height
    : contentFrame.width
  const flexible = childPaints.map((childPaint) =>
    (row ? childPaint.width : childPaint.height) === 'fill',
  )
  const baseMain = desired.map((size, index) =>
    flexible[index]
      ? 0
      : row
        ? size.width
        : size.height,
  )
  const baseGapTotal =
    gap * Math.max(0, node.children.length - 1)
  const fixedMain =
    baseMain.reduce((sum, value) => sum + value, 0)
  const flexibleCount =
    flexible.filter(Boolean).length
  const flexibleShare =
    flexibleCount === 0
      ? 0
      : Math.max(
          0,
          mainAvailable - fixedMain - baseGapTotal,
        ) / flexibleCount
  const finalMain = baseMain.map((value, index) =>
    flexible[index] ? flexibleShare : value,
  )
  const occupied =
    finalMain.reduce((sum, value) => sum + value, 0) +
    baseGapTotal
  const justify = justifyOffsets(
    paint.justify,
    mainAvailable - occupied,
    node.children.length,
    gap,
  )

  const visualIndices = node.children.map((_, index) => index)
  if (reverse) visualIndices.reverse()

  const result = new Array<DiCViewTreeLayout>(
    node.children.length,
  )
  let cursor = justify.start

  for (const index of visualIndices) {
    const child = node.children[index]
    const size = desired[index]
    if (child === undefined || size === undefined) continue

    const main = finalMain[index] ?? 0
    const childPaint = childPaints[index]
    const desiredCross = row ? size.height : size.width
    const childCrossDimension = row
      ? childPaint?.height
      : childPaint?.width
    const align =
      paint.align ??
      (paint.layout === 'flex' ? 'stretch' : 'start')
    const stretches =
      align === 'stretch' &&
      (
        childCrossDimension === undefined ||
        childCrossDimension === 'fill'
      )
    const cross = stretches
      ? crossAvailable
      : desiredCross
    const crossStart = crossOffset(
      align,
      crossAvailable,
      cross,
    )
    const allocatedWidth = row ? main : cross
    const allocatedHeight = row ? cross : main

    result[index] = layoutDiCViewTreeInternal(
      child,
      {
        x:
          contentFrame.x +
          (row ? cursor : crossStart),
        y:
          contentFrame.y +
          (row ? crossStart : cursor),
        width: allocatedWidth,
        height: allocatedHeight,
        forceWidth: allocatedWidth,
        forceHeight: allocatedHeight,
      },
      environment,
      nextContainerWidth,
      false,
      typography,
    )

    cursor += main + justify.gap
  }

  return result
}

function layoutDiCViewTreeInternal(
  node: DiCViewNode,
  constraints: DiCTreeConstraints,
  environment: DiCTreeLayoutEnvironment,
  containerWidth: number,
  root: boolean,
  inheritedTypography?: DiCTypographyContext,
): DiCViewTreeLayout {
  const rem = environment.rem ?? 16
  const paint = resolvedPaint(
    node,
    environment,
    containerWidth,
  )
  const typography = typographyForNode(
    node,
    paint,
    inheritedTypography,
    environment,
  )
  const measuredSize = measureDiCViewTree(
    node,
    {
      width: constraints.width,
      height: constraints.height,
    },
    environment,
    containerWidth,
    root,
    inheritedTypography,
  )
  const size = {
    width: constraints.forceWidth ?? measuredSize.width,
    height: constraints.forceHeight ?? measuredSize.height,
  }

  const top = paddingValue(
    paint.paddingTop,
    size.width,
    rem,
  )
  const right = paddingValue(
    paint.paddingRight,
    size.width,
    rem,
  )
  const bottom = paddingValue(
    paint.paddingBottom,
    size.width,
    rem,
  )
  const left = paddingValue(
    paint.paddingLeft,
    size.width,
    rem,
  )

  const frame: DiCViewFrame = {
    x: constraints.x ?? 0,
    y: constraints.y ?? 0,
    width: size.width,
    height: size.height,
  }
  const contentFrame: DiCViewFrame = {
    x: left,
    y: top,
    width: Math.max(0, size.width - left - right),
    height: Math.max(0, size.height - top - bottom),
  }

  return {
    node,
    paint,
    typography,
    frame,
    contentFrame,
    children: layoutChildren(
      node,
      paint,
      contentFrame,
      environment,
      childContainerWidth(
        node,
        containerWidth,
        contentFrame.width,
      ),
      typography,
    ),
  }
}

export function layoutDiCViewTree(
  node: DiCViewNode,
  constraints: DiCTreeConstraints,
  environment: DiCTreeLayoutEnvironment,
): DiCViewTreeLayout {
  const initialContainerWidth =
    environment.containerWidth ??
    environment.viewportWidth

  return layoutDiCViewTreeInternal(
    node,
    constraints,
    environment,
    initialContainerWidth,
    constraints.root ?? true,
    environment.typography,
  )
}

export function measureDiCIntrinsicSize(
  node: DiCViewNode,
  constraints: Size,
  environment: DiCTreeLayoutEnvironment,
): DiCIntrinsicSize {
  return measureDiCViewTree(
    node,
    constraints,
    environment,
    environment.containerWidth ??
      environment.viewportWidth,
    false,
    environment.typography,
  )
}
