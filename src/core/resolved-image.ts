import type {
  ImageFit,
  ImageLoading,
  ImagePosition,
  ImageSource,
} from './image-types'

export interface ResolvedImage {
  src: ImageSource
  alt: string
  fit: ImageFit
  position: ImagePosition
  loading?: ImageLoading
}

export function resolveImage(input: {
  src: ImageSource
  alt: string
  fit?: ImageFit
  position?: ImagePosition
  loading?: ImageLoading
}): ResolvedImage {
  return {
    src: input.src,
    alt: input.alt,
    fit: input.fit ?? 'fill',
    position: input.position ?? 'center',
    loading: input.loading,
  }
}
