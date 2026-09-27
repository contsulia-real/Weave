import {
  act,
} from 'react'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  Text,
  View,
  createRoot,
} from '../src'

describe('public Weave root', () => {
  let getContext:
    | ReturnType<typeof vi.spyOn>
    | undefined
  let requestPaint:
    | ReturnType<typeof vi.fn>
    | undefined
  let reset:
    | ReturnType<typeof vi.fn>
    | undefined
  let drawElementImage:
    | ReturnType<typeof vi.fn>
    | undefined
  let drawImage:
    | ReturnType<typeof vi.fn>
    | undefined
  let updateElementGeometry:
    | ReturnType<typeof vi.fn>
    | undefined
  let clearElementGeometry:
    | ReturnType<typeof vi.fn>
    | undefined

  beforeEach(() => {
    requestPaint = vi.fn()
    reset = vi.fn()
    drawElementImage = vi.fn()
    drawImage = vi.fn()
    updateElementGeometry = vi.fn()
    clearElementGeometry = vi.fn()

    Object.defineProperty(
      HTMLCanvasElement.prototype,
      'requestPaint',
      {
        configurable: true,
        value: requestPaint,
      },
    )

    Object.defineProperty(
      HTMLCanvasElement.prototype,
      'updateElementGeometry',
      {
        configurable: true,
        value: updateElementGeometry,
      },
    )

    Object.defineProperty(
      HTMLCanvasElement.prototype,
      'clearElementGeometry',
      {
        configurable: true,
        value: clearElementGeometry,
      },
    )

    getContext = vi
      .spyOn(
        HTMLCanvasElement.prototype,
        'getContext',
      )
      .mockImplementation(
        () =>
          ({
            reset,
            drawElementImage,
            drawImage,
            setTransform: vi.fn(),
            clearRect: vi.fn(),
          }) as unknown as
            CanvasRenderingContext2D,
      )
  })

  afterEach(() => {
    getContext?.mockRestore()
    delete (
      HTMLCanvasElement.prototype as
        HTMLCanvasElement & {
          requestPaint?: () => void
          updateElementGeometry?: (
            element: Element,
            options?: unknown,
          ) => void
          clearElementGeometry?: (
            element: Element,
          ) => void
        }
    ).requestPaint
    delete (
      HTMLCanvasElement.prototype as
        HTMLCanvasElement & {
          updateElementGeometry?: (
            element: Element,
            options?: unknown,
          ) => void
        }
    ).updateElementGeometry
    delete (
      HTMLCanvasElement.prototype as
        HTMLCanvasElement & {
          clearElementGeometry?: (
            element: Element,
          ) => void
        }
    ).clearElementGeometry
    delete (
      HTMLElement.prototype as
        HTMLElement & {
          setCanvasTransform?: (
            matrix?: DOMMatrixInit,
          ) => void
        }
    ).setCanvasTransform
    document.body.innerHTML = ''
  })

  it('uses native HTML-in-Canvas when the browser exposes it', async () => {
    const container =
      document.createElement('div')
    document.body.appendChild(
      container,
    )

    const root =
      createRoot(container)

    await act(async () => {
      root.render(
        <View
          width={10}
          height={6}
        >
          <Text>Hello</Text>
        </View>,
      )
    })

    const canvas =
      container.querySelector(
        'canvas[data-weave-root-canvas]',
      )
    const host =
      container.querySelector(
        '[data-weave-root-host]',
      )

    expect(canvas).toBeInstanceOf(
      HTMLCanvasElement,
    )
    expect(
      canvas?.hasAttribute(
        'layoutsubtree',
      ),
    ).toBe(true)
    expect(
      canvas?.getAttribute(
        'content',
      ),
    ).toBe('drawable')
    expect(host).toBeInstanceOf(
      HTMLDivElement,
    )
    expect(
      host?.hasAttribute(
        'drawable',
      ),
    ).toBe(true)
    expect(requestPaint).toHaveBeenCalled()

    canvas?.dispatchEvent(
      new Event('paint'),
    )

    expect(reset).toHaveBeenCalled()
    expect(
      drawElementImage,
    ).toHaveBeenCalledWith(
      host,
      0,
      0,
    )
    expect(
      updateElementGeometry,
    ).not.toHaveBeenCalled()

    canvas?.dispatchEvent(
      new Event('paint'),
    )

    expect(
      drawElementImage,
    ).toHaveBeenCalledTimes(2)

    root.unmount()
    expect(
      clearElementGeometry,
    ).toHaveBeenCalledWith(
      host,
    )
    expect(
      container.childNodes,
    ).toHaveLength(0)
  })

  it('moves supported HTML-in-Canvas composition to a worker', async () => {
    const originalWorker =
      globalThis.Worker
    const originalOffscreenCanvas =
      globalThis.OffscreenCanvas
    const posted:
      Array<unknown> = []
    const terminate =
      vi.fn()
    let workerMessageListener:
      | ((
          event: MessageEvent<unknown>,
        ) => void)
      | undefined
    let imageIndex = 0
    const images = [
      { close: vi.fn() },
      { close: vi.fn() },
      { close: vi.fn() },
    ]
    const captureElementImage =
      vi.fn(() => {
        const image =
          images[
            Math.min(
              imageIndex,
              images.length - 1,
            )
          ]!
        imageIndex += 1
        return image
      })

    class TestWorker {
      postMessage(message: unknown): void {
        posted.push(message)
      }

      addEventListener(
        type: string,
        listener: (
          event: MessageEvent<unknown>,
        ) => void,
      ): void {
        if (type === 'message') {
          workerMessageListener =
            listener
        }
      }

      removeEventListener(
        type: string,
      ): void {
        if (type === 'message') {
          workerMessageListener =
            undefined
        }
      }

      terminate(): void {
        terminate()
      }
    }

    class TestOffscreenCanvas {
      width: number
      height: number

      constructor(
        width: number,
        height: number,
      ) {
        this.width = width
        this.height = height
      }

      getContext(): unknown {
        return {
          drawElementImage: vi.fn(),
        }
      }
    }

    Object.defineProperty(
      globalThis,
      'Worker',
      {
        configurable: true,
        value: TestWorker,
      },
    )
    Object.defineProperty(
      globalThis,
      'OffscreenCanvas',
      {
        configurable: true,
        value: TestOffscreenCanvas,
      },
    )
    Object.defineProperty(
      HTMLCanvasElement.prototype,
      'captureElementImage',
      {
        configurable: true,
        value: captureElementImage,
      },
    )
    Object.defineProperty(
      HTMLCanvasElement.prototype,
      'transferControlToOffscreen',
      {
        configurable: true,
        value: () => ({
          width: 0,
          height: 0,
        }),
      },
    )

    try {
      const container =
        document.createElement('div')
      document.body.appendChild(
        container,
      )

      const root =
        createRoot(container)

      await act(async () => {
        root.render(
          <View>
            <Text>Worker</Text>
          </View>,
        )
      })

      const canvas =
        container.querySelector(
          'canvas[data-weave-root-canvas]',
        )
      const host =
        container.querySelector(
          '[data-weave-root-host]',
        )

      expect(
        canvas?.getAttribute(
          'data-weave-canvas-thread',
        ),
      ).toBe('worker')

      canvas?.dispatchEvent(
        new Event('paint'),
      )

      expect(
        captureElementImage,
      ).toHaveBeenCalledWith(
        host,
      )
      expect(
        drawElementImage,
      ).not.toHaveBeenCalled()
      const frameCount = () =>
        posted.filter(
          (message) =>
            (
              message as {
                type?: string
              }
            ).type === 'frame',
        ).length

      expect(frameCount()).toBe(1)

      canvas?.dispatchEvent(
        new Event('paint'),
      )
      canvas?.dispatchEvent(
        new Event('paint'),
      )

      expect(frameCount()).toBe(1)
      expect(
        images[1]?.close,
      ).toHaveBeenCalled()

      workerMessageListener?.(
        {
          data: {
            type: 'frame-drawn',
          },
        } as MessageEvent<unknown>,
      )

      expect(frameCount()).toBe(2)

      root.unmount()
      expect(
        terminate,
      ).toHaveBeenCalled()
    } finally {
      delete (
        HTMLCanvasElement.prototype as
          HTMLCanvasElement & {
            captureElementImage?: (
              element: Element,
            ) => unknown
            transferControlToOffscreen?: (
            ) => unknown
          }
      ).captureElementImage
      delete (
        HTMLCanvasElement.prototype as
          HTMLCanvasElement & {
            transferControlToOffscreen?: (
            ) => unknown
          }
      ).transferControlToOffscreen

      Object.defineProperty(
        globalThis,
        'Worker',
        {
          configurable: true,
          value: originalWorker,
        },
      )
      Object.defineProperty(
        globalThis,
        'OffscreenCanvas',
        {
          configurable: true,
          value:
            originalOffscreenCanvas,
        },
      )
    }
  })

  it('registers a returned draw matrix through the canvas geometry API', async () => {
    const matrix = {
      toString: () =>
        'matrix(1, 0, 0, 1, 12, 8)',
    } as unknown as DOMMatrix

    drawElementImage?.mockReturnValue(
      matrix,
    )

    const container =
      document.createElement('div')
    document.body.appendChild(
      container,
    )

    const root =
      createRoot(container)

    await act(async () => {
      root.render(
        <View>
          <Text>Transitional</Text>
        </View>,
      )
    })

    const canvas =
      container.querySelector(
        'canvas[data-weave-root-canvas]',
      )
    const host =
      container.querySelector(
        '[data-weave-root-host]',
      )

    canvas?.dispatchEvent(
      new Event('paint'),
    )

    expect(
      updateElementGeometry,
    ).toHaveBeenCalledWith(
      host,
      {
        preserveHitTestOrder: true,
        canvasTransform: matrix,
      },
    )

    root.unmount()
  })

  it('registers the legacy draw matrix for hit testing', async () => {
    delete (
      HTMLCanvasElement.prototype as
        HTMLCanvasElement & {
          updateElementGeometry?: (
            element: Element,
            options?: unknown,
          ) => void
        }
    ).updateElementGeometry

    const matrix = {
      toString: () =>
        'matrix(1, 0, 0, 1, 0, 0)',
    } as unknown as DOMMatrix
    const setCanvasTransform =
      vi.fn()

    Object.defineProperty(
      HTMLElement.prototype,
      'setCanvasTransform',
      {
        configurable: true,
        value: setCanvasTransform,
      },
    )

    drawElementImage?.mockReturnValue(
      matrix,
    )

    const container =
      document.createElement('div')
    document.body.appendChild(
      container,
    )

    const root =
      createRoot(container)

    await act(async () => {
      root.render(
        <View>
          <Text>Interactive</Text>
        </View>,
      )
    })

    const canvas =
      container.querySelector(
        'canvas[data-weave-root-canvas]',
      )

    canvas?.dispatchEvent(
      new Event('paint'),
    )

    expect(
      setCanvasTransform,
    ).toHaveBeenCalledWith(
      matrix,
    )

    root.unmount()
  })

  it('preserves the previous canvas frame while resizing', async () => {
    const originalResizeObserver =
      globalThis.ResizeObserver
    const originalGetBoundingClientRect =
      HTMLCanvasElement.prototype
        .getBoundingClientRect

    let width = 200
    let height = 100

    Object.defineProperty(
      globalThis,
      'ResizeObserver',
      {
        configurable: true,
        value: undefined,
      },
    )

    HTMLCanvasElement.prototype.getBoundingClientRect =
      () =>
        ({
          x: 0,
          y: 0,
          top: 0,
          right: width,
          bottom: height,
          left: 0,
          width,
          height,
          toJSON: () => ({}),
        }) as DOMRect

    try {
      const container =
        document.createElement('div')
      document.body.appendChild(
        container,
      )

      const root =
        createRoot(container)

      await act(async () => {
        root.render(
          <View>
            <Text>Resize</Text>
          </View>,
        )
      })

      const canvas =
        container.querySelector(
          'canvas[data-weave-root-canvas]',
        ) as HTMLCanvasElement | null

      canvas?.dispatchEvent(
        new Event('paint'),
      )

      drawImage?.mockClear()
      requestPaint?.mockClear()

      width = 260
      height = 140

      window.dispatchEvent(
        new Event('resize'),
      )

      expect(drawImage).toHaveBeenCalledTimes(
        2,
      )
      expect(
        requestPaint,
      ).toHaveBeenCalled()
      expect(canvas?.width).toBe(
        Math.round(
          width *
            window.devicePixelRatio,
        ),
      )
      expect(canvas?.height).toBe(
        Math.round(
          height *
            window.devicePixelRatio,
        ),
      )

      root.unmount()
    } finally {
      HTMLCanvasElement.prototype.getBoundingClientRect =
        originalGetBoundingClientRect

      Object.defineProperty(
        globalThis,
        'ResizeObserver',
        {
          configurable: true,
          value: originalResizeObserver,
        },
      )
    }
  })

  it('falls back to ordinary DOM when HTML-in-Canvas is unavailable', async () => {
    delete (
      HTMLCanvasElement.prototype as
        HTMLCanvasElement & {
          requestPaint?: () => void
        }
    ).requestPaint

    const container =
      document.createElement('div')
    document.body.appendChild(
      container,
    )

    const root =
      createRoot(container)

    await act(async () => {
      root.render(
        <View
          data={{
            testid: 'fallback',
          }}
        >
          <Text>Fallback</Text>
        </View>,
      )
    })

    expect(
      container.querySelector(
        'canvas[data-weave-root-canvas]',
      ),
    ).toBeNull()
    expect(
      container.querySelector(
        '[data-testid="fallback"]',
      ),
    ).toBeInstanceOf(
      HTMLDivElement,
    )

    root.unmount()
  })

  it('can disable DOM fallback and expose missing native support', () => {
    delete (
      HTMLCanvasElement.prototype as
        HTMLCanvasElement & {
          requestPaint?: () => void
        }
    ).requestPaint

    const container =
      document.createElement('div')
    document.body.appendChild(
      container,
    )

    const root =
      createRoot(
        container,
        {
          fallback: 'none',
        },
      )

    expect(() =>
      root.render(<View />),
    ).toThrow(
      'HTML-in-Canvas is not supported by this browser',
    )

    expect(
      container.childNodes,
    ).toHaveLength(0)
  })

  it('keeps the selected DOM fallback for later renders', async () => {
    delete (
      HTMLCanvasElement.prototype as
        HTMLCanvasElement & {
          requestPaint?: () => void
        }
    ).requestPaint

    const container =
      document.createElement('div')
    document.body.appendChild(
      container,
    )

    const root =
      createRoot(container)

    await act(async () => {
      root.render(
        <View>
          <Text>First</Text>
        </View>,
      )
    })

    Object.defineProperty(
      HTMLCanvasElement.prototype,
      'requestPaint',
      {
        configurable: true,
        value: requestPaint,
      },
    )

    await act(async () => {
      root.render(
        <View
          data={{
            testid: 'later',
          }}
        >
          <Text>Later</Text>
        </View>,
      )
    })

    expect(
      container.querySelector(
        'canvas[data-weave-root-canvas]',
      ),
    ).toBeNull()
    expect(
      container.querySelector(
        '[data-testid="later"]',
      ),
    ).toBeInstanceOf(
      HTMLDivElement,
    )

    root.unmount()
  })

  it('does not force an extra paint after later React renders', async () => {
    const container =
      document.createElement('div')
    document.body.appendChild(
      container,
    )

    const root =
      createRoot(container)

    await act(async () => {
      root.render(
        <View>
          <Text>First</Text>
        </View>,
      )
    })

    requestPaint?.mockClear()

    await act(async () => {
      root.render(
        <View>
          <Text>Second</Text>
        </View>,
      )
    })

    expect(
      requestPaint,
    ).not.toHaveBeenCalled()

    root.unmount()
  })

  it('cannot render again after unmount', () => {
    const container =
      document.createElement('div')
    document.body.appendChild(
      container,
    )

    const root =
      createRoot(container)

    root.render(
      <View />,
    )
    root.unmount()

    expect(() =>
      root.render(<View />),
    ).toThrow(
      'Cannot render into an unmounted Weave root',
    )
  })
})
