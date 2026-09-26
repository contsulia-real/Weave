import type {
  FocusEvent as ReactFocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react'
import type {
  ViewClickEvent,
  ViewEventProps,
  ViewEventTarget,
  ViewFocusEvent,
  ViewKeyboardEvent,
  ViewPointerEvent,
} from '../../core/view-types'

function targetFromEventTarget(
  target: EventTarget | null,
): ViewEventTarget {
  if (
    typeof Element !== 'undefined' &&
    target instanceof Element
  ) {
    const host = target.closest(
      '[data-weave-view]',
    )

    return {
      id: host?.id || undefined,
    }
  }

  return {}
}

function currentTarget(
  element: HTMLElement,
): ViewEventTarget {
  return {
    id: element.id || undefined,
  }
}

function clickEvent<TElement extends HTMLElement>(
  event: ReactMouseEvent<TElement>,
): ViewClickEvent {
  const host = event.currentTarget
  const target = targetFromEventTarget(
    event.target,
  )

  return {
    type: 'click',
    target,
    currentTarget: currentTarget(host),
    button: event.button,
    buttons: event.buttons,
    clientX: event.clientX,
    clientY: event.clientY,
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
    get defaultPrevented() {
      return event.defaultPrevented
    },
    get propagationStopped() {
      return event.isPropagationStopped()
    },
    preventDefault() {
      event.preventDefault()
    },
    stopPropagation() {
      event.stopPropagation()
    },
  }
}

function pointerEvent<
  TElement extends HTMLElement,
>(
  event: ReactPointerEvent<TElement>,
  type: ViewPointerEvent['type'],
): ViewPointerEvent {
  const host = event.currentTarget
  const pointerId = event.pointerId
  const target = targetFromEventTarget(
    event.target,
  )

  return {
    type,
    target,
    currentTarget: currentTarget(host),
    pointerId,
    pointerType: event.pointerType,
    isPrimary: event.isPrimary,
    button: event.button,
    buttons: event.buttons,
    clientX: event.clientX,
    clientY: event.clientY,
    pressure: event.pressure,
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
    get defaultPrevented() {
      return event.defaultPrevented
    },
    get propagationStopped() {
      return event.isPropagationStopped()
    },
    preventDefault() {
      event.preventDefault()
    },
    stopPropagation() {
      event.stopPropagation()
    },
    capturePointer() {
      host.setPointerCapture?.(pointerId)
    },
    releasePointer() {
      if (
        host.hasPointerCapture?.(pointerId)
      ) {
        host.releasePointerCapture?.(
          pointerId,
        )
      }
    },
  }
}

function keyboardEvent<
  TElement extends HTMLElement,
>(
  event: ReactKeyboardEvent<TElement>,
  type: ViewKeyboardEvent['type'],
): ViewKeyboardEvent {
  const host = event.currentTarget
  const target = targetFromEventTarget(
    event.target,
  )

  return {
    type,
    target,
    currentTarget: currentTarget(host),
    key: event.key,
    code: event.code,
    repeat: event.repeat,
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
    get defaultPrevented() {
      return event.defaultPrevented
    },
    get propagationStopped() {
      return event.isPropagationStopped()
    },
    preventDefault() {
      event.preventDefault()
    },
    stopPropagation() {
      event.stopPropagation()
    },
  }
}

function focusEvent<
  TElement extends HTMLElement,
>(
  event: ReactFocusEvent<TElement>,
  type: ViewFocusEvent['type'],
): ViewFocusEvent {
  const host = event.currentTarget
  const target = targetFromEventTarget(
    event.target,
  )

  return {
    type,
    target,
    currentTarget: currentTarget(host),
    get defaultPrevented() {
      return event.defaultPrevented
    },
    get propagationStopped() {
      return event.isPropagationStopped()
    },
    preventDefault() {
      event.preventDefault()
    },
    stopPropagation() {
      event.stopPropagation()
    },
  }
}

export function compileDOMViewEvents<
  TElement extends HTMLElement,
>(
  events: Readonly<ViewEventProps>,
) {
  return {
    onClick:
      events.onClick === undefined
        ? undefined
        : (
            event: ReactMouseEvent<TElement>,
          ) => {
            events.onClick?.(
              clickEvent(event),
            )
          },
    onPointerEnter:
      events.onPointerEnter === undefined
        ? undefined
        : (
            event: ReactPointerEvent<TElement>,
          ) => {
            events.onPointerEnter?.(
              pointerEvent(
                event,
                'pointerenter',
              ),
            )
          },
    onPointerLeave:
      events.onPointerLeave === undefined
        ? undefined
        : (
            event: ReactPointerEvent<TElement>,
          ) => {
            events.onPointerLeave?.(
              pointerEvent(
                event,
                'pointerleave',
              ),
            )
          },
    onPointerMove:
      events.onPointerMove === undefined
        ? undefined
        : (
            event: ReactPointerEvent<TElement>,
          ) => {
            events.onPointerMove?.(
              pointerEvent(
                event,
                'pointermove',
              ),
            )
          },
    onPointerDown:
      events.onPointerDown === undefined
        ? undefined
        : (
            event: ReactPointerEvent<TElement>,
          ) => {
            events.onPointerDown?.(
              pointerEvent(
                event,
                'pointerdown',
              ),
            )
          },
    onPointerUp:
      events.onPointerUp === undefined
        ? undefined
        : (
            event: ReactPointerEvent<TElement>,
          ) => {
            events.onPointerUp?.(
              pointerEvent(
                event,
                'pointerup',
              ),
            )
          },
    onPointerCancel:
      events.onPointerCancel === undefined
        ? undefined
        : (
            event: ReactPointerEvent<TElement>,
          ) => {
            events.onPointerCancel?.(
              pointerEvent(
                event,
                'pointercancel',
              ),
            )
          },
    onKeyDown:
      events.onKeyDown === undefined
        ? undefined
        : (
            event: ReactKeyboardEvent<TElement>,
          ) => {
            events.onKeyDown?.(
              keyboardEvent(
                event,
                'keydown',
              ),
            )
          },
    onKeyUp:
      events.onKeyUp === undefined
        ? undefined
        : (
            event: ReactKeyboardEvent<TElement>,
          ) => {
            events.onKeyUp?.(
              keyboardEvent(
                event,
                'keyup',
              ),
            )
          },
    onFocus:
      events.onFocus === undefined
        ? undefined
        : (
            event: ReactFocusEvent<TElement>,
          ) => {
            events.onFocus?.(
              focusEvent(
                event,
                'focus',
              ),
            )
          },
    onBlur:
      events.onBlur === undefined
        ? undefined
        : (
            event: ReactFocusEvent<TElement>,
          ) => {
            events.onBlur?.(
              focusEvent(
                event,
                'blur',
              ),
            )
          },
  }
}
