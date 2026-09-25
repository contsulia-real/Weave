import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { View } from '../src'

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
    const rule = runtimeRule(element, 'weave-view-props-')

    expect(element.getAttribute('data-weave-layout')).toBe('flex')
    expect(element.getAttribute('data-state')).toBe('open')
    expect(element.getAttribute('layout')).toBeNull()
    expect(element.style.getPropertyValue('--weave-width')).toBe('')
    expect(rule).toContain('--weave-width:20rem;')
    expect(rule).toContain('--weave-padding-top:2rem;')
    expect(rule).toContain('--weave-padding-right:1rem;')
    expect(rule).toContain('--weave-background:var(--weave-color-primary')
  })

  it('keeps style above className above generated property classes', () => {
    const { getByTestId } = render(
      <View
        width={20}
        className="user-class"
        style={{ width: '10px' }}
        data={{ testid: 'priority' }}
      />,
    )

    const element = getByTestId('priority')
    const rule = runtimeRule(element, 'weave-view-props-')

    expect(element.className).toContain('user-class')
    expect(element.style.getPropertyValue('--weave-width')).toBe('')
    expect(element.style.width).toBe('10px')
    expect(rule).toContain('--weave-width:20rem;')

    const frameworkStyles = document.querySelector(
      'style[data-weave-view-styles]',
    )
    expect(frameworkStyles?.textContent).toContain(
      ':where([data-weave-view])',
    )
    expect(frameworkStyles?.textContent).toContain(
      'var(--weave-width, var(--weave-component-width))',
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

  it('registers View instance variables as non-inheriting', () => {
    render(
      <View minHeight="100vh" data={{ testid: 'parent' }}>
        <View data={{ testid: 'child' }} />
      </View>,
    )

    const frameworkStyles = document.querySelector(
      'style[data-weave-view-styles]',
    )

    expect(frameworkStyles?.textContent).toContain(
      '@property --weave-min-height { syntax: "*"; inherits: false; }',
    )
    expect(frameworkStyles?.textContent).toContain(
      '@property --weave-component-min-height { syntax: "*"; inherits: false; }',
    )
    expect(frameworkStyles?.textContent).toContain(
      '@property --weave-hover-min-height { syntax: "*"; inherits: false; }',
    )
  })

  it('encodes viewport breakpoint overrides with default theme breakpoints', () => {
    const { getByTestId } = render(
      <View
        width={20}
        md={{ width: 30, padding: 2 }}
        data={{ testid: 'responsive' }}
      />,
    )

    const element = getByTestId('responsive')
    const rule = runtimeRule(element, 'weave-view-props-')
    const frameworkStyles = document.querySelector(
      'style[data-weave-view-styles]',
    )

    expect(element.style.getPropertyValue('--weave-width')).toBe('')
    expect(rule).toContain('--weave-width:20rem;')
    expect(rule).toContain('--weave-md-width:30rem;')
    expect(rule).toContain('--weave-md-padding-top:2rem;')
    expect(element.getAttribute('md')).toBeNull()

    expect(frameworkStyles?.textContent).toContain(
      '@media (min-width: 48rem)',
    )
    expect(frameworkStyles?.textContent).toContain(
      '--weave-md-width { syntax: "*"; inherits: false; }',
    )
    expect(frameworkStyles?.textContent).toContain(
      '--weave-viewport-responsive-width:',
    )
  })

  it('creates a named CSS container and container breakpoint overrides', () => {
    const { getByTestId } = render(
      <View container="sidebar" data={{ testid: 'container' }}>
        <View
          containerMd={{ direction: 'row', gap: 1.5 }}
          data={{ testid: 'container-child' }}
        />
      </View>,
    )

    const container = getByTestId('container')
    const child = getByTestId('container-child')
    const containerRule = runtimeRule(container, 'weave-view-props-')
    const childRule = runtimeRule(child, 'weave-view-props-')
    const frameworkStyles = document.querySelector(
      'style[data-weave-view-styles]',
    )

    expect(container.style.getPropertyValue('--weave-container-type')).toBe('')
    expect(containerRule).toContain(
      '--weave-container-type:inline-size;',
    )
    expect(containerRule).toContain(
      '--weave-container-name:sidebar;',
    )
    expect(container.getAttribute('container')).toBeNull()

    expect(childRule).toContain(
      '--weave-container-md-flex-direction:row;',
    )
    expect(childRule).toContain('--weave-container-md-gap:1.5rem;')
    expect(child.getAttribute('containerMd')).toBeNull()

    expect(frameworkStyles?.textContent).toContain(
      '@container (min-width: 48rem)',
    )
    expect(frameworkStyles?.textContent).toContain(
      '--weave-container-responsive-gap:',
    )
  })

  it('encodes state styles in generated property classes', () => {
    const { getByTestId } = render(
      <View
        hover={{ scale: 1.03, opacity: 0.8 }}
        focusVisible={{ outlineWidth: 0.125 }}
        data={{ testid: 'states' }}
      />,
    )

    const element = getByTestId('states')
    const rule = runtimeRule(element, 'weave-view-props-')

    expect(rule).toContain('--weave-hover-transform:scale(1.03);')
    expect(rule).toContain('--weave-hover-opacity:0.8;')
    expect(rule).toContain(
      '--weave-focus-visible-outline-width:0.125rem;',
    )
    expect(element.style.getPropertyValue('--weave-hover-opacity')).toBe('')
  })
})
