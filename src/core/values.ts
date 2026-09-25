import type {
  BackgroundValue,
  ClipValue,
  ColorValue,
  Dimension,
  Gradient,
  Length,
  RadiusValue,
  ShadowDefinition,
  ShadowValue,
  TransformOperation,
  TransformOriginValue,
} from './view-types'

const TOKEN_NAME = /^[A-Za-z][A-Za-z0-9_-]*$/

export function length(value: Length | undefined): string | undefined {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}rem` : value
}

export function dimension(
  value: Dimension | undefined,
): string | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'number') return length(value)

  switch (value) {
    case 'fill':
      return '100%'
    case 'fit':
      return 'fit-content'
    case 'content':
      return 'max-content'
    default:
      return value
  }
}

export function time(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}ms` : value
}

export function angle(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}deg` : value
}

export function color(value: ColorValue | undefined): string | undefined {
  if (value === undefined) return undefined
  if (!TOKEN_NAME.test(value)) return value
  return `var(--weave-color-${value}, ${value})`
}

export function radius(value: RadiusValue | undefined): string | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'number') return length(value)

  switch (value) {
    case 'none':
      return '0'
    case 'small':
    case 'medium':
    case 'large':
    case 'full':
      return `var(--weave-radius-${value})`
    default:
      return value
  }
}

function gradientStop([stopColor, at]: readonly [string, number]): string {
  return `${color(stopColor)} ${at * 100}%`
}

export function gradient(value: Gradient): string {
  const stops = value.stops.map(gradientStop).join(', ')

  if (value.type === 'linear') {
    return `linear-gradient(${angle(value.angle ?? 180)}, ${stops})`
  }

  return `radial-gradient(${stops})`
}

export function background(
  value: BackgroundValue | undefined,
): string | undefined {
  if (value === undefined) return undefined
  return typeof value === 'string' ? color(value) : gradient(value)
}

function shadowPart(value: ShadowDefinition): string {
  const x = length(value.x ?? 0)
  const y = length(value.y ?? 0)
  const blur = length(value.blur ?? 0)
  const spread = length(value.spread ?? 0)
  const baseColor = color(value.color ?? '#000') ?? '#000'
  const shadowColor =
    value.opacity === undefined
      ? baseColor
      : `color-mix(in srgb, ${baseColor} ${value.opacity * 100}%, transparent)`

  return `${x} ${y} ${blur} ${spread} ${shadowColor}`
}

export function shadow(value: ShadowValue | undefined): string | undefined {
  if (value === undefined) return undefined

  if (typeof value === 'string') {
    if (value === 'none') return 'none'
    return `var(--weave-shadow-${value})`
  }

  const values = Array.isArray(value) ? value : [value]
  return values.map(shadowPart).join(', ')
}

export function filterValue(input: {
  blur?: Length
  brightness?: number
  contrast?: number
  saturate?: number
  grayscale?: number
  sepia?: number
  hueRotate?: number | string
}): string | undefined {
  const parts: string[] = []

  if (input.blur !== undefined) parts.push(`blur(${length(input.blur)})`)
  if (input.brightness !== undefined) {
    parts.push(`brightness(${input.brightness})`)
  }
  if (input.contrast !== undefined) parts.push(`contrast(${input.contrast})`)
  if (input.saturate !== undefined) parts.push(`saturate(${input.saturate})`)
  if (input.grayscale !== undefined) {
    parts.push(`grayscale(${input.grayscale})`)
  }
  if (input.sepia !== undefined) parts.push(`sepia(${input.sepia})`)
  if (input.hueRotate !== undefined) {
    parts.push(`hue-rotate(${angle(input.hueRotate)})`)
  }

  return parts.length > 0 ? parts.join(' ') : undefined
}

export function backdropFilterValue(input: {
  backdropBlur?: Length
  backdropSaturate?: number
}): string | undefined {
  const parts: string[] = []

  if (input.backdropBlur !== undefined) {
    parts.push(`blur(${length(input.backdropBlur)})`)
  }
  if (input.backdropSaturate !== undefined) {
    parts.push(`saturate(${input.backdropSaturate})`)
  }

  return parts.length > 0 ? parts.join(' ') : undefined
}

function transformOperation(operation: TransformOperation): string {
  if ('translate' in operation) {
    return `translate(${length(operation.translate[0])}, ${length(operation.translate[1])})`
  }
  if ('translateX' in operation) {
    return `translateX(${length(operation.translateX)})`
  }
  if ('translateY' in operation) {
    return `translateY(${length(operation.translateY)})`
  }
  if ('rotate' in operation) return `rotate(${angle(operation.rotate)})`
  if ('skewX' in operation) return `skewX(${angle(operation.skewX)})`
  if ('skewY' in operation) return `skewY(${angle(operation.skewY)})`
  if ('scale' in operation) return `scale(${operation.scale})`
  if ('scaleX' in operation) return `scaleX(${operation.scaleX})`
  return `scaleY(${operation.scaleY})`
}

export function transformValue(input: {
  translateX?: Length
  translateY?: Length
  rotate?: number | string
  skewX?: number | string
  skewY?: number | string
  scale?: number
  scaleX?: number
  scaleY?: number
  transform?: readonly TransformOperation[]
}): string | undefined {
  if (input.transform !== undefined) {
    return input.transform.map(transformOperation).join(' ')
  }

  const parts: string[] = []

  if (input.translateX !== undefined || input.translateY !== undefined) {
    parts.push(
      `translate(${length(input.translateX ?? 0)}, ${length(input.translateY ?? 0)})`,
    )
  }
  if (input.rotate !== undefined) parts.push(`rotate(${angle(input.rotate)})`)
  if (input.skewX !== undefined) parts.push(`skewX(${angle(input.skewX)})`)
  if (input.skewY !== undefined) parts.push(`skewY(${angle(input.skewY)})`)

  if (input.scale !== undefined) {
    parts.push(`scale(${input.scale})`)
  } else if (input.scaleX !== undefined || input.scaleY !== undefined) {
    parts.push(`scale(${input.scaleX ?? 1}, ${input.scaleY ?? 1})`)
  }

  return parts.length > 0 ? parts.join(' ') : undefined
}

export function transformOrigin(
  value: TransformOriginValue | undefined,
): string | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'string') return value
  return `${length(value.x)} ${length(value.y)}`
}

export function clipPath(value: ClipValue | undefined): string | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'string') return value

  switch (value.type) {
    case 'circle':
      return `circle(${length(value.radius)})`
    case 'polygon':
      return `polygon(${value.points
        .map(([x, y]) => `${length(x)} ${length(y)}`)
        .join(', ')})`
    case 'path':
      return `path("${value.path.replaceAll('"', '\\"')}")`
  }
}
