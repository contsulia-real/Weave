import { expect, test } from '@playwright/test'

test('Playground Slider uses native keyboard, track click, and drag interaction', async ({
  page,
}) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Slider', exact: true })).toBeVisible()

  const slider = page.locator('[data-testid="slider-controlled"]')
  await expect(slider).toHaveAttribute('type', 'range')
  await expect(slider).toHaveValue('40')

  await slider.focus()
  await page.keyboard.press('End')
  await expect(slider).toHaveValue('100')

  await page.keyboard.press('Home')
  await expect(slider).toHaveValue('0')

  await page.keyboard.press('ArrowRight')
  await expect(slider).toHaveValue('5')

  const bounds = await slider.boundingBox()
  expect(bounds).not.toBeNull()

  await slider.click({
    position: {
      x: bounds!.width * 0.75,
      y: bounds!.height / 2,
    },
  })
  expect(Number(await slider.inputValue())).toBeGreaterThan(60)

  await page.mouse.move(bounds!.x + bounds!.width * 0.25, bounds!.y + bounds!.height / 2)
  await page.mouse.down()
  await page.mouse.move(bounds!.x + bounds!.width * 0.85, bounds!.y + bounds!.height / 2, {
    steps: 8,
  })
  await page.mouse.up()
  expect(Number(await slider.inputValue())).toBeGreaterThan(75)
})

test('Playground Slider exposes the frozen size and visual defaults', async ({ page }) => {
  await page.goto('/')

  const small = page.locator('[data-testid="slider-small"]')
  const medium = page.locator('[data-testid="slider-medium"]')
  const large = page.locator('[data-testid="slider-large"]')
  const custom = page.locator('[data-testid="slider-custom-range"]')
  const disabled = page.locator('[data-testid="slider-disabled"]')

  await expect(small).toBeVisible()
  await expect(medium).toBeVisible()
  await expect(large).toBeVisible()

  const [smallBox, mediumBox, largeBox] = await Promise.all([
    small.boundingBox(),
    medium.boundingBox(),
    large.boundingBox(),
  ])
  expect(smallBox).not.toBeNull()
  expect(mediumBox).not.toBeNull()
  expect(largeBox).not.toBeNull()
  expect(smallBox!.width).toBeCloseTo(256, 0)
  expect(smallBox!.height).toBeCloseTo(16, 0)
  expect(mediumBox!.height).toBeCloseTo(20, 0)
  expect(largeBox!.height).toBeCloseTo(24, 0)

  const mediumVisual = await medium.evaluate((element) => {
    const computed = getComputedStyle(element)
    return {
      backgroundImage: computed.backgroundImage,
      cursor: computed.cursor,
      outlineWidth: computed.outlineWidth,
    }
  })
  expect(mediumVisual.backgroundImage).toContain('linear-gradient')
  expect(mediumVisual.cursor).toBe('pointer')
  expect(mediumVisual.outlineWidth).toBe('0px')

  await expect(custom).toHaveAttribute('min', '-20')
  await expect(custom).toHaveAttribute('max', '20')
  await expect(custom).toHaveAttribute('step', '5')
  await expect(custom).toHaveValue('5')
  await expect(disabled).toBeDisabled()
})
