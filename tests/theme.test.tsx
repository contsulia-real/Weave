import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  ThemeProvider,
  View,
  createTheme,
} from '../src'
import { themeTokenVariables } from '../src/theme/theme-css'

afterEach(cleanup)

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

  it('applies local token overrides without losing inherited tokens', () => {
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

    const scope = getByTestId('themed').parentElement

    expect(scope?.getAttribute('data-weave-theme')).not.toBeNull()
    expect(scope?.style.getPropertyValue('--weave-color-primary')).toBe(
      '#ff4f87',
    )
    expect(scope?.style.getPropertyValue('--weave-color-surface')).toBe(
      '#18181b',
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
    expect(scopes[0]?.style.getPropertyValue('--weave-color-primary')).toBe(
      '#6d5dfc',
    )
    expect(scopes[1]?.style.getPropertyValue('--weave-color-primary')).toBe(
      '#b9adff',
    )
    expect(scopes[1]?.getAttribute('data-weave-theme-mode')).toBe('dark')
  })
})
