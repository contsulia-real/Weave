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

function setupGeometry(
  element: HTMLDivElement,
  thumb: HTMLDivElement,
  checked = false,
) {
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
    x: checked ? 18 : 2,
    y: 2,
    top: 2,
    right: checked ? 38 : 22,
    bottom: 22,
    left: checked ? 18 : 2,
    width: 20,
    height: 20,
    toJSON: () => ({}),
  })
}

describe('Switch', () => {
  it('supports uncontrolled state and emits boolean changes', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Switch defaultChecked onChange={onChange} />,
    )

    const element = getByRole('switch')
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

  it('keeps user click cancellation semantics', () => {
    const onChange = vi.fn()
    const onClick = vi.fn((event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
    })

    const { getByRole } = render(
      <Switch
        onChange={onChange}
        viewProps={{ onClick }}
      />,
    )

    fireEvent.click(getByRole('switch'))

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('shrinks first, lengthens with drag distance, caps at midpoint, and restores on release', () => {
    const onChange = vi.fn()
    const { getByRole } = render(<Switch onChange={onChange} />)
    const element = getByRole('switch') as HTMLDivElement
    const thumb = element.querySelector(
      '[data-weave-switch-thumb]',
    ) as HTMLDivElement

    setupGeometry(element, thumb)

    fireEvent.pointerDown(thumb, {
      pointerId: 7,
      button: 0,
      clientX: 2,
    })

    expect(parseFloat(thumb.style.height)).toBeCloseTo(13.6)
    expect(parseFloat(thumb.style.width)).toBeCloseTo(13.6)

    fireEvent.pointerMove(element, {
      pointerId: 7,
      clientX: 6,
    })

    const partialWidth = parseFloat(thumb.style.width)
    expect(partialWidth).toBeGreaterThan(13.6)
    expect(partialWidth).toBeLessThan(27)
    expect(parseFloat(thumb.style.height)).toBeCloseTo(13.6)

    fireEvent.pointerMove(element, {
      pointerId: 7,
      clientX: 30,
    })

    expect(parseFloat(thumb.style.width)).toBeCloseTo(27)
    expect(parseFloat(thumb.style.height)).toBeCloseTo(13.6)

    fireEvent.pointerMove(element, {
      pointerId: 7,
      clientX: 60,
    })

    expect(parseFloat(thumb.style.width)).toBeCloseTo(27)

    fireEvent.pointerUp(element, {
      pointerId: 7,
      clientX: 60,
    })

    expect(thumb.style.width).toBe('')
    expect(thumb.style.height).toBe('')
    expect(thumb.style.transform).toBe('')
    expect(onChange).toHaveBeenCalledWith(true)
    expect(element.getAttribute('aria-checked')).toBe('true')
  })

  it('switches off when a checked thumb crosses the midpoint', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Switch defaultChecked onChange={onChange} />,
    )
    const element = getByRole('switch') as HTMLDivElement
    const thumb = element.querySelector(
      '[data-weave-switch-thumb]',
    ) as HTMLDivElement

    setupGeometry(element, thumb, true)

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

    expect(onChange).toHaveBeenCalledWith(false)
    expect(element.getAttribute('aria-checked')).toBe('false')
  })

  it('does not toggle when drag stays before the threshold', () => {
    const onChange = vi.fn()
    const { getByRole } = render(<Switch onChange={onChange} />)
    const element = getByRole('switch') as HTMLDivElement
    const thumb = element.querySelector(
      '[data-weave-switch-thumb]',
    ) as HTMLDivElement

    setupGeometry(element, thumb)

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

  it('does not toggle while disabled', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Switch
        onChange={onChange}
        viewProps={{ disabled: true }}
      />,
    )

    const element = getByRole('switch') as HTMLDivElement
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

    expect(onChange).not.toHaveBeenCalled()
  })

  it('does no layout reads during pointermove after the initial geometry read', () => {
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

    fireEvent.pointerMove(element, {
      pointerId: 44,
      clientX: 12,
    })

    expect(rootRect).not.toHaveBeenCalled()
    expect(thumbRect).not.toHaveBeenCalled()

    fireEvent.pointerCancel(element, {
      pointerId: 44,
      clientX: 12,
    })

    rootRect.mockRestore()
    thumbRect.mockRestore()
  })

  it('uses a clear off fill, primary on fill, recessed track, and raised thumb', () => {
    const { getByRole } = render(<Switch size="medium" />)
    const element = getByRole('switch')
    const themeRule = runtimeRule(element, 'weave-switch-theme-')
    const stylesheet = document.querySelector(
      'style[data-weave-switch-styles]',
    )?.textContent ?? ''

    expect(themeRule).toContain(
      '--weave-switch-background:color-mix(insrgb,var(--weave-color-outline)34%,var(--weave-color-surface));',
    )
    expect(themeRule).toContain(
      '--weave-switch-checked-background:var(--weave-color-primary',
    )
    expect(themeRule).toContain('--weave-switch-thumb-drag-shrink:0.68;')
    expect(themeRule).toContain('--weave-switch-thumb-drag-max-width:1.35;')
    expect(themeRule).toContain('--weave-switch-track-shadow:')
    expect(themeRule).toContain('--weave-switch-thumb-shadow:')
    expect(stylesheet).toContain(
      '--weave-component-box-shadow: var(--weave-switch-track-shadow)',
    )
    expect(stylesheet).toContain(
      '--weave-component-box-shadow: var(--weave-switch-thumb-shadow)',
    )
  })

  it('lets ThemeProvider override Switch geometry and drag shape', () => {
    const theme = createTheme({
      components: {
        Switch: {
          base: {
            background: 'danger',
            thumbDragShrink: 0.6,
            thumbDragMaxWidth: 1.5,
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
      <ThemeProvider theme={theme}>
        <Switch />
      </ThemeProvider>,
    )

    const rule = runtimeRule(
      getByRole('switch'),
      'weave-switch-theme-',
    )

    expect(rule).toContain('--weave-switch-width:4rem;')
    expect(rule).toContain('--weave-switch-thumb-drag-shrink:0.6;')
    expect(rule).toContain('--weave-switch-thumb-drag-max-width:1.5;')
  })
})
