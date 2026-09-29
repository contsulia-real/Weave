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
  it('renders a semantic kbd with the static Button surface and letter icon', () => {
    const { getByTestId, queryByRole } = render(
      <Key
        value="K"
        viewProps={{
          data: {
            testid: 'letter-key',
          },
        }}
      />,
    )
    const element = getByTestId('letter-key')

    expect(element.tagName).toBe('KBD')
    expect(queryByRole('button')).toBeNull()
    expect(element.classList.contains('weave-key')).toBe(true)
    expect(element.classList.contains('weave-button')).toBe(true)
    expect(element.classList.contains('weave-button--secondary')).toBe(true)
    expect(element.classList.contains('weave-button--small')).toBe(true)
    expect(element.getAttribute('aria-label')).toBe('K')
    expect(element.querySelector('.tabler-icon-letter-k')).not.toBeNull()
    expect(element.querySelector('[data-weave-icon]')?.getAttribute('data-weave-icon-size')).toBe(
      'xlarge',
    )

    const stylesheet =
      document.querySelector<HTMLStyleElement>('style[data-weave-key-styles]')?.textContent ?? ''
    expect(stylesheet).toContain('--weave-component-width: 1.75rem')
    expect(stylesheet).toContain('--weave-component-height: 1.75rem')
    expect(stylesheet).toContain('--weave-component-width: 2rem')
    expect(stylesheet).toContain('--weave-component-height: 2rem')
    expect(stylesheet).toContain('--weave-component-width: 2.25rem')
    expect(stylesheet).toContain('--weave-component-height: 2.25rem')
  })

  it('reuses Button variants and sizes without interactive visual feedback', () => {
    const { getByTestId } = render(
      <Key
        value="Enter"
        variant="tertiary"
        size="large"
        viewProps={{ data: { testid: 'large-key' } }}
      />,
    )
    const element = getByTestId('large-key')
    const stylesheet =
      document.querySelector<HTMLStyleElement>('style[data-weave-key-styles]')?.textContent ?? ''

    expect(element.classList.contains('weave-button--tertiary')).toBe(true)
    expect(element.classList.contains('weave-button--large')).toBe(true)
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

    expect(getByTestId('meta-key').getAttribute('aria-label')).toBe('Command')
    expect(getByTestId('meta-key').querySelector('.tabler-icon-command')).not.toBeNull()

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
    expect(getByTestId('meta-key').getAttribute('aria-label')).toBe('Windows')
    expect(getByTestId('meta-key').querySelector('.tabler-icon-brand-windows')).not.toBeNull()

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
    expect(getByTestId('meta-key').querySelector('[data-weave-icon]')).toBeNull()
  })

  it('maps Windows automatically and leaves text-only keys untouched', () => {
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

    expect(getByTestId('key').getAttribute('aria-label')).toBe('Windows')
    expect(getByTestId('key').querySelector('.tabler-icon-brand-windows')).not.toBeNull()

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

    expect(getByTestId('key').getAttribute('aria-label')).toBe('Shift')
    expect(getByTestId('key').querySelector('.tabler-icon-arrow-big-up')).not.toBeNull()
  })

  it('uses Tabler icons for keyboard keys with exact semantic matches', () => {
    const { getByTestId, rerender } = render(
      <Key
        value="alt"
        viewProps={{
          data: {
            testid: 'special-key',
          },
        }}
      />,
    )
    const key = () => getByTestId('special-key')

    expect(key().getAttribute('aria-label')).toBe('Alt')
    expect(key().querySelector('.tabler-icon-alt')).not.toBeNull()

    rerender(<Key value="fn" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Fn')
    expect(key().querySelector('.tabler-icon-function')).not.toBeNull()

    rerender(<Key value="F1" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('F1')
    expect(key().querySelector('.tabler-icon-square-f1')).not.toBeNull()

    rerender(<Key value="F9" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().querySelector('.tabler-icon-square-f9')).not.toBeNull()

    rerender(<Key value="F10" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().textContent).toBe('F10')
    expect(key().querySelector('[data-weave-icon]')).toBeNull()

    rerender(<Key value="7" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('7')
    expect(key().querySelector('.tabler-icon-number-7')).not.toBeNull()

    rerender(<Key value="option" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Option')
    expect(key().querySelector('.tabler-icon-option')).not.toBeNull()

    rerender(<Key value="Enter" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Enter')
    expect(key().querySelector('.tabler-icon-corner-down-left')).not.toBeNull()

    rerender(<Key value="Backspace" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Backspace')
    expect(key().querySelector('.tabler-icon-backspace')).not.toBeNull()

    rerender(<Key value="Space" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Space')
    expect(key().querySelector('.tabler-icon-space')).not.toBeNull()

    rerender(<Key value="ArrowUp" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Arrow Up')
    expect(key().querySelector('.tabler-icon-arrow-up')).not.toBeNull()

    rerender(<Key value="ArrowDown" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Arrow Down')
    expect(key().querySelector('.tabler-icon-arrow-down')).not.toBeNull()

    rerender(<Key value="ArrowLeft" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Arrow Left')
    expect(key().querySelector('.tabler-icon-arrow-left')).not.toBeNull()

    rerender(<Key value="ArrowRight" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Arrow Right')
    expect(key().querySelector('.tabler-icon-arrow-right')).not.toBeNull()

    rerender(<Key value="Tab" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Tab')
    expect(key().querySelector('.tabler-icon-arrow-bar-to-right')).not.toBeNull()

    rerender(<Key value="CapsLock" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Caps Lock')
    expect(key().querySelector('.tabler-icon-letter-case-upper')).not.toBeNull()

    rerender(<Key value="Shift" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Shift')
    expect(key().querySelector('.tabler-icon-arrow-big-up')).not.toBeNull()

    rerender(<Key value="Pause" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Pause')
    expect(key().querySelector('.tabler-icon-player-pause')).not.toBeNull()

    rerender(<Key value="Insert" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Insert')
    expect(key().querySelector('.tabler-icon-text-plus')).not.toBeNull()

    rerender(<Key value="PageUp" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Page Up')
    expect(key().querySelector('.tabler-icon-arrow-big-up-lines')).not.toBeNull()

    rerender(<Key value="PageDown" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Page Down')
    expect(key().querySelector('.tabler-icon-arrow-big-down-lines')).not.toBeNull()

    rerender(<Key value="Delete" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Delete')
    expect(key().querySelector('.tabler-icon-trash')).not.toBeNull()

    rerender(<Key value="*" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('*')
    expect(key().querySelector('.tabler-icon-asterisk')).not.toBeNull()

    rerender(<Key value="+" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().querySelector('.tabler-icon-plus')).not.toBeNull()

    rerender(<Key value="-" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().querySelector('.tabler-icon-minus')).not.toBeNull()

    rerender(<Key value="=" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().querySelector('.tabler-icon-equal')).not.toBeNull()

    rerender(<Key value="~" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().querySelector('.tabler-icon-tilde')).not.toBeNull()

    rerender(<Key value="." viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().querySelector('.tabler-icon-point')).not.toBeNull()

    rerender(<Key value="/" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().querySelector('.tabler-icon-slash')).not.toBeNull()

    rerender(<Key value={'\\'} viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().querySelector('.tabler-icon-backslash')).not.toBeNull()

    rerender(<Key value="Home" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Home')
    expect(key().querySelector('.tabler-icon-home')).not.toBeNull()

    rerender(<Key value="PrintScreen" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Print Screen')
    expect(key().querySelector('.tabler-icon-screenshot')).not.toBeNull()

    rerender(<Key value="Menu" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().getAttribute('aria-label')).toBe('Menu')
    expect(key().querySelector('.tabler-icon-menu-2')).not.toBeNull()

    rerender(<Key value="Esc" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().textContent).toBe('Esc')
    expect(key().querySelector('[data-weave-icon]')).toBeNull()

    rerender(<Key value="Ctrl" viewProps={{ data: { testid: 'special-key' } }} />)
    expect(key().textContent).toBe('Ctrl')
    expect(key().querySelector('[data-weave-icon]')).toBeNull()
  })
})
