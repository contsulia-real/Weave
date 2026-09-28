import {
  cleanup,
  fireEvent,
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
  View,
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

  it('tracks the wrapped component visual box instead of the static wrapper box', () => {
    const { getByTestId } = render(
      <Badge text="8">
        <View data={{ testid: 'badge-target' }} />
      </Badge>,
    )

    const target = getByTestId('badge-target')
    const anchor = target.closest(
      '[data-weave-badge-anchor]',
    ) as HTMLElement

    anchor.getBoundingClientRect = () => ({
      x: 100,
      y: 50,
      top: 50,
      right: 200,
      bottom: 90,
      left: 100,
      width: 100,
      height: 40,
      toJSON: () => ({}),
    })

    target.getBoundingClientRect = () => ({
      x: 105,
      y: 54,
      top: 54,
      right: 195,
      bottom: 88,
      left: 105,
      width: 90,
      height: 34,
      toJSON: () => ({}),
    })

    fireEvent.transitionRun(target)

    expect(
      anchor.style.getPropertyValue('--weave-badge-target-top'),
    ).toBe('4px')
    expect(
      anchor.style.getPropertyValue('--weave-badge-target-right'),
    ).toBe('95px')
    expect(
      anchor.style.getPropertyValue('--weave-badge-target-center-x'),
    ).toBe('50px')
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
