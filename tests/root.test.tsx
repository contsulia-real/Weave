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
    ).toHaveBeenCalledWith(
      host,
      {
        preserveHitTestOrder: true,
        canvasTransform: {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: 0,
          f: 0,
        },
      },
    )

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
