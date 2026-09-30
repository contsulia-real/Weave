import { expect, test } from '@playwright/test'

test('Playground renders Avatar image, fallback, initials, failure, and empty states', async ({
  page,
}) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Avatar', exact: true })).toBeVisible()

  const imageAvatar = page.locator('[data-testid="avatar-image"]')
  const initialsAvatar = page.locator('[data-testid="avatar-initials"]')
  const explicitAvatar = page.locator('[data-testid="avatar-explicit"]')
  const failedAvatar = page.locator('[data-testid="avatar-failed"]')
  const emptyAvatar = page.locator('[data-testid="avatar-empty"]')
  const tallAvatar = page.locator('[data-testid="avatar-height-only"]')

  const image = imageAvatar.locator('img')
  await expect(image).toBeVisible()
  await expect(initialsAvatar).toHaveText('AL')
  await expect(explicitAvatar).toHaveText('FX')
  await expect(failedAvatar).toHaveText('GH')
  await expect(emptyAvatar).toHaveText('')

  const imageVisual = await image.evaluate((element) => {
    const computed = getComputedStyle(element)
    return {
      objectFit: computed.objectFit,
      objectPosition: computed.objectPosition,
    }
  })
  expect(imageVisual.objectFit).toBe('cover')
  expect(imageVisual.objectPosition).toBe('50% 50%')

  const defaultMetrics = await initialsAvatar.evaluate((element) => {
    const computed = getComputedStyle(element)
    return {
      width: computed.width,
      height: computed.height,
      borderRadius: computed.borderRadius,
      background: computed.backgroundColor,
      borderWidth: computed.borderTopWidth,
    }
  })

  expect(defaultMetrics.width).toBe('40px')
  expect(defaultMetrics.height).toBe('40px')
  expect(defaultMetrics.borderRadius).not.toBe('0px')
  expect(defaultMetrics.background).not.toBe('rgba(0, 0, 0, 0)')
  expect(defaultMetrics.borderWidth).toBe('1px')

  const emptyBackground = await emptyAvatar.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  )
  expect(emptyBackground).not.toBe('rgba(0, 0, 0, 0)')

  const tallBounds = await tallAvatar.boundingBox()
  expect(tallBounds).not.toBeNull()
  expect(Math.abs(tallBounds!.width - tallBounds!.height)).toBeLessThan(0.5)
  expect(tallBounds!.height).toBeCloseTo(64, 0)

  const initialsFontSize = await initialsAvatar
    .locator('.weave-avatar-fallback-content')
    .evaluate((element) => getComputedStyle(element).fontSize)
  const tallFontSize = await tallAvatar
    .locator('.weave-avatar-fallback-content')
    .evaluate((element) => getComputedStyle(element).fontSize)
  expect(Number.parseFloat(initialsFontSize)).toBeCloseTo(16, 1)
  expect(Number.parseFloat(tallFontSize)).toBeCloseTo(25.6, 1)
})
