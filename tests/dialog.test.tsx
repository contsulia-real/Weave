import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { createRef, type SyntheticEvent } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Button, createTheme, Dialog, Text, ThemeProvider } from '../src'

const dialogPrototype = HTMLDialogElement.prototype
const originalShowModal = Object.getOwnPropertyDescriptor(dialogPrototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(dialogPrototype, 'close')

let showModalSpy: ReturnType<typeof vi.fn>
let closeSpy: ReturnType<typeof vi.fn>

function restoreDialogMethod(name: 'showModal' | 'close', descriptor?: PropertyDescriptor) {
  if (descriptor === undefined) {
    Reflect.deleteProperty(dialogPrototype, name)
    return
  }

  Object.defineProperty(dialogPrototype, name, descriptor)
}

beforeEach(() => {
  showModalSpy = vi.fn(function (this: HTMLDialogElement) {
    this.open = true
  })
  closeSpy = vi.fn(function (this: HTMLDialogElement) {
    this.open = false
    this.dispatchEvent(new Event('close'))
  })

  Object.defineProperty(dialogPrototype, 'showModal', {
    configurable: true,
    writable: true,
    value: showModalSpy,
  })
  Object.defineProperty(dialogPrototype, 'close', {
    configurable: true,
    writable: true,
    value: closeSpy,
  })
})

afterEach(() => {
  cleanup()
  restoreDialogMethod('showModal', originalShowModal)
  restoreDialogMethod('close', originalClose)
})

describe('Dialog', () => {
  it('wraps Popover for non-modal Dialog', async () => {
    const { getByRole, queryByRole } = render(
      <Dialog defaultOpen placement="right" trigger={<Button text="Reference trigger" />}>
        <Text>Reference panel</Text>
      </Dialog>,
    )

    const trigger = getByRole('button', { name: 'Reference trigger' })
    const panel = getByRole('dialog')

    expect(panel.tagName).toBe('DIV')
    expect(panel.classList.contains('weave-popover')).toBe(true)
    expect(document.querySelector('dialog')).toBeNull()
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(showModalSpy).not.toHaveBeenCalled()

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    })
    expect(queryByRole('dialog')).toBeDefined()
  })

  it('uses showModal and keeps native cancel under React state control', async () => {
    const onOpenChange = vi.fn()
    const { getByRole, queryByRole } = render(
      <Dialog defaultOpen modal onOpenChange={onOpenChange}>
        <Text>Confirm</Text>
      </Dialog>,
    )
    const dialog = getByRole('dialog') as HTMLDialogElement
    const cancel = new Event('cancel', {
      bubbles: false,
      cancelable: true,
    })

    expect(showModalSpy).toHaveBeenCalledTimes(1)
    expect(dialog.dataset.weaveDialogModal).toBe('true')

    act(() => {
      dialog.dispatchEvent(cancel)
    })

    expect(cancel.defaultPrevented).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith(false)

    await waitFor(() => {
      expect(dialog.dataset.weaveDialogState).toBe('closing')
    })
    expect(dialog.open).toBe(true)

    fireEvent.transitionEnd(dialog)

    await waitFor(() => {
      expect(queryByRole('dialog')).toBeNull()
    })
    expect(closeSpy).toHaveBeenCalledTimes(1)
  })

  it('keeps modal Escape open when closeOnEscape is disabled or user-cancelled', () => {
    const onOpenChange = vi.fn()
    const onCancel = vi.fn((event: SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault()
    })
    const { getByRole, rerender } = render(
      <Dialog defaultOpen modal closeOnEscape={false} onOpenChange={onOpenChange}>
        <Text>Locked</Text>
      </Dialog>,
    )
    const dialog = getByRole('dialog') as HTMLDialogElement

    act(() => {
      dialog.dispatchEvent(new Event('cancel', { cancelable: true }))
    })
    expect(onOpenChange).not.toHaveBeenCalled()

    rerender(
      <Dialog defaultOpen modal closeOnEscape onOpenChange={onOpenChange} viewProps={{ onCancel }}>
        <Text>User-cancelled</Text>
      </Dialog>,
    )

    act(() => {
      dialog.dispatchEvent(new Event('cancel', { cancelable: true }))
    })

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(dialog.open).toBe(true)
  })

  it('only closes a modal backdrop when closeOnBackdrop is enabled', async () => {
    const onOpenChange = vi.fn()
    const { getByRole, rerender } = render(
      <Dialog defaultOpen modal onOpenChange={onOpenChange}>
        <Text>Backdrop</Text>
      </Dialog>,
    )
    const dialog = getByRole('dialog') as HTMLDialogElement

    dialog.getBoundingClientRect = () =>
      ({
        x: 100,
        y: 100,
        left: 100,
        top: 100,
        right: 300,
        bottom: 240,
        width: 200,
        height: 140,
        toJSON: () => ({}),
      }) as DOMRect

    fireEvent.click(dialog, { clientX: 10, clientY: 10 })
    expect(onOpenChange).not.toHaveBeenCalled()

    rerender(
      <Dialog defaultOpen modal closeOnBackdrop onOpenChange={onOpenChange}>
        <Text>Backdrop</Text>
      </Dialog>,
    )

    fireEvent.click(dialog, { clientX: 150, clientY: 150 })
    expect(onOpenChange).not.toHaveBeenCalled()

    fireEvent.click(dialog, { clientX: 10, clientY: 10 })

    expect(onOpenChange).toHaveBeenCalledWith(false)

    await waitFor(() => {
      expect(dialog.dataset.weaveDialogState).toBe('closing')
    })
  })

  it('focuses initialFocus and restores the previous focus after modal exit', async () => {
    const triggerRef = createRef<HTMLButtonElement>()
    const initialFocusRef = createRef<HTMLButtonElement>()
    const { rerender } = render(
      <>
        <button ref={triggerRef} type="button">
          Before
        </button>
        <Dialog modal open={false} initialFocus={initialFocusRef}>
          <button ref={initialFocusRef} type="button">
            Inside
          </button>
        </Dialog>
      </>,
    )

    triggerRef.current?.focus()
    expect(document.activeElement).toBe(triggerRef.current)

    rerender(
      <>
        <button ref={triggerRef} type="button">
          Before
        </button>
        <Dialog modal open initialFocus={initialFocusRef}>
          <button ref={initialFocusRef} type="button">
            Inside
          </button>
        </Dialog>
      </>,
    )

    await waitFor(() => {
      expect(document.activeElement).toBe(initialFocusRef.current)
    })

    rerender(
      <>
        <button ref={triggerRef} type="button">
          Before
        </button>
        <Dialog modal open={false} initialFocus={initialFocusRef}>
          <button ref={initialFocusRef} type="button">
            Inside
          </button>
        </Dialog>
      </>,
    )

    const dialog = document.querySelector<HTMLDialogElement>('[data-weave-dialog]')

    expect(dialog?.dataset.weaveDialogState).toBe('closing')
    fireEvent.transitionEnd(dialog as HTMLDialogElement)

    await waitFor(() => {
      expect(document.activeElement).toBe(triggerRef.current)
    })
  })

  it('syncs native modal close requests back through onOpenChange', async () => {
    const onOpenChange = vi.fn()
    const { getByRole } = render(
      <Dialog modal open onOpenChange={onOpenChange}>
        <Text>Controlled</Text>
      </Dialog>,
    )
    const dialog = getByRole('dialog') as HTMLDialogElement

    act(() => {
      dialog.close()
    })

    expect(onOpenChange).toHaveBeenCalledWith(false)

    await waitFor(() => {
      expect(showModalSpy).toHaveBeenCalledTimes(2)
    })
    expect(dialog.open).toBe(true)
  })

  it('themes the modal surface and preserves modal viewProps escape hatches', () => {
    const theme = createTheme({
      components: {
        Dialog: {
          base: {
            background: 'primary',
            backdropColor: 'rgb(1 2 3 / 0.5)',
            radius: 'small',
          },
        },
      },
    })
    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <Dialog
          defaultOpen
          modal
          viewProps={{
            label: 'Themed dialog',
            className: 'custom-dialog',
            style: { opacity: 0.75 },
          }}
        >
          <Text>Themed</Text>
        </Dialog>
      </ThemeProvider>,
    )
    const dialog = getByRole('dialog', { name: 'Themed dialog' })
    const themeClass = [...dialog.classList].find((name) => name.startsWith('weave-dialog-theme-'))
    const runtimeStyle =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-runtime-class="' + themeClass + '"]',
      )?.textContent ?? ''
    const stylesheet =
      document.querySelector<HTMLStyleElement>('style[data-weave-dialog-styles]')?.textContent ?? ''

    expect(themeClass).toBeDefined()
    expect(dialog.classList.contains('custom-dialog')).toBe(true)
    expect(dialog.style.opacity).toBe('0.75')
    expect(runtimeStyle).toContain('--weave-dialog-background:')
    expect(runtimeStyle).toContain('--weave-color-primary')
    expect(runtimeStyle).toContain('--weave-dialog-backdrop-color:')
    expect(runtimeStyle).toContain('rgb(1 2 3 / 0.5)')
    expect(stylesheet).toContain('::backdrop')
    expect(stylesheet).toContain('@starting-style')
  })

  it('keeps the modal surface centered through the View host defaults', () => {
    render(
      <Dialog defaultOpen modal>
        <Text>Geometry</Text>
      </Dialog>,
    )

    const stylesheet =
      document.querySelector<HTMLStyleElement>('style[data-weave-dialog-styles]')?.textContent ?? ''

    expect(stylesheet).toContain('--weave-component-display: block')
    expect(stylesheet).toContain('--weave-component-position: fixed')
    expect(stylesheet).toContain('--weave-component-top: 0')
    expect(stylesheet).toContain('--weave-component-right: 0')
    expect(stylesheet).toContain('--weave-component-bottom: 0')
    expect(stylesheet).toContain('--weave-component-left: 0')
    expect(stylesheet).toContain('--weave-component-margin-top: auto')
    expect(stylesheet).toContain('--weave-component-margin-right: auto')
    expect(stylesheet).toContain('--weave-component-margin-bottom: auto')
    expect(stylesheet).toContain('--weave-component-margin-left: auto')
    expect(stylesheet).toContain('--weave-component-height: fit-content')
  })
})
