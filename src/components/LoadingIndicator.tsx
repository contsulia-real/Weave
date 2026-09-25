import { useInsertionEffect } from 'react'
import type { LoadingIndicatorProps } from '../core/loading-indicator-types'
import { resolveLoadingIndicatorStyle } from '../renderers/dom/resolve-loading-indicator'
import { ensureLoadingIndicatorStylesheet } from '../renderers/dom/loading-indicator-stylesheet'
import { View } from './View'

export function LoadingIndicator({
  size = 'medium',
  color = 'primary',
  speed = 'normal',
  animation = 'spin',
  viewProps = {},
  ...mode
}: LoadingIndicatorProps) {
  useInsertionEffect(ensureLoadingIndicatorStylesheet, [])

  const undetermined = mode.undetermined === true
  const progress = undetermined ? undefined : mode.progress
  const componentStyle = resolveLoadingIndicatorStyle({
    speed,
    progress,
  })

  const className = [
    'weave-loading-indicator',
    `weave-loading-indicator--${size}`,
    `weave-loading-indicator--${animation}`,
    typeof speed === 'string'
      ? `weave-loading-indicator--speed-${speed}`
      : undefined,
    viewProps.className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <View
      {...viewProps}
      className={className}
      role="progressbar"
      color={color}
      busy={undetermined || undefined}
      valueMin={undetermined ? undefined : 0}
      valueMax={undetermined ? undefined : 1}
      valueNow={progress}
      data={{
        ...viewProps.data,
        'weave-loading': '',
        'weave-loading-size': size,
        'weave-loading-animation': animation,
        'weave-loading-mode': undetermined ? 'undetermined' : 'determined',
      }}
      style={{
        ...componentStyle,
        ...viewProps.style,
      }}
    >
      <View
        className="weave-loading-indicator__ring"
        data={{
          'weave-loading-ring': '',
        }}
      />

      <View
        className="weave-loading-indicator__dots"
        data={{
          'weave-loading-dots': '',
        }}
      >
        <View
          className="weave-loading-indicator__dot"
          data={{ 'weave-loading-dot': '1' }}
        />
        <View
          className="weave-loading-indicator__dot"
          data={{ 'weave-loading-dot': '2' }}
        />
        <View
          className="weave-loading-indicator__dot"
          data={{ 'weave-loading-dot': '3' }}
        />
      </View>
    </View>
  )
}
