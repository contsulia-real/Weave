import type { CSSProperties } from 'react'
import type {
  ImageFit,
  ImagePosition,
} from '../../core/image-types'

export type ImageVariableStyle = CSSProperties &
  Record<`--weave-image-${string}`, string | number | undefined>

const positionMap: Readonly<Record<string, string>> = {
  center: 'center',
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
  'top-left': 'left top',
  'top-right': 'right top',
  'bottom-left': 'left bottom',
  'bottom-right': 'right bottom',
}

export function imagePosition(
  value: ImagePosition | undefined,
): string | undefined {
  if (value === undefined) return undefined
  return positionMap[value] ?? value
}

export function resolveImageStyle(input: {
  fit?: ImageFit
  position?: ImagePosition
}): ImageVariableStyle {
  const output: ImageVariableStyle = {}

  if (input.fit !== undefined) {
    output['--weave-image-fit'] = input.fit
  }

  const position = imagePosition(input.position)
  if (position !== undefined) {
    output['--weave-image-position'] = position
  }

  return output
}
