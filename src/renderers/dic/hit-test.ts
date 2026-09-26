import type { Length, TransformOperation } from '../../core/view-types'
import type { DiCViewNode, DiCViewPaint } from './compile-view'
import type { DiCViewTreeLayout } from './layout-tree'
import { resolveDiCLength } from './layout-view'

export interface DiCPoint {
  x: number
  y: number
}

export interface DiCHitResult {
  target: DiCViewNode
  path: readonly DiCViewNode[]
  layouts: readonly DiCViewTreeLayout[]
}

interface Matrix2D {
  a: number
  b: number
  c: number
  d: number
  e: number
  f: number
}

const identity: Matrix2D = {
  a: 1,
  b: 0,
  c: 0,
  d: 1,
  e: 0,
  f: 0,
}

function multiply(
  left: Matrix2D,
  right: Matrix2D,
): Matrix2D {
  return {
    a: left.a * right.a + left.c * right.b,
    b: left.b * right.a + left.d * right.b,
    c: left.a * right.c + left.c * right.d,
    d: left.b * right.c + left.d * right.d,
    e: left.a * right.e + left.c * right.f + left.e,
    f: left.b * right.e + left.d * right.f + left.f,
  }
}

function translate(x: number, y: number): Matrix2D {
  return {
    ...identity,
    e: x,
    f: y,
  }
}

function scale(x: number, y: number): Matrix2D {
  return {
    ...identity,
    a: x,
    d: y,
  }
}

function rotate(radians: number): Matrix2D {
  const cosine = Math.cos(radians)
  const sine = Math.sin(radians)

  return {
    a: cosine,
    b: sine,
    c: -sine,
    d: cosine,
    e: 0,
    f: 0,
  }
}

function skewX(radians: number): Matrix2D {
  return {
    ...identity,
    c: Math.tan(radians),
  }
}

function skewY(radians: number): Matrix2D {
  return {
    ...identity,
    b: Math.tan(radians),
  }
}

function angle(value: number | string): number {
  if (typeof value === 'number') {
    return value * Math.PI / 180
  }

  const input = value.trim()
  if (input.endsWith('deg')) {
    const parsed = Number.parseFloat(input)
    if (Number.isFinite(parsed)) {
      return parsed * Math.PI / 180
    }
  }

  if (input.endsWith('rad')) {
    const parsed = Number.parseFloat(input)
    if (Number.isFinite(parsed)) return parsed
  }

  throw new Error(
    `Unsupported DiC hit-test angle "${String(value)}"`,
  )
}

function length(
  value: Length,
  reference: number,
  rem: number,
): number {
  const resolved = resolveDiCLength(
    value,
    reference,
    rem,
  )

  if (resolved === undefined) {
    throw new Error(
      `Unsupported DiC hit-test transform length "${String(value)}"`,
    )
  }

  return resolved
}

function operationMatrix(
  operation: TransformOperation,
  width: number,
  height: number,
  rem: number,
): Matrix2D {
  if ('translate' in operation) {
    return translate(
      length(operation.translate[0], width, rem),
      length(operation.translate[1], height, rem),
    )
  }
  if ('translateX' in operation) {
    return translate(
      length(operation.translateX, width, rem),
      0,
    )
  }
  if ('translateY' in operation) {
    return translate(
      0,
      length(operation.translateY, height, rem),
    )
  }
  if ('rotate' in operation) {
    return rotate(angle(operation.rotate))
  }
  if ('skewX' in operation) {
    return skewX(angle(operation.skewX))
  }
  if ('skewY' in operation) {
    return skewY(angle(operation.skewY))
  }
  if ('scale' in operation) {
    return scale(operation.scale, operation.scale)
  }
  if ('scaleX' in operation) {
    return scale(operation.scaleX, 1)
  }

  return scale(1, operation.scaleY)
}

function transformMatrix(
  paint: DiCViewPaint,
  width: number,
  height: number,
  rem: number,
): Matrix2D {
  const operations = paint.transform
  if (operations === undefined) return identity

  let matrix = translate(width / 2, height / 2)

  for (const operation of operations) {
    matrix = multiply(
      matrix,
      operationMatrix(
        operation,
        width,
        height,
        rem,
      ),
    )
  }

  return multiply(
    matrix,
    translate(-width / 2, -height / 2),
  )
}

function invert(matrix: Matrix2D): Matrix2D | undefined {
  const determinant =
    matrix.a * matrix.d -
    matrix.b * matrix.c

  if (Math.abs(determinant) < 1e-12) {
    return undefined
  }

  return {
    a: matrix.d / determinant,
    b: -matrix.b / determinant,
    c: -matrix.c / determinant,
    d: matrix.a / determinant,
    e:
      (matrix.c * matrix.f -
        matrix.d * matrix.e) /
      determinant,
    f:
      (matrix.b * matrix.e -
        matrix.a * matrix.f) /
      determinant,
  }
}

function transformPoint(
  matrix: Matrix2D,
  point: DiCPoint,
): DiCPoint {
  return {
    x:
      matrix.a * point.x +
      matrix.c * point.y +
      matrix.e,
    y:
      matrix.b * point.x +
      matrix.d * point.y +
      matrix.f,
  }
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
  const inverse = invert(
    transformMatrix(
      layout.paint,
      layout.frame.width,
      layout.frame.height,
      rem,
    ),
  )

  return inverse === undefined
    ? undefined
    : transformPoint(inverse, translated)
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
