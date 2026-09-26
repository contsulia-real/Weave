import { describe, expect, it, vi } from 'vitest'
import { resolveView } from '../src/core/resolved-view'
import type { ViewProps } from '../src/core/view-types'
import { compileDiCView } from '../src/renderers/dic/compile-view'
import {
  createDiCSurface,
  type DiCSurfaceScheduler,
} from '../src/renderers/dic/surface'
import { defaultBreakpoints, defaultTheme } from '../src/theme/default-theme'

describe('DiC surface', () => {
  it('coalesces invalidation, scales the backing store, and draws in CSS pixels', () => {
    let scheduled:
      | FrameRequestCallback
      | undefined

    const scheduler: DiCSurfaceScheduler = {
      request: vi.fn((callback) => {
        scheduled = callback
        return 17
      }),
      cancel: vi.fn(),
    }

    const context = {
      globalAlpha: 1,
      fillStyle: '',
      setTransform: vi.fn(),
      clearRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      transform: vi.fn(),
      beginPath: vi.fn(),
      roundRect: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      createLinearGradient: vi.fn(),
      createRadialGradient: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const canvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => context),
      getBoundingClientRect: vi.fn(),
    } as unknown as HTMLCanvasElement

    const props: ViewProps = {
      width: 10,
      height: 'fill',
      padding: 1,
      background: 'primary',
      radius: 'medium',
    }

    const scene = {
      node: compileDiCView(
        resolveView(props, defaultBreakpoints),
      ),
      theme: defaultTheme,
      rem: 16,
    }

    const surface = createDiCSurface(
      canvas,
      scene,
      {
        autoResize: false,
        scheduler,
      },
    )

    surface.resize(240, 120, 2)
    surface.invalidate()
    surface.update(scene)

    expect(canvas.width).toBe(480)
    expect(canvas.height).toBe(240)
    expect(scheduler.request).toHaveBeenCalledTimes(1)

    scheduled?.(0)

    expect(context.setTransform).toHaveBeenCalledWith(
      2,
      0,
      0,
      2,
      0,
      0,
    )
    expect(context.clearRect).toHaveBeenCalledWith(
      0,
      0,
      240,
      120,
    )
    expect(surface.getLayout()).toMatchObject({
      frame: {
        x: 0,
        y: 0,
        width: 160,
        height: 120,
      },
      contentFrame: {
        x: 16,
        y: 16,
        width: 128,
        height: 88,
      },
      children: [],
    })
  })

  it('cancels pending work when destroyed', () => {
    const scheduler: DiCSurfaceScheduler = {
      request: vi.fn(() => 23),
      cancel: vi.fn(),
    }

    const context = {
      setTransform: vi.fn(),
      clearRect: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const canvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => context),
      getBoundingClientRect: vi.fn(),
    } as unknown as HTMLCanvasElement

    const surface = createDiCSurface(
      canvas,
      {
        node: compileDiCView(
          resolveView({}, defaultBreakpoints),
        ),
        theme: defaultTheme,
      },
      {
        autoResize: false,
        scheduler,
      },
    )

    surface.resize(100, 60, 1)
    surface.destroy()

    expect(scheduler.cancel).toHaveBeenCalledWith(23)

    surface.invalidate()
    expect(scheduler.request).toHaveBeenCalledTimes(1)
  })
})
