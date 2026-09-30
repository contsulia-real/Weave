import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/browser/audit-fixture.html')
})

test('modal Dialog uses the native top layer and restores focus after Escape', async ({ page }) => {
  const openButton = page.getByTestId('browser-modal-open')
  await openButton.click()

  const dialog = page.locator('dialog[data-weave-dialog-modal="true"]')
  await expect(dialog).toBeVisible()
  await expect(page.getByRole('button', { name: 'Browser modal cancel' })).toBeFocused()

  expect(
    await dialog.evaluate((element) => {
      const nativeDialog = element as HTMLDialogElement
      return nativeDialog.open && nativeDialog.matches(':modal')
    }),
  ).toBe(true)

  await page.keyboard.press('Escape')

  await expect(dialog).toHaveCount(0)
  await expect(openButton).toBeFocused()
})

test('virtualized List window-renders and focuses an offscreen item through native scrolling', async ({
  page,
}) => {
  const list = page.getByTestId('browser-virtual-list')
  const mountedItems = list.locator('[data-weave-list-item]')

  await expect(mountedItems.first()).toBeVisible()
  expect(await mountedItems.count()).toBeLessThan(100)

  const first = list.getByRole('option', { name: 'Browser virtual row 1' })
  await first.focus()
  await page.keyboard.press('End')

  const last = list.getByRole('option', { name: 'Browser virtual row 100' })
  await expect(last).toBeFocused()
  expect(await list.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
  expect(await mountedItems.count()).toBeLessThan(100)
})

test('Tabs keeps one shared indicator and resolves it to the selected tab geometry', async ({
  page,
}) => {
  const tabs = page.getByTestId('browser-tabs')
  const first = tabs.getByRole('tab', { name: 'Browser first tab' })
  const second = tabs.getByRole('tab', { name: 'Browser second tab' })
  const indicator = tabs.locator('[data-weave-tab-indicator]')

  await expect(indicator).toHaveCount(1)
  await indicator.evaluate((element) => {
    element.setAttribute('data-audit-indicator', 'same-node')
  })

  await second.click()
  await expect(second).toHaveAttribute('aria-selected', 'true')
  await expect(indicator).toHaveAttribute('data-audit-indicator', 'same-node')
  await expect(indicator).toHaveCount(1)

  await expect
    .poll(async () => {
      const [tabBox, indicatorBox] = await Promise.all([
        second.boundingBox(),
        indicator.boundingBox(),
      ])
      if (tabBox === null || indicatorBox === null) return false

      return (
        Math.abs(tabBox.x - indicatorBox.x) < 1 && Math.abs(tabBox.width - indicatorBox.width) < 1
      )
    })
    .toBe(true)

  await first.click()
  await expect(first).toHaveAttribute('aria-selected', 'true')
  await expect(indicator).toHaveAttribute('data-audit-indicator', 'same-node')
})
