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

  it('uses one recessed control language with distinct radio and checkbox indicators', () => {
    render(
      <>
        <Radio viewProps={{ label: 'Radio' }} />
        <Checkbox viewProps={{ label: 'Checkbox' }} />
      </>,
    )

    const stylesheet =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-choice-control-styles]',
      )?.textContent ?? ''

    expect(stylesheet).toContain(
      '.weave-choice-control:checked',
    )
    expect(stylesheet).toContain(
      '.weave-radio)::before',
    )
    expect(stylesheet).toContain(
      '.weave-checkbox)::before',
    )
    expect(stylesheet).toContain(
      '.weave-checkbox)::after',
    )
    expect(stylesheet).toContain(
      '--weave-choice-indicator-shadow',
    )
    expect(stylesheet).toContain(
      'clip-path: polygon(',
    )
  })
})
