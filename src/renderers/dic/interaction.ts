import type {
  DiCFocusEvent,
  DiCKeyboardEvent,
  DiCPointerEvent,
  DiCViewNode,
} from './compile-view'
import {
  findDiCNodePath,
  hitTestDiCViewTree,
  type DiCHitResult,
  type DiCPoint,
} from './hit-test'
import type {
  DiCViewTreeLayout,
} from './layout-tree'
import type { DiCInteractionState } from './resolve-paint'

export interface DiCPointerInput extends DiCPoint {
  type:
    | 'pointermove'
    | 'pointerdown'
    | 'pointerup'
    | 'pointercancel'
    | 'pointerleave'
  pointerId: number
  button: number
  buttons: number
  capture?: (pointerId: number) => void
  release?: (pointerId: number) => void
}

export interface DiCKeyboardInput {
  type: 'keydown' | 'keyup'
  key: string
  code: string
  repeat: boolean
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
}

export interface DiCDispatchResult {
  defaultPrevented: boolean
  propagationStopped: boolean
  hit?: DiCHitResult
}

export interface DiCInteractionController {
  stateForNode(node: DiCViewNode): DiCInteractionState
  dispatchPointer(input: DiCPointerInput): DiCDispatchResult
  dispatchKeyboard(input: DiCKeyboardInput): DiCDispatchResult
  blur(): void
  getFocusedNode(): DiCViewNode | undefined
  getHoverHit(): DiCHitResult | undefined
}

export interface DiCInteractionControllerOptions {
  getLayout(): DiCViewTreeLayout | undefined
  invalidate(): void
  rem?: () => number
}

interface ControlState {
  defaultPrevented: boolean
  propagationStopped: boolean
}

function samePath(
  left: readonly DiCViewNode[],
  right: readonly DiCViewNode[],
): boolean {
  return (
    left.length === right.length &&
    left.every((node, index) => node === right[index])
  )
}

function handlerName(
  type: DiCPointerEvent['type'],
):
  | 'onPointerEnter'
  | 'onPointerLeave'
  | 'onPointerMove'
  | 'onPointerDown'
  | 'onPointerUp'
  | 'onPointerCancel'
  | 'onClick' {
  switch (type) {
    case 'pointerenter':
      return 'onPointerEnter'
    case 'pointerleave':
      return 'onPointerLeave'
    case 'pointermove':
      return 'onPointerMove'
    case 'pointerdown':
      return 'onPointerDown'
    case 'pointerup':
      return 'onPointerUp'
    case 'pointercancel':
      return 'onPointerCancel'
    case 'click':
      return 'onClick'
  }
}

function keyboardHandlerName(
  type: DiCKeyboardEvent['type'],
): 'onKeyDown' | 'onKeyUp' {
  return type === 'keydown'
    ? 'onKeyDown'
    : 'onKeyUp'
}

