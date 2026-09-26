import { describe, expect, it, vi } from 'vitest'
import { resolveView } from '../src/core/resolved-view'
import type { ViewProps } from '../src/core/view-types'
import {
  compileDiCView,
  type DiCPointerEvent,
  type DiCViewInteraction,
} from '../src/renderers/dic/compile-view'
import { createDiCInteractionController } from '../src/renderers/dic/interaction'
import { layoutDiCViewTree } from '../src/renderers/dic/layout-tree'
import {
  defaultBreakpoints,
  defaultTheme,
} from '../src/theme/default-theme'

function node(
  props: ViewProps,
  interaction?: DiCViewInteraction,
  children = [] as ReturnType<typeof compileDiCView>[],
) {
  return compileDiCView(
    resolveView(props, defaultBreakpoints),
    {
      interaction,
      children,
    },
  )
}

function pointer(
  type:
    | 'pointermove'
    | 'pointerdown'
    | 'pointerup'
    | 'pointercancel'
    | 'pointerleave',
  x: number,
  y: number,
) {
  return {
    type,
    x,
    y,
    pointerId: 1,
    button: 0,
    buttons:
      type === 'pointerdown' ||
      type === 'pointermove'
        ? 1
        : 0,
  } as const
}

describe('DiC interaction controller', () => {
  it('tracks hover, active, focus, click, and keyboard focus-visible', () => {
    const calls: string[] = []

    const child = node(
      {
        width: 4,
        height: 3,
      },
      {
        focusable: true,
        onPointerEnter: () => calls.push('enter-child'),
        onPointerDown: () => calls.push('down-child'),
        onPointerUp: () => calls.push('up-child'),
        onClick: () => calls.push('click-child'),
        onFocus: () => calls.push('focus-child'),
        onKeyDown: (event) => {
          calls.push(`key-${event.key}`)
        },
      },
    )
    const root = node(
      {
        layout: 'stack',
        width: 10,
        height: 8,
      },
      {
        onPointerEnter: () => calls.push('enter-root'),
        onPointerDown: () => calls.push('down-root'),
        onPointerUp: () => calls.push('up-root'),
        onClick: () => calls.push('click-root'),
      },
      [child],
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
    const invalidate = vi.fn()
    const controller = createDiCInteractionController({
      getLayout: () => layout,
      invalidate,
    })

    controller.dispatchPointer(
      pointer('pointermove', 20, 20),
    )

    expect(calls).toEqual([
      'enter-root',
      'enter-child',
    ])
    expect(
      controller.stateForNode(root).hover,
    ).toBe(true)
    expect(
      controller.stateForNode(child).hover,
    ).toBe(true)

    controller.dispatchPointer(
      pointer('pointerdown', 20, 20),
    )

    expect(calls).toContain('down-child')
    expect(calls).toContain('down-root')
    expect(calls).toContain('focus-child')
    expect(controller.getFocusedNode()).toBe(child)
    expect(
      controller.stateForNode(child).active,
    ).toBe(true)
    expect(
      controller.stateForNode(child).focusVisible,
    ).toBe(false)

    controller.dispatchPointer(
      pointer('pointerup', 20, 20),
    )

    expect(calls).toContain('up-child')
    expect(calls).toContain('up-root')
    expect(calls).toContain('click-child')
    expect(calls).toContain('click-root')
    expect(
      controller.stateForNode(child).active,
    ).toBe(false)

    controller.dispatchKeyboard({
      type: 'keydown',
      key: 'Enter',
      code: 'Enter',
      repeat: false,
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
    })

    expect(calls).toContain('key-Enter')
    expect(
      controller.stateForNode(child).focusVisible,
    ).toBe(true)
    expect(invalidate).toHaveBeenCalled()
  })

  it('exposes renderer-neutral public event targets through DiC bubbling', () => {
    const childClick = vi.fn()
    const rootClick = vi.fn()

    const child = node({
      id: 'child',
      width: 4,
      height: 3,
      onClick: childClick,
    })
    const root = node(
      {
        id: 'root',
        layout: 'stack',
        width: 10,
        height: 8,
        onClick: rootClick,
      },
      undefined,
      [child],
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
      ...pointer('pointerdown', 20, 20),
      clientX: 120,
      clientY: 80,
      pointerType: 'pen',
      isPrimary: true,
      pressure: 0.4,
    })
    controller.dispatchPointer({
      ...pointer('pointerup', 20, 20),
      clientX: 120,
      clientY: 80,
      pointerType: 'pen',
      isPrimary: true,
      pressure: 0,
    })

    expect(childClick).toHaveBeenCalledTimes(1)
    expect(rootClick).toHaveBeenCalledTimes(1)

    expect(childClick.mock.calls[0]?.[0]).toMatchObject({
      type: 'click',
      target: {
        id: 'child',
      },
      currentTarget: {
        id: 'child',
      },
      clientX: 120,
      clientY: 80,
    })
    expect(rootClick.mock.calls[0]?.[0]).toMatchObject({
      type: 'click',
      target: {
        id: 'child',
      },
      currentTarget: {
        id: 'root',
      },
      clientX: 120,
      clientY: 80,
    })
  })

  it('supports bubbling control and pointer capture', () => {
    const rootDown = vi.fn()
    const move = vi.fn()
    const capture = vi.fn()
    const release = vi.fn()

    const child = node(
      {
        width: 4,
        height: 3,
      },
      {
        onPointerDown: (event: DiCPointerEvent) => {
          event.stopPropagation()
          event.capturePointer()
        },
        onPointerMove: move,
      },
    )
    const root = node(
      {
        layout: 'stack',
        width: 10,
        height: 8,
      },
      {
        onPointerDown: rootDown,
      },
      [child],
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
      ...pointer('pointerdown', 20, 20),
      capture,
      release,
    })

    expect(rootDown).not.toHaveBeenCalled()
    expect(capture).toHaveBeenCalledWith(1)

    controller.dispatchPointer({
      ...pointer('pointermove', 180, 120),
      capture,
      release,
    })

    expect(move).toHaveBeenCalledTimes(1)

    controller.dispatchPointer({
      ...pointer('pointerup', 180, 120),
      capture,
      release,
    })

    expect(release).toHaveBeenCalledWith(1)
  })

  it('derives autoFocus from ResolvedView and reconciles stale focus after tree replacement', () => {
    const first = node({
      width: 4,
      height: 3,
      autoFocus: true,
    })
    const second = node({
      width: 4,
      height: 3,
    })

    expect(first.interaction).toMatchObject({
      focusable: true,
      autoFocus: true,
    })

    let currentLayout = layoutDiCViewTree(
      first,
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
      getLayout: () => currentLayout,
      invalidate: vi.fn(),
    })

    controller.reconcile()
    expect(controller.getFocusedNode()).toBe(first)

    currentLayout = layoutDiCViewTree(
      second,
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

    controller.reconcile()
    expect(controller.getFocusedNode()).toBeUndefined()
  })

  it('marks semantic disabled state without suppressing generic View events', () => {
    const down = vi.fn()
    const disabled = node(
      {
        width: 4,
        height: 3,
        disabled: true,
      },
      {
        onPointerDown: down,
      },
    )

    const layout = layoutDiCViewTree(
      disabled,
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

    expect(
      controller.stateForNode(disabled).disabled,
    ).toBe(true)

    controller.dispatchPointer(
      pointer('pointerdown', 20, 20),
    )

    expect(down).toHaveBeenCalledTimes(1)
  })
})
