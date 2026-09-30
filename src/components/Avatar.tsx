import { useInsertionEffect, useState } from 'react'
import type { AvatarProps } from '../core/avatar-types'
import type { ImageSource } from '../core/image-types'
import { ensureAvatarStylesheet } from '../renderers/dom/avatar-stylesheet'
import { resolveAvatarTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { Image } from './Image'
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

  useInsertionEffect(ensureAvatarStylesheet, [])

  const showImage = src !== undefined && failedSource !== src
  const fallbackContent = fallback !== undefined ? fallback : initials(name)

  return (
    <View
      {...viewProps}
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
          <span className="weave-avatar-fallback-content">{fallbackContent}</span>
        </span>
      )}
    </View>
  )
}
