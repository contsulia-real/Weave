import {
  createElement,
} from 'react'
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { Input } from '../src/components/Input'
import { resolveInput } from '../src/core/resolved-input'
import { resolveView } from '../src/core/resolved-view'
import { compileDiCInput } from '../src/renderers/dic/compile-input'
import { drawDiCInput } from '../src/renderers/dic/draw-input'
import { createDiCInteractionController } from '../src/renderers/dic/interaction'
import { layoutDiCViewTree } from '../src/renderers/dic/layout-tree'
import { createDiCReactRoot } from '../src/renderers/dic/react-reconciler'
import { createDiCSemanticMirror } from '../src/renderers/dic/semantic-mirror'
import { createRootDiCTypography } from '../src/renderers/dic/text-style'
import {
  defaultBreakpoints,
  defaultTheme,
} from '../src/theme/default-theme'

afterEach(() => {
  document.body.innerHTML = ''
})

function textContext() {
  let font = ''
  const fillText = vi.fn()

  const context = {
    globalAlpha: 1,
    fillStyle: '',
    textBaseline: 'top',
    get font() {
      return font
    },
    set font(value: string) {
      font = value
    },
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    fillRect: vi.fn(),
    fillText,
    measureText: vi.fn((value: string) => ({
      width:
        Array.from(value).length * 8,
    })),
  } as unknown as CanvasRenderingContext2D

  return {
    context,
    fillText,
  }
}

