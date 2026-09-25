import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { View } from '../src'

afterEach(cleanup)

describe('View DOM backend', () => {
  it('maps Weave props without leaking custom props to the DOM', () => {
    const { getByTestId } = render(
      <View
        layout="flex"
        width={20}
        padding={1}
        paddingTop={2}
        background="primary"
        radius="medium"
        data={{ testid: 'view', state: 'open' }}
      />,
    )

    const element = getByTestId('view')

    expect(element.getAttribute('data-weave-layout')).toBe('flex')
    expect(element.getAttribute('data-state')).toBe('open')
    expect(element.getAttribute('layout')).toBeNull()
    expect(element.style.getPropertyValue('--weave-width')).toBe('20rem')
    expect(element.style.getPropertyValue('--weave-padding-top')).toBe('2rem')
    expect(element.style.getPropertyValue('--weave-padding-right')).toBe('1rem')
    expect(element.style.getPropertyValue('--weave-background')).toContain(
      '--weave-color-primary',
    )
  })

  it('keeps style as the final inline override and className on the element', () => {
    const { getByTestId } = render(
      <View
        width={20}
        className="user-class"
        style={{ width: '10px' }}
        data={{ testid: 'priority' }}
      />,
    )

    const element = getByTestId('priority')

    expect(element.className).toBe('user-class')
    expect(element.style.getPropertyValue('--weave-width')).toBe('20rem')
    expect(element.style.width).toBe('10px')

    const frameworkStyles = document.querySelector(
      'style[data-weave-view-styles]',
    )
    expect(frameworkStyles?.textContent).toContain(
      ':where([data-weave-view])',
    )
  })

  it('forwards React events and high-level semantics', () => {
    const onClick = vi.fn()

    const { getByTestId } = render(
      <View
        focusable
        disabled
        label="Sidebar"
        onClick={onClick}
        data={{ testid: 'semantic' }}
      />,
    )

    const element = getByTestId('semantic')
    fireEvent.click(element)

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(element.tabIndex).toBe(0)
    expect(element.getAttribute('aria-disabled')).toBe('true')
    expect(element.getAttribute('aria-label')).toBe('Sidebar')
  })

  it('encodes state styles as state-specific attribute values', () => {
    const { getByTestId } = render(
      <View
        hover={{ scale: 1.03, opacity: 0.8 }}
        focusVisible={{ outlineWidth: 0.125 }}
        data={{ testid: 'states' }}
      />,
    )

    const element = getByTestId('states')

    expect(element.style.getPropertyValue('--weave-hover-transform')).toBe(
      'scale(1.03)',
    )
    expect(element.style.getPropertyValue('--weave-hover-opacity')).toBe('0.8')
    expect(
      element.style.getPropertyValue('--weave-focus-visible-outline-width'),
    ).toBe('0.125rem')
  })
})
