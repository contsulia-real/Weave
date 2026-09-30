import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Button, createTheme, Divider, Menu, MenuItem, ThemeProvider } from '../src'

afterEach(cleanup)

describe('Menu', () => {
  it('keeps explicit user style above framework placement geometry', async () => {
    const { getByRole } = render(
      <Menu
        defaultOpen
        trigger={<Button text="Styled menu" />}
        viewProps={{ style: { left: '7px', top: '9px', visibility: 'visible' } }}
      >
        <MenuItem text="Action" />
      </Menu>,
    )

    const menu = getByRole('menu')
    await waitFor(() => expect(menu.style.visibility).toBe('visible'))
    expect(menu.style.left).toBe('7px')
    expect(menu.style.top).toBe('9px')
  })

  it('opens from its trigger with menu semantics and focuses the first enabled item', async () => {
    const { getByRole, getAllByRole } = render(
      <Menu trigger={<Button text="Actions" />}>
        <MenuItem text="Disabled" disabled />
        <MenuItem text="Edit" />
        <MenuItem text="Duplicate" />
      </Menu>,
    )

    const trigger = getByRole('button', {
      name: 'Actions',
    })

    expect(trigger.parentElement?.tagName).toBe('DIV')
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(trigger)

    const menu = getByRole('menu')
    const items = getAllByRole('menuitem')

    expect(document.body.contains(menu)).toBe(true)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(trigger.getAttribute('aria-controls')).toBe(menu.id)
    expect(items[0]?.getAttribute('aria-disabled')).toBe('true')

    await waitFor(() => {
      expect(document.activeElement).toBe(items[1])
    })
  })

  it('supports ArrowUp/ArrowDown/Home/End navigation and skips disabled items', async () => {
    const { getByRole, getAllByRole } = render(
      <Menu trigger={<Button text="Navigate" />}>
        <MenuItem text="First" />
        <MenuItem text="Disabled" disabled />
        <MenuItem text="Third" />
      </Menu>,
    )

    const trigger = getByRole('button', {
      name: 'Navigate',
    })

    fireEvent.keyDown(trigger, {
      key: 'ArrowDown',
    })

    const items = getAllByRole('menuitem')

    await waitFor(() => {
      expect(document.activeElement).toBe(items[0])
    })

    fireEvent.keyDown(items[0]!, {
      key: 'ArrowDown',
    })

    expect(document.activeElement).toBe(items[2])

    fireEvent.keyDown(items[2]!, {
      key: 'ArrowDown',
    })

    expect(document.activeElement).toBe(items[0])

    fireEvent.keyDown(items[0]!, {
      key: 'End',
    })

    expect(document.activeElement).toBe(items[2])

    fireEvent.keyDown(items[2]!, {
      key: 'Home',
    })

    expect(document.activeElement).toBe(items[0])
  })

  it('opens from ArrowUp with the last enabled item focused', async () => {
    const { getByRole, getAllByRole } = render(
      <Menu trigger={<Button text="Open upward" />}>
        <MenuItem text="First" />
        <MenuItem text="Last" />
      </Menu>,
    )

    fireEvent.keyDown(getByRole('button'), {
      key: 'ArrowUp',
    })

    const items = getAllByRole('menuitem')

    await waitFor(() => {
      expect(document.activeElement).toBe(items[1])
    })
  })

  it('activates items with pointer, Enter and Space and closes by default', async () => {
    const onEdit = vi.fn()
    const { getByRole } = render(
      <Menu trigger={<Button text="Actions" />}>
        <MenuItem text="Edit" onSelect={onEdit} />
      </Menu>,
    )

    const trigger = getByRole('button', {
      name: 'Actions',
    })

    fireEvent.click(trigger)

    let menu = getByRole('menu')

    await waitFor(() => {
      expect(menu.style.visibility).toBe('visible')
    })

    fireEvent.keyDown(getByRole('menuitem'), {
      key: 'Enter',
    })

    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    fireEvent.transitionEnd(menu)

    await waitFor(() => {
      expect(document.querySelector('[data-weave-menu]')).toBeNull()
    })

    fireEvent.click(trigger)
    menu = getByRole('menu')

    await waitFor(() => {
      expect(menu.style.visibility).toBe('visible')
    })

    fireEvent.keyDown(getByRole('menuitem'), {
      key: ' ',
    })

    expect(onEdit).toHaveBeenCalledTimes(2)

    fireEvent.transitionEnd(menu)

    await waitFor(() => {
      expect(document.querySelector('[data-weave-menu]')).toBeNull()
    })

    fireEvent.click(trigger)
    menu = getByRole('menu')

    await waitFor(() => {
      expect(menu.style.visibility).toBe('visible')
    })

    fireEvent.click(getByRole('menuitem'))

    expect(onEdit).toHaveBeenCalledTimes(3)

    fireEvent.transitionEnd(menu)
  })

  it('can keep the menu open after selection', () => {
    const onSelect = vi.fn()
    const { getByRole } = render(
      <Menu closeOnSelect={false} trigger={<Button text="Persistent" />}>
        <MenuItem text="Toggle option" onSelect={onSelect} />
      </Menu>,
    )

    const trigger = getByRole('button')

    fireEvent.click(trigger)
    fireEvent.click(getByRole('menuitem'))

    expect(onSelect).toHaveBeenCalledOnce()
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(getByRole('menu')).toBeDefined()
  })

  it('opens a submenu from hover and ArrowRight, then returns to the parent item with ArrowLeft', async () => {
    const { getByRole, getAllByRole } = render(
      <Menu trigger={<Button text="Share menu" />}>
        <MenuItem
          text="Share"
          submenu={
            <>
              <MenuItem text="Copy link" />
              <MenuItem text="Email" />
            </>
          }
        />
        <MenuItem text="Rename" />
      </Menu>,
    )

    fireEvent.click(getByRole('button'))

    const share = getByRole('menuitem', {
      name: /Share/,
    })

    fireEvent.pointerEnter(share)

    await waitFor(() => {
      expect(getAllByRole('menu')).toHaveLength(2)
      expect(share.getAttribute('aria-expanded')).toBe('true')
    })

    let submenu = getAllByRole('menu')[1]!

    await waitFor(() => {
      expect(submenu.style.visibility).toBe('visible')
    })

    const copy = getByRole('menuitem', {
      name: 'Copy link',
    })

    copy.focus()
    fireEvent.keyDown(copy, {
      key: 'ArrowLeft',
    })

    expect(share.getAttribute('aria-expanded')).toBe('false')

    fireEvent.transitionEnd(submenu)

    await waitFor(() => {
      expect(getAllByRole('menu')).toHaveLength(1)
      expect(document.activeElement).toBe(share)
    })

    fireEvent.keyDown(share, {
      key: 'ArrowRight',
    })

    await waitFor(() => {
      expect(getAllByRole('menu')).toHaveLength(2)
    })

    submenu = getAllByRole('menu')[1]!

    await waitFor(() => {
      expect(submenu.style.visibility).toBe('visible')
      expect(document.activeElement).toBe(
        getByRole('menuitem', {
          name: 'Copy link',
        }),
      )
    })
  })

  it('supports recursively nested submenus and Escape closes one submenu level at a time', async () => {
    const { getByRole, getAllByRole } = render(
      <Menu trigger={<Button text="Nested" />}>
        <MenuItem
          text="More"
          submenu={
            <MenuItem
              text="Advanced"
              submenu={
                <>
                  <MenuItem text="Inspect" />
                  <MenuItem text="Export" />
                </>
              }
            />
          }
        />
      </Menu>,
    )

    fireEvent.click(getByRole('button'))

    const more = getByRole('menuitem', {
      name: /More/,
    })

    fireEvent.keyDown(more, {
      key: 'ArrowRight',
    })

    const advanced = await waitFor(() =>
      getByRole('menuitem', {
        name: /Advanced/,
      }),
    )

    fireEvent.keyDown(advanced, {
      key: 'ArrowRight',
    })

    await waitFor(() => {
      expect(getAllByRole('menu')).toHaveLength(3)
      expect(document.activeElement).toBe(
        getByRole('menuitem', {
          name: 'Inspect',
        }),
      )
    })

    fireEvent.keyDown(
      getByRole('menuitem', {
        name: 'Inspect',
      }),
      {
        key: 'Escape',
      },
    )

    await waitFor(() => {
      expect(advanced.getAttribute('aria-expanded')).toBe('false')
      expect(more.getAttribute('aria-expanded')).toBe('true')
      expect(document.activeElement).toBe(advanced)
    })
  })

  it('treats submenu portals as inside the same menu tree for outside dismissal', async () => {
    const { getByRole, getAllByRole } = render(
      <Menu trigger={<Button text="Portal tree" />}>
        <MenuItem text="More" submenu={<MenuItem text="Keep open" closeOnSelect={false} />} />
      </Menu>,
    )

    const trigger = getByRole('button')

    fireEvent.click(trigger)
    fireEvent.pointerEnter(
      getByRole('menuitem', {
        name: /More/,
      }),
    )

    await waitFor(() => {
      expect(getAllByRole('menu')).toHaveLength(2)
    })

    const submenuItem = getByRole('menuitem', {
      name: 'Keep open',
    })

    fireEvent.pointerDown(submenuItem)

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
  })

  it('flips a submenu to the left near the viewport edge and shifts it vertically', async () => {
    const { getByRole, getAllByRole } = render(
      <Menu trigger={<Button text="Edge" />}>
        <MenuItem text="More" submenu={<MenuItem text="Child" />} />
      </Menu>,
    )

    fireEvent.click(getByRole('button'))

    const more = getByRole('menuitem', {
      name: /More/,
    })

    fireEvent.pointerEnter(more)

    await waitFor(() => {
      expect(getAllByRole('menu')).toHaveLength(2)
    })

    const menus = getAllByRole('menu')
    const submenu = menus[1]!

    more.getBoundingClientRect = () =>
      ({
        x: 970,
        y: 700,
        left: 970,
        top: 700,
        right: 1010,
        bottom: 740,
        width: 40,
        height: 40,
        toJSON: () => ({}),
      }) as DOMRect

    submenu.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        right: 200,
        bottom: 120,
        width: 200,
        height: 120,
        toJSON: () => ({}),
      }) as DOMRect

    fireEvent.scroll(window)

    await waitFor(() => {
      expect(submenu.getAttribute('data-placement')).toBe('left')
      expect(submenu.style.left).toBe('766px')
      expect(submenu.style.top).toBe('640px')
    })
  })

  it('keeps the menu open while its trigger intersects the viewport and closes once the trigger fully leaves it', async () => {
    const { getByRole } = render(
      <Menu trigger={<Button text="Viewport menu" />}>
        <MenuItem text="Action" />
      </Menu>,
    )

    const trigger = getByRole('button', {
      name: 'Viewport menu',
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

    const menu = getByRole('menu')

    await waitFor(() => {
      expect(menu.style.visibility).toBe('visible')
    })

    const initialTop = menu.style.top

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
      expect(menu.style.top).not.toBe(initialTop)
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

    fireEvent.transitionEnd(menu)

    await waitFor(() => {
      expect(document.querySelector('[data-weave-menu]')).toBeNull()
    })
  })

  it('lets trigger React handlers cancel click and keyboard activation', async () => {
    const onClick = vi.fn((event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
    })
    const onKeyDown = vi.fn((event: KeyboardEvent<HTMLButtonElement>) => {
      event.preventDefault()
    })
    const { getByRole, queryByRole } = render(
      <Menu trigger={<Button text="Cancelled menu" viewProps={{ onClick, onKeyDown }} />}>
        <MenuItem text="Item" />
      </Menu>,
    )
    const trigger = getByRole('button')

    fireEvent.click(trigger)
    await Promise.resolve()

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(queryByRole('menu')).toBeNull()

    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    await Promise.resolve()

    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(queryByRole('menu')).toBeNull()
  })

  it('uses custom viewportPadding for the root menu', async () => {
    const { getByRole } = render(
      <Menu
        defaultOpen
        placement="bottom-left"
        viewportPadding={2}
        trigger={<Button text="Padding menu" />}
      >
        <MenuItem text="Item" />
      </Menu>,
    )
    const trigger = getByRole('button')
    const menu = getByRole('menu')

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
    menu.getBoundingClientRect = () =>
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
      expect(menu.style.left).toBe('32px')
    })
  })

  it('can overlap its trigger instead of opening below it', async () => {
    const { getByRole } = render(
      <Menu
        defaultOpen
        overlapTrigger
        placement="bottom-left"
        trigger={<Button text="Overlap menu" />}
      >
        <MenuItem text="Item" />
      </Menu>,
    )
    const trigger = getByRole('button')
    const menu = getByRole('menu')

    trigger.getBoundingClientRect = () =>
      ({
        x: 100,
        y: 100,
        left: 100,
        top: 100,
        right: 220,
        bottom: 140,
        width: 120,
        height: 40,
        toJSON: () => ({}),
      }) as DOMRect
    menu.getBoundingClientRect = () =>
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
      expect(menu.style.left).toBe('100px')
      expect(menu.style.top).toBe('100px')
    })
  })

  it('uses custom submenuOffset for submenu positioning', async () => {
    const { getByRole, getAllByRole } = render(
      <Menu defaultOpen submenuOffset={1} trigger={<Button text="Offset menu" />}>
        <MenuItem text="More" submenu={<MenuItem text="Child" />} />
      </Menu>,
    )
    const more = getByRole('menuitem', { name: /More/ })

    fireEvent.pointerEnter(more)

    await waitFor(() => {
      expect(getAllByRole('menu')).toHaveLength(2)
    })

    const submenu = getAllByRole('menu')[1]!

    more.getBoundingClientRect = () =>
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
    submenu.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        right: 100,
        bottom: 80,
        width: 100,
        height: 80,
        toJSON: () => ({}),
      }) as DOMRect

    fireEvent.scroll(window)

    await waitFor(() => {
      expect(submenu.style.left).toBe('156px')
    })
  })

  it('rebinds viewport dismissal when an open trigger is replaced', async () => {
    const onOpenChange = vi.fn()
    const { getByRole, rerender } = render(
      <Menu open onOpenChange={onOpenChange} trigger={<Button key="first" text="First trigger" />}>
        <MenuItem text="Action" />
      </Menu>,
    )

    const first = getByRole('button', { name: 'First trigger' })

    rerender(
      <Menu
        open
        onOpenChange={onOpenChange}
        trigger={<Button key="second" text="Second trigger" />}
      >
        <MenuItem text="Action" />
      </Menu>,
    )

    const second = getByRole('button', { name: 'Second trigger' })
    const menu = getByRole('menu')
    second.getBoundingClientRect = () =>
      ({
        x: 200,
        y: 120,
        left: 200,
        top: 120,
        right: 260,
        bottom: 150,
        width: 60,
        height: 30,
        toJSON: () => ({}),
      }) as DOMRect
    menu.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        right: 100,
        bottom: 80,
        width: 100,
        height: 80,
        toJSON: () => ({}),
      }) as DOMRect

    fireEvent.scroll(window)

    await waitFor(() => {
      expect(menu.style.left).toBe('200px')
      expect(menu.style.top).toBe('156px')
    })

    first.getBoundingClientRect = () =>
      ({
        x: 0,
        y: -40,
        left: 0,
        top: -40,
        right: 40,
        bottom: 0,
        width: 40,
        height: 40,
        toJSON: () => ({}),
      }) as DOMRect

    fireEvent.scroll(window)
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(onOpenChange).not.toHaveBeenCalledWith(false)

    second.getBoundingClientRect = first.getBoundingClientRect
    fireEvent.scroll(window)

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('renders separators, danger state and dedicated Menu theme variables', () => {
    const theme = createTheme({
      components: {
        Menu: {
          base: {
            background: 'primary',
            shadow: 'large',
          },
          item: {
            dangerColor: 'warning',
          },
        },
      },
    })
    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <Menu defaultOpen trigger={<Button text="Theme menu" />}>
          <MenuItem text="Normal" />
          <Divider gap={0.25} />
          <MenuItem text="Delete" danger />
        </Menu>
      </ThemeProvider>,
    )

    const menu = getByRole('menu')
    const danger = getByRole('menuitem', {
      name: 'Delete',
    })

    expect(getByRole('separator')).toBeDefined()
    expect(danger.dataset.weaveMenuItemDanger).toBe('true')

    const themeClass = [...menu.classList].find((name) => name.startsWith('weave-menu-theme-'))

    expect(themeClass).toBeDefined()

    const runtimeStyle =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-runtime-class="' + themeClass + '"]',
      )?.textContent ?? ''
    const stylesheet =
      document.querySelector<HTMLStyleElement>('style[data-weave-menu-styles]')?.textContent ?? ''

    expect(runtimeStyle).toContain('--weave-menu-background:')
    expect(runtimeStyle).toContain('--weave-color-primary')
    expect(stylesheet).toContain('data-weave-menu-item-danger')

    const divider = getByRole('separator')

    expect(divider.getAttribute('data-weave-divider-direction')).toBe('horizontal')
    const dividerPropsClass = [...divider.classList].find((name) =>
      name.startsWith('weave-divider-props-'),
    )
    const dividerRule = (
      document.querySelector<HTMLStyleElement>(
        `style[data-weave-runtime-class="${dividerPropsClass}"]`,
      )?.textContent ?? ''
    ).replace(/\s+/g, '')
    expect(dividerRule).toContain('--weave-divider-gap:0.25rem;')
    expect(stylesheet).toContain('@starting-style')
  })
})
