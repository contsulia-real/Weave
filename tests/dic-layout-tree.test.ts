import { describe, expect, it } from 'vitest'
import { resolveView } from '../src/core/resolved-view'
import type { ViewProps } from '../src/core/view-types'
import {
  compileDiCView,
  type CompileDiCViewOptions,
} from '../src/renderers/dic/compile-view'
import {
  layoutDiCViewTree,
  measureDiCIntrinsicSize,
} from '../src/renderers/dic/layout-tree'
import { defaultBreakpoints } from '../src/theme/default-theme'

function node(
  props: ViewProps = {},
  options: CompileDiCViewOptions = {},
) {
  return compileDiCView(
    resolveView(props, defaultBreakpoints),
    options,
  )
}

describe('DiC View tree layout', () => {
  it('uses intrinsic leaf measurement for content sizing', () => {
    const leaf = node(
      {
        width: 'content',
        height: 'content',
        padding: 1,
      },
      {
        measure: () => ({
          width: 80,
          height: 20,
        }),
      },
    )

    expect(
      measureDiCIntrinsicSize(
        leaf,
        {
          width: 400,
          height: 300,
        },
        {
          viewportWidth: 400,
          rem: 16,
        },
      ),
    ).toEqual({
      width: 112,
      height: 52,
    })
  })

  it('sizes a content column from children, padding, and gap', () => {
    const first = node({
      width: 4,
      height: 2,
    })
    const second = node({
      width: 6,
      height: 3,
    })
    const root = node(
      {
        layout: 'flex',
        direction: 'column',
        align: 'start',
        width: 20,
        height: 'content',
        padding: 1,
        gap: 0.5,
      },
      {
        children: [first, second],
      },
    )

    const layout = layoutDiCViewTree(
      root,
      {
        width: 500,
        height: 400,
      },
      {
        viewportWidth: 500,
        rem: 16,
      },
    )

    expect(layout.frame).toEqual({
      x: 0,
      y: 0,
      width: 320,
      height: 120,
    })
    expect(layout.contentFrame).toEqual({
      x: 16,
      y: 16,
      width: 288,
      height: 88,
    })
    expect(layout.children[0]?.frame).toEqual({
      x: 16,
      y: 16,
      width: 64,
      height: 32,
    })
    expect(layout.children[1]?.frame).toEqual({
      x: 16,
      y: 56,
      width: 96,
      height: 48,
    })
  })

  it('uses border-box geometry for intrinsic content and content frames', () => {
    const leaf = node(
      {
        width: 'content',
        height: 'content',
        padding: 1,
        border: '1px',
      },
      {
        measure: () => ({
          width: 80,
          height: 20,
        }),
      },
    )

    expect(
      measureDiCIntrinsicSize(
        leaf,
        {
          width: 400,
          height: 300,
        },
        {
          viewportWidth: 400,
          rem: 16,
        },
      ),
    ).toEqual({
      width: 114,
      height: 54,
    })

    const layout = layoutDiCViewTree(
      leaf,
      {
        width: 400,
        height: 300,
        root: false,
      },
      {
        viewportWidth: 400,
        rem: 16,
      },
    )

    expect(layout.contentFrame).toEqual({
      x: 17,
      y: 17,
      width: 80,
      height: 20,
    })
  })

  it('shares remaining row space between fill children', () => {
    const root = node(
      {
        layout: 'flex',
        direction: 'row',
        align: 'center',
        width: 20,
        height: 6,
        padding: 1,
        gap: 0.5,
      },
      {
        children: [
          node({
            width: 'fill',
            height: 2,
          }),
          node({
            width: 'fill',
            height: 2,
          }),
        ],
      },
    )

    const layout = layoutDiCViewTree(
      root,
      {
        width: 500,
        height: 300,
      },
      {
        viewportWidth: 500,
        rem: 16,
      },
    )

    expect(layout.children[0]?.frame).toEqual({
      x: 16,
      y: 32,
      width: 140,
      height: 32,
    })
    expect(layout.children[1]?.frame).toEqual({
      x: 164,
      y: 32,
      width: 140,
      height: 32,
    })
  })

  it('uses the nearest container width for child responsive branches', () => {
    const child = node({
      width: 5,
      height: 2,
      containerMd: {
        width: 10,
      },
    })
    const root = node(
      {
        container: 'card',
        width: 50,
        height: 6,
      },
      {
        children: [child],
      },
    )

    const layout = layoutDiCViewTree(
      root,
      {
        width: 900,
        height: 300,
      },
      {
        viewportWidth: 900,
        rem: 16,
      },
    )

    expect(layout.children[0]?.frame.width).toBe(160)
  })

  it('fails explicitly for tree layout modes that are not implemented yet', () => {
    expect(() =>
      layoutDiCViewTree(
        node(
          {
            layout: 'grid',
          },
          {
            children: [node({ width: 2, height: 2 })],
          },
        ),
        {
          width: 300,
          height: 200,
        },
        {
          viewportWidth: 300,
        },
      ),
    ).toThrow('grid tree layout is not implemented yet')

    expect(() =>
      layoutDiCViewTree(
        node(
          {
            layout: 'flex',
            wrap: true,
          },
          {
            children: [node({ width: 2, height: 2 })],
          },
        ),
        {
          width: 300,
          height: 200,
        },
        {
          viewportWidth: 300,
        },
      ),
    ).toThrow('flex wrap tree layout is not implemented yet')
  })
})
