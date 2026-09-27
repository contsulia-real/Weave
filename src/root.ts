import type { ReactNode } from 'react'
import {
  createRoot as createDOMRoot,
  type Root as DOMRoot,
} from 'react-dom/client'
import { isDiCCapabilityError } from './renderers/dic/capability-error'
import {
  createDiCReactSurface,
  type DiCReactSurface,
} from './renderers/dic/react-surface'

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

type SelectedRenderer =
  | {
      kind: 'dic'
      canvas: HTMLCanvasElement
      root: DiCReactSurface
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

function canvasForRoot(
  container: HTMLElement,
): HTMLCanvasElement {
  const canvas =
    container.ownerDocument.createElement(
      'canvas',
    )

  canvas.setAttribute(
    'data-weave-root-canvas',
    '',
  )
  canvas.setAttribute(
    'aria-hidden',
    'true',
  )
  canvas.style.display = 'block'
  canvas.style.width = '100%'
  canvas.style.height = '100%'

  container.replaceChildren(canvas)
  return canvas
}

function mountDiC(
  container: HTMLElement,
  node: ReactNode,
): SelectedRenderer {
  const canvas = canvasForRoot(container)

  try {
    return {
      kind: 'dic',
      canvas,
      root: createDiCReactSurface(
        canvas,
        node,
        {
          resizeTarget: container,
        },
      ),
    }
  } catch (error) {
    canvas.remove()
    throw error
  }
}

function mountDOM(
  container: HTMLElement,
  node: ReactNode,
): SelectedRenderer {
  container.replaceChildren()

  const root = createDOMRoot(container)
  root.render(node)

  return {
    kind: 'dom',
    root,
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
    | SelectedRenderer
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
      selected = mountDiC(
        container,
        node,
      )
    } catch (error) {
      if (
        fallback !== 'dom' ||
        !isDiCCapabilityError(error)
      ) {
        throw error
      }

      selected = mountDOM(
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

      if (selected.kind === 'dic') {
        selected.root.render(node)
        return
      }

      selected.root.render(node)
    },

    unmount() {
      if (unmounted) return
      unmounted = true

      if (selected?.kind === 'dic') {
        selected.root.destroy()
        selected.canvas.remove()
      } else {
        selected?.root.unmount()
      }

      selected = undefined
      container.replaceChildren()
    },
  }
}
