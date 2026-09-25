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

function switchParts(element: HTMLElement) {
  return {
    thumb: element.querySelector(
      '[data-weave-switch-thumb]',
    ) as HTMLDivElement,
    core: element.querySelector(
      '.weave-switch__thumb-core',
    ) as HTMLDivElement,
    tail: element.querySelector(
      '.weave-switch__drag-tail',
    ) as HTMLDivElement,
  }
}

function setSwitchGeometry(
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
    const { getByRole } = render(<Switch onChange={onChange} />)
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

  it('switches on when the thumb is dragged across the midpoint', () => {
    const onChange = vi.fn()
    const { getByRole } = render(<Switch onChange={onChange} />)
    const element = getByRole('switch') as HTMLDivElement
    const { thumb, core, tail } = switchParts(element)

    setSwitchGeometry(element, thumb)

    fireEvent.pointerDown(thumb, {
      pointerId: 7,
      button: 0,
      clientX: 2,
    })
    fireEvent.pointerMove(element, {
      pointerId: 7,
      clientX: 30,
    })

    expect(element.dataset.weaveSwitchDragging).toBe('true')
    expect(thumb.style.transform).toContain('translateX(16px)')
    expect(core.style.transform).toBe('scale(0.68)')
    expect(tail.style.transform).toContain('scaleX(1)')
    expect(thumb.dataset.weaveSwitchDragDirection).toBe('forward')

    fireEvent.pointerUp(element, {
      pointerId: 7,
      clientX: 30,
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith(true)
    expect(element.getAttribute('aria-checked')).toBe('true')
    expect(element.dataset.weaveSwitchDragging).toBeUndefined()
    expect(thumb.style.transform).toBe('')
    expect(core.style.transform).toBe('')
    expect(tail.style.transform).toBe('')

    fireEvent.click(element)
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('deforms progressively and caps at the state threshold', () => {
    const { getByRole } = render(<Switch />)
    const element = getByRole('switch') as HTMLDivElement
    const { thumb, core, tail } = switchParts(element)

    setSwitchGeometry(element, thumb)

    fireEvent.pointerDown(thumb, {
      pointerId: 31,
      button: 0,
      clientX: 2,
    })
    fireEvent.pointerMove(element, {
      pointerId: 31,
      clientX: 6,
    })

    const partialScale = Number(
      core.style.transform.match(/scale\(([^)]+)\)/)?.[1],
    )
    const partialProgress = Number(
      tail.style.transform.match(/scaleX\(([^)]+)\)/)?.[1],
    )

    expect(partialScale).toBeLessThan(0.82)
    expect(partialScale).toBeGreaterThan(0.68)
    expect(partialProgress).toBeGreaterThan(0)
    expect(partialProgress).toBeLessThan(1)

    fireEvent.pointerMove(element, {
      pointerId: 31,
      clientX: 30,
    })

    expect(core.style.transform).toBe('scale(0.68)')
    expect(tail.style.transform).toContain('scaleX(1)')

    fireEvent.pointerUp(element, {
      pointerId: 31,
      clientX: 30,
    })

    expect(core.style.transform).toBe('')
    expect(tail.style.transform).toBe('')
  })

  it('switches off when a checked thumb is dragged back across the midpoint', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Switch defaultChecked onChange={onChange} />,
    )
    const element = getByRole('switch') as HTMLDivElement
    const { thumb } = switchParts(element)

    setSwitchGeometry(element, thumb, true)

    fireEvent.pointerDown(thumb, {
      pointerId: 10,
      button: 0,
      clientX: 30,
    })
    fireEvent.pointerMove(element, {
      pointerId: 10,
      clientX: 0,
    })

    expect(thumb.dataset.weaveSwitchDragDirection).toBe('backward')

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
    const { getByRole } = render(<Switch onChange={onChange} />)
    const element = getByRole('switch') as HTMLDivElement
    const { thumb } = switchParts(element)

    setSwitchGeometry(element, thumb)

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

    const element = getByRole('switch') as HTMLDivElement
    const { thumb } = switchParts(element)

    setSwitchGeometry(element, thumb)

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

  it('keeps drag movement off layout reads after pointerdown', () => {
    const { getByRole } = render(<Switch />)
    const element = getByRole('switch') as HTMLDivElement
    const { thumb } = switchParts(element)

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

    const computedSpy = vi.spyOn(window, 'getComputedStyle')

    fireEvent.pointerMove(element, {
      pointerId: 44,
      clientX: 12,
    })

    expect(rootRect).not.toHaveBeenCalled()
    expect(thumbRect).not.toHaveBeenCalled()
    expect(computedSpy).not.toHaveBeenCalled()

    fireEvent.pointerUp(element, {
      pointerId: 44,
      clientX: 12,
    })

    computedSpy.mockRestore()
    rootRect.mockRestore()
    thumbRect.mockRestore()
  })

  it('uses a light off fill, primary on fill, recessed track, and raised thumb', () => {
    const { getByRole } = render(<Switch size="medium" />)
    const element = getByRole('switch')
    const themeRule = runtimeRule(element, 'weave-switch-theme-')
    const stylesheet = document.querySelector(
      'style[data-weave-switch-styles]',
    )?.textContent ?? ''

    expect(themeRule).toContain('--weave-switch-width:2.5rem;')
    expect(themeRule).toContain('--weave-switch-height:1.5rem;')
    expect(themeRule).toContain(
      '--weave-switch-background:color-mix(insrgb,var(--weave-color-outline)18%,var(--weave-color-surface));',
    )
    expect(themeRule).toContain(
      '--weave-switch-checked-background:var(--weave-color-primary',
    )
    expect(themeRule).toContain('--weave-switch-thumb-drag-shrink:0.68;')
    expect(themeRule).toContain('--weave-switch-track-shadow:')
    expect(themeRule).toContain('--weave-switch-thumb-shadow:')
    expect(stylesheet).toContain(
      '--weave-component-box-shadow: var(--weave-switch-track-shadow)',
    )
    expect(stylesheet).toContain(
      'box-shadow: var(--weave-switch-thumb-shadow)',
    )
    expect(stylesheet).toContain('width: 140%')
    expect(stylesheet).toContain('height: 38%')
  })

  it('lets a ThemeProvider override component size and appearance', () => {
    const theme = createTheme({
      components: {
        Switch: {
          base: {
            background: 'danger',
            thumbDragShrink: 0.6,
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
    expect(rule).toContain('--weave-switch-thumb-drag-shrink:0.6;')
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
    expect(propsRule).toContain('--weave-width:4rem;')
    expect(themeRule).toContain('--weave-switch-width:3rem;')
  })
})
