import type {
  ViewSemanticProps,
} from '../../core/view-types'
import { compileWebSemanticAttributes } from '../web/semantic-attributes'
import type { DiCViewNode } from './compile-view'
import type {
  DiCDispatchResult,
  DiCInteractionController,
} from './interaction'

export interface DiCSemanticMirror {
  update(node: DiCViewNode): void
  focusNode(
    node: DiCViewNode,
    visible?: boolean,
  ): boolean
  getElement(
    node: DiCViewNode,
  ): HTMLElement | undefined
  getRoot(): HTMLElement
  destroy(): void
}

let mirrorSequence = 0

function hasSemanticValue(
  semantic: Readonly<ViewSemanticProps>,
): boolean {
  return Object.values(semantic).some(
    (value) => value !== undefined,
  )
}

function shouldMirror(
  node: DiCViewNode,
): boolean {
  return (
    node.content?.kind === 'text' ||
    node.content?.kind === 'image' ||
    hasSemanticValue(node.semantics) ||
    node.interaction?.focusable === true ||
    node.interaction?.autoFocus === true ||
    node.interaction?.tabIndex !== undefined
  )
}

function semanticForNode(
  node: DiCViewNode,
): Readonly<ViewSemanticProps> {
  if (node.content?.kind !== 'image') {
    return node.semantics
  }

  return {
    ...node.semantics,
    role:
      node.semantics.role ??
      'img',
    label:
      node.semantics.label ??
      node.content.image.alt,
  }
}

function applyDispatchResult(
  event: Event,
  result: DiCDispatchResult,
): void {
  if (result.defaultPrevented) {
    event.preventDefault()
  }

  // DiC has already performed logical tree bubbling.
  // Never leak the private mirror event into app DOM.
  event.stopPropagation()
}

