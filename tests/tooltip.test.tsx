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
  Text,
  ToolTip,
  View,
} from '../src'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('ToolTip', () => {
  it('renders tooltip content in a portal and describes its target', () => {
    const {
      getByRole,
      getByText,
    } = render(
      <ToolTip
        content="Save changes"
        defaultOpen
      >
        <Button text="Save" />
      </ToolTip>,
    )

    const target =
      getByRole('button')
    const tooltip =
      getByRole('tooltip')

    expect(
      getByText('Save changes'),
    ).toBeDefined()
    expect(
      document.body.contains(tooltip),
    ).toBe(true)
    expect(
      target.getAttribute(
        'aria-describedby',
      ),
    ).toContain(tooltip.id)
    expect(
      tooltip.getAttribute(
        'data-placement',
      ),
    ).toBe('top')
  })

  it('honors hover delay and closes when the pointer leaves', () => {
    vi.useFakeTimers()

    const {
      getByRole,
      queryByRole,
    } = render(
      <ToolTip
        content="Delayed"
        delay={200}
      >
        <Button text="Target" />
      </ToolTip>,
    )

    const target =
      getByRole('button')

    fireEvent.pointerEnter(target)
    expect(
      queryByRole('tooltip'),
    ).toBeNull()

    act(() => {
      vi.advanceTimersByTime(199)
    })
    expect(
      queryByRole('tooltip'),
    ).toBeNull()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(
      queryByRole('tooltip'),
    ).not.toBeNull()

    fireEvent.pointerLeave(target)
    expect(
      queryByRole('tooltip'),
    ).toBeNull()
  })

  it('opens from focus and closes with Escape', () => {
    const onOpenChange =
      vi.fn()
    const {
      getByRole,
      queryByRole,
    } = render(
      <ToolTip
        content="Keyboard help"
        delay={0}
        onOpenChange={
          onOpenChange
        }
      >
        <Button text="Focus me" />
      </ToolTip>,
    )

    const target =
      getByRole('button')

    fireEvent.focusIn(target)

    expect(
      queryByRole('tooltip'),
    ).not.toBeNull()
    expect(
      onOpenChange,
    ).toHaveBeenCalledWith(true)

    fireEvent.keyDown(
      target,
      {
        key: 'Escape',
      },
    )

    expect(
      queryByRole('tooltip'),
    ).toBeNull()
    expect(
      onOpenChange,
    ).toHaveBeenCalledWith(false)
  })

  it('supports controlled open state', () => {
    const onOpenChange =
      vi.fn()

    const {
      getByRole,
      queryByRole,
      rerender,
    } = render(
      <ToolTip
        content="Controlled"
        open={false}
        delay={0}
        onOpenChange={
          onOpenChange
        }
      >
        <Button text="Controlled target" />
      </ToolTip>,
    )

    const target =
      getByRole('button')

    fireEvent.pointerEnter(target)

    expect(
      onOpenChange,
    ).toHaveBeenCalledWith(true)
    expect(
      queryByRole('tooltip'),
    ).toBeNull()

    rerender(
      <ToolTip
        content="Controlled"
        open
        delay={0}
        onOpenChange={
          onOpenChange
        }
      >
        <Button text="Controlled target" />
      </ToolTip>,
    )

    expect(
      queryByRole('tooltip'),
    ).not.toBeNull()
  })

  it('positions each placement from the target rectangle and applies rem offset', () => {
    const {
      getByRole,
    } = render(
      <ToolTip
        content="Below"
        placement="bottom"
        offset={1}
        defaultOpen
      >
        <Button text="Anchor" />
      </ToolTip>,
    )

    const target =
      getByRole('button')

    target.getBoundingClientRect =
      () =>
        ({
          x: 100,
          y: 50,
          left: 100,
          top: 50,
          right: 140,
          bottom: 70,
          width: 40,
          height: 20,
          toJSON: () => ({}),
        }) as DOMRect

    fireEvent.scroll(window)

    const tooltip =
      getByRole('tooltip')

    expect(
      tooltip.style.left,
    ).toBe('120px')
    expect(
      tooltip.style.top,
    ).toBe('70px')
    expect(
      tooltip.style.transform,
    ).toBe(
      'translate(-50%, 1rem)',
    )
  })

  it('accepts composed content', () => {
    const {
      getByRole,
      getByText,
    } = render(
      <ToolTip
        defaultOpen
        content={
          <View>
            <Text weight="bold">
              Title
            </Text>
            <Text>
              Details
            </Text>
          </View>
        }
      >
        <Button text="Composed target" />
      </ToolTip>,
    )

    expect(
      getByRole('tooltip'),
    ).toBeDefined()
    expect(
      getByText('Title'),
    ).toBeDefined()
    expect(
      getByText('Details'),
    ).toBeDefined()
  })
})
