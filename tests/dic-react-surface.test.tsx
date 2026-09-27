import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  Button,
  Switch,
  Text,
  ThemeProvider,
  View,
  createTheme,
} from '../src'
import { createDiCReactSurface } from '../src/renderers/dic/react-surface'
import type { DiCSurfaceScheduler } from '../src/renderers/dic/surface'

afterEach(() => {
  document.body.innerHTML = ''
})

function canvasHarness() {
  let scheduled:
    | FrameRequestCallback
    | undefined

  const scheduler: DiCSurfaceScheduler = {
    request: vi.fn((callback) => {
      scheduled = callback
      return 73
    }),
    cancel: vi.fn(),
  }

  let font = ''
  const context = {
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

  const host = document.createElement('div')
  const canvas = document.createElement('canvas')

  Object.defineProperty(
    canvas,
    'getContext',
    {
      configurable: true,
      value: vi.fn(() => context),
    },
  )

  Object.defineProperty(
    canvas,
    'getBoundingClientRect',
    {
      configurable: true,
      value: vi.fn(() => ({
        left: 0,
        top: 0,
        right: 320,
        bottom: 180,
        x: 0,
        y: 0,
        width: 320,
        height: 180,
        toJSON: () => ({}),
      })),
    },
  )

  host.appendChild(canvas)
  document.body.appendChild(host)

  return {
    canvas,
    context,
    scheduler,
    frame() {
      const callback = scheduled
      scheduled = undefined
      callback?.(0)
    },
  }
}

describe('DiC React surface', () => {
  it('materializes public React components into one DiC tree and renders it', () => {
    const harness = canvasHarness()
    const root = createDiCReactSurface(
      harness.canvas,
      <ThemeProvider>
        <View
          width={12}
          height={8}
          layout="flex"
          direction="column"
        >
          <Text>Hello</Text>
          <Button text="Run" />
          <Switch defaultChecked />
        </View>
      </ThemeProvider>,
      {
        autoResize: false,
        scheduler: harness.scheduler,
        semanticMirror: false,
      },
    )

    const nodes = root.getNodes()
    expect(nodes).toHaveLength(1)

    const node = nodes[0]
    expect(node?.children).toHaveLength(3)
    expect(node?.children[0]?.content).toMatchObject({
      kind: 'text',
      text: 'Hello',
    })
    expect(node?.children[1]?.semantics.role).toBe('button')
    expect(node?.children[2]?.semantics).toMatchObject({
      role: 'switch',
      checked: true,
    })

    root.resize(320, 180, 1)
    harness.frame()

    expect(
      root.getSurface().getLayout()?.frame,
    ).toEqual({
      x: 0,
      y: 0,
      width: 192,
      height: 128,
    })
    expect(harness.context.fillText).toHaveBeenCalled()

    root.destroy()
  })

  it('preserves nested ThemeProvider themes in compiled DiC nodes', () => {
    const harness = canvasHarness()
    const nestedTheme = createTheme({
      tokens: {
        color: {
          primary: '#123456',
        },
      },
    })

    const root = createDiCReactSurface(
      harness.canvas,
      <ThemeProvider>
        <View width={10} height={6}>
          <ThemeProvider theme={nestedTheme}>
            <View
              width={4}
              height={2}
              background="primary"
            >
              <Text>Nested</Text>
            </View>
          </ThemeProvider>
        </View>
      </ThemeProvider>,
      {
        autoResize: false,
        scheduler: harness.scheduler,
        semanticMirror: false,
      },
    )

    const nested =
      root.getNodes()[0]?.children[0]

    expect(
      nested?.theme?.tokens.color?.primary,
    ).toBe('#123456')
    expect(
      nested?.children[0]?.theme?.tokens.color?.primary,
    ).toBe('#123456')

    root.destroy()
  })

  it('updates the existing surface when the React tree is rendered again', () => {
    const harness = canvasHarness()
    const root = createDiCReactSurface(
      harness.canvas,
      <Switch
        checked={false}
        viewProps={{
          id: 'setting',
          label: 'Setting',
        }}
      />,
      {
        autoResize: false,
        scheduler: harness.scheduler,
      },
    )

    root.resize(160, 80, 1)
    harness.frame()

    const first =
      root.getNodes()[0]
    expect(first?.semantics.checked).toBe(false)

    root.render(
      <Switch
        checked
        viewProps={{
          id: 'setting',
          label: 'Setting',
        }}
      />,
    )

    const second =
      root.getNodes()[0]
    expect(second).toBe(first)
    expect(second?.semantics.checked).toBe(true)

    harness.frame()

    expect(
      root
        .getSurface()
        .getSemanticMirror()
        ?.getElement(second as NonNullable<typeof second>)
        ?.getAttribute('aria-checked'),
    ).toBe('true')

    root.destroy()
  })

  it('fails explicitly for multiple top-level DiC nodes', () => {
    const harness = canvasHarness()

    expect(() =>
      createDiCReactSurface(
        harness.canvas,
        <>
          <View />
          <View />
        </>,
        {
          autoResize: false,
          scheduler: harness.scheduler,
          semanticMirror: false,
        },
      ),
    ).toThrow(
      'requires exactly one top-level Weave node',
    )
  })
})
