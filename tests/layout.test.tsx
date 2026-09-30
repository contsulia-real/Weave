import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  Absolute,
  Column,
  createTheme,
  Flex,
  Grid,
  Row,
  SplitBox,
  SplitBoxPane,
  Stack,
  Text,
  ThemeProvider,
  View,
} from '../src'

afterEach(cleanup)

function runtimeRule(element: Element, prefix = 'weave-props-'): string {
  const className = [...element.classList].find((name) => name.startsWith(prefix))

  expect(className).toBeDefined()

  return (
    document.querySelector<HTMLStyleElement>(`style[data-weave-runtime-class="${className}"]`)
      ?.textContent ?? ''
  ).replace(/\s+/g, '')
}

describe('formal layout components', () => {
  it('maps Flex directly onto the View flex layout without an extra wrapper', () => {
    const { getByTestId } = render(
      <Flex direction="row-reverse" gap={1} data={{ testid: 'flex' }}>
        <span>one</span>
      </Flex>,
    )

    const element = getByTestId('flex')
    const rule = runtimeRule(element)

    expect(element.tagName).toBe('DIV')
    expect(element.dataset.weaveLayout).toBe('flex')
    expect(element.children).toHaveLength(1)
    expect(rule).toContain('--weave-flex-direction:row-reverse;')
    expect(rule).toContain('--weave-gap:1rem;')
  })

  it('keeps Flex configurable and exposes wrapping through the View flex backend', () => {
    const { getByTestId } = render(
      <Flex direction="row-reverse" wrap gap={0.5} width={14} data={{ testid: 'flex-wrap' }} />,
    )

    const flex = getByTestId('flex-wrap')
    const rule = runtimeRule(flex)

    expect(flex.dataset.weaveLayout).toBe('flex')
    expect(rule).toContain('--weave-flex-direction:row-reverse;')
    expect(rule).toContain('--weave-flex-wrap:wrap;')
    expect(rule).toContain('--weave-gap:0.5rem;')
    expect(rule).toContain('--weave-width:14rem;')
  })

  it('gives Row and Column fixed semantic directions and preserves Column axis alignment', () => {
    const { getByTestId } = render(
      <>
        <Row data={{ testid: 'row' }} />
        <Column
          width={10}
          height={14}
          align="end"
          justify="space-between"
          data={{ testid: 'column' }}
        />
      </>,
    )

    const row = getByTestId('row')
    const column = getByTestId('column')
    const columnRule = runtimeRule(column)

    expect(row.dataset.weaveLayout).toBe('flex')
    expect(column.dataset.weaveLayout).toBe('flex')
    expect(runtimeRule(row)).toContain('--weave-flex-direction:row;')
    expect(columnRule).toContain('--weave-flex-direction:column;')
    expect(columnRule).toContain('--weave-align-items:end;')
    expect(columnRule).toContain('--weave-justify-content:space-between;')
    expect(columnRule).toContain('--weave-width:10rem;')
    expect(columnRule).toContain('--weave-height:14rem;')
  })

  it('maps Grid, Stack, and Absolute to the existing View layout engine', () => {
    const { getByTestId } = render(
      <>
        <Grid columns={3} data={{ testid: 'grid' }} />
        <Stack data={{ testid: 'stack' }} />
        <Absolute data={{ testid: 'absolute' }} />
      </>,
    )

    const grid = getByTestId('grid')
    const stack = getByTestId('stack')
    const absolute = getByTestId('absolute')

    expect(grid.dataset.weaveLayout).toBe('grid')
    expect(stack.dataset.weaveLayout).toBe('stack')
    expect(absolute.dataset.weaveLayout).toBe('absolute')
    expect(runtimeRule(grid)).toContain('--weave-grid-template-columns:repeat(3,minmax(0,1fr));')
    expect(runtimeRule(absolute)).toContain('--weave-position:relative;')
  })

  it('keeps Stack as a full-size stacking plane and maps justify to item alignment', () => {
    const { getByTestId } = render(
      <Stack width={8} height={4} align="center" justify="center" data={{ testid: 'stack-plane' }}>
        <View width="fill" height="fill" data={{ testid: 'stack-background' }} />
        <View
          width={4}
          height={2}
          alignSelf="center"
          justifySelf="center"
          data={{ testid: 'stack-middle' }}
        />
        <span data-testid="stack-label">Stack</span>
      </Stack>,
    )

    const stack = getByTestId('stack-plane')
    const rule = runtimeRule(stack)
    const stylesheet =
      document.querySelector<HTMLStyleElement>('style[data-weave-view-styles]')?.textContent ?? ''

    expect(rule).toContain('--weave-width:8rem;')
    expect(rule).toContain('--weave-height:4rem;')
    expect(rule).toContain('--weave-align-items:center;')
    expect(rule).toContain('--weave-justify-content:center;')

    expect(stylesheet).toContain('grid-template-columns: minmax(0, 1fr);')
    expect(stylesheet).toContain('grid-template-rows: minmax(0, 1fr);')
    expect(stylesheet).toContain('justify-content: stretch;')
    expect(stylesheet).toContain('justify-items: var(')
    expect(stylesheet).toContain('--weave-justify-content,')
    expect(stylesheet).toContain('grid-area: 1 / 1;')

    const background = getByTestId('stack-background')
    const middle = getByTestId('stack-middle')

    expect(background.parentElement).toBe(stack)
    expect(middle.parentElement).toBe(stack)
    expect(getByTestId('stack-label').parentElement).toBe(stack)

    expect(runtimeRule(background)).toContain('--weave-width:100%;')
    expect(runtimeRule(background)).toContain('--weave-height:100%;')
    expect(runtimeRule(middle)).toContain('--weave-width:4rem;')
    expect(runtimeRule(middle)).toContain('--weave-height:2rem;')
    expect(runtimeRule(middle)).toContain('--weave-align-self:center;')
    expect(runtimeRule(middle)).toContain('--weave-justify-self:center;')
  })

  it('keeps responsive View layout styles available through Flex', () => {
    const { getByTestId } = render(
      <Flex direction="column" md={{ direction: 'row' }} data={{ testid: 'responsive-flex' }} />,
    )

    const element = getByTestId('responsive-flex')
    expect(element.dataset.weaveLayout).toBe('flex')

    const breakpointClass = [...element.classList].find((name) =>
      name.startsWith('weave-breakpoints-'),
    )
    expect(breakpointClass).toBeDefined()
  })
})

