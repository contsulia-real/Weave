type ElementImageHandle = {
  close(): void
}

type HTMLInCanvasWorker2DContext =
  OffscreenCanvasRenderingContext2D & {
    drawElementImage(
      image: ElementImageHandle,
      dx: number,
      dy: number,
    ): void
    reset?: () => void
  }

type InitMessage = {
  type: 'init'
  canvas: OffscreenCanvas
}

type ResizeMessage = {
  type: 'resize'
  width: number
  height: number
}

type FrameMessage = {
  type: 'frame'
  image: ElementImageHandle
}

type DestroyMessage = {
  type: 'destroy'
}

type RendererMessage =
  | InitMessage
  | ResizeMessage
  | FrameMessage
  | DestroyMessage

const workerGlobal =
  globalThis as unknown as {
    onmessage:
      | ((
          event: MessageEvent<RendererMessage>,
        ) => void)
      | null
    postMessage(
      message: unknown,
    ): void
    close(): void
  }

let canvas:
  | OffscreenCanvas
  | undefined
let context:
  | HTMLInCanvasWorker2DContext
  | undefined
let latestImage:
  | ElementImageHandle
  | undefined

function resetContext(): void {
  if (
    canvas === undefined ||
    context === undefined
  ) {
    return
  }

  if (
    typeof context.reset ===
      'function'
  ) {
    context.reset()
    return
  }

  context.setTransform(
    1,
    0,
    0,
    1,
    0,
    0,
  )
  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height,
  )
}

function drawLatest(): void {
  if (
    context === undefined ||
    latestImage === undefined
  ) {
    return
  }

  resetContext()
  context.drawElementImage(
    latestImage,
    0,
    0,
  )
}

workerGlobal.onmessage = (
  event: MessageEvent<RendererMessage>,
) => {
  const message = event.data

  if (message.type === 'init') {
    canvas = message.canvas

    const nextContext =
      canvas.getContext('2d')

    if (
      nextContext === null ||
      typeof (
        nextContext as
          HTMLInCanvasWorker2DContext
      ).drawElementImage !==
        'function'
    ) {
      throw new Error(
        'HTML-in-Canvas OffscreenCanvas rendering is unavailable',
      )
    }

    context =
      nextContext as
        HTMLInCanvasWorker2DContext
    return
  }

  if (
    canvas === undefined ||
    context === undefined
  ) {
    return
  }

  if (message.type === 'resize') {
    const nextWidth =
      Math.max(
        0,
        Math.round(message.width),
      )
    const nextHeight =
      Math.max(
        0,
        Math.round(message.height),
      )

    if (
      canvas.width === nextWidth &&
      canvas.height === nextHeight
    ) {
      return
    }

    canvas.width = nextWidth
    canvas.height = nextHeight

    // Resizing clears the bitmap. Redraw the latest transferred snapshot
    // in the same worker task so the main thread never has to copy pixels.
    drawLatest()
    return
  }

  if (message.type === 'frame') {
    const previous =
      latestImage
    latestImage =
      message.image

    drawLatest()
    previous?.close()
    workerGlobal.postMessage({
      type: 'frame-drawn',
    })
    return
  }

  latestImage?.close()
  latestImage = undefined
  context = undefined
  canvas = undefined
  workerGlobal.close()
}
