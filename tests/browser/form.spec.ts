import { expect, test } from '@playwright/test'

test('Form keeps native constraint validation and submits custom control values', async ({
  page,
}) => {
  await page.goto('/')

  const form = page.getByTestId('form-demo')
  const email = page.getByTestId('form-email')
  const result = page.getByTestId('form-result')

  await expect(result).toHaveText('Not submitted')
  await form.getByRole('button', { name: 'Submit' }).click()

  await expect(result).toHaveText('Not submitted')
  await expect(email).toBeFocused()

  await email.fill('weave@example.com')
  await form.getByRole('button', { name: 'Submit' }).click()

  const submitted = JSON.parse((await result.textContent()) ?? '{}') as Record<string, string>
  expect(submitted).toMatchObject({
    email: 'weave@example.com',
    displayName: 'Weave user',
    country: 'us',
    framework: 'react',
    notifications: 'on',
  })
})

test('Form reset restores uncontrolled Select, Combobox and Switch defaults', async ({ page }) => {
  await page.goto('/')

  const form = page.getByTestId('form-demo')
  const country = page.getByTestId('form-country')
  const framework = page.getByTestId('form-framework')
  const notifications = page.getByTestId('form-notifications')

  await country.click()
  await page.getByRole('option', { name: 'Canada' }).click()
  await expect(country).toContainText('Canada')

  await framework.fill('Vue')
  await page.getByRole('option', { name: 'Vue' }).click()
  await expect(framework).toHaveValue('Vue')

  await notifications.click()
  await expect(notifications).toHaveAttribute('aria-checked', 'false')

  await form.getByRole('button', { name: 'Reset' }).click()

  await expect(page.getByTestId('form-result')).toHaveText('Reset')
  await expect(country).toContainText('United States')
  await expect(framework).toHaveValue('React')
  await expect(notifications).toHaveAttribute('aria-checked', 'true')

  const formData = await form.evaluate((element) =>
    Object.fromEntries(new FormData(element as HTMLFormElement)),
  )

  expect(formData).toMatchObject({
    displayName: 'Weave user',
    country: 'us',
    framework: 'react',
    notifications: 'on',
  })
})

test('FormField exposes label, description, error and required semantics to controls', async ({
  page,
}) => {
  await page.goto('/')

  const email = page.getByTestId('form-email')
  const displayName = page.getByTestId('form-display-name')

  await expect(email).toHaveAttribute('required', '')
  await expect(email).toHaveAttribute('aria-required', 'true')
  await expect(email).toHaveAttribute('aria-labelledby', /weave-form-field-.*-label/)
  await expect(email).toHaveAttribute('aria-describedby', /weave-form-field-.*-description/)

  await expect(displayName).toHaveAttribute('aria-invalid', 'true')
  await expect(displayName).toHaveAttribute('aria-describedby', /weave-form-field-.*-error/)
  await expect(page.getByText('This example shows an application error immediately.')).toBeVisible()
})
