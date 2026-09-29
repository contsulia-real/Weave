import {
  type KeyboardEvent,
  type MouseEvent,
  type SyntheticEvent,
  useCallback,
  useInsertionEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { DialogProps } from '../core/dialog-types'
import type { ViewProps } from '../core/view-types'
import { ensureDialogStylesheet } from '../renderers/dom/dialog-stylesheet'
import { resolveDialogTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { durationMilliseconds } from './internal/motion-duration'
import { ThemedPortal } from './internal/ThemedPortal'
import { useControllableBoolean } from './internal/use-controllable-boolean'
import { useExitPresence, useExitTransitionEnd } from './internal/use-exit-presence'
import { useViewHost } from './internal/use-view-host'

function backdropClick(event: MouseEvent<HTMLDialogElement>): boolean {
  if (event.target !== event.currentTarget) {
    return false
  }

  const rect = event.currentTarget.getBoundingClientRect()

  return (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
}

export function Dialog({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  modal = false,
  closeOnEscape = modal,
  closeOnBackdrop = false,
  initialFocus,
  restoreFocus = true,
  viewProps = {},
}: DialogProps) {
  const { value: resolvedOpen, request: requestOpen } = useControllableBoolean(
    open,
    defaultOpen,
    onOpenChange,
  )
  const {
    onCancel: viewOnCancel,
    onClose: viewOnClose,
    onClick: viewOnClick,
    onKeyDown: viewOnKeyDown,
    onTransitionEnd: viewOnTransitionEnd,
    ...restViewProps
  } = viewProps
  const hostProps: ViewProps<HTMLDialogElement> = {
    ...restViewProps,
    tabIndex: restViewProps.tabIndex ?? -1,
    layer: restViewProps.layer ?? (modal ? 'modal' : 'overlay'),
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)
  const { theme, reducedMotion } = useTheme()
  const themeClassName = useRuntimeStyleClass('dialog-theme', resolveDialogTheme(theme))
  const exitDuration = durationMilliseconds(theme.tokens.motion?.duration?.fast, 120)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const openedRef = useRef(false)
  const activeModalRef = useRef<boolean | null>(null)
  const suppressNextCloseRef = useRef(false)
  const [nativeRevision, setNativeRevision] = useState(0)

  useInsertionEffect(ensureDialogStylesheet, [])

  const finishNativeClose = useCallback(() => {
    const dialog = elementRef.current

    if (dialog?.open) {
      dialog.close()
    }

    activeModalRef.current = null
    openedRef.current = false

    const previousFocus = previousFocusRef.current
    previousFocusRef.current = null

    if (restoreFocus && previousFocus?.isConnected) {
      queueMicrotask(() => {
        previousFocus.focus()
      })
    }
  }, [elementRef, restoreFocus])

  const { present, visualState, finishExit } = useExitPresence(
    resolvedOpen,
    reducedMotion,
    exitDuration,
    finishNativeClose,
  )

  useLayoutEffect(() => {
    const dialog = elementRef.current

    if (dialog === null || !present || !resolvedOpen) {
      return
    }

    if (!openedRef.current) {
      const active = dialog.ownerDocument.activeElement
      previousFocusRef.current =
        active instanceof HTMLElement && !dialog.contains(active) ? active : null
      openedRef.current = true
    }

    if (dialog.open && activeModalRef.current !== modal) {
      suppressNextCloseRef.current = true
      dialog.close()
    }

    if (!dialog.open) {
      if (modal) {
        dialog.showModal()
      } else {
        dialog.show()
      }

      activeModalRef.current = modal
    }

    initialFocus?.current?.focus()
  }, [elementRef, initialFocus, modal, nativeRevision, present, resolvedOpen])

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    viewOnCancel?.(event)

    const userCancelled = event.defaultPrevented
    event.preventDefault()

    if (!userCancelled && closeOnEscape) {
      requestOpen(false)
    }
  }

  const handleClose = (event: SyntheticEvent<HTMLDialogElement>) => {
    if (suppressNextCloseRef.current) {
      suppressNextCloseRef.current = false
      return
    }

    viewOnClose?.(event)
    activeModalRef.current = null

    if (resolvedOpen) {
      requestOpen(false)
      setNativeRevision((revision) => revision + 1)
    }
  }

  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    viewOnClick?.(event)

    if (event.defaultPrevented || !modal || !closeOnBackdrop || !backdropClick(event)) {
      return
    }

    requestOpen(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    viewOnKeyDown?.(event)

    if (event.defaultPrevented || modal || !closeOnEscape || event.key !== 'Escape') {
      return
    }

    event.preventDefault()
    requestOpen(false)
  }

  const handleTransitionEnd = useExitTransitionEnd(
    resolvedOpen,
    visualState,
    finishExit,
    viewOnTransitionEnd,
  )

  if (!present) {
    return null
  }

  return (
    <ThemedPortal>
      <dialog
        {...resolved.domProps}
        ref={elementRef}
        onCancel={handleCancel}
        onClose={handleClose}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onTransitionEnd={handleTransitionEnd}
        data-weave-view=""
        data-weave-dialog=""
        data-weave-dialog-modal={modal ? 'true' : 'false'}
        data-weave-dialog-state={visualState}
        data-weave-layout={resolved.layout}
        className={['weave-dialog', themeClassName, className].filter(Boolean).join(' ')}
        style={inlineStyle}
      >
        {children}
      </dialog>
    </ThemedPortal>
  )
}