describe('SplitBox', () => {
  it('requires SplitBoxPane to be owned by SplitBox', () => {
    expect(() =>
      render(
        <SplitBoxPane>
          <Text>Orphan</Text>
        </SplitBoxPane>,
      ),
    ).toThrow('SplitBoxPane must be used inside SplitBox')
  })

  it('requires exactly two direct SplitBoxPane children', () => {
    expect(() =>
      render(
        <SplitBox defaultSize="50%">
          <SplitBoxPane>
            <Text>Only pane</Text>
          </SplitBoxPane>
        </SplitBox>,
      ),
    ).toThrow('SplitBox requires exactly two direct SplitBoxPane children')

    expect(() =>
      render(
        <SplitBox defaultSize="50%">
          <div>Not a pane</div>
          <SplitBoxPane>
            <Text>Pane</Text>
          </SplitBoxPane>
        </SplitBox>,
      ),
    ).toThrow('SplitBox requires exactly two direct SplitBoxPane children')
  })

  it('renders two layout panes and one focusable separator', () => {
    const { getByRole, getByTestId } = render(
      <SplitBox
        defaultSize="35%"
        minStart={8}
        minEnd={10}
        thickness={0}
        viewProps={{ data: { testid: 'splitbox' } }}
      >
        <SplitBoxPane viewProps={{ data: { testid: 'start' } }}>
          <Text>Start</Text>
        </SplitBoxPane>
        <SplitBoxPane viewProps={{ data: { testid: 'end' } }}>
          <Text>End</Text>
        </SplitBoxPane>
      </SplitBox>,
    )

    const root = getByTestId('splitbox')
    const separator = getByRole('separator')
    const start = getByTestId('start')
    const end = getByTestId('end')

    expect(root.getAttribute('data-weave-splitbox-direction')).toBe('horizontal')
    expect(separator.getAttribute('aria-orientation')).toBe('vertical')
    expect(separator.getAttribute('tabindex')).toBe('0')
    expect(start.getAttribute('data-weave-splitbox-pane-position')).toBe('start')
    expect(end.getAttribute('data-weave-splitbox-pane-position')).toBe('end')
    expect(root.style.getPropertyValue('--weave-splitbox-size')).toBe('35%')
    expect(root.style.getPropertyValue('--weave-splitbox-min-start')).toBe('8rem')
    expect(root.style.getPropertyValue('--weave-splitbox-min-end')).toBe('10rem')
    expect(root.style.getPropertyValue('--weave-splitbox-thickness')).toBe('0rem')
  })

  it('uses horizontal separator semantics for vertical pane layout', () => {
    const { getByRole, getByTestId } = render(
      <SplitBox direction="vertical" defaultSize="40%" viewProps={{ data: { testid: 'splitbox' } }}>
        <SplitBoxPane>
          <Text>Top</Text>
        </SplitBoxPane>
        <SplitBoxPane>
          <Text>Bottom</Text>
        </SplitBoxPane>
      </SplitBox>,
    )

    expect(getByTestId('splitbox').getAttribute('data-weave-splitbox-direction')).toBe('vertical')
    expect(getByRole('separator').getAttribute('aria-orientation')).toBe('horizontal')
  })

  it('allows nested SplitBox composition for more than two panes', () => {
    const { getAllByRole } = render(
      <SplitBox defaultSize="30%">
        <SplitBoxPane>
          <Text>One</Text>
        </SplitBoxPane>
        <SplitBoxPane>
          <SplitBox direction="vertical" defaultSize="50%">
            <SplitBoxPane>
              <Text>Two</Text>
            </SplitBoxPane>
            <SplitBoxPane>
              <Text>Three</Text>
            </SplitBoxPane>
          </SplitBox>
        </SplitBoxPane>
      </SplitBox>,
    )

    expect(getAllByRole('separator')).toHaveLength(2)
  })

  it('keeps pane styling layout-only and only adds overflow when collapsed', () => {
    const { getByTestId } = render(
      <SplitBox defaultSize="50%">
        <SplitBoxPane viewProps={{ data: { testid: 'pane' } }}>
          <Text>Pane</Text>
        </SplitBoxPane>
        <SplitBoxPane>
          <Text>Other</Text>
        </SplitBoxPane>
      </SplitBox>,
    )

    const pane = getByTestId('pane')
    const stylesheet =
      document.querySelector<HTMLStyleElement>('style[data-weave-splitbox-styles]')?.textContent ??
      ''

    expect(pane.className).toContain('weave-splitbox-pane')
    expect(stylesheet).toContain('min-width: 0')
    expect(stylesheet).toContain('min-height: 0')
    expect(stylesheet).toContain('overflow: hidden')
    expect(stylesheet).not.toMatch(/\.weave-splitbox-pane[^}]*background:/s)
    expect(stylesheet).not.toMatch(/\.weave-splitbox-pane[^}]*padding:/s)
    expect(stylesheet).not.toMatch(/\.weave-splitbox-pane[^}]*border(?:-|:)/s)
    expect(stylesheet).not.toMatch(/\.weave-splitbox-pane[^}]*box-shadow:/s)
    expect(stylesheet).not.toMatch(/\.weave-splitbox-pane[^}]*border-radius:/s)
  })

  it('routes splitter visuals through SplitBox theme', () => {
    const theme = createTheme({
      components: {
        SplitBox: {
          base: {
            thickness: 0.25,
            hitSize: 2,
            color: 'danger',
            hoverColor: 'warning',
            activeColor: 'primary',
          },
        },
      },
    })

    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <SplitBox defaultSize="50%" viewProps={{ data: { testid: 'splitbox' } }}>
          <SplitBoxPane>
            <Text>Start</Text>
          </SplitBoxPane>
          <SplitBoxPane>
            <Text>End</Text>
          </SplitBoxPane>
        </SplitBox>
      </ThemeProvider>,
    )

    const root = getByTestId('splitbox')
    const rule = runtimeRule(root, 'weave-splitbox-theme-')

    expect(rule).toContain('--weave-splitbox-theme-thickness:0.25rem;')
    expect(rule).toContain('--weave-splitbox-hit-size:2rem;')
    expect(rule).toContain('--weave-splitbox-color:var(--weave-color-danger,danger);')
    expect(rule).toContain('--weave-splitbox-hover-color:var(--weave-color-warning,warning);')
    expect(rule).toContain('--weave-splitbox-active-color:var(--weave-color-primary,primary);')
  })

  it('keeps a collapsed start pane closed until expandThreshold is crossed, then snaps open', () => {
    const rect = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function () {
        const element = this as HTMLElement
        const root = element.closest<HTMLElement>('[data-weave-splitbox]')
        const collapsed = root?.getAttribute('data-weave-splitbox-collapsed')
        const position = element.getAttribute('data-weave-splitbox-pane-position')
        const dragSize = Number.parseFloat(
          root?.style.getPropertyValue('--weave-splitbox-drag-size') ?? '',
        )

        if (position === 'start') {
          const width =
            collapsed === 'start'
              ? 0
              : collapsed === 'end'
                ? 400
                : Number.isFinite(dragSize)
                  ? dragSize
                  : 140
          return DOMRect.fromRect({ width, height: 200 })
        }

        if (position === 'end') {
          const width =
            collapsed === 'end'
              ? 0
              : collapsed === 'start'
                ? 400
                : Number.isFinite(dragSize)
                  ? 400 - dragSize
                  : 260
          return DOMRect.fromRect({ width, height: 200 })
        }

        if (element.style.position === 'absolute') {
          const raw = element.style.width
          const width =
            raw === '100%'
              ? 400
              : raw.endsWith('rem')
                ? Number.parseFloat(raw) * 16
                : Number.parseFloat(raw) || 0
          return DOMRect.fromRect({ width, height: 0 })
        }

        return DOMRect.fromRect({ width: 400, height: 200 })
      })

    const { getByRole, getByTestId } = render(
      <SplitBox
        defaultSize="35%"
        minStart={6}
        minEnd={6}
        collapsible="both"
        collapseThreshold={2}
        expandThreshold={4}
        viewProps={{ data: { testid: 'splitbox' } }}
      >
        <SplitBoxPane viewProps={{ data: { testid: 'start' } }}>
          <Text>Start</Text>
        </SplitBoxPane>
        <SplitBoxPane>
          <Text>End</Text>
        </SplitBoxPane>
      </SplitBox>,
    )

    const root = getByTestId('splitbox')
    const start = getByTestId('start')
    const separator = getByRole('separator')

    fireEvent.pointerDown(separator, { button: 0, pointerId: 1, clientX: 140 })
    fireEvent.pointerMove(separator, { pointerId: 1, clientX: 20 })
    fireEvent.pointerUp(separator, { pointerId: 1, clientX: 20 })

    expect(root.getAttribute('data-weave-splitbox-collapsed')).toBe('start')
    expect(start.hasAttribute('inert')).toBe(true)

    fireEvent.pointerDown(separator, { button: 0, pointerId: 2, clientX: 0 })
    fireEvent.pointerMove(separator, { pointerId: 2, clientX: 40 })

    expect(root.getAttribute('data-weave-splitbox-collapsed')).toBe('start')
    expect(root.style.getPropertyValue('--weave-splitbox-drag-size')).toBe('0px')

    fireEvent.pointerMove(separator, { pointerId: 2, clientX: 70 })

    expect(root.getAttribute('data-weave-splitbox-collapsed')).toBe('false')
    expect(root.style.getPropertyValue('--weave-splitbox-drag-size')).toBe('96px')
    expect(start.hasAttribute('inert')).toBe(false)

    fireEvent.pointerUp(separator, { pointerId: 2, clientX: 70 })

    expect(root.getAttribute('data-weave-splitbox-collapsed')).toBe('false')
    expect(root.style.getPropertyValue('--weave-splitbox-size')).toBe('96px')

    rect.mockRestore()
  })

  it('keeps a collapsed end pane closed until expandThreshold is crossed, then snaps open', () => {
    const rect = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function () {
        const element = this as HTMLElement
        const root = element.closest<HTMLElement>('[data-weave-splitbox]')
        const collapsed = root?.getAttribute('data-weave-splitbox-collapsed')
        const position = element.getAttribute('data-weave-splitbox-pane-position')
        const dragSize = Number.parseFloat(
          root?.style.getPropertyValue('--weave-splitbox-drag-size') ?? '',
        )

        if (position === 'start') {
          const width =
            collapsed === 'start'
              ? 0
              : collapsed === 'end'
                ? 400
                : Number.isFinite(dragSize)
                  ? dragSize
                  : 140
          return DOMRect.fromRect({ width, height: 200 })
        }

        if (position === 'end') {
          const width =
            collapsed === 'end'
              ? 0
              : collapsed === 'start'
                ? 400
                : Number.isFinite(dragSize)
                  ? 400 - dragSize
                  : 260
          return DOMRect.fromRect({ width, height: 200 })
        }

        if (element.style.position === 'absolute') {
          const raw = element.style.width
          const width =
            raw === '100%'
              ? 400
              : raw.endsWith('rem')
                ? Number.parseFloat(raw) * 16
                : Number.parseFloat(raw) || 0
          return DOMRect.fromRect({ width, height: 0 })
        }

        return DOMRect.fromRect({ width: 400, height: 200 })
      })

    const { getByRole, getByTestId } = render(
      <SplitBox
        defaultSize="35%"
        minStart={6}
        minEnd={6}
        collapsible="both"
        collapseThreshold={2}
        expandThreshold={4}
        viewProps={{ data: { testid: 'splitbox' } }}
      >
        <SplitBoxPane>
          <Text>Start</Text>
        </SplitBoxPane>
        <SplitBoxPane viewProps={{ data: { testid: 'end' } }}>
          <Text>End</Text>
        </SplitBoxPane>
      </SplitBox>,
    )

    const root = getByTestId('splitbox')
    const end = getByTestId('end')
    const separator = getByRole('separator')

    fireEvent.pointerDown(separator, { button: 0, pointerId: 1, clientX: 140 })
    fireEvent.pointerMove(separator, { pointerId: 1, clientX: 385 })
    fireEvent.pointerUp(separator, { pointerId: 1, clientX: 385 })

    expect(root.getAttribute('data-weave-splitbox-collapsed')).toBe('end')
    expect(end.hasAttribute('inert')).toBe(true)

    fireEvent.pointerDown(separator, { button: 0, pointerId: 2, clientX: 400 })
    fireEvent.pointerMove(separator, { pointerId: 2, clientX: 360 })

    expect(root.getAttribute('data-weave-splitbox-collapsed')).toBe('end')
    expect(root.style.getPropertyValue('--weave-splitbox-drag-size')).toBe('400px')

    fireEvent.pointerMove(separator, { pointerId: 2, clientX: 330 })

    expect(root.getAttribute('data-weave-splitbox-collapsed')).toBe('false')
    expect(root.style.getPropertyValue('--weave-splitbox-drag-size')).toBe('304px')
    expect(end.hasAttribute('inert')).toBe(false)

    fireEvent.pointerUp(separator, { pointerId: 2, clientX: 330 })

    expect(root.getAttribute('data-weave-splitbox-collapsed')).toBe('false')
    expect(root.style.getPropertyValue('--weave-splitbox-size')).toBe('304px')

    rect.mockRestore()
  })

  it('uses the controlled size until the owner updates it', () => {
    const { getByTestId, rerender } = render(
      <SplitBox size="12rem" viewProps={{ data: { testid: 'splitbox' } }}>
        <SplitBoxPane>
          <Text>Start</Text>
        </SplitBoxPane>
        <SplitBoxPane>
          <Text>End</Text>
        </SplitBoxPane>
      </SplitBox>,
    )

    expect(getByTestId('splitbox').style.getPropertyValue('--weave-splitbox-size')).toBe('12rem')

    rerender(
      <SplitBox size="14rem" viewProps={{ data: { testid: 'splitbox' } }}>
        <SplitBoxPane>
          <Text>Start</Text>
        </SplitBoxPane>
        <SplitBoxPane>
          <Text>End</Text>
        </SplitBoxPane>
      </SplitBox>,
    )

    expect(getByTestId('splitbox').style.getPropertyValue('--weave-splitbox-size')).toBe('14rem')
  })
})
