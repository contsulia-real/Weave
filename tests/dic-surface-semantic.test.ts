import { afterEach, describe, expect, it, vi } from 'vitest'
import { resolveSwitch } from '../src/core/resolved-switch'
import { resolveView } from '../src/core/resolved-view'
import { compileDiCSwitch } from '../src/renderers/dic/compile-switch'
import {
  createDiCSurface,
  type DiCSurfaceScheduler,
} from '../src/renderers/dic/surface'
import {
  defaultBreakpoints,
  defaultTheme,
} from '../src/theme/default-theme'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('DiC surface semantic mirror', () => {
  it('keeps semantic DOM synchronized with scene updates and destroys it with the surface', () => {
    let scheduled:
      | FrameRequestCallback
      | undefined

    const scheduler: DiCSurfaceScheduler = {
      request: vi.fn((callback) => {
        scheduled = callback
        return 41
      }),
      cancel: vi.fn(),
    }

    const context = {
      globalAlpha: 1,
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
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
          right: 160,
          bottom: 80,
          x: 0,
          y: 0,
          width: 160,
          height: 80,
          toJSON: () => ({}),
        })),
      },
    )
    host.appendChild(canvas)
    document.body.appendChild(host)

    const first = compileDiCSwitch(
      resolveView(
        {
          id: 'setting',
          label: 'Setting',
        },
        defaultBreakpoints,
      ),
      resolveSwitch({
        checked: false,
      }),
      defaultTheme,
    )

    const surface = createDiCSurface(
      canvas,
      {
        node: first,
        theme: defaultTheme,
      },
      {
        autoResize: false,
        scheduler,
      },
    )

    surface.resize(160, 80, 1)
    scheduled?.(0)

    const mirror = surface.getSemanticMirror()
    const firstElement =
      mirror?.getElement(first)

    expect(mirror).toBeDefined()
    expect(firstElement?.getAttribute('role')).toBe('switch')
    expect(firstElement?.getAttribute('aria-label')).toBe('Setting')
    expect(firstElement?.getAttribute('aria-checked')).toBe('false')

    const second = compileDiCSwitch(
      resolveView(
        {
          id: 'setting',
          label: 'Setting',
        },
        defaultBreakpoints,
      ),
      resolveSwitch({
        checked: true,
      }),
      defaultTheme,
    )

    surface.update({
      node: second,
      theme: defaultTheme,
    })
    scheduled?.(16)

    const secondElement =
      mirror?.getElement(second)

    expect(secondElement?.getAttribute('aria-checked')).toBe('true')
    expect(firstElement?.isConnected).toBe(false)

    surface.destroy()

    expect(
      host.querySelector(
        '[data-weave-dic-semantic-root]',
      ),
    ).toBeNull()
  })
})
