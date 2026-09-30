import { IconUser } from '@tabler/icons-react'
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  Button,
  createTheme,
  defaultTheme,
  List,
  ListItem,
  Switch,
  Text,
  ThemeProvider,
} from '../src'

afterEach(cleanup)

function runtimeRule(element: Element, prefix: string): string {
  const className = [...element.classList].find((name) => name.startsWith(prefix))

  expect(className).toBeDefined()

  return (
    document.querySelector<HTMLStyleElement>(`style[data-weave-runtime-class="${className}"]`)
      ?.textContent ?? ''
  ).replace(/\s+/g, '')
}

describe('List', () => {
  it('renders data items with list semantics and composed content', () => {
    const { getByRole, getAllByRole, getByText } = render(
      <List
        items={[
          {
            id: 'profile',
            text: 'Profile',
            secondaryText: 'Account details',
            icon: IconUser,
            trailing: <Switch defaultChecked />,
          },
          {
            id: 'settings',
            text: 'Settings',
          },
        ]}
      />,
    )

    expect(getByRole('list')).toBeDefined()

    const items = getAllByRole('listitem')

    expect(items).toHaveLength(2)
    expect(items[0]?.getAttribute('data-weave-list-item-id')).toBe('profile')
    expect(getByText('Account details')).toBeDefined()
    expect(items[0]?.querySelector('.tabler-icon-user')).not.toBeNull()
    expect(getByRole('switch')).toBeDefined()
  })

  it('shows item dividers by default and can disable them', () => {
    const items = [
      { id: 'first', text: 'First' },
      { id: 'second', text: 'Second' },
    ] as const
    const { getByRole, queryAllByRole, rerender } = render(<List items={items} />)

    const list = getByRole('list')
    expect(list.getAttribute('data-weave-list-dividers')).toBe('true')

    const dividers = queryAllByRole('separator')

    expect(dividers).toHaveLength(1)
    expect(dividers[0]?.getAttribute('data-weave-divider-direction')).toBe('horizontal')
    const dividerPropsClass = [...(dividers[0]?.classList ?? [])].find((name) =>
      name.startsWith('weave-divider-props-'),
    )
    const dividerRule = (
      document.querySelector<HTMLStyleElement>(
        `style[data-weave-runtime-class="${dividerPropsClass}"]`,
      )?.textContent ?? ''
    ).replace(/\s+/g, '')
    expect(dividerRule).toContain('--weave-divider-gap:0rem;')

    const listStyles =
      document.querySelector<HTMLStyleElement>('style[data-weave-list-styles]')?.textContent ?? ''

    expect(listStyles).not.toContain('::before')
    expect(listStyles).not.toContain('data-weave-list-dividers="true"')

    rerender(<List items={items} noDividers />)

    expect(getByRole('list').getAttribute('data-weave-list-dividers')).toBe('false')
    expect(queryAllByRole('separator')).toHaveLength(0)
  })

  it('supports composed ListItem children with the same id semantics', () => {
    const { getAllByRole } = render(
      <List>
        <ListItem id="first">
          <Text>First</Text>
        </ListItem>
        <ListItem id="second">
          <Text>Second</Text>
        </ListItem>
      </List>,
    )

    expect(
      getAllByRole('listitem').map((item) => item.getAttribute('data-weave-list-item-id')),
    ).toEqual(['first', 'second'])
  })

  it('supports uncontrolled single selection', () => {
    const onSelect = vi.fn()
    const { getAllByRole } = render(
      <List
        selection="single"
        defaultSelected="second"
        onSelect={onSelect}
        items={[
          {
            id: 'first',
            text: 'First',
          },
          {
            id: 'second',
            text: 'Second',
          },
        ]}
      />,
    )

    const options = getAllByRole('option')

    expect(options[1]?.getAttribute('aria-selected')).toBe('true')
    expect(options[1]?.tabIndex).toBe(0)

    fireEvent.click(options[0]!)

    expect(options[0]?.getAttribute('aria-selected')).toBe('true')
    expect(onSelect).toHaveBeenCalledWith('first')
  })

  it('supports controlled single selection', () => {
    const onSelect = vi.fn()
    const { getAllByRole, rerender } = render(
      <List
        selection="single"
        selected="first"
        onSelect={onSelect}
        items={[
          {
            id: 'first',
            text: 'First',
          },
          {
            id: 'second',
            text: 'Second',
          },
        ]}
      />,
    )

    const options = getAllByRole('option')

    fireEvent.click(options[1]!)

    expect(onSelect).toHaveBeenCalledWith('second')
    expect(options[0]?.getAttribute('aria-selected')).toBe('true')

    rerender(
      <List
        selection="single"
        selected="second"
        onSelect={onSelect}
        items={[
          {
            id: 'first',
            text: 'First',
          },
          {
            id: 'second',
            text: 'Second',
          },
        ]}
      />,
    )

    expect(getAllByRole('option')[1]?.getAttribute('aria-selected')).toBe('true')
  })

  it('toggles multiple selection without affecting other selected ids', () => {
    const onSelect = vi.fn()
    const { getAllByRole } = render(
      <List
        selection="multiple"
        defaultSelected={['first']}
        onSelect={onSelect}
        items={[
          {
            id: 'first',
            text: 'First',
          },
          {
            id: 'second',
            text: 'Second',
          },
        ]}
      />,
    )

    const options = getAllByRole('option')

    fireEvent.click(options[1]!)

    expect(onSelect).toHaveBeenLastCalledWith(['first', 'second'])

    fireEvent.click(options[0]!)

    expect(onSelect).toHaveBeenLastCalledWith(['second'])
  })

  it('moves focus by orientation and skips disabled items', () => {
    const { getAllByRole, rerender } = render(
      <List
        selection="single"
        items={[
          {
            id: 'a',
            text: 'A',
          },
          {
            id: 'b',
            text: 'B',
            disabled: true,
          },
          {
            id: 'c',
            text: 'C',
          },
        ]}
      />,
    )

    let options = getAllByRole('option')

    options[0]?.focus()
    fireEvent.keyDown(options[0]!, {
      key: 'ArrowDown',
    })

    expect(document.activeElement).toBe(options[2])

    fireEvent.keyDown(options[2]!, {
      key: 'Home',
    })

    expect(document.activeElement).toBe(options[0])

    rerender(
      <List
        selection="single"
        orientation="horizontal"
        items={[
          {
            id: 'a',
            text: 'A',
          },
          {
            id: 'b',
            text: 'B',
            disabled: true,
          },
          {
            id: 'c',
            text: 'C',
          },
        ]}
      />,
    )

    options = getAllByRole('option')

    options[0]?.focus()
    fireEvent.keyDown(options[0]!, {
      key: 'ArrowRight',
    })

    expect(document.activeElement).toBe(options[2])
  })

  it('selects with Enter and Space', () => {
    const onSelect = vi.fn()
    const { getAllByRole } = render(
      <List
        selection="single"
        onSelect={onSelect}
        items={[
          {
            id: 'first',
            text: 'First',
          },
          {
            id: 'second',
            text: 'Second',
          },
        ]}
      />,
    )

    const options = getAllByRole('option')

    fireEvent.keyDown(options[0]!, {
      key: 'Enter',
    })
    expect(onSelect).toHaveBeenLastCalledWith('first')

    act(() => {
      options[1]?.focus()
    })
    fireEvent.keyDown(options[1]!, {
      key: ' ',
    })
    expect(onSelect).toHaveBeenLastCalledWith('second')
  })

  it('does not select a row when an interactive trailing control is used', () => {
    const onSelect = vi.fn()
    const { getByRole } = render(
      <List
        selection="single"
        onSelect={onSelect}
        items={[
          {
            id: 'wifi',
            text: 'Wi-Fi',
            trailing: <Button text="Details" />,
          },
        ]}
      />,
    )

    fireEvent.click(
      getByRole('button', {
        name: 'Details',
      }),
    )

    expect(onSelect).not.toHaveBeenCalled()
  })

  it('disables the whole List through the high-level disabled prop', () => {
    const onSelect = vi.fn()
    const { getByRole } = render(
      <List
        disabled
        selection="single"
        onSelect={onSelect}
        items={[
          {
            id: 'one',
            text: 'One',
          },
        ]}
      />,
    )

    const list = getByRole('listbox')
    const option = getByRole('option')

    expect(list.getAttribute('aria-disabled')).toBe('true')
    expect(option.getAttribute('aria-disabled')).toBe('true')
    expect(option.tabIndex).toBe(-1)

    fireEvent.click(option)
    fireEvent.keyDown(option, {
      key: 'Enter',
    })

    expect(onSelect).not.toHaveBeenCalled()
  })

  it('does not select disabled items', () => {
    const onSelect = vi.fn()
    const { getByRole } = render(
      <List
        selection="single"
        onSelect={onSelect}
        items={[
          {
            id: 'locked',
            text: 'Locked',
            disabled: true,
          },
        ]}
      />,
    )

    const option = getByRole('option')

    expect(option.getAttribute('aria-disabled')).toBe('true')

    fireEvent.click(option)
    fireEvent.keyDown(option, {
      key: 'Enter',
    })

    expect(onSelect).not.toHaveBeenCalled()
  })

  it('applies orientation, gap and View scrolling without inventing a scroll API', () => {
    const { getByRole } = render(
      <List
        orientation="horizontal"
        gap={1}
        viewProps={{
          overflow: 'auto',
          height: 10,
        }}
        items={[
          {
            id: 'one',
            text: 'One',
          },
        ]}
      />,
    )

    const list = getByRole('list')

    expect(list.getAttribute('data-weave-list-orientation')).toBe('horizontal')
    expect(list.className).toContain('weave-scroll-host')
  })

  it('keeps ListItem feedback flat instead of copying Button depth', () => {
    render(
      <List
        selection="single"
        items={[
          {
            id: 'one',
            text: 'One',
          },
        ]}
      />,
    )

    const stylesheet =
      document.querySelector<HTMLStyleElement>('style[data-weave-list-styles]')?.textContent ?? ''

    expect(stylesheet).toContain('--weave-list-item-selected-background')
    expect(stylesheet).not.toContain('--weave-feedback-rest-depth')
    expect(stylesheet).not.toContain('scale(')
  })

  it('keeps the default List borderless and selected rows clearly emphasized', () => {
    expect(defaultTheme.components?.List?.base?.borderWidth).toBe(0)
    expect(defaultTheme.components?.List?.base?.borderColor).toBeUndefined()
    expect(defaultTheme.components?.ListItem?.base?.radius).toBe(0)
    expect(defaultTheme.components?.ListItem?.base?.selectedBackground).toBe(
      'color-mix(in srgb, var(--weave-color-primary) 14%, var(--weave-color-surface))',
    )
    expect(defaultTheme.components?.ListItem?.base?.selectedHoverBackground).toBe(
      'color-mix(in srgb, var(--weave-color-primary) 20%, var(--weave-color-surface))',
    )
    expect(defaultTheme.components?.ListItem?.base?.selectedColor).toBe('primary')
  })

  it('keeps List and ListItem fully themeable', () => {
    const theme = createTheme({
      components: {
        List: {
          base: {
            background: 'surface',
            borderColor: 'outline',
            borderWidth: 0.125,
            radius: 'large',
            padding: 0.5,
            gap: 1,
          },
        },
        ListItem: {
          base: {
            background: 'surface',
            hoverBackground: 'surfaceHover',
            selectedBackground: 'primary',
            selectedColor: 'onPrimary',
            radius: 'large',
          },
        },
      },
    })

    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <List
          selection="single"
          items={[
            {
              id: 'one',
              text: 'One',
            },
          ]}
        />
      </ThemeProvider>,
    )

    const list = getByRole('listbox')
    const option = getByRole('option')

    const listRule = runtimeRule(list, 'weave-list-theme-')

    expect(listRule).toContain('--weave-list-background:var(--weave-color-surface,surface)')
    expect(listRule).toContain('--weave-list-border-width:0.125rem')
    expect(listRule).toContain('--weave-list-radius:var(--weave-radius-large)')
    expect(listRule).toContain('--weave-list-padding:0.5rem')
    expect(listRule).toContain('--weave-list-gap:1rem')

    expect(runtimeRule(option, 'weave-list-item-theme-')).toContain(
      '--weave-list-item-selected-background:var(--weave-color-primary,primary)',
    )
  })

  it('window-renders virtualized data instead of mounting every item', async () => {
    const items = Array.from(
      {
        length: 100,
      },
      (_, index) => ({
        id: `item-${index}`,
        text: `Item ${index}`,
      }),
    )

    const { getByRole } = render(
      <List
        items={items}
        virtualized
        viewProps={{
          height: 12,
          overflow: 'auto',
        }}
      />,
    )

    const list = getByRole('list')

    await waitFor(() => {
      const rendered = list.querySelectorAll('[data-weave-list-item]')

      expect(rendered.length).toBeGreaterThan(0)
      expect(rendered.length).toBeLessThan(items.length)
    })

    expect(list.querySelector('[data-weave-list-virtual-spacer]')).not.toBeNull()
  })

  it('keeps the focus-target selected item mounted even when it starts outside the virtual window', async () => {
    const items = Array.from(
      {
        length: 100,
      },
      (_, index) => ({
        id: `item-${index}`,
        text: `Item ${index}`,
      }),
    )

    const { getByRole } = render(
      <List
        items={items}
        virtualized
        selection="single"
        selected="item-99"
        viewProps={{
          height: 12,
          overflow: 'auto',
        }}
      />,
    )

    const list = getByRole('listbox')

    await waitFor(() => {
      const selected = list.querySelector<HTMLElement>('[data-weave-list-item-id="item-99"]')

      expect(selected).not.toBeNull()
      expect(selected?.getAttribute('aria-selected')).toBe('true')
    })
  })

  it('rejects duplicate item ids', () => {
    expect(() =>
      render(
        <List
          items={[
            {
              id: 'same',
              text: 'One',
            },
            {
              id: 'same',
              text: 'Two',
            },
          ]}
        />,
      ),
    ).toThrow('List item id "same" is duplicated')
  })
})
