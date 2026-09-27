type DrawElementImageResult =
  | DOMMatrix
  | undefined

type ElementImageHandle = {
  close(): void
}

type HTMLInCanvas2DContext =
  CanvasRenderingContext2D & {
    drawElementImage(
      element: Element,
      dx: number,
      dy: number,
    ): DrawElementImageResult
    reset?: () => void
  }

type HTMLInCanvasOffscreen2DContext =
  OffscreenCanvasRenderingContext2D & {
    drawElementImage(
      image: ElementImageHandle,
      dx: number,
      dy: number,
    ): void
  }

interface ElementGeometryOptions {
  preserveHitTestOrder?: boolean
  canvasTransform?: DOMMatrixInit
}

interface HTMLInCanvasElement extends HTMLCanvasElement {
  requestPaint(): void
  captureElementImage?: (
    element: Element,
  ) => ElementImageHandle
  updateElementGeometry?: (
    element: Element,
    options?: ElementGeometryOptions,
  ) => void
  clearElementGeometry?: (
    element: Element,
  ) => void
}

interface LegacyCanvasTransformElement extends HTMLDivElement {
  setCanvasTransform?: (
    matrix?: DOMMatrixInit,
  ) => void
}

interface HTMLInCanvasRenderer {
  paint(): void
  resize(
    width: number,
    height: number,
  ): void
  destroy(): void
}

export interface HTMLInCanvasMount {
  readonly canvas: HTMLCanvasElement
  readonly host: HTMLDivElement
  requestPaint(): void
  destroy(): void
}

export class HTMLInCanvasCapabilityError extends Error {
  override readonly name =
    'HTMLInCanvasCapabilityError'
}

function htmlInCanvasContext(
  canvas: HTMLCanvasElement,
): HTMLInCanvas2DContext | null {
  let context:
    | CanvasRenderingContext2D
    | null

  try {
    context = canvas.getContext('2d')
  } catch {
    return null
  }

  if (
    context === null ||
    typeof (
      context as HTMLInCanvas2DContext
    ).drawElementImage !== 'function'
  ) {
    return null
  }

  return context as HTMLInCanvas2DContext
}

function supportsWorkerRenderer(
  canvas: HTMLInCanvasElement,
): boolean {
  if (
    typeof Worker === 'undefined' ||
    typeof OffscreenCanvas ===
      'undefined' ||
    typeof canvas.captureElementImage !==
      'function' ||
    typeof canvas.transferControlToOffscreen !==
      'function'
  ) {
    return false
  }

  try {
    const probe =
      new OffscreenCanvas(1, 1)
    const context =
      probe.getContext('2d')

    return (
      context !== null &&
      typeof (
        context as
          HTMLInCanvasOffscreen2DContext
      ).drawElementImage ===
        'function'
    )
  } catch {
    return false
  }
}

export function isHTMLInCanvasSupported(
  document: Document,
): boolean {
  const canvas =
    document.createElement('canvas') as HTMLInCanvasElement

  return (
    typeof canvas.requestPaint === 'function' &&
    htmlInCanvasContext(canvas) !== null
  )
}

function resetContext(
  context: HTMLInCanvas2DContext,
  canvas: HTMLCanvasElement,
): void {
  if (typeof context.reset === 'function') {
    context.reset()
    return
  }

  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height,
  )
}

function syncElementGeometry(
  canvas: HTMLInCanvasElement,
  element: LegacyCanvasTransformElement,
  drawResult: DrawElementImageResult,
): void {
  if (drawResult === undefined) {
    return
  }

  if (
    typeof canvas.updateElementGeometry ===
    'function'
  ) {
    canvas.updateElementGeometry(
      element,
      {
        preserveHitTestOrder: true,
        canvasTransform: drawResult,
      },
    )
    return
  }

  if (
    typeof element.setCanvasTransform ===
      'function'
  ) {
    element.setCanvasTransform(
      drawResult,
    )
    return
  }

  element.style.transform =
    drawResult.toString()
}

function devicePixelRatioFor(
  canvas: HTMLCanvasElement,
): number {
  return (
    canvas.ownerDocument.defaultView
      ?.devicePixelRatio ??
    1
  )
}