export function createDiCInteractionController(
  options: DiCInteractionControllerOptions,
): DiCInteractionController {
  let hoverHit: DiCHitResult | undefined
  let focusedNode: DiCViewNode | undefined
  let focusVisible = false
  const activeNodes = new Set<DiCViewNode>()
  const captures = new Map<number, DiCViewNode>()
  const pointerDownTargets = new Map<number, DiCViewNode>()

  const layout = () => options.getLayout()
  const rem = () => options.rem?.() ?? 16

  const pathForNode = (
    node: DiCViewNode,
  ): readonly DiCViewNode[] | undefined => {
    const current = layout()
    return current === undefined
      ? undefined
      : findDiCNodePath(current, node)
  }

  const currentHit = (
    point: DiCPoint,
  ): DiCHitResult | undefined => {
    const current = layout()
    return current === undefined
      ? undefined
      : hitTestDiCViewTree(current, point, rem())
  }

  const invalidateIfChanged = (
    changed: boolean,
  ) => {
    if (changed) options.invalidate()
  }

  const dispatchFocus = (
    type: DiCFocusEvent['type'],
    node: DiCViewNode,
  ) => {
    const handler =
      type === 'focus'
        ? node.interaction?.onFocus
        : node.interaction?.onBlur

    handler?.({
      type,
      target: node,
      currentTarget: node,
    })
  }

  const setFocus = (
    next: DiCViewNode | undefined,
    visible: boolean,
  ) => {
    const changed =
      focusedNode !== next ||
      focusVisible !== visible

    if (focusedNode !== next) {
      if (focusedNode !== undefined) {
        dispatchFocus('blur', focusedNode)
      }
      focusedNode = next
      if (focusedNode !== undefined) {
        dispatchFocus('focus', focusedNode)
      }
    }

    focusVisible = next === undefined
      ? false
      : visible
    invalidateIfChanged(changed)
  }

  const focusFromPath = (
    path: readonly DiCViewNode[],
    visible: boolean,
  ) => {
    for (let index = path.length - 1; index >= 0; index -= 1) {
      const node = path[index]
      if (node?.interaction?.focusable) {
        setFocus(node, visible)
        return
      }
    }
  }

  const dispatchDirectPointer = (
    type: 'pointerenter' | 'pointerleave',
    node: DiCViewNode,
    input: DiCPointerInput,
  ) => {
    const control: ControlState = {
      defaultPrevented: false,
      propagationStopped: false,
    }
    const event: DiCPointerEvent = {
      type,
      pointerId: input.pointerId,
      button: input.button,
      buttons: input.buttons,
      x: input.x,
      y: input.y,
      target: node,
      currentTarget: node,
      get defaultPrevented() {
        return control.defaultPrevented
      },
      get propagationStopped() {
        return control.propagationStopped
      },
      preventDefault() {
        control.defaultPrevented = true
      },
      stopPropagation() {
        control.propagationStopped = true
      },
      capturePointer() {
        captures.set(input.pointerId, node)
        input.capture?.(input.pointerId)
      },
      releasePointer() {
        if (captures.get(input.pointerId) === node) {
          captures.delete(input.pointerId)
          input.release?.(input.pointerId)
        }
      },
    }

    node.interaction?.[handlerName(type)]?.(event)
  }

  const updateHover = (
    hit: DiCHitResult | undefined,
    input: DiCPointerInput,
  ) => {
    const previous = hoverHit?.path ?? []
    const next = hit?.path ?? []

    if (samePath(previous, next)) {
      hoverHit = hit
      return
    }

    let common = 0
    while (
      common < previous.length &&
      common < next.length &&
      previous[common] === next[common]
    ) {
      common += 1
    }

    for (
      let index = previous.length - 1;
      index >= common;
      index -= 1
    ) {
      const node = previous[index]
      if (node !== undefined) {
        dispatchDirectPointer(
          'pointerleave',
          node,
          input,
        )
      }
    }

    for (
      let index = common;
      index < next.length;
      index += 1
    ) {
      const node = next[index]
      if (node !== undefined) {
        dispatchDirectPointer(
          'pointerenter',
          node,
          input,
        )
      }
    }

    hoverHit = hit
    options.invalidate()
  }

  const dispatchBubbledPointer = (
    type:
      | 'pointermove'
      | 'pointerdown'
      | 'pointerup'
      | 'pointercancel'
      | 'click',
    path: readonly DiCViewNode[],
    input: DiCPointerInput,
  ): DiCDispatchResult => {
    const target = path[path.length - 1]
    if (target === undefined) {
      return {
        defaultPrevented: false,
        propagationStopped: false,
      }
    }

    const control: ControlState = {
      defaultPrevented: false,
      propagationStopped: false,
    }

    for (
      let index = path.length - 1;
      index >= 0;
      index -= 1
    ) {
      const currentTarget = path[index]
      if (currentTarget === undefined) continue

      const event: DiCPointerEvent = {
        type,
        pointerId: input.pointerId,
        button: input.button,
        buttons: input.buttons,
        x: input.x,
        y: input.y,
        target,
        currentTarget,
        get defaultPrevented() {
          return control.defaultPrevented
        },
        get propagationStopped() {
          return control.propagationStopped
        },
        preventDefault() {
          control.defaultPrevented = true
        },
        stopPropagation() {
          control.propagationStopped = true
        },
        capturePointer() {
          captures.set(
            input.pointerId,
            currentTarget,
          )
          input.capture?.(input.pointerId)
        },
        releasePointer() {
          if (
            captures.get(input.pointerId) ===
            currentTarget
          ) {
            captures.delete(input.pointerId)
            input.release?.(input.pointerId)
          }
        },
      }

      currentTarget.interaction?.[
        handlerName(type)
      ]?.(event)

      if (control.propagationStopped) break
    }

    return {
      ...control,
    }
  }

  const dispatchKeyboard = (
    input: DiCKeyboardInput,
  ): DiCDispatchResult => {
    const target = focusedNode
    if (target === undefined) {
      return {
        defaultPrevented: false,
        propagationStopped: false,
      }
    }

    const path = pathForNode(target)
    if (path === undefined) {
      setFocus(undefined, false)
      return {
        defaultPrevented: false,
        propagationStopped: false,
      }
    }

    if (!focusVisible) {
      focusVisible = true
      options.invalidate()
    }

    const control: ControlState = {
      defaultPrevented: false,
      propagationStopped: false,
    }

    for (
      let index = path.length - 1;
      index >= 0;
      index -= 1
    ) {
      const currentTarget = path[index]
      if (currentTarget === undefined) continue

      const event: DiCKeyboardEvent = {
        ...input,
        target,
        currentTarget,
        get defaultPrevented() {
          return control.defaultPrevented
        },
        get propagationStopped() {
          return control.propagationStopped
        },
        preventDefault() {
          control.defaultPrevented = true
        },
        stopPropagation() {
          control.propagationStopped = true
        },
      }

      currentTarget.interaction?.[
        keyboardHandlerName(input.type)
      ]?.(event)

      if (control.propagationStopped) break
    }

    return {
      ...control,
    }
  }

  return {
    stateForNode(node) {
      return {
        hover: hoverHit?.path.includes(node) ?? false,
        active: activeNodes.has(node),
        focus: focusedNode === node,
        focusVisible:
          focusedNode === node && focusVisible,
        disabled: node.semantics.disabled === true,
      }
    },
    dispatchPointer(input) {
      const hit = input.type === 'pointerleave'
        ? undefined
        : currentHit(input)

      if (
        input.type === 'pointermove' ||
        input.type === 'pointerdown' ||
        input.type === 'pointerup' ||
        input.type === 'pointerleave'
      ) {
        updateHover(hit, input)
      }

      const captured = captures.get(input.pointerId)
      const capturedPath =
        captured === undefined
          ? undefined
          : pathForNode(captured)
      const dispatchPath =
        capturedPath ??
        hit?.path ??
        []

      if (input.type === 'pointerdown') {
        if (input.button === 0 && hit !== undefined) {
          activeNodes.clear()
          for (const node of hit.path) {
            activeNodes.add(node)
          }
          pointerDownTargets.set(
            input.pointerId,
            hit.target,
          )
          focusFromPath(hit.path, false)
          options.invalidate()
        }

        return {
          ...dispatchBubbledPointer(
            'pointerdown',
            dispatchPath,
            input,
          ),
          hit,
        }
      }

      if (input.type === 'pointermove') {
        return {
          ...dispatchBubbledPointer(
            'pointermove',
            dispatchPath,
            input,
          ),
          hit,
        }
      }

      if (input.type === 'pointercancel') {
        const result = dispatchBubbledPointer(
          'pointercancel',
          dispatchPath,
          input,
        )
        activeNodes.clear()
        pointerDownTargets.delete(input.pointerId)
        captures.delete(input.pointerId)
        input.release?.(input.pointerId)
        options.invalidate()

        return {
          ...result,
          hit,
        }
      }

      if (input.type === 'pointerleave') {
        return {
          defaultPrevented: false,
          propagationStopped: false,
        }
      }

      const result = dispatchBubbledPointer(
        'pointerup',
        dispatchPath,
        input,
      )
      const downTarget =
        pointerDownTargets.get(input.pointerId)

      activeNodes.clear()
      pointerDownTargets.delete(input.pointerId)
      captures.delete(input.pointerId)
      input.release?.(input.pointerId)
      options.invalidate()

      if (
        input.button === 0 &&
        downTarget !== undefined &&
        hit?.target === downTarget
      ) {
        const clickResult = dispatchBubbledPointer(
          'click',
          hit.path,
          input,
        )

        return {
          defaultPrevented:
            result.defaultPrevented ||
            clickResult.defaultPrevented,
          propagationStopped:
            result.propagationStopped ||
            clickResult.propagationStopped,
          hit,
        }
      }

      return {
        ...result,
        hit,
      }
    },
    dispatchKeyboard,
    blur() {
      setFocus(undefined, false)
    },
    getFocusedNode() {
      return focusedNode
    },
    getHoverHit() {
      return hoverHit
    },
  }
}
