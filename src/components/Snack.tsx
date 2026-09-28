import {
  useCallback,
  useContext,
  useEffect,
  useInsertionEffect,
  useRef,
  useState,
  type ReactNode,
  type TransitionEvent as ReactTransitionEvent,
} from 'react'
import { createPortal } from 'react-dom'
import type {
  SnackProps,
  SnackVariant,
  SnackViewProps,
} from '../core/snack-types'
import { resolveSnackTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ensureSnackStylesheet } from '../renderers/dom/snack-stylesheet'
import { useTheme } from '../theme/theme-context'
import { ThemeProvider } from '../theme/ThemeProvider'
import { Progress } from './Progress'
import { View } from './View'
import { durationMilliseconds } from './internal/motion-duration'
import { SnackBody } from './internal/SnackBody'
import { useExitPresence } from './internal/use-exit-presence'
import {
  SnackHostContext,
} from './internal/snack-host-context'
import {
  SNACK_PROGRESS_UPDATE_MS,
  useSnackLifetime,
} from './internal/use-snack-lifetime'
import { useSnackRegion } from './internal/use-snack-region'

function urgentVariant(
  variant: SnackVariant,
): boolean {
  return (
    variant === 'warning' ||
    variant === 'danger'
  )
}

export function Snack({
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
}: SnackProps) {
  const controlled =
    open !== undefined
  const [
    uncontrolledOpen,
    setUncontrolledOpen,
  ] = useState(defaultOpen)
  const resolvedOpen =
    open ?? uncontrolledOpen
  const durationMs =
    Math.max(0, duration)

  const requestedOpenRef =
    useRef(resolvedOpen)
  const controlledRef =
    useRef(controlled)
  const onOpenChangeRef =
    useRef(onOpenChange)

  const snackHostContext =
    useContext(SnackHostContext)
  const snackHostTarget =
    snackHostContext?.target
  const snackHostScopeId =
    snackHostContext?.scopeId ??
    'standalone'

  const {
    theme,
    mode,
    reducedMotion,
  } = useTheme()
  const base =
    theme.components.Snack?.base
  const themeClassName =
    useRuntimeStyleClass(
      'snack-theme',
      resolveSnackTheme(theme),
    )
  const exitDuration =
    durationMilliseconds(
      theme.tokens.motion
        ?.duration?.fast,
      120,
    )
  const {
    present,
    visualState,
    finishExit,
  } = useExitPresence(
    resolvedOpen,
    reducedMotion,
    exitDuration,
    onDismissed,
  )

  useInsertionEffect(
    ensureSnackStylesheet,
    [],
  )

  useEffect(() => {
    requestedOpenRef.current =
      resolvedOpen
  }, [resolvedOpen])

  useEffect(() => {
    controlledRef.current =
      controlled
    onOpenChangeRef.current =
      onOpenChange
  }, [
    controlled,
    onOpenChange,
  ])

  const requestOpen =
    useCallback(
      (next: boolean) => {
        if (
          requestedOpenRef.current ===
          next
        ) {
          return
        }

        requestedOpenRef.current =
          next

        if (!controlledRef.current) {
          setUncontrolledOpen(next)
        }

        onOpenChangeRef.current?.(
          next,
        )
      },
      [],
    )

  const {
    paused,
    setPaused,
    lifetimeProgress,
  } = useSnackLifetime(
    resolvedOpen,
    durationMs,
    persistent,
    progress,
    () => requestOpen(false),
  )

  const region = useSnackRegion(
    present,
    snackHostTarget,
    snackHostScopeId,
    placement,
    visualState,
  )

  const handlePointerEnter:
    NonNullable<
      SnackViewProps['onPointerEnter']
    > = (event) => {
      setPaused(true)
      viewProps.onPointerEnter?.(
        event,
      )
    }

  const handlePointerLeave:
    NonNullable<
      SnackViewProps['onPointerLeave']
    > = (event) => {
      setPaused(false)
      viewProps.onPointerLeave?.(
        event,
      )
    }

  const handleFocus:
    NonNullable<
      SnackViewProps['onFocus']
    > = (event) => {
      setPaused(true)
      viewProps.onFocus?.(
        event,
      )
    }

  const handleBlur:
    NonNullable<
      SnackViewProps['onBlur']
    > = (event) => {
      const related =
        event.relatedTarget

      if (
        related instanceof Node &&
        event.currentTarget.contains(
          related,
        )
      ) {
        viewProps.onBlur?.(
          event,
        )
        return
      }

      setPaused(false)
      viewProps.onBlur?.(
        event,
      )
    }

  const handleTransitionEnd = (
    event:
      ReactTransitionEvent<HTMLDivElement>,
  ) => {
    viewProps.onTransitionEnd?.(
      event,
    )

    if (
      event.target !==
        event.currentTarget ||
      resolvedOpen ||
      visualState !== 'closing'
    ) {
      return
    }

    finishExit()
  }

  if (
    !present ||
    region === null
  ) {
    return null
  }

  let content: ReactNode = null

  if (
    'children' in contentProps &&
    contentProps.children !== undefined
  ) {
    content =
      contentProps.children
  } else if (
    'text' in contentProps
  ) {
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

  return createPortal(
    <ThemeProvider
      theme={theme}
      mode={mode}
    >
      <View
        {...viewProps}
        role={
          urgentVariant(variant)
            ? 'alert'
            : 'status'
        }
        aria-atomic="true"
        aria-hidden={
          visualState === 'closing'
            ? true
            : undefined
        }
        onPointerEnter={
          handlePointerEnter
        }
        onPointerLeave={
          handlePointerLeave
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
        onTransitionEnd={
          handleTransitionEnd
        }
        layer={
          viewProps.layer ??
          'snack'
        }
        className={[
          'weave-snack',
          `weave-snack--${variant}`,
          themeClassName,
          viewProps.className,
        ].filter(Boolean).join(' ')}
        data={{
          ...viewProps.data,
          'weave-snack': '',
          'weave-snack-state':
            visualState,
          'weave-snack-placement':
            placement,
          'weave-snack-paused':
            paused
              ? ''
              : undefined,
          variant,
        }}
      >
        {content}

        {progress &&
          !persistent &&
          resolvedOpen &&
          durationMs > 0 ? (
          <Progress
            progress={
              lifetimeProgress
            }
            mode="linear"
            size="small"
            color="var(--weave-snack-accent)"
            speed={
              SNACK_PROGRESS_UPDATE_MS
            }
            viewProps={{
              className:
                'weave-snack__lifetime',
              position:
                'absolute',
              left:
                'var(--weave-snack-padding-x)',
              right:
                'var(--weave-snack-padding-x)',
              width: 'auto',
              bottom: 0,
              pointerEvents:
                'none',
              data: {
                'weave-snack-lifetime-progress':
                  lifetimeProgress.toFixed(
                    4,
                  ),
              },
              'aria-hidden':
                true,
            }}
          />
        ) : null}
      </View>
    </ThemeProvider>,
    region,
  )
}
