import type {
  ImagePosition,
} from '../../core/image-types'
import type {
  DiCImageContent,
  DiCIntrinsicEnvironment,
} from './compile-view'
import type { DiCViewFrame } from './draw-view'
import { resolveDiCLength } from './layout-view'

type AxisPosition =
  | {
      kind: 'ratio'
      value: number
    }
  | {
      kind: 'offset'
      value: number
    }

export interface DiCImagePlacement {
  x: number
  y: number
  width: number
  height: number
}

function ratio(value: number): AxisPosition {
  return {
    kind: 'ratio',
    value,
  }
}

const namedPosition: Readonly<
  Record<string, readonly [AxisPosition, AxisPosition]>
> = {
  center: [ratio(0.5), ratio(0.5)],
  top: [ratio(0.5), ratio(0)],
  bottom: [ratio(0.5), ratio(1)],
  left: [ratio(0), ratio(0.5)],
  right: [ratio(1), ratio(0.5)],
  'top-left': [ratio(0), ratio(0)],
  'top-right': [ratio(1), ratio(0)],
  'bottom-left': [ratio(0), ratio(1)],
  'bottom-right': [ratio(1), ratio(1)],
}

function axisToken(
  token: string,
  axis: 'x' | 'y',
  rem: number,
  reference: number,
): AxisPosition | undefined {
  if (token === 'center') return ratio(0.5)

  if (axis === 'x') {
    if (token === 'left') return ratio(0)
    if (token === 'right') return ratio(1)
  } else {
    if (token === 'top') return ratio(0)
    if (token === 'bottom') return ratio(1)
  }

  if (token.endsWith('%')) {
    const parsed = Number.parseFloat(token)
    return Number.isFinite(parsed)
      ? ratio(parsed / 100)
      : undefined
  }

  const length = resolveDiCLength(
    token,
    reference,
    rem,
  )

  return length === undefined
    ? undefined
    : {
        kind: 'offset',
        value: length,
      }
}

function parsePosition(
  value: ImagePosition,
  rem: number,
  width: number,
  height: number,
): readonly [AxisPosition, AxisPosition] {
  const named = namedPosition[value]
  if (named !== undefined) return named

  const tokens = value.trim().split(/\s+/)

  if (tokens.length === 1) {
    const token = tokens[0] ?? ''
    if (token === 'top' || token === 'bottom') {
      const y = axisToken(token, 'y', rem, height)
      if (y !== undefined) return [ratio(0.5), y]
    }

    const x = axisToken(token, 'x', rem, width)
    if (x !== undefined) return [x, ratio(0.5)]
  }

  if (tokens.length === 2) {
    const [xToken = '', yToken = ''] = tokens
    const x = axisToken(xToken, 'x', rem, width)
    const y = axisToken(yToken, 'y', rem, height)

    if (x !== undefined && y !== undefined) {
      return [x, y]
    }
  }

  throw new Error(
    `Unsupported DiC image position "${value}"`,
  )
}

function axisOffset(
  position: AxisPosition,
  freeSpace: number,
): number {
  return position.kind === 'ratio'
    ? freeSpace * position.value
    : position.value
}

export function resolveDiCImagePlacement(
  content: DiCImageContent,
  naturalWidth: number,
  naturalHeight: number,
  frame: DiCViewFrame,
  rem: number,
): DiCImagePlacement {
  const [xPosition, yPosition] = parsePosition(
    content.image.position,
    rem,
    frame.width,
    frame.height,
  )

  let width = naturalWidth
  let height = naturalHeight

  switch (content.image.fit) {
    case 'fill':
      width = frame.width
      height = frame.height
      break
    case 'contain': {
      const scale = Math.min(
        frame.width / naturalWidth,
        frame.height / naturalHeight,
      )
      width = naturalWidth * scale
      height = naturalHeight * scale
      break
    }
    case 'cover': {
      const scale = Math.max(
        frame.width / naturalWidth,
        frame.height / naturalHeight,
      )
      width = naturalWidth * scale
      height = naturalHeight * scale
      break
    }
    case 'scale-down': {
      if (
        naturalWidth > frame.width ||
        naturalHeight > frame.height
      ) {
        const scale = Math.min(
          frame.width / naturalWidth,
          frame.height / naturalHeight,
        )
        width = naturalWidth * scale
        height = naturalHeight * scale
      }
      break
    }
    case 'none':
      break
  }

  return {
    x: axisOffset(
      xPosition,
      frame.width - width,
    ),
    y: axisOffset(
      yPosition,
      frame.height - height,
    ),
    width,
    height,
  }
}

export function drawDiCImage(
  context: CanvasRenderingContext2D,
  content: DiCImageContent,
  frame: DiCViewFrame,
  environment: Pick<
    DiCIntrinsicEnvironment,
    'imageResources' | 'rem'
  >,
): void {
  const resources = environment.imageResources
  if (resources === undefined) {
    throw new Error(
      'DiC image drawing requires image resources',
    )
  }

  const resource = resources.get(content.image.src)
  if (resource.status !== 'ready') return

  if (
    resource.width <= 0 ||
    resource.height <= 0 ||
    frame.width <= 0 ||
    frame.height <= 0
  ) {
    return
  }

  const placement = resolveDiCImagePlacement(
    content,
    resource.width,
    resource.height,
    frame,
    environment.rem,
  )

  context.save()
  context.translate(frame.x, frame.y)
  context.beginPath()
  context.rect(0, 0, frame.width, frame.height)
  context.clip()
  context.drawImage(
    resource.drawable,
    placement.x,
    placement.y,
    placement.width,
    placement.height,
  )
  context.restore()
}
