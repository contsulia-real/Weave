import { useInsertionEffect } from 'react'
import type { ImageProps } from '../core/image-types'
import type { ViewProps } from '../core/view-types'
import { resolveImageStyle } from '../renderers/dom/resolve-image'
import { ensureImageStylesheet } from '../renderers/dom/image-stylesheet'
import { useImageSource } from './internal/use-image-source'
import { useViewHost } from './internal/use-view-host'

export function Image({
  src,
  alt,
  fit,
  position,
  loading,
  onLoad,
  onError,
  viewProps = {},
}: ImageProps) {
  const resolvedSrc = useImageSource(src)
  const hostProps: ViewProps<HTMLImageElement> = viewProps
  const componentStyle = resolveImageStyle({
    fit,
    position,
  })

  const {
    elementRef,
    className,
    mergedStyle,
    resolved,
  } = useViewHost(hostProps, componentStyle)

  useInsertionEffect(ensureImageStylesheet, [])

  return (
    <img
      {...resolved.domProps}
      ref={elementRef}
      src={resolvedSrc}
      alt={alt}
      loading={loading}
      onLoad={onLoad}
      onError={onError}
      data-weave-view=""
      data-weave-image=""
      data-weave-layout={resolved.layout}
      className={className}
      style={mergedStyle}
    />
  )
}
