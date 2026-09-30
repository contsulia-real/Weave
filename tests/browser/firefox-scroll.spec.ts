import { expect, test } from '@playwright/test'

const SCROLL_LINKED_WARNING = 'scroll-linked positioning effect'

test('scroll-linked UI stays functional without Firefox APZ positioning warnings', async ({
  page,
}) => {
  const warnings: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'warning') {
      warnings.push(message.text())
    }
  })

  await page.goto('/tests/browser/fixture.html')

  const scrollBox = page.locator('[data-testid="scroll-box"]')
  await expect(scrollBox).toBeVisible()

  await page.getByRole('button', { name: 'Open anchored popover' }).click()
  const panel = page.locator('[data-testid="popover-panel"]')
  await expect(panel).toBeVisible()

  const beforeTop = await panel.evaluate((element) => element.getBoundingClientRect().top)

  await scrollBox.evaluate((element) => {
    element.scrollTop += 24
  })

  await page.waitForFunction(
    ({ before }) => {
      const panel = document.querySelector<HTMLElement>('[data-testid="popover-panel"]')
      if (panel === null) return false
      return Math.abs(panel.getBoundingClientRect().top - before) >= 1
    },
    { before: beforeTop },
  )

  const scrollbar = page.locator('[data-weave-scrollbar-orientation="vertical"]')
  await expect(scrollbar).toBeVisible()

  await scrollBox.evaluate((element) => {
    element.scrollTop += 40
  })
  await page.waitForTimeout(100)

  expect(warnings.filter((warning) => warning.includes(SCROLL_LINKED_WARNING))).toEqual([])
})
