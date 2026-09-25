import { useInsertionEffect } from 'react'
import type { ProgressProps } from '../core/progress-types'
import {
  resolveProgressStyle,
  resolveProgressValueStyle,
} from '../renderers/dom/resolve-progress'
import { ensureProgressStylesheet } from '../renderers/dom/progress-stylesheet'
import { View } from './View'

export function Progress(props: ProgressProps) {
  useInsertionEffect(ensureProgressStylesheet, [])

  const {
    mode = 'spin',
    dotted = false,
    tracked = false,
    size = 'medium',
    color = 'primary',
    speed = 'normal',
    viewProps = {},
  } = props

  const undetermined = props.undetermined === true
  const progress = undetermined
    ? undefined
    : Math.min(1, Math.max(0, props.progress))

  const componentStyle = resolveProgressStyle(speed)

  const className = [
    'weave-progress',
    `weave-progress--${mode}`,
    `weave-progress--${size}`,
    dotted ? 'weave-progress--dotted' : undefined,
    tracked ? 'weave-progress--tracked' : undefined,
    undetermined
      ? 'weave-progress--undetermined'
      : 'weave-progress--determined',
    typeof speed === 'string'
      ? `weave-progress--speed-${speed}`
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
        'weave-progress': '',
        'weave-progress-mode': mode,
        'weave-progress-dotted': dotted || undefined,
        'weave-progress-tracked': tracked || undefined,
      }}
      style={{
        ...componentStyle,
        ...viewProps.style,
      }}
    >
      <View
        className="weave-progress__visual"
        data={{
          'weave-progress-visual': '',
        }}
        style={
          progress === undefined
            ? undefined
            : resolveProgressValueStyle(progress)
        }
      />
    </View>
  )
}
