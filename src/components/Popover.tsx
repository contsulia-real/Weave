import {
  useCallback,
  useEffect,
  useId,
  useInsertionEffect,
  useRef,
  useState,
  type TransitionEvent as ReactTransitionEvent,
} from 'react'
import { createPortal } from 'react-dom'
import type {
  PopoverProps,
} from '../core/popover-types'
import { length } from '../core/values'
import {
  resolvePopoverTheme,
} from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ensurePopoverStylesheet } from '../renderers/dom/popover-stylesheet'
import { useTheme } from '../theme/theme-context'
import { ThemeProvider } from '../theme/ThemeProvider'
import { assignRef } from './internal/assign-ref'
import { durationMilliseconds } from './internal/motion-duration'
import { useExitPresence } from './internal/use-exit-presence'
import { usePopoverInteraction } from './internal/use-popover-interaction'
import { usePopoverPosition } from './internal/use-popover-position'
import { View } from './View'

export function Popover({
  children,
  content,
  placement = 'bottom',
  offset = 0.5,
  viewportPadding = 0.5,
  open,
  defaultOpen = false,
  onOpenChange,
  autoFocus = true,
  restoreFocus = true,
  viewProps = {},
}: PopoverProps) {
  const controlled =
    open !== undefined
  const [
    uncontrolledOpen,
    setUncontrolledOpen,
  ] = useState(defaultOpen)
  const resolvedOpen =
    open ?? uncontrolledOpen
  const requestedOpenRef =
    useRef(resolvedOpen)
  const wrapperRef =
    useRef<HTMLSpanElement>(null)
  const targetRef =
    useRef<HTMLElement | null>(null)
  const panelRef =
    useRef<HTMLDivElement>(null)
  const reactId = useId()
  const popoverId =
    viewProps.id ??
    `weave-popover-${reactId}`

  const {
    theme,
    mode,
    reducedMotion,
  } = useTheme()
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
      'popover-theme',
      resolvePopoverTheme(theme),
    )

  useInsertionEffect(
    ensurePopoverStylesheet,
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

  const toggleOpen =
    useCallback(() => {
      requestOpen(
        !requestedOpenRef.current,
      )
    }, [requestOpen])

  const close =
    useCallback(() => {
      requestOpen(false)
    }, [requestOpen])

  usePopoverInteraction(
    wrapperRef,
    targetRef,
    panelRef,
    popoverId,
    resolvedOpen,
    autoFocus,
    restoreFocus,
    toggleOpen,
    close,
    children,
  )

  const offsetValue =
    length(offset) ??
    '0rem'
  const viewportPaddingValue =
    length(viewportPadding) ??
    '0rem'
  const {
    positioned,
    placement:
      resolvedPlacement,
    placementStyle,
  } = usePopoverPosition(
    targetRef,
    panelRef,
    present,
    placement,
    offsetValue,
    viewportPaddingValue,
  )

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

  const setPanelRef = (
    element:
      HTMLDivElement | null,
  ) => {
    panelRef.current = element
    assignRef(
      viewProps.ref,
      element,
    )
  }

  const portal =
    present &&
    typeof document !== 'undefined'
      ? createPortal(
          <ThemeProvider
            theme={theme}
            mode={mode}
          >
            <View
              {...viewProps}
              ref={setPanelRef}
              id={popoverId}
              role="dialog"
              tabIndex={
                viewProps.tabIndex ??
                -1
              }
              aria-hidden={
                visualState ===
                  'closing'
                  ? true
                  : undefined
              }
              onTransitionEnd={
                handleTransitionEnd
              }
              position="fixed"
              layer={
                viewProps.layer ??
                'overlay'
              }
              className={[
                'weave-popover',
                themeClassName,
                viewProps.className,
              ].filter(Boolean).join(' ')}
              data={{
                ...viewProps.data,
                'weave-popover':
                  '',
                'weave-popover-state':
                  visualState,
                placement:
                  resolvedPlacement,
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
              {content}
            </View>
          </ThemeProvider>,
          document.body,
        )
      : null

  return (
    <>
      <span
        ref={wrapperRef}
        data-weave-popover-anchor=""
        style={{
          display: 'contents',
        }}
      >
        {children}
      </span>
      {portal}
    </>
  )
}
