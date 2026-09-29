import type { ReactNode } from 'react'
import { createRoot as createDOMRoot, type Root as DOMRoot } from 'react-dom/client'

export interface Root {
  render(node: ReactNode): void
  unmount(): void
}

function assertContainer(container: HTMLElement): void {
  if (typeof HTMLElement !== 'undefined' && !(container instanceof HTMLElement)) {
    throw new TypeError('Weave createRoot() requires an HTMLElement container')
  }
}

export function createRoot(container: HTMLElement): Root {
  assertContainer(container)

  container.replaceChildren()

  const root: DOMRoot = createDOMRoot(container)
  let unmounted = false

  const assertMounted = () => {
    if (unmounted) {
      throw new Error('Cannot render into an unmounted Weave root')
    }
  }

  return {
    render(node) {
      assertMounted()
      root.render(node)
    },

    unmount() {
      if (unmounted) return
      unmounted = true

      root.unmount()
      container.replaceChildren()
    },
  }
}
