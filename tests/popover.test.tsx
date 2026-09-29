import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Button, Column, createTheme, Popover, Text, ThemeProvider } from '../src'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

async function flushAnimationFrames() {
  await act(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve())
        })
      }),
  )
}

describe('Popover', () => {
  it('opens from its trigger in a body portal and wires dialog semantics', async () => {
    const { getByRole, queryByRole } = render(
      <Popover content={<Text>Popover content</Text>}>
        <Button text="Open details" />
      </Popover>,
    )

    const trigger = getByRole('button')

    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(trigger)

    const dialog = getByRole('dialog')

    expect(document.body.contains(dialog)).toBe(true)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(trigger.getAttribute('aria-controls')).toBe(dialog.id)
    expect(dialog.getAttribute('data-placement')).toBe('bottom')
    expect(queryByRole('dialog')).not.toBeNull()

    await waitFor(() => {
      expect(dialog.style.visibility).toBe('visible')
    })
  })

  it('keeps the panel mounted for dismiss motion when the trigger toggles it closed', () => {
    const { getByRole } = render(
      <Popover content="Content">
        <Button text="Toggle" />
      </Popover>,
    )

    const trigger = getByRole('button')

    fireEvent.click(trigger)

    const dialog = getByRole('dialog')

    fireEvent.click(trigger)

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(dialog.getAttribute('data-weave-popover-state')).toBe('closing')
    expect(dialog.getAttribute('aria-hidden')).toBe('true')

    fireEvent.transitionEnd(dialog)

    expect(document.querySelector('[data-weave-popover]')).toBeNull()
  })

  it('closes on outside pointer input without stealing focus back from the outside target', async () => {
    const { getByRole } = render(
      <>
        <Popover content={<Button text="Inside" />}>
          <Button text="Trigger" />
        </Popover>
        <Button text="Outside" />
      </>,
    )

    const trigger = getByRole('button', {
      name: 'Trigger',
    })

    fireEvent.click(trigger)

    const outside = getByRole('button', {
      name: 'Outside',
    })

    fireEvent.pointerDown(outside)
    outside.focus()

    await waitFor(() => {
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      expect(document.activeElement).toBe(outside)
    })
  })

  it('autofocuses interactive content and restores trigger focus after Escape', async () => {
    const { getByRole } = render(
      <Popover
        content={
          <Column gap={0.5}>
            <Text>Actions</Text>
            <Button text="Inside action" />
          </Column>
        }
      >
        <Button text="Trigger" />
      </Popover>,
    )

    const trigger = getByRole('button', {
      name: 'Trigger',
    })

    trigger.focus()
    fireEvent.click(trigger)

    const inside = getByRole('button', {
      name: 'Inside action',
    })

    await waitFor(() => {
      expect(document.activeElement).toBe(inside)
    })

    fireEvent.keyDown(document, {
      key: 'Escape',
    })

    await waitFor(() => {
      expect(document.activeElement).toBe(trigger)
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    })
  })

  it('autofocuses an initially open popover and can disable autofocus', async () => {
    const { getByRole, rerender } = render(
      <Popover defaultOpen content={<Button text="Initial action" />}>
        <Button text="Initial trigger" />
      </Popover>,
    )

    const initialAction = getByRole('button', {
      name: 'Initial action',
    })

    await waitFor(() => {
      expect(document.activeElement).toBe(initialAction)
    })

    rerender(
      <Popover open autoFocus={false} content={<Button text="Passive action" />}>
        <Button text="Passive trigger" />
      </Popover>,
    )

    expect(
      getByRole('button', {
        name: 'Passive action',
      }),
    ).toBeDefined()
  })

  it('supports controlled open state', () => {
    const onOpenChange = vi.fn()
    const { getByRole, queryByRole, rerender } = render(
      <Popover open={false} onOpenChange={onOpenChange} content="Controlled">
        <Button text="Controlled trigger" />
      </Popover>,
    )

    const trigger = getByRole('button')

    fireEvent.click(trigger)

    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(queryByRole('dialog')).toBeNull()

    rerender(
      <Popover open onOpenChange={onOpenChange} content="Controlled">
        <Button text="Controlled trigger" />
      </Popover>,
    )

    expect(queryByRole('dialog')).not.toBeNull()
  })

  it('flips on main-axis collision and shifts the resolved panel inside the viewport', async () => {
    const { getByRole } = render(
      <Popover defaultOpen placement="right" content="Collision">
        <Button text="Edge trigger" />
      </Popover>,
    )

    const trigger = getByRole('button', {
      name: 'Edge trigger',
    })
    const dialog = getByRole('dialog')

    trigger.getBoundingClientRect = () =>
      ({
        x: 970,
        y: 300,
        left: 970,
        top: 300,
        right: 1010,
        bottom: 340,
        width: 40,
        height: 40,
        toJSON: () => ({}),
      }) as DOMRect

    dialog.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        right: 200,
        bottom: 100,
        width: 200,
        height: 100,
        toJSON: () => ({}),
      }) as DOMRect

    fireEvent.scroll(window)

    await waitFor(() => {
      expect(dialog.getAttribute('data-placement')).toBe('left')
      expect(dialog.style.left).toBe('762px')
      expect(dialog.style.top).toBe('270px')
    })
  })

  it('shifts a cross-axis overflow without changing the requested placement', async () => {
    const { getByRole } = render(
      <Popover defaultOpen placement="bottom-left" content="Shifted">
        <Button text="Shift trigger" />
      </Popover>,
    )

    const trigger = getByRole('button', {
      name: 'Shift trigger',
    })
    const dialog = getByRole('dialog')

    trigger.getBoundingClientRect = () =>
      ({
        x: -20,
        y: 80,
        left: -20,
        top: 80,
        right: 20,
        bottom: 120,
        width: 40,
        height: 40,
        toJSON: () => ({}),
      }) as DOMRect

    dialog.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        right: 180,
        bottom: 100,
        width: 180,
        height: 100,
        toJSON: () => ({}),
      }) as DOMRect

    fireEvent.scroll(window)

    await waitFor(() => {
      expect(dialog.getAttribute('data-placement')).toBe('bottom-left')
      expect(dialog.style.left).toBe('8px')
      expect(dialog.style.top).toBe('128px')
    })
  })

  it('does not reposition for a transient pressed anchor transform', async () => {
    const { getByRole } = render(
      <Popover defaultOpen placement="bottom-left" content="Stable anchor">
        <Button text="Stable trigger" />
      </Popover>,
    )

    const trigger = getByRole('button', { name: 'Stable trigger' })
    const dialog = getByRole('dialog')
    let left = 100
    let top = 100

    trigger.getBoundingClientRect = () =>
      ({
        x: left,
        y: top,
        left,
        top,
        right: left + 40,
        bottom: top + 40,
        width: 40,
        height: 40,
        toJSON: () => ({}),
      }) as DOMRect
    dialog.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        right: 160,
        bottom: 80,
        width: 160,
        height: 80,
        toJSON: () => ({}),
      }) as DOMRect

    fireEvent.scroll(window)

    await waitFor(() => {
      expect(dialog.style.visibility).toBe('visible')
      expect(dialog.style.left).not.toBe('')
    })

    await flushAnimationFrames()

    const initialLeft = dialog.style.left
    const initialTop = dialog.style.top

    left = 280
    top = 220
    fireEvent.pointerDown(trigger)

    await flushAnimationFrames()

    expect(dialog.style.left).toBe(initialLeft)
    expect(dialog.style.top).toBe(initialTop)

    fireEvent.scroll(window)

    await waitFor(() => {
      expect(dialog.style.left).not.toBe(initialLeft)
      expect(dialog.style.top).not.toBe(initialTop)
    })
  })

  it('stays open while its anchor intersects the viewport and dismisses once the anchor fully leaves it', async () => {
    const { getByRole } = render(
      <Popover content="Viewport popover">
        <Button text="Viewport trigger" />
      </Popover>,
    )

    const trigger = getByRole('button', {
      name: 'Viewport trigger',
    })

    trigger.getBoundingClientRect = () =>
      ({
        x: 100,
        y: 100,
        left: 100,
        top: 100,
        right: 140,
        bottom: 140,
        width: 40,
        height: 40,
        toJSON: () => ({}),
      }) as DOMRect

    fireEvent.click(trigger)

    const dialog = getByRole('dialog')

    await waitFor(() => {
      expect(dialog.style.visibility).toBe('visible')
    })

    const initialTop = dialog.style.top

    trigger.getBoundingClientRect = () =>
      ({
        x: 100,
        y: -10,
        left: 100,
        top: -10,
        right: 140,
        bottom: 10,
        width: 40,
        height: 20,
        toJSON: () => ({}),
      }) as DOMRect

    fireEvent.scroll(window)

    await waitFor(() => {
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
      expect(dialog.style.top).not.toBe(initialTop)
    })

    trigger.getBoundingClientRect = () =>
      ({
        x: 100,
        y: -40,
        left: 100,
        top: -40,
        right: 140,
        bottom: 0,
        width: 40,
        height: 40,
        toJSON: () => ({}),
      }) as DOMRect

    fireEvent.scroll(window)

    await waitFor(() => {
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      expect(document.activeElement).not.toBe(trigger)
    })

    fireEvent.transitionEnd(dialog)

    await waitFor(() => {
      expect(document.querySelector('[data-weave-popover]')).toBeNull()
    })
  })

  it('uses a dedicated theme surface and directional enter/exit motion', () => {
    const theme = createTheme({
      components: {
        Popover: {
          base: {
            background: 'primary',
            color: 'onPrimary',
            shadow: 'large',
          },
        },
      },
    })

    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <Popover defaultOpen placement="top-right" content="Themed">
          <Button text="Theme trigger" />
        </Popover>
      </ThemeProvider>,
    )

    const dialog = getByRole('dialog')
    const themeClass = [...dialog.classList].find((name) => name.startsWith('weave-popover-theme-'))

    expect(themeClass).toBeDefined()

    const runtimeStyle =
      document.querySelector<HTMLStyleElement>(`style[data-weave-runtime-class="${themeClass}"]`)
        ?.textContent ?? ''
    const stylesheet =
      document.querySelector<HTMLStyleElement>('style[data-weave-popover-styles]')?.textContent ??
      ''

    expect(runtimeStyle).toContain('--weave-popover-background:')
    expect(runtimeStyle).toContain('--weave-color-primary')
    expect(stylesheet).toContain('@starting-style')
    expect(stylesheet).toContain('data-placement^="top"')
    expect(stylesheet).toContain('data-weave-reduced-motion="reduce"')
  })
})
