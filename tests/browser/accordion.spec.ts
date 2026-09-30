import { expect, test } from '@playwright/test'

test('Accordion keeps native button keyboard behavior and default non-collapsible state', async ({
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
  await expect(account).toHaveAttribute('aria-expanded', 'true')

  await security.focus()
  await page.keyboard.press('Enter')
  await expect(security).toHaveAttribute('aria-expanded', 'true')
  await expect(account).toHaveAttribute('aria-expanded', 'false')
  await expect(accordion.getByRole('region', { name: 'Security' })).toBeVisible()
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