function applyCanvasSize(
  canvas: HTMLCanvasElement,
  context: HTMLInCanvas2DContext,
  resizeBuffer: HTMLCanvasElement,
  preserveCurrentFrame: boolean,
  width: number,
  height: number,
): boolean {
  const nextWidth =
    Math.max(0, Math.round(width))
  const nextHeight =
    Math.max(0, Math.round(height))

  if (
    canvas.width === nextWidth &&
    canvas.height === nextHeight
  ) {
    return false
  }

  const previousWidth = canvas.width
  const previousHeight = canvas.height
  let resizeBufferContext:
    | CanvasRenderingContext2D
    | null = null

  if (
    preserveCurrentFrame &&
    previousWidth > 0 &&
    previousHeight > 0 &&
    nextWidth > 0 &&
    nextHeight > 0
  ) {
    resizeBuffer.width = previousWidth
    resizeBuffer.height = previousHeight
    resizeBufferContext =
      resizeBuffer.getContext('2d')

    if (resizeBufferContext !== null) {
      resizeBufferContext.drawImage(
        canvas,
        0,
        0,
      )
    }
  }

  canvas.width = nextWidth
  canvas.height = nextHeight

  if (resizeBufferContext !== null) {
    context.drawImage(
      resizeBuffer,
      0,
      0,
      previousWidth,
      previousHeight,
      0,
      0,
      nextWidth,
      nextHeight,
    )
  }

  return true
}

function createMainThreadRenderer(
  document: Document,
  canvas: HTMLInCanvasElement,
  host: LegacyCanvasTransformElement,
  requestPaint: () => void,
): HTMLInCanvasRenderer | null {
  const context =
    htmlInCanvasContext(canvas)

  if (context === null) {
    return null
  }

  const resizeBuffer =
    document.createElement('canvas')
  let hasPainted = false

  canvas.setAttribute(
    'data-weave-canvas-thread',
    'main',
  )

  return {
    paint() {
      resetContext(
        context,
        canvas,
      )

      const drawResult =
        context.drawElementImage(
          host,
          0,
          0,
        )

      syncElementGeometry(
        canvas,
        host,
        drawResult,
      )
      hasPainted = true
    },

    resize(width, height) {
      if (
        applyCanvasSize(
          canvas,
          context,
          resizeBuffer,
          hasPainted,
          width,
          height,
        )
      ) {
        requestPaint()
      }
    },

    destroy() {},
  }
}

function createWorkerRenderer(
  canvas: HTMLInCanvasElement,
  host: LegacyCanvasTransformElement,
  requestPaint: () => void,
): HTMLInCanvasRenderer | null {
  if (
    !supportsWorkerRenderer(canvas)
  ) {
    return null
  }

  let worker: Worker

  try {
    worker =
      new Worker(
        new URL(
          './html-in-canvas-worker.ts',
          import.meta.url,
        ),
        {
          type: 'module',
          name: 'weave-html-in-canvas',
        },
      )
  } catch {
    return null
  }

  let offscreen: OffscreenCanvas

  try {
    offscreen =
      canvas.transferControlToOffscreen()
  } catch {
    worker.terminate()
    return null
  }

  try {
    worker.postMessage(
      {
        type: 'init',
        canvas: offscreen,
      },
      [offscreen],
    )
  } catch {
    worker.terminate()
    return null
  }

  let width = -1
  let height = -1

  canvas.setAttribute(
    'data-weave-canvas-thread',
    'worker',
  )

  return {
    paint() {
      const capture =
        canvas.captureElementImage

      if (capture === undefined) {
        return
      }

      const image =
        capture.call(
          canvas,
          host,
        )

      worker.postMessage(
        {
          type: 'frame',
          image,
        },
        [
          image as unknown as
            Transferable,
        ],
      )
    },

    resize(
      nextWidth,
      nextHeight,
    ) {
      const normalizedWidth =
        Math.max(
          0,
          Math.round(nextWidth),
        )
      const normalizedHeight =
        Math.max(
          0,
          Math.round(nextHeight),
        )

      if (
        width === normalizedWidth &&
        height === normalizedHeight
      ) {
        return
      }

      width = normalizedWidth
      height = normalizedHeight

      worker.postMessage({
        type: 'resize',
        width,
        height,
      })

      requestPaint()
    },

    destroy() {
      worker.terminate()
    },
  }
}

