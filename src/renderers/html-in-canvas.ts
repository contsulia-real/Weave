type DrawElementImageResult =
  | DOMMatrix
  | undefined

type HTMLInCanvas2DContext =
  CanvasRenderingContext2D & {
    drawElementImage(
      element: Element,
      dx: number,
      dy: number,
    ): DrawElementImageResult
    reset?: () => void
  }

interface ElementGeometryOptions {
  preserveHitTestOrder?: boolean
  canvasTransform?: DOMMatrixInit
}

interface HTMLInCanvasElement extends HTMLCanvasElement {
  requestPaint(): void
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
  // Current Chromium automatically updates element geometry as part of
  // drawElementImage(). Do not overwrite that transform with an identity
  // matrix: the browser-calculated transform also captures canvas scale,
  // destination position and other geometry details.
  if (drawResult === undefined) {
    return
  }

  // Transitional Chromium builds returned the CSS-space draw matrix.
  // Prefer the canvas-owned geometry API when that build exposes it.
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

  // Older builds registered that returned matrix directly on the element.
  if (
    typeof element.setCanvasTransform ===
    'function'
  ) {
    element.setCanvasTransform(
      drawResult,
    )
    return
  }

  // Earliest experimental builds used the returned matrix as CSS transform.
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

  // Updating either bitmap dimension clears the visible canvas immediately.
  // Restore the previous frame in the same task so live window resizing never
  // exposes that transparent intermediate state while the next HTML snapshot
  // is being prepared.
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

function observeCanvasSize(
  canvas: HTMLCanvasElement,
  context: HTMLInCanvas2DContext,
  resizeBuffer: HTMLCanvasElement,
  shouldPreserveFrame: () => boolean,
  requestPaint: () => void,
): () => void {
  const resizeFromCSSPixels = (
    width: number,
    height: number,
  ) => {
    const dpr =
      devicePixelRatioFor(canvas)

    if (
      applyCanvasSize(
        canvas,
        context,
        resizeBuffer,
        shouldPreserveFrame(),
        width * dpr,
        height * dpr,
      )
    ) {
      requestPaint()
    }
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
  const context =
    htmlInCanvasContext(canvas)

  if (
    typeof canvas.requestPaint !==
      'function' ||
    context === null
  ) {
    throw new HTMLInCanvasCapabilityError(
      'HTML-in-Canvas is not supported by this browser',
    )
  }

  // Chromium's current experimental implementation still requires
  // `layoutsubtree`, while the latest WICG explainer uses
  // `content="drawable"`. Keep both during the API transition.
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

  const resizeBuffer =
    document.createElement('canvas')

  let destroyed = false
  let hasPainted = false

  const requestPaint = () => {
    if (destroyed) return
    canvas.requestPaint()
  }

  const handlePaint = () => {
    if (destroyed) return

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
  }

  canvas.addEventListener(
    'paint',
    handlePaint,
  )

  const stopObserving =
    observeCanvasSize(
      canvas,
      context,
      resizeBuffer,
      () => hasPainted,
      requestPaint,
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
