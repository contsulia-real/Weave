import { expect, test } from '@playwright/test'

test('Playground renders Skeleton shapes and shimmer', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Skeleton', exact: true })).toBeVisible()

  const rect = page.locator('[data-testid="skeleton-rect"]')
  const circle = page.locator('[data-testid="skeleton-circle"]')
  const text = page.locator('[data-testid="skeleton-text"]')
  const mediumText = page.locator('[data-testid="skeleton-text-medium"]')
  const shortText = page.locator('[data-testid="skeleton-text-short"]')

  await expect(rect).toBeVisible()
  await expect(circle).toBeVisible()
  await expect(text).toBeVisible()
  await expect(mediumText).toBeVisible()
  await expect(shortText).toBeVisible()

  const rectVisual = await rect.evaluate((element) => {
    const computed = getComputedStyle(element)
    const shimmer = getComputedStyle(element, '::after')
    return {
      background: computed.backgroundColor,
      radius: computed.borderRadius,
      animationName: shimmer.animationName,
      animationDuration: shimmer.animationDuration,
    }
  })

  expect(rectVisual.background).not.toBe('rgba(0, 0, 0, 0)')
  expect(rectVisual.background).not.toBe('rgb(247, 242, 236)')
  expect(rectVisual.radius).not.toBe('0px')
  expect(rectVisual.animationName).toBe('weave-skeleton-shimmer')
  expect(rectVisual.animationDuration).toBe('1.28s')

  const circleBounds = await circle.boundingBox()
  expect(circleBounds).not.toBeNull()
  expect(Math.abs(circleBounds!.width - circleBounds!.height)).toBeLessThan(0.5)

  const textMetrics = await text.evaluate((element) => {
    const computed = getComputedStyle(element)
    return {
      height: computed.height,
      lineHeight: computed.lineHeight,
    }
  })
  expect(textMetrics.height).toBe('24px')
  expect(textMetrics.lineHeight).toBe('24px')

  const textBounds = await text.boundingBox()
  const mediumTextBounds = await mediumText.boundingBox()
  const shortTextBounds = await shortText.boundingBox()
  expect(textBounds).not.toBeNull()
  expect(mediumTextBounds).not.toBeNull()
  expect(shortTextBounds).not.toBeNull()
  expect(textBounds!.width).toBeGreaterThan(mediumTextBounds!.width)
  expect(mediumTextBounds!.width).toBeGreaterThan(shortTextBounds!.width)
})

test('Skeleton stops shimmer for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const rect = page.locator('[data-testid="skeleton-rect"]')
  await expect(rect).toHaveAttribute('data-weave-reduced-motion', 'reduce')

  const animationName = await rect.evaluate(
    (element) => getComputedStyle(element, '::after').animationName,
  )
  expect(animationName).toBe('none')
})
