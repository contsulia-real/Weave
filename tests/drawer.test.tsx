import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { createRef, useState } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Drawer, DrawerHandle, Text } from '../src'

const dialogPrototype = HTMLDialogElement.prototype
const originalShowModal = Object.getOwnPropertyDescriptor(dialogPrototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(dialogPrototype, 'close')
const originalMatchMedia = window.matchMedia

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
  window.matchMedia = originalMatchMedia
  vi.restoreAllMocks()
})

function DrawerContent() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DrawerHandle viewProps={{ data: { testid: 'drawer-handle' } }} />
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        drawer count {count}
      </button>
    </>
  )
}

describe('Drawer', () => {
  it('uses SplitBox for non-modal layout and maps open to the drawer-side collapsed state', () => {
    const { getByRole, getByTestId, rerender } = render(
      <Drawer
        mode="non-modal"
        side="left"
        open
        drawer={<DrawerContent />}
        viewProps={{ data: { testid: 'drawer-root' } }}
      >
        <Text>Main</Text>
      </Drawer>,
    )

    const root = getByTestId('drawer-root')
    const separator = getByRole('separator')
    const surface = document.querySelector<HTMLElement>(
      '[data-weave-drawer-surface][data-weave-drawer-mode="non-modal"]',
    )

    expect(root.getAttribute('data-weave-splitbox-direction')).toBe('horizontal')
    expect(root.getAttribute('data-weave-splitbox-collapsed')).toBe('false')
    expect(surface).not.toBeNull()
    expect(surface?.getAttribute('data-weave-splitbox-pane-position')).toBe('start')
    expect(separator.getAttribute('aria-disabled')).toBeNull()
    expect(getByTestId('drawer-handle').getAttribute('data-weave-drawer-handle-active')).toBe(
      'false',
    )

    rerender(
      <Drawer
        mode="non-modal"
        side="left"
        open={false}
        drawer={<DrawerContent />}
        viewProps={{ data: { testid: 'drawer-root' } }}
      >
        <Text>Main</Text>
      </Drawer>,
    )

    expect(root.getAttribute('data-weave-splitbox-collapsed')).toBe('start')
    expect(surface?.hasAttribute('inert')).toBe(true)
  })

  it('keeps a non-modal splitter visible but non-interactive when resize is disabled', () => {
    const { getByRole } = render(
      <Drawer mode="non-modal" defaultOpen resizable={false} drawer={<Text>Drawer</Text>}>
        <Text>Main</Text>
      </Drawer>,
    )

    const separator = getByRole('separator')
    const root = separator.closest('[data-weave-splitbox]')

    expect(root?.getAttribute('data-weave-splitbox-disabled')).toBe('true')
    expect(separator.getAttribute('aria-disabled')).toBe('true')
    expect(separator.tabIndex).toBe(-1)
  })

  it('moves preserved content into modal before applying Drawer initialFocus', () => {
    const focusRef = createRef<HTMLButtonElement>()

    render(
      <Drawer
        mode="modal"
        defaultOpen
        initialFocus={focusRef}
        drawer={
          <>
            <DrawerHandle />
            <button ref={focusRef} type="button">
              Focus target
            </button>
          </>
        }
      >
        <Text>Main</Text>
      </Drawer>,
    )

    expect(document.activeElement).toBe(focusRef.current)
    expect(focusRef.current?.closest('dialog')).not.toBeNull()
  })

  it('uses native modal Dialog semantics, Weave Scrollbar and DrawerHandle drag-to-close', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
      const element = this as HTMLElement

      if (element.style.position === 'absolute') {
        const raw = element.style.width || element.style.height
        const size = raw.endsWith('rem') ? Number.parseFloat(raw) * 16 : Number.parseFloat(raw) || 0
        return DOMRect.fromRect({ width: size, height: size })
      }

      return DOMRect.fromRect({ width: 320, height: 480 })
    })

    const onOpenChange = vi.fn()
    const { getByRole, getByTestId } = render(
      <Drawer
        mode="modal"
        defaultOpen
        side="right"
        closeThreshold={4}
        onOpenChange={onOpenChange}
        drawer={<DrawerContent />}
      >
        <Text>Main</Text>
      </Drawer>,
    )

    const dialog = getByRole('dialog') as HTMLDialogElement
    const handle = getByTestId('drawer-handle')

    expect(showModalSpy).toHaveBeenCalledTimes(1)
    expect(dialog.className).toContain('weave-drawer-surface--modal')
    expect(dialog.className).toContain('weave-scroll-host')
    expect(dialog.getAttribute('data-weave-drawer-side')).toBe('right')
    expect(handle.getAttribute('data-weave-drawer-handle-active')).toBe('true')
    expect(document.querySelector('style[data-weave-scrollbar-styles]')).not.toBeNull()

    fireEvent.pointerDown(handle, { button: 0, pointerId: 3, clientX: 100, clientY: 20 })
    fireEvent.pointerMove(handle, { pointerId: 3, clientX: 180, clientY: 20 })

    expect(dialog.style.getPropertyValue('--weave-drawer-drag-offset')).toBe('80px')

    fireEvent.pointerUp(handle, { pointerId: 3, clientX: 180, clientY: 20 })

    expect(onOpenChange).toHaveBeenCalledWith(false)

    await waitFor(() => {
      expect(dialog.getAttribute('data-weave-dialog-state')).toBe('closing')
    })
  })

  it('keeps drawer content state while auto mode switches between modal and non-modal', async () => {
    let matches = false
    const listeners = new Set<() => void>()
    const media = {
      get matches() {
        return matches
      },
      media: '(min-width: 48rem)',
      onchange: null,
      addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
      dispatchEvent: () => true,
      addListener: () => undefined,
      removeListener: () => undefined,
    } as unknown as MediaQueryList
    window.matchMedia = vi.fn(() => media)

    const onOpenChange = vi.fn()
    const { getByRole } = render(
      <Drawer defaultOpen onOpenChange={onOpenChange} drawer={<DrawerContent />}>
        <Text>Main</Text>
      </Drawer>,
    )

    expect(getByRole('dialog')).toBeDefined()
    const counter = getByRole('button', { name: 'drawer count 0' })
    fireEvent.click(counter)
    expect(getByRole('button', { name: 'drawer count 1' })).toBe(counter)

    act(() => {
      matches = true
      for (const listener of listeners) listener()
    })

    await waitFor(() => {
      expect(document.querySelector('dialog')).toBeNull()
    })

    expect(getByRole('button', { name: 'drawer count 1' })).toBe(counter)
    expect(
      document.querySelector('[data-weave-drawer-surface][data-weave-drawer-mode="non-modal"]'),
    ).not.toBeNull()
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('throws when auto mode names a breakpoint missing from the current theme', () => {
    expect(() =>
      render(
        <Drawer breakpoint="missing" drawer={<Text>Drawer</Text>}>
          <Text>Main</Text>
        </Drawer>,
      ),
    ).toThrow('Drawer breakpoint "missing" does not exist in the current theme')
  })

  it('defaults right/bottom modal geometry to a 20rem drawer size', () => {
    const { getByRole, rerender } = render(
      <Drawer mode="modal" defaultOpen drawer={<Text>Right drawer</Text>}>
        <Text>Main</Text>
      </Drawer>,
    )

    let dialog = getByRole('dialog')
    let propsRule = [...dialog.classList]
      .filter((name) => name.startsWith('weave-props-'))
      .map(
        (name) =>
          document.querySelector<HTMLStyleElement>(`style[data-weave-runtime-class="${name}"]`)
            ?.textContent ?? '',
      )
      .join('\n')

    expect(propsRule).toMatch(/--weave-width:\s*20rem;/)

    rerender(
      <Drawer mode="modal" defaultOpen side="bottom" drawer={<Text>Bottom drawer</Text>}>
        <Text>Main</Text>
      </Drawer>,
    )

    dialog = getByRole('dialog')
    propsRule = [...dialog.classList]
      .filter((name) => name.startsWith('weave-props-'))
      .map(
        (name) =>
          document.querySelector<HTMLStyleElement>(`style[data-weave-runtime-class="${name}"]`)
            ?.textContent ?? '',
      )
      .join('\n')

    expect(propsRule).toMatch(/--weave-height:\s*20rem;/)
  })
})
