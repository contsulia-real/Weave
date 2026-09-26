import { describe, expect, it, vi } from 'vitest'
import { resolveView } from '../src/core/resolved-view'
import type { ViewProps } from '../src/core/view-types'
import { compileDiCView } from '../src/renderers/dic/compile-view'
import { drawDiCView } from '../src/renderers/dic/draw-view'
import { defaultBreakpoints, defaultTheme } from '../src/theme/default-theme'

describe('DiC View drawing', () => {
  it('draws the minimal View slice without DOM or CSS compilation', () => {
    const roundRect = vi.fn()
    const translate = vi.fn()
    const rotate = vi.fn()
    const scale = vi.fn()
    const fill = vi.fn()

    const context = {
      globalAlpha: 1,
      fillStyle: '',
      save: vi.fn(),
      restore: vi.fn(),
      translate,
      rotate,
      scale,
      transform: vi.fn(),
      beginPath: vi.fn(),
      roundRect,
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
      fill,
      createLinearGradient: vi.fn(),
      createRadialGradient: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const props: ViewProps = {
      width: 10,
      height: 6,
      background: 'primary',
      radius: 'large',
      opacity: 0.8,
      translateX: 0.5,
      rotate: 5,
      scale: 1.05,
    }

    const node = compileDiCView(
      resolveView(props, defaultBreakpoints),
    )

    drawDiCView(
      context,
      node,
      {
        x: 10,
        y: 20,
        width: 160,
        height: 96,
      },
      {
        theme: defaultTheme,
        rem: 16,
      },
    )

    expect(translate).toHaveBeenNthCalledWith(1, 10, 20)
    expect(translate).toHaveBeenCalledWith(80, 48)
    expect(translate).toHaveBeenCalledWith(8, 0)
    expect(translate).toHaveBeenCalledWith(-80, -48)
    expect(rotate).toHaveBeenCalledWith(5 * Math.PI / 180)
    expect(scale).toHaveBeenCalledWith(1.05, 1.05)
    expect(roundRect).toHaveBeenCalledWith(
      0,
      0,
      160,
      96,
      [16, 16, 16, 16],
    )
    expect(context.fillStyle).toBe('#6d5dfc')
    expect(fill).toHaveBeenCalledTimes(1)
  })

  it('draws zero-blur depth, solid border, and outline without CSS', () => {
    const roundRect = vi.fn()
    const fill = vi.fn()
    const stroke = vi.fn()

    const context = {
      globalAlpha: 1,
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 0,
      shadowColor: '',
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      transform: vi.fn(),
      beginPath: vi.fn(),
      roundRect,
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
      fill,
      stroke,
      createLinearGradient: vi.fn(),
      createRadialGradient: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const node = compileDiCView(
      resolveView(
        {
          width: 8,
          height: 3,
          background: 'surface',
          radius: 'medium',
          border: '1px',
          borderColor: 'outline',
          borderStyle: 'solid',
          shadow: {
            x: 0,
            y: 0.25,
            blur: 0,
            color: 'primary',
          },
          outlineWidth: 0.125,
          outlineColor: 'focus',
          outlineStyle: 'solid',
          outlineOffset: 0.0625,
        },
        defaultBreakpoints,
      ),
    )

    drawDiCView(
      context,
      node,
      {
        x: 0,
        y: 0,
        width: 128,
        height: 48,
      },
      {
        theme: defaultTheme,
        rem: 16,
      },
    )

    expect(roundRect).toHaveBeenCalledWith(
      0,
      4,
      128,
      48,
      [12, 12, 12, 12],
    )
    expect(fill).toHaveBeenCalledTimes(2)
    expect(stroke).toHaveBeenCalledTimes(2)
    expect(roundRect).toHaveBeenCalledWith(
      0.5,
      0.5,
      127,
      47,
      [11.5, 11.5, 11.5, 11.5],
    )
    expect(roundRect).toHaveBeenCalledWith(
      -2,
      -2,
      132,
      52,
      [14, 14, 14, 14],
    )
  })

  it('resolves percentage radius and translate against the View frame', () => {
    const translate = vi.fn()
    const roundRect = vi.fn()

    const context = {
      globalAlpha: 1,
      fillStyle: '',
      save: vi.fn(),
      restore: vi.fn(),
      translate,
      rotate: vi.fn(),
      scale: vi.fn(),
      transform: vi.fn(),
      beginPath: vi.fn(),
      roundRect,
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      createLinearGradient: vi.fn(),
      createRadialGradient: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const node = compileDiCView(
      resolveView(
        {
          background: 'primary',
          radius: '50%',
          translateX: '50%',
        },
        defaultBreakpoints,
      ),
    )

    drawDiCView(
      context,
      node,
      {
        x: 0,
        y: 0,
        width: 200,
        height: 100,
      },
      {
        theme: defaultTheme,
        rem: 16,
      },
    )

    expect(translate).toHaveBeenCalledWith(100, 0)
    expect(roundRect).toHaveBeenCalledWith(
      0,
      0,
      200,
      100,
      [50, 50, 50, 50],
    )
  })
})
