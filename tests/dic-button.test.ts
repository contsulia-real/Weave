import { describe, expect, it, vi } from 'vitest'
import { resolveButton } from '../src/core/resolved-button'
import { resolveView } from '../src/core/resolved-view'
import { compileDiCButton } from '../src/renderers/dic/compile-button'
import { createDiCInteractionController } from '../src/renderers/dic/interaction'
import { layoutDiCViewTree } from '../src/renderers/dic/layout-tree'
import { resolveDiCViewPaint } from '../src/renderers/dic/resolve-paint'
import {
  defaultBreakpoints,
  defaultTheme,
} from '../src/theme/default-theme'

function layoutButton(
  node: ReturnType<typeof compileDiCButton>,
  viewportWidth = 500,
) {
  return layoutDiCViewTree(
    node,
    {
      width: 300,
      height: 120,
      root: false,
    },
    {
      viewportWidth,
      rem: 16,
      theme: defaultTheme,
    },
  )
}

function pointer(
  type: 'pointerdown' | 'pointerup',
) {
  return {
    type,
    x: 8,
    y: 8,
    pointerId: 1,
    button: 0,
    buttons: type === 'pointerdown' ? 1 : 0,
  } as const
}

describe('DiC Button adapter', () => {
  it('resolves Button defaults and responsive semantic branches', () => {
    const button = resolveButton(
      {
        text: 'Save',
        size: 'small',
        variant: 'secondary',
        md: {
          size: 'large',
          variant: 'danger',
        },
      },
      defaultBreakpoints,
    )

    expect(button).toMatchObject({
      variant: 'secondary',
      size: 'small',
      loading: false,
      disabled: false,
      iconOnly: false,
    })
    expect(button.responsive).toContainEqual({
      name: 'md',
      minWidth: 48,
      size: 'large',
      variant: 'danger',
    })
  })

  it('compiles theme geometry, semantics, and responsive typography', () => {
    const button = resolveButton(
      {
        text: 'Save',
        size: 'small',
        variant: 'secondary',
        md: {
          size: 'large',
          variant: 'danger',
        },
      },
      defaultBreakpoints,
    )
    const node = compileDiCButton(
      resolveView({}, defaultBreakpoints),
      button,
      defaultTheme,
    )

    expect(node.semantics).toMatchObject({
      role: 'button',
      disabled: false,
    })
    expect(node.paint).toMatchObject({
      layout: 'flex',
      direction: 'row',
      align: 'center',
      justify: 'center',
      minHeight: 1.75,
      paddingLeft: 0.625,
      paddingRight: 0.625,
      background: 'surface',
      borderTop: 0.0625,
      borderTopColor: 'outline',
      borderStyle: 'solid',
      radiusTopLeft: 0.75,
      cursor: 'pointer',
      shadow: {
        x: 0,
        y: 0.1875,
        blur: 0,
        spread: 0,
      },
    })
    expect(node.typography?.typo).toBe('label-small')
    expect(node.states.focusVisible).toMatchObject({
      outlineWidth: 0.125,
      outlineColor: 'focus',
      outlineStyle: 'solid',
      outlineOffset: 0.0625,
    })
    expect(node.states.hover?.shadow).toMatchObject({
      y: 0.25,
    })
    expect(node.states.active?.shadow).toMatchObject({
      y: 0.0625,
    })

    expect(
      layoutButton(node, 700).typography?.fontSize,
    ).toBe(12)
    expect(
      layoutButton(node, 900).typography?.fontSize,
    ).toBe(14)

    const responsiveHover = resolveDiCViewPaint(
      node,
      {
        viewportWidth: 900,
        rem: 16,
        state: {
          hover: true,
        },
      },
    )
    expect(responsiveHover.background).toBe(
      defaultTheme.components.Button?.variants?.danger
        ?.hoverBackground,
    )
    expect(responsiveHover.shadow).toMatchObject({
      y: 0.25,
      color:
        defaultTheme.components.Button?.variants?.danger
          ?.depthColor,
    })
  })

  it('keeps icon-only controls square across responsive sizes', () => {
    const button = resolveButton(
      {
        icon: (() => null) as never,
        size: 'small',
        md: {
          size: 'large',
        },
      },
      defaultBreakpoints,
    )
    const node = compileDiCButton(
      resolveView({}, defaultBreakpoints),
      button,
      defaultTheme,
    )

    expect(button.iconOnly).toBe(true)
    expect(node.paint).toMatchObject({
      minHeight: 1.75,
      minWidth: 1.75,
      paddingLeft: 0,
      paddingRight: 0,
    })

    const responsive = node.responsive.find(
      (value) =>
        value.name === 'md' &&
        value.scope === 'viewport',
    )

    expect(responsive?.paint).toMatchObject({
      minHeight: 2.5,
      minWidth: 2.5,
      paddingLeft: 0,
      paddingRight: 0,
    })
    expect(responsive?.typography?.typo).toBe(
      'label-large',
    )
  })

  it('keeps user View state paint above component responsive states', () => {
    const button = resolveButton(
      {
        text: 'Priority',
        variant: 'primary',
        md: {
          variant: 'danger',
        },
        viewProps: {
          background: 'warning',
          hover: {
            background: 'success',
          },
        },
      },
      defaultBreakpoints,
    )
    const view = resolveView(
      button.disabled
        ? {}
        : {
            background: 'warning',
            hover: {
              background: 'success',
            },
          },
      defaultBreakpoints,
    )
    const node = compileDiCButton(
      view,
      button,
      defaultTheme,
    )

    expect(
      resolveDiCViewPaint(
        node,
        {
          viewportWidth: 900,
          rem: 16,
          state: {
            hover: true,
          },
        },
      ).background,
    ).toBe('success')
  })

  it('activates from pointer click, Enter, and Space release', () => {
    const activate = vi.fn()
    const node = compileDiCButton(
      resolveView(
        {
          width: 8,
        },
        defaultBreakpoints,
      ),
      resolveButton(
        {
          text: 'Activate',
        },
        defaultBreakpoints,
      ),
      defaultTheme,
      {
        onActivate: activate,
      },
    )
    const layout = layoutButton(node)
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

    expect(activate).toHaveBeenCalledTimes(1)
    expect(controller.getFocusedNode()).toBe(node)

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

    expect(activate).toHaveBeenCalledTimes(2)

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
    expect(activate).toHaveBeenCalledTimes(2)

    controller.dispatchKeyboard({
      type: 'keyup',
      key: ' ',
      code: 'Space',
      repeat: false,
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
    })

    expect(activate).toHaveBeenCalledTimes(3)
  })

  it('suppresses activation and focus while disabled or loading', () => {
    const activate = vi.fn()
    const button = resolveButton(
      {
        text: 'Loading',
        loading: true,
      },
      defaultBreakpoints,
    )
    const node = compileDiCButton(
      resolveView({}, defaultBreakpoints),
      button,
      defaultTheme,
      {
        onActivate: activate,
      },
    )

    expect(button.disabled).toBe(true)
    expect(node.semantics).toMatchObject({
      disabled: true,
      busy: true,
    })
    expect(node.interaction?.focusable).toBe(false)

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

    expect(activate).not.toHaveBeenCalled()
  })
})
