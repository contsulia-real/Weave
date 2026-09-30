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

  const field = slider.locator('xpath=ancestor::*[@data-weave-slider-field][1]')
  const label = field.locator('[data-weave-slider-label]')
  await label.click()
  await expect(slider).not.toBeFocused()
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

  await page.waitForTimeout(350)
  const beforeTrackPressThumb = await thumb.boundingBox()
  expect(beforeTrackPressThumb).not.toBeNull()

  await page.mouse.move(bounds!.x + bounds!.width * 0.75, bounds!.y + bounds!.height / 2)
  await page.mouse.down()

  await expect(control).toHaveAttribute('data-weave-slider-pointer-active', 'true')
  const trackPressedThumb = await thumb.boundingBox()
  expect(trackPressedThumb).not.toBeNull()
  expect(trackPressedThumb!.width).toBeLessThan(beforeTrackPressThumb!.width * 0.8)
  expect(trackPressedThumb!.height).toBeLessThan(beforeTrackPressThumb!.height * 0.8)

  await page.mouse.up()
  await expect(control).not.toHaveAttribute('data-weave-slider-pointer-active', 'true')
  await expect
    .poll(async () => (await thumb.boundingBox())?.width ?? 0)
    .toBeCloseTo(beforeTrackPressThumb!.width, 0)
  expect(Number(await slider.inputValue())).toBeGreaterThan(60)

  await page.waitForTimeout(350)
  const restingThumb = await thumb.boundingBox()
  expect(restingThumb).not.toBeNull()

  await page.mouse.move(
    restingThumb!.x + restingThumb!.width / 2,
    restingThumb!.y + restingThumb!.height / 2,
  )
  await page.mouse.down()

  expect(restingThumb!.width).toBeCloseTo(restingThumb!.height, 0)
  expect(restingThumb!.width).toBeCloseTo(20, 0)

  await expect(control).toHaveAttribute('data-weave-slider-pointer-active', 'true')
  const grabbedThumb = await thumb.boundingBox()
  expect(grabbedThumb).not.toBeNull()
  expect(grabbedThumb!.width).toBeLessThan(restingThumb!.width * 0.8)
  expect(grabbedThumb!.height).toBeLessThan(restingThumb!.height * 0.8)
  expect(grabbedThumb!.width).toBeCloseTo(grabbedThumb!.height, 0)

  await page.mouse.move(bounds!.x + bounds!.width * 0.9, bounds!.y + bounds!.height / 2, {
    steps: 8,
  })

  await expect(control).toHaveAttribute('data-weave-slider-dragging', 'true')
  await expect(control).toHaveAttribute('data-weave-slider-stepped', 'true')

  const steppedTransitions = await Promise.all([
    thumb.evaluate((element) => getComputedStyle(element).transitionProperty),
    control
      .locator('.weave-slider__active-track')
      .evaluate((element) => getComputedStyle(element).transitionProperty),
    control
      .locator('.weave-slider__inactive-track')
      .evaluate((element) => getComputedStyle(element).transitionProperty),
  ])
  expect(steppedTransitions[0]).toContain('left')
  expect(steppedTransitions[1]).toContain('width')
  expect(steppedTransitions[2]).toContain('left')

  const stretchedThumb = await thumb.boundingBox()
  expect(stretchedThumb).not.toBeNull()
  expect(stretchedThumb!.width).toBeGreaterThan(grabbedThumb!.width)
  expect(stretchedThumb!.width).toBeLessThanOrEqual(restingThumb!.width * 1.35 + 0.5)
  expect(stretchedThumb!.height).toBeCloseTo(grabbedThumb!.height, 0)

  await page.mouse.up()

  await expect(control).not.toHaveAttribute('data-weave-slider-pointer-active', 'true')
  await expect(control).not.toHaveAttribute('data-weave-slider-dragging', 'true')
  await expect
    .poll(async () => (await thumb.boundingBox())?.width ?? 0)
    .toBeCloseTo(restingThumb!.width, 0)

  expect(Number(await slider.inputValue())).toBeGreaterThan(75)
})

