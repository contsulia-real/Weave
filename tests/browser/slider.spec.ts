import { expect, test } from '@playwright/test'

test('Playground Slider keeps native value interaction and reuses Switch drag motion', async ({
  page,
}) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Slider', exact: true })).toBeVisible()

  const slider = page.locator('[data-testid="slider-controlled"]')
  const control = slider.locator('..')
  const thumb = control.locator('.weave-slider__thumb')

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

  await page.waitForTimeout(500)
  const restingThumb = await thumb.boundingBox()
  expect(restingThumb).not.toBeNull()

  await page.mouse.move(
    restingThumb!.x + restingThumb!.width / 2,
    restingThumb!.y + restingThumb!.height / 2,
  )
  await page.mouse.down()

  await expect(control).toHaveAttribute('data-weave-slider-pointer-active', 'true')
  const grabbedThumb = await thumb.boundingBox()
  expect(grabbedThumb).not.toBeNull()
  expect(grabbedThumb!.height).toBeLessThan(restingThumb!.height * 0.8)

  await page.mouse.move(bounds!.x + bounds!.width * 0.9, bounds!.y + bounds!.height / 2, {
    steps: 8,
  })

  await expect(control).toHaveAttribute('data-weave-slider-dragging', 'true')
  const stretchedThumb = await thumb.boundingBox()
  expect(stretchedThumb).not.toBeNull()
  expect(stretchedThumb!.width).toBeGreaterThan(grabbedThumb!.width)

  await page.mouse.up()

  await expect(control).not.toHaveAttribute('data-weave-slider-pointer-active', 'true')
  await expect(control).not.toHaveAttribute('data-weave-slider-dragging', 'true')
  await expect
    .poll(async () => (await thumb.boundingBox())?.width ?? 0)
    .toBeCloseTo(restingThumb!.width, 0)

  expect(Number(await slider.inputValue())).toBeGreaterThan(75)
})

test('Playground Slider expresses recessed inactive track, raised active surface, and step dots', async ({
  page,
}) => {
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
  expect(smallBox!.height).toBeCloseTo(33, 0)
  expect(mediumBox!.height).toBeCloseTo(44, 0)
  expect(largeBox!.height).toBeCloseTo(55, 0)

  const mediumControl = medium.locator('..')
  const activeTrack = mediumControl.locator('.weave-slider__active-track')
  const inactiveTrack = mediumControl.locator('.weave-slider__inactive-track')
  const thumb = mediumControl.locator('.weave-slider__thumb')

  const [inactiveVisual, activeVisual, thumbVisual] = await Promise.all([
    inactiveTrack.evaluate((element) => {
      const computed = getComputedStyle(element)
      return {
        background: computed.backgroundColor,
        shadow: computed.boxShadow,
        radius: computed.borderRadius,
        insideRadius: computed.borderTopLeftRadius,
      }
    }),
    activeTrack.evaluate((element) => {
      const computed = getComputedStyle(element)
      return {
        background: computed.backgroundColor,
        shadow: computed.boxShadow,
        radius: computed.borderRadius,
        insideRadius: computed.borderTopRightRadius,
      }
    }),
    thumb.evaluate((element) => {
      const computed = getComputedStyle(element)
      return {
        background: computed.backgroundColor,
        shadow: computed.boxShadow,
        radius: computed.borderRadius,
      }
    }),
  ])

  expect(inactiveVisual.radius).not.toBe('0px')
  expect(activeVisual.radius).not.toBe('0px')
  expect(thumbVisual.radius).not.toBe('0px')
  expect(inactiveVisual.shadow).toContain('inset')
  expect(activeVisual.shadow).not.toBe('none')
  expect(activeVisual.shadow).not.toContain('inset')
  expect(activeVisual.shadow).toBe(thumbVisual.shadow)

  const [activeBox, inactiveBox, thumbBox] = await Promise.all([
    activeTrack.boundingBox(),
    inactiveTrack.boundingBox(),
    thumb.boundingBox(),
  ])
  expect(activeBox).not.toBeNull()
  expect(inactiveBox).not.toBeNull()
  expect(thumbBox).not.toBeNull()
  expect(activeBox!.height).toBeCloseTo(16, 0)
  expect(inactiveBox!.height).toBeCloseTo(16, 0)
  expect(thumbBox!.width).toBeCloseTo(4, 0)
  expect(thumbBox!.height).toBeCloseTo(44, 0)
  const activeGap = thumbBox!.x - (activeBox!.x + activeBox!.width)
  const inactiveGap = inactiveBox!.x - (thumbBox!.x + thumbBox!.width)
  expect(activeGap).toBeCloseTo(6, 0)
  expect(inactiveGap).toBeCloseTo(6, 0)
  expect(activeVisual.insideRadius).toBe('2px')
  expect(inactiveVisual.insideRadius).toBe('2px')

  const switchOff = page.locator('[data-testid="switch-small"]')
  const switchOn = page.locator('[data-testid="switch-medium"]')
  const switchVisual = await Promise.all([
    switchOff.evaluate((element) => {
      const computed = getComputedStyle(element)
      return {
        background: computed.backgroundColor,
        shadow: computed.boxShadow,
      }
    }),
    switchOn.evaluate((element) => getComputedStyle(element).backgroundColor),
    switchOn.locator('.weave-switch__thumb').evaluate((element) => ({
      background: getComputedStyle(element).backgroundColor,
      shadow: getComputedStyle(element).boxShadow,
    })),
  ])

  expect(inactiveVisual.background).toBe(switchVisual[0].background)
  expect(inactiveVisual.shadow).toBe(switchVisual[0].shadow)
  expect(activeVisual.background).toBe(switchVisual[1])
  expect(thumbVisual.background).toBe(switchVisual[1])
  expect(thumbVisual.shadow).toBe(switchVisual[2].shadow)

  await expect(mediumControl.locator('.weave-slider__step')).toHaveCount(0)

  await expect(custom).toHaveAttribute('min', '-20')
  await expect(custom).toHaveAttribute('max', '20')
  await expect(custom).toHaveAttribute('step', '5')
  await expect(custom).toHaveValue('5')
  const customControl = custom.locator('..')
  await expect(customControl.locator('.weave-slider__step')).toHaveCount(8)
  await expect(customControl.locator('.weave-slider__stop-indicator')).toHaveCount(1)

  const activeStep = customControl.locator('[data-weave-slider-step-active="true"]').first()
  const inactiveStep = customControl.locator('[data-weave-slider-step-active="false"]').first()
  const [activeStepColor, inactiveStepColor, activeTrackColor, stopColor] = await Promise.all([
    activeStep.evaluate((element) => getComputedStyle(element).backgroundColor),
    inactiveStep.evaluate((element) => getComputedStyle(element).backgroundColor),
    customControl
      .locator('.weave-slider__active-track')
      .evaluate((element) => getComputedStyle(element).backgroundColor),
    customControl
      .locator('.weave-slider__stop-indicator')
      .evaluate((element) => getComputedStyle(element).backgroundColor),
  ])
  expect(activeStepColor).not.toBe(activeTrackColor)
  expect(inactiveStepColor).toBe(activeTrackColor)
  expect(stopColor).toBe(activeTrackColor)

  await expect(disabled).toBeDisabled()
  expect(await disabled.evaluate((element) => getComputedStyle(element).cursor)).toBe('not-allowed')
})
