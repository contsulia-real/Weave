import { describe, expect, it, vi } from 'vitest'
import { resolveSwitch } from '../src/core/resolved-switch'
import { resolveView } from '../src/core/resolved-view'
import { compileDiCSwitch } from '../src/renderers/dic/compile-switch'
import { createDiCInteractionController } from '../src/renderers/dic/interaction'
import { layoutDiCViewTree } from '../src/renderers/dic/layout-tree'
import { resolveDiCViewPaint } from '../src/renderers/dic/resolve-paint'
import {
  defaultBreakpoints,
  defaultTheme,
} from '../src/theme/default-theme'

function pointer(
  type: 'pointerdown' | 'pointerup',
) {
  return {
    type,
    x: 10,
    y: 10,
    pointerId: 1,
    button: 0,
    buttons: type === 'pointerdown' ? 1 : 0,
  } as const
}

describe('DiC Switch adapter', () => {
  it('resolves current value, size, and disabled state', () => {
    expect(
      resolveSwitch({
        checked: true,
      }),
    ).toEqual({
      size: 'medium',
      checked: true,
      disabled: false,
    })

    expect(
      resolveSwitch({
        size: 'large',
        checked: false,
        disabled: true,
      }),
    ).toEqual({
      size: 'large',
      checked: false,
      disabled: true,
    })
  })

  it('compiles switch semantics, track geometry, and checked thumb position', () => {
    const value = resolveSwitch({
      checked: true,
    })
    const node = compileDiCSwitch(
      resolveView({}, defaultBreakpoints),
      value,
      defaultTheme,
    )

    expect(node.semantics).toMatchObject({
      role: 'switch',
      checked: true,
      disabled: false,
    })
    expect(node.paint).toMatchObject({
      layout: 'stack',
      width: 2.5,
      height: 1.5,
      background: 'primary',
      radiusTopLeft: 'full',
      cursor: 'pointer',
    })
    expect(node.states.focusVisible).toMatchObject({
      outlineWidth: 0.125,
      outlineColor: 'focus',
      outlineStyle: 'solid',
      outlineOffset: 0.0625,
    })
    expect(node.children).toHaveLength(1)
    expect(node.children[0]?.paint).toMatchObject({
      width: 1.25,
      height: 1.25,
      background: 'surface',
      radiusTopLeft: 'full',
      pointerEvents: 'auto',
      transform: [
        {
          translate: [
            '18px',
            '2px',
          ],
        },
      ],
    })
  })

  it('toggles from pointer click and keyboard activation', () => {
    const onChange = vi.fn()
    const node = compileDiCSwitch(
      resolveView({}, defaultBreakpoints),
      resolveSwitch({
        checked: false,
      }),
      defaultTheme,
      {
        onChange,
      },
    )
    const layout = layoutDiCViewTree(
      node,
      {
        width: 100,
        height: 100,
        root: false,
      },
      {
        viewportWidth: 100,
        rem: 16,
        theme: defaultTheme,
      },
    )
    const controller = createDiCInteractionController({
      getLayout: () => layout,
      invalidate: vi.fn(),
    })

    controller.dispatchPointer(
      pointer('pointerdown'),
    )
    controller.dispatchPointer(
      pointer('pointerup'),
    )

    expect(onChange).toHaveBeenLastCalledWith(true)
    expect(controller.getFocusedNode()).toBe(node)

    controller.dispatchKeyboard({
      type: 'keydown',
      key: ' ',
      code: 'Space',
      repeat: false,
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
    })

    expect(onChange).toHaveBeenLastCalledWith(true)

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

    expect(onChange).toHaveBeenCalledTimes(3)
  })

  it('lets public View events cancel Switch default toggle', () => {
    const onChange = vi.fn()
    const onClick = vi.fn((event) => {
      event.preventDefault()
    })
    const node = compileDiCSwitch(
      resolveView(
        {
          id: 'switch',
          onClick,
        },
        defaultBreakpoints,
      ),
      resolveSwitch({
        checked: false,
      }),
      defaultTheme,
      {
        onChange,
      },
    )
    const layout = layoutDiCViewTree(
      node,
      {
        width: 100,
        height: 100,
        root: false,
      },
      {
        viewportWidth: 100,
        rem: 16,
        theme: defaultTheme,
      },
    )
    const controller = createDiCInteractionController({
      getLayout: () => layout,
      invalidate: vi.fn(),
    })

    controller.dispatchPointer(
      pointer('pointerdown'),
    )
    controller.dispatchPointer(
      pointer('pointerup'),
    )

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onChange).not.toHaveBeenCalled()
    expect(onClick.mock.calls[0]?.[0]).toMatchObject({
      currentTarget: {
        id: 'switch',
      },
      defaultPrevented: true,
    })
  })

  it('drags the thumb without layout reads and commits once past midpoint', () => {
    const onChange = vi.fn()
    const invalidate = vi.fn()
    const capture = vi.fn()
    const release = vi.fn()
    const node = compileDiCSwitch(
      resolveView({}, defaultBreakpoints),
      resolveSwitch({
        checked: false,
      }),
      defaultTheme,
      {
        onChange,
      },
    )
    const layout = layoutDiCViewTree(
      node,
      {
        width: 100,
        height: 100,
        root: false,
      },
      {
        viewportWidth: 100,
        rem: 16,
        theme: defaultTheme,
      },
    )
    const controller = createDiCInteractionController({
      getLayout: () => layout,
      invalidate,
    })
    const thumb = node.children[0]

    controller.dispatchPointer({
      type: 'pointerdown',
      x: 10,
      y: 10,
      pointerId: 7,
      button: 0,
      buttons: 1,
      capture,
      release,
    })

    expect(capture).toHaveBeenCalledWith(7)
    expect(thumb?.paint.width).toBe('13.6px')
    expect(thumb?.paint.height).toBe('13.6px')

    controller.dispatchPointer({
      type: 'pointermove',
      x: 30,
      y: 10,
      pointerId: 7,
      button: 0,
      buttons: 1,
      capture,
      release,
    })

    expect(thumb?.paint.width).toBe('27px')
    expect(thumb?.paint.height).toBe('13.6px')
    expect(invalidate).toHaveBeenCalled()

    controller.dispatchPointer({
      type: 'pointerup',
      x: 30,
      y: 10,
      pointerId: 7,
      button: 0,
      buttons: 0,
      capture,
      release,
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(true)
    expect(release).toHaveBeenCalledTimes(1)
    expect(thumb?.paint).toMatchObject({
      width: 1.25,
      height: 1.25,
      transform: [
        {
          translate: [
            '2px',
            '2px',
          ],
        },
      ],
    })
  })

  it('suppresses toggle while disabled and resolves disabled visuals', () => {
    const onChange = vi.fn()
    const node = compileDiCSwitch(
      resolveView({}, defaultBreakpoints),
      resolveSwitch({
        checked: false,
        disabled: true,
      }),
      defaultTheme,
      {
        onChange,
      },
    )

    node.interaction?.onClick?.({
      type: 'click',
      pointerId: 1,
      button: 0,
      buttons: 0,
      x: 0,
      y: 0,
      target: node,
      currentTarget: node,
      defaultPrevented: false,
      propagationStopped: false,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      capturePointer: vi.fn(),
      releasePointer: vi.fn(),
      requestRender: vi.fn(),
    })

    expect(onChange).not.toHaveBeenCalled()
    expect(
      resolveDiCViewPaint(
        node,
        {
          viewportWidth: 100,
          rem: 16,
          state: {
            disabled: true,
          },
        },
      ).opacity,
    ).toBe(0.5)
  })

  it('keeps explicit View background above checked component fill', () => {
    const node = compileDiCSwitch(
      resolveView(
        {
          background: 'success',
        },
        defaultBreakpoints,
      ),
      resolveSwitch({
        checked: true,
      }),
      defaultTheme,
    )

    expect(node.paint.background).toBe('success')
  })
})
