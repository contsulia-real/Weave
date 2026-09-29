import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createTheme, Select, SelectOption, Text, ThemeProvider } from '../src'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function optionByValue(value: string): HTMLElement {
  const option = document.querySelector<HTMLElement>(
    '[data-weave-select-option-value="' + value + '"]',
  )

  if (option === null) {
    throw new Error('Missing option: ' + value)
  }

  return option
}

describe('Select', () => {
  it('uses select-only combobox/listbox semantics and keeps DOM focus on the trigger', async () => {
    const { getByRole, getAllByRole } = render(
      <Select placeholder="Choose one">
        <SelectOption value="disabled" text="Disabled" disabled />
        <SelectOption value="alpha" text="Alpha" />
        <SelectOption value="beta" text="Beta" />
      </Select>,
    )

    const trigger = getByRole('combobox')

    expect(trigger.textContent).toContain('Choose one')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox')

    trigger.focus()
    fireEvent.click(trigger)

    const listbox = getByRole('listbox')
    const options = getAllByRole('option')

    await waitFor(() => {
      expect(listbox.style.visibility).toBe('visible')
    })

    expect(options).toHaveLength(3)
    expect(options[0]?.getAttribute('aria-disabled')).toBe('true')
    expect(trigger.getAttribute('aria-activedescendant')).toBe(optionByValue('alpha').id)
    expect(document.activeElement).toBe(trigger)
  })

  it('supports uncontrolled selection and reflects the selected option in the trigger', async () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(
      <Select defaultValue="beta" onValueChange={onValueChange}>
        <SelectOption value="alpha" text="Alpha" />
        <SelectOption value="beta" text="Beta" />
      </Select>,
    )

    const trigger = getByRole('combobox')

    expect(trigger.textContent).toContain('Beta')

    fireEvent.click(trigger)

    const listbox = getByRole('listbox')

    await waitFor(() => {
      expect(listbox.style.visibility).toBe('visible')
    })

    expect(trigger.getAttribute('aria-activedescendant')).toBe(optionByValue('beta').id)

    fireEvent.click(optionByValue('alpha'))

    expect(onValueChange).toHaveBeenCalledWith('alpha')
    expect(trigger.textContent).toContain('Alpha')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    fireEvent.transitionEnd(listbox)

    await waitFor(() => {
      expect(document.querySelector('[data-weave-select-listbox]')).toBeNull()
    })
  })

  it('supports controlled value without mutating the displayed selection before rerender', async () => {
    const onValueChange = vi.fn()
    const { getByRole, rerender } = render(
      <Select value="alpha" onValueChange={onValueChange}>
        <SelectOption value="alpha" text="Alpha" />
        <SelectOption value="beta" text="Beta" />
      </Select>,
    )

    const trigger = getByRole('combobox')

    fireEvent.click(trigger)

    await waitFor(() => {
      expect(getByRole('listbox').style.visibility).toBe('visible')
    })

    fireEvent.click(optionByValue('beta'))

    expect(onValueChange).toHaveBeenCalledWith('beta')
    expect(trigger.textContent).toContain('Alpha')

    rerender(
      <Select value="beta" onValueChange={onValueChange}>
        <SelectOption value="alpha" text="Alpha" />
        <SelectOption value="beta" text="Beta" />
      </Select>,
    )

    expect(trigger.textContent).toContain('Beta')
  })

  it('navigates active options with keyboard, skips disabled options, wraps, and commits with Enter', async () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(
      <Select defaultValue="beta" onValueChange={onValueChange}>
        <SelectOption value="alpha" text="Alpha" />
        <SelectOption value="beta" text="Beta" />
        <SelectOption value="charlie" text="Charlie" disabled />
        <SelectOption value="delta" text="Delta" />
      </Select>,
    )

    const trigger = getByRole('combobox')

    trigger.focus()
    fireEvent.keyDown(trigger, {
      key: 'ArrowDown',
    })

    await waitFor(() => {
      expect(getByRole('listbox').style.visibility).toBe('visible')
    })

    expect(trigger.getAttribute('aria-activedescendant')).toBe(optionByValue('beta').id)

    fireEvent.keyDown(trigger, {
      key: 'ArrowDown',
    })

    expect(trigger.getAttribute('aria-activedescendant')).toBe(optionByValue('delta').id)

    fireEvent.keyDown(trigger, {
      key: 'ArrowDown',
    })

    expect(trigger.getAttribute('aria-activedescendant')).toBe(optionByValue('alpha').id)

    fireEvent.keyDown(trigger, {
      key: 'End',
    })

    expect(trigger.getAttribute('aria-activedescendant')).toBe(optionByValue('delta').id)

    fireEvent.keyDown(trigger, {
      key: 'Home',
    })

    expect(trigger.getAttribute('aria-activedescendant')).toBe(optionByValue('alpha').id)

    fireEvent.keyDown(trigger, {
      key: 'ArrowUp',
    })

    expect(trigger.getAttribute('aria-activedescendant')).toBe(optionByValue('delta').id)

    const listbox = getByRole('listbox')

    fireEvent.keyDown(trigger, {
      key: 'Enter',
    })

    expect(onValueChange).toHaveBeenCalledWith('delta')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger)

    fireEvent.transitionEnd(listbox)

    await waitFor(() => {
      expect(document.querySelector('[data-weave-select-listbox]')).toBeNull()
    })
  })

  it('supports typeahead, including explicit textValue for complex labels', async () => {
    const { getByRole } = render(
      <Select>
        <SelectOption value="alpha" text="Alpha" />
        <SelectOption value="beta" text="Beta" disabled />
        <SelectOption value="bravo" text="Bravo" />
        <SelectOption value="zulu" text={<Text>Zulu display</Text>} textValue="Zulu" />
      </Select>,
    )

    const trigger = getByRole('combobox')

    trigger.focus()
    fireEvent.keyDown(trigger, {
      key: 'b',
    })

    await waitFor(() => {
      expect(getByRole('listbox').style.visibility).toBe('visible')
    })

    expect(trigger.getAttribute('aria-activedescendant')).toBe(optionByValue('bravo').id)

    fireEvent.keyDown(trigger, {
      key: 'z',
    })

    expect(trigger.getAttribute('aria-activedescendant')).toBe(optionByValue('zulu').id)

    const listbox = getByRole('listbox')

    fireEvent.keyDown(trigger, {
      key: 'Escape',
    })
    fireEvent.transitionEnd(listbox)

    await waitFor(() => {
      expect(document.querySelector('[data-weave-select-listbox]')).toBeNull()
    })
  })

  it('supports controlled open state', () => {
    const onOpenChange = vi.fn()
    const { getByRole, queryByRole, rerender } = render(
      <Select open={false} onOpenChange={onOpenChange} value="alpha">
        <SelectOption value="alpha" text="Alpha" />
      </Select>,
    )

    const trigger = getByRole('combobox')

    fireEvent.click(trigger)

    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(queryByRole('listbox')).toBeNull()

    rerender(
      <Select open onOpenChange={onOpenChange} value="alpha">
        <SelectOption value="alpha" text="Alpha" />
      </Select>,
    )

    expect(queryByRole('listbox')).not.toBeNull()
    expect(trigger.getAttribute('aria-activedescendant')).toBe(optionByValue('alpha').id)
  })

  it('does not open or navigate when disabled', () => {
    const { getByRole, queryByRole } = render(
      <Select disabled>
        <SelectOption value="alpha" text="Alpha" />
      </Select>,
    )

    const trigger = getByRole('combobox')

    expect((trigger as HTMLButtonElement).disabled).toBe(true)

    fireEvent.click(trigger)
    fireEvent.keyDown(trigger, {
      key: 'ArrowDown',
    })

    expect(queryByRole('listbox')).toBeNull()
  })

  it('dismisses on outside pointer input and when its trigger fully leaves the viewport', async () => {
    const { getByRole } = render(
      <>
        <Select>
          <SelectOption value="alpha" text="Alpha" />
        </Select>
        <button type="button">Outside</button>
      </>,
    )

    const trigger = getByRole('combobox')

    trigger.getBoundingClientRect = () =>
      ({
        x: 100,
        y: 100,
        left: 100,
        top: 100,
        right: 220,
        bottom: 140,
        width: 120,
        height: 40,
        toJSON: () => ({}),
      }) as DOMRect

    fireEvent.click(trigger)

    let listbox = getByRole('listbox')

    await waitFor(() => {
      expect(listbox.style.visibility).toBe('visible')
    })

    fireEvent.pointerDown(
      getByRole('button', {
        name: 'Outside',
      }),
    )

    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    fireEvent.transitionEnd(listbox)

    fireEvent.click(trigger)
    listbox = getByRole('listbox')

    await waitFor(() => {
      expect(listbox.style.visibility).toBe('visible')
    })

    trigger.getBoundingClientRect = () =>
      ({
        x: 100,
        y: -40,
        left: 100,
        top: -40,
        right: 220,
        bottom: 0,
        width: 120,
        height: 40,
        toJSON: () => ({}),
      }) as DOMRect

    fireEvent.scroll(window)

    await waitFor(() => {
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    })
  })

  it('uses custom viewportPadding and forwards listboxViewProps', async () => {
    const listboxRef = vi.fn()
    const { getByRole, getByTestId } = render(
      <Select
        defaultOpen
        placement="bottom-left"
        viewportPadding={2}
        listboxViewProps={{
          id: 'custom-select-listbox',
          ref: listboxRef,
          className: 'custom-listbox',
          data: { testid: 'select-listbox' },
          style: { opacity: 0.5 },
        }}
      >
        <SelectOption value="alpha" text="Alpha" />
      </Select>,
    )
    const trigger = getByRole('combobox')
    const listbox = getByTestId('select-listbox')

    trigger.getBoundingClientRect = () =>
      ({
        x: -20,
        y: 80,
        left: -20,
        top: 80,
        right: 100,
        bottom: 120,
        width: 120,
        height: 40,
        toJSON: () => ({}),
      }) as DOMRect
    listbox.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        right: 180,
        bottom: 100,
        width: 180,
        height: 100,
        toJSON: () => ({}),
      }) as DOMRect

    fireEvent.scroll(window)

    await waitFor(() => {
      expect(listbox.style.left).toBe('32px')
    })
    expect(listbox.id).toBe('custom-select-listbox')
    expect(listbox.classList.contains('custom-listbox')).toBe(true)
    expect(listbox.style.opacity).toBe('0.5')
    expect(listbox.getAttribute('role')).toBe('listbox')
    expect(listboxRef).toHaveBeenCalledWith(listbox)
  })

  it('can overlap its trigger instead of opening below it', async () => {
    const { getByRole } = render(
      <Select defaultOpen overlapTrigger placement="bottom-left">
        <SelectOption value="alpha" text="Alpha" />
      </Select>,
    )
    const trigger = getByRole('combobox')
    const listbox = getByRole('listbox')

    trigger.getBoundingClientRect = () =>
      ({
        x: 100,
        y: 100,
        left: 100,
        top: 100,
        right: 220,
        bottom: 140,
        width: 120,
        height: 40,
        toJSON: () => ({}),
      }) as DOMRect
    listbox.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        right: 180,
        bottom: 100,
        width: 180,
        height: 100,
        toJSON: () => ({}),
      }) as DOMRect

    fireEvent.scroll(window)

    await waitFor(() => {
      expect(listbox.style.left).toBe('100px')
      expect(listbox.style.top).toBe('100px')
    })
  })

  it('rejects duplicate option values', () => {
    expect(() =>
      render(
        <Select>
          <SelectOption value="same" text="One" />
          <SelectOption value="same" text="Two" />
        </Select>,
      ),
    ).toThrow('Select option value "same" is duplicated')
  })

  it('uses dedicated Select theme variables and directional listbox motion', () => {
    const theme = createTheme({
      components: {
        Input: {
          base: {
            background: 'primary',
            color: 'onPrimary',
          },
        },
        Select: {
          base: {
            gap: 0.75,
          },
          listbox: {
            shadow: 'large',
          },
          option: {
            selectedColor: 'warning',
          },
        },
      },
    })

    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <Select defaultOpen defaultValue="alpha">
          <SelectOption value="alpha" text="Alpha" />
        </Select>
      </ThemeProvider>,
    )

    const trigger = getByRole('combobox')
    const listbox = getByRole('listbox')
    const option = getByRole('option')

    const themeClass = [...trigger.classList].find((name) => name.startsWith('weave-select-theme-'))

    expect(themeClass).toBeDefined()
    expect(listbox.classList.contains(themeClass!)).toBe(true)
    expect(option.getAttribute('aria-selected')).toBe('true')

    const runtimeStyle =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-runtime-class="' + themeClass + '"]',
      )?.textContent ?? ''
    const stylesheet =
      document.querySelector<HTMLStyleElement>('style[data-weave-option-listbox-styles]')
        ?.textContent ?? ''

    expect(runtimeStyle).toContain('--weave-select-gap: 0.75rem')
    expect(runtimeStyle).toContain('--weave-option-listbox-gap: 0.25rem')
    const inputThemeRule =
      [...trigger.classList]
        .map(
          (name) =>
            document.querySelector<HTMLStyleElement>(
              'style[data-weave-runtime-class="' + name + '"]',
            )?.textContent ?? '',
        )
        .find((rule) => rule.includes('--weave-input-background:')) ?? ''
    expect(inputThemeRule).toContain('--weave-color-primary')
    expect(stylesheet).toContain('@starting-style')
    expect(stylesheet).toContain('data-weave-option-listbox-state="closing"')
    expect(stylesheet).toContain('data-weave-reduced-motion="reduce"')
  })
})
