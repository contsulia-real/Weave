import { createElement, Fragment, type ReactNode } from 'react'
import {
  createRoot as createDOMRoot,
  type Root as DOMRoot,
  hydrateRoot as hydrateDOMRoot,
} from 'react-dom/client'
import { DocumentScrollbars } from './components/internal/DocumentScrollbars'
import { WeaveDocumentProvider } from './renderers/dom/DocumentProvider'

export interface Root {
  render(node: ReactNode): void
  unmount(): void
}

function assertContainer(container: HTMLElement, operation: 'createRoot' | 'hydrateRoot'): void {
  const HTMLElementConstructor = container?.ownerDocument?.defaultView?.HTMLElement
  if (HTMLElementConstructor === undefined || !(container instanceof HTMLElementConstructor)) {
    throw new TypeError(`Weave ${operation}() requires an HTMLElement container`)
  }
}

function rootNode(container: HTMLElement, node: ReactNode): ReactNode {
  return createElement(
    WeaveDocumentProvider,
    { ownerDocument: container.ownerDocument },
    createElement(Fragment, null, node, createElement(DocumentScrollbars)),
  )
}

function rootHandle(container: HTMLElement, root: DOMRoot): Root {
  let unmounted = false

  const assertMounted = () => {
    if (unmounted) {
      throw new Error('Cannot render into an unmounted Weave root')
    }
  }

  return {
    render(node) {
      assertMounted()
      root.render(rootNode(container, node))
    },

    unmount() {
      if (unmounted) return
      unmounted = true

      root.unmount()
      container.replaceChildren()
    },
  }
}

export function createRoot(container: HTMLElement): Root {
  assertContainer(container, 'createRoot')
  container.replaceChildren()
  return rootHandle(container, createDOMRoot(container))
}

export function hydrateRoot(container: HTMLElement, node: ReactNode): Root {
  assertContainer(container, 'hydrateRoot')
  return rootHandle(container, hydrateDOMRoot(container, rootNode(container, node)))
}
