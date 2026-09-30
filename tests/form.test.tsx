import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  Button,
  Checkbox,
  Combobox,
  ComboboxOption,
  createTheme,
  Form,
  FormDescription,
  FormError,
  FormField,
  FormFieldset,
  FormLabel,
  FormLegend,
  Input,
  Radio,
  Select,
  SelectOption,
  Slider,
  Switch,
  ThemeProvider,
} from '../src'

afterEach(cleanup)

describe('Form', () => {
  it('renders a real form and real submit / reset button types', () => {
    const { getByTestId, getByRole } = render(
      <Form viewProps={{ data: { testid: 'form' } }}>
        <Button type="submit" text="Submit" />
        <Button type="reset" text="Reset" />
      </Form>,
    )

    expect(getByTestId('form').tagName).toBe('FORM')
    expect((getByRole('button', { name: 'Submit' }) as HTMLButtonElement).type).toBe('submit')
    expect((getByRole('button', { name: 'Reset' }) as HTMLButtonElement).type).toBe('reset')
  })

  it('connects convenience label, description, error and required semantics to Input', () => {
    const { getByRole, getByText } = render(
      <FormField
        label="Email"
        description="Used for notifications."
        error="Email is unavailable."
        required
      >
        <Input name="email" />
      </FormField>,
    )

    const input = getByRole('textbox') as HTMLInputElement
    const labelId = input.getAttribute('aria-labelledby')?.split(/\s+/)[0] ?? ''
    const label = document.getElementById(labelId)
    const description = getByText('Used for notifications.')
    const error = getByText('Email is unavailable.')

    expect(label?.textContent).toContain('Email')
    expect(input.required).toBe(true)
    expect(input.getAttribute('aria-required')).toBe('true')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-labelledby')?.split(/\s+/)).toContain(labelId)
    expect(input.getAttribute('aria-describedby')?.split(/\s+/)).toEqual(
      expect.arrayContaining([description.id, error.id]),
    )
    expect(getByText('*')).toBeDefined()
  })

  it('supports explicit FormLabel / FormDescription / FormError composition', () => {
    const { getByRole, getByText } = render(
      <FormField required>
        <FormLabel>Name</FormLabel>
        <Input name="name" />
        <FormDescription>Public display name.</FormDescription>
        <FormError>Name is already used.</FormError>
      </FormField>,
    )

    const input = getByRole('textbox')
    const labelId = input.getAttribute('aria-labelledby')?.split(/\s+/)[0] ?? ''
    const label = document.getElementById(labelId)
    const description = getByText('Public display name.')
    const error = getByText('Name is already used.')

    expect(label?.textContent).toContain('Name')
    expect(input.getAttribute('aria-labelledby')?.split(/\s+/)).toContain(labelId)
    expect(input.getAttribute('aria-describedby')?.split(/\s+/)).toEqual(
      expect.arrayContaining([description.id, error.id]),
    )
    expect(input.getAttribute('aria-invalid')).toBe('true')
  })

  it('shows an application error immediately without touched or submitted state', () => {
    const { getByText } = render(
      <FormField label="Name" error="Immediate error">
        <Input />
      </FormField>,
    )

    expect(getByText('Immediate error')).toBeDefined()
  })

  it('rejects duplicate convenience and explicit field text parts', () => {
    expect(() =>
      render(
        <FormField label="Name">
          <FormLabel>Other label</FormLabel>
          <Input />
        </FormField>,
      ),
    ).toThrow('FormField cannot use both label and FormLabel')
  })

  it('renders native fieldset and legend', () => {
    const { getByRole } = render(
      <FormFieldset>
        <FormLegend>Preferences</FormLegend>
        <Input />
      </FormFieldset>,
    )

    expect(getByRole('group').tagName).toBe('FIELDSET')
    expect(getByRole('group').querySelector('legend')?.textContent).toBe('Preferences')
  })

  it('submits native and custom controls through FormData', () => {
    const { getByTestId } = render(
      <Form viewProps={{ data: { testid: 'form' } }}>
        <Input name="email" defaultValue="weave@example.com" />
        <Select name="country" defaultValue="us">
          <SelectOption value="us" text="United States" />
          <SelectOption value="ca" text="Canada" />
        </Select>
        <Combobox name="framework" defaultValue="react">
          <ComboboxOption value="react" text="React" />
          <ComboboxOption value="vue" text="Vue" />
        </Combobox>
        <Switch name="notifications" defaultChecked />
        <Switch name="unchecked" />
        <Slider name="volume" defaultValue={40} />
        <Radio group="theme" value="dark" defaultChecked label="Dark" />
        <Checkbox group="permissions" value="write" defaultChecked label="Write" />
      </Form>,
    )

    const formData = new FormData(getByTestId('form') as HTMLFormElement)

    expect(formData.get('email')).toBe('weave@example.com')
    expect(formData.get('country')).toBe('us')
    expect(formData.get('framework')).toBe('react')
    expect(formData.get('notifications')).toBe('on')
    expect(formData.has('unchecked')).toBe(false)
    expect(formData.get('volume')).toBe('40')
    expect(formData.get('theme')).toBe('dark')
    expect(formData.get('permissions')).toBe('write')
  })

  it('uses the explicit Switch value and excludes a disabled custom control', () => {
    const { getByTestId } = render(
      <Form viewProps={{ data: { testid: 'form' } }}>
        <Switch name="notifications" value="enabled" defaultChecked />
        <Select name="disabled-select" defaultValue="one" disabled>
          <SelectOption value="one" text="One" />
        </Select>
      </Form>,
    )

    const formData = new FormData(getByTestId('form') as HTMLFormElement)
    expect(formData.get('notifications')).toBe('enabled')
    expect(formData.has('disabled-select')).toBe(false)
  })

  it('restores uncontrolled custom control defaults on native reset', async () => {
    const { getByTestId, getByRole } = render(
      <Form viewProps={{ data: { testid: 'form' } }}>
        <Input name="name" defaultValue="Default" viewProps={{ data: { testid: 'name' } }} />
        <Select name="country" defaultValue="us" viewProps={{ data: { testid: 'country' } }}>
          <SelectOption value="us" text="United States" />
          <SelectOption value="ca" text="Canada" />
        </Select>
        <Combobox
          name="framework"
          defaultValue="react"
          viewProps={{ data: { testid: 'framework' } }}
        >
          <ComboboxOption value="react" text="React" />
          <ComboboxOption value="vue" text="Vue" />
        </Combobox>
        <Switch
          name="notifications"
          defaultChecked
          viewProps={{ data: { testid: 'notifications' } }}
        />
        <Slider name="volume" defaultValue={20} viewProps={{ data: { testid: 'volume' } }} />
      </Form>,
    )

    fireEvent.change(getByTestId('name'), { target: { value: 'Changed' } })

    fireEvent.click(getByTestId('country'))
    fireEvent.click(getByRole('option', { name: 'Canada' }))

    fireEvent.change(getByTestId('framework'), { target: { value: 'Vue' } })
    fireEvent.click(getByRole('option', { name: 'Vue' }))

    fireEvent.click(getByTestId('notifications'))
    fireEvent.change(getByTestId('volume'), { target: { value: '80' } })

    const form = getByTestId('form') as HTMLFormElement
    let changed = new FormData(form)
    expect(changed.get('name')).toBe('Changed')
    expect(changed.get('country')).toBe('ca')
    expect(changed.get('framework')).toBe('vue')
    expect(changed.has('notifications')).toBe(false)
    expect(changed.get('volume')).toBe('80')

    fireEvent.reset(form)

    await waitFor(() => {
      const reset = new FormData(form)
      expect(reset.get('name')).toBe('Default')
      expect(reset.get('country')).toBe('us')
      expect(reset.get('framework')).toBe('react')
      expect(reset.get('notifications')).toBe('on')
      expect(reset.get('volume')).toBe('20')
    })
  })

  it('keeps controlled custom values under owner control during reset', async () => {
    const onValueChange = vi.fn()
    const { getByTestId } = render(
      <Form viewProps={{ data: { testid: 'form' } }}>
        <Select name="country" value="ca" onValueChange={onValueChange}>
          <SelectOption value="us" text="United States" />
          <SelectOption value="ca" text="Canada" />
        </Select>
      </Form>,
    )

    fireEvent.reset(getByTestId('form'))

    await waitFor(() => {
      expect(new FormData(getByTestId('form') as HTMLFormElement).get('country')).toBe('ca')
    })
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('connects FormField semantics to every supported existing form control', () => {
    const { getByTestId } = render(
      <Form>
        <FormField
          label="Select label"
          description="Select description"
          error="Select error"
          required
        >
          <Select defaultValue="one" viewProps={{ data: { testid: 'field-select' } }}>
            <SelectOption value="one" text="One" />
          </Select>
        </FormField>

        <FormField
          label="Combobox label"
          description="Combobox description"
          error="Combobox error"
          required
        >
          <Combobox defaultValue="one" viewProps={{ data: { testid: 'field-combobox' } }}>
            <ComboboxOption value="one" text="One" />
          </Combobox>
        </FormField>

        <FormField
          label="Switch label"
          description="Switch description"
          error="Switch error"
          required
        >
          <Switch viewProps={{ data: { testid: 'field-switch' } }} />
        </FormField>

        <FormField
          label="Slider label"
          description="Slider description"
          error="Slider error"
          required
        >
          <Slider viewProps={{ data: { testid: 'field-slider' } }} />
        </FormField>

        <FormField label="Radio field" description="Radio description" error="Radio error" required>
          <Radio label="Radio option" viewProps={{ data: { testid: 'field-radio' } }} />
        </FormField>

        <FormField
          label="Checkbox field"
          description="Checkbox description"
          error="Checkbox error"
          required
        >
          <Checkbox label="Checkbox option" viewProps={{ data: { testid: 'field-checkbox' } }} />
        </FormField>
      </Form>,
    )

    for (const testId of [
      'field-select',
      'field-combobox',
      'field-switch',
      'field-slider',
      'field-radio',
      'field-checkbox',
    ]) {
      const control = getByTestId(testId)
      const field = control.closest<HTMLElement>('[data-weave-form-field]')
      const label = field?.querySelector<HTMLElement>('[data-weave-form-label]')
      const description = field?.querySelector<HTMLElement>('[data-weave-form-description]')
      const error = field?.querySelector<HTMLElement>('[data-weave-form-error]')

      expect(label?.id).toBeTruthy()
      expect(description?.id).toBeTruthy()
      expect(error?.id).toBeTruthy()
      expect(control.getAttribute('aria-required')).toBe('true')
      expect(control.getAttribute('aria-invalid')).toBe('true')
      expect(control.getAttribute('aria-labelledby')?.split(/\s+/)).toContain(label?.id)
      expect(control.getAttribute('aria-describedby')?.split(/\s+/)).toEqual(
        expect.arrayContaining([description?.id, error?.id]),
      )
    }

    expect((getByTestId('field-combobox') as HTMLInputElement).required).toBe(false)
    expect((getByTestId('field-slider') as HTMLInputElement).required).toBe(true)
    expect((getByTestId('field-radio') as HTMLInputElement).required).toBe(true)
    expect((getByTestId('field-checkbox') as HTMLInputElement).required).toBe(true)
  })

  it('keeps controlled native controls under owner control during reset', async () => {
    const inputChange = vi.fn()
    const sliderChange = vi.fn()
    const radioChange = vi.fn()
    const checkboxChange = vi.fn()

    const { getByTestId } = render(
      <Form viewProps={{ data: { testid: 'controlled-form' } }}>
        <Input
          value="Owner"
          onChange={inputChange}
          viewProps={{ data: { testid: 'controlled-input' } }}
        />
        <Slider
          value={70}
          onChange={sliderChange}
          viewProps={{ data: { testid: 'controlled-slider' } }}
        />
        <Radio
          checked
          onChange={radioChange}
          label="Controlled radio"
          viewProps={{ data: { testid: 'controlled-radio' } }}
        />
        <Checkbox
          checked
          onChange={checkboxChange}
          label="Controlled checkbox"
          viewProps={{ data: { testid: 'controlled-checkbox' } }}
        />
      </Form>,
    )

    const form = getByTestId('controlled-form') as HTMLFormElement
    fireEvent.reset(form)

    await waitFor(() => {
      expect((getByTestId('controlled-input') as HTMLInputElement).value).toBe('Owner')
      expect((getByTestId('controlled-slider') as HTMLInputElement).value).toBe('70')
      expect((getByTestId('controlled-radio') as HTMLInputElement).checked).toBe(true)
      expect((getByTestId('controlled-checkbox') as HTMLInputElement).checked).toBe(true)
    })

    expect(inputChange).not.toHaveBeenCalled()
    expect(sliderChange).not.toHaveBeenCalled()
    expect(radioChange).not.toHaveBeenCalled()
    expect(checkboxChange).not.toHaveBeenCalled()
  })

  it('routes Form visual semantics through Form theme', () => {
    const theme = createTheme({
      components: {
        Form: {
          base: {
            formGap: 2,
            labelColor: 'warning',
            errorColor: 'primary',
          },
        },
      },
    })

    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Form viewProps={{ data: { testid: 'themed-form' } }}>
          <FormField label="Name" error="Error">
            <Input />
          </FormField>
        </Form>
      </ThemeProvider>,
    )

    const form = getByTestId('themed-form')
    const className = [...form.classList].find((name) => name.startsWith('weave-form-theme-'))
    expect(className).toBeDefined()

    const rule = (
      document.querySelector<HTMLStyleElement>(
        `style[data-weave-runtime-class="${className ?? ''}"]`,
      )?.textContent ?? ''
    ).replace(/\s+/g, '')

    expect(rule).toContain('--weave-form-gap:2rem;')
    expect(rule).toContain('--weave-form-label-color:var(--weave-color-warning,warning);')
    expect(rule).toContain('--weave-form-error-color:var(--weave-color-primary,primary);')
  })

  it('leaves browser constraint validation enabled for native required controls', () => {
    const { getByRole } = render(
      <Form>
        <FormField label="Email" required>
          <Input name="email" type="email" />
        </FormField>
      </Form>,
    )

    const input = getByRole('textbox') as HTMLInputElement
    expect(input.willValidate).toBe(true)
    expect(input.validity.valueMissing).toBe(true)

    fireEvent.change(input, { target: { value: 'weave@example.com' } })
    expect(input.checkValidity()).toBe(true)
  })
})
