import {
  useCallback,
  useEffect,
  useId,
  useInsertionEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type {
  CSSProperties,
  TransitionEvent as ReactTransitionEvent,
} from 'react'
import { createPortal } from 'react-dom'
import type {
  ToolTipPlacement,
  ToolTipProps,
} from '../core/tooltip-types'
import { length } from '../core/values'
import { resolveToolTipTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ensureToolTipStylesheet } from '../renderers/dom/tooltip-stylesheet'
import { useTheme } from '../theme/theme-context'
import { ThemeProvider } from '../theme/ThemeProvider'
import { durationMilliseconds } from './internal/motion-duration'
import { Text } from './Text'
import { View } from './View'

interface AnchorPosition {
  left: number
  top: number
}

type ToolTipVisualState =
  | 'open'
  | 'closing'

function positionedStyle(
  position: AnchorPosition,
  placement: ToolTipPlacement,
  offset: string,
): CSSProperties {
  switch (placement) {
    case 'top':
      return {
        left: position.left,
        top: position.top,
        transform:
          `translate(-50%, calc(-100% - ${offset}))`,
      }

    case 'bottom':
      return {
        left: position.left,
        top: position.top,
        transform:
          `translate(-50%, ${offset})`,
      }

    case 'left':
      return {
        left: position.left,
        top: position.top,
        transform:
          `translate(calc(-100% - ${offset}), -50%)`,
      }

    case 'right':
      return {
        left: position.left,
        top: position.top,
        transform:
          `translate(${offset}, -50%)`,
      }
  }
}

function anchorPosition(
  target: HTMLElement,
  placement: ToolTipPlacement,
): AnchorPosition {
  const rect =
    target.getBoundingClientRect()

  if (
    placement === 'top' ||
    placement === 'bottom'
  ) {
    return {
      left:
        rect.left +
        rect.width / 2,
      top:
        placement === 'top'
          ? rect.top
          : rect.bottom,
    }
  }

  return {
    left:
      placement === 'left'
        ? rect.left
        : rect.right,
    top:
      rect.top +
      rect.height / 2,
  }
}

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
  ] = useState<ToolTipVisualState>(
    'open',
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
  const requestedOpenRef =
    useRef(resolvedOpen)

  const [position, setPosition] =
    useState<AnchorPosition>({
      left: 0,
      top: 0,
    })
  const [positioned, setPositioned] =
    useState(false)

  const reactId = useId()
  const tooltipId =
    viewProps.id ??
    `weave-tooltip-${reactId}`

  const { theme, mode, reducedMotion } =
    useTheme()
  const base =
    theme.components.ToolTip?.base
  const exitDuration =
    durationMilliseconds(
      theme.tokens.motion
        ?.duration?.fast,
      120,
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

  useEffect(() => {
    requestedOpenRef.current =
      resolvedOpen
  }, [resolvedOpen])

  // Controlled visibility is mirrored into presence so the
  // exit transition can finish before the portal unmounts.
  /* oxlint-disable react/set-state-in-effect */
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
    reducedMotion,
    resolvedOpen,
  ])
  /* oxlint-enable react/set-state-in-effect */

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

  useLayoutEffect(() => {
    const target =
      targetRef.current

    if (
      !present ||
      target === null
    ) {
      setPositioned(false)
      return
    }

    const view =
      target.ownerDocument.defaultView
    let frame:
      | number
      | undefined

    const applyPosition = () => {
      setPosition(
        anchorPosition(
          target,
          placement,
        ),
      )
      setPositioned(true)
    }

    const update = () => {
      if (
        view === null ||
        typeof view.requestAnimationFrame !==
          'function'
      ) {
        applyPosition()
        return
      }

      if (frame !== undefined) {
        return
      }

      frame =
        view.requestAnimationFrame(
          () => {
            frame = undefined
            applyPosition()
          },
        )
    }

    applyPosition()

    const resizeObserver =
      typeof ResizeObserver ===
        'undefined'
        ? undefined
        : new ResizeObserver(
            update,
          )

    resizeObserver?.observe(target)

    view?.addEventListener(
      'resize',
      update,
    )
    view?.addEventListener(
      'scroll',
      update,
      true,
    )

    return () => {
      if (
        frame !== undefined &&
        view !== null &&
        typeof view.cancelAnimationFrame ===
          'function'
      ) {
        view.cancelAnimationFrame(
          frame,
        )
      }

      resizeObserver?.disconnect()

      view?.removeEventListener(
        'resize',
        update,
      )
      view?.removeEventListener(
        'scroll',
        update,
        true,
      )
    }
  }, [
    placement,
    present,
  ])

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

  const offsetValue =
    length(offset) ??
    '0rem'
  const placementStyle =
    positionedStyle(
      position,
      placement,
      offsetValue,
    )

  const tooltip = present
    ? createPortal(
        <ThemeProvider
          theme={theme}
          mode={mode}
        >
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
        </ThemeProvider>,
        document.body,
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
