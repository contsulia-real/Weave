import {
  useCallback,
  useEffect,
  useId,
  useInsertionEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import type {
  TransitionEvent as ReactTransitionEvent,
} from 'react'
import type {
  ToolTipProps,
} from '../core/tooltip-types'
import { length } from '../core/values'
import { resolveToolTipTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ensureToolTipStylesheet } from '../renderers/dom/tooltip-stylesheet'
import { useTheme } from '../theme/theme-context'
import { durationMilliseconds } from './internal/motion-duration'
import { ThemedPortal } from './internal/ThemedPortal'
import { useControllableBoolean } from './internal/use-controllable-boolean'
import {
  finishExitOnTransition,
  useExitPresence,
} from './internal/use-exit-presence'
import { useToolTipPosition } from './internal/use-tooltip-position'
import { Text } from './Text'
import { View } from './View'

export function ToolTip({
  children,
  content,
  placement = 'top',
  delay = 500,
  offset = 0.5,
  open,
  defaultOpen = false,
  onOpenChange,
  viewProps = {},
}: ToolTipProps) {
  const {
    value: resolvedOpen,
    request: requestOpen,
  } = useControllableBoolean(
    open,
    defaultOpen,
    onOpenChange,
  )

  const wrapperRef =
    useRef<HTMLSpanElement>(null)
  const targetRef =
    useRef<HTMLElement | null>(null)
  const openTimerRef =
    useRef<number | undefined>(
      undefined,
    )
  const pointerInsideRef =
    useRef(false)
  const focusInsideRef =
    useRef(false)
  const pointerFocusRef =
    useRef(false)

  const reactId = useId()
  const tooltipId =
    viewProps.id ??
    `weave-tooltip-${reactId}`

  const { theme, reducedMotion } =
    useTheme()
  const base =
    theme.components.ToolTip?.base
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
  )
  const themeClassName =
    useRuntimeStyleClass(
      'tooltip-theme',
      resolveToolTipTheme(theme),
    )

  useInsertionEffect(
    ensureToolTipStylesheet,
    [],
  )

  const clearOpenTimer =
    useCallback(() => {
      if (
        openTimerRef.current ===
        undefined
      ) {
        return
      }

      window.clearTimeout(
        openTimerRef.current,
      )
      openTimerRef.current =
        undefined
    }, [])

  const scheduleOpen =
    useCallback(() => {
      clearOpenTimer()

      const wait =
        Math.max(0, delay)

      if (wait === 0) {
        requestOpen(true)
        return
      }

      openTimerRef.current =
        window.setTimeout(() => {
          openTimerRef.current =
            undefined
          requestOpen(true)
        }, wait)
    }, [
      clearOpenTimer,
      delay,
      requestOpen,
    ])

  const closeIfInactive =
    useCallback(() => {
      if (
        pointerInsideRef.current ||
        focusInsideRef.current
      ) {
        return
      }

      clearOpenTimer()
      requestOpen(false)
    }, [
      clearOpenTimer,
      requestOpen,
    ])

  useLayoutEffect(() => {
    const wrapper =
      wrapperRef.current
    const target =
      wrapper?.firstElementChild

    if (
      !(target instanceof HTMLElement)
    ) {
      targetRef.current = null
      return
    }

    targetRef.current = target

    const handlePointerEnter = () => {
      pointerInsideRef.current = true
      scheduleOpen()
    }

    const handlePointerDown = () => {
      // Pointer activation can focus interactive targets. That focus should
      // not turn a hover tooltip into a pinned tooltip after pointer leave.
      pointerFocusRef.current = true
      focusInsideRef.current = false
    }

    const clearPointerFocus = () => {
      pointerFocusRef.current = false
    }

    const handlePointerLeave = () => {
      pointerInsideRef.current = false
      closeIfInactive()
    }

    const handleFocusIn = () => {
      if (pointerFocusRef.current) return
      focusInsideRef.current = true
      scheduleOpen()
    }

    const handleFocusOut = (
      event: FocusEvent,
    ) => {
      const nextTarget =
        event.relatedTarget

      if (
        nextTarget instanceof Node &&
        target.contains(nextTarget)
      ) {
        return
      }

      focusInsideRef.current = false
      closeIfInactive()
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key !== 'Escape') {
        return
      }

      clearOpenTimer()
      requestOpen(false)
    }

    target.addEventListener(
      'pointerenter',
      handlePointerEnter,
    )
    target.addEventListener(
      'pointerdown',
      handlePointerDown,
    )
    target.addEventListener(
      'pointerleave',
      handlePointerLeave,
    )
    target.ownerDocument.defaultView?.addEventListener(
      'pointerup',
      clearPointerFocus,
    )
    target.ownerDocument.defaultView?.addEventListener(
      'pointercancel',
      clearPointerFocus,
    )
    target.addEventListener(
      'focusin',
      handleFocusIn,
    )
    target.addEventListener(
      'focusout',
      handleFocusOut,
    )
    target.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      target.removeEventListener(
        'pointerenter',
        handlePointerEnter,
      )
      target.removeEventListener(
        'pointerdown',
        handlePointerDown,
      )
      target.removeEventListener(
        'pointerleave',
        handlePointerLeave,
      )
      target.ownerDocument.defaultView?.removeEventListener(
        'pointerup',
        clearPointerFocus,
      )
      target.ownerDocument.defaultView?.removeEventListener(
        'pointercancel',
        clearPointerFocus,
      )
      target.removeEventListener(
        'focusin',
        handleFocusIn,
      )
      target.removeEventListener(
        'focusout',
        handleFocusOut,
      )
      target.removeEventListener(
        'keydown',
        handleKeyDown,
      )

      if (
        targetRef.current === target
      ) {
        targetRef.current = null
      }
    }
  }, [
    children,
    clearOpenTimer,
    closeIfInactive,
    requestOpen,
    scheduleOpen,
  ])

  useEffect(
    () => () => {
      clearOpenTimer()
    },
    [clearOpenTimer],
  )

  useLayoutEffect(() => {
    const target =
      targetRef.current

    if (
      !resolvedOpen ||
      target === null
    ) {
      return
    }

    const descriptionIds =
      new Set(
        target
          .getAttribute(
            'aria-describedby',
          )
          ?.split(/\s+/)
          .filter(Boolean) ??
          [],
      )

    descriptionIds.add(tooltipId)
    target.setAttribute(
      'aria-describedby',
      [...descriptionIds].join(' '),
    )

    return () => {
      const currentDescription =
        target.getAttribute(
          'aria-describedby',
        )
      const remainingIds =
        currentDescription
          ?.split(/\s+/)
          .filter(
            (id) =>
              id.length > 0 &&
              id !== tooltipId,
          ) ??
        []

      if (remainingIds.length === 0) {
        target.removeAttribute(
          'aria-describedby',
        )
      } else {
        target.setAttribute(
          'aria-describedby',
          remainingIds.join(' '),
        )
      }
    }
  }, [
    resolvedOpen,
    tooltipId,
  ])

  const handleTransitionEnd = (
    event:
      ReactTransitionEvent<HTMLDivElement>,
  ) => {
    viewProps.onTransitionEnd?.(
      event,
    )

    finishExitOnTransition(
      event,
      resolvedOpen,
      visualState,
      finishExit,
    )
  }

  const offsetValue =
    length(offset) ??
    '0rem'
  const {
    positioned,
    placementStyle,
  } = useToolTipPosition(
    targetRef,
    present,
    placement,
    offsetValue,
  )

  const tooltip = present
    ? (
        <ThemedPortal>
          <View
            {...viewProps}
            id={tooltipId}
            role="tooltip"
            aria-hidden={
              visualState === 'closing'
                ? true
                : undefined
            }
            onTransitionEnd={
              handleTransitionEnd
            }
            position="fixed"
            layer={
              viewProps.layer ??
              'tooltip'
            }
            pointerEvents={
              viewProps.pointerEvents ??
              'none'
            }
            className={[
              'weave-tooltip',
              themeClassName,
              viewProps.className,
            ].filter(Boolean).join(' ')}
            data={{
              ...viewProps.data,
              'weave-tooltip': '',
              'weave-tooltip-state':
                visualState,
              placement,
            }}
            style={{
              ...placementStyle,
              visibility:
                positioned
                  ? 'visible'
                  : 'hidden',
              ...viewProps.style,
            }}
          >
            {typeof content ===
              'string' ||
            typeof content ===
              'number' ? (
              <Text
                typo={
                  base?.typo ??
                  'body-xsmall'
                }
              >
                {content}
              </Text>
            ) : (
              content
            )}
          </View>
        </ThemedPortal>
      )
    : null

  return (
    <>
      <span
        ref={wrapperRef}
        data-weave-tooltip-anchor=""
        style={{
          display: 'contents',
        }}
      >
        {children}
      </span>
      {tooltip}
    </>
  )
}
