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
import {
  Badge,
  Button,
  defaultTheme,
} from '../src'

afterEach(cleanup)

describe('Badge', () => {
  it('renders normal text by default at top-right', () => {
    const { getByText } = render(
      <Badge text="12">
        <Button text="Inbox" />
      </Badge>,
    )

    const badge = getByText('12')
    const anchor = badge.closest(
      '[data-weave-badge-anchor]',
    ) as HTMLElement

    expect(anchor).not.toBeNull()
    expect(
      anchor.dataset.weaveBadgePlacement,
    ).toBe('top-right')
    expect(
      badge.getAttribute('data-weave-badge-dot'),
    ).toBe('false')
  })

  it('renders a small dot without text when dot is enabled', () => {
    const { container } = render(
      <Badge dot placement="bottom-left">
        <Button text="Status" />
      </Badge>,
    )

    const anchor = container.querySelector(
      '[data-weave-badge-anchor]',
    ) as HTMLElement
    const badge = container.querySelector(
      '[data-weave-badge]',
    ) as HTMLElement

    expect(anchor.dataset.weaveBadgePlacement).toBe(
      'bottom-left',
    )
    expect(badge.dataset.weaveBadgeDot).toBe('true')
    expect(badge.getAttribute('aria-hidden')).toBe('true')
    expect(badge.textContent).toBe('')
  })

  it('supports all eight edge placements in the stylesheet', () => {
    render(
      <Badge text="1" placement="left">
        <Button text="Anchor" />
      </Badge>,
    )

    const stylesheet =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-badge-styles]',
      )?.textContent ?? ''

    for (const placement of [
      'top-left',
      'top',
      'top-right',
      'right',
      'bottom-right',
      'bottom',
      'bottom-left',
      'left',
    ]) {
      expect(stylesheet).toContain(
        `data-weave-badge-placement="${placement}"`,
      )
    }
  })

  it('keeps dot and normal badge sizing in the theme', () => {
    const base = defaultTheme.components.Badge?.base

    expect(base?.minHeight).toBe(1.25)
    expect(base?.dotSize).toBe(0.625)
    expect(base?.background).toBe('primary')
    expect(base?.color).toBe('onPrimary')
    expect(base?.borderColor).toBe('surface')
  })
})
