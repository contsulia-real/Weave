import {
  cleanup,
  render,
} from '@testing-library/react'
import {
  afterEach,
  describe,
  expect,
  it,
} from 'vitest'
import {
  Combobox,
  ComboboxOption,
  Input,
  Select,
  SelectOption,
} from '../src'

afterEach(cleanup)

function runtimeRule(
  element: Element,
  prefix: string,
): string {
  const className =
    [...element.classList].find(
      (name) =>
        name.startsWith(prefix),
    )

  if (className === undefined) {
    throw new Error(
      'Missing runtime theme class: ' +
        prefix,
    )
  }

  return (
    document.querySelector<HTMLStyleElement>(
      'style[data-weave-runtime-class="' +
        className +
        '"]',
    )?.textContent ?? ''
  )
}

describe('field control baseline', () => {
  it('keeps Input, Select and Combobox on the same visual baseline', () => {
    const {
      getAllByRole,
      getByTestId,
    } = render(
      <>
        <Input
          viewProps={{
            data: {
              testid:
                'field-input',
            },
          }}
        />
        <Select>
          <SelectOption
            value="alpha"
            text="Alpha"
          />
        </Select>
        <Combobox>
          <ComboboxOption
            value="alpha"
            text="Alpha"
          />
        </Combobox>
      </>,
    )

    const input =
      getByTestId(
        'field-input',
      )
    const [
      select,
      combobox,
    ] = getAllByRole(
      'combobox',
    )

    expect(input.classList)
      .toContain(
        'weave-field-control',
      )
    expect(select?.classList)
      .toContain(
        'weave-field-control',
      )
    expect(combobox?.classList)
      .toContain(
        'weave-field-control',
      )

    const comboboxRoot =
      combobox!.closest(
        '.weave-combobox-root',
      )

    expect(comboboxRoot)
      .not.toBeNull()

    const rules = [
      runtimeRule(
        input,
        'weave-input-theme-',
      ),
      runtimeRule(
        select!,
        'weave-select-theme-',
      ),
      runtimeRule(
        comboboxRoot!,
        'weave-combobox-theme-',
      ),
    ]

    for (const rule of rules) {
      const compact =
        rule.replace(/\s+/g, '')

      expect(compact)
        .toContain(
          '--weave-field-control-min-height:2.5rem;',
        )
      expect(compact)
        .toContain(
          '--weave-field-control-min-width:12rem;',
        )
      expect(compact)
        .toContain(
          '--weave-field-control-border-width:0.0625rem;',
        )
      expect(compact)
        .toContain(
          '--weave-field-control-radius:0.75rem;',
        )
      expect(compact)
        .toContain(
          '--weave-field-control-padding-x:0.875rem;',
        )
      expect(compact)
        .toContain(
          '--weave-field-control-font-size:var(--weave-typography-style-body-large-font-size);',
        )
    }

    const stylesheet =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-field-control-styles]',
      )?.textContent ?? ''

    expect(stylesheet)
      .toContain(
        '.weave-field-control:focus-visible',
      )
    expect(stylesheet)
      .toContain(
        '--weave-component-box-shadow:',
      )
  })
})
