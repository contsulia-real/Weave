import {
  act,
} from 'react'
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
  vi,
} from 'vitest'
import {
  Button,
  Snack,
  SnackProvider,
  Text,
  View,
  useSnack,
} from '../src'

afterEach(() => {
  cleanup()
  vi.useRealTimers()

  document
    .querySelectorAll(
      '[data-weave-snack-region]',
    )
    .forEach(
      (element) =>
        element.remove(),
    )
})

function SnackTriggerHarness() {
  const snack =
    useSnack()

  return (
    <Button
      text="Trigger"
      viewProps={{
        onClick: () => {
          snack.show({
            text: 'Queued',
            placement: 'top-left',
            direction: 'right',
            persistent: true,
          })
        },
      }}
    />
  )
}

describe('Snack', () => {
  it('creates a fresh Snack on every queue trigger', () => {
    const {
      getByRole,
    } = render(
      <SnackProvider>
        <SnackTriggerHarness />
      </SnackProvider>,
    )

    const trigger =
      getByRole(
        'button',
        {
          name: 'Trigger',
        },
      )

    fireEvent.click(trigger)
    fireEvent.click(trigger)

    const region =
      document.querySelector(
        '[data-weave-snack-region="top-left"]',
      )

    expect(
      region?.querySelectorAll(
        '[data-weave-snack]',
      ),
    ).toHaveLength(2)
  })

  it('keeps placement and motion direction independent', () => {
    render(
      <Snack
        text="Directional"
        placement="top-right"
        direction="left"
        persistent
      />,
    )

    const snack =
      document.querySelector(
        '[data-weave-snack]',
      )

    expect(
      snack?.getAttribute(
        'data-weave-snack-placement',
      ),
    ).toBe('top-right')
    expect(
      snack?.getAttribute(
        'data-weave-snack-direction',
      ),
    ).toBe('left')
  })

  it('uses tonal material instead of the old accent stripe', () => {
    render(
      <Snack
        text="Material"
        variant="info"
        persistent
      />,
    )

    const stylesheet =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-snack-styles]',
      )?.textContent ?? ''

    expect(stylesheet).toContain(
      'color-mix',
    )
    expect(stylesheet).toContain(
      '.weave-snack__icon-shell',
    )
    expect(stylesheet).not.toContain(
      '--weave-snack-accent-width',
    )
  })

  it('renders shortcut content into the requested shared placement region', () => {
    const {
      getByRole,
      getByText,
    } = render(
      <Snack
        text="Saved"
        variant="success"
        placement="top-right"
        persistent
      />,
    )

    const snack =
      getByRole('status')
    const region =
      document.querySelector(
        '[data-weave-snack-region="top-right"]',
      )

    expect(region).not.toBeNull()
    expect(
      region?.contains(snack),
    ).toBe(true)
    expect(
      getByText('Saved'),
    ).toBeDefined()
    expect(
      snack.getAttribute(
        'data-variant',
      ),
    ).toBe('success')
  })

  it('stacks multiple snacks in one region', () => {
    render(
      <>
        <Snack
          text="First"
          placement="bottom-center"
          persistent
        />
        <Snack
          text="Second"
          placement="bottom-center"
          persistent
        />
      </>,
    )

    const regions =
      document.querySelectorAll(
        '[data-weave-snack-region="bottom-center"]',
      )

    expect(regions).toHaveLength(1)
    expect(
      regions[0]?.querySelectorAll(
        '[data-weave-snack]',
      ),
    ).toHaveLength(2)
  })

  it('auto closes after duration and waits for exit motion before removal', () => {
    vi.useFakeTimers()

    render(
      <Snack
        text="Temporary"
        duration={1000}
      />,
    )

    expect(
      document.querySelector(
        '[data-weave-snack-state="open"]',
      ),
    ).not.toBeNull()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    const closing =
      document.querySelector<HTMLElement>(
        '[data-weave-snack-state="closing"]',
      )

    expect(closing).not.toBeNull()
    expect(
      closing?.getAttribute(
        'aria-hidden',
      ),
    ).toBe('true')

    if (closing !== null) {
      fireEvent.transitionEnd(
        closing,
      )
    }

    expect(
      document.querySelector(
        '[data-weave-snack]',
      ),
    ).toBeNull()
  })

  it('does not auto close while persistent', () => {
    vi.useFakeTimers()

    render(
      <Snack
        text="Persistent"
        duration={100}
        persistent
      />,
    )

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(
      document.querySelector(
        '[data-weave-snack-state="open"]',
      ),
    ).not.toBeNull()
  })

  it('pauses auto close while hovered', () => {
    vi.useFakeTimers()

    const {
      getByRole,
    } = render(
      <Snack
        text="Hover me"
        duration={100}
      />,
    )

    const snack =
      getByRole('status')

    fireEvent.pointerEnter(snack)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(
      snack.getAttribute(
        'data-weave-snack-state',
      ),
    ).toBe('open')

    fireEvent.pointerLeave(snack)

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(
      snack.getAttribute(
        'data-weave-snack-state',
      ),
    ).toBe('closing')
  })

  it('runs an action and requests close', () => {
    const onAction =
      vi.fn()
    const onOpenChange =
      vi.fn()

    const {
      getByRole,
    } = render(
      <Snack
        text="Deleted"
        action="Undo"
        onAction={onAction}
        onOpenChange={
          onOpenChange
        }
        persistent
      />,
    )

    fireEvent.click(
      getByRole(
        'button',
        {
          name: 'Undo',
        },
      ),
    )

    expect(
      onAction,
    ).toHaveBeenCalledTimes(1)
    expect(
      onOpenChange,
    ).toHaveBeenCalledWith(false)
  })

  it('supports fully composed content', () => {
    const {
      getByText,
    } = render(
      <Snack persistent>
        <View>
          <Text>
            Sync unavailable
          </Text>
          <Button
            text="Retry"
            variant="ghost"
          />
        </View>
      </Snack>,
    )

    expect(
      getByText('Sync unavailable'),
    ).toBeDefined()
    expect(
      getByText('Retry'),
    ).toBeDefined()
  })

  it('uses alert semantics for urgent variants', () => {
    const {
      getByRole,
    } = render(
      <Snack
        text="Connection lost"
        variant="danger"
        persistent
      />,
    )

    expect(
      getByRole('alert'),
    ).toBeDefined()
  })
})
