import type {
  ReactEventHandler,
  Ref,
} from 'react'
import type { ViewProps } from './view-types'

export type ImageSource = string | Blob

export type ImageFit =
  | 'contain'
  | 'cover'
  | 'fill'
  | 'none'
  | 'scale-down'

export type ImagePosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | (string & {})

export type ImageLoading = 'lazy' | 'eager'

export type ImageViewProps = Omit<
  ViewProps<HTMLImageElement>,
  'children' | 'onLoad' | 'onError'
> & {
  ref?: Ref<HTMLImageElement>
}

export interface ImageProps {
  src: ImageSource
  alt: string
  fit?: ImageFit
  position?: ImagePosition
  loading?: ImageLoading
  onLoad?: ReactEventHandler<HTMLImageElement>
  onError?: ReactEventHandler<HTMLImageElement>
  viewProps?: ImageViewProps
}
