import {
  useInsertionEffect,
  useLayoutEffect,
} from 'react'
import type { ImageProps } from '../core/image-types'
import { resolveImage } from '../core/resolved-image'
import type { ViewProps } from '../core/view-types'
import { compileDOMImage } from '../renderers/dom/resolve-image'
import { ensureImageStylesheet } from '../renderers/dom/image-stylesheet'
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
  const hostProps: ViewProps<HTMLImageElement> = viewProps
  const resolvedImage = resolveImage({
    src,
    alt,
    fit,
    position,
    loading,
  })
  const componentStyle = compileDOMImage(resolvedImage)

  const {
    elementRef,
    className,
    inlineStyle,
    resolved,
  } = useViewHost(hostProps, componentStyle, 'image')

  useInsertionEffect(ensureImageStylesheet, [])

  useLayoutEffect(() => {
    if (typeof src === 'string') return

    const element = elementRef.current

    if (
      element === null ||
      typeof URL === 'undefined' ||
      typeof URL.createObjectURL !== 'function'
    ) {
      return
    }

    const objectUrl = URL.createObjectURL(src)
    element.src = objectUrl

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [src, elementRef])

  return (
    <img
      {...resolved.domProps}
      ref={elementRef}
      src={
        typeof resolvedImage.src === 'string'
          ? resolvedImage.src
          : undefined
      }
      alt={resolvedImage.alt}
      loading={resolvedImage.loading}
      onLoad={onLoad}
      onError={onError}
      data-weave-view=""
      data-weave-image=""
      data-weave-layout={resolved.layout}
      className={['weave-image', className].filter(Boolean).join(' ')}
      style={inlineStyle}
    />
  )
}
