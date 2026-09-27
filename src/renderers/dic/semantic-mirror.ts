import type {
  ViewSemanticProps,
} from '../../core/view-types'
import { compileWebSemanticAttributes } from '../web/semantic-attributes'
import type { DiCViewNode } from './compile-view'
import type { DiCViewTreeLayout } from './layout-tree'
import type {
  DiCDispatchResult,
  DiCInteractionController,
} from './interaction'

export interface DiCSemanticMirror {
  update(
    node: DiCViewNode,
    layout?: DiCViewTreeLayout,
  ): void
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
  referencedIds?: ReadonlySet<string>,
): boolean {
  const logicalId = node.eventTarget.id

  return (
    node.content?.kind === 'text' ||
    node.content?.kind === 'image' ||
    node.content?.kind === 'input' ||
    hasSemanticValue(node.semantics) ||
    node.interaction?.focusable === true ||
    node.interaction?.autoFocus === true ||
    node.interaction?.tabIndex !== undefined ||
    (
      logicalId !== undefined &&
      referencedIds?.has(logicalId) === true
    )
  )
}

function addReferences(
  value: string | undefined,
  output: Set<string>,
): void {
  if (value === undefined) return

  for (const id of value.split(/\s+/)) {
    if (id.length > 0) {
      output.add(id)
    }
  }
}

