import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  Combobox,
  ComboboxOption,
  createTheme,
  Input,
  Select,
  SelectOption,
  ThemeProvider,
} from '../src'

afterEach(cleanup)

function runtimeThemeClass(element: Element): string {
  const className = [...element.classList].find((name) => name.startsWith('weave-input-theme-'))

  if (className === undefined) {
    throw new Error('Missing Input theme class')
  }

  return className
}

describe('Input surface reuse', () => {
  it('uses Input as the visual source for Input, Select and Combobox', () => {
    const theme = createTheme({
      components: {
        Input: {
          base: {
            background: 'primary',
            borderColor: 'warning',
            typo: 'body-small',
          },
        },
      },
    })

    const { getAllByRole, getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Input
          viewProps={{
            data: {
              testid: 'surface-input',
            },
          }}
        />
        <Select>
          <SelectOption value="alpha" text="Alpha" />
        </Select>
        <Combobox>
          <ComboboxOption value="alpha" text="Alpha" />
        </Combobox>
      </ThemeProvider>,
    )

    const input = getByTestId('surface-input')
    const [select, combobox] = getAllByRole('combobox')

    const classes = [
      runtimeThemeClass(input),
      runtimeThemeClass(select!),
      runtimeThemeClass(combobox!),
    ]

    expect(new Set(classes).size).toBe(1)

    const runtimeStyle =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-runtime-class="' + classes[0] + '"]',
      )?.textContent ?? ''

    expect(runtimeStyle).toContain('--weave-input-background:')
    expect(runtimeStyle).toContain('--weave-color-primary')
    expect(runtimeStyle).toContain('--weave-color-warning')
    expect(runtimeStyle).toContain('--weave-typography-style-body-small-font-size')

    const stylesheet =
      document.querySelector<HTMLStyleElement>('style[data-weave-input-styles]')?.textContent ?? ''

    expect(stylesheet).toContain('.weave-select:focus-visible')
    expect(document.querySelector('style[data-weave-field-control-styles]')).toBeNull()

    for (const element of [input, select!, combobox!]) {
      expect(element.classList).not.toContain('weave-field-control')
    }
  })
})
