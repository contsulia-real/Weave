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
    size,
    color,
    speed,
    animation,
    progress,
  })

  return (
    <View
      {...viewProps}
      role="progressbar"
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
        data={{
          'weave-loading-ring': '',
        }}
      />

      <View
        data={{
          'weave-loading-dots': '',
        }}
      >
        <View data={{ 'weave-loading-dot': '1' }} />
        <View data={{ 'weave-loading-dot': '2' }} />
        <View data={{ 'weave-loading-dot': '3' }} />
      </View>
    </View>
  )
}
