import {
  createElement,
  useInsertionEffect,
  useLayoutEffect,
} from 'react'
import type { ImageProps } from '../core/image-types'
import { resolveImage } from '../core/resolved-image'
import { resolveView } from '../core/resolved-view'
import type { ViewProps } from '../core/view-types'
import { compileDOMImage } from '../renderers/dom/resolve-image'
import { ensureImageStylesheet } from '../renderers/dom/image-stylesheet'
import { assertDiCViewPropsSupported } from '../renderers/dic/react-compat'
import { DIC_IMAGE_HOST } from '../renderers/dic/react-host-types'
import { useWeaveRenderer } from '../renderers/renderer-context'
import { useTheme } from '../theme/theme-context'
import { useViewHost } from './internal/use-view-host'

function DOMImage({
  src,
  alt,
  fit,
  position,
  loading,
  onLoad,
  onError,
  viewProps = {},
}: ImageProps) {
  const hostProps:
    ViewProps<HTMLImageElement> =
      viewProps
  const resolvedImage = resolveImage({
    src,
    alt,
    fit,
    position,
    loading,
  })
  const componentStyle =
    compileDOMImage(resolvedImage)

  const {
    elementRef,
    className,
    inlineStyle,
    resolved,
  } = useViewHost(
    hostProps,
    componentStyle,
    'image',
  )

  useInsertionEffect(
    ensureImageStylesheet,
    [],
  )

  useLayoutEffect(() => {
    if (typeof src === 'string') return

    const element = elementRef.current

    if (
      element === null ||
      typeof URL === 'undefined' ||
      typeof URL.createObjectURL !==
        'function'
    ) {
      return
    }

    const objectUrl =
      URL.createObjectURL(src)
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
        typeof resolvedImage.src ===
        'string'
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
      className={[
        'weave-image',
        className,
      ].filter(Boolean).join(' ')}
      style={inlineStyle}
    />
  )
}

function DiCImage({
  src,
  alt,
  fit,
  position,
  loading,
  onLoad,
  onError,
  viewProps = {},
}: ImageProps) {
  const { theme } = useTheme()

  if (
    onLoad !== undefined ||
    onError !== undefined
  ) {
    throw new Error(
      'Image onLoad/onError bridge is not implemented for DiC yet',
    )
  }

  if (loading === 'lazy') {
    throw new Error(
      'Image loading="lazy" is not implemented for DiC yet',
    )
  }

  const hostProps:
    ViewProps<HTMLImageElement> =
      viewProps

  assertDiCViewPropsSupported(
    hostProps as ViewProps<HTMLElement>,
    theme.breakpoints,
    'Image.viewProps',
  )

  const view = resolveView(
    hostProps,
    theme.breakpoints,
  )
  const image = resolveImage({
    src,
    alt,
    fit,
    position,
    loading,
  })

  return createElement(
    DIC_IMAGE_HOST,
    {
      view,
      image,
      theme,
    },
  )
}

export function Image(
  props: ImageProps,
) {
  const renderer = useWeaveRenderer()

  return renderer === 'dic'
    ? <DiCImage {...props} />
    : <DOMImage {...props} />
}
