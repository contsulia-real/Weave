import { describe, expect, it, vi } from 'vitest'
import { resolveView } from '../src/core/resolved-view'
import { compileDiCView } from '../src/renderers/dic/compile-view'
import { createDiCInteractionController } from '../src/renderers/dic/interaction'
import { layoutDiCViewTree } from '../src/renderers/dic/layout-tree'
import {
  defaultBreakpoints,
  defaultTheme,
} from '../src/theme/default-theme'

describe('DiC public View events', () => {
  it('exposes the same renderer-neutral target/currentTarget and preventDefault state', () => {
    const childHandler = vi.fn()
    const parentHandler = vi.fn()

    const child = compileDiCView(
      resolveView(
        {
          id: 'child',
          width: 4,
          height: 4,
          onPointerDown: (event) => {
            childHandler(event)
            event.preventDefault()
          },
        },
        defaultBreakpoints,
      ),
    )
    const parent = compileDiCView(
      resolveView(
        {
          id: 'parent',
          layout: 'stack',
          width: 10,
          height: 10,
          onPointerDown: parentHandler,
        },
        defaultBreakpoints,
      ),
      {
        children: [child],
      },
    )

    const layout = layoutDiCViewTree(
      parent,
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
    const controller = createDiCInteractionController({
      getLayout: () => layout,
      invalidate: vi.fn(),
    })

    const result = controller.dispatchPointer({
      type: 'pointerdown',
      x: 20,
      y: 20,
      clientX: 120,
      clientY: 220,
      pointerId: 5,
      pointerType: 'pen',
      isPrimary: true,
      pressure: 0.75,
      button: 0,
      buttons: 1,
      altKey: true,
      ctrlKey: false,
      metaKey: false,
      shiftKey: true,
    })

    expect(result.defaultPrevented).toBe(true)
    expect(childHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'pointerdown',
        target: {
          id: 'child',
        },
        currentTarget: {
          id: 'child',
        },
        pointerId: 5,
        pointerType: 'pen',
        isPrimary: true,
        pressure: 0.75,
        clientX: 120,
        clientY: 220,
        altKey: true,
        shiftKey: true,
      }),
    )
    expect(parentHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        target: {
          id: 'child',
        },
        currentTarget: {
          id: 'parent',
        },
        defaultPrevented: true,
      }),
    )
  })

  it('bridges public pointer capture through the DiC controller', () => {
    const capture = vi.fn()
    const release = vi.fn()
    const move = vi.fn()

    const child = compileDiCView(
      resolveView(
        {
          width: 4,
          height: 4,
          onPointerDown: (event) => {
            event.capturePointer()
          },
          onPointerMove: move,
          onPointerUp: (event) => {
            event.releasePointer()
          },
        },
        defaultBreakpoints,
      ),
    )
    const root = compileDiCView(
      resolveView(
        {
          layout: 'stack',
          width: 10,
          height: 10,
        },
        defaultBreakpoints,
      ),
      {
        children: [child],
      },
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
    const controller = createDiCInteractionController({
      getLayout: () => layout,
      invalidate: vi.fn(),
    })

    controller.dispatchPointer({
      type: 'pointerdown',
      x: 20,
      y: 20,
      pointerId: 11,
      button: 0,
      buttons: 1,
      capture,
      release,
    })

    controller.dispatchPointer({
      type: 'pointermove',
      x: 180,
      y: 180,
      pointerId: 11,
      button: 0,
      buttons: 1,
      capture,
      release,
    })

    controller.dispatchPointer({
      type: 'pointerup',
      x: 180,
      y: 180,
      pointerId: 11,
      button: 0,
      buttons: 0,
      capture,
      release,
    })

    expect(capture).toHaveBeenCalledWith(11)
    expect(move).toHaveBeenCalledTimes(1)
    expect(release).toHaveBeenCalledTimes(1)
    expect(release).toHaveBeenCalledWith(11)
  })

  it('bubbles focus with the focused target preserved', () => {
    const parentFocus = vi.fn()
    const childFocus = vi.fn()

    const child = compileDiCView(
      resolveView(
        {
          id: 'child',
          width: 4,
          height: 4,
          focusable: true,
          onFocus: childFocus,
        },
        defaultBreakpoints,
      ),
    )
    const parent = compileDiCView(
      resolveView(
        {
          id: 'parent',
          layout: 'stack',
          width: 10,
          height: 10,
          onFocus: parentFocus,
        },
        defaultBreakpoints,
      ),
      {
        children: [child],
      },
    )

    const layout = layoutDiCViewTree(
      parent,
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
    const controller = createDiCInteractionController({
      getLayout: () => layout,
      invalidate: vi.fn(),
    })

    controller.dispatchPointer({
      type: 'pointerdown',
      x: 20,
      y: 20,
      pointerId: 1,
      button: 0,
      buttons: 1,
    })

    expect(childFocus).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'focus',
        target: {
          id: 'child',
        },
        currentTarget: {
          id: 'child',
        },
      }),
    )
    expect(parentFocus).toHaveBeenCalledWith(
      expect.objectContaining({
        target: {
          id: 'child',
        },
        currentTarget: {
          id: 'parent',
        },
      }),
    )
  })
})
