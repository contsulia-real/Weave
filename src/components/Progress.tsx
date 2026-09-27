import { useInsertionEffect } from 'react'
import type {
  ProgressMode,
  ProgressProps,
  ProgressSize,
  ProgressSpeed,
} from '../core/progress-types'
import type { ViewProps } from '../core/view-types'
import { resolveProgressTheme } from '../renderers/dom/resolve-component-theme'
import {
  resolveProgressStyle,
  resolveProgressValueStyle,
} from '../renderers/dom/resolve-progress'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ensureProgressStylesheet } from '../renderers/dom/progress-stylesheet'
import { useTheme } from '../theme/theme-context'
import { useViewHost } from './internal/use-view-host'

export interface ProgressVisualProps {
  undetermined: boolean
  progress?: number
  mode?: ProgressMode
  tracked?: boolean
  size?: ProgressSize
  color?: string
  speed?: ProgressSpeed
  viewProps?: ViewProps<HTMLSpanElement>
}

export function ProgressVisual({
  undetermined,
  progress,
  mode = 'spin',
  tracked = false,
  size = 'medium',
  color = 'primary',
  speed = 'normal',
  viewProps = {},
}: ProgressVisualProps) {
  useInsertionEffect(ensureProgressStylesheet, [])

  const normalizedProgress = undetermined
    ? undefined
    : Math.min(1, Math.max(0, progress ?? 0))

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
    normalizedProgress === undefined
      ? undefined
      : resolveProgressValueStyle(normalizedProgress),
  )

  const hostProps: ViewProps<HTMLSpanElement> = {
    ...viewProps,
    color,
  }

  const {
    elementRef,
    className,
    inlineStyle,
    resolved,
  } = useViewHost(hostProps)

  return (
    <span
      {...resolved.domProps}
      ref={elementRef}
      data-weave-view=""
      data-weave-progress=""
      data-weave-progress-mode={mode}
      data-weave-progress-tracked={tracked || undefined}
      data-weave-layout={resolved.layout}
      className={[
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
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={inlineStyle}
    >
      <span
        data-weave-view=""
        data-weave-progress-track=""
        className="weave-progress__track"
        aria-hidden="true"
      />

      <span
        data-weave-view=""
        data-weave-progress-value=""
        className={[
          'weave-progress__value',
          valueClassName,
        ].filter(Boolean).join(' ')}
        aria-hidden="true"
      />
    </span>
  )
}

export function Progress(props: ProgressProps) {
  const undetermined = props.undetermined === true
  const progress = undetermined
    ? undefined
    : Math.min(1, Math.max(0, props.progress))

  const semanticViewProps: ViewProps<HTMLSpanElement> = {
    ...props.viewProps,
    role: 'progressbar',
    busy: undetermined || undefined,
    valueMin: undetermined ? undefined : 0,
    valueMax: undetermined ? undefined : 1,
    valueNow: progress,
  }

  return (
    <ProgressVisual
      undetermined={undetermined}
      progress={progress}
      mode={props.mode}
      tracked={props.tracked}
      size={props.size}
      color={props.color}
      speed={props.speed}
      viewProps={semanticViewProps}
    />
  )
}
