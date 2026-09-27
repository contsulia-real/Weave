import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { View } from '../src'
import type {
  ViewClickEvent,
  ViewKeyboardEvent,
} from '../src'

afterEach(cleanup)

describe('View renderer-neutral DOM events', () => {
  it('normalizes DOM click bubbling into Weave targets and control state', () => {
    let received:
      | ViewClickEvent
      | undefined

    const { getByTestId } = render(
      <View
        id="parent"
        onClick={(event) => {
          received = event
          event.preventDefault()
          event.stopPropagation()
        }}
      >
        <View
          id="child"
          data={{
            testid: 'child',
          }}
        />
      </View>,
    )

    const allowed = fireEvent.click(
      getByTestId('child'),
      {
        clientX: 24,
        clientY: 32,
        ctrlKey: true,
      },
    )

    expect(allowed).toBe(false)
    expect(received).toMatchObject({
      type: 'click',
      target: {
        id: 'child',
      },
      currentTarget: {
        id: 'parent',
      },
      clientX: 24,
      clientY: 32,
      ctrlKey: true,
      defaultPrevented: true,
      propagationStopped: true,
    })
    expect(
      'nativeEvent' in (received as object),
    ).toBe(false)
  })

  it('normalizes pointer boundary events to self targets', () => {
    const parentEnter = vi.fn()

    const { getByTestId } = render(
      <View
        id="parent"
        onPointerEnter={parentEnter}
      >
        <View
          id="child"
          data={{
            testid: 'child',
          }}
        />
      </View>,
    )

    fireEvent.pointerEnter(
      getByTestId('child'),
      {
        pointerId: 4,
        pointerType: 'mouse',
      },
    )

    expect(parentEnter).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'pointerenter',
        target: {
          id: 'parent',
        },
        currentTarget: {
          id: 'parent',
        },
      }),
    )
  })

  it('bridges public pointer capture methods to the DOM host', () => {
    const capture = vi.fn()
    const release = vi.fn()
    const onPointerDown = vi.fn((event) => {
      event.capturePointer()
      event.releasePointer()
    })

    const { getByTestId } = render(
      <View
        data={{
          testid: 'capture',
        }}
        onPointerDown={onPointerDown}
      />,
    )

    const element = getByTestId('capture')
    Object.defineProperty(
      element,
      'setPointerCapture',
      {
        configurable: true,
        value: capture,
      },
    )
    Object.defineProperty(
      element,
      'hasPointerCapture',
      {
        configurable: true,
        value: vi.fn(() => true),
      },
    )
    Object.defineProperty(
      element,
      'releasePointerCapture',
      {
        configurable: true,
        value: release,
      },
    )

    fireEvent.pointerDown(element, {
      pointerId: 9,
      pointerType: 'pen',
      isPrimary: true,
    })

    expect(capture).toHaveBeenCalledWith(9)
    expect(release).toHaveBeenCalledWith(9)
  })

  it('normalizes keyboard and focus events without exposing SyntheticEvent', () => {
    const onKeyDown = vi.fn<
      (event: ViewKeyboardEvent) => void
    >()
    const onFocus = vi.fn()

    const { getByTestId } = render(
      <View
        id="field"
        focusable
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        data={{
          testid: 'field',
        }}
      />,
    )

    const element = getByTestId('field')
    fireEvent.focus(element)
    fireEvent.keyDown(element, {
      key: 'Enter',
      code: 'Enter',
      shiftKey: true,
    })

    expect(onFocus).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'focus',
        target: {
          id: 'field',
        },
        currentTarget: {
          id: 'field',
        },
      }),
    )
    expect(onKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'keydown',
        key: 'Enter',
        code: 'Enter',
        shiftKey: true,
        target: {
          id: 'field',
        },
        currentTarget: {
          id: 'field',
        },
      }),
    )
  })
})
