import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  createTheme,
  ThemeProvider,
} from '../src'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  delete (HTMLElement.prototype as Partial<HTMLElement>).animate
})

function BasicAccordion({ collapsible, disabled }: { collapsible?: boolean; disabled?: boolean }) {
  return (
    <Accordion collapsible={collapsible} disabled={disabled}>
      <AccordionItem value="account">
        <AccordionTrigger>Account</AccordionTrigger>
        <AccordionPanel>Account panel</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="security">
        <AccordionTrigger>Security</AccordionTrigger>
        <AccordionPanel>Security panel</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="disabled" disabled>
        <AccordionTrigger>Disabled</AccordionTrigger>
        <AccordionPanel>Disabled panel</AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

describe('Accordion', () => {
  it('opens the first enabled item by default and links trigger and panel semantics', () => {
    const { getByRole, queryByRole } = render(<BasicAccordion />)

    const trigger = getByRole('button', { name: 'Account' })
    const panel = getByRole('region', { name: 'Account' })

    expect(trigger.tagName).toBe('BUTTON')
    expect(trigger.getAttribute('type')).toBe('button')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id)
    expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id)
    expect(queryByRole('region', { name: 'Security' })).toBeNull()
  })

  it('keeps one item open by default when collapsible is false', async () => {
    const { getByRole } = render(<BasicAccordion />)
    const account = getByRole('button', { name: 'Account' })

    fireEvent.click(account)
    expect(account.getAttribute('aria-expanded')).toBe('true')

    fireEvent.click(getByRole('button', { name: 'Security' }))

    expect(account.getAttribute('aria-expanded')).toBe('false')
    expect(getByRole('button', { name: 'Security' }).getAttribute('aria-expanded')).toBe('true')

    await waitFor(() => {
      expect(getByRole('region', { name: 'Security' })).toBeDefined()
    })
  })

  it('allows the single item to close when collapsible is true', async () => {
    const { getByRole, queryByRole } = render(<BasicAccordion collapsible />)
    const account = getByRole('button', { name: 'Account' })

    const panelId = account.getAttribute('aria-controls') ?? ''
    fireEvent.click(account)
    expect(account.getAttribute('aria-expanded')).toBe('false')
    expect(document.getElementById(panelId)?.hasAttribute('inert')).toBe(true)
    expect(document.getElementById(panelId)?.getAttribute('aria-hidden')).toBe('true')

    await waitFor(() => {
      expect(queryByRole('region', { name: 'Account' })).toBeNull()
    })
  })

  it('supports multiple independently open items', async () => {
    const { getByRole, queryByRole } = render(
      <Accordion multiple defaultValue={['account']}>
        <AccordionItem value="account">
          <AccordionTrigger>Account</AccordionTrigger>
          <AccordionPanel>Account panel</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="security">
          <AccordionTrigger>Security</AccordionTrigger>
          <AccordionPanel>Security panel</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    )

    fireEvent.click(getByRole('button', { name: 'Security' }))

    expect(getByRole('button', { name: 'Account' }).getAttribute('aria-expanded')).toBe('true')
    expect(getByRole('button', { name: 'Security' }).getAttribute('aria-expanded')).toBe('true')
    expect(getByRole('region', { name: 'Account' })).toBeDefined()
    expect(getByRole('region', { name: 'Security' })).toBeDefined()

    fireEvent.click(getByRole('button', { name: 'Account' }))

    await waitFor(() => {
      expect(queryByRole('region', { name: 'Account' })).toBeNull()
    })
    expect(getByRole('region', { name: 'Security' })).toBeDefined()
  })

  it('supports controlled single value without mutating it internally', () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(
      <Accordion value="account" onValueChange={onValueChange}>
        <AccordionItem value="account">
          <AccordionTrigger>Account</AccordionTrigger>
          <AccordionPanel>Account panel</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="security">
          <AccordionTrigger>Security</AccordionTrigger>
          <AccordionPanel>Security panel</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    )

    fireEvent.click(getByRole('button', { name: 'Security' }))

    expect(onValueChange).toHaveBeenCalledWith('security')
    expect(getByRole('button', { name: 'Account' }).getAttribute('aria-expanded')).toBe('true')
    expect(getByRole('button', { name: 'Security' }).getAttribute('aria-expanded')).toBe('false')
  })

  it('supports controlled multiple values', () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(
      <Accordion multiple value={['account']} onValueChange={onValueChange}>
        <AccordionItem value="account">
          <AccordionTrigger>Account</AccordionTrigger>
          <AccordionPanel>Account panel</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="security">
          <AccordionTrigger>Security</AccordionTrigger>
          <AccordionPanel>Security panel</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    )

    fireEvent.click(getByRole('button', { name: 'Security' }))
    expect(onValueChange).toHaveBeenCalledWith(['account', 'security'])
  })

  it('blocks root and item disabled triggers without closing already open content', () => {
    const rootChange = vi.fn()
    const { getByRole, rerender } = render(<BasicAccordion />)

    const disabledItem = getByRole('button', { name: 'Disabled' })
    expect((disabledItem as HTMLButtonElement).disabled).toBe(true)
    fireEvent.click(disabledItem)
    expect(disabledItem.getAttribute('aria-expanded')).toBe('false')

    rerender(
      <Accordion value="account" onValueChange={rootChange} disabled>
        <AccordionItem value="account">
          <AccordionTrigger>Account</AccordionTrigger>
          <AccordionPanel>Account panel</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    )

    const rootDisabled = getByRole('button', { name: 'Account' })
    expect((rootDisabled as HTMLButtonElement).disabled).toBe(true)
    expect(rootDisabled.getAttribute('aria-expanded')).toBe('true')
    expect(getByRole('region', { name: 'Account' })).toBeDefined()
    fireEvent.click(rootDisabled)
    expect(rootChange).not.toHaveBeenCalled()
  })

  it('uses right/down default chevrons and allows separate expand and collapse icon replacement', () => {
    const { getByRole, rerender } = render(
      <Accordion defaultValue={null} collapsible>
        <AccordionItem value="default">
          <AccordionTrigger>Default</AccordionTrigger>
          <AccordionPanel>Default panel</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    )

    const defaultTrigger = getByRole('button', { name: 'Default' })
    expect(defaultTrigger.querySelector('path')?.getAttribute('d')).toBe('m9 18 6-6-6-6')

    fireEvent.click(defaultTrigger)
    expect(defaultTrigger.querySelector('path')?.getAttribute('d')).toBe('m6 9 6 6 6-6')

    const expandIcon = (
      <svg data-testid="expand-icon" viewBox="0 0 24 24">
        <path d="M4 12h16" />
      </svg>
    )
    const collapseIcon = (
      <svg data-testid="collapse-icon" viewBox="0 0 24 24">
        <path d="M4 12h16M12 4v16" />
      </svg>
    )

    rerender(
      <Accordion defaultValue={null} collapsible>
        <AccordionItem value="custom">
          <AccordionTrigger expandIcon={expandIcon} collapseIcon={collapseIcon}>
            Custom
          </AccordionTrigger>
          <AccordionPanel>Custom panel</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    )

    const trigger = getByRole('button', { name: 'Custom' })
    expect(document.querySelector('[data-testid="expand-icon"]')).not.toBeNull()
    expect(document.querySelector('[data-testid="collapse-icon"]')).toBeNull()

    fireEvent.click(trigger)

    expect(document.querySelector('[data-testid="collapse-icon"]')).not.toBeNull()
    expect(document.querySelector('[data-testid="expand-icon"]')).toBeNull()
  })

  it('renders real Divider components between items and keeps the root transparent', () => {
    const { container } = render(<BasicAccordion />)

    const dividers = container.querySelectorAll<HTMLElement>('[data-weave-divider]')
    expect(dividers).toHaveLength(2)
    expect(dividers[0]?.style.getPropertyValue('--weave-divider-color')).toBe(
      'var(--weave-accordion-divider-color)',
    )
    const root = container.querySelector<HTMLElement>('[data-weave-accordion]')
    expect(root).not.toBeNull()
    expect(root?.className).toContain('weave-accordion')
  })

  it('resolves Accordion theme values through the component theme', () => {
    const theme = createTheme({
      components: {
        Accordion: {
          base: {
            dividerColor: 'danger',
            triggerHoverBackground: 'primary',
            indicatorSize: 2,
          },
        },
      },
    })

    const { container } = render(
      <ThemeProvider theme={theme}>
        <BasicAccordion />
      </ThemeProvider>,
    )

    const root = container.querySelector<HTMLElement>('[data-weave-accordion]')
    expect(root).not.toBeNull()

    const className = [...(root?.classList ?? [])].find((name) =>
      name.startsWith('weave-accordion-theme-'),
    )
    expect(className).toBeDefined()

    const rule = (
      document.querySelector<HTMLStyleElement>(
        `style[data-weave-runtime-class="${className ?? ''}"]`,
      )?.textContent ?? ''
    ).replace(/\s+/g, '')

    expect(rule).toContain('--weave-accordion-divider-color:var(--weave-color-danger,danger);')
    expect(rule).toContain(
      '--weave-accordion-trigger-hover-background:var(--weave-color-primary,primary);',
    )
    expect(rule).toContain('--weave-accordion-indicator-size:2rem;')
  })

  it('rejects duplicate AccordionItem values', () => {
    expect(() =>
      render(
        <Accordion>
          <AccordionItem value="duplicate">
            <AccordionTrigger>One</AccordionTrigger>
            <AccordionPanel>One panel</AccordionPanel>
          </AccordionItem>
          <AccordionItem value="duplicate">
            <AccordionTrigger>Two</AccordionTrigger>
            <AccordionPanel>Two panel</AccordionPanel>
          </AccordionItem>
        </Accordion>,
      ),
    ).toThrow('AccordionItem value "duplicate" must be unique within Accordion')
  })
})
