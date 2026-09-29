import {
  cleanup,
  render,
} from '@testing-library/react'
import {
  afterEach,
  describe,
  expect,
  it,
} from 'vitest'
import { Link } from '../src'

afterEach(cleanup)

describe('Link', () => {
  it('renders a real anchor and falls back to href as visible text', () => {
    const { getByRole } = render(
      <Link href="https://example.com/docs" />,
    )

    const link = getByRole('link', {
      name: 'https://example.com/docs',
    }) as HTMLAnchorElement

    expect(link.tagName).toBe('A')
    expect(link.href).toBe('https://example.com/docs')
    expect(link.textContent).toContain(
      'https://example.com/docs',
    )
    expect(
      link.querySelector('[data-weave-text]'),
    ).not.toBeNull()
  })

  it('uses text when provided without changing the href', () => {
    const { getByRole } = render(
      <Link
        href="https://example.com/docs"
        text="Documentation"
      />,
    )

    const link = getByRole('link', {
      name: 'Documentation',
    }) as HTMLAnchorElement

    expect(link.getAttribute('href')).toBe(
      'https://example.com/docs',
    )
    expect(link.textContent).toContain('Documentation')
    expect(link.textContent).not.toContain(
      'https://example.com/docs',
    )
  })

  it('keeps the link icon by default and can hide it explicitly', () => {
    const { getByRole, rerender } = render(
      <Link href="/docs" text="Docs" />,
    )

    const link = getByRole('link', {
      name: 'Docs',
    })

    expect(
      link.querySelector('[data-weave-icon]'),
    ).not.toBeNull()

    rerender(
      <Link
        href="/docs"
        text="Docs"
        hideIcon
      />,
    )

    expect(
      getByRole('link', {
        name: 'Docs',
      }).querySelector('[data-weave-icon]'),
    ).toBeNull()
  })

  it('can hide the bottom link marker without changing the anchor or icon', () => {
    const { getByRole } = render(
      <Link
        href="/plain"
        text="Plain link"
        hideUnderline
      />,
    )

    const link = getByRole('link', {
      name: 'Plain link',
    })

    expect(
      link.getAttribute('data-weave-link-underline'),
    ).toBe('hidden')
    expect(
      link.querySelector('[data-weave-icon]'),
    ).not.toBeNull()

    const stylesheet =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-link-styles]',
      )?.textContent ?? ''

    expect(stylesheet).toContain(
      '[data-weave-link-underline="hidden"]',
    )
    expect(stylesheet).toContain('display: none;')
  })

  it('forwards target to the native anchor without rewriting its behavior', () => {
    const { getByRole } = render(
      <Link
        href="/account"
        text="Account"
        target="_self"
      />,
    )

    const link = getByRole('link', {
      name: 'Account',
    }) as HTMLAnchorElement

    expect(link.target).toBe('_self')
    expect(link.getAttribute('rel')).toBeNull()
  })

  it('uses the required 45 / 60 / 80 percent bottom-link progression', () => {
    render(<Link href="/docs" text="Docs" />)

    const stylesheet =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-link-styles]',
      )?.textContent ?? ''

    expect(stylesheet).toContain('width: 45%;')
    expect(stylesheet).toContain(
      '.weave-link:hover)::after',
    )
    expect(stylesheet).toContain('width: 60%;')
    expect(stylesheet).toContain(
      '.weave-link:active)::after',
    )
    expect(stylesheet).toContain('width: 80%;')
    expect(stylesheet).toContain(
      'width var(--weave-motion-duration-normal)',
    )
  })
})
