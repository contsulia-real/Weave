import {
  useCallback,
  useId,
  useInsertionEffect,
  useRef,
  type TransitionEvent as ReactTransitionEvent,
} from 'react'
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
import { assignRef } from './internal/assign-ref'
import { ThemedPortal } from './internal/ThemedPortal'
import { durationMilliseconds } from './internal/motion-duration'
import { useControllableBoolean } from './internal/use-controllable-boolean'
import {
  finishExitOnTransition,
  useExitPresence,
} from './internal/use-exit-presence'
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
  const {
    value: resolvedOpen,
    requestedValueRef:
      requestedOpenRef,
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
  const panelRef =
    useRef<HTMLDivElement>(null)
  const reactId = useId()
  const popoverId =
    viewProps.id ??
    `weave-popover-${reactId}`

  const {
    theme,
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

  const toggleOpen =
    useCallback(() => {
      requestOpen(
        !requestedOpenRef.current,
      )
    }, [
      requestOpen,
      requestedOpenRef,
    ])

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

    finishExitOnTransition(
      event,
      resolvedOpen,
      visualState,
      finishExit,
    )
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
    present
      ? (
          <ThemedPortal>
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
          </ThemedPortal>
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
