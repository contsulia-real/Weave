import { cleanup, fireEvent, render } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Input } from '../src'

afterEach(cleanup)

function runtimeRule(
  element: Element,
  prefix: string,
): string {
  const className = [...element.classList].find((name) =>
    name.startsWith(prefix),
  )

  expect(className).toBeDefined()

  return (
    document.querySelector<HTMLStyleElement>(
      `style[data-weave-runtime-class="${className}"]`,
    )?.textContent ?? ''
  ).replace(/\s+/g, '')
}

describe('Input', () => {
  it('renders a single-line input and emits value changes', () => {
    const onChange = vi.fn()

    const { getByTestId } = render(
      <Input
        defaultValue="hello"
        onChange={onChange}
        placeholder="Name"
        type="text"
        required
        name="name"
        autoComplete="name"
        minLength={2}
        maxLength={20}
        pattern="[A-Za-z ]+"
        viewProps={{
          width: 20,
          padding: 0.75,
          radius: 'medium',
          data: {
            testid: 'input',
          },
        }}
      />,
    )

    const element = getByTestId('input') as HTMLInputElement

    expect(element.tagName).toBe('INPUT')
    expect(element.className).toContain('weave-view')
    expect(element.className).toContain('weave-input')
    expect(element.value).toBe('hello')
    expect(element.placeholder).toBe('Name')
    expect(element.required).toBe(true)
    expect(element.name).toBe('name')
    expect(element.autocomplete).toBe('name')
    expect(element.minLength).toBe(2)
    expect(element.maxLength).toBe(20)
    expect(element.pattern).toBe('[A-Za-z ]+')
    expect(runtimeRule(element, 'weave-props-')).toContain(
      '--weave-width:20rem;',
    )
    expect(element.style.getPropertyValue('--weave-width')).toBe('')

    fireEvent.change(element, {
      target: {
        value: 'world',
      },
    })

    expect(onChange).toHaveBeenCalledWith('world')
  })

  it('renders multiline mode as a textarea', () => {
    const onChange = vi.fn()

    const { getByTestId } = render(
      <Input
        multiline
        rows={4}
        defaultValue="Line one"
        onChange={onChange}
        placeholder="Notes"
        viewProps={{
          data: {
            testid: 'textarea',
          },
        }}
      />,
    )

    const element = getByTestId('textarea') as HTMLTextAreaElement

    expect(element.tagName).toBe('TEXTAREA')
    expect(element.className).toContain('weave-input')
    expect(element.className).toContain('weave-input--multiline')
    expect(element.className).toContain('weave-scroll-host')
    expect(element.getAttribute('data-weave-scroll-host')).toBe('')
    expect(element.rows).toBe(4)
    expect(element.value).toBe('Line one')
    expect(element.getAttribute('type')).toBeNull()

    const stylesheet = document.querySelector(
      'style[data-weave-input-styles]',
    )
    expect(stylesheet?.textContent).toContain(
      ':where([data-weave-input-multiline])',
    )
    expect(stylesheet?.textContent).toContain('resize: none;')

    const scrollbarStylesheet = document.querySelector(
      'style[data-weave-scrollbar-styles]',
    )
    expect(scrollbarStylesheet?.textContent).toContain(
      'scrollbar-width: none',
    )
    expect(
      document.querySelectorAll('[data-weave-scrollbar]').length,
    ).toBeGreaterThanOrEqual(2)

    fireEvent.change(element, {
      target: {
        value: 'Line two',
      },
    })

    expect(onChange).toHaveBeenCalledWith('Line two')
  })

  it('insets the multiline scrollbar inside the textarea border', () => {
    const { getByTestId } = render(
      <Input
        multiline
        rows={4}
        defaultValue={'one\ntwo\nthree\nfour\nfive\nsix'}
        viewProps={{
          style: {
            borderTopWidth: '2px',
            borderRightWidth: '3px',
            borderBottomWidth: '2px',
            borderLeftWidth: '3px',
          },
          data: {
            testid: 'inset-textarea',
          },
        }}
      />,
    )

    const element = getByTestId(
      'inset-textarea',
    ) as HTMLTextAreaElement

    Object.defineProperties(element, {
      scrollHeight: {
        configurable: true,
        value: 400,
      },
      clientHeight: {
        configurable: true,
        value: 100,
      },
      scrollWidth: {
        configurable: true,
        value: 200,
      },
      clientWidth: {
        configurable: true,
        value: 200,
      },
    })

    const rectSpy = vi.spyOn(
      element,
      'getBoundingClientRect',
    ).mockReturnValue({
      top: 100,
      right: 500,
      bottom: 300,
      left: 200,
      width: 300,
      height: 200,
      x: 200,
      y: 100,
      toJSON: () => ({}),
    } as DOMRect)

    fireEvent(window, new Event('resize'))

    const verticalTrack = document.querySelector<HTMLElement>(
      '[data-weave-scrollbar-orientation="vertical"]',
    )

    expect(verticalTrack?.style.top).toBe('106px')
    expect(verticalTrack?.style.left).toBe('493px')

    rectSpy.mockRestore()
  })

  it('uses the default Input component theme', () => {
    const { getByTestId } = render(
      <Input
        viewProps={{
          data: {
            testid: 'themed-input',
          },
        }}
      />,
    )

    const element = getByTestId('themed-input')
    const rule = runtimeRule(element, 'weave-input-theme-')
    const stylesheet = document.querySelector(
      'style[data-weave-input-styles]',
    )

    expect(rule).toContain(
      '--weave-input-theme-min-height:2.25rem;',
    )
    expect(rule).toContain(
      '--weave-input-theme-border-width:0.0625rem;',
    )
    expect(rule).toContain(
      '--weave-input-theme-radius:0.5rem;',
    )
    expect(stylesheet?.textContent).toContain(
      '--weave-component-border-style: solid',
    )
  })

  it('keeps readOnly and required as Input-level native states', () => {
    const { getByTestId } = render(
      <Input
        readOnly
        required
        viewProps={{
          data: {
            testid: 'states',
          },
        }}
      />,
    )

    const element = getByTestId('states') as HTMLInputElement

    expect(element.readOnly).toBe(true)
    expect(element.required).toBe(true)
    expect(element.getAttribute('aria-readonly')).toBeNull()
    expect(element.getAttribute('aria-required')).toBeNull()
  })

  it('keeps viewProps className and style as escape hatches', () => {
    const { getByTestId } = render(
      <Input
        viewProps={{
          className: 'custom-input',
          width: 20,
          style: {
            width: '120px',
          },
          data: {
            testid: 'priority-input',
          },
        }}
      />,
    )

    const element = getByTestId('priority-input') as HTMLInputElement

    expect(element.className).toContain('weave-input')
    expect(element.className).toContain('custom-input')
    expect(element.style.getPropertyValue('--weave-width')).toBe('')
    expect(runtimeRule(element, 'weave-props-')).toContain(
      '--weave-width:20rem;',
    )
    expect(element.style.width).toBe('120px')
    expect(element.getAttribute('style')).toContain('width: 120px')
  })

  it('exposes the real host through viewProps.ref', () => {
    const inputRef = createRef<HTMLInputElement>()
    const textareaRef = createRef<HTMLTextAreaElement>()

    render(
      <>
        <Input viewProps={{ ref: inputRef }} />
        <Input multiline viewProps={{ ref: textareaRef }} />
      </>,
    )

    expect(inputRef.current?.tagName).toBe('INPUT')
    expect(textareaRef.current?.tagName).toBe('TEXTAREA')
  })
})