test('continuous Slider stays direct while stepped Slider keeps spring transitions during drag', async ({
  page,
}) => {
  await page.goto('/')

  const steppedControl = page.locator('[data-testid="slider-controlled"]').locator('..')
  const continuousControl = page.locator('[data-testid="slider-medium"]').locator('..')

  await expect(steppedControl).toHaveAttribute('data-weave-slider-stepped', 'true')
  await expect(continuousControl).toHaveAttribute('data-weave-slider-stepped', 'false')

  await Promise.all([
    steppedControl.evaluate((element) => {
      element.dataset.weaveSliderDragging = 'true'
    }),
    continuousControl.evaluate((element) => {
      element.dataset.weaveSliderDragging = 'true'
    }),
  ])

  const steppedTransitions = await Promise.all([
    steppedControl
      .locator('.weave-slider__thumb')
      .evaluate((element) => getComputedStyle(element).transitionProperty),
    steppedControl
      .locator('.weave-slider__active-track')
      .evaluate((element) => getComputedStyle(element).transitionProperty),
    steppedControl
      .locator('.weave-slider__inactive-track')
      .evaluate((element) => getComputedStyle(element).transitionProperty),
  ])
  expect(steppedTransitions[0]).toContain('left')
  expect(steppedTransitions[1]).toContain('width')
  expect(steppedTransitions[2]).toContain('left')

  const continuousTransitions = await Promise.all([
    continuousControl
      .locator('.weave-slider__thumb')
      .evaluate((element) => getComputedStyle(element).transitionProperty),
    continuousControl
      .locator('.weave-slider__active-track')
      .evaluate((element) => getComputedStyle(element).transitionProperty),
    continuousControl
      .locator('.weave-slider__inactive-track')
      .evaluate((element) => getComputedStyle(element).transitionProperty),
  ])
  expect(continuousTransitions).toEqual(['none', 'none', 'none'])
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
  expect(smallBox!.height).toBeCloseTo(16, 0)
  expect(mediumBox!.height).toBeCloseTo(20, 0)
  expect(largeBox!.height).toBeCloseTo(24, 0)

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
  expect(activeVisual.shadow).toContain('2px')
  expect(activeVisual.shadow).not.toContain('3px')
  expect(activeVisual.shadow).not.toBe(thumbVisual.shadow)

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
  expect(thumbBox!.width).toBeCloseTo(20, 0)
  expect(thumbBox!.height).toBeCloseTo(20, 0)
  const activeGap = thumbBox!.x - (activeBox!.x + activeBox!.width)
  const inactiveGap = inactiveBox!.x - (thumbBox!.x + thumbBox!.width)
  expect(activeGap).toBeCloseTo(6, 0)
  expect(inactiveGap).toBeCloseTo(6, 0)
  expect(activeVisual.insideRadius).toBe('0px')
  expect(inactiveVisual.insideRadius).toBe('0px')

  const continuousHandleDot = mediumControl.locator('.weave-slider__thumb-dot')
  await expect(continuousHandleDot).toHaveCount(1)
  const continuousHandleDotBox = await continuousHandleDot.boundingBox()
  expect(continuousHandleDotBox).not.toBeNull()
  const [handleDotVisual, handleVisual] = await Promise.all([
    continuousHandleDot.evaluate((element) => {
      const computed = getComputedStyle(element)
      return {
        background: computed.backgroundColor,
        zIndex: computed.zIndex,
        visibility: computed.visibility,
        opacity: computed.opacity,
      }
    }),
    thumb.evaluate((element) => getComputedStyle(element).backgroundColor),
  ])
  expect(handleDotVisual.background).not.toBe(handleVisual)
  expect(handleDotVisual.zIndex).toBe('1')
  expect(handleDotVisual.visibility).toBe('visible')
  expect(handleDotVisual.opacity).toBe('1')
  expect(continuousHandleDotBox!.width).toBeCloseTo(4, 0)
  expect(continuousHandleDotBox!.height).toBeCloseTo(4, 0)
  expect(continuousHandleDotBox!.x + continuousHandleDotBox!.width / 2).toBeCloseTo(
    thumbBox!.x + thumbBox!.width / 2,
    0,
  )
  expect(continuousHandleDotBox!.y + continuousHandleDotBox!.height / 2).toBeCloseTo(
    thumbBox!.y + thumbBox!.height / 2,
    0,
  )

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
  await expect(mediumControl.locator('.weave-slider__stop-indicator')).toHaveCount(0)

  await expect(custom).toHaveAttribute('min', '-20')
  await expect(custom).toHaveAttribute('max', '20')
  await expect(custom).toHaveAttribute('step', '5')
  await expect(custom).toHaveValue('5')
  const customControl = custom.locator('..')
  await expect(customControl.locator('.weave-slider__step')).toHaveCount(9)
  await expect(customControl.locator('.weave-slider__stop-indicator')).toHaveCount(0)
  await expect(customControl.locator('.weave-slider__thumb-dot')).toHaveCount(1)

  const customActiveTrack = customControl.locator('.weave-slider__active-track')
  const customTrack = customControl.locator('.weave-slider__inactive-track')
  const customRange = customControl.locator('.weave-slider__range')
  const steps = customControl.locator('.weave-slider__step')
  const firstStep = steps.first()
  const secondStep = steps.nth(1)
  const thirdStep = steps.nth(2)
  const penultimateStep = steps.nth(7)
  const lastStep = steps.last()
  const [
    customActiveTrackBox,
    customTrackBox,
    customRangeBox,
    firstStepBox,
    secondStepBox,
    thirdStepBox,
    penultimateStepBox,
    lastStepBox,
  ] = await Promise.all([
    customActiveTrack.boundingBox(),
    customTrack.boundingBox(),
    customRange.boundingBox(),
    firstStep.boundingBox(),
    secondStep.boundingBox(),
    thirdStep.boundingBox(),
    penultimateStep.boundingBox(),
    lastStep.boundingBox(),
  ])
  expect(customActiveTrackBox).not.toBeNull()
  expect(customTrackBox).not.toBeNull()
  expect(customRangeBox).not.toBeNull()
  expect(firstStepBox).not.toBeNull()
  expect(secondStepBox).not.toBeNull()
  expect(thirdStepBox).not.toBeNull()
  expect(penultimateStepBox).not.toBeNull()
  expect(lastStepBox).not.toBeNull()
  expect(firstStepBox!.width).toBeCloseTo(4, 0)
  expect(firstStepBox!.height).toBeCloseTo(4, 0)
  expect(firstStepBox!.y - customTrackBox!.y).toBeCloseTo(6, 0)
  expect(
    customTrackBox!.y + customTrackBox!.height - (firstStepBox!.y + firstStepBox!.height),
  ).toBeCloseTo(6, 0)
  const centerX = (box: NonNullable<typeof firstStepBox>) => box.x + box.width / 2
  expect(centerX(firstStepBox!)).toBeCloseTo(customRangeBox!.x, 1)
  expect(centerX(lastStepBox!)).toBeCloseTo(customRangeBox!.x + customRangeBox!.width, 1)
  expect(firstStepBox!.x).toBeGreaterThanOrEqual(customActiveTrackBox!.x - 0.5)
  expect(firstStepBox!.x + firstStepBox!.width).toBeLessThanOrEqual(
    customActiveTrackBox!.x + customActiveTrackBox!.width + 0.5,
  )
  expect(lastStepBox!.x).toBeGreaterThanOrEqual(customTrackBox!.x - 0.5)
  expect(lastStepBox!.x + lastStepBox!.width).toBeLessThanOrEqual(
    customTrackBox!.x + customTrackBox!.width + 0.5,
  )

  const firstGap = centerX(secondStepBox!) - centerX(firstStepBox!)
  const middleGap = centerX(thirdStepBox!) - centerX(secondStepBox!)
  const lastGap = centerX(lastStepBox!) - centerX(penultimateStepBox!)
  expect(firstGap).toBeCloseTo(middleGap, 0)
  expect(lastGap).toBeCloseTo(middleGap, 0)

  const currentStep = steps.nth(5)
  const previousStep = steps.nth(4)
  const nextStep = steps.nth(6)
  const customThumb = customControl.locator('.weave-slider__thumb')
  const [currentStepBox, previousStepBox, nextStepBox, customThumbBox] = await Promise.all([
    currentStep.boundingBox(),
    previousStep.boundingBox(),
    nextStep.boundingBox(),
    customThumb.boundingBox(),
  ])
  expect(currentStepBox).not.toBeNull()
  expect(previousStepBox).not.toBeNull()
  expect(nextStepBox).not.toBeNull()
  expect(customThumbBox).not.toBeNull()

  const currentStepCenter = centerX(currentStepBox!)
  const customThumbCenter = centerX(customThumbBox!)
  expect(currentStepCenter).toBeCloseTo(customThumbCenter, 1)

  const previousDistance = customThumbCenter - centerX(previousStepBox!)
  const nextDistance = centerX(nextStepBox!) - customThumbCenter
  expect(previousDistance).toBeCloseTo(nextDistance, 1)

  const activeStep = customControl.locator('[data-weave-slider-step-active="true"]').first()
  const inactiveStep = customControl.locator('[data-weave-slider-step-active="false"]').first()
  const [activeStepColor, inactiveStepColor, activeTrackColor] = await Promise.all([
    activeStep.evaluate((element) => getComputedStyle(element).backgroundColor),
    inactiveStep.evaluate((element) => getComputedStyle(element).backgroundColor),
    customControl
      .locator('.weave-slider__active-track')
      .evaluate((element) => getComputedStyle(element).backgroundColor),
  ])
  expect(activeStepColor).not.toBe(activeTrackColor)
  expect(inactiveStepColor).toBe(activeTrackColor)

  await medium.focus()
  await page.keyboard.press('End')
  await expect(medium).toHaveValue('100')
  await page.waitForTimeout(350)
  const maxInactiveBox = await mediumControl.locator('.weave-slider__inactive-track').boundingBox()
  expect(maxInactiveBox).not.toBeNull()
  expect(maxInactiveBox!.width).toBeLessThanOrEqual(0.5)

  await custom.focus()
  await page.keyboard.press('End')
  await expect(custom).toHaveValue('20')
  await page.waitForTimeout(350)
  const steppedMaxInactiveBox = await customTrack.boundingBox()
  expect(steppedMaxInactiveBox).not.toBeNull()
  expect(steppedMaxInactiveBox!.width).toBeLessThanOrEqual(0.5)

  await expect(disabled).toBeDisabled()
  expect(await disabled.evaluate((element) => getComputedStyle(element).cursor)).toBe('not-allowed')
})
