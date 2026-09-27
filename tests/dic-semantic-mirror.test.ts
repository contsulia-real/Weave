import { afterEach, describe, expect, it, vi } from 'vitest'
import { resolveButton } from '../src/core/resolved-button'
import { resolveImage } from '../src/core/resolved-image'
import { resolveSwitch } from '../src/core/resolved-switch'
import { resolveText } from '../src/core/resolved-text'
import { resolveView } from '../src/core/resolved-view'
import { compileDiCButton } from '../src/renderers/dic/compile-button'
import { compileDiCImage } from '../src/renderers/dic/compile-image'
import { compileDiCSwitch } from '../src/renderers/dic/compile-switch'
import { compileDiCText } from '../src/renderers/dic/compile-text'
import { compileDiCView } from '../src/renderers/dic/compile-view'
import { createDiCInteractionController } from '../src/renderers/dic/interaction'
import { layoutDiCViewTree } from '../src/renderers/dic/layout-tree'
import { createDiCSemanticMirror } from '../src/renderers/dic/semantic-mirror'
import {
  defaultBreakpoints,
  defaultTheme,
} from '../src/theme/default-theme'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('DiC semantic mirror', () => {
  it('mirrors roles, accessible names, state, text, and local id references', () => {
    const activate = vi.fn()
    const toggle = vi.fn()

    const label = compileDiCText(
      resolveView(
        {
          id: 'switch-label',
        },
        defaultBreakpoints,
      ),
      resolveText({}, defaultBreakpoints),
      'Notifications',
    )
    const button = compileDiCButton(
      resolveView(
        {
          id: 'save',
        },
        defaultBreakpoints,
      ),
      resolveButton(
        {
          text: 'Save',
        },
        defaultBreakpoints,
      ),
      defaultTheme,
      {
        onActivate: activate,
      },
    )
    const switchNode = compileDiCSwitch(
      resolveView(
        {
          id: 'notifications',
          labelledBy: 'switch-label',
        },
        defaultBreakpoints,
      ),
      resolveSwitch({
        checked: false,
      }),
      defaultTheme,
      {
        onChange: toggle,
      },
    )
    const root = compileDiCView(
      resolveView(
        {
          role: 'group',
          label: 'Settings',
          layout: 'flex',
          direction: 'column',
          width: 20,
          height: 20,
        },
        defaultBreakpoints,
      ),
      {
        children: [
          label,
          button,
          switchNode,
        ],
      },
    )
    const layout = layoutDiCViewTree(
      root,
      {
        width: 400,
        height: 400,
      },
      {
        viewportWidth: 400,
        rem: 16,
        theme: defaultTheme,
        context: {
          font: '',
          textBaseline: 'top',
          measureText: (value: string) => ({
            width: value.length * 8,
          }),
        } as unknown as CanvasRenderingContext2D,
      },
    )
    const controller = createDiCInteractionController({
      getLayout: () => layout,
      invalidate: vi.fn(),
    })

    const host = document.createElement('div')
    const canvas = document.createElement('canvas')
    host.appendChild(canvas)
    document.body.appendChild(host)

    const mirror = createDiCSemanticMirror(
      canvas,
      controller,
    )
    mirror.update(root)

    const rootElement = mirror.getElement(root)
    const labelElement = mirror.getElement(label)
    const buttonElement = mirror.getElement(button)
    const switchElement = mirror.getElement(switchNode)

    expect(rootElement?.getAttribute('role')).toBe('group')
    expect(rootElement?.getAttribute('aria-label')).toBe('Settings')

    expect(labelElement?.textContent).toBe('Notifications')
    expect(labelElement?.id).not.toBe('switch-label')
    expect(
      labelElement?.getAttribute(
        'data-weave-logical-id',
      ),
    ).toBe('switch-label')

    expect(buttonElement).toMatchObject({
      tabIndex: 0,
    })
    expect(buttonElement?.getAttribute('role')).toBe('button')
    expect(buttonElement?.getAttribute('aria-label')).toBe('Save')

    expect(switchElement).toMatchObject({
      tabIndex: 0,
    })
    expect(switchElement?.getAttribute('role')).toBe('switch')
    expect(switchElement?.getAttribute('aria-checked')).toBe('false')
    expect(
      switchElement?.getAttribute(
        'aria-labelledby',
      ),
    ).toBe(labelElement?.id)

    mirror.destroy()
    expect(
      host.querySelector(
        '[data-weave-dic-semantic-root]',
      ),
    ).toBeNull()
  })

  it('exposes Image alt text through the semantic mirror', () => {
    const image = compileDiCImage(
      resolveView(
        {
          width: 4,
          height: 3,
        },
        defaultBreakpoints,
      ),
      resolveImage({
        src: '/cover.webp',
        alt: 'Album cover',
      }),
    )
    const controller = createDiCInteractionController({
      getLayout: () => undefined,
      invalidate: vi.fn(),
    })

    const host = document.createElement('div')
    const canvas = document.createElement('canvas')
    host.appendChild(canvas)
    document.body.appendChild(host)

    const mirror = createDiCSemanticMirror(
      canvas,
      controller,
    )
    mirror.update(image)

    const element = mirror.getElement(image)
    expect(element?.getAttribute('role')).toBe('img')
    expect(element?.getAttribute('aria-label')).toBe(
      'Album cover',
    )
  })

  it('uses native DOM focus order while keeping DiC focus state authoritative', () => {
    const first = compileDiCButton(
      resolveView(
        {
          id: 'first',
        },
        defaultBreakpoints,
      ),
      resolveButton(
        {
          text: 'First',
        },
        defaultBreakpoints,
      ),
      defaultTheme,
    )
    const second = compileDiCButton(
      resolveView(
        {
          id: 'second',
          tabIndex: 3,
        },
        defaultBreakpoints,
      ),
      resolveButton(
        {
          text: 'Second',
        },
        defaultBreakpoints,
      ),
      defaultTheme,
    )
    const root = compileDiCView(
      resolveView(
        {
          layout: 'flex',
          width: 20,
          height: 10,
        },
        defaultBreakpoints,
      ),
      {
        children: [first, second],
      },
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
    const controller = createDiCInteractionController({
      getLayout: () => layout,
      invalidate: vi.fn(),
    })

    const host = document.createElement('div')
    const canvas = document.createElement('canvas')
    host.appendChild(canvas)
    document.body.appendChild(host)

    const mirror = createDiCSemanticMirror(
      canvas,
      controller,
    )
    mirror.update(root)

    expect(mirror.getElement(first)?.tabIndex).toBe(0)
    expect(mirror.getElement(second)?.tabIndex).toBe(3)

    expect(
      mirror.focusNode(
        first,
        false,
      ),
    ).toBe(true)
    expect(controller.getFocusedNode()).toBe(first)
    expect(
      controller.stateForNode(first).focusVisible,
    ).toBe(false)

    mirror.getElement(second)?.focus()

    expect(controller.getFocusedNode()).toBe(second)
    expect(
      controller.stateForNode(second).focusVisible,
    ).toBe(true)
  })

  it('routes semantic click and keyboard activation through the same component adapters', () => {
    const activate = vi.fn()
    const onChange = vi.fn()

    const button = compileDiCButton(
      resolveView({}, defaultBreakpoints),
      resolveButton(
        {
          text: 'Run',
        },
        defaultBreakpoints,
      ),
      defaultTheme,
      {
        onActivate: activate,
      },
    )
    const switchNode = compileDiCSwitch(
      resolveView(
        {
          label: 'Enabled',
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
    const root = compileDiCView(
      resolveView(
        {
          layout: 'flex',
          width: 20,
          height: 10,
        },
        defaultBreakpoints,
      ),
      {
        children: [
          button,
          switchNode,
        ],
      },
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
    const controller = createDiCInteractionController({
      getLayout: () => layout,
      invalidate: vi.fn(),
    })

    const host = document.createElement('div')
    const canvas = document.createElement('canvas')
    host.appendChild(canvas)
    document.body.appendChild(host)

    const mirror = createDiCSemanticMirror(
      canvas,
      controller,
    )
    mirror.update(root)

    mirror.getElement(button)?.dispatchEvent(
      new MouseEvent(
        'click',
        {
          bubbles: true,
          cancelable: true,
        },
      ),
    )

    expect(activate).toHaveBeenCalledTimes(1)

    const switchElement =
      mirror.getElement(switchNode)
    switchElement?.focus()
    switchElement?.dispatchEvent(
      new KeyboardEvent(
        'keydown',
        {
          key: ' ',
          code: 'Space',
          bubbles: true,
          cancelable: true,
        },
      ),
    )

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(true)
  })
})
