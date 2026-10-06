import { useInsertionEffect } from 'react'
import type {
  ProgressDirection,
  ProgressMode,
  ProgressProps,
  ProgressSize,
  ProgressSpeed,
} from '../core/progress-types'
import type { ViewProps } from '../core/view-types'
import { ensureProgressStylesheet } from '../renderers/dom/progress-stylesheet'
import { resolveProgressTheme } from '../renderers/dom/resolve-component-theme'
import { resolveProgressStyle, resolveProgressValueStyle } from '../renderers/dom/resolve-progress'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { useViewHost } from './internal/use-view-host'

interface ProgressVisualProps {
  indeterminate: boolean
  progress?: number
  mode?: ProgressMode
  tracked?: boolean
  size?: ProgressSize
  color?: string
  speed?: ProgressSpeed
  direction?: ProgressDirection
  inverse?: boolean
  viewProps?: ViewProps<HTMLSpanElement>
}

function ProgressVisual({
  indeterminate,
  progress,
  mode = 'spin',
  tracked = false,
  size = 'medium',
  color = 'primary',
  speed = 'normal',
  direction = 'horizontal',
  inverse = false,
  viewProps = {},
}: ProgressVisualProps) {
  useInsertionEffect(ensureProgressStylesheet, [])

  const normalizedProgress = indeterminate ? undefined : Math.min(1, Math.max(0, progress ?? 0))

  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass(
    'progress-theme',
    resolveProgressTheme(theme, mode, size),
  )
  const speedClassName = useRuntimeStyleClass('progress-speed', resolveProgressStyle(speed))
  const valueStyle =
    normalizedProgress === undefined ? undefined : resolveProgressValueStyle(normalizedProgress)

  const hostProps: ViewProps<HTMLSpanElement> = {
    ...viewProps,
    color,
  }

  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)

  return (
    <span
      {...resolved.domProps}
      ref={elementRef}
      data-weave-view=""
      data-weave-progress=""
      data-weave-progress-mode={mode}
      data-weave-progress-direction={mode === 'linear' ? direction : undefined}
      data-weave-progress-inverse={mode === 'linear' ? (inverse ? 'true' : 'false') : undefined}
      data-weave-progress-tracked={tracked || undefined}
      data-weave-layout={resolved.layout}
      className={[
        'weave-progress',
        `weave-progress--${mode}`,
        `weave-progress--${size}`,
        tracked ? 'weave-progress--tracked' : undefined,
        indeterminate ? 'weave-progress--indeterminate' : 'weave-progress--determined',
        typeof speed === 'string' ? `weave-progress--speed-${speed}` : undefined,
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
        className="weave-progress__value"
        style={valueStyle}
        aria-hidden="true"
      />
    </span>
  )
}

export function Progress(props: ProgressProps): import('react').JSX.Element {
  const indeterminate = props.indeterminate === true
  const progress = indeterminate ? undefined : Math.min(1, Math.max(0, props.progress))

  const semanticViewProps: ViewProps<HTMLSpanElement> = {
    ...props.viewProps,
    role: 'progressbar',
    busy: indeterminate || undefined,
    valueMin: indeterminate ? undefined : 0,
    valueMax: indeterminate ? undefined : 1,
    valueNow: progress,
  }

  return (
    <ProgressVisual
      indeterminate={indeterminate}
      progress={progress}
      mode={props.mode}
      tracked={props.tracked}
      size={props.size}
      color={props.color}
      speed={props.speed}
      direction={props.direction}
      inverse={props.inverse}
      viewProps={semanticViewProps}
    />
  )
}
