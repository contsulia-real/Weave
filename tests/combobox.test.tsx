import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react'
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  Combobox,
  ComboboxOption,
  ThemeProvider,
  createTheme,
} from '../src'

afterEach(cleanup)

async function flushAnimationFrames() {
  await act(
    () =>
      new Promise<void>(
        (resolve) => {
          requestAnimationFrame(
            () => {
              requestAnimationFrame(
                () => resolve(),
              )
            },
          )
        },
      ),
  )
}

async function scrollAndFlushAnimationFrames() {
  await act(
    async () => {
      fireEvent.scroll(window)

      await new Promise<void>(
        (resolve) => {
          requestAnimationFrame(
            () => {
              requestAnimationFrame(
                () => resolve(),
              )
            },
          )
        },
      )
    },
  )
}

function optionByValue(
  value: string,
): HTMLElement {
  const option =
    document.querySelector<HTMLElement>(
      '[data-weave-combobox-option-value="' +
        value +
        '"]',
    )

  if (option === null) {
    throw new Error(
      'Missing option: ' +
        value,
    )
  }

  return option
}

describe('Combobox', () => {
  it('uses editable combobox semantics, filters as the input changes, and keeps focus on the input', async () => {
    const {
      getByRole,
      getAllByRole,
    } = render(
      <Combobox
        placeholder="Search"
      >
        <ComboboxOption
          value="alpha"
          text="Alpha"
        />
        <ComboboxOption
          value="beta"
          text="Beta"
          disabled
        />
        <ComboboxOption
          value="bravo"
          text="Bravo"
        />
      </Combobox>,
    )

    const input =
      getByRole('combobox') as
        HTMLInputElement

    expect(input.dataset.weaveInput)
      .toBe('')

    input.focus()
    fireEvent.change(
      input,
      {
        target: {
          value: 'av',
        },
      },
    )

    const listbox =
      getByRole('listbox')

    await waitFor(() => {
      expect(
        listbox.style.visibility,
      ).toBe('visible')
    })

    expect(input.value)
      .toBe('av')
    expect(
      input.getAttribute(
        'aria-autocomplete',
      ),
    ).toBe('list')
    expect(
      input.getAttribute(
        'aria-expanded',
      ),
    ).toBe('true')
    expect(
      getAllByRole('option'),
    ).toHaveLength(1)
    expect(
      getByRole('option')
        .textContent,
    ).toContain('Bravo')
    expect(
      input.getAttribute(
        'aria-activedescendant',
      ),
    ).toBe(
      optionByValue(
        'bravo',
      ).id,
    )
    expect(
      document.activeElement,
    ).toBe(input)
  })

  it('keeps input text and selected value separate until an option is committed', async () => {
    const onValueChange =
      vi.fn()
    const onInputValueChange =
      vi.fn()
    const {
      getByRole,
    } = render(
      <Combobox
        defaultValue="alpha"
        onValueChange={
          onValueChange
        }
        onInputValueChange={
          onInputValueChange
        }
      >
        <ComboboxOption
          value="alpha"
          text="Alpha"
        />
        <ComboboxOption
          value="bravo"
          text="Bravo"
        />
      </Combobox>,
    )

    const input =
      getByRole('combobox') as
        HTMLInputElement

    expect(input.value)
      .toBe('Alpha')

    fireEvent.change(
      input,
      {
        target: {
          value: 'Br',
        },
      },
    )

    await waitFor(() => {
      expect(
        getByRole('listbox')
          .style.visibility,
      ).toBe('visible')
    })

    expect(onInputValueChange)
      .toHaveBeenCalledWith('Br')
    expect(onValueChange)
      .not.toHaveBeenCalled()
    expect(
      optionByValue(
        'bravo',
      ).getAttribute(
        'aria-selected',
      ),
    ).toBe('false')

    const listbox =
      getByRole('listbox')

    fireEvent.keyDown(
      input,
      {
        key: 'Enter',
      },
    )

    expect(onValueChange)
      .toHaveBeenCalledWith(
        'bravo',
      )
    expect(onInputValueChange)
      .toHaveBeenLastCalledWith(
        'Bravo',
      )
    expect(input.value)
      .toBe('Bravo')
    expect(
      input.getAttribute(
        'aria-expanded',
      ),
    ).toBe('false')

    fireEvent.transitionEnd(
      listbox,
    )

    await waitFor(() => {
      expect(
        document.querySelector(
          '[data-weave-combobox-listbox]',
        ),
      ).toBeNull()
    })
  })

  it('supports independently controlled inputValue and value', async () => {
    const onValueChange =
      vi.fn()
    const onInputValueChange =
      vi.fn()
    const {
      getByRole,
      rerender,
    } = render(
      <Combobox
        value="alpha"
        inputValue="A"
        onValueChange={
          onValueChange
        }
        onInputValueChange={
          onInputValueChange
        }
      >
        <ComboboxOption
          value="alpha"
          text="Alpha"
        />
        <ComboboxOption
          value="beta"
          text="Beta"
        />
      </Combobox>,
    )

    const input =
      getByRole('combobox') as
        HTMLInputElement

    fireEvent.change(
      input,
      {
        target: {
          value: 'B',
        },
      },
    )

    expect(onInputValueChange)
      .toHaveBeenCalledWith('B')
    expect(input.value)
      .toBe('A')

    const listbox =
      getByRole('listbox')

    await waitFor(() => {
      expect(
        listbox.style.visibility,
      ).toBe('visible')
    })

    rerender(
      <Combobox
        value="alpha"
        inputValue="B"
        onValueChange={
          onValueChange
        }
        onInputValueChange={
          onInputValueChange
        }
      >
        <ComboboxOption
          value="alpha"
          text="Alpha"
        />
        <ComboboxOption
          value="beta"
          text="Beta"
        />
      </Combobox>,
    )

    await waitFor(() => {
      expect(
        getByRole('option')
          .textContent,
      ).toContain('Beta')
    })

    fireEvent.click(
      optionByValue(
        'beta',
      ),
    )

    expect(onValueChange)
      .toHaveBeenCalledWith(
        'beta',
      )
    expect(onInputValueChange)
      .toHaveBeenLastCalledWith(
        'Beta',
      )
    expect(input.value)
      .toBe('B')

    fireEvent.transitionEnd(
      listbox,
    )

    await waitFor(() => {
      expect(
        document.querySelector(
          '[data-weave-combobox-listbox]',
        ),
      ).toBeNull()
    })
  })

  it('supports custom filtering and a custom empty state', async () => {
    const filter = vi.fn(
      (
        option: {
          value: string
        },
        query: string,
      ) =>
        option.value === query,
    )

    const {
      getByRole,
      queryAllByRole,
    } = render(
      <Combobox
        filter={filter}
        emptyContent="Nothing here"
      >
        <ComboboxOption
          value="alpha"
          text="Alpha"
        />
        <ComboboxOption
          value="beta"
          text="Beta"
        />
      </Combobox>,
    )

    const input =
      getByRole('combobox')

    fireEvent.change(
      input,
      {
        target: {
          value: 'missing',
        },
      },
    )

    await waitFor(() => {
      expect(
        getByRole('listbox')
          .style.visibility,
      ).toBe('visible')
    })

    expect(
      queryAllByRole('option'),
    ).toHaveLength(0)
    expect(
      getByRole('listbox')
        .textContent,
    ).toContain('Nothing here')
    expect(filter)
      .toHaveBeenCalled()
  })

  it('navigates filtered options, skips disabled options, and commits with Enter', async () => {
    const onValueChange =
      vi.fn()
    const {
      getByRole,
    } = render(
      <Combobox
        onValueChange={
          onValueChange
        }
      >
        <ComboboxOption
          value="alpha"
          text="Alpha"
        />
        <ComboboxOption
          value="beta"
          text="Beta"
          disabled
        />
        <ComboboxOption
          value="charlie"
          text="Charlie"
        />
      </Combobox>,
    )

    const input =
      getByRole('combobox')

    input.focus()
    fireEvent.keyDown(
      input,
      {
        key: 'ArrowDown',
      },
    )

    await waitFor(() => {
      expect(
        getByRole('listbox')
          .style.visibility,
      ).toBe('visible')
    })

    expect(
      input.getAttribute(
        'aria-activedescendant',
      ),
    ).toBe(
      optionByValue(
        'alpha',
      ).id,
    )

    fireEvent.keyDown(
      input,
      {
        key: 'ArrowDown',
      },
    )

    expect(
      input.getAttribute(
        'aria-activedescendant',
      ),
    ).toBe(
      optionByValue(
        'charlie',
      ).id,
    )

    const listbox =
      getByRole('listbox')

    fireEvent.keyDown(
      input,
      {
        key: 'Enter',
      },
    )

    expect(onValueChange)
      .toHaveBeenCalledWith(
        'charlie',
      )

    fireEvent.transitionEnd(
      listbox,
    )
  })

  it('clears both the selected value and input text and restores input focus', async () => {
    const onValueChange =
      vi.fn()
    const onInputValueChange =
      vi.fn()
    const {
      getByRole,
    } = render(
      <Combobox
        defaultValue="alpha"
        onValueChange={
          onValueChange
        }
        onInputValueChange={
          onInputValueChange
        }
      >
        <ComboboxOption
          value="alpha"
          text="Alpha"
        />
      </Combobox>,
    )

    const input =
      getByRole('combobox') as
        HTMLInputElement
    const clear =
      getByRole('button', {
        name: 'Clear selection',
      })

    expect(clear.dataset.weaveButton)
      .toBe('')

    input.focus()
    fireEvent.pointerDown(clear)
    fireEvent.click(clear)

    expect(onValueChange)
      .toHaveBeenCalledWith(null)
    expect(onInputValueChange)
      .toHaveBeenCalledWith('')
    expect(input.value)
      .toBe('')

    await waitFor(() => {
      expect(
        document.activeElement,
      ).toBe(input)
    })
  })

  it('dismisses on outside pointer input', async () => {
    const {
      getByRole,
    } = render(
      <>
        <Combobox>
          <ComboboxOption
            value="alpha"
            text="Alpha"
          />
        </Combobox>
        <button type="button">
          Outside
        </button>
      </>,
    )

    const input =
      getByRole('combobox')
    const outside =
      getByRole('button', {
        name: 'Outside',
      })

    fireEvent.click(input)

    const listbox =
      getByRole('listbox')

    await waitFor(() => {
      expect(
        listbox.style.visibility,
      ).toBe('visible')
    })
    await flushAnimationFrames()

    fireEvent.pointerDown(
      outside,
    )

    expect(
      input.getAttribute(
        'aria-expanded',
      ),
    ).toBe('false')

    fireEvent.transitionEnd(
      listbox,
    )

    await waitFor(() => {
      expect(
        document.querySelector(
          '[data-weave-combobox-listbox]',
        ),
      ).toBeNull()
    })
  })

  it('dismisses when focus leaves the combobox and listbox', async () => {
    const {
      getByRole,
    } = render(
      <>
        <Combobox>
          <ComboboxOption
            value="alpha"
            text="Alpha"
          />
        </Combobox>
        <button type="button">
          Outside
        </button>
      </>,
    )

    const input =
      getByRole('combobox')
    const outside =
      getByRole('button', {
        name: 'Outside',
      })

    fireEvent.click(input)

    const listbox =
      getByRole('listbox')

    await waitFor(() => {
      expect(
        listbox.style.visibility,
      ).toBe('visible')
    })
    await flushAnimationFrames()

    fireEvent.focusIn(outside)

    expect(
      input.getAttribute(
        'aria-expanded',
      ),
    ).toBe('false')

    fireEvent.transitionEnd(
      listbox,
    )

    await waitFor(() => {
      expect(
        document.querySelector(
          '[data-weave-combobox-listbox]',
        ),
      ).toBeNull()
    })
  })

  it('dismisses when the input anchor fully leaves the viewport', async () => {
    const {
      getByRole,
    } = render(
      <Combobox>
        <ComboboxOption
          value="alpha"
          text="Alpha"
        />
      </Combobox>,
    )

    const input =
      getByRole('combobox') as
        HTMLInputElement

    input.getBoundingClientRect =
      () =>
        ({
          x: 100,
          y: 100,
          left: 100,
          top: 100,
          right: 300,
          bottom: 140,
          width: 200,
          height: 40,
          toJSON: () => ({}),
        }) as DOMRect

    fireEvent.click(input)

    const listbox =
      getByRole('listbox')

    await waitFor(() => {
      expect(
        listbox.style.visibility,
      ).toBe('visible')
    })
    await flushAnimationFrames()

    input.getBoundingClientRect =
      () =>
        ({
          x: 100,
          y: -40,
          left: 100,
          top: -40,
          right: 300,
          bottom: 0,
          width: 200,
          height: 40,
          toJSON: () => ({}),
        }) as DOMRect

    await scrollAndFlushAnimationFrames()

    expect(
      input.getAttribute(
        'aria-expanded',
      ),
    ).toBe('false')

    fireEvent.transitionEnd(
      listbox,
    )

    await waitFor(() => {
      expect(
        document.querySelector(
          '[data-weave-combobox-listbox]',
        ),
      ).toBeNull()
    })
  })

  it('keeps the popup at least as wide as the input anchor', async () => {
    const {
      getByRole,
    } = render(
      <Combobox>
        <ComboboxOption
          value="alpha"
          text="Alpha"
        />
      </Combobox>,
    )

    const input =
      getByRole('combobox') as
        HTMLInputElement

    input.getBoundingClientRect =
      () =>
        ({
          x: 100,
          y: 100,
          left: 100,
          top: 100,
          right: 340,
          bottom: 140,
          width: 240,
          height: 40,
          toJSON: () => ({}),
        }) as DOMRect

    fireEvent.click(input)

    const listbox =
      getByRole('listbox')

    await waitFor(() => {
      expect(
        listbox.style.getPropertyValue(
          '--weave-combobox-anchor-width',
        ),
      ).toBe('240px')
    })
  })

  it('rejects duplicate option values', () => {
    expect(() =>
      render(
        <Combobox>
          <ComboboxOption
            value="same"
            text="One"
          />
          <ComboboxOption
            value="same"
            text="Two"
          />
        </Combobox>,
      ),
    ).toThrow(
      'Combobox option value "same" is duplicated',
    )
  })

  it('uses dedicated Combobox theme variables and listbox motion', async () => {
    const theme =
      createTheme({
        components: {
          Combobox: {
            base: {
              background:
                'primary',
              color:
                'onPrimary',
            },
            listbox: {
              shadow: 'large',
            },
            option: {
              selectedColor:
                'warning',
            },
          },
        },
      })

    const {
      getByRole,
    } = render(
      <ThemeProvider
        theme={theme}
      >
        <Combobox
          defaultOpen
          defaultValue="alpha"
        >
          <ComboboxOption
            value="alpha"
            text="Alpha"
          />
        </Combobox>
      </ThemeProvider>,
    )

    const input =
      getByRole('combobox')
    const root =
      input.closest(
        '.weave-combobox-root',
      )!
    const listbox =
      getByRole('listbox')
    const option =
      getByRole('option')

    const themeClass =
      [...root.classList].find(
        (name) =>
          name.startsWith(
            'weave-combobox-theme-',
          ),
      )

    expect(themeClass)
      .toBeDefined()
    expect(
      listbox.classList.contains(
        themeClass!,
      ),
    ).toBe(true)
    expect(
      option.getAttribute(
        'aria-selected',
      ),
    ).toBe('true')

    const runtimeStyle =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-runtime-class="' +
          themeClass +
          '"]',
      )?.textContent ??
      ''
    const stylesheet =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-combobox-styles]',
      )?.textContent ??
      ''

    expect(runtimeStyle)
      .toContain(
        '--weave-field-control-background:',
      )
    expect(runtimeStyle)
      .toContain(
        '--weave-color-primary',
      )
    expect(
      getComputedStyle(input)
        .getPropertyValue(
          '--weave-field-control-background',
        ),
    ).toContain(
      '--weave-color-primary',
    )
    expect(stylesheet)
      .toContain(
        '@starting-style',
      )
    expect(stylesheet)
      .toContain(
        'data-weave-combobox-state="closing"',
      )
    expect(stylesheet)
      .toContain(
        'data-weave-reduced-motion="reduce"',
      )

    await waitFor(() => {
      expect(
        listbox.style.visibility,
      ).toBe('visible')
    })

    fireEvent.keyDown(
      input,
      {
        key: 'Escape',
      },
    )
    fireEvent.transitionEnd(
      listbox,
    )

    await waitFor(() => {
      expect(
        document.querySelector(
          '[data-weave-combobox-listbox]',
        ),
      ).toBeNull()
    })
  })
})