describe('DiC Input', () => {
  it('compiles Input theme, semantics, typography, and editing content', () => {
    const input = resolveInput({
      placeholder: 'Name',
      required: true,
      viewProps: {
        id: 'name',
      },
    })
    const node = compileDiCInput(
      resolveView(
        {
          id: 'name',
        },
        defaultBreakpoints,
      ),
      input,
      defaultTheme,
      'Ada',
      vi.fn(),
    )

    expect(node.paint).toMatchObject({
      minHeight: 2.5,
      paddingTop: 0.625,
      paddingRight: 0.875,
      background: 'surface',
      borderTop: 0.0625,
      borderTopColor: 'outline',
      borderStyle: 'solid',
      radiusTopLeft: 0.75,
      cursor: 'text',
    })
    expect(node.typography?.typo).toBe(
      'body-large',
    )
    expect(node.semantics).toMatchObject({
      required: true,
      disabled: false,
      readOnly: false,
    })
    expect(node.interaction?.focusable).toBe(
      true,
    )
    expect(node.content).toMatchObject({
      kind: 'input',
      value: 'Ada',
      selectionStart: 3,
      selectionEnd: 3,
      focused: false,
    })
    expect(node.states.focusVisible).toMatchObject({
      borderTopColor: 'focus',
      outlineWidth: 0.125,
      outlineColor: 'focus',
    })
  })

  it('draws placeholder and masks password values without changing the source value', () => {
    const {
      context,
      fillText,
    } = textContext()
    const typography =
      createRootDiCTypography(
        defaultTheme,
        16,
      )

    drawDiCInput(
      context,
      {
        kind: 'input',
        input: resolveInput({
          placeholder: 'Password',
          type: 'password',
        }),
        value: '',
      },
      {
        x: 0,
        y: 0,
        width: 160,
        height: 40,
      },
      {
        theme: defaultTheme,
        typography,
      },
    )

    expect(fillText).toHaveBeenCalledWith(
      'Password',
      0,
      expect.any(Number),
    )

    fillText.mockClear()

    const content = {
      kind: 'input' as const,
      input: resolveInput({
        type: 'password',
      }),
      value: 'secret',
    }

    drawDiCInput(
      context,
      content,
      {
        x: 0,
        y: 0,
        width: 160,
        height: 40,
      },
      {
        theme: defaultTheme,
        typography,
      },
    )

    expect(fillText).toHaveBeenCalledWith(
      '••••••',
      0,
      expect.any(Number),
    )
    expect(content.value).toBe('secret')
  })

  it('uses a native editor for value, selection, scrolling, focus, and IME-capable input events', () => {
    const onChange = vi.fn()
    const invalidate = vi.fn()
    const { context } =
      textContext()
    const node = compileDiCInput(
      resolveView(
        {
          id: 'field',
          width: 12,
        },
        defaultBreakpoints,
      ),
      resolveInput({
        placeholder: 'Type',
        name: 'query',
        autoComplete: 'off',
        minLength: 2,
        maxLength: 20,
      }),
      defaultTheme,
      'ab',
      onChange,
    )
    const layout = layoutDiCViewTree(
      node,
      {
        width: 300,
        height: 100,
      },
      {
        viewportWidth: 300,
        rem: 16,
        theme: defaultTheme,
        context,
      },
    )
    const controller =
      createDiCInteractionController({
        getLayout: () => layout,
        invalidate,
      })

    const host =
      document.createElement('div')
    const canvas =
      document.createElement('canvas')
    host.appendChild(canvas)
    document.body.appendChild(host)

    const mirror =
      createDiCSemanticMirror(
        canvas,
        controller,
        invalidate,
      )
    mirror.update(
      node,
      layout,
    )

    const editor =
      mirror.getElement(node)

    expect(editor).toBeInstanceOf(
      HTMLInputElement,
    )

    const input =
      editor as HTMLInputElement

    expect(input.value).toBe('ab')
    expect(input.placeholder).toBe('Type')
    expect(input.name).toBe('query')
    expect(input.autocomplete).toBe('off')
    expect(
      input.getAttribute('minlength'),
    ).toBe('2')
    expect(
      input.getAttribute('maxlength'),
    ).toBe('20')
    expect(input.style.width).toBe(
      `${layout.contentFrame.width}px`,
    )

    input.focus()
    expect(
      node.content?.kind === 'input'
        ? node.content.focused
        : undefined,
    ).toBe(true)

    input.value = 'abcd'
    input.setSelectionRange(1, 3)
    input.dispatchEvent(
      new Event(
        'input',
        {
          bubbles: true,
        },
      ),
    )

    expect(onChange).toHaveBeenCalledWith(
      'abcd',
    )
    expect(node.content).toMatchObject({
      kind: 'input',
      value: 'abcd',
      selectionStart: 1,
      selectionEnd: 3,
      focused: true,
    })

    input.scrollLeft = 7
    input.dispatchEvent(
      new Event('scroll'),
    )

    expect(
      node.content?.kind === 'input'
        ? node.content.scrollLeft
        : undefined,
    ).toBe(7)
    expect(invalidate).toHaveBeenCalled()

    input.blur()
    expect(
      node.content?.kind === 'input'
        ? node.content.focused
        : undefined,
    ).toBe(false)

    mirror.destroy()
  })

  it('creates textarea semantics for multiline Input', () => {
    const { context } =
      textContext()
    const node = compileDiCInput(
      resolveView(
        {
          width: 12,
          height: 6,
        },
        defaultBreakpoints,
      ),
      resolveInput({
        multiline: true,
        rows: 4,
        placeholder: 'Notes',
      }),
      defaultTheme,
      'one\ntwo',
    )
    const layout = layoutDiCViewTree(
      node,
      {
        width: 300,
        height: 200,
      },
      {
        viewportWidth: 300,
        rem: 16,
        theme: defaultTheme,
        context,
      },
    )
    const controller =
      createDiCInteractionController({
        getLayout: () => layout,
        invalidate: vi.fn(),
      })
    const host =
      document.createElement('div')
    const canvas =
      document.createElement('canvas')
    host.appendChild(canvas)
    document.body.appendChild(host)

    const mirror =
      createDiCSemanticMirror(
        canvas,
        controller,
      )
    mirror.update(
      node,
      layout,
    )

    const editor =
      mirror.getElement(node)

    expect(editor).toBeInstanceOf(
      HTMLTextAreaElement,
    )
    expect(
      (editor as HTMLTextAreaElement).rows,
    ).toBe(4)
    expect(
      (editor as HTMLTextAreaElement).value,
    ).toBe('one\ntwo')
  })

  it('preserves DiC node and native editor identity across controlled React updates', () => {
    const root =
      createDiCReactRoot()
    const onChange = vi.fn()

    root.render(
      createElement(
        Input,
        {
          value: 'first',
          onChange,
        },
      ),
    )

    const first =
      root.getNodes()[0]

    if (first === undefined) {
      throw new Error(
        'Expected Input node',
      )
    }

    const { context } =
      textContext()
    let layout =
      layoutDiCViewTree(
        first,
        {
          width: 300,
          height: 100,
        },
        {
          viewportWidth: 300,
          rem: 16,
          theme: defaultTheme,
          context,
        },
      )
    const controller =
      createDiCInteractionController({
        getLayout: () => layout,
        invalidate: vi.fn(),
      })
    const host =
      document.createElement('div')
    const canvas =
      document.createElement('canvas')
    host.appendChild(canvas)
    document.body.appendChild(host)

    const mirror =
      createDiCSemanticMirror(
        canvas,
        controller,
      )
    mirror.update(
      first,
      layout,
    )

    const firstEditor =
      mirror.getElement(first)

    root.render(
      createElement(
        Input,
        {
          value: 'second',
          onChange,
        },
      ),
    )

    const second =
      root.getNodes()[0]

    expect(second).toBe(first)

    layout = layoutDiCViewTree(
      second as NonNullable<typeof second>,
      {
        width: 300,
        height: 100,
      },
      {
        viewportWidth: 300,
        rem: 16,
        theme: defaultTheme,
        context,
      },
    )
    mirror.update(
      second as NonNullable<typeof second>,
      layout,
    )

    const secondEditor =
      mirror.getElement(
        second as NonNullable<typeof second>,
      )

    expect(secondEditor).toBe(
      firstEditor,
    )
    expect(
      (
        secondEditor as HTMLInputElement
      ).value,
    ).toBe('second')

    mirror.destroy()
    root.unmount()
  })
})
