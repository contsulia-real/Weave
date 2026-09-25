import { cleanup, fireEvent, render } from '@testing-library/react'
import type {
  MouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react'
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

  it('switches state when the thumb is dragged across the midpoint', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Switch onChange={onChange} />,
    )

    const element = getByRole('switch') as HTMLDivElement
    const thumb = element.querySelector(
      '[data-weave-switch-thumb]',
    ) as HTMLDivElement

    element.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      top: 0,
      right: 40,
      bottom: 24,
      left: 0,
      width: 40,
      height: 24,
      toJSON: () => ({}),
    })
    thumb.getBoundingClientRect = () => ({
      x: 2,
      y: 2,
      top: 2,
      right: 22,
      bottom: 22,
      left: 2,
      width: 20,
      height: 20,
      toJSON: () => ({}),
    })

    fireEvent.pointerDown(thumb, {
      pointerId: 7,
      button: 0,
      clientX: 2,
    })
    fireEvent.pointerMove(element, {
      pointerId: 7,
      clientX: 30,
    })

    expect(element.getAttribute('data-weave-switch-dragging')).toBe(
      'true',
    )
    expect(thumb.style.transform).toContain('translateX(')

    expect(thumb.style.transform).toContain('scale(0.72)')
    expect(
      thumb.style.getPropertyValue('--weave-switch-drag-progress'),
    ).toBe('1')

    fireEvent.pointerUp(element, {
      pointerId: 7,
      clientX: 30,
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith(true)
    expect(element.getAttribute('aria-checked')).toBe('true')
    expect(element.getAttribute('data-weave-switch-dragging')).toBeNull()
    expect(thumb.style.transform).toBe('')
    expect(
      thumb.style.getPropertyValue('--weave-switch-drag-progress'),
    ).toBe('')
    expect(
      thumb.getAttribute('data-weave-switch-drag-direction'),
    ).toBeNull()

    fireEvent.click(element)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(element.getAttribute('aria-checked')).toBe('true')
  })

  it('caps thumb deformation at the state threshold and restores it on release', () => {
    const { getByRole } = render(<Switch />)
    const element = getByRole('switch') as HTMLDivElement
    const thumb = element.querySelector(
      '[data-weave-switch-thumb]',
    ) as HTMLDivElement

    element.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      top: 0,
      right: 40,
      bottom: 24,
      left: 0,
      width: 40,
      height: 24,
      toJSON: () => ({}),
    })
    thumb.getBoundingClientRect = () => ({
      x: 2,
      y: 2,
      top: 2,
      right: 22,
      bottom: 22,
      left: 2,
      width: 20,
      height: 20,
      toJSON: () => ({}),
    })

    fireEvent.pointerDown(thumb, {
      pointerId: 31,
      button: 0,
      clientX: 2,
    })
    fireEvent.pointerMove(element, {
      pointerId: 31,
      clientX: 7,
    })

    const partialMatch = thumb.style.transform.match(
      /scale\(([^)]+)\)/,
    )
    expect(partialMatch).not.toBeNull()

    const partialScale = Number(partialMatch?.[1])
    const partialExtension = Number.parseFloat(
      thumb.style.getPropertyValue(
        '--weave-switch-drag-progress',
      ),
    )

    expect(partialScale).toBeLessThan(0.82)
    expect(partialScale).toBeGreaterThan(0.72)
    expect(partialProgress).toBeGreaterThan(0)
    expect(partialProgress).toBeLessThan(1)

    fireEvent.pointerMove(element, {
      pointerId: 31,
      clientX: 30,
    })

    expect(thumb.style.transform).toContain('scale(0.72)')
    expect(
      thumb.style.getPropertyValue('--weave-switch-drag-progress'),
    ).toBe('1')

    fireEvent.pointerUp(element, {
      pointerId: 31,
      clientX: 30,
    })

    expect(thumb.style.transform).toBe('')
  })

  it('keeps the default pointer-move drag path out of React and layout reads', () => {
    const { getByRole } = render(<Switch />)
    const element = getByRole('switch') as HTMLDivElement
    const thumb = element.querySelector(
      '[data-weave-switch-thumb]',
    ) as HTMLDivElement

    const rootRect = vi.spyOn(
      element,
      'getBoundingClientRect',
    ).mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      right: 40,
      bottom: 24,
      left: 0,
      width: 40,
      height: 24,
      toJSON: () => ({}),
    })
    const thumbRect = vi.spyOn(
      thumb,
      'getBoundingClientRect',
    ).mockReturnValue({
      x: 2,
      y: 2,
      top: 2,
      right: 22,
      bottom: 22,
      left: 2,
      width: 20,
      height: 20,
      toJSON: () => ({}),
    })

    fireEvent.pointerDown(thumb, {
      pointerId: 44,
      button: 0,
      clientX: 2,
    })

    rootRect.mockClear()
    thumbRect.mockClear()

    const querySpy = vi.spyOn(element, 'querySelector')
    const computedSpy = vi.spyOn(window, 'getComputedStyle')

    fireEvent.pointerMove(element, {
      pointerId: 44,
      clientX: 12,
    })

    expect(rootRect).not.toHaveBeenCalled()
    expect(thumbRect).not.toHaveBeenCalled()
    expect(querySpy).not.toHaveBeenCalled()
    expect(computedSpy).not.toHaveBeenCalled()
    expect(thumb.style.transform).toContain('translateX(')
    expect(
      Number(
        thumb.style.getPropertyValue(
          '--weave-switch-drag-progress',
        ),
      ),
    ).toBeGreaterThan(0)

    fireEvent.pointerUp(element, {
      pointerId: 44,
      clientX: 12,
    })

    querySpy.mockRestore()
    computedSpy.mockRestore()
    rootRect.mockRestore()
    thumbRect.mockRestore()
  })

  it('keeps user pointerMove preventDefault semantics when explicitly supplied', () => {
    const onPointerMove = vi.fn(
      (event: ReactPointerEvent<HTMLDivElement>) => {
        event.preventDefault()
      },
    )

    const { getByRole } = render(
      <Switch
        viewProps={{
          onPointerMove,
        }}
      />,
    )

    const element = getByRole('switch') as HTMLDivElement
    const thumb = element.querySelector(
      '[data-weave-switch-thumb]',
    ) as HTMLDivElement

    element.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      top: 0,
      right: 40,
      bottom: 24,
      left: 0,
      width: 40,
      height: 24,
      toJSON: () => ({}),
    })
    thumb.getBoundingClientRect = () => ({
      x: 2,
      y: 2,
      top: 2,
      right: 22,
      bottom: 22,
      left: 2,
      width: 20,
      height: 20,
      toJSON: () => ({}),
    })

    fireEvent.pointerDown(thumb, {
      pointerId: 45,
      button: 0,
      clientX: 2,
    })
    fireEvent.pointerMove(element, {
      pointerId: 45,
      clientX: 18,
    })

    expect(onPointerMove).toHaveBeenCalled()
    expect(thumb.style.transform).toContain('translateX(0px)')
    expect(
      thumb.style.getPropertyValue(
        '--weave-switch-drag-progress',
      ),
    ).toBe('0')

    fireEvent.pointerCancel(element, {
      pointerId: 45,
      clientX: 18,
    })
  })

  it('switches off when a checked thumb is dragged back across the midpoint', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Switch defaultChecked onChange={onChange} />,
    )

    const element = getByRole('switch') as HTMLDivElement
    const thumb = element.querySelector(
      '[data-weave-switch-thumb]',
    ) as HTMLDivElement

    element.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      top: 0,
      right: 40,
      bottom: 24,
      left: 0,
      width: 40,
      height: 24,
      toJSON: () => ({}),
    })
    thumb.getBoundingClientRect = () => ({
      x: 18,
      y: 2,
      top: 2,
      right: 38,
      bottom: 22,
      left: 18,
      width: 20,
      height: 20,
      toJSON: () => ({}),
    })

    fireEvent.pointerDown(thumb, {
      pointerId: 10,
      button: 0,
      clientX: 30,
    })
    fireEvent.pointerMove(element, {
      pointerId: 10,
      clientX: 0,
    })
    fireEvent.pointerUp(element, {
      pointerId: 10,
      clientX: 0,
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith(false)
    expect(element.getAttribute('aria-checked')).toBe('false')
  })

  it('does not toggle for a thumb drag that stays before the midpoint', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Switch onChange={onChange} />,
    )

    const element = getByRole('switch') as HTMLDivElement
    const thumb = element.querySelector(
      '[data-weave-switch-thumb]',
    ) as HTMLDivElement

    element.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      top: 0,
      right: 40,
      bottom: 24,
      left: 0,
      width: 40,
      height: 24,
      toJSON: () => ({}),
    })
    thumb.getBoundingClientRect = () => ({
      x: 2,
      y: 2,
      top: 2,
      right: 22,
      bottom: 22,
      left: 2,
      width: 20,
      height: 20,
      toJSON: () => ({}),
    })

    fireEvent.pointerDown(thumb, {
      pointerId: 8,
      button: 0,
      clientX: 2,
    })
    fireEvent.pointerMove(element, {
      pointerId: 8,
      clientX: 6,
    })
    fireEvent.pointerUp(element, {
      pointerId: 8,
      clientX: 6,
    })

    expect(onChange).not.toHaveBeenCalled()
    expect(element.getAttribute('aria-checked')).toBe('false')
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

    const thumb = element.querySelector(
      '[data-weave-switch-thumb]',
    ) as HTMLDivElement

    fireEvent.click(element)
    fireEvent.keyDown(element, { key: ' ' })
    fireEvent.pointerDown(thumb, {
      pointerId: 9,
      button: 0,
      clientX: 0,
    })
    fireEvent.pointerMove(element, {
      pointerId: 9,
      clientX: 30,
    })
    fireEvent.pointerUp(element, {
      pointerId: 9,
      clientX: 30,
    })

    expect(onChange).not.toHaveBeenCalled()
    expect(element.getAttribute('aria-checked')).toBe('false')
  })

  it('settles with spring motion but keeps drag movement direct', () => {
    render(<Switch />)

    const stylesheet = document.querySelector(
      'style[data-weave-switch-styles]',
    )?.textContent ?? ''

    expect(stylesheet).toContain(
      'var(--weave-motion-curve-spring)',
    )
    expect(stylesheet).toContain(
      '[data-weave-switch-dragging="true"]',
    )
    expect(stylesheet).toContain(
      '--weave-component-box-shadow: var(--weave-switch-track-shadow)',
    )
    expect(stylesheet).toContain(
      '--weave-component-box-shadow: var(--weave-switch-thumb-shadow)',
    )
    expect(stylesheet).toContain(
      '--weave-switch-thumb-hover-shadow',
    )
    expect(stylesheet).toContain(
      '--weave-switch-drag-progress',
    )
    expect(stylesheet).toContain(
      'data-weave-switch-drag-direction="forward"',
    )
    expect(stylesheet).toContain('height: 42%')
    expect(stylesheet).toContain('transition: none')
    expect(stylesheet).toContain(
      '@media (prefers-reduced-motion: reduce)',
    )
  })

  it('takes its default visual values from the default theme', () => {
    const { getByRole } = render(<Switch size="medium" />)

    const element = getByRole('switch')
    const themeRule = runtimeRule(element, 'weave-switch-theme-')

    expect(element.style.getPropertyValue('--weave-width')).toBe('')
    expect(themeRule).toContain('--weave-switch-width:2.5rem;')
    expect(themeRule).toContain('--weave-switch-height:1.5rem;')
    expect(themeRule).toContain(
      '--weave-switch-background:var(--weave-color-transparent,transparent);',
    )
    expect(themeRule).toContain(
      '--weave-switch-checked-background:var(--weave-color-primary',
    )
    expect(themeRule).toContain('--weave-switch-thumb-drag-shrink:0.72;')
    expect(themeRule).toContain('--weave-switch-thumb-drag-stretch:1;')
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
