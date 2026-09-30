import { expect, test } from '@playwright/test'

test('Accordion keeps native button keyboard behavior and can fully collapse in single mode', async ({
  page,
}) => {
  await page.goto('/')

  const accordion = page.getByTestId('accordion-default')
  const account = accordion.getByRole('button', { name: 'Account' })
  const security = accordion.getByRole('button', { name: 'Security' })

  await expect(account).toHaveAttribute('aria-expanded', 'true')
  await expect(accordion.getByRole('region', { name: 'Account' })).toBeVisible()

  await account.focus()
  await page.keyboard.press('Space')
  await expect(account).toHaveAttribute('aria-expanded', 'false')
  await expect(accordion.getByRole('region', { name: 'Account' })).toBeHidden()

  await security.focus()
  await page.keyboard.press('Enter')
  await expect(security).toHaveAttribute('aria-expanded', 'true')
  await expect(account).toHaveAttribute('aria-expanded', 'false')
  await expect(accordion.getByRole('region', { name: 'Security' })).toBeVisible()
})

test('Accordion animates panel height continuously instead of snapping layout', async ({
  page,
}) => {
  await page.goto('/')

  const accordion = page.getByTestId('accordion-default')
  const account = accordion.getByRole('button', { name: 'Account' })
  const item = accordion.locator('[data-weave-accordion-item-value="account"]')
  const panel = accordion.locator('[data-weave-accordion-panel-value="account"]')
  const indicator = account.locator('.weave-accordion-trigger__indicator')

  const openPanelBox = await panel.boundingBox()
  expect(openPanelBox).not.toBeNull()
  expect(openPanelBox!.height).toBeGreaterThan(0)
  await expect(item).toHaveCSS('transition-property', 'grid-template-rows')
  await expect(indicator).toHaveCSS('transform', 'matrix(0, 1, -1, 0, 0, 0)')

  await account.evaluate((element) => (element as HTMLButtonElement).click())
  await expect(account).toHaveAttribute('aria-expanded', 'false')

  const midMotion = await item.evaluate(async (element) => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    })

    const panel = element.querySelector<HTMLElement>('[data-weave-accordion-panel]')
    const animation = element.getAnimations()[0]
    const timing = animation?.effect?.getTiming()

    return {
      panelHeight: panel?.getBoundingClientRect().height ?? 0,
      playState: animation?.playState ?? null,
      duration: typeof timing?.duration === 'number' ? timing.duration : null,
    }
  })

  expect(midMotion.playState).toBe('running')
  expect(midMotion.duration).not.toBeNull()
  expect(midMotion.duration!).toBeGreaterThan(300)
  expect(midMotion.panelHeight).toBeGreaterThan(0)
  expect(midMotion.panelHeight).toBeLessThan(openPanelBox!.height)

  await page.waitForTimeout(850)
  const closedPanelBox = await panel.boundingBox()
  expect(closedPanelBox).not.toBeNull()
  expect(closedPanelBox!.height).toBeLessThanOrEqual(0.5)
  await expect(indicator).toHaveCSS('transform', 'none')
})

test('Accordion custom icons switch by state and multiple items can stay open', async ({
  page,
}) => {
  await page.goto('/')

  const accordion = page.getByTestId('accordion-multiple')
  const first = accordion.getByRole('button', { name: 'First section' })
  const second = accordion.getByRole('button', { name: 'Second section' })

  await expect(first).toHaveAttribute('aria-expanded', 'true')
  await expect(second).toHaveAttribute('aria-expanded', 'false')

  await second.click()

  await expect(first).toHaveAttribute('aria-expanded', 'true')
  await expect(second).toHaveAttribute('aria-expanded', 'true')
  await expect(accordion.getByRole('region', { name: 'First section' })).toBeVisible()
  await expect(accordion.getByRole('region', { name: 'Second section' })).toBeVisible()
})
