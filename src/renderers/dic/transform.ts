import type {
  Length,
  TransformOperation,
} from '../../core/view-types'
import { resolveDiCLength } from './layout-view'

export interface DiCTransformSize {
  width: number
  height: number
}

export interface DiCTransformPoint {
  x: number
  y: number
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

function translateMatrix(
  x: number,
  y: number,
): Matrix2D {
  return {
    ...identity,
    e: x,
    f: y,
  }
}

function scaleMatrix(
  x: number,
  y: number,
): Matrix2D {
  return {
    ...identity,
    a: x,
    d: y,
  }
}

function rotateMatrix(
  radians: number,
): Matrix2D {
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

function skewXMatrix(
  radians: number,
): Matrix2D {
  return {
    ...identity,
    c: Math.tan(radians),
  }
}

function skewYMatrix(
  radians: number,
): Matrix2D {
  return {
    ...identity,
    b: Math.tan(radians),
  }
}

export function resolveDiCTransformAngle(
  value: number | string,
): number {
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
    `Unsupported DiC angle "${String(value)}"`,
  )
}

export function resolveDiCTransformLength(
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
      `Unsupported DiC transform length "${String(value)}"`,
    )
  }

  return resolved
}

function operationMatrix(
  operation: TransformOperation,
  size: DiCTransformSize,
  rem: number,
): Matrix2D {
  if ('translate' in operation) {
    return translateMatrix(
      resolveDiCTransformLength(
        operation.translate[0],
        size.width,
        rem,
      ),
      resolveDiCTransformLength(
        operation.translate[1],
        size.height,
        rem,
      ),
    )
  }
  if ('translateX' in operation) {
    return translateMatrix(
      resolveDiCTransformLength(
        operation.translateX,
        size.width,
        rem,
      ),
      0,
    )
  }
  if ('translateY' in operation) {
    return translateMatrix(
      0,
      resolveDiCTransformLength(
        operation.translateY,
        size.height,
        rem,
      ),
    )
  }
  if ('rotate' in operation) {
    return rotateMatrix(
      resolveDiCTransformAngle(operation.rotate),
    )
  }
  if ('skewX' in operation) {
    return skewXMatrix(
      resolveDiCTransformAngle(operation.skewX),
    )
  }
  if ('skewY' in operation) {
    return skewYMatrix(
      resolveDiCTransformAngle(operation.skewY),
    )
  }
  if ('scale' in operation) {
    return scaleMatrix(
      operation.scale,
      operation.scale,
    )
  }
  if ('scaleX' in operation) {
    return scaleMatrix(operation.scaleX, 1)
  }

  return scaleMatrix(1, operation.scaleY)
}

function transformMatrix(
  operations: readonly TransformOperation[] | undefined,
  size: DiCTransformSize,
  rem: number,
): Matrix2D {
  if (operations === undefined) return identity

  let matrix = translateMatrix(
    size.width / 2,
    size.height / 2,
  )

  for (const operation of operations) {
    matrix = multiply(
      matrix,
      operationMatrix(
        operation,
        size,
        rem,
      ),
    )
  }

  return multiply(
    matrix,
    translateMatrix(
      -size.width / 2,
      -size.height / 2,
    ),
  )
}

function invert(
  matrix: Matrix2D,
): Matrix2D | undefined {
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

function applyMatrix(
  matrix: Matrix2D,
  point: DiCTransformPoint,
): DiCTransformPoint {
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

export function inverseDiCTransformPoint(
  point: DiCTransformPoint,
  operations: readonly TransformOperation[] | undefined,
  size: DiCTransformSize,
  rem: number,
): DiCTransformPoint | undefined {
  const inverse = invert(
    transformMatrix(
      operations,
      size,
      rem,
    ),
  )

  return inverse === undefined
    ? undefined
    : applyMatrix(inverse, point)
}

export function applyDiCTransform(
  context: CanvasRenderingContext2D,
  operations: readonly TransformOperation[] | undefined,
  size: DiCTransformSize,
  rem: number,
): void {
  if (operations === undefined) return

  context.translate(
    size.width / 2,
    size.height / 2,
  )

  for (const operation of operations) {
    if ('translate' in operation) {
      context.translate(
        resolveDiCTransformLength(
          operation.translate[0],
          size.width,
          rem,
        ),
        resolveDiCTransformLength(
          operation.translate[1],
          size.height,
          rem,
        ),
      )
      continue
    }
    if ('translateX' in operation) {
      context.translate(
        resolveDiCTransformLength(
          operation.translateX,
          size.width,
          rem,
        ),
        0,
      )
      continue
    }
    if ('translateY' in operation) {
      context.translate(
        0,
        resolveDiCTransformLength(
          operation.translateY,
          size.height,
          rem,
        ),
      )
      continue
    }
    if ('rotate' in operation) {
      context.rotate(
        resolveDiCTransformAngle(operation.rotate),
      )
      continue
    }
    if ('skewX' in operation) {
      context.transform(
        1,
        0,
        Math.tan(
          resolveDiCTransformAngle(
            operation.skewX,
          ),
        ),
        1,
        0,
        0,
      )
      continue
    }
    if ('skewY' in operation) {
      context.transform(
        1,
        Math.tan(
          resolveDiCTransformAngle(
            operation.skewY,
          ),
        ),
        0,
        1,
        0,
        0,
      )
      continue
    }
    if ('scale' in operation) {
      context.scale(
        operation.scale,
        operation.scale,
      )
      continue
    }
    if ('scaleX' in operation) {
      context.scale(operation.scaleX, 1)
      continue
    }

    context.scale(1, operation.scaleY)
  }

  context.translate(
    -size.width / 2,
    -size.height / 2,
  )
}
