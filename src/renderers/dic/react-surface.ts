import type { ReactNode } from 'react'
import { DiCCapabilityError } from './capability-error'
import { resolveView } from '../../core/resolved-view'
import { defaultTheme } from '../../theme/default-theme'
import { compileDiCView, type DiCViewNode } from './compile-view'
import {
  createDiCReactRoot,
  type DiCReactRoot,
} from './react-reconciler'
import {
  createDiCSurface,
  type DiCSurface,
  type DiCSurfaceOptions,
} from './surface'

export interface DiCReactSurface {
  render(node: ReactNode): void
  resize(
    width: number,
    height: number,
    dpr?: number,
  ): void
  measure(): void
  invalidate(): void
  getNodes(): readonly DiCViewNode[]
  getSurface(): DiCSurface
  destroy(): void
}

function blankRoot(): DiCViewNode {
  const node = compileDiCView(
    resolveView(
      {},
      defaultTheme.breakpoints,
    ),
  )
  node.theme = defaultTheme
  return node
}

function surfaceRoot(
  nodes: readonly DiCViewNode[],
): DiCViewNode {
  if (nodes.length === 0) {
    return blankRoot()
  }

  if (nodes.length !== 1) {
    throw new DiCCapabilityError(
      'DiC React surface currently requires exactly one top-level Weave node',
    )
  }

  const node = nodes[0]
  if (node === undefined) {
    return blankRoot()
  }

  return node
}

function sceneFor(
  node: DiCViewNode,
) {
  return {
    node,
    theme: node.theme ?? defaultTheme,
  }
}

export function createDiCReactSurface(
  canvas: HTMLCanvasElement,
  initialNode: ReactNode,
  options: DiCSurfaceOptions = {},
): DiCReactSurface {
  let surface: DiCSurface | undefined
  let destroying = false
  let latestNodes:
    readonly DiCViewNode[] = []

  const commit = (
    nodes: readonly DiCViewNode[],
  ) => {
    latestNodes = nodes

    if (destroying) return

    const root = surfaceRoot(nodes)
    if (surface === undefined) {
      return
    }

    surface.update(
      sceneFor(root),
    )
  }

  const reactRoot: DiCReactRoot =
    createDiCReactRoot(commit)

  try {
    reactRoot.render(initialNode)

    const root = surfaceRoot(
      reactRoot.getNodes(),
    )
    surface = createDiCSurface(
      canvas,
      sceneFor(root),
      options,
    )
  } catch (error) {
    destroying = true
    reactRoot.unmount()
    throw error
  }

  const getSurface = (): DiCSurface => {
    if (surface === undefined) {
      throw new Error(
        'DiC React surface is not initialized',
      )
    }

    return surface
  }

  return {
    render(node) {
      reactRoot.render(node)
    },
    resize(width, height, dpr) {
      getSurface().resize(
        width,
        height,
        dpr,
      )
    },
    measure() {
      getSurface().measure()
    },
    invalidate() {
      getSurface().invalidate()
    },
    getNodes() {
      return latestNodes
    },
    getSurface,
    destroy() {
      if (destroying) return
      destroying = true

      reactRoot.unmount()
      getSurface().destroy()
      surface = undefined
      latestNodes = []
    },
  }
}