function referencedLogicalIds(
  node: DiCViewNode,
): Set<string> {
  const output = new Set<string>()

  const visit = (current: DiCViewNode) => {
    addReferences(
      current.semantics.labelledBy,
      output,
    )
    addReferences(
      current.semantics.describedBy,
      output,
    )
    addReferences(
      current.semantics.controls,
      output,
    )
    addReferences(
      current.semantics.owns,
      output,
    )

    for (const child of current.children) {
      visit(child)
    }
  }

  visit(node)
  return output
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
  invalidate: () => void = () => {},
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

  const semanticTag = (
    node: DiCViewNode,
  ): 'span' | 'input' | 'textarea' | 'div' => {
    if (node.content?.kind === 'text') {
      return 'span'
    }

    if (node.content?.kind === 'input') {
      return node.content.input.multiline
        ? 'textarea'
        : 'input'
    }

    return 'div'
  }

  const editableElement = (
    node: DiCViewNode,
    element: HTMLElement,
  ):
    | HTMLInputElement
    | HTMLTextAreaElement
    | undefined => {
    if (node.content?.kind !== 'input') {
      return undefined
    }

    return element as
      | HTMLInputElement
      | HTMLTextAreaElement
  }

  const syncInputRuntime = (
    node: DiCViewNode,
    element: HTMLElement,
  ) => {
    const content = node.content
    if (content?.kind !== 'input') return

    const editor = editableElement(
      node,
      element,
    )
    if (editor === undefined) return

    try {
      content.selectionStart =
        editor.selectionStart ??
        content.value.length
      content.selectionEnd =
        editor.selectionEnd ??
        content.selectionStart
    } catch {
      content.selectionStart =
        content.value.length
      content.selectionEnd =
        content.value.length
    }

    content.scrollLeft =
      editor.scrollLeft
    content.scrollTop =
      editor.scrollTop
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
    layout?: DiCViewTreeLayout,
  ) => {
    const activeInputRuntime =
      node.content?.kind === 'input' &&
      document.activeElement === element
        ? {
            selectionStart:
              (
                element as
                  | HTMLInputElement
                  | HTMLTextAreaElement
              ).selectionStart,
            selectionEnd:
              (
                element as
                  | HTMLInputElement
                  | HTMLTextAreaElement
              ).selectionEnd,
            scrollLeft:
              element.scrollLeft,
            scrollTop:
              element.scrollTop,
          }
        : undefined

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
    } else if (
      node.content?.kind === 'input'
    ) {
      element.tabIndex = -1
    } else {
      element.removeAttribute('tabindex')
    }

    if (node.content?.kind === 'input') {
      const content = node.content
      const input = content.input
      const editor = editableElement(
        node,
        element,
      )

      if (editor === undefined) return

      if (
        layout !== undefined
      ) {
        const typography =
          layout.typography

        editor.style.boxSizing =
          'content-box'
        editor.style.width =
          `${layout.contentFrame.width}px`
        editor.style.height =
          `${layout.contentFrame.height}px`
        editor.style.margin = '0'
        editor.style.padding = '0'
        editor.style.border = '0'
        editor.style.resize = 'none'
        editor.style.overflow = 'auto'

        if (typography !== undefined) {
          editor.style.fontFamily =
            typography.fontFamily
          editor.style.fontSize =
            `${typography.fontSize}px`
          editor.style.fontWeight =
            String(
              typography.fontWeight,
            )
          editor.style.lineHeight =
            `${typography.lineHeight}px`
          editor.style.letterSpacing =
            `${typography.letterSpacing}px`
        }
      }

      editor.style.whiteSpace =
        input.multiline
          ? 'pre-wrap'
          : 'pre'

      if (
        editor.tagName === 'TEXTAREA'
      ) {
        (
          editor as HTMLTextAreaElement
        ).wrap = 'soft'
      }

      editor.placeholder =
        input.placeholder ?? ''
      editor.readOnly =
        input.readOnly
      editor.required =
        input.required
      editor.disabled =
        input.disabled

      if (input.name !== undefined) {
        editor.name = input.name
      }
      if (input.autoComplete !== undefined) {
        editor.autocomplete =
          input.autoComplete
      }
      if (input.minLength !== undefined) {
        editor.setAttribute(
          'minlength',
          String(input.minLength),
        )
      }
      if (input.maxLength !== undefined) {
        editor.setAttribute(
          'maxlength',
          String(input.maxLength),
        )
      }

      if (
        editor.tagName === 'INPUT'
      ) {
        const singleLine =
          editor as HTMLInputElement
        singleLine.type = input.type

        if (input.pattern !== undefined) {
          singleLine.pattern =
            input.pattern
        }
      } else if (
        input.rows !== undefined
      ) {
        (
          editor as HTMLTextAreaElement
        ).rows =
          Math.max(
            1,
            Math.floor(input.rows),
          )
      }

      if (
        editor.value !==
        content.value
      ) {
        editor.value =
          content.value
      }

      if (
        activeInputRuntime !== undefined
      ) {
        try {
          if (
            activeInputRuntime.selectionStart !== null &&
            activeInputRuntime.selectionEnd !== null
          ) {
            editor.setSelectionRange(
              activeInputRuntime.selectionStart,
              activeInputRuntime.selectionEnd,
            )
          }
        } catch {
          // Some input types do not expose text selection.
        }

        editor.scrollLeft =
          activeInputRuntime.scrollLeft
        editor.scrollTop =
          activeInputRuntime.scrollTop

        syncInputRuntime(
          node,
          element,
        )
      }

      return
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
    layout?: DiCViewTreeLayout,
  ) => {
    if (destroyed) return

    const nextNodes =
      new Set<DiCViewNode>()
    const nextLogicalIds =
      new Map<string, string>()
    const referencedIds =
      referencedLogicalIds(node)
    const layouts =
      new Map<
        DiCViewNode,
        DiCViewTreeLayout
      >()

    const collectLayouts = (
      current:
        | DiCViewTreeLayout
        | undefined,
    ) => {
      if (current === undefined) return

      layouts.set(
        current.node,
        current,
      )

      for (
        const child of current.children
      ) {
        collectLayouts(child)
      }
    }

    collectLayouts(layout)

    const collectIds = (
      current: DiCViewNode,
    ) => {
      const logicalId =
        current.eventTarget.id
      if (
        logicalId !== undefined &&
        shouldMirror(
          current,
          referencedIds,
        )
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

      if (
        shouldMirror(
          current,
          referencedIds,
        )
      ) {
        nextNodes.add(current)

        let element =
          nodeElements.get(current)
        const tag =
          semanticTag(current)

        if (
          element !== undefined &&
          element.tagName.toLowerCase() !== tag
        ) {
          element.remove()
          elementNodes.delete(
            element,
          )
          nodeElements.delete(
            current,
          )
          element = undefined
        }

        if (element === undefined) {
          element = document.createElement(
            tag,
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
          layouts.get(current),
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

    if (
      node.content?.kind === 'input' &&
      event.target instanceof HTMLElement
    ) {
      node.content.focused = true
      syncInputRuntime(
        node,
        event.target,
      )
      invalidate()
    }

    interaction.focusNode(
      node,
      visible,
    )
    event.stopPropagation()
  }

  const handleFocusOut = (
    event: FocusEvent,
  ) => {
    const currentNode =
      nodeFromTarget(
        event.target,
      )

    if (
      currentNode?.content?.kind === 'input' &&
      event.target instanceof HTMLElement
    ) {
      currentNode.content.focused = false
      syncInputRuntime(
        currentNode,
        event.target,
      )
      invalidate()
    }

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

  const handleInput = (
    event: Event,
  ) => {
    const node = nodeFromTarget(
      event.target,
    )
    if (
      node?.content?.kind !== 'input' ||
      !(event.target instanceof HTMLElement)
    ) {
      return
    }

    const content = node.content
    const editor = editableElement(
      node,
      event.target,
    )

    if (
      editor === undefined ||
      content.input.disabled ||
      content.input.readOnly
    ) {
      event.stopPropagation()
      return
    }

    content.value =
      editor.value
    syncInputRuntime(
      node,
      event.target,
    )
    content.onChange?.(
      editor.value,
    )
    invalidate()
    event.stopPropagation()
  }

  const handleSelect = (
    event: Event,
  ) => {
    const node = nodeFromTarget(
      event.target,
    )

    if (
      node?.content?.kind === 'input' &&
      event.target instanceof HTMLElement
    ) {
      syncInputRuntime(
        node,
        event.target,
      )
      invalidate()
    }

    event.stopPropagation()
  }

  const handleScroll = (
    event: Event,
  ) => {
    const node = nodeFromTarget(
      event.target,
    )

    if (
      node?.content?.kind === 'input' &&
      event.target instanceof HTMLElement
    ) {
      syncInputRuntime(
        node,
        event.target,
      )
      invalidate()
    }

    event.stopPropagation()
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
  root.addEventListener(
    'input',
    handleInput,
  )
  root.addEventListener(
    'select',
    handleSelect,
  )
  root.addEventListener(
    'scroll',
    handleScroll,
    true,
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
      root.removeEventListener(
        'input',
        handleInput,
      )
      root.removeEventListener(
        'select',
        handleSelect,
      )
      root.removeEventListener(
        'scroll',
        handleScroll,
        true,
      )

      root.remove()
      nodeElements.clear()
      nodeDomIds.clear()
      logicalDomIds.clear()
      pendingFocus = undefined
    },
  }
}
