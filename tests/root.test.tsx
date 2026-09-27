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
  Input,
  Text,
  View,
  createRoot,
} from '../src'

function canvasContext() {
  let font = ''

  return {
    globalAlpha: 1,
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    shadowColor: '',
    textBaseline: 'top',
    get font() {
      return font
    },
    set font(value: string) {
      font = value
    },
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    transform: vi.fn(),
    beginPath: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    roundRect: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn((value: string) => ({
      width: Array.from(value).length * 8,
    })),
    createLinearGradient: vi.fn(),
    createRadialGradient: vi.fn(),
  } as unknown as CanvasRenderingContext2D
}

describe('public Weave root', () => {
  let getContext:
    | ReturnType<typeof vi.spyOn>
    | undefined

  beforeEach(() => {
    getContext = vi
      .spyOn(
        HTMLCanvasElement.prototype,
        'getContext',
      )
      .mockImplementation(
        () => canvasContext(),
      )
  })

  afterEach(() => {
    getContext?.mockRestore()
    document.body.innerHTML = ''
  })

  it('uses DiC by default without exposing a canvas in the API', () => {
    const container =
      document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(
      container,
      'getBoundingClientRect',
      {
        configurable: true,
        value: () => ({
          left: 0,
          top: 0,
          right: 320,
          bottom: 180,
          x: 0,
          y: 0,
          width: 320,
          height: 180,
          toJSON: () => ({}),
        }),
      },
    )

    const root = createRoot(container)

    root.render(
      <View width={10} height={6}>
        <Text>Hello</Text>
      </View>,
    )

    const canvas = container.querySelector(
      'canvas[data-weave-root-canvas]',
    )

    expect(canvas).toBeInstanceOf(
      HTMLCanvasElement,
    )
    expect(
      canvas?.getAttribute('aria-hidden'),
    ).toBe('true')

    root.unmount()
    expect(container.childNodes).toHaveLength(0)
  })

  it('falls the whole root back to DOM on an explicit DiC capability gap', async () => {
    const container =
      document.createElement('div')
    document.body.appendChild(container)

    const root = createRoot(container)

    await act(async () => {
      root.render(
        <View
          data={{
            testid: 'fallback',
          }}
          style={{
            color: 'red',
          }}
        />,
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
    ).toBeInstanceOf(HTMLDivElement)

    root.unmount()
  })

  it('keeps the selected DOM fallback for later renders', async () => {
    const container =
      document.createElement('div')
    document.body.appendChild(container)

    const root = createRoot(container)

    await act(async () => {
      root.render(
        <Input
          value="first"
          onChange={() => {}}
        />,
      )
    })

    expect(
      container.querySelector('input'),
    ).toBeInstanceOf(HTMLInputElement)

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
    ).toBeInstanceOf(HTMLDivElement)

    root.unmount()
  })

  it('does not hide ordinary application errors behind DOM fallback', () => {
    const container =
      document.createElement('div')
    document.body.appendChild(container)

    const Broken = () => {
      throw new Error('application boom')
    }

    const root = createRoot(container)

    expect(() =>
      root.render(<Broken />),
    ).toThrow('application boom')

    expect(
      container.querySelector(
        'canvas[data-weave-root-canvas]',
      ),
    ).toBeNull()

    root.unmount()
  })

  it('cannot render again after unmount', () => {
    const container =
      document.createElement('div')
    document.body.appendChild(container)

    const root = createRoot(container)
    root.render(<View />)
    root.unmount()

    expect(() =>
      root.render(<View />),
    ).toThrow(
      'Cannot render into an unmounted Weave root',
    )
  })

  it('can disable DOM fallback and surface capability errors', () => {
    const container =
      document.createElement('div')
    document.body.appendChild(container)

    const root = createRoot(
      container,
      {
        fallback: 'none',
      },
    )

    expect(() =>
      root.render(
        <View
          style={{
            color: 'red',
          }}
        />,
      ),
    ).toThrow(
      'raw style is not supported by the DiC React renderer yet',
    )

    expect(
      container.querySelector(
        'canvas[data-weave-root-canvas]',
      ),
    ).toBeNull()

    root.unmount()
  })
})
