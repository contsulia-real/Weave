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
import { Text } from './Text'
import { View } from './View'

interface AnchorPosition {
  left: number
  top: number
}

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

  const { theme, mode } =
    useTheme()
  const base =
    theme.components.ToolTip?.base
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

    const handlePointerLeave = () => {
      pointerInsideRef.current = false
      closeIfInactive()
    }

    const handleFocusIn = () => {
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
      'pointerleave',
      handlePointerLeave,
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
        'pointerleave',
        handlePointerLeave,
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
      setPositioned(false)
      return
    }

    const previousDescription =
      target.getAttribute(
        'aria-describedby',
      )
    const descriptionIds =
      new Set(
        previousDescription
          ?.split(/\s+/)
          .filter(Boolean) ??
          [],
      )

    descriptionIds.add(tooltipId)
    target.setAttribute(
      'aria-describedby',
      [...descriptionIds].join(' '),
    )

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

    update()

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
    placement,
    resolvedOpen,
    tooltipId,
  ])

  const offsetValue =
    length(offset) ??
    '0rem'
  const placementStyle =
    positionedStyle(
      position,
      placement,
      offsetValue,
    )

  const tooltip = resolvedOpen
    ? createPortal(
        <ThemeProvider
          theme={theme}
          mode={mode}
        >
          <View
            {...viewProps}
            id={tooltipId}
            role="tooltip"
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
