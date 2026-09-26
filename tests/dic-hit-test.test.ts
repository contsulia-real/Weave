import { describe, expect, it } from 'vitest'
import { resolveView } from '../src/core/resolved-view'
import type { ViewProps } from '../src/core/view-types'
import { compileDiCView } from '../src/renderers/dic/compile-view'
import {
  cursorForDiCHit,
  hitTestDiCViewTree,
} from '../src/renderers/dic/hit-test'
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

describe('DiC hit testing', () => {
  it('uses reverse draw order for overlapping descendants', () => {
    const first = node({
      width: 4,
      height: 4,
      cursor: 'pointer',
    })
    const second = node({
      width: 4,
      height: 4,
      cursor: 'crosshair',
    })
    const root = node(
      {
        layout: 'stack',
        width: 10,
        height: 10,
      },
      [first, second],
    )

    const layout = layoutDiCViewTree(
      root,
      {
        width: 200,
        height: 200,
      },
      {
        viewportWidth: 200,
        rem: 16,
        theme: defaultTheme,
      },
    )

    const hit = hitTestDiCViewTree(
      layout,
      {
        x: 20,
        y: 20,
      },
      16,
    )

    expect(hit?.target).toBe(second)
    expect(hit?.path).toEqual([
      root,
      second,
    ])
    expect(cursorForDiCHit(hit)).toBe('crosshair')
  })

  it('inverse-transforms pointer coordinates before testing a View', () => {
    const child = node({
      width: 4,
      height: 4,
      translateX: 5,
      scale: 2,
    })
    const root = node(
      {
        layout: 'stack',
        width: 20,
        height: 10,
      },
      [child],
    )

    const layout = layoutDiCViewTree(
      root,
      {
        width: 400,
        height: 200,
      },
      {
        viewportWidth: 400,
        rem: 16,
        theme: defaultTheme,
      },
    )

    expect(
      hitTestDiCViewTree(
        layout,
        {
          x: 100,
          y: 32,
        },
        16,
      )?.target,
    ).toBe(child)

    expect(
      hitTestDiCViewTree(
        layout,
        {
          x: 10,
          y: 32,
        },
        16,
      )?.target,
    ).toBe(root)
  })

  it('inherits pointerEvents none but lets a child explicitly restore auto', () => {
    const inheritedNone = node({
      width: 3,
      height: 3,
    })
    const restored = node({
      width: 3,
      height: 3,
      pointerEvents: 'auto',
    })
    const blocked = node(
      {
        layout: 'stack',
        width: 8,
        height: 8,
        pointerEvents: 'none',
      },
      [inheritedNone, restored],
    )
    const root = node(
      {
        layout: 'stack',
        width: 12,
        height: 12,
      },
      [blocked],
    )

    const layout = layoutDiCViewTree(
      root,
      {
        width: 300,
        height: 300,
      },
      {
        viewportWidth: 300,
        rem: 16,
        theme: defaultTheme,
      },
    )

    expect(
      hitTestDiCViewTree(
        layout,
        {
          x: 20,
          y: 20,
        },
        16,
      )?.target,
    ).toBe(restored)
  })
})
