import { expect, test } from '@playwright/test'

test('Card renders its entity surface and keeps nested controls independent', async ({ page }) => {
  await page.goto('/tests/browser/fixture.html')

  const card = page.locator('[data-testid="interactive-card"]')
  await expect(card).toBeVisible()
  await expect(card).toHaveAttribute('role', 'button')
  await expect(card).toHaveAttribute('aria-pressed', 'true')

  const style = await card.evaluate((element) => {
    const computed = getComputedStyle(element)
    return {
      backgroundColor: computed.backgroundColor,
      borderRadius: computed.borderRadius,
      paddingTop: computed.paddingTop,
      boxShadow: computed.boxShadow,
    }
  })

  expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
  expect(style.borderRadius).not.toBe('0px')
  expect(style.paddingTop).toBe('16px')
  expect(style.boxShadow).not.toBe('none')

  await page.getByRole('button', { name: 'Inner action' }).click()
  await expect(card).toHaveAttribute('aria-pressed', 'true')

  await card.click({ position: { x: 8, y: 8 } })
  await expect(card).toHaveAttribute('aria-pressed', 'false')
})
