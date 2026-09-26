import type { DiCViewNode, DiCViewPaint } from './compile-view'
import type { DiCViewTreeLayout } from './layout-tree'
import { inverseDiCTransformPoint } from './transform'

export interface DiCPoint {
  x: number
  y: number
}

export interface DiCHitResult {
  target: DiCViewNode
  path: readonly DiCViewNode[]
  layouts: readonly DiCViewTreeLayout[]
}

function localPoint(
  layout: DiCViewTreeLayout,
  pointInParent: DiCPoint,
  rem: number,
): DiCPoint | undefined {
  const translated = {
    x: pointInParent.x - layout.frame.x,
    y: pointInParent.y - layout.frame.y,
  }
  return inverseDiCTransformPoint(
    translated,
    layout.paint.transform,
    layout.frame,
    rem,
  )
}

function inside(
  layout: DiCViewTreeLayout,
  point: DiCPoint,
): boolean {
  return (
    point.x >= 0 &&
    point.y >= 0 &&
    point.x <= layout.frame.width &&
    point.y <= layout.frame.height
  )
}

function effectivePointerEvents(
  paint: DiCViewPaint,
  inherited: string,
): string {
  return paint.pointerEvents ?? inherited
}

function walk(
  layout: DiCViewTreeLayout,
  pointInParent: DiCPoint,
  rem: number,
  inheritedPointerEvents: string,
  nodePath: readonly DiCViewNode[],
  layoutPath: readonly DiCViewTreeLayout[],
): DiCHitResult | undefined {
  const point = localPoint(
    layout,
    pointInParent,
    rem,
  )
  if (point === undefined) return undefined

  const pointerEvents = effectivePointerEvents(
    layout.paint,
    inheritedPointerEvents,
  )
  const nextNodePath = [...nodePath, layout.node]
  const nextLayoutPath = [...layoutPath, layout]

  for (
    let index = layout.children.length - 1;
    index >= 0;
    index -= 1
  ) {
    const child = layout.children[index]
    if (child === undefined) continue

    const result = walk(
      child,
      point,
      rem,
      pointerEvents,
      nextNodePath,
      nextLayoutPath,
    )

    if (result !== undefined) return result
  }

  if (
    pointerEvents !== 'none' &&
    inside(layout, point)
  ) {
    return {
      target: layout.node,
      path: nextNodePath,
      layouts: nextLayoutPath,
    }
  }

  return undefined
}

export function hitTestDiCViewTree(
  layout: DiCViewTreeLayout,
  point: DiCPoint,
  rem = 16,
): DiCHitResult | undefined {
  return walk(
    layout,
    point,
    rem,
    'auto',
    [],
    [],
  )
}

export function findDiCNodePath(
  layout: DiCViewTreeLayout,
  node: DiCViewNode,
): readonly DiCViewNode[] | undefined {
  if (layout.node === node) return [node]

  for (const child of layout.children) {
    const childPath = findDiCNodePath(child, node)
    if (childPath !== undefined) {
      return [layout.node, ...childPath]
    }
  }

  return undefined
}

export function cursorForDiCHit(
  hit: DiCHitResult | undefined,
): string | undefined {
  if (hit === undefined) return undefined

  for (let index = hit.layouts.length - 1; index >= 0; index -= 1) {
    const cursor = hit.layouts[index]?.paint.cursor
    if (cursor !== undefined) return cursor
  }

  return undefined
}
