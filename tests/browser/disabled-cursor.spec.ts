import { expect, test } from '@playwright/test'

test('every rendered disabled Weave component uses not-allowed cursor', async ({ page }) => {
  await page.goto('/')

  const disabled = page.locator('[aria-disabled="true"], :disabled')
  const count = await disabled.count()

  expect(count).toBeGreaterThan(0)

  for (let index = 0; index < count; index += 1) {
    await expect
      .poll(() => disabled.nth(index).evaluate((element) => getComputedStyle(element).cursor))
      .toBe('not-allowed')
  }

  const switchField = page
    .locator('[data-testid="switch-disabled"]')
    .locator('xpath=ancestor::*[@data-weave-switch-field][1]')
  const radioField = page
    .locator('[data-testid="radio-disabled"]')
    .locator('xpath=ancestor::*[@data-weave-choice-field][1]')
  const checkboxField = page
    .locator('[data-testid="checkbox-disabled"]')
    .locator('xpath=ancestor::*[@data-weave-choice-field][1]')

  for (const field of [switchField, radioField, checkboxField]) {
    await expect(field).toHaveCSS('cursor', 'not-allowed')
  }
})

test('disabled overlay items use not-allowed cursor', async ({ page }) => {
  await page.goto('/')

  const select = page.locator('.weave-select').filter({ hasText: 'Design' }).first()
  await select.click()

  const disabledOption = page.locator('.weave-option[aria-disabled="true"]').first()
  await expect(disabledOption).toBeVisible()
  await expect(disabledOption).toHaveCSS('cursor', 'not-allowed')

  await page.keyboard.press('Escape')

  await page.getByRole('button', { name: 'Open menu' }).click()

  const disabledMenuItem = page.locator('.weave-menu-item[aria-disabled="true"]').first()
  await expect(disabledMenuItem).toBeVisible()
  await expect(disabledMenuItem).toHaveCSS('cursor', 'not-allowed')
})
