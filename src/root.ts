import type { ReactNode } from 'react'
import {
  createRoot as createDOMRoot,
  type Root as DOMRoot,
} from 'react-dom/client'
import {
  createHTMLInCanvasMount,
  HTMLInCanvasCapabilityError,
  isHTMLInCanvasSupported,
  type HTMLInCanvasMount,
} from './renderers/html-in-canvas'

export type RootFallback =
  | 'dom'
  | 'none'

export interface RootOptions {
  fallback?: RootFallback
}

export interface Root {
  render(node: ReactNode): void
  unmount(): void
}

type SelectedRoot =
  | {
      kind: 'html-in-canvas'
      root: DOMRoot
      mount: HTMLInCanvasMount
    }
  | {
      kind: 'dom'
      root: DOMRoot
    }

function assertContainer(
  container: HTMLElement,
): void {
  if (
    typeof HTMLElement !== 'undefined' &&
    !(container instanceof HTMLElement)
  ) {
    throw new TypeError(
      'Weave createRoot() requires an HTMLElement container',
    )
  }
}

function mountDOM(
  container: HTMLElement,
  node: ReactNode,
): SelectedRoot {
  container.replaceChildren()

  const root =
    createDOMRoot(container)
  root.render(node)

  return {
    kind: 'dom',
    root,
  }
}

function mountHTMLInCanvas(
  container: HTMLElement,
  node: ReactNode,
): SelectedRoot {
  const mount =
    createHTMLInCanvasMount(
      container,
    )
  const root =
    createDOMRoot(
      mount.host,
    )

  try {
    root.render(node)

    return {
      kind: 'html-in-canvas',
      root,
      mount,
    }
  } catch (error) {
    root.unmount()
    mount.destroy()
    throw error
  }
}

export function createRoot(
  container: HTMLElement,
  options: RootOptions = {},
): Root {
  assertContainer(container)

  const fallback =
    options.fallback ?? 'dom'
  let selected:
    | SelectedRoot
    | undefined
  let unmounted = false

  const assertMounted = () => {
    if (unmounted) {
      throw new Error(
        'Cannot render into an unmounted Weave root',
      )
    }
  }

  const firstRender = (
    node: ReactNode,
  ) => {
    try {
      if (
        !isHTMLInCanvasSupported(
          container.ownerDocument,
        )
      ) {
        throw new HTMLInCanvasCapabilityError(
          'HTML-in-Canvas is not supported by this browser',
        )
      }

      selected =
        mountHTMLInCanvas(
          container,
          node,
        )
    } catch (error) {
      if (
        fallback !== 'dom' ||
        !(
          error instanceof
          HTMLInCanvasCapabilityError
        )
      ) {
        throw error
      }

      selected =
        mountDOM(
          container,
          node,
        )
    }
  }

  return {
    render(node) {
      assertMounted()

      if (selected === undefined) {
        firstRender(node)
        return
      }

      selected.root.render(node)

    },

    unmount() {
      if (unmounted) return
      unmounted = true

      selected?.root.unmount()

      if (
        selected?.kind ===
        'html-in-canvas'
      ) {
        selected.mount.destroy()
      }

      selected = undefined
      container.replaceChildren()
    },
  }
}
