import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react'
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  Checkbox,
  Radio,
  defaultTheme,
} from '../src'

afterEach(cleanup)

describe('Radio and Checkbox', () => {
  it('renders native inputs and maps group to the native name', () => {
    const { getByRole } = render(
      <>
        <Radio
          group="theme"
          value="dark"
          viewProps={{
            label: 'Dark theme',
          }}
        />
        <Checkbox
          group="permissions"
          value="write"
          viewProps={{
            label: 'Write access',
          }}
        />
      </>,
    )

    const radio = getByRole('radio', {
      name: 'Dark theme',
    }) as HTMLInputElement
    const checkbox = getByRole('checkbox', {
      name: 'Write access',
    }) as HTMLInputElement

    expect(radio.type).toBe('radio')
    expect(radio.name).toBe('theme')
    expect(radio.value).toBe('dark')
    expect(
      radio.dataset.weaveChoiceGroup,
    ).toBe('theme')

    expect(checkbox.type).toBe('checkbox')
    expect(checkbox.name).toBe('permissions')
    expect(checkbox.value).toBe('write')
    expect(
      checkbox.dataset.weaveChoiceGroup,
    ).toBe('permissions')
  })

  it('binds visible labels so clicking label text toggles the native controls', () => {
    const { getByRole, getByText } = render(
      <>
        <Radio label="Radio label" />
        <Checkbox label="Checkbox label" />
      </>,
    )

    const radio = getByRole('radio', {
      name: 'Radio label',
    }) as HTMLInputElement
    const checkbox = getByRole('checkbox', {
      name: 'Checkbox label',
    }) as HTMLInputElement

    fireEvent.click(getByText('Radio label'))
    fireEvent.click(getByText('Checkbox label'))

    expect(radio.checked).toBe(true)
    expect(checkbox.checked).toBe(true)
  })

  it('treats radios with the same group as one native radio group', () => {
    const { getByRole } = render(
      <>
        <Radio
          group="theme"
          value="light"
          defaultChecked
          viewProps={{ label: 'Light' }}
        />
        <Radio
          group="theme"
          value="dark"
          viewProps={{ label: 'Dark' }}
        />
      </>,
    )

    const light = getByRole('radio', {
      name: 'Light',
    }) as HTMLInputElement
    const dark = getByRole('radio', {
      name: 'Dark',
    }) as HTMLInputElement

    expect(light.checked).toBe(true)
    expect(dark.checked).toBe(false)

    fireEvent.click(dark)

    expect(light.checked).toBe(false)
    expect(dark.checked).toBe(true)
  })

  it('keeps radios from different groups independent', () => {
    const { getByRole } = render(
      <>
        <Radio
          group="theme"
          defaultChecked
          viewProps={{ label: 'Theme' }}
        />
        <Radio
          group="density"
          defaultChecked
          viewProps={{ label: 'Density' }}
        />
      </>,
    )

    expect(
      (getByRole('radio', {
        name: 'Theme',
      }) as HTMLInputElement).checked,
    ).toBe(true)
    expect(
      (getByRole('radio', {
        name: 'Density',
      }) as HTMLInputElement).checked,
    ).toBe(true)
  })

  it('treats same-group checkboxes as one form group without coupling checked state', () => {
    const { getByRole } = render(
      <>
        <Checkbox
          group="permissions"
          value="read"
          viewProps={{ label: 'Read' }}
        />
        <Checkbox
          group="permissions"
          value="write"
          viewProps={{ label: 'Write' }}
        />
      </>,
    )

    const read = getByRole('checkbox', {
      name: 'Read',
    }) as HTMLInputElement
    const write = getByRole('checkbox', {
      name: 'Write',
    }) as HTMLInputElement

    fireEvent.click(read)
    fireEvent.click(write)

    expect(read.name).toBe('permissions')
    expect(write.name).toBe('permissions')
    expect(read.checked).toBe(true)
    expect(write.checked).toBe(true)
  })

  it('supports checked callbacks and native disabled behavior', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Checkbox
        disabled
        onChange={onChange}
        viewProps={{
          label: 'Disabled checkbox',
        }}
      />,
    )

    const checkbox = getByRole('checkbox', {
      name: 'Disabled checkbox',
    }) as HTMLInputElement

    expect(checkbox.disabled).toBe(true)
    expect(
      checkbox.getAttribute('aria-disabled'),
    ).toBe('true')

    checkbox.click()

    expect(checkbox.checked).toBe(false)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('ships three visibly distinct sizes with a thicker tactile border', () => {
    expect(
      defaultTheme.components.Radio?.base
        ?.borderWidth,
    ).toBe(0.125)
    expect(
      defaultTheme.components.Checkbox?.base
        ?.borderWidth,
    ).toBe(0.125)

    expect(
      defaultTheme.components.Radio?.sizes
        ?.small?.size,
    ).toBe(1.125)
    expect(
      defaultTheme.components.Radio?.sizes
        ?.medium?.size,
    ).toBe(1.375)
    expect(
      defaultTheme.components.Radio?.sizes
        ?.large?.size,
    ).toBe(1.625)

    expect(
      defaultTheme.components.Checkbox?.sizes
        ?.small?.size,
    ).toBe(1.125)
    expect(
      defaultTheme.components.Checkbox?.sizes
        ?.medium?.size,
    ).toBe(1.375)
    expect(
      defaultTheme.components.Checkbox?.sizes
        ?.large?.size,
    ).toBe(1.625)
  })

  it('fills the checked Checkbox and draws its checkmark path instead of revealing a padded inner square', () => {
    const { getByRole } = render(
      <Checkbox
        defaultChecked
        viewProps={{ label: 'Checked checkbox' }}
      />,
    )

    const checkbox = getByRole('checkbox', {
      name: 'Checked checkbox',
    })
    const shell = checkbox.parentElement as HTMLElement
    const visual = checkbox.nextElementSibling as HTMLElement
    const path = shell.querySelector(
      '[data-weave-checkbox-check]',
    )
    const stylesheet =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-choice-control-styles]',
      )?.textContent ?? ''

    expect(shell.getAttribute('aria-hidden')).toBeNull()
    expect(visual.getAttribute('aria-hidden')).toBe('true')
    expect(path?.getAttribute('pathLength')).toBe('1')
    expect(
      defaultTheme.components.Checkbox?.states
        ?.checked?.background,
    ).toBe('primary')
    expect(
      defaultTheme.components.Checkbox?.states
        ?.checked?.indicatorBackground,
    ).toBeUndefined()

    expect(stylesheet).toContain(
      '--weave-component-background: var(--weave-choice-checked-background)',
    )
    expect(stylesheet).toContain(
      'stroke-dasharray: 1;',
    )
    expect(stylesheet).toContain(
      'stroke-dashoffset: 1;',
    )
    expect(stylesheet).toContain(
      'stroke-dashoffset: 0;',
    )
    expect(stylesheet).toContain(
      'transform: scale(0);',
    )
    expect(stylesheet).toContain(
      'transform: scale(1);',
    )
    expect(stylesheet).toContain(
      'var(--weave-motion-duration-normal)',
    )
    expect(stylesheet).toContain(
      ':active:not([aria-disabled="true"])',
    )
    expect(stylesheet).toContain(
      '.weave-choice-state-layer',
    )
    expect(stylesheet).toContain(
      '--weave-choice-state-layer-hover-opacity',
    )
    expect(stylesheet).toContain(
      '--weave-choice-state-layer-press-opacity',
    )
  })
})
