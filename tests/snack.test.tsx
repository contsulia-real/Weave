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

  it('uses the shared Weave surface material instead of a tinted toast card', () => {
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
      '--weave-component-background: var(--weave-snack-background);',
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

  it('keeps the oldest Snacks visible in FIFO order and folds only later items', () => {
    render(
      <>
        <Snack text="One" persistent />
        <Snack text="Two" persistent />
        <Snack text="Three" persistent />
        <Snack text="Four" persistent />
        <Snack text="Five" persistent />
      </>,
    )

    const region =
      document.querySelector(
        '[data-weave-snack-region="bottom-center"]',
      )

    expect(
      region?.getAttribute(
        'data-weave-snack-count',
      ),
    ).toBe('5')

    const snacks =
      Array.from(
        region?.querySelectorAll<HTMLElement>(
          '[data-weave-snack]',
        ) ?? [],
      )

    expect(
      snacks.map(
        (snack) =>
          snack.textContent,
      ),
    ).toEqual([
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
    ])

    expect(
      snacks[0]?.getAttribute(
        'data-weave-snack-queue-index',
      ),
    ).toBe('0')
    expect(
      snacks[1]?.getAttribute(
        'data-weave-snack-queue-index',
      ),
    ).toBe('1')
    expect(
      snacks[2]?.getAttribute(
        'data-weave-snack-queue-index',
      ),
    ).toBe('2')

    expect(
      snacks[0]?.hasAttribute(
        'data-weave-snack-queue-hidden',
      ),
    ).toBe(false)
    expect(
      snacks[1]?.hasAttribute(
        'data-weave-snack-queue-hidden',
      ),
    ).toBe(false)
    expect(
      snacks[2]?.hasAttribute(
        'data-weave-snack-queue-hidden',
      ),
    ).toBe(false)
    expect(
      snacks[3]?.hasAttribute(
        'data-weave-snack-queue-hidden',
      ),
    ).toBe(true)
    expect(
      snacks[4]?.hasAttribute(
        'data-weave-snack-queue-hidden',
      ),
    ).toBe(true)

    const overflow =
      region?.querySelector(
        '[data-weave-snack-overflow]',
      )

    expect(
      overflow?.textContent,
    ).toBe('+2')
    expect(
      overflow?.closest(
        '[data-weave-theme]',
      ),
    ).not.toBeNull()

    const stylesheet =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-snack-styles]',
      )?.textContent ?? ''

    expect(stylesheet).toContain(
      'flex-direction: column;',
    )
    expect(stylesheet).toContain(
      'flex-direction: column-reverse;',
    )
    expect(stylesheet).toContain(
      'data-weave-snack-queue-hidden',
    )
    expect(stylesheet).not.toContain(
      'margin-top: -',
    )
    expect(stylesheet).not.toContain(
      'margin-bottom: -',
    )
  })

  it('keeps each queued Snack on its own creation-time timer', () => {
    vi.useFakeTimers()

    function TimedHarness() {
      const snack =
        useSnack()

      return (
        <Button
          text="Timed"
          viewProps={{
            onClick: () => {
              snack.show({
                text: 'Timed snack',
                duration: 1000,
              })
            },
          }}
        />
      )
    }

    const {
      getByRole,
    } = render(
      <SnackProvider>
        <TimedHarness />
      </SnackProvider>,
    )

    const trigger =
      getByRole(
        'button',
        {
          name: 'Timed',
        },
      )

    fireEvent.click(trigger)

    act(() => {
      vi.advanceTimersByTime(500)
    })

    fireEvent.click(trigger)

    act(() => {
      vi.advanceTimersByTime(500)
    })

    const snacks =
      document.querySelectorAll(
        '[data-weave-snack]',
      )

    expect(snacks).toHaveLength(2)
    expect(
      snacks[0]?.getAttribute(
        'data-weave-snack-state',
      ),
    ).toBe('closing')
    expect(
      snacks[1]?.getAttribute(
        'data-weave-snack-state',
      ),
    ).toBe('open')
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
