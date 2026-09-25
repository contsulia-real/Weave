import { useInsertionEffect } from 'react'
import type { LoadingIndicatorProps } from '../core/loading-indicator-types'
import {
  resolveLoadingIndicatorProgressStyle,
  resolveLoadingIndicatorStyle,
} from '../renderers/dom/resolve-loading-indicator'
import { ensureLoadingIndicatorStylesheet } from '../renderers/dom/loading-indicator-stylesheet'
import { View } from './View'

export function LoadingIndicator(props: LoadingIndicatorProps) {
  useInsertionEffect(ensureLoadingIndicatorStylesheet, [])

  const {
    size = 'medium',
    color = 'primary',
    speed = 'normal',
    viewProps = {},
  } = props

  const undetermined = props.undetermined === true
  const animation = undetermined
    ? props.animation ?? 'spin'
    : undefined

  const progress = undetermined
    ? undefined
    : Math.min(1, Math.max(0, props.progress))

  const componentStyle = resolveLoadingIndicatorStyle(speed)

  const className = [
    'weave-loading-indicator',
    `weave-loading-indicator--${size}`,
    undetermined
      ? 'weave-loading-indicator--undetermined'
      : 'weave-loading-indicator--determined',
    animation === undefined
      ? undefined
      : `weave-loading-indicator--${animation}`,
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
      }}
      style={{
        ...componentStyle,
        ...viewProps.style,
      }}
    >
      {undetermined && animation === 'dots' ? (
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
      ) : (
        <View
          className="weave-loading-indicator__ring"
          data={{
            'weave-loading-ring': '',
          }}
          style={
            progress === undefined
              ? undefined
              : resolveLoadingIndicatorProgressStyle(progress)
          }
        />
      )}
    </View>
  )
}
