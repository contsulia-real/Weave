import { type ReactNode, useContext } from 'react'
import type { SnackProps, SnackVariant, SnackViewProps } from '../core/snack-types'
import { resolveSnackTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ensureSnackStylesheet } from '../renderers/dom/snack-stylesheet'
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { useTheme } from '../theme/theme-context'
import { isNode } from './internal/dom-realm'
import { durationMilliseconds } from './internal/motion-duration'
import { SnackBody } from './internal/SnackBody'
import { SnackHostContext } from './internal/snack-host-context'
import { ThemedPortal } from './internal/ThemedPortal'
import { useControllableBoolean } from './internal/use-controllable-boolean'
import { useExitPresence, useExitTransitionEnd } from './internal/use-exit-presence'
import { SNACK_PROGRESS_UPDATE_MS, useSnackLifetime } from './internal/use-snack-lifetime'
import { useSnackRegion } from './internal/use-snack-region'
import { Progress } from './Progress'
import { View } from './View'

function urgentVariant(variant: SnackVariant): boolean {
  return variant === 'warning' || variant === 'danger'
}

export function Snack(props: SnackProps): import('react').JSX.Element | null {
  const {
    variant = 'default',
    duration = 4000,
    persistent = false,
    progress = false,
    placement = 'bottom-center',
    open,
    defaultOpen = true,
    onOpenChange,
    onDismissed,
    viewProps = {},
    ...contentProps
  } = props
  const { value: resolvedOpen, request: requestOpen } = useControllableBoolean(
    open,
    defaultOpen,
    onOpenChange,
  )
  const durationMs = Math.max(0, duration)
  const { layoutAnimation, ...surfaceViewProps } = viewProps

  const snackHostContext = useContext(SnackHostContext)
  const snackHostTarget = snackHostContext?.target
  const snackHostScopeId = snackHostContext?.scopeId ?? 'standalone'

  const { theme, reducedMotion } = useTheme()
  const base = theme.components.Snack?.base
  const themeClassName = useRuntimeStyleClass('snack-theme', resolveSnackTheme(theme))
  const exitDuration = durationMilliseconds(theme.tokens.motion?.duration?.fast, 120)
  const { present, visualState, finishExit } = useExitPresence(
    resolvedOpen,
    reducedMotion,
    exitDuration,
    onDismissed,
  )

  useStaticStylesheet(ensureSnackStylesheet)

  const { paused, setPaused, lifetimeProgress } = useSnackLifetime(
    resolvedOpen,
    durationMs,
    persistent,
    progress,
    () => requestOpen(false),
  )

  const region = useSnackRegion(present, snackHostTarget, snackHostScopeId, placement, visualState)

  const handlePointerEnter: NonNullable<SnackViewProps['onPointerEnter']> = (event) => {
    setPaused(true)
    viewProps.onPointerEnter?.(event)
  }

  const handlePointerLeave: NonNullable<SnackViewProps['onPointerLeave']> = (event) => {
    setPaused(false)
    viewProps.onPointerLeave?.(event)
  }

  const handleFocus: NonNullable<SnackViewProps['onFocus']> = (event) => {
    setPaused(true)
    viewProps.onFocus?.(event)
  }

  const handleBlur: NonNullable<SnackViewProps['onBlur']> = (event) => {
    const related = event.relatedTarget

    if (
      isNode(related, event.currentTarget.ownerDocument) &&
      event.currentTarget.contains(related)
    ) {
      viewProps.onBlur?.(event)
      return
    }

    setPaused(false)
    viewProps.onBlur?.(event)
  }

  const handleTransitionEnd = useExitTransitionEnd(
    resolvedOpen,
    visualState,
    finishExit,
    viewProps.onTransitionEnd,
  )

  if (!present || region === null) {
    return null
  }

  let content: ReactNode = null

  if ('children' in contentProps && contentProps.children !== undefined) {
    content = contentProps.children
  } else if ('text' in contentProps) {
    content = (
      <SnackBody
        text={contentProps.text}
        icon={contentProps.icon}
        action={contentProps.action}
        onAction={contentProps.onAction}
        typo={base?.typo}
        onRequestClose={() => {
          requestOpen(false)
        }}
      />
    )
  }

  return (
    <ThemedPortal target={region}>
      <View
        className="weave-snack-layout"
        layoutAnimation={
          layoutAnimation ?? {
            duration: 'normal',
            curve: 'emphasized',
            interruption: 'continue',
          }
        }
        data={{
          'weave-snack-layout': '',
          'weave-snack-state': visualState,
        }}
      >
        <View
          {...surfaceViewProps}
          role={urgentVariant(variant) ? 'alert' : 'status'}
          aria-atomic="true"
          aria-hidden={visualState === 'closing' ? true : undefined}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onTransitionEnd={handleTransitionEnd}
          layer={surfaceViewProps.layer ?? 'snack'}
          className={[
            'weave-snack',
            `weave-snack--${variant}`,
            themeClassName,
            surfaceViewProps.className,
          ]
            .filter(Boolean)
            .join(' ')}
          data={{
            ...surfaceViewProps.data,
            'weave-snack': '',
            'weave-snack-state': visualState,
            'weave-snack-placement': placement,
            'weave-snack-paused': paused ? '' : undefined,
            variant,
          }}
        >
          {content}

          {progress && !persistent && resolvedOpen && durationMs > 0 ? (
            <Progress
              progress={lifetimeProgress}
              mode="linear"
              size="small"
              color="var(--weave-snack-accent)"
              speed={SNACK_PROGRESS_UPDATE_MS}
              viewProps={{
                className: 'weave-snack__lifetime',
                position: 'absolute',
                left: 'var(--weave-snack-padding-x)',
                right: 'var(--weave-snack-padding-x)',
                width: 'auto',
                height: 'var(--weave-snack-progress-height)',
                bottom: 0,
                pointerEvents: 'none',
                data: {
                  'weave-snack-lifetime-progress': lifetimeProgress.toFixed(4),
                },
                'aria-hidden': true,
              }}
            />
          ) : null}
        </View>
      </View>
    </ThemedPortal>
  )
}
