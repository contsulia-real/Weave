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

describe('Theme', () => {
  it('normalizes scale and time tokens to framework units', () => {
    const variables = themeTokenVariables({
      spacing: {
        compact: 0.5,
      },
      radius: {
        card: 1,
      },
      motion: {
        duration: {
          fast: 120,
        },
      },
    })

    expect(variables['--weave-spacing-compact']).toBe('0.5rem')
    expect(variables['--weave-radius-card']).toBe('1rem')
    expect(variables['--weave-motion-duration-fast']).toBe('120ms')
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
