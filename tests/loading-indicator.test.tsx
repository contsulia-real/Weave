import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LoadingIndicator } from '../src'

afterEach(cleanup)

describe('LoadingIndicator', () => {
  it('exposes undetermined progress semantics without a value', () => {
    const { getByRole } = render(
      <LoadingIndicator
        undetermined
        size="small"
        color="success"
        speed="fast"
        animation="spin"
      />,
    )

    const element = getByRole('progressbar')

    expect(element.getAttribute('aria-busy')).toBe('true')
    expect(element.getAttribute('aria-valuemin')).toBeNull()
    expect(element.getAttribute('aria-valuemax')).toBeNull()
    expect(element.getAttribute('aria-valuenow')).toBeNull()

    expect(element.getAttribute('data-weave-loading-size')).toBe('small')
    expect(element.getAttribute('data-weave-loading-animation')).toBe('spin')
    expect(element.getAttribute('data-weave-loading-mode')).toBe(
      'undetermined',
    )
    expect(element.style.getPropertyValue('--weave-color')).toContain(
      '--weave-color-success',
    )
    expect(element.className).toContain('weave-loading-indicator')
    expect(element.className).toContain(
      'weave-loading-indicator--small',
    )
    expect(element.className).toContain(
      'weave-loading-indicator--spin',
    )
    expect(element.className).toContain(
      'weave-loading-indicator--speed-fast',
    )
    expect(
      element.style.getPropertyValue('--weave-loading-duration'),
    ).toBe('')
  })

  it('exposes determined progress semantics from 0 to 1', () => {
    const { getByRole } = render(
      <LoadingIndicator
        progress={0.68}
        size="large"
        animation="pulse"
        speed={800}
      />,
    )

    const element = getByRole('progressbar')

    expect(element.getAttribute('aria-busy')).toBeNull()
    expect(element.getAttribute('aria-valuemin')).toBe('0')
    expect(element.getAttribute('aria-valuemax')).toBe('1')
    expect(element.getAttribute('aria-valuenow')).toBe('0.68')
    expect(element.getAttribute('data-weave-loading-mode')).toBe('determined')

    expect(
      element.style.getPropertyValue('--weave-loading-progress'),
    ).toBe('68%')
    expect(
      element.style.getPropertyValue('--weave-loading-duration'),
    ).toBe('800ms')
  })

  it('renders the dots variant with three internal dots', () => {
    const { getByRole } = render(
      <LoadingIndicator
        undetermined
        animation="dots"
      />,
    )

    const element = getByRole('progressbar')

    expect(
      element.querySelectorAll('[data-weave-loading-dot]'),
    ).toHaveLength(3)
    expect(
      element.querySelector('[data-weave-loading-dots]'),
    ).not.toBeNull()
  })

  it('keeps static component visuals out of inline style', () => {
    const { getByRole } = render(
      <LoadingIndicator
        undetermined
        size="large"
        animation="dots"
        speed="slow"
      />,
    )

    const element = getByRole('progressbar')

    expect(element.className).toContain(
      'weave-loading-indicator--large',
    )
    expect(element.className).toContain(
      'weave-loading-indicator--dots',
    )
    expect(element.className).toContain(
      'weave-loading-indicator--speed-slow',
    )
    expect(element.style.getPropertyValue('--weave-width')).toBe('')
    expect(
      element.style.getPropertyValue('--weave-loading-duration'),
    ).toBe('')
  })

  it('keeps viewProps className and style above component defaults', () => {
    const { getByRole } = render(
      <LoadingIndicator
        undetermined
        size="large"
        viewProps={{
          className: 'custom-loading',
          width: 4,
          style: {
            width: '18px',
          },
        }}
      />,
    )

    const element = getByRole('progressbar')

    expect(element.className).toContain('weave-loading-indicator')
    expect(element.className).toContain('weave-loading-indicator--large')
    expect(element.className).toContain('custom-loading')
    expect(element.style.getPropertyValue('--weave-width')).toBe('4rem')
    expect(element.style.width).toBe('18px')
  })

  it('installs reduced-motion handling in its stylesheet', () => {
    render(<LoadingIndicator undetermined />)

    const stylesheet = document.querySelector(
      'style[data-weave-loading-styles]',
    )

    expect(stylesheet?.textContent).toContain(
      '@media (prefers-reduced-motion: reduce)',
    )
  })
})
