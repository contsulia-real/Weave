type HTMLInCanvas2DContext =
  CanvasRenderingContext2D & {
    drawElementImage(
      element: Element,
      dx: number,
      dy: number,
    ): void
    reset?: () => void
  }

interface HTMLInCanvasElement extends HTMLCanvasElement {
  requestPaint(): void
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

  canvas.width = nextWidth
  canvas.height = nextHeight
  return true
}

function observeCanvasSize(
  canvas: HTMLCanvasElement,
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
    document.createElement('div')
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

  const handlePaint = () => {
    if (destroyed) return

    resetContext(
      context,
      canvas,
    )
    context.drawElementImage(
      host,
      0,
      0,
    )
  }

  canvas.addEventListener(
    'paint',
    handlePaint,
  )

  const stopObserving =
    observeCanvasSize(
      canvas,
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
      canvas.remove()
    },
  }
}
