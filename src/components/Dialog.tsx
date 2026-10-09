import {
  type MouseEvent,
  type SyntheticEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { DialogProps, ModalDialogProps, NonModalDialogProps } from '../core/dialog-types'
import type { ViewProps } from '../core/view-types'
import { ensureDialogStylesheet } from '../renderers/dom/dialog-stylesheet'
import { resolveDialogTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { useTheme } from '../theme/theme-context'
import { durationMilliseconds } from './internal/motion-duration'
import { ThemedPortal } from './internal/ThemedPortal'
import {
  activateModalHost,
  deactivateModalHost,
  ModalPortalHostContext,
} from './internal/top-layer-host'
import { useControllableBoolean } from './internal/use-controllable-boolean'
import { useExitPresence, useExitTransitionEnd } from './internal/use-exit-presence'
import { useViewHost } from './internal/use-view-host'
import { Popover } from './Popover'

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

function NonModalDialog({
  children,
  trigger,
  modal: _modal,
  ...popoverProps
}: NonModalDialogProps) {
  return (
    <Popover {...popoverProps} content={children}>
      {trigger}
    </Popover>
  )
}

function ModalDialog({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnEscape = true,
  closeOnBackdrop = false,
  initialFocus,
  restoreFocus = true,
  viewProps = {},
}: ModalDialogProps) {
  const { value: resolvedOpen, request: requestOpen } = useControllableBoolean(
    open,
    defaultOpen,
    onOpenChange,
  )
  const {
    onCancel: viewOnCancel,
    onClose: viewOnClose,
    onClick: viewOnClick,
    onTransitionEnd: viewOnTransitionEnd,
    ...restViewProps
  } = viewProps
  const hostProps: ViewProps<HTMLDialogElement> = {
    ...restViewProps,
    tabIndex: restViewProps.tabIndex ?? -1,
    layer: restViewProps.layer ?? 'modal',
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)
  const { theme, reducedMotion } = useTheme()
  const themeClassName = useRuntimeStyleClass('dialog-theme', resolveDialogTheme(theme))
  const exitDuration = durationMilliseconds(theme.tokens.motion?.duration?.fast, 120)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const openedRef = useRef(false)
  const [nativeRevision, setNativeRevision] = useState(0)
  const [modalPortalHost, setModalPortalHost] = useState<HTMLDivElement | null>(null)

  useStaticStylesheet(ensureDialogStylesheet)

  const setDialogRef = useCallback(
    (node: HTMLDialogElement | null) => {
      if (node === null && elementRef.current !== null) {
        const detachedDialog = elementRef.current
        queueMicrotask(() => {
          if (!detachedDialog.isConnected) deactivateModalHost(detachedDialog)
        })
      }
      elementRef.current = node
    },
    [elementRef],
  )

  const finishNativeClose = useCallback(() => {
    const dialog = elementRef.current

    if (dialog?.open) {
      dialog.close()
      deactivateModalHost(dialog)
      setModalPortalHost(null)
    }

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
      const HTMLElementConstructor = dialog.ownerDocument.defaultView?.HTMLElement
      previousFocusRef.current =
        HTMLElementConstructor !== undefined &&
        active instanceof HTMLElementConstructor &&
        !dialog.contains(active)
          ? active
          : null
      openedRef.current = true
    }

    if (!dialog.open) {
      dialog.showModal()
      setModalPortalHost(activateModalHost(dialog))
    }

    initialFocus?.current?.focus()
  }, [elementRef, initialFocus, nativeRevision, present, resolvedOpen])

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    viewOnCancel?.(event)

    const userCancelled = event.defaultPrevented
    event.preventDefault()

    if (!userCancelled && closeOnEscape) {
      requestOpen(false)
    }
  }

  const handleClose = (event: SyntheticEvent<HTMLDialogElement>) => {
    deactivateModalHost(event.currentTarget)
    setModalPortalHost(null)
    viewOnClose?.(event)

    if (resolvedOpen) {
      requestOpen(false)
      setNativeRevision((revision) => revision + 1)
    }
  }

  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    viewOnClick?.(event)

    if (event.defaultPrevented || !closeOnBackdrop || !backdropClick(event)) {
      return
    }

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
    <ThemedPortal preferTopLayerHost={false}>
      <dialog
        {...resolved.domProps}
        ref={setDialogRef}
        onCancel={handleCancel}
        onClose={handleClose}
        onClick={handleClick}
        onTransitionEnd={handleTransitionEnd}
        data-weave-view=""
        data-weave-dialog=""
        data-weave-dialog-modal="true"
        data-weave-dialog-state={visualState}
        data-weave-layout={resolved.layout}
        className={['weave-dialog', themeClassName, className].filter(Boolean).join(' ')}
        style={inlineStyle}
      >
        <ModalPortalHostContext.Provider value={modalPortalHost}>
          {children}
        </ModalPortalHostContext.Provider>
      </dialog>
    </ThemedPortal>
  )
}

export function Dialog(props: DialogProps): import('react').JSX.Element {
  return props.modal === true ? <ModalDialog {...props} /> : <NonModalDialog {...props} />
}
