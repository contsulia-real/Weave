import type { CSSProperties } from 'react'
import type { ImagePosition } from '../../core/image-types'
import type { ResolvedImage } from '../../core/resolved-image'

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

export function compileDOMImage(
  image: ResolvedImage,
): ImageVariableStyle {
  const output: ImageVariableStyle = {
    '--weave-image-fit': image.fit,
  }

  const position = imagePosition(image.position)
  if (position !== undefined) {
    output['--weave-image-position'] = position
  }

  return output
}
