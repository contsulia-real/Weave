import {
  cleanup,
  fireEvent,
  render,
  waitFor,
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
  Menu,
  MenuItem,
  MenuSeparator,
  ThemeProvider,
  createTheme,
} from '../src'

afterEach(cleanup)

describe('Menu', () => {
  it('opens from its trigger with menu semantics and focuses the first enabled item', async () => {
    const {
      getByRole,
      getAllByRole,
    } = render(
      <Menu
        trigger={
          <Button text="Actions" />
        }
      >
        <MenuItem
          text="Disabled"
          disabled
        />
        <MenuItem text="Edit" />
        <MenuItem text="Duplicate" />
      </Menu>,
    )

    const trigger =
      getByRole('button', {
        name: 'Actions',
      })

    expect(
      trigger.getAttribute(
        'aria-haspopup',
      ),
    ).toBe('menu')
    expect(
      trigger.getAttribute(
        'aria-expanded',
      ),
    ).toBe('false')

    fireEvent.click(trigger)

    const menu =
      getByRole('menu')
    const items =
      getAllByRole('menuitem')

    expect(
      document.body.contains(menu),
    ).toBe(true)
    expect(
      trigger.getAttribute(
        'aria-expanded',
      ),
    ).toBe('true')
    expect(
      trigger.getAttribute(
        'aria-controls',
      ),
    ).toBe(menu.id)
    expect(
      items[0]?.getAttribute(
        'aria-disabled',
      ),
    ).toBe('true')

    await waitFor(() => {
      expect(
        document.activeElement,
      ).toBe(items[1])
    })
  })

  it('supports ArrowUp/ArrowDown/Home/End navigation and skips disabled items', async () => {
    const {
      getByRole,
      getAllByRole,
    } = render(
      <Menu
        trigger={
          <Button text="Navigate" />
        }
      >
        <MenuItem text="First" />
        <MenuItem
          text="Disabled"
          disabled
        />
        <MenuItem text="Third" />
      </Menu>,
    )

    const trigger =
      getByRole('button', {
        name: 'Navigate',
      })

    fireEvent.keyDown(
      trigger,
      {
        key: 'ArrowDown',
      },
    )

    const items =
      getAllByRole('menuitem')

    await waitFor(() => {
      expect(
        document.activeElement,
      ).toBe(items[0])
    })

    fireEvent.keyDown(
      items[0]!,
      {
        key: 'ArrowDown',
      },
    )

    expect(
      document.activeElement,
    ).toBe(items[2])

    fireEvent.keyDown(
      items[2]!,
      {
        key: 'ArrowDown',
      },
    )

    expect(
      document.activeElement,
    ).toBe(items[0])

    fireEvent.keyDown(
      items[0]!,
      {
        key: 'End',
      },
    )

    expect(
      document.activeElement,
    ).toBe(items[2])

    fireEvent.keyDown(
      items[2]!,
      {
        key: 'Home',
      },
    )

    expect(
      document.activeElement,
    ).toBe(items[0])
  })

  it('opens from ArrowUp with the last enabled item focused', async () => {
    const {
      getByRole,
      getAllByRole,
    } = render(
      <Menu
        trigger={
          <Button text="Open upward" />
        }
      >
        <MenuItem text="First" />
        <MenuItem text="Last" />
      </Menu>,
    )

    fireEvent.keyDown(
      getByRole('button'),
      {
        key: 'ArrowUp',
      },
    )

    const items =
      getAllByRole('menuitem')

    await waitFor(() => {
      expect(
        document.activeElement,
      ).toBe(items[1])
    })
  })

  it('activates items with pointer, Enter and Space and closes by default', async () => {
    const onEdit = vi.fn()
    const {
      getByRole,
    } = render(
      <Menu
        trigger={
          <Button text="Actions" />
        }
      >
        <MenuItem
          text="Edit"
          onSelect={onEdit}
        />
      </Menu>,
    )

    const trigger =
      getByRole('button', {
        name: 'Actions',
      })

    fireEvent.click(trigger)

    let menu =
      getByRole('menu')

    await waitFor(() => {
      expect(
        menu.style.visibility,
      ).toBe('visible')
    })

    fireEvent.keyDown(
      getByRole('menuitem'),
      {
        key: 'Enter',
      },
    )

    expect(onEdit)
      .toHaveBeenCalledTimes(1)
    expect(
      trigger.getAttribute(
        'aria-expanded',
      ),
    ).toBe('false')

    fireEvent.transitionEnd(menu)

    await waitFor(() => {
      expect(
        document.querySelector(
          '[data-weave-menu]',
        ),
      ).toBeNull()
    })

    fireEvent.click(trigger)
    menu = getByRole('menu')

    await waitFor(() => {
      expect(
        menu.style.visibility,
      ).toBe('visible')
    })

    fireEvent.keyDown(
      getByRole('menuitem'),
      {
        key: ' ',
      },
    )

    expect(onEdit)
      .toHaveBeenCalledTimes(2)

    fireEvent.transitionEnd(menu)

    await waitFor(() => {
      expect(
        document.querySelector(
          '[data-weave-menu]',
        ),
      ).toBeNull()
    })

    fireEvent.click(trigger)
    menu = getByRole('menu')

    await waitFor(() => {
      expect(
        menu.style.visibility,
      ).toBe('visible')
    })

    fireEvent.click(
      getByRole('menuitem'),
    )

    expect(onEdit)
      .toHaveBeenCalledTimes(3)

    fireEvent.transitionEnd(menu)
  })

  it('can keep the menu open after selection', () => {
    const onSelect = vi.fn()
    const {
      getByRole,
    } = render(
      <Menu
        closeOnSelect={false}
        trigger={
          <Button text="Persistent" />
        }
      >
        <MenuItem
          text="Toggle option"
          onSelect={onSelect}
        />
      </Menu>,
    )

    const trigger =
      getByRole('button')

    fireEvent.click(trigger)
    fireEvent.click(
      getByRole('menuitem'),
    )

    expect(onSelect)
      .toHaveBeenCalledOnce()
    expect(
      trigger.getAttribute(
        'aria-expanded',
      ),
    ).toBe('true')
    expect(
      getByRole('menu'),
    ).toBeDefined()
  })

  it('opens a submenu from hover and ArrowRight, then returns to the parent item with ArrowLeft', async () => {
    const {
      getByRole,
      getAllByRole,
    } = render(
      <Menu
        trigger={
          <Button text="Share menu" />
        }
      >
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

    fireEvent.click(
      getByRole('button'),
    )

    const share =
      getByRole('menuitem', {
        name: /Share/,
      })

    fireEvent.pointerEnter(
      share,
    )

    await waitFor(() => {
      expect(
        getAllByRole('menu'),
      ).toHaveLength(2)
      expect(
        share.getAttribute(
          'aria-expanded',
        ),
      ).toBe('true')
    })

    let submenu =
      getAllByRole('menu')[1]!

    await waitFor(() => {
      expect(
        submenu.style.visibility,
      ).toBe('visible')
    })

    const copy =
      getByRole('menuitem', {
        name: 'Copy link',
      })

    copy.focus()
    fireEvent.keyDown(
      copy,
      {
        key: 'ArrowLeft',
      },
    )

    expect(
      share.getAttribute(
        'aria-expanded',
      ),
    ).toBe('false')

    fireEvent.transitionEnd(
      submenu,
    )

    await waitFor(() => {
      expect(
        getAllByRole('menu'),
      ).toHaveLength(1)
      expect(
        document.activeElement,
      ).toBe(share)
    })

    fireEvent.keyDown(
      share,
      {
        key: 'ArrowRight',
      },
    )

    await waitFor(() => {
      expect(
        getAllByRole('menu'),
      ).toHaveLength(2)
    })

    submenu =
      getAllByRole('menu')[1]!

    await waitFor(() => {
      expect(
        submenu.style.visibility,
      ).toBe('visible')
      expect(
        document.activeElement,
      ).toBe(
        getByRole(
          'menuitem',
          {
            name: 'Copy link',
          },
        ),
      )
    })
  })

  it('supports recursively nested submenus and Escape closes one submenu level at a time', async () => {
    const {
      getByRole,
      getAllByRole,
    } = render(
      <Menu
        trigger={
          <Button text="Nested" />
        }
      >
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

    fireEvent.click(
      getByRole('button'),
    )

    const more =
      getByRole('menuitem', {
        name: /More/,
      })

    fireEvent.keyDown(
      more,
      {
        key: 'ArrowRight',
      },
    )

    const advanced =
      await waitFor(() =>
        getByRole(
          'menuitem',
          {
            name: /Advanced/,
          },
        ),
      )

    fireEvent.keyDown(
      advanced,
      {
        key: 'ArrowRight',
      },
    )

    await waitFor(() => {
      expect(
        getAllByRole('menu'),
      ).toHaveLength(3)
      expect(
        document.activeElement,
      ).toBe(
        getByRole(
          'menuitem',
          {
            name: 'Inspect',
          },
        ),
      )
    })

    fireEvent.keyDown(
      getByRole(
        'menuitem',
        {
          name: 'Inspect',
        },
      ),
      {
        key: 'Escape',
      },
    )

    await waitFor(() => {
      expect(
        advanced.getAttribute(
          'aria-expanded',
        ),
      ).toBe('false')
      expect(
        more.getAttribute(
          'aria-expanded',
        ),
      ).toBe('true')
      expect(
        document.activeElement,
      ).toBe(advanced)
    })
  })

  it('treats submenu portals as inside the same menu tree for outside dismissal', async () => {
    const {
      getByRole,
      getAllByRole,
    } = render(
      <Menu
        trigger={
          <Button text="Portal tree" />
        }
      >
        <MenuItem
          text="More"
          submenu={
            <MenuItem
              text="Keep open"
              closeOnSelect={false}
            />
          }
        />
      </Menu>,
    )

    const trigger =
      getByRole('button')

    fireEvent.click(trigger)
    fireEvent.pointerEnter(
      getByRole(
        'menuitem',
        {
          name: /More/,
        },
      ),
    )

    await waitFor(() => {
      expect(
        getAllByRole('menu'),
      ).toHaveLength(2)
    })

    const submenuItem =
      getByRole('menuitem', {
        name: 'Keep open',
      })

    fireEvent.pointerDown(
      submenuItem,
    )

    expect(
      trigger.getAttribute(
        'aria-expanded',
      ),
    ).toBe('true')
  })

  it('flips a submenu to the left near the viewport edge and shifts it vertically', async () => {
    const {
      getByRole,
      getAllByRole,
    } = render(
      <Menu
        trigger={
          <Button text="Edge" />
        }
      >
        <MenuItem
          text="More"
          submenu={
            <MenuItem text="Child" />
          }
        />
      </Menu>,
    )

    fireEvent.click(
      getByRole('button'),
    )

    const more =
      getByRole('menuitem', {
        name: /More/,
      })

    fireEvent.pointerEnter(
      more,
    )

    await waitFor(() => {
      expect(
        getAllByRole('menu'),
      ).toHaveLength(2)
    })

    const menus =
      getAllByRole('menu')
    const submenu =
      menus[1]!

    more.getBoundingClientRect =
      () =>
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

    submenu.getBoundingClientRect =
      () =>
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
      expect(
        submenu.getAttribute(
          'data-placement',
        ),
      ).toBe('left')
      expect(
        submenu.style.left,
      ).toBe('766px')
      expect(
        submenu.style.top,
      ).toBe('640px')
    })
  })

  it('keeps the menu open while its trigger intersects the viewport and closes once the trigger fully leaves it', async () => {
    const {
      getByRole,
    } = render(
      <Menu
        trigger={
          <Button text="Viewport menu" />
        }
      >
        <MenuItem text="Action" />
      </Menu>,
    )

    const trigger =
      getByRole('button', {
        name: 'Viewport menu',
      })

    trigger.getBoundingClientRect =
      () =>
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

    const menu =
      getByRole('menu')

    await waitFor(() => {
      expect(
        menu.style.visibility,
      ).toBe('visible')
    })

    const initialTop =
      menu.style.top

    trigger.getBoundingClientRect =
      () =>
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
      expect(
        trigger.getAttribute(
          'aria-expanded',
        ),
      ).toBe('true')
      expect(
        menu.style.top,
      ).not.toBe(initialTop)
    })

    trigger.getBoundingClientRect =
      () =>
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
      expect(
        trigger.getAttribute(
          'aria-expanded',
        ),
      ).toBe('false')
      expect(
        document.activeElement,
      ).not.toBe(trigger)
    })

    fireEvent.transitionEnd(menu)

    await waitFor(() => {
      expect(
        document.querySelector(
          '[data-weave-menu]',
        ),
      ).toBeNull()
    })
  })

  it('renders separators, danger state and dedicated Menu theme variables', () => {
    const theme =
      createTheme({
        components: {
          Menu: {
            base: {
              background:
                'primary',
              shadow:
                'large',
            },
            item: {
              dangerColor:
                'warning',
            },
          },
        },
      })
    const {
      getByRole,
    } = render(
      <ThemeProvider
        theme={theme}
      >
        <Menu
          defaultOpen
          trigger={
            <Button text="Theme menu" />
          }
        >
          <MenuItem text="Normal" />
          <MenuSeparator />
          <MenuItem
            text="Delete"
            danger
          />
        </Menu>
      </ThemeProvider>,
    )

    const menu =
      getByRole('menu')
    const danger =
      getByRole('menuitem', {
        name: 'Delete',
      })

    expect(
      getByRole('separator'),
    ).toBeDefined()
    expect(
      danger.dataset
        .weaveMenuItemDanger,
    ).toBe('true')

    const themeClass =
      [...menu.classList].find(
        (name) =>
          name.startsWith(
            'weave-menu-theme-',
          ),
      )

    expect(themeClass)
      .toBeDefined()

    const runtimeStyle =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-runtime-class="' +
          themeClass +
          '"]',
      )?.textContent ??
      ''
    const stylesheet =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-menu-styles]',
      )?.textContent ??
      ''

    expect(runtimeStyle)
      .toContain(
        '--weave-menu-background:',
      )
    expect(runtimeStyle)
      .toContain(
        '--weave-color-primary',
      )
    expect(stylesheet)
      .toContain(
        'data-weave-menu-item-danger',
      )
    expect(stylesheet)
      .toContain(
        '.weave-menu-separator)::before',
      )
    expect(stylesheet)
      .toContain(
        '--weave-component-height: 0rem;',
      )
    expect(runtimeStyle)
      .not.toContain(
        '--weave-menu-separator-margin-y',
      )
    expect(stylesheet)
      .toContain(
        '@starting-style',
      )
  })
})
