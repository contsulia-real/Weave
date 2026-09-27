import {
  createElement,
  useInsertionEffect,
} from 'react'
import type {
  ProgressMode,
  ProgressProps,
  ProgressSize,
  ProgressSpeed,
} from '../core/progress-types'
import { resolveProgress } from '../core/resolved-progress'
import { resolveView } from '../core/resolved-view'
import type { ViewProps } from '../core/view-types'
import { assertDiCViewPropsSupported } from '../renderers/dic/react-compat'
import { DIC_PROGRESS_HOST } from '../renderers/dic/react-host-types'
import { useWeaveRenderer } from '../renderers/renderer-context'
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

function DOMProgressVisual(
  props: ProgressVisualProps,
) {
  useInsertionEffect(
    ensureProgressStylesheet,
    [],
  )

  const progress = resolveProgress(props)
  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass(
    'progress-theme',
    resolveProgressTheme(
      theme,
      progress.mode,
      progress.size,
    ),
  )
  const speedClassName = useRuntimeStyleClass(
    'progress-speed',
    resolveProgressStyle(
      progress.speed,
    ),
  )
  const valueClassName = useRuntimeStyleClass(
    'progress-value',
    progress.progress === undefined
      ? undefined
      : resolveProgressValueStyle(
          progress.progress,
        ),
  )

  const hostProps: ViewProps<HTMLSpanElement> = {
    ...props.viewProps,
    color: progress.color,
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
      data-weave-progress-mode={progress.mode}
      data-weave-progress-tracked={
        progress.tracked || undefined
      }
      data-weave-layout={resolved.layout}
      className={[
        'weave-progress',
        `weave-progress--${progress.mode}`,
        `weave-progress--${progress.size}`,
        progress.tracked
          ? 'weave-progress--tracked'
          : undefined,
        progress.undetermined
          ? 'weave-progress--undetermined'
          : 'weave-progress--determined',
        typeof progress.speed === 'string'
          ? `weave-progress--speed-${progress.speed}`
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

function DiCProgressVisual(
  props: ProgressVisualProps,
) {
  const { theme } = useTheme()
  const progress = resolveProgress(props)
  const hostProps: ViewProps<HTMLSpanElement> = {
    ...props.viewProps,
    color: progress.color,
  }

  assertDiCViewPropsSupported(
    hostProps as unknown as ViewProps<HTMLElement>,
    theme.breakpoints,
    'Progress.viewProps',
  )

  const view = resolveView(
    hostProps,
    theme.breakpoints,
  )

  return createElement(
    DIC_PROGRESS_HOST,
    {
      view,
      progress,
      theme,
    },
  )
}

export function ProgressVisual(
  props: ProgressVisualProps,
) {
  const renderer = useWeaveRenderer()

  return renderer === 'dic'
    ? <DiCProgressVisual {...props} />
    : <DOMProgressVisual {...props} />
}

export function Progress(
  props: ProgressProps,
) {
  const progress = resolveProgress({
    undetermined:
      props.undetermined === true,
    progress:
      props.undetermined === true
        ? undefined
        : props.progress,
    mode: props.mode,
    tracked: props.tracked,
    size: props.size,
    color: props.color,
    speed: props.speed,
  })

  const semanticViewProps:
    ViewProps<HTMLSpanElement> = {
      ...props.viewProps,
      role: 'progressbar',
      busy:
        progress.undetermined ||
        undefined,
      valueMin:
        progress.undetermined
          ? undefined
          : 0,
      valueMax:
        progress.undetermined
          ? undefined
          : 1,
      valueNow: progress.progress,
    }

  return (
    <ProgressVisual
      undetermined={progress.undetermined}
      progress={progress.progress}
      mode={progress.mode}
      tracked={progress.tracked}
      size={progress.size}
      color={progress.color}
      speed={progress.speed}
      viewProps={semanticViewProps}
    />
  )
}