function observeCanvasSize(
  canvas: HTMLCanvasElement,
  resize: (
    width: number,
    height: number,
  ) => void,
): () => void {
  const resizeFromCSSPixels = (
    width: number,
    height: number,
  ) => {
    const dpr =
      devicePixelRatioFor(canvas)

    resize(
      width * dpr,
      height * dpr,
    )
  }

  const initial =
    canvas.getBoundingClientRect()

  resizeFromCSSPixels(
    initial.width,
    initial.height,
  )

  if (
    typeof ResizeObserver !== 'undefined'
  ) {
    const observer = new ResizeObserver(
      ([entry]) => {
        if (entry === undefined) return

        const devicePixelSize =
          entry.devicePixelContentBoxSize?.[0]

        if (devicePixelSize !== undefined) {
          resize(
            devicePixelSize.inlineSize,
            devicePixelSize.blockSize,
          )
          return
        }

        resizeFromCSSPixels(
          entry.contentRect.width,
          entry.contentRect.height,
        )
      },
    )

    observer.observe(canvas)

    return () => observer.disconnect()
  }

  const view =
    canvas.ownerDocument.defaultView

  if (view === null) {
    return () => {}
  }

  const handleResize = () => {
    const rect =
      canvas.getBoundingClientRect()

    resizeFromCSSPixels(
      rect.width,
      rect.height,
    )
  }

  view.addEventListener(
    'resize',
    handleResize,
  )

  return () => {
    view.removeEventListener(
      'resize',
      handleResize,
    )
  }
}

export function createHTMLInCanvasMount(
  container: HTMLElement,
): HTMLInCanvasMount {
  const document =
    container.ownerDocument
  const canvas =
    document.createElement(
      'canvas',
    ) as HTMLInCanvasElement

  if (
    typeof canvas.requestPaint !==
      'function'
  ) {
    throw new HTMLInCanvasCapabilityError(
      'HTML-in-Canvas is not supported by this browser',
    )
  }

  canvas.setAttribute(
    'layoutsubtree',
    '',
  )
  canvas.setAttribute(
    'content',
    'drawable',
  )
  canvas.setAttribute(
    'data-weave-root-canvas',
    '',
  )
  canvas.style.display = 'block'
  canvas.style.width = '100%'
  canvas.style.height = '100%'

  const host =
    document.createElement(
      'div',
    ) as LegacyCanvasTransformElement

  host.setAttribute(
    'drawable',
    '',
  )
  host.setAttribute(
    'data-weave-root-host',
    '',
  )
  host.style.width = '100%'
  host.style.height = '100%'

  canvas.append(host)
  container.replaceChildren(canvas)

  let destroyed = false

  const requestPaint = () => {
    if (destroyed) return
    canvas.requestPaint()
  }

  const renderer =
    createWorkerRenderer(
      canvas,
      host,
      requestPaint,
    ) ??
    createMainThreadRenderer(
      document,
      canvas,
      host,
      requestPaint,
    )

  if (renderer === null) {
    canvas.remove()

    throw new HTMLInCanvasCapabilityError(
      'HTML-in-Canvas is not supported by this browser',
    )
  }

  const handlePaint = () => {
    if (destroyed) return
    renderer.paint()
  }

  canvas.addEventListener(
    'paint',
    handlePaint,
  )

  const stopObserving =
    observeCanvasSize(
      canvas,
      (width, height) => {
        renderer.resize(
          width,
          height,
        )
      },
    )

  requestPaint()

  return {
    canvas,
    host,
    requestPaint,
    destroy() {
      if (destroyed) return
      destroyed = true

      stopObserving()
      canvas.removeEventListener(
        'paint',
        handlePaint,
      )
      renderer.destroy()

      if (
        typeof canvas.clearElementGeometry ===
        'function'
      ) {
        canvas.clearElementGeometry(
          host,
        )
      }

      canvas.remove()
    },
  }
}
