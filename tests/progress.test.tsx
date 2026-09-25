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
    const value = element.querySelector(
      '[data-weave-progress-value]',
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
      value.style.getPropertyValue('--weave-progress-value'),
    ).toBe('68%')
    expect(
      element.style.getPropertyValue('--weave-progress-duration'),
    ).toBe('800ms')
  })

  it('shows a continuous track only when tracked', () => {
    const { getByRole, rerender } = render(
      <Progress
        progress={0.58}
        mode="spin"
        tracked
      />,
    )

    const element = getByRole('progressbar')
    const track = element.querySelector(
      '[data-weave-progress-track]',
    ) as HTMLDivElement

    expect(element.className).toContain('weave-progress--tracked')
    expect(
      element.getAttribute('data-weave-progress-tracked'),
    ).toBe('true')
    expect(track).not.toBeNull()

    rerender(
      <Progress
        progress={0.58}
        mode="spin"
      />,
    )

    expect(element.className).not.toContain('weave-progress--tracked')
    expect(
      element.getAttribute('data-weave-progress-tracked'),
    ).toBeNull()
  })

  it('transitions determined progress when the value changes', () => {
    const { getByRole, rerender } = render(
      <Progress
        progress={0.2}
        mode="spin"
      />,
    )

    const element = getByRole('progressbar')
    const value = element.querySelector(
      '[data-weave-progress-value]',
    ) as HTMLDivElement

    expect(
      value.style.getPropertyValue('--weave-progress-value'),
    ).toBe('20%')

    rerender(
      <Progress
        progress={0.75}
        mode="spin"
      />,
    )

    expect(
      value.style.getPropertyValue('--weave-progress-value'),
    ).toBe('75%')

    const stylesheet = document.querySelector(
      'style[data-weave-progress-styles]',
    )

    expect(stylesheet?.textContent).toContain(
      '@property --weave-progress-value',
    )
    expect(stylesheet?.textContent).toContain('transition:')
  })

  it('uses fluid undetermined motion for both modes', () => {
    render(
      <>
        <Progress undetermined mode="spin" />
        <Progress undetermined mode="linear" />
      </>,
    )

    const stylesheet = document.querySelector(
      'style[data-weave-progress-styles]',
    )

    expect(stylesheet?.textContent).toContain(
      'weave-progress-spin-rotate',
    )
    expect(stylesheet?.textContent).toContain(
      'weave-progress-spin-sweep',
    )
    expect(stylesheet?.textContent).toContain(
      '@property --weave-progress-spin-start',
    )
    expect(stylesheet?.textContent).toContain(
      '@property --weave-progress-spin-end',
    )
    expect(stylesheet?.textContent).toContain(
      'weave-progress-linear-slide',
    )
    expect(stylesheet?.textContent).toContain(
      '--weave-overflow: hidden',
    )
    expect(stylesheet?.textContent).toContain(
      'translate3d(',
    )
  })

  it('clamps determined progress to the public 0 to 1 range', () => {
    const { getByRole, rerender } = render(
      <Progress progress={1.5} />,
    )

    const element = getByRole('progressbar')
    const value = element.querySelector(
      '[data-weave-progress-value]',
    ) as HTMLDivElement

    expect(element.getAttribute('aria-valuenow')).toBe('1')
    expect(
      value.style.getPropertyValue('--weave-progress-value'),
    ).toBe('100%')

    rerender(<Progress progress={-0.5} />)

    expect(element.getAttribute('aria-valuenow')).toBe('0')
    expect(
      value.style.getPropertyValue('--weave-progress-value'),
    ).toBe('0%')
  })

  it('keeps mode tracked and size defaults out of inline style', () => {
    const { getByRole } = render(
      <Progress
        undetermined
        mode="linear"
        tracked
        size="large"
        speed="slow"
      />,
    )

    const element = getByRole('progressbar')

    expect(element.className).toContain('weave-progress--linear')
    expect(element.className).toContain('weave-progress--tracked')
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
