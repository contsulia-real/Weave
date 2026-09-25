import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Switch } from '../src'

afterEach(cleanup)

describe('Switch', () => {
  it('supports uncontrolled state and emits boolean changes', () => {
    const onChange = vi.fn()

    const { getByRole } = render(
      <Switch defaultChecked onChange={onChange} />,
    )

    const element = getByRole('switch')

    expect(element.getAttribute('aria-checked')).toBe('true')
    expect(element.tabIndex).toBe(0)

    fireEvent.click(element)

    expect(onChange).toHaveBeenCalledWith(false)
    expect(element.getAttribute('aria-checked')).toBe('false')
  })

  it('supports controlled state without mutating its own value', () => {
    const onChange = vi.fn()

    const { getByRole, rerender } = render(
      <Switch checked={false} onChange={onChange} />,
    )

    const element = getByRole('switch')
    fireEvent.click(element)

    expect(onChange).toHaveBeenCalledWith(true)
    expect(element.getAttribute('aria-checked')).toBe('false')

    rerender(<Switch checked onChange={onChange} />)

    expect(element.getAttribute('aria-checked')).toBe('true')
  })

  it('toggles from keyboard using Space and Enter', () => {
    const onChange = vi.fn()

    const { getByRole } = render(
      <Switch onChange={onChange} />,
    )

    const element = getByRole('switch')

    fireEvent.keyDown(element, { key: ' ' })
    expect(onChange).toHaveBeenLastCalledWith(true)
    expect(element.getAttribute('aria-checked')).toBe('true')

    fireEvent.keyDown(element, { key: 'Enter' })
    expect(onChange).toHaveBeenLastCalledWith(false)
    expect(element.getAttribute('aria-checked')).toBe('false')
  })

  it('keeps user event handlers and lets preventDefault cancel toggling', () => {
    const onChange = vi.fn()
    const onClick = vi.fn((event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
    })

    const { getByRole } = render(
      <Switch
        onChange={onChange}
        viewProps={{
          onClick,
        }}
      />,
    )

    fireEvent.click(getByRole('switch'))

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('renders track and thumb with semantic size data', () => {
    const { getByRole } = render(
      <Switch
        size="large"
        viewProps={{
          width: 4,
          data: {
            testid: 'switch',
          },
        }}
      />,
    )

    const element = getByRole('switch')

    expect(element.getAttribute('data-weave-switch')).toBe('')
    expect(element.getAttribute('data-weave-switch-size')).toBe('large')
    expect(
      element.querySelector('[data-weave-switch-thumb]'),
    ).not.toBeNull()
    expect(element.style.getPropertyValue('--weave-width')).toBe('4rem')

    const stylesheet = document.querySelector(
      'style[data-weave-switch-styles]',
    )
    expect(stylesheet?.textContent).toContain(
      '[data-weave-switch-size="large"]',
    )
  })
})
