import type { ImageSource } from '../../core/image-types'
import type { ResolvedTheme } from '../../theme/theme-types'
import type { DiCViewNode } from './compile-view'
import { drawDiCViewTree } from './draw-view'
import {
  layoutDiCViewTree,
  type DiCViewTreeLayout,
} from './layout-tree'
import type { DiCInteractionState } from './resolve-paint'
import {
  createDiCInteractionController,
  type DiCDispatchResult,
  type DiCInteractionController,
} from './interaction'
import { cursorForDiCHit } from './hit-test'
import {
  createDiCImageResourceManager,
  type DiCImageResourceManager,
} from './image-resource'

export interface DiCSurfaceScene {
  node: DiCViewNode
  theme: ResolvedTheme
  rem?: number
  state?: DiCInteractionState
  containerWidth?: number
}

export interface DiCSurfaceScheduler {
  request(callback: FrameRequestCallback): number
  cancel(id: number): void
}

export interface DiCSurfaceOptions {
  autoResize?: boolean
  interactive?: boolean
  resizeTarget?: Element
  scheduler?: DiCSurfaceScheduler
  devicePixelRatio?: () => number
  imageResources?: DiCImageResourceManager
}

export interface DiCSurface {
  update(scene: DiCSurfaceScene): void
  resize(width: number, height: number, dpr?: number): void
  measure(): void
  invalidate(): void
  destroy(): void
  getLayout(): DiCViewTreeLayout | undefined
  getInteraction(): DiCInteractionController | undefined
}

function defaultScheduler(): DiCSurfaceScheduler {
  if (
    typeof window !== 'undefined' &&
    typeof window.requestAnimationFrame === 'function'
  ) {
    return {
      request: (callback) =>
        window.requestAnimationFrame(callback),
      cancel: (id) =>
        window.cancelAnimationFrame(id),
    }
  }

  return {
    request: (callback) =>
      globalThis.setTimeout(
        () => callback(performance.now()),
        16,
      ),
    cancel: (id) => globalThis.clearTimeout(id),
  }
}

function defaultDpr(): number {
  return typeof window === 'undefined'
    ? 1
    : window.devicePixelRatio || 1
}

function finiteSize(value: number): number {
  return Number.isFinite(value)
    ? Math.max(0, value)
    : 0
}

function collectImageSources(
  node: DiCViewNode,
  output: Set<ImageSource>,
): void {
  if (node.content?.kind === 'image') {
    output.add(node.content.image.src)
  }

  for (const child of node.children) {
    collectImageSources(child, output)
  }
}

