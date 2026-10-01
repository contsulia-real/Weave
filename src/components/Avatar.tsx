import { useCallback, useInsertionEffect, useLayoutEffect, useRef, useState } from 'react'
import type { AvatarProps } from '../core/avatar-types'
import type { ImageSource } from '../core/image-types'
import { length } from '../core/values'
import { ensureAvatarStylesheet } from '../renderers/dom/avatar-stylesheet'
import { resolveAvatarTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { Image } from './Image'
import { assignRef } from './internal/assign-ref'
import { cssLengthPixels } from './internal/css-length-pixels'
import { Text } from './Text'
import { View } from './View'

function initials(name: string | undefined): string | undefined {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? []

  if (words.length === 0) return undefined

  if (words.length === 1) {
    return Array.from(words[0] ?? '')
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  const first = Array.from(words[0] ?? '')[0] ?? ''
  const last = Array.from(words[words.length - 1] ?? '')[0] ?? ''
  const value = `${first}${last}`.toUpperCase()

  return value.length === 0 ? undefined : value
}

function sizeMode(width: unknown, height: unknown): 'default' | 'width' | 'height' | 'both' {
  if (width === undefined && height === undefined) return 'default'
  if (width !== undefined && height === undefined) return 'width'
  if (width === undefined && height !== undefined) return 'height'
  return 'both'
}

export function Avatar({ src, name, fallback, viewProps = {} }: AvatarProps) {
  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass('avatar-theme', resolveAvatarTheme(theme))
  const [failedSource, setFailedSource] = useState<ImageSource | undefined>(undefined)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const fallbackTextRef = useRef<HTMLSpanElement | null>(null)
  const defaultSize = length(theme.components.Avatar?.base?.defaultSize) ?? '2.5rem'

  useInsertionEffect(ensureAvatarStylesheet, [])

  const showImage = src !== undefined && failedSource !== src
  const fallbackContent = fallback !== undefined ? fallback : initials(name)
  const textFallback = typeof fallbackContent === 'string' || typeof fallbackContent === 'number'

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node
      assignRef(viewProps.ref, node)
    },
    [viewProps.ref],
  )

  useLayoutEffect(() => {
    const root = rootRef.current
    if (root === null || !textFallback || showImage) return

    const update = () => {
      const text = fallbackTextRef.current
      if (text === null) return

      const basePixels = cssLengthPixels(root, defaultSize)
      const width = root.getBoundingClientRect().width
      const scale = basePixels > 0 ? Math.max(0, width / basePixels) : 1
      text.style.setProperty('--weave-avatar-fallback-scale', String(scale))
    }

    update()
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update)
    observer?.observe(root)

    return () => observer?.disconnect()
  }, [defaultSize, showImage, textFallback])

  return (
    <View
      {...viewProps}
      ref={setRootRef}
      className={['weave-avatar', themeClassName, viewProps.className].filter(Boolean).join(' ')}
      data={{
        ...viewProps.data,
        'weave-avatar': '',
        'weave-avatar-size-mode': sizeMode(viewProps.width, viewProps.height),
        'weave-avatar-image': showImage ? 'true' : 'false',
      }}
    >
      {showImage ? (
        <Image
          src={src}
          alt=""
          fit="cover"
          position="center"
          onLoad={() => setFailedSource(undefined)}
          onError={() => setFailedSource(src)}
          viewProps={{
            width: '100%',
            height: '100%',
            data: {
              'weave-avatar-content-image': '',
            },
          }}
        />
      ) : fallbackContent === undefined || fallbackContent === null ? null : (
        <span className="weave-avatar-fallback">
          {textFallback ? (
            <Text
              typo="body-large"
              viewProps={{
                ref: fallbackTextRef,
                className: 'weave-avatar-fallback-content',
              }}
            >
              {fallbackContent}
            </Text>
          ) : (
            fallbackContent
          )}
        </span>
      )}
    </View>
  )
}
