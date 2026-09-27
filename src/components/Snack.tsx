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
import { Text } from './Text'
import { View } from './View'
import { durationMilliseconds } from './internal/motion-duration'
import {
  retainSnackRegion,
} from './internal/snack-region'

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
  if (isValidElement(icon)) {
    return (
      <Icon
        svg={icon as IconSvg}
        size="medium"
        stroke="regular"
        viewProps={{
          className:
            'weave-snack__icon',
          'aria-hidden': true,
        }}
      />
    )
  }

  return (
    <Icon
      icon={icon as IconComponent}
      size="medium"
      stroke="regular"
      viewProps={{
        className:
          'weave-snack__icon',
        'aria-hidden': true,
      }}
    />
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
    region,
    setRegion,
  ] = useState<HTMLDivElement | null>(
    null,
  )

  const requestedOpenRef =
    useRef(resolvedOpen)

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

        if (!controlled) {
          setUncontrolledOpen(next)
        }

        onOpenChange?.(next)
      },
      [
        controlled,
        onOpenChange,
      ],
    )

  useEffect(() => {
    if (resolvedOpen) {
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
      setPresent(false)
      return
    }

    const timer =
      globalThis.setTimeout(
        () => {
          setPresent(false)
        },
        exitDuration + 32,
      )

    return () => {
      globalThis.clearTimeout(
        timer,
      )
    }
  }, [
    exitDuration,
    present,
    resolvedOpen,
  ])

  useEffect(() => {
    if (
      !resolvedOpen ||
      persistent ||
      paused
    ) {
      return
    }

    const wait =
      Math.max(0, duration)

    const timer =
      globalThis.setTimeout(
        () => {
          requestOpen(false)
        },
        wait,
      )

    return () => {
      globalThis.clearTimeout(
        timer,
      )
    }
  }, [
    duration,
    paused,
    persistent,
    requestOpen,
    resolvedOpen,
  ])

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

    setPresent(false)
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
          variant,
        }}
      >
        {content}
      </View>
    </ThemeProvider>,
    region,
  )
}