export function createDiCSurface(
  canvas: HTMLCanvasElement,
  initialScene: DiCSurfaceScene,
  options: DiCSurfaceOptions = {},
): DiCSurface {
  const context = canvas.getContext('2d')
  if (context === null) {
    throw new Error('DiC requires a Canvas 2D context')
  }

  const scheduler = options.scheduler ?? defaultScheduler()
  const getDpr = options.devicePixelRatio ?? defaultDpr
  const ownsImageResources =
    options.imageResources === undefined
  const imageResources =
    options.imageResources ??
    createDiCImageResourceManager()
  const resizeTarget =
    options.resizeTarget ??
    canvas.parentElement ??
    canvas

  let scene = initialScene
  let retainedImageSources = new Set<ImageSource>()

  const syncImageSources = (node: DiCViewNode) => {
    const next = new Set<ImageSource>()
    collectImageSources(node, next)

    for (const source of next) {
      if (!retainedImageSources.has(source)) {
        imageResources.retain(source)
      }
    }

    for (const source of retainedImageSources) {
      if (!next.has(source)) {
        imageResources.release(source)
      }
    }

    retainedImageSources = next
  }

  syncImageSources(scene.node)

  let width = 0
  let height = 0
  let dpr = 1
  let frameRequest: number | undefined
  let destroyed = false
  let layout: DiCViewTreeLayout | undefined
  let interactions: DiCInteractionController | undefined

  const updateCursor = () => {
    if (interactions === undefined) return

    canvas.style.cursor =
      cursorForDiCHit(
        interactions.getHoverHit(),
      ) ?? ''
  }

  const render = () => {
    frameRequest = undefined
    if (destroyed) return

    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.clearRect(0, 0, width, height)

    const rem = scene.rem ?? 16
    layout = layoutDiCViewTree(
      scene.node,
      {
        width,
        height,
      },
      {
        viewportWidth: width,
        containerWidth:
          scene.containerWidth ?? width,
        rem,
        context,
        theme: scene.theme,
        imageResources,
        stateForNode: (node) => {
          const interactive =
            interactions?.stateForNode(node)
          const external =
            node === scene.node
              ? scene.state
              : undefined

          if (
            interactive === undefined &&
            external === undefined
          ) {
            return undefined
          }

          return {
            ...interactive,
            ...external,
          }
        },
      },
    )

    interactions?.reconcile()

    if (
      interactions
        ?.getFocusedNode()
        ?.interaction
        ?.autoFocus
    ) {
      canvas.focus?.({
        preventScroll: true,
      })
    }

    drawDiCViewTree(
      context,
      layout,
      {
        theme: scene.theme,
        rem,
        viewportWidth: width,
        imageResources,
      },
    )

    updateCursor()
  }

  const invalidate = () => {
    if (destroyed || frameRequest !== undefined) return
    frameRequest = scheduler.request(render)
  }

  const unsubscribeImages =
    imageResources.subscribe(invalidate)

  const interactive = options.interactive !== false

  if (interactive) {
    interactions = createDiCInteractionController({
      getLayout: () => layout,
      invalidate,
      rem: () => scene.rem ?? 16,
    })
  }

  const eventPoint = (
    event: PointerEvent,
  ) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX =
      rect.width > 0
        ? width / rect.width
        : 1
    const scaleY =
      rect.height > 0
        ? height / rect.height
        : 1

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    }
  }

  const applyDispatchResult = (
    event: Event,
    result: DiCDispatchResult,
  ) => {
    if (result.defaultPrevented) {
      event.preventDefault()
    }
    if (result.propagationStopped) {
      event.stopPropagation()
    }
  }

  const dispatchPointer = (
    event: PointerEvent,
    type:
      | 'pointermove'
      | 'pointerdown'
      | 'pointerup'
      | 'pointercancel'
      | 'pointerleave',
  ) => {
    if (interactions === undefined) return

    const point = eventPoint(event)
    const result = interactions.dispatchPointer({
      type,
      ...point,
      pointerId: event.pointerId,
      button: event.button,
      buttons: event.buttons,
      capture: (pointerId) => {
        canvas.setPointerCapture?.(pointerId)
      },
      release: (pointerId) => {
        if (canvas.hasPointerCapture?.(pointerId)) {
          canvas.releasePointerCapture?.(pointerId)
        }
      },
    })

    if (
      type === 'pointerdown' &&
      interactions.getFocusedNode() !== undefined
    ) {
      canvas.focus?.({
        preventScroll: true,
      })
    }

    updateCursor()
    applyDispatchResult(event, result)
  }

  const handlePointerMove = (event: PointerEvent) =>
    dispatchPointer(event, 'pointermove')
  const handlePointerDown = (event: PointerEvent) =>
    dispatchPointer(event, 'pointerdown')
  const handlePointerUp = (event: PointerEvent) =>
    dispatchPointer(event, 'pointerup')
  const handlePointerCancel = (event: PointerEvent) =>
    dispatchPointer(event, 'pointercancel')
  const handlePointerLeave = (event: PointerEvent) =>
    dispatchPointer(event, 'pointerleave')

  const handleKeyDown = (event: KeyboardEvent) => {
    if (interactions === undefined) return

    const result = interactions.dispatchKeyboard({
      type: 'keydown',
      key: event.key,
      code: event.code,
      repeat: event.repeat,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
    })
    applyDispatchResult(event, result)
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    if (interactions === undefined) return

    const result = interactions.dispatchKeyboard({
      type: 'keyup',
      key: event.key,
      code: event.code,
      repeat: event.repeat,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
    })
    applyDispatchResult(event, result)
  }

  const handleBlur = () => {
    interactions?.blur()
    updateCursor()
  }

  if (
    interactive &&
    typeof canvas.addEventListener === 'function'
  ) {
    canvas.addEventListener(
      'pointermove',
      handlePointerMove,
    )
    canvas.addEventListener(
      'pointerdown',
      handlePointerDown,
    )
    canvas.addEventListener(
      'pointerup',
      handlePointerUp,
    )
    canvas.addEventListener(
      'pointercancel',
      handlePointerCancel,
    )
    canvas.addEventListener(
      'pointerleave',
      handlePointerLeave,
    )
    canvas.addEventListener('keydown', handleKeyDown)
    canvas.addEventListener('keyup', handleKeyUp)
    canvas.addEventListener('blur', handleBlur)

    if (
      typeof canvas.hasAttribute === 'function' &&
      !canvas.hasAttribute('tabindex')
    ) {
      canvas.tabIndex = -1
    }
  }

  const resize = (
    nextWidth: number,
    nextHeight: number,
    nextDpr = getDpr(),
  ) => {
    if (destroyed) return

    width = finiteSize(nextWidth)
    height = finiteSize(nextHeight)
    dpr = Math.max(1, finiteSize(nextDpr))

    const pixelWidth = Math.round(width * dpr)
    const pixelHeight = Math.round(height * dpr)

    if (canvas.width !== pixelWidth) {
      canvas.width = pixelWidth
    }
    if (canvas.height !== pixelHeight) {
      canvas.height = pixelHeight
    }

    invalidate()
  }

  const measure = () => {
    if (destroyed) return
    const rect = resizeTarget.getBoundingClientRect()
    resize(rect.width, rect.height)
  }

  let resizeObserver: ResizeObserver | undefined
  const handleWindowResize = () => measure()

  if (options.autoResize !== false) {
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => measure())
      resizeObserver.observe(resizeTarget)
    } else if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleWindowResize)
    }

    measure()
  }

  return {
    update(nextScene) {
      scene = nextScene
      syncImageSources(scene.node)
      invalidate()
    },
    resize,
    measure,
    invalidate,
    destroy() {
      if (destroyed) return
      destroyed = true

      if (frameRequest !== undefined) {
        scheduler.cancel(frameRequest)
        frameRequest = undefined
      }

      resizeObserver?.disconnect()
      unsubscribeImages()

      if (
        interactive &&
        typeof canvas.removeEventListener === 'function'
      ) {
        canvas.removeEventListener(
          'pointermove',
          handlePointerMove,
        )
        canvas.removeEventListener(
          'pointerdown',
          handlePointerDown,
        )
        canvas.removeEventListener(
          'pointerup',
          handlePointerUp,
        )
        canvas.removeEventListener(
          'pointercancel',
          handlePointerCancel,
        )
        canvas.removeEventListener(
          'pointerleave',
          handlePointerLeave,
        )
        canvas.removeEventListener(
          'keydown',
          handleKeyDown,
        )
        canvas.removeEventListener(
          'keyup',
          handleKeyUp,
        )
        canvas.removeEventListener('blur', handleBlur)
      }

      interactions?.blur()
      interactions = undefined

      for (const source of retainedImageSources) {
        imageResources.release(source)
      }
      retainedImageSources.clear()

      if (ownsImageResources) {
        imageResources.destroy()
      }

      if (typeof window !== 'undefined') {
        window.removeEventListener(
          'resize',
          handleWindowResize,
        )
      }
    },
    getLayout() {
      return layout
    },
    getInteraction() {
      return interactions
    },
  }
}
