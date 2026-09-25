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

    fireEvent.change(element, {
      target: {
        value: 'Line two',
      },
    })

    expect(onChange).toHaveBeenCalledWith('Line two')
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

    expect(element.className).toContain('custom-input')
    expect(element.style.getPropertyValue('--weave-width')).toBe('')
    expect(runtimeRule(element, 'weave-props-')).toContain(
      '--weave-width:20rem;',
    )
    expect(element.style.width).toBe('120px')
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
