import { expect, test } from '@playwright/test'

test('Playground exposes all Card interaction combinations', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Card', exact: true })).toBeVisible()
  await expect(page.getByText('Passive', { exact: true })).toBeVisible()

  const clickable = page.getByRole('button', { name: 'Clickable Card' })
  await clickable.click()
  await expect(clickable).toContainText('activations: 1')

  const selectable = page.getByRole('button', { name: 'Selectable Card', exact: true })
  await selectable.click()
  await expect(selectable).toHaveAttribute('aria-pressed', 'true')
  await expect(selectable).toContainText('selected: true')

  const combined = page.getByRole('button', { name: 'Clickable and selectable Card' })
  await expect(combined).toHaveAttribute('aria-pressed', 'false')
  await expect(combined).toContainText('activations: 0')
  await expect(combined).toContainText('selected: false')

  await page.getByRole('button', { name: 'Inner action · 0' }).click()
  await expect(page.getByRole('button', { name: 'Inner action · 1' })).toBeVisible()
  await expect(combined).toHaveAttribute('aria-pressed', 'false')
  await expect(combined).toContainText('activations: 0')

  await combined.click({ position: { x: 8, y: 8 } })
  await expect(combined).toHaveAttribute('aria-pressed', 'true')
  await expect(combined).toContainText('activations: 1')
  await expect(combined).toContainText('selected: true')
})
