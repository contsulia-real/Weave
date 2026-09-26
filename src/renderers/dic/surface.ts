import type { ResolvedTheme } from '../../theme/theme-types'
import type { DiCViewNode } from './compile-view'
import {
  drawDiCViewPaint,
  type DiCViewFrame,
} from './draw-view'
import {
  layoutDiCView,
  type DiCViewLayout,
} from './layout-view'
import {
  resolveDiCViewPaint,
  type DiCInteractionState,
} from './resolve-paint'

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
  resizeTarget?: Element
  scheduler?: DiCSurfaceScheduler
  devicePixelRatio?: () => number
}

export interface DiCSurface {
  update(scene: DiCSurfaceScene): void
  resize(width: number, height: number, dpr?: number): void
  measure(): void
  invalidate(): void
  destroy(): void
  getLayout(): DiCViewLayout | undefined
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
  const resizeTarget =
    options.resizeTarget ??
    canvas.parentElement ??
    canvas

  let scene = initialScene
  let width = 0
  let height = 0
  let dpr = 1
  let frameRequest: number | undefined
  let destroyed = false
  let layout: DiCViewLayout | undefined

  const render = () => {
    frameRequest = undefined
    if (destroyed) return

    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.clearRect(0, 0, width, height)

    const rem = scene.rem ?? 16
    const paint = resolveDiCViewPaint(
      scene.node,
      {
        viewportWidth: width,
        containerWidth: scene.containerWidth ?? width,
        rem,
        state: scene.state,
      },
    )

    layout = layoutDiCView(
      paint,
      {
        width,
        height,
      },
      { rem },
    )

    drawDiCViewPaint(
      context,
      paint,
      layout.frame,
      {
        theme: scene.theme,
        rem,
      },
    )
  }

  const invalidate = () => {
    if (destroyed || frameRequest !== undefined) return
    frameRequest = scheduler.request(render)
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
  }
}
