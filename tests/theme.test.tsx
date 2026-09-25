import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  ThemeProvider,
  View,
  createTheme,
} from '../src'
import { themeTokenVariables } from '../src/theme/theme-css'

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

describe('Theme', () => {
  it('normalizes scale and time tokens to framework units', () => {
    const variables = themeTokenVariables({
      spacing: {
        compact: 0.5,
      },
      radius: {
        card: 1,
      },
      typography: {
        family: {
          body: 'Inter, sans-serif',
        },
        size: {
          medium: 1,
        },
        weight: {
          regular: 400,
        },
        lineHeight: {
          body: 1.5,
        },
        letterSpacing: {
          normal: '0.01em',
        },
      },
      feedback: {
        restDepth: 0.1875,
        hoverScale: 1.03,
        pressOffset: 0.125,
        pressScale: 0.985,
      },
      motion: {
        duration: {
          fast: 120,
        },
      },
    })

    expect(variables['--weave-typography-family-body']).toBe(
      'Inter, sans-serif',
    )
    expect(variables['--weave-typography-size-medium']).toBe('1rem')
    expect(variables['--weave-typography-weight-regular']).toBe(400)
    expect(variables['--weave-typography-line-height-body']).toBe(1.5)
    expect(variables['--weave-typography-letter-spacing-normal']).toBe(
      '0.01em',
    )
    expect(variables['--weave-spacing-compact']).toBe('0.5rem')
    expect(variables['--weave-radius-card']).toBe('1rem')
    expect(variables['--weave-feedback-rest-depth']).toBe('0.1875rem')
    expect(variables['--weave-feedback-hover-scale']).toBe(1.03)
    expect(variables['--weave-feedback-press-offset']).toBe('0.125rem')
    expect(variables['--weave-feedback-press-scale']).toBe(0.985)
    expect(variables['--weave-motion-duration-fast']).toBe('120ms')
  })

  it('applies the typography baseline through ThemeProvider', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <View data={{ testid: 'typography-child' }} />
      </ThemeProvider>,
    )

    const scope = getByTestId(
      'typography-child',
    ).parentElement as HTMLElement
    const rule = runtimeRule(scope, 'weave-theme-')

    expect(rule).toContain(
      'font-family:var(--weave-typography-family-body);',
    )
    expect(rule).toContain(
      'font-size:var(--weave-typography-size-medium);',
    )
    expect(rule).toContain(
      'font-weight:var(--weave-typography-weight-regular);',
    )
    expect(rule).toContain(
      'line-height:var(--weave-typography-line-height-body);',
    )
    expect(rule).toContain(
      'letter-spacing:var(--weave-typography-letter-spacing-normal);',
    )
  })

  it('applies local token overrides through theme classes', () => {
    const outer = createTheme({
      tokens: {
        color: {
          primary: '#ff4f87',
          surface: '#ffffff',
        },
      },
    })

    const inner = createTheme({
      tokens: {
        color: {
          surface: '#18181b',
        },
      },
    })

    const { getByTestId } = render(
      <ThemeProvider theme={outer} mode="light">
        <ThemeProvider theme={inner} mode="light">
          <View data={{ testid: 'themed' }} />
        </ThemeProvider>
      </ThemeProvider>,
    )

    const scope = getByTestId('themed').parentElement as HTMLElement
    const rule = runtimeRule(scope, 'weave-theme-')

    expect(scope.getAttribute('data-weave-theme')).not.toBeNull()
    expect(scope.className).toContain('weave-theme')
    expect(scope.style.getPropertyValue('--weave-color-primary')).toBe('')
    expect(rule).toContain('--weave-color-primary:#ff4f87;')
    expect(rule).toContain('--weave-color-surface:#18181b;')
    expect(rule).toContain('display:contents;')
  })

  it('isolates breakpoint styles between nested providers', () => {
    const outer = createTheme({
      breakpoints: {
        md: 52,
      },
    })
    const inner = createTheme({
      breakpoints: {
        md: 60,
      },
    })

    const { getByTestId } = render(
      <ThemeProvider theme={outer} mode="light">
        <View
          md={{ width: 20 }}
          data={{ testid: 'outer-breakpoint' }}
        />
        <ThemeProvider theme={inner}>
          <View
            md={{ width: 30 }}
            data={{ testid: 'inner-breakpoint' }}
          />
        </ThemeProvider>
      </ThemeProvider>,
    )

    const outerView = getByTestId('outer-breakpoint')
    const innerView = getByTestId('inner-breakpoint')
    const outerClass = [...outerView.classList].find((name) =>
      name.startsWith('weave-breakpoints-'),
    )
    const innerClass = [...innerView.classList].find((name) =>
      name.startsWith('weave-breakpoints-'),
    )

    expect(outerClass).toBeDefined()
    expect(innerClass).toBeDefined()
    expect(outerClass).not.toBe(innerClass)
    expect(breakpointStyles(outerView)).toContain(
      '@media(min-width:52rem)',
    )
    expect(breakpointStyles(innerView)).toContain(
      '@media(min-width:60rem)',
    )
  })

  it('inherits the parent mode when a nested provider omits mode', () => {
    const { container } = render(
      <ThemeProvider mode="dark">
        <ThemeProvider>
          <View />
        </ThemeProvider>
      </ThemeProvider>,
    )

    const scopes = container.querySelectorAll<HTMLElement>(
      '[data-weave-theme]',
    )

    expect(scopes).toHaveLength(2)
    expect(scopes[0]?.getAttribute('data-weave-theme-mode')).toBe('dark')
    expect(scopes[1]?.getAttribute('data-weave-theme-mode')).toBe('dark')
  })

  it('keeps inherited mode definitions available to nested providers', () => {
    const theme = createTheme({
      tokens: {
        color: {
          primary: '#6d5dfc',
        },
      },
      modes: {
        dark: {
          tokens: {
            color: {
              primary: '#b9adff',
            },
          },
        },
      },
    })

    const { container } = render(
      <ThemeProvider theme={theme} mode="light">
        <ThemeProvider mode="dark">
          <View />
        </ThemeProvider>
      </ThemeProvider>,
    )

    const scopes = container.querySelectorAll<HTMLElement>(
      '[data-weave-theme]',
    )

    expect(scopes).toHaveLength(2)
    expect(runtimeRule(scopes[0]!, 'weave-theme-')).toContain(
      '--weave-color-primary:#6d5dfc;',
    )
    expect(runtimeRule(scopes[1]!, 'weave-theme-')).toContain(
      '--weave-color-primary:#b9adff;',
    )
    expect(scopes[1]?.getAttribute('data-weave-theme-mode')).toBe('dark')
  })
})
