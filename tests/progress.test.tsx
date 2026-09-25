import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Progress } from '../src'

afterEach(cleanup)

describe('Progress', () => {
  it('exposes undetermined semantics without a numeric value', () => {
    const { getByRole } = render(
      <Progress
        undetermined
        mode="spin"
        size="small"
        color="success"
        speed="fast"
      />,
    )

    const element = getByRole('progressbar')

    expect(element.getAttribute('aria-busy')).toBe('true')
    expect(element.getAttribute('aria-valuemin')).toBeNull()
    expect(element.getAttribute('aria-valuemax')).toBeNull()
    expect(element.getAttribute('aria-valuenow')).toBeNull()
    expect(element.className).toContain('weave-progress--spin')
    expect(element.className).toContain(
      'weave-progress--undetermined',
    )
    expect(element.getAttribute('data-weave-progress-mode')).toBe('spin')
  })

  it('exposes determined progress semantics from 0 to 1', () => {
    const { getByRole } = render(
      <Progress
        progress={0.68}
        mode="linear"
        size="large"
        speed={800}
      />,
    )

    const element = getByRole('progressbar')
    const visual = element.querySelector(
      '[data-weave-progress-visual]',
    ) as HTMLDivElement

    expect(element.getAttribute('aria-busy')).toBeNull()
    expect(element.getAttribute('aria-valuemin')).toBe('0')
    expect(element.getAttribute('aria-valuemax')).toBe('1')
    expect(element.getAttribute('aria-valuenow')).toBe('0.68')
    expect(element.className).toContain('weave-progress--linear')
    expect(element.className).toContain(
      'weave-progress--determined',
    )
    expect(
      visual.style.getPropertyValue('--weave-progress-value'),
    ).toBe('68%')
    expect(
      element.style.getPropertyValue('--weave-progress-duration'),
    ).toBe('800ms')
  })

  it('uses dotted only as a modifier of spin or linear', () => {
    const { getByRole, rerender } = render(
      <Progress
        undetermined
        mode="spin"
        dotted
      />,
    )

    const element = getByRole('progressbar')

    expect(element.className).toContain('weave-progress--spin')
    expect(element.className).toContain('weave-progress--dotted')
    expect(element.getAttribute('data-weave-progress-dotted')).toBe('true')

    rerender(
      <Progress
        undetermined
        mode="linear"
        dotted
      />,
    )

    expect(element.className).toContain('weave-progress--linear')
    expect(element.className).toContain('weave-progress--dotted')
    expect(element.className).not.toContain('weave-progress--spin')
  })

  it('transitions determined progress when the value changes', () => {
    const { getByRole, rerender } = render(
      <Progress
        progress={0.2}
        mode="spin"
      />,
    )

    const element = getByRole('progressbar')
    const visual = element.querySelector(
      '[data-weave-progress-visual]',
    ) as HTMLDivElement

    expect(
      visual.style.getPropertyValue('--weave-progress-value'),
    ).toBe('20%')

    rerender(
      <Progress
        progress={0.75}
        mode="spin"
      />,
    )

    expect(
      visual.style.getPropertyValue('--weave-progress-value'),
    ).toBe('75%')

    const stylesheet = document.querySelector(
      'style[data-weave-progress-styles]',
    )

    expect(stylesheet?.textContent).toContain(
      '@property --weave-progress-value',
    )
    expect(stylesheet?.textContent).toContain(
      '--weave-progress-value',
    )
    expect(stylesheet?.textContent).toContain('transition:')
  })

  it('supports dotted determined progress in both modes', () => {
    const { getByRole, rerender } = render(
      <Progress
        progress={0.42}
        mode="spin"
        dotted
      />,
    )

    const element = getByRole('progressbar')
    let visual = element.querySelector(
      '[data-weave-progress-visual]',
    ) as HTMLDivElement

    expect(
      visual.style.getPropertyValue('--weave-progress-value'),
    ).toBe('42%')
    expect(element.className).toContain('weave-progress--dotted')

    rerender(
      <Progress
        progress={0.42}
        mode="linear"
        dotted
      />,
    )

    visual = element.querySelector(
      '[data-weave-progress-visual]',
    ) as HTMLDivElement

    expect(
      visual.style.getPropertyValue('--weave-progress-value'),
    ).toBe('42%')
    expect(element.className).toContain('weave-progress--linear')
    expect(element.className).toContain('weave-progress--dotted')
  })

  it('clamps determined progress to the public 0 to 1 range', () => {
    const { getByRole, rerender } = render(
      <Progress progress={1.5} />,
    )

    const element = getByRole('progressbar')
    const visual = element.querySelector(
      '[data-weave-progress-visual]',
    ) as HTMLDivElement

    expect(element.getAttribute('aria-valuenow')).toBe('1')
    expect(
      visual.style.getPropertyValue('--weave-progress-value'),
    ).toBe('100%')

    rerender(<Progress progress={-0.5} />)

    expect(element.getAttribute('aria-valuenow')).toBe('0')
    expect(
      visual.style.getPropertyValue('--weave-progress-value'),
    ).toBe('0%')
  })

  it('keeps mode dotted and size defaults out of inline style', () => {
    const { getByRole } = render(
      <Progress
        undetermined
        mode="linear"
        dotted
        size="large"
        speed="slow"
      />,
    )

    const element = getByRole('progressbar')

    expect(element.className).toContain('weave-progress--linear')
    expect(element.className).toContain('weave-progress--dotted')
    expect(element.className).toContain('weave-progress--large')
    expect(element.className).toContain('weave-progress--speed-slow')
    expect(element.style.getPropertyValue('--weave-width')).toBe('')
    expect(
      element.style.getPropertyValue('--weave-progress-duration'),
    ).toBe('')
  })

  it('keeps viewProps className and style above component defaults', () => {
    const { getByRole } = render(
      <Progress
        undetermined
        mode="spin"
        viewProps={{
          className: 'custom-progress',
          width: 4,
          style: {
            width: '18px',
          },
        }}
      />,
    )

    const element = getByRole('progressbar')

    expect(element.className).toContain('weave-progress')
    expect(element.className).toContain('custom-progress')
    expect(element.style.getPropertyValue('--weave-width')).toBe('4rem')
    expect(element.style.width).toBe('18px')
  })

  it('installs reduced-motion handling in its stylesheet', () => {
    render(<Progress undetermined mode="spin" />)

    const stylesheet = document.querySelector(
      'style[data-weave-progress-styles]',
    )

    expect(stylesheet?.textContent).toContain(
      '@media (prefers-reduced-motion: reduce)',
    )
  })
})
