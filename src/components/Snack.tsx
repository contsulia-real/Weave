import {
  isValidElement,
  useCallback,
  useEffect,
  useInsertionEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type {
  TransitionEvent as ReactTransitionEvent,
} from 'react'
import { createPortal } from 'react-dom'
import type {
  IconComponent,
  IconSvg,
} from '../core/icon-types'
import type {
  SnackIcon,
  SnackProps,
  SnackVariant,
  SnackViewProps,
} from '../core/snack-types'
import { resolveSnackTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ensureSnackStylesheet } from '../renderers/dom/snack-stylesheet'
import { useTheme } from '../theme/theme-context'
import { ThemeProvider } from '../theme/ThemeProvider'
import { Button } from './Button'
import { Icon } from './Icon'
import { Progress } from './Progress'
import { Text } from './Text'
import { View } from './View'
import { durationMilliseconds } from './internal/motion-duration'
import {
  retainSnackRegion,
  syncSnackRegion,
} from './internal/snack-region'

const PROGRESS_UPDATE_MS = 50

type SnackVisualState =
  | 'open'
  | 'closing'

function urgentVariant(
  variant: SnackVariant,
): boolean {
  return (
    variant === 'warning' ||
    variant === 'danger'
  )
}

function iconContent(
  icon: SnackIcon,
) {
  const renderedIcon =
    isValidElement(icon) ? (
      <Icon
        svg={icon as IconSvg}
        size="small"
        stroke="regular"
        viewProps={{
          className:
            'weave-snack__icon',
          'aria-hidden': true,
        }}
      />
    ) : (
      <Icon
        icon={icon as IconComponent}
        size="small"
        stroke="regular"
        viewProps={{
          className:
            'weave-snack__icon',
          'aria-hidden': true,
        }}
      />
    )

  return (
    <View
      className="weave-snack__icon-shell"
      aria-hidden="true"
    >
      {renderedIcon}
    </View>
  )
}

export function Snack({
  variant = 'default',
  duration = 4000,
  persistent = false,
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

  const [
    present,
    setPresent,
  ] = useState(resolvedOpen)
  const [
    visualState,
    setVisualState,
  ] = useState<SnackVisualState>(
    'open',
  )
  const [
    paused,
    setPaused,
  ] = useState(false)
  const [
    remainingMs,
    setRemainingMs,
  ] = useState(durationMs)
  const [
    region,
    setRegion,
  ] = useState<HTMLDivElement | null>(
    null,
  )

  const requestedOpenRef =
    useRef(resolvedOpen)
  const previousOpenRef =
    useRef(resolvedOpen)
  const remainingMsRef =
    useRef(durationMs)
  const activeStartedAtRef =
    useRef<number | null>(null)
  const controlledRef =
    useRef(controlled)
  const onOpenChangeRef =
    useRef(onOpenChange)
  const dismissedRef =
    useRef(!resolvedOpen)

  const { theme, mode } =
    useTheme()
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

  useEffect(() => {
    const wasOpen =
      previousOpenRef.current
    previousOpenRef.current =
      resolvedOpen

    if (
      resolvedOpen &&
      !wasOpen
    ) {
      remainingMsRef.current =
        durationMs
      activeStartedAtRef.current =
        null
      setRemainingMs(durationMs)
    }
  }, [
    durationMs,
    resolvedOpen,
  ])

  const completeDismiss =
    useCallback(() => {
      if (dismissedRef.current) {
        return
      }

      dismissedRef.current = true
      setPresent(false)
      onDismissed?.()
    }, [onDismissed])

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

  // Controlled visibility is mirrored into presence so the
  // exit transition can finish before the portal unmounts.
  /* oxlint-disable react/set-state-in-effect */
  useEffect(() => {
    if (resolvedOpen) {
      dismissedRef.current = false
      setPresent(true)
      setVisualState('open')
      return
    }

    if (!present) {
      return
    }

    setVisualState('closing')

    const reducedMotion =
      typeof window !== 'undefined' &&
        typeof window.matchMedia ===
        'function'
        ? window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches
        : false

    if (reducedMotion) {
      completeDismiss()
      return
    }

    const timer =
      globalThis.setTimeout(
        () => {
          completeDismiss()
        },
        exitDuration + 32,
      )

    return () => {
      globalThis.clearTimeout(
        timer,
      )
    }
  }, [
    completeDismiss,
    exitDuration,
    present,
    resolvedOpen,
  ])
  /* oxlint-enable react/set-state-in-effect */

  useEffect(() => {
    if (
      !resolvedOpen ||
      persistent ||
      paused
    ) {
      return
    }

    const startRemaining =
      remainingMsRef.current

    if (startRemaining <= 0) {
      requestOpen(false)
      return
    }

    const startedAt =
      Date.now()
    activeStartedAtRef.current =
      startedAt

    const updateProgress = () => {
      const elapsed =
        Math.max(
          0,
          Date.now() -
          startedAt,
        )
      const nextRemaining =
        Math.max(
          0,
          startRemaining -
          elapsed,
        )

      setRemainingMs(
        nextRemaining,
      )
    }

    updateProgress()

    const progressTimer =
      globalThis.setInterval(
        updateProgress,
        PROGRESS_UPDATE_MS,
      )

    const closeTimer =
      globalThis.setTimeout(
        () => {
          remainingMsRef.current = 0
          activeStartedAtRef.current =
            null
          setRemainingMs(0)
          requestOpen(false)
        },
        startRemaining,
      )

    return () => {
      globalThis.clearInterval(
        progressTimer,
      )
      globalThis.clearTimeout(
        closeTimer,
      )

      if (
        activeStartedAtRef.current !==
        startedAt
      ) {
        return
      }

      const elapsed =
        Math.max(
          0,
          Date.now() -
          startedAt,
        )
      const nextRemaining =
        Math.max(
          0,
          startRemaining -
          elapsed,
        )

      remainingMsRef.current =
        nextRemaining
      activeStartedAtRef.current =
        null
      setRemainingMs(
        nextRemaining,
      )
    }
  }, [
    paused,
    persistent,
    requestOpen,
    resolvedOpen,
  ])

  // The shared portal region is external DOM state. React
  // needs one synchronization render after retaining it.
  /* oxlint-disable react/set-state-in-effect */
  useLayoutEffect(() => {
    if (
      !present ||
      typeof document ===
      'undefined'
    ) {
      setRegion(null)
      return
    }

    const handle =
      retainSnackRegion(
        document,
        placement,
      )

    setRegion(handle.element)

    return () => {
      handle.release()
    }
  }, [
    placement,
    present,
  ])
  /* oxlint-enable react/set-state-in-effect */

  useLayoutEffect(() => {
    if (region === null) {
      return
    }

    syncSnackRegion(region)
  }, [
    region,
    visualState,
  ])

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

    completeDismiss()
  }

  if (
    !present ||
    region === null
  ) {
    return null
  }

  const customContent =
    'children' in contentProps &&
    contentProps.children !==
    undefined

  const content = customContent
    ? contentProps.children
    : (
      <>
        {contentProps.icon ===
          undefined
          ? null
          : iconContent(
            contentProps.icon,
          )}

        <Text
          typo={
            base?.typo ??
            'body-medium'
          }
          viewProps={{
            className:
              'weave-snack__message',
          }}
        >
          {contentProps.text}
        </Text>

        {contentProps.action ===
          undefined
          ? null
          : (
            <Button
              text={
                contentProps.action
              }
              size="small"
              variant="ghost"
              viewProps={{
                className:
                  'weave-snack__action',
                color:
                  'var(--weave-snack-accent)',
                onClick: () => {
                  contentProps.onAction()
                  requestOpen(false)
                },
              }}
            />
          )}
      </>
    )

  const lifetimeProgress =
    durationMs <= 0
      ? 0
      : Math.min(
        1,
        Math.max(
          0,
          remainingMs /
          durationMs,
        ),
      )

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

        {!persistent &&
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
              PROGRESS_UPDATE_MS
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
              bottom:
                0,
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
