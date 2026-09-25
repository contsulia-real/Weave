import { cleanup, fireEvent, render } from '@testing-library/react'
import type { MouseEvent } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Switch, ThemeProvider, createTheme } from '../src'

afterEach(cleanup)

function runtimeRule(
  element: Element,
  prefix: string,
): string {
  const className = [...element.classList].find((name) =>
    name.startsWith(prefix),
  )

  expect(className).toBeDefined()

  return (
    document.querySelector<HTMLStyleElement>(
      `style[data-weave-runtime-class="${className}"]`,
    )?.textContent ?? ''
  ).replace(/\s+/g, '')
}

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
    const onClick = vi.fn((event: MouseEvent<HTMLDivElement>) => {
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

  it('does not toggle while disabled through viewProps', () => {
    const onChange = vi.fn()

    const { getByRole } = render(
      <Switch
        onChange={onChange}
        viewProps={{
          disabled: true,
        }}
      />,
    )

    const element = getByRole('switch')

    expect(element.getAttribute('aria-disabled')).toBe('true')

    fireEvent.click(element)
    fireEvent.keyDown(element, { key: ' ' })

    expect(onChange).not.toHaveBeenCalled()
    expect(element.getAttribute('aria-checked')).toBe('false')
  })

  it('takes its default visual values from the default theme', () => {
    const { getByRole } = render(<Switch size="medium" />)

    const element = getByRole('switch')
    const themeRule = runtimeRule(element, 'weave-switch-theme-')

    expect(element.style.getPropertyValue('--weave-width')).toBe('')
    expect(themeRule).toContain('--weave-switch-width:2.5rem;')
    expect(themeRule).toContain('--weave-switch-height:1.5rem;')
    expect(themeRule).toContain(
      '--weave-switch-background:var(--weave-color-outline',
    )
  })

  it('lets a ThemeProvider override component size and appearance', () => {
    const theme = createTheme({
      components: {
        Switch: {
          base: {
            background: 'danger',
          },
          sizes: {
            medium: {
              width: 4,
              height: 2,
              thumbSize: 1.5,
              shift: 2,
            },
          },
        },
      },
    })

    const { getByRole } = render(
      <ThemeProvider theme={theme} mode="light">
        <Switch />
      </ThemeProvider>,
    )

    const element = getByRole('switch')
    const rule = runtimeRule(element, 'weave-switch-theme-')

    expect(rule).toContain('--weave-switch-width:4rem;')
    expect(rule).toContain('--weave-switch-height:2rem;')
    expect(rule).toContain(
      '--weave-switch-background:var(--weave-color-danger',
    )
  })

  it('keeps instance View props above component theme defaults', () => {
    const { getByRole } = render(
      <Switch
        size="large"
        viewProps={{
          width: 4,
          className: 'custom-switch',
          data: {
            testid: 'switch',
          },
        }}
      />,
    )

    const element = getByRole('switch')
    const propsRule = runtimeRule(element, 'weave-props-')
    const themeRule = runtimeRule(element, 'weave-switch-theme-')

    expect(element.className).toContain('weave-view')
    expect(element.className).toContain('weave-switch')
    expect(element.className).toContain('weave-switch--large')
    expect(element.className).toContain('custom-switch')
    expect(element.getAttribute('data-weave-switch')).toBe('')
    expect(element.getAttribute('data-weave-switch-size')).toBe('large')
    expect(
      element.querySelector('[data-weave-switch-thumb]'),
    ).not.toBeNull()
    expect(element.style.getPropertyValue('--weave-width')).toBe('')
    expect(propsRule).toContain('--weave-width:4rem;')
    expect(themeRule).toContain('--weave-switch-width:3rem;')

    const stylesheet = document.querySelector(
      'style[data-weave-switch-styles]',
    )
    expect(stylesheet?.textContent).toContain(
      '--weave-component-width: var(--weave-switch-width)',
    )
  })
})
