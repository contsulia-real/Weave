import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  ThemeProvider,
  View,
  createTheme,
} from '../src'

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

function breakpointStyles(element: Element): string {
  const className = [...element.classList].find((name) =>
    name.startsWith('weave-breakpoints-'),
  )

  expect(className).toBeDefined()

  return (
    document.querySelector<HTMLStyleElement>(
      `style[data-weave-breakpoint-styles="${className}"]`,
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
    const rule = runtimeRule(element, 'weave-props-')

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
    const rule = runtimeRule(element, 'weave-props-')

    expect(element.className).toContain('weave-view')
    expect(element.className).toContain('user-class')
    expect(element.style.getPropertyValue('--weave-width')).toBe('')
    expect(element.style.width).toBe('10px')
    expect(element.getAttribute('style')).toContain('width: 10px')
    expect(rule).toContain('--weave-width:20rem;')
    expect(rule).not.toContain('10px')

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
    const rule = runtimeRule(element, 'weave-props-')
    const frameworkStyles = document.querySelector(
      'style[data-weave-view-styles]',
    )
    const responsiveStyles = breakpointStyles(element)

    expect(element.style.getPropertyValue('--weave-width')).toBe('')
    expect(rule).toContain('--weave-width:20rem;')
    expect(rule).toContain('--weave-md-width:30rem;')
    expect(rule).toContain('--weave-md-padding-top:2rem;')
    expect(element.getAttribute('md')).toBeNull()

    expect(responsiveStyles).toContain(
      '@media(min-width:48rem)',
    )
    expect(responsiveStyles).toContain(
      '@property--weave-md-width{syntax:"*";inherits:false;}',
    )
    expect(frameworkStyles?.textContent).toContain(
      '--weave-viewport-responsive-width',
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
    const containerRule = runtimeRule(container, 'weave-props-')
    const childRule = runtimeRule(child, 'weave-props-')
    const frameworkStyles = document.querySelector(
      'style[data-weave-view-styles]',
    )
    const responsiveStyles = breakpointStyles(child)

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

    expect(responsiveStyles).toContain(
      '@container(min-width:48rem)',
    )
    expect(frameworkStyles?.textContent).toContain(
      '--weave-container-responsive-gap',
    )
  })

  it('uses ThemeProvider breakpoint values and custom names', () => {
    const theme = createTheme({
      breakpoints: {
        md: 52,
        compact: 36,
        wide: 72,
      },
    })

    const { getByTestId } = render(
      <ThemeProvider theme={theme} mode="light">
        <View
          compact={{ width: 22, overflow: 'auto' }}
          containerWide={{ gap: 3 }}
          data={{ testid: 'custom-breakpoints' }}
        />
      </ThemeProvider>,
    )

    const element = getByTestId('custom-breakpoints')
    const rule = runtimeRule(element, 'weave-props-')
    const responsiveStyles = breakpointStyles(element)

    expect(rule).toContain('--weave-compact-width:22rem;')
    expect(rule).toContain('--weave-compact-overflow:auto;')
    expect(rule).toContain('--weave-container-wide-gap:3rem;')
    expect(element.getAttribute('compact')).toBeNull()
    expect(element.getAttribute('containerWide')).toBeNull()
    expect(element.getAttribute('data-weave-scroll-host')).toBe('')

    expect(responsiveStyles).toContain(
      '@media(min-width:36rem)',
    )
    expect(responsiveStyles).toContain(
      '@media(min-width:52rem)',
    )
    expect(responsiveStyles).not.toContain(
      '@media(min-width:48rem)',
    )
    expect(responsiveStyles).toContain(
      '@container(min-width:72rem)',
    )
  })

  it('does not leak inactive custom breakpoint props to the DOM', () => {
    const { getByTestId } = render(
      <View
        compact={{ width: 22 }}
        data={{ testid: 'inactive-breakpoint' }}
      />,
    )

    const element = getByTestId('inactive-breakpoint')

    expect(element.getAttribute('compact')).toBeNull()
    expect(
      [...element.classList].some((name) =>
        name.startsWith('weave-props-'),
      ),
    ).toBe(false)
  })

  it('still forwards native object-valued DOM props', () => {
    const { getByTestId } = render(
      <View
        dangerouslySetInnerHTML={{ __html: '<b>Native</b>' }}
        data={{ testid: 'native-object-prop' }}
      />,
    )

    expect(getByTestId('native-object-prop').innerHTML).toBe(
      '<b>Native</b>',
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
    const rule = runtimeRule(element, 'weave-props-')

    expect(rule).toContain('--weave-hover-transform:scale(1.03);')
    expect(rule).toContain('--weave-hover-opacity:0.8;')
    expect(rule).toContain(
      '--weave-focus-visible-outline-width:0.125rem;',
    )
    expect(element.style.getPropertyValue('--weave-hover-opacity')).toBe('')
  })

  it('does not force layout measurement on the scrollbar scroll hot path', () => {
    const rectSpy = vi.spyOn(
      HTMLElement.prototype,
      'getBoundingClientRect',
    )

    const { getByTestId } = render(
      <View
        height={6}
        overflow="auto"
        data={{ testid: 'scroll-hot-path' }}
      >
        <View height={20} />
      </View>,
    )

    rectSpy.mockClear()
    fireEvent.scroll(getByTestId('scroll-hot-path'))

    expect(rectSpy).not.toHaveBeenCalled()

    rectSpy.mockRestore()
  })
})
