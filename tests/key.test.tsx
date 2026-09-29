import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { createTheme, Key, ThemeProvider } from '../src'

const platformDescriptor = Object.getOwnPropertyDescriptor(navigator, 'platform')

function setPlatform(platform: string) {
  Object.defineProperty(navigator, 'platform', {
    configurable: true,
    value: platform,
  })
}

afterEach(() => {
  cleanup()

  if (platformDescriptor === undefined) {
    Reflect.deleteProperty(navigator, 'platform')
  } else {
    Object.defineProperty(navigator, 'platform', platformDescriptor)
  }
})

describe('Key', () => {
  it('renders a semantic kbd with the static Button surface', () => {
    const { getByText, queryByRole } = render(<Key value="K" />)
    const element = getByText('K').closest('kbd')

    expect(element?.tagName).toBe('KBD')
    expect(queryByRole('button')).toBeNull()
    expect(element?.classList.contains('weave-key')).toBe(true)
    expect(element?.classList.contains('weave-button')).toBe(true)
    expect(element?.classList.contains('weave-button--secondary')).toBe(true)
    expect(element?.classList.contains('weave-button--small')).toBe(true)
  })

  it('reuses Button variants and sizes without interactive visual feedback', () => {
    const { getByText } = render(<Key value="Enter" variant="tertiary" size="large" />)
    const element = getByText('Enter').closest('kbd')
    const stylesheet =
      document.querySelector<HTMLStyleElement>('style[data-weave-key-styles]')?.textContent ?? ''

    expect(element?.classList.contains('weave-button--tertiary')).toBe(true)
    expect(element?.classList.contains('weave-button--large')).toBe(true)
    expect(stylesheet).toContain('.weave-key:hover')
    expect(stylesheet).toContain('.weave-key:active')
    expect(stylesheet).toContain('var(--weave-feedback-rest-depth)')
    expect(stylesheet).not.toContain('var(--weave-feedback-hover-depth)')
    expect(stylesheet).not.toContain('var(--weave-feedback-press-depth)')
    expect(stylesheet).not.toContain('var(--weave-feedback-hover-scale)')
    expect(stylesheet).not.toContain('var(--weave-feedback-press-scale)')
  })

  it('uses the Button theme as its single visual source', () => {
    const theme = createTheme({
      components: {
        Button: {
          variants: {
            secondary: {
              background: 'danger',
              depthColor: 'rgb(10 20 30)',
            },
          },
        },
      },
    })
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <Key value="Esc" />
      </ThemeProvider>,
    )
    const element = getByText('Esc').closest('kbd')
    const themeClass = [...(element?.classList ?? [])].find((name) =>
      name.startsWith('weave-button-theme-'),
    )
    const runtimeStyle = (
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-runtime-class="' + themeClass + '"]',
      )?.textContent ?? ''
    ).replace(/\s+/g, '')

    expect(themeClass).toBeDefined()
    expect(runtimeStyle).toContain('--weave-button-theme-secondary-background:')
    expect(runtimeStyle).toContain('--weave-color-danger')
    expect(runtimeStyle).toContain('--weave-button-theme-secondary-depth-color:rgb(102030)')
  })

  it('detects the browser Meta key owner and supports explicit override', () => {
    setPlatform('MacIntel')

    const { getByTestId, rerender } = render(
      <Key
        value="meta"
        viewProps={{
          data: {
            testid: 'meta-key',
          },
        }}
      />,
    )

    expect(getByTestId('meta-key').textContent).toBe('⌘')

    rerender(
      <Key
        value="meta"
        metaKey="windows"
        viewProps={{
          data: {
            testid: 'meta-key',
          },
        }}
      />,
    )
    expect(getByTestId('meta-key').textContent).toBe('⊞')

    rerender(
      <Key
        value="meta"
        metaKey="meta"
        viewProps={{
          data: {
            testid: 'meta-key',
          },
        }}
      />,
    )
    expect(getByTestId('meta-key').textContent).toBe('Meta')
  })

  it('maps Windows automatically and leaves non-meta values untouched', () => {
    setPlatform('Win32')

    const { getByTestId, rerender } = render(
      <Key
        value="meta"
        viewProps={{
          data: {
            testid: 'key',
          },
        }}
      />,
    )

    expect(getByTestId('key').textContent).toBe('⊞')

    rerender(
      <Key
        value="Shift"
        metaKey="command"
        viewProps={{
          data: {
            testid: 'key',
          },
        }}
      />,
    )

    expect(getByTestId('key').textContent).toBe('Shift')
  })
})
