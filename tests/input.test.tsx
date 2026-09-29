import { cleanup, fireEvent, render } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createTheme, Input, ThemeProvider } from '../src'

afterEach(cleanup)

function runtimeRule(element: Element, prefix: string): string {
  const className = [...element.classList].find((name) => name.startsWith(prefix))

  expect(className).toBeDefined()

  return (
    document.querySelector<HTMLStyleElement>(`style[data-weave-runtime-class="${className}"]`)
      ?.textContent ?? ''
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
    expect(runtimeRule(element, 'weave-props-')).toContain('--weave-width:20rem;')
    expect(element.style.getPropertyValue('--weave-width')).toBe('')

    fireEvent.change(element, {
      target: {
        value: 'world',
      },
    })

    expect(onChange).toHaveBeenCalledWith('world')
  })

  it('shows a clear action by default, can hide it, and clears uncontrolled text without losing focus', () => {
    const onChange = vi.fn()
    const { getByRole, getByTestId, queryByRole } = render(
      <>
        <Input
          defaultValue="hello"
          onChange={onChange}
          viewProps={{
            data: {
              testid: 'clear-input',
            },
          }}
        />
        <Input
          defaultValue="hidden"
          clearable={false}
          clearLabel="Hidden clear"
          viewProps={{
            data: {
              testid: 'hidden-clear-input',
            },
          }}
        />
      </>,
    )

    const input = getByTestId('clear-input') as HTMLInputElement
    const clear = getByRole('button', {
      name: 'Clear input',
    })

    expect(clear.dataset.weaveButton).toBe('')
    expect(clear.className).toContain('weave-button--ghost')

    const stylesheet = (
      document.querySelector<HTMLStyleElement>('style[data-weave-input-styles]')?.textContent ?? ''
    ).replace(/\s+/g, '')
    expect(stylesheet).toContain('--weave-component-padding-right:var(--weave-input-min-height);')
    expect(stylesheet).toContain(
      'right:calc((var(--weave-input-min-height)-var(--weave-button-min-height))/2);',
    )

    fireEvent.pointerDown(clear)
    fireEvent.click(clear)

    expect(input.value).toBe('')
    expect(onChange).toHaveBeenCalledWith('')
    expect(document.activeElement).toBe(input)
    expect(
      queryByRole('button', {
        name: 'Clear input',
      }),
    ).toBeNull()
    expect(
      queryByRole('button', {
        name: 'Hidden clear',
      }),
    ).toBeNull()
    expect(getByTestId('hidden-clear-input').closest('[data-weave-input-root]')).toBeNull()
  })

  it('maps disabled to the real input and textarea controls', () => {
    const { getByTestId } = render(
      <>
        <Input
          disabled
          viewProps={{
            data: {
              testid: 'disabled-input',
            },
          }}
        />
        <Input
          multiline
          disabled
          viewProps={{
            data: {
              testid: 'disabled-textarea',
            },
          }}
        />
      </>,
    )

    const input = getByTestId('disabled-input') as HTMLInputElement
    const textarea = getByTestId('disabled-textarea') as HTMLTextAreaElement

    expect(input.disabled).toBe(true)
    expect(textarea.disabled).toBe(true)
    expect(input.getAttribute('aria-disabled')).toBe('true')
    expect(textarea.getAttribute('aria-disabled')).toBe('true')
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

    const stylesheet = document.querySelector('style[data-weave-input-styles]')
    expect(stylesheet?.textContent).toContain(':where([data-weave-input-multiline])')
    expect(stylesheet?.textContent).toContain('resize: none;')

    const scrollbarStylesheet = document.querySelector('style[data-weave-scrollbar-styles]')
    expect(scrollbarStylesheet?.textContent).toContain('scrollbar-width: none')
    expect(document.querySelectorAll('[data-weave-scrollbar]').length).toBeGreaterThanOrEqual(2)

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
            overflowY: 'auto',
            overflowX: 'hidden',
            borderStyle: 'solid',
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

    const element = getByTestId('inset-textarea') as HTMLTextAreaElement

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

    const rectSpy = vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
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
    expect(verticalTrack?.style.left).toBe('500px')
    expect(verticalTrack?.style.getPropertyValue('--weave-scrollbar-edge-inset')).toBe('7px')

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
    const stylesheet = document.querySelector('style[data-weave-input-styles]')

    expect(element.className).toContain('weave-input')
    expect(rule).toContain('--weave-input-min-height:2.5rem;')
    expect(rule).toContain('--weave-input-min-width:12rem;')
    expect(rule).toContain('--weave-input-border-width:0.0625rem;')
    expect(rule).toContain('--weave-input-radius:0.75rem;')
    expect(rule).toContain(
      '--weave-input-font-size:var(--weave-typography-style-body-large-font-size);',
    )
    expect(rule).toContain(
      '--weave-input-font-weight:var(--weave-typography-style-body-large-font-weight);',
    )
    expect(rule).toContain(
      '--weave-input-line-height:var(--weave-typography-style-body-large-line-height);',
    )
    expect(rule).toContain(
      '--weave-input-letter-spacing:var(--weave-typography-style-body-large-letter-spacing);',
    )
    expect(stylesheet?.textContent).toContain('--weave-component-border-style: solid')
    expect(rule).toContain(
      '--weave-input-shadow:inset00.125rem0.1875remrgb(584840/0.24),inset0-0.0625rem0rgb(255255255/0.42);',
    )
    expect(rule).toContain(
      '--weave-input-background:color-mix(insrgb,var(--weave-color-outline)34%,var(--weave-color-surface));',
    )
    expect(stylesheet?.textContent).toContain(
      '--weave-component-box-shadow:\n    var(--weave-input-shadow)',
    )
    expect(stylesheet?.textContent).not.toContain('0 0.09375rem 0.15625rem')
  })

  it('preserves the existing dark field surface while light uses the same recessed geometry', () => {
    const { getByTestId } = render(
      <ThemeProvider mode="dark">
        <Input
          viewProps={{
            data: {
              testid: 'dark-input',
            },
          }}
        />
      </ThemeProvider>,
    )

    const element = getByTestId('dark-input')
    const rule = runtimeRule(element, 'weave-input-theme-')

    expect(rule).toContain(
      '--weave-input-background:color-mix(insrgb,var(--weave-color-outline)34%,var(--weave-color-surface));',
    )
    expect(rule).toContain(
      '--weave-input-shadow:inset00.125rem0.1875remrgb(000/0.58),inset0-0.0625rem0rgb(255255255/0.045);',
    )
    expect(rule).toContain('inset00.125rem0.1875remrgb(000/0.58)')
  })

  it('lets ThemeProvider select Input typography by typo', () => {
    const theme = createTheme({
      components: {
        Input: {
          base: {
            typo: 'body-small',
          },
        },
      },
    })

    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Input
          placeholder="Typed"
          viewProps={{
            data: {
              testid: 'typo-input',
            },
          }}
        />
      </ThemeProvider>,
    )

    const element = getByTestId('typo-input')
    const rule = runtimeRule(element, 'weave-input-theme-')
    const stylesheet = document.querySelector('style[data-weave-input-styles]')?.textContent ?? ''

    expect(rule).toContain(
      '--weave-input-font-size:var(--weave-typography-style-body-small-font-size);',
    )
    expect(rule).toContain(
      '--weave-input-font-weight:var(--weave-typography-style-body-small-font-weight);',
    )
    expect(rule).toContain(
      '--weave-input-line-height:var(--weave-typography-style-body-small-line-height);',
    )
    expect(rule).toContain(
      '--weave-input-letter-spacing:var(--weave-typography-style-body-small-letter-spacing);',
    )
    expect(stylesheet).toContain('font-weight:')
    expect(stylesheet).toContain('letter-spacing:')
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
    expect(runtimeRule(element, 'weave-props-')).toContain('--weave-width:20rem;')
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
