import { createElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Progress } from '../src/components/Progress'
import { resolveProgress } from '../src/core/resolved-progress'
import { resolveView } from '../src/core/resolved-view'
import { compileDiCProgress } from '../src/renderers/dic/compile-progress'
import { drawDiCProgress } from '../src/renderers/dic/draw-progress'
import { createDiCReactRoot } from '../src/renderers/dic/react-reconciler'
import {
  defaultBreakpoints,
  defaultTheme,
} from '../src/theme/default-theme'

function context() {
  return {
    lineWidth: 0,
    lineCap: 'butt',
    strokeStyle: '',
    fillStyle: '',
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    stroke: vi.fn(),
    roundRect: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    closePath: vi.fn(),
    clip: vi.fn(),
    fill: vi.fn(),
  } as unknown as CanvasRenderingContext2D
}

describe('DiC Progress', () => {
  it('compiles semantic size and clamps determined progress', () => {
    const progress = resolveProgress({
      undetermined: false,
      progress: 1.4,
      mode: 'linear',
      size: 'large',
      color: 'success',
      speed: 'fast',
      tracked: true,
    })
    const node = compileDiCProgress(
      resolveView(
        {},
        defaultBreakpoints,
      ),
      progress,
      defaultTheme,
    )

    expect(progress.progress).toBe(1)
    expect(node.paint).toMatchObject({
      width: 10,
      height: 0.5,
      color: 'success',
    })
    expect(node.content).toEqual({
      kind: 'progress',
      progress,
    })
  })

  it('draws determined linear value against the content width', () => {
    const canvas = context()
    const progress = resolveProgress({
      undetermined: false,
      progress: 0.25,
      mode: 'linear',
      size: 'medium',
      color: 'primary',
      tracked: true,
      speed: 'normal',
    })

    drawDiCProgress(
      canvas,
      {
        kind: 'progress',
        progress,
      },
      {
        x: 10,
        y: 20,
        width: 160,
        height: 8,
      },
      {
        theme: defaultTheme,
        rem: 16,
        time: 0,
        reducedMotion: false,
      },
    )

    expect(canvas.roundRect).toHaveBeenCalledWith(
      10,
      20,
      40,
      8,
      4,
    )
    expect(canvas.fill).toHaveBeenCalled()
  })

  it('rotates undetermined spin from the shared animation clock', () => {
    const canvas = context()
    const progress = resolveProgress({
      undetermined: true,
      mode: 'spin',
      size: 'medium',
      color: 'primary',
      speed: 'normal',
    })

    drawDiCProgress(
      canvas,
      {
        kind: 'progress',
        progress,
      },
      {
        x: 0,
        y: 0,
        width: 24,
        height: 24,
      },
      {
        theme: defaultTheme,
        rem: 16,
        time: 800,
        reducedMotion: false,
      },
    )

    const arc = vi.mocked(canvas.arc)
    const call = arc.mock.calls[0]

    expect(call?.[3]).toBeCloseTo(
      -Math.PI / 2 + Math.PI,
    )
    expect(
      (call?.[4] ?? 0) -
      (call?.[3] ?? 0),
    ).toBeCloseTo(
      96 * Math.PI / 180,
    )
  })

  it('freezes undetermined motion when reduced motion is requested', () => {
    const first = context()
    const second = context()
    const progress = resolveProgress({
      undetermined: true,
      mode: 'spin',
      size: 'small',
      speed: 'fast',
    })

    for (const [canvas, time] of [
      [first, 0],
      [second, 500],
    ] as const) {
      drawDiCProgress(
        canvas,
        {
          kind: 'progress',
          progress,
        },
        {
          x: 0,
          y: 0,
          width: 18,
          height: 18,
        },
        {
          theme: defaultTheme,
          rem: 16,
          time,
          reducedMotion: true,
        },
      )
    }

    expect(
      vi.mocked(first.arc).mock.calls[0]?.[3],
    ).toBe(
      vi.mocked(second.arc).mock.calls[0]?.[3],
    )
  })

  it('materializes Progress through the DiC React reconciler', () => {
    const root = createDiCReactRoot()

    root.render(
      createElement(Progress, {
        progress: 0.4,
        mode: 'linear',
        size: 'small',
      }),
    )

    const [node] = root.getNodes()

    expect(node?.content?.kind).toBe('progress')
    expect(
      node?.semantics.role,
    ).toBe('progressbar')
    expect(
      node?.semantics.valueNow,
    ).toBe(0.4)

    root.unmount()
  })
})
