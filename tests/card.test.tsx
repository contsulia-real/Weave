import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Button, Card, createTheme, Text, ThemeProvider } from '../src'

afterEach(cleanup)

function runtimeRule(element: Element, prefix: string): string {
  const className = [...element.classList].find((name) => name.startsWith(prefix))
  expect(className).toBeDefined()

  return (
    document.querySelector<HTMLStyleElement>(`style[data-weave-runtime-class="${className}"]`)
      ?.textContent ?? ''
  ).replace(/\s+/g, '')
}

describe('Card', () => {
  it('renders a passive entity surface without interactive semantics by default', () => {
    const { getByTestId } = render(
      <Card viewProps={{ data: { testid: 'card' } }}>
        <Text>Passive card</Text>
      </Card>,
    )

    const card = getByTestId('card')

    expect(card.tagName).toBe('DIV')
    expect(card.getAttribute('role')).toBeNull()
    expect(card.getAttribute('tabindex')).toBeNull()
    expect(card.getAttribute('aria-pressed')).toBeNull()
    expect(card.getAttribute('data-weave-card-clickable')).toBe('false')
    expect(card.getAttribute('data-weave-card-selectable')).toBe('false')

    const themeRule = runtimeRule(card, 'weave-card-theme-')
    expect(themeRule).toContain('--weave-card-theme-background:var(--weave-color-surface,surface);')
    expect(themeRule).toContain('--weave-card-theme-border-width:0.0625rem;')
    expect(themeRule).toContain('--weave-card-theme-radius:var(--weave-radius-large);')
    expect(themeRule).toContain('--weave-card-theme-padding:1rem;')
    expect(themeRule).toContain('--weave-card-theme-shadow:var(--weave-shadow-small);')
    expect(themeRule).toContain('--weave-card-theme-depth-color:color-mix(')
    expect(themeRule).toContain(
      '--weave-card-theme-hover-background:var(--weave-color-surfaceHover,surfaceHover);',
    )
  })

  it('supports clickable activation with pointer, Enter and Space', () => {
    const onClick = vi.fn()
    const { getByRole } = render(
      <Card clickable viewProps={{ label: 'Open card', onClick }}>
        Open
      </Card>,
    )

    const card = getByRole('button', { name: 'Open card' })
    expect(card.getAttribute('tabindex')).toBe('0')
    expect(card.getAttribute('aria-pressed')).toBeNull()

    fireEvent.click(card)
    fireEvent.keyDown(card, { key: 'Enter' })
    fireEvent.keyDown(card, { key: ' ' })

    expect(onClick).toHaveBeenCalledTimes(3)
  })

  it('supports uncontrolled selection independently from click activation', () => {
    const onSelectedChange = vi.fn()
    const onClick = vi.fn()
    const { getByRole } = render(
      <Card
        selectable
        onSelectedChange={onSelectedChange}
        viewProps={{ label: 'Selectable card', onClick }}
      >
        Select
      </Card>,
    )

    const card = getByRole('button', { name: 'Selectable card' })

    expect(card.getAttribute('aria-pressed')).toBe('false')

    fireEvent.click(card)

    expect(card.getAttribute('aria-pressed')).toBe('true')
    expect(onSelectedChange).toHaveBeenCalledWith(true)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('runs click activation and selection toggle together when both abilities are enabled', () => {
    const onClick = vi.fn()
    const onSelectedChange = vi.fn()
    const { getByRole } = render(
      <Card
        clickable
        selectable
        onSelectedChange={onSelectedChange}
        viewProps={{ label: 'Combined card', onClick }}
      >
        Combined
      </Card>,
    )

    const card = getByRole('button', { name: 'Combined card' })
    fireEvent.click(card)

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onSelectedChange).toHaveBeenCalledWith(true)
    expect(card.getAttribute('aria-pressed')).toBe('true')
  })

  it('keeps controlled selection authoritative and repeats rejected requests', () => {
    const onSelectedChange = vi.fn()
    const { getByRole } = render(
      <Card
        selectable
        selected={false}
        onSelectedChange={onSelectedChange}
        viewProps={{ label: 'Controlled' }}
      >
        Controlled
      </Card>,
    )

    const card = getByRole('button', { name: 'Controlled' })

    fireEvent.click(card)
    fireEvent.click(card)

    expect(card.getAttribute('aria-pressed')).toBe('false')
    expect(onSelectedChange).toHaveBeenNthCalledWith(1, true)
    expect(onSelectedChange).toHaveBeenNthCalledWith(2, true)
  })

  it('does not activate or select the card from an interactive descendant', () => {
    const onClick = vi.fn()
    const onSelectedChange = vi.fn()
    const childClick = vi.fn()
    const { getByRole } = render(
      <Card
        clickable
        selectable
        onSelectedChange={onSelectedChange}
        viewProps={{ label: 'Card with action', onClick }}
      >
        <Button text="Inner action" viewProps={{ onClick: childClick }} />
      </Card>,
    )

    const card = getByRole('button', { name: 'Card with action' })
    fireEvent.click(getByRole('button', { name: 'Inner action' }))

    expect(childClick).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
    expect(onSelectedChange).not.toHaveBeenCalled()
    expect(card.getAttribute('aria-pressed')).toBe('false')
  })

  it('honors generic disabled semantics for interactive cards', () => {
    const onClick = vi.fn()
    const onSelectedChange = vi.fn()
    const { getByRole } = render(
      <Card
        clickable
        selectable
        onSelectedChange={onSelectedChange}
        viewProps={{ label: 'Disabled card', disabled: true, onClick }}
      >
        Disabled
      </Card>,
    )

    const card = getByRole('button', { name: 'Disabled card' })
    expect(card.getAttribute('aria-disabled')).toBe('true')

    fireEvent.click(card)
    fireEvent.keyDown(card, { key: 'Enter' })

    expect(onClick).not.toHaveBeenCalled()
    expect(onSelectedChange).not.toHaveBeenCalled()
  })

  it('resolves Card theme customization through its component theme', () => {
    const theme = createTheme({
      components: {
        Card: {
          base: {
            background: 'primary',
            borderColor: 'danger',
            borderWidth: 0.125,
            radius: 'medium',
            padding: 1.5,
            shadow: 'medium',
            depthColor: 'danger',
            hoverBackground: 'secondary',
            activeBackground: 'warning',
            selectedBackground: 'surfaceHover',
            selectedBorderColor: 'success',
          },
        },
      },
    })

    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Card selectable defaultSelected viewProps={{ data: { testid: 'themed-card' } }}>
          Themed
        </Card>
      </ThemeProvider>,
    )

    const card = getByTestId('themed-card')
    const themeRule = runtimeRule(card, 'weave-card-theme-')

    expect(themeRule).toContain('--weave-card-theme-background:var(--weave-color-primary,primary);')
    expect(themeRule).toContain('--weave-card-theme-border-color:var(--weave-color-danger,danger);')
    expect(themeRule).toContain('--weave-card-theme-border-width:0.125rem;')
    expect(themeRule).toContain('--weave-card-theme-radius:var(--weave-radius-medium);')
    expect(themeRule).toContain('--weave-card-theme-padding:1.5rem;')
    expect(themeRule).toContain('--weave-card-theme-shadow:var(--weave-shadow-medium);')
    expect(themeRule).toContain('--weave-card-theme-depth-color:var(--weave-color-danger,danger);')
    expect(themeRule).toContain(
      '--weave-card-theme-hover-background:var(--weave-color-secondary,secondary);',
    )
    expect(themeRule).toContain(
      '--weave-card-theme-active-background:var(--weave-color-warning,warning);',
    )
    expect(themeRule).toContain(
      '--weave-card-theme-selected-border-color:var(--weave-color-success,success);',
    )
  })
})
