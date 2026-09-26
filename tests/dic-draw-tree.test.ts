import { describe, expect, it, vi } from 'vitest'
import { resolveView } from '../src/core/resolved-view'
import type { ViewProps } from '../src/core/view-types'
import { compileDiCView } from '../src/renderers/dic/compile-view'
import { drawDiCViewTree } from '../src/renderers/dic/draw-view'
import { layoutDiCViewTree } from '../src/renderers/dic/layout-tree'
import {
  defaultBreakpoints,
  defaultTheme,
} from '../src/theme/default-theme'

function node(
  props: ViewProps,
  children = [] as ReturnType<typeof compileDiCView>[],
) {
  return compileDiCView(
    resolveView(props, defaultBreakpoints),
    { children },
  )
}

describe('DiC View tree drawing', () => {
  it('draws descendants at their layout frames inside the parent context', () => {
    const translate = vi.fn()
    const fill = vi.fn()

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
      roundRect: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
      fill,
      createLinearGradient: vi.fn(),
      createRadialGradient: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const tree = node(
      {
        layout: 'flex',
        direction: 'column',
        width: 10,
        height: 8,
        padding: 1,
        background: 'surface',
      },
      [
        node({
          width: 4,
          height: 2,
          background: 'primary',
        }),
        node({
          width: 3,
          height: 1,
          background: 'secondary',
        }),
      ],
    )

    const layout = layoutDiCViewTree(
      tree,
      {
        width: 300,
        height: 300,
      },
      {
        viewportWidth: 300,
        rem: 16,
      },
    )

    drawDiCViewTree(
      context,
      layout,
      {
        theme: defaultTheme,
        rem: 16,
      },
    )

    expect(fill).toHaveBeenCalledTimes(3)
    expect(translate).toHaveBeenCalledWith(0, 0)
    expect(translate).toHaveBeenCalledWith(16, 16)
    expect(translate).toHaveBeenCalledWith(16, 48)
  })
})
