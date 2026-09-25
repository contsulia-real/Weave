import { useInsertionEffect } from 'react'
import type { ProgressProps } from '../core/progress-types'
import { resolveProgressTheme } from '../renderers/dom/resolve-component-theme'
import {
  resolveProgressStyle,
  resolveProgressValueStyle,
} from '../renderers/dom/resolve-progress'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ensureProgressStylesheet } from '../renderers/dom/progress-stylesheet'
import { useTheme } from '../theme/theme-context'
import { View } from './View'

export function Progress(
  props: ProgressProps,
) {
  useInsertionEffect(ensureProgressStylesheet, [])

  const {
    mode = 'spin',
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

  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass(
    'progress-theme',
    resolveProgressTheme(theme, mode, size),
  )
  const speedClassName = useRuntimeStyleClass(
    'progress-speed',
    resolveProgressStyle(speed),
  )
  const valueClassName = useRuntimeStyleClass(
    'progress-value',
    progress === undefined
      ? undefined
      : resolveProgressValueStyle(progress),
  )

  const className = [
    'weave-progress',
    `weave-progress--${mode}`,
    `weave-progress--${size}`,
    tracked ? 'weave-progress--tracked' : undefined,
    undetermined
      ? 'weave-progress--undetermined'
      : 'weave-progress--determined',
    typeof speed === 'string'
      ? `weave-progress--speed-${speed}`
      : undefined,
    themeClassName,
    speedClassName,
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
        'weave-progress-tracked': tracked || undefined,
      }}
      style={viewProps.style}
    >
      <View
        className="weave-progress__track"
        data={{
          'weave-progress-track': '',
        }}
      />

      <View
        className={[
          'weave-progress__value',
          valueClassName,
        ].filter(Boolean).join(' ')}
        data={{
          'weave-progress-value': '',
        }}
      />
    </View>
  )
}