export function createDiCSemanticMirror(
  canvas: HTMLCanvasElement,
  interaction: DiCInteractionController,
): DiCSemanticMirror {
  const document = canvas.ownerDocument
  const parent = canvas.parentElement

  if (
    document === null ||
    parent === null
  ) {
    throw new Error(
      'DiC semantic mirror requires an attached canvas',
    )
  }

  const instance = ++mirrorSequence
  let generatedId = 0
  let destroyed = false
  let pendingFocus:
    | {
        node: DiCViewNode
        visible: boolean
      }
    | undefined

  const root = document.createElement('div')
  root.setAttribute(
    'data-weave-dic-semantic-root',
    '',
  )
  root.style.position = 'absolute'
  root.style.width = '1px'
  root.style.height = '1px'
  root.style.margin = '-1px'
  root.style.padding = '0'
  root.style.border = '0'
  root.style.overflow = 'hidden'
  root.style.clip = 'rect(0 0 0 0)'
  root.style.clipPath = 'inset(50%)'
  root.style.whiteSpace = 'nowrap'
  root.style.pointerEvents = 'none'

  parent.insertBefore(
    root,
    canvas.nextSibling,
  )

  const nodeElements =
    new Map<DiCViewNode, HTMLElement>()
  const elementNodes =
    new WeakMap<Element, DiCViewNode>()
  const nodeDomIds =
    new Map<DiCViewNode, string>()
  let logicalDomIds =
    new Map<string, string>()

  const domId = (
    node: DiCViewNode,
  ): string => {
    const existing = nodeDomIds.get(node)
    if (existing !== undefined) {
      return existing
    }

    generatedId += 1
    const value =
      `weave-dic-semantic-${instance}-${generatedId}`
    nodeDomIds.set(node, value)
    return value
  }

  const nodeFromTarget = (
    target: EventTarget | null,
  ): DiCViewNode | undefined => {
    if (!(target instanceof Element)) {
      return undefined
    }

    let current: Element | null = target
    while (
      current !== null &&
      current !== root
    ) {
      const node = elementNodes.get(current)
      if (node !== undefined) {
        return node
      }
      current = current.parentElement
    }

    return undefined
  }

  const clearOwnedAttributes = (
    element: HTMLElement,
  ) => {
    for (const name of element.getAttributeNames()) {
      if (
        name === 'data-weave-dic-semantic'
      ) {
        continue
      }
      element.removeAttribute(name)
    }
  }

  const updateElement = (
    element: HTMLElement,
    node: DiCViewNode,
  ) => {
    clearOwnedAttributes(element)

    element.setAttribute(
      'data-weave-dic-semantic',
      '',
    )

    const logicalId = node.eventTarget.id
    if (logicalId !== undefined) {
      element.id = domId(node)
      element.setAttribute(
        'data-weave-logical-id',
        logicalId,
      )
    }

    const attributes =
      compileWebSemanticAttributes(
        semanticForNode(node),
        {
          resolveIdReference: (value) =>
            logicalDomIds.get(value) ??
            value,
        },
      )

    for (const [name, value] of Object.entries(
      attributes,
    )) {
      element.setAttribute(
        name,
        String(value),
      )
    }

    if (node.interaction?.focusable) {
      element.tabIndex =
        node.interaction.tabIndex ??
        0
    } else {
      element.removeAttribute('tabindex')
    }

    if (node.content?.kind === 'text') {
      element.textContent =
        node.content.text
    } else {
      element.textContent = ''
    }
  }

  const update = (
    node: DiCViewNode,
  ) => {
    if (destroyed) return

    const nextNodes =
      new Set<DiCViewNode>()
    const nextLogicalIds =
      new Map<string, string>()

    const collectIds = (
      current: DiCViewNode,
    ) => {
      const logicalId =
        current.eventTarget.id
      if (
        logicalId !== undefined &&
        shouldMirror(current)
      ) {
        nextLogicalIds.set(
          logicalId,
          domId(current),
        )
      }

      for (const child of current.children) {
        collectIds(child)
      }
    }

    collectIds(node)
    logicalDomIds = nextLogicalIds

    const reconcile = (
      current: DiCViewNode,
      domParent: HTMLElement,
    ) => {
      let nextParent = domParent

      if (shouldMirror(current)) {
        nextNodes.add(current)

        let element =
          nodeElements.get(current)

        if (element === undefined) {
          element = document.createElement(
            current.content?.kind === 'text'
              ? 'span'
              : 'div',
          )
          nodeElements.set(
            current,
            element,
          )
          elementNodes.set(
            element,
            current,
          )
        }

        updateElement(
          element,
          current,
        )

        if (
          element.parentElement !==
          domParent
        ) {
          domParent.appendChild(element)
        } else {
          // appendChild also moves an existing node to
          // the correct tree order.
          domParent.appendChild(element)
        }

        nextParent = element
      }

      for (const child of current.children) {
        reconcile(
          child,
          nextParent,
        )
      }
    }

    reconcile(node, root)

    for (
      const [current, element]
      of nodeElements
    ) {
      if (nextNodes.has(current)) {
        continue
      }

      element.remove()
      nodeElements.delete(current)
      nodeDomIds.delete(current)
    }
  }

  const focusNode = (
    node: DiCViewNode,
    visible = true,
  ): boolean => {
    if (destroyed) return false

    const element =
      nodeElements.get(node)
    if (
      element === undefined ||
      !node.interaction?.focusable
    ) {
      return false
    }

    pendingFocus = {
      node,
      visible,
    }
    element.focus({
      preventScroll: true,
    })

    return true
  }

  const handleFocusIn = (
    event: FocusEvent,
  ) => {
    const node = nodeFromTarget(
      event.target,
    )
    if (node === undefined) return

    const visible =
      pendingFocus?.node === node
        ? pendingFocus.visible
        : true
    pendingFocus = undefined

    interaction.focusNode(
      node,
      visible,
    )
    event.stopPropagation()
  }

  const handleFocusOut = (
    event: FocusEvent,
  ) => {
    const nextNode = nodeFromTarget(
      event.relatedTarget,
    )

    if (nextNode === undefined) {
      interaction.blur()
    }

    event.stopPropagation()
  }

  const handleKeyboard = (
    event: KeyboardEvent,
    type: 'keydown' | 'keyup',
  ) => {
    const node = nodeFromTarget(
      event.target,
    )
    if (node === undefined) return

    // Browser focus is the source of truth for the
    // semantic mirror, so keep the controller aligned.
    interaction.focusNode(
      node,
      true,
    )

    const result =
      interaction.dispatchKeyboard({
        type,
        key: event.key,
        code: event.code,
        repeat: event.repeat,
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
      })

    applyDispatchResult(
      event,
      result,
    )
  }

  const handleClick = (
    event: MouseEvent,
  ) => {
    const node = nodeFromTarget(
      event.target,
    )
    if (node === undefined) return

    const result =
      interaction.dispatchClick(node)

    applyDispatchResult(
      event,
      result,
    )
  }

  const keyDown = (event: KeyboardEvent) =>
    handleKeyboard(event, 'keydown')
  const keyUp = (event: KeyboardEvent) =>
    handleKeyboard(event, 'keyup')

  root.addEventListener(
    'focusin',
    handleFocusIn,
  )
  root.addEventListener(
    'focusout',
    handleFocusOut,
  )
  root.addEventListener(
    'keydown',
    keyDown,
  )
  root.addEventListener(
    'keyup',
    keyUp,
  )
  root.addEventListener(
    'click',
    handleClick,
  )

  return {
    update,
    focusNode,
    getElement(node) {
      return nodeElements.get(node)
    },
    getRoot() {
      return root
    },
    destroy() {
      if (destroyed) return
      destroyed = true

      root.removeEventListener(
        'focusin',
        handleFocusIn,
      )
      root.removeEventListener(
        'focusout',
        handleFocusOut,
      )
      root.removeEventListener(
        'keydown',
        keyDown,
      )
      root.removeEventListener(
        'keyup',
        keyUp,
      )
      root.removeEventListener(
        'click',
        handleClick,
      )

      root.remove()
      nodeElements.clear()
      nodeDomIds.clear()
      logicalDomIds.clear()
      pendingFocus = undefined
    },
  }
}
