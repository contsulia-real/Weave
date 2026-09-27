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

function SnackFifoHarness() {
  const snack =
    useSnack()

  const push = (
    text: string,
  ) => {
    snack.show({
      text,
      persistent: true,
      placement: 'top-left',
    })
  }

  return (
    <>
      <Button
        text="Push A"
        viewProps={{
          onClick: () => push('A'),
        }}
      />
      <Button
        text="Push B"
        viewProps={{
          onClick: () => push('B'),
        }}
      />
      <Button
        text="Push C"
        viewProps={{
          onClick: () => push('C'),
        }}
      />
      <Button
        text="Push D"
        viewProps={{
          onClick: () => push('D'),
        }}
      />
    </>
  )
}

describe('Snack', () => {
  it('mounts provider Snacks into an explicit container', () => {
    const host =
      document.createElement('div')
    const root =
      document.createElement('div')

    document.body.append(
      host,
      root,
    )

    const {
      getByRole,
      unmount,
    } = render(
      <SnackProvider
        container={host}
      >
        <SnackTriggerHarness />
      </SnackProvider>,
      {
        container: root,
      },
    )

    fireEvent.click(
      getByRole(
        'button',
        {
          name: 'Trigger',
        },
      ),
    )

    const region =
      host.querySelector<HTMLElement>(
        '[data-weave-snack-region="top-left"]',
      )

    expect(region).not.toBeNull()
    expect(
      region?.parentElement,
    ).toBe(host)
    expect(
      region?.getAttribute(
        'data-weave-snack-scope',
      ),
    ).toBe('container')
    expect(
      host.style.position,
    ).toBe('relative')

    unmount()

    expect(
      host.querySelector(
        '[data-weave-snack-region]',
      ),
    ).toBeNull()
    expect(
      host.style.position,
    ).toBe('')

    host.remove()
    root.remove()
  })

  it('accepts a ref object as the provider container', () => {
    const host =
      document.createElement('div')
    const root =
      document.createElement('div')
    const hostRef = {
      current: host,
    }

    document.body.append(
      host,
      root,
    )

    const {
      getByRole,
      unmount,
    } = render(
      <SnackProvider
        container={hostRef}
      >
        <SnackTriggerHarness />
      </SnackProvider>,
      {
        container: root,
      },
    )

    fireEvent.click(
      getByRole(
        'button',
        {
          name: 'Trigger',
        },
      ),
    )

    expect(
      host.querySelector(
        '[data-weave-snack-region="top-left"]',
      ),
    ).not.toBeNull()

    unmount()
    host.remove()
    root.remove()
  })

  it('isolates providers sharing the same container and placement', () => {
    const host =
      document.createElement('div')
    const root =
      document.createElement('div')

    document.body.append(
      host,
      root,
    )

    function ProviderTrigger({
      label,
    }: {
      label: string
    }) {
      const snack =
        useSnack()

      return (
        <Button
          text={label}
          viewProps={{
            onClick: () => {
              snack.show({
                text: label,
                placement: 'top-left',
                persistent: true,
              })
            },
          }}
        />
      )
    }

    const {
      getByRole,
      unmount,
    } = render(
      <>
        <SnackProvider
          container={host}
        >
          <ProviderTrigger
            label="First provider"
          />
        </SnackProvider>

        <SnackProvider
          container={host}
        >
          <ProviderTrigger
            label="Second provider"
          />
        </SnackProvider>
      </>,
      {
        container: root,
      },
    )

    fireEvent.click(
      getByRole(
        'button',
        {
          name: 'First provider',
        },
      ),
    )
    fireEvent.click(
      getByRole(
        'button',
        {
          name: 'Second provider',
        },
      ),
    )

    const regions =
      host.querySelectorAll(
        '[data-weave-snack-region="top-left"]',
      )

    expect(regions).toHaveLength(2)
    expect(
      regions[0]?.getAttribute(
        'data-weave-snack-provider-scope',
      ),
    ).not.toBe(
      regions[1]?.getAttribute(
        'data-weave-snack-provider-scope',
      ),
    )

    unmount()
    host.remove()
    root.remove()
  })

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

  it('evicts the oldest visible Snack with exit motion when FIFO capacity overflows', () => {
    const {
      getByRole,
    } = render(
      <SnackProvider>
        <SnackFifoHarness />
      </SnackProvider>,
    )

    fireEvent.click(
      getByRole(
        'button',
        { name: 'Push A' },
      ),
    )
    fireEvent.click(
      getByRole(
        'button',
        { name: 'Push B' },
      ),
    )
    fireEvent.click(
      getByRole(
        'button',
        { name: 'Push C' },
      ),
    )
    fireEvent.click(
      getByRole(
        'button',
        { name: 'Push D' },
      ),
    )

    const region =
      document.querySelector(
        '[data-weave-snack-region="top-left"]',
      )
    const snacksBeforeRemoval =
      Array.from(
        region?.querySelectorAll<HTMLElement>(
          '[data-weave-snack]',
        ) ?? [],
      )

    expect(
      snacksBeforeRemoval.map(
        (snack) =>
          snack.textContent,
      ),
    ).toEqual([
      'A',
      'B',
      'C',
    ])

    expect(
      snacksBeforeRemoval,
    ).toHaveLength(3)

    expect(
      snacksBeforeRemoval[0]?.getAttribute(
        'data-weave-snack-state',
      ),
    ).toBe('closing')

    expect(
      snacksBeforeRemoval
        .slice(1)
        .every(
          (snack) =>
            snack.getAttribute(
              'data-weave-snack-state',
            ) === 'open',
        ),
    ).toBe(true)

    expect(
      region?.textContent,
    ).not.toContain('D')

    const oldest =
      snacksBeforeRemoval[0]

    if (oldest !== undefined) {
      fireEvent.transitionEnd(
        oldest,
      )
    }

    const snacksAfterRemoval =
      Array.from(
        region?.querySelectorAll<HTMLElement>(
          '[data-weave-snack]',
        ) ?? [],
      )

    expect(
      snacksAfterRemoval.map(
        (snack) =>
          snack.textContent,
      ),
    ).toEqual([
      'B',
      'C',
      'D',
    ])
  })

  it('shows linear lifetime progress and pauses it with the Snack timer', () => {
    vi.useFakeTimers()

    const {
      getByRole,
    } = render(
      <Snack
        text="Timed progress"
        duration={1000}
      />,
    )

    const snack =
      getByRole('status')
    const progress =
      () =>
        document.querySelector<HTMLElement>(
          '[data-weave-snack-lifetime-progress]',
        )

    expect(
      progress()?.getAttribute(
        'role',
      ),
    ).toBe('progressbar')
    expect(
      Number(
        progress()?.getAttribute(
          'data-weave-snack-lifetime-progress',
        ),
      ),
    ).toBe(1)

    act(() => {
      vi.advanceTimersByTime(500)
    })

    const halfway =
      Number(
        progress()?.getAttribute(
          'data-weave-snack-lifetime-progress',
        ),
      )

    expect(halfway).toBeGreaterThan(
      0.45,
    )
    expect(halfway).toBeLessThan(
      0.55,
    )

    fireEvent.pointerEnter(snack)

    act(() => {
      vi.advanceTimersByTime(300)
    })

    const pausedProgress =
      Number(
        progress()?.getAttribute(
          'data-weave-snack-lifetime-progress',
        ),
      )

    expect(
      Math.abs(
        pausedProgress -
          halfway,
      ),
    ).toBeLessThan(0.02)

    fireEvent.pointerLeave(snack)

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(
      snack.getAttribute(
        'data-weave-snack-state',
      ),
    ).toBe('closing')
  })

  it('does not render lifetime progress for persistent Snacks', () => {
    render(
      <Snack
        text="Persistent"
        persistent
      />,
    )

    expect(
      document.querySelector(
        '[data-weave-snack-lifetime-progress]',
      ),
    ).toBeNull()
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
