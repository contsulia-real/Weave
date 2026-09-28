import {
  cleanup,
  render,
} from '@testing-library/react'
import {
  afterEach,
  describe,
  expect,
  it,
} from 'vitest'
import {
  Absolute,
  Column,
  Flex,
  Grid,
  Row,
  Stack,
} from '../src'

afterEach(cleanup)

function runtimeRule(
  element: Element,
): string {
  const className = [...element.classList].find((name) =>
    name.startsWith('weave-props-'),
  )

  expect(className).toBeDefined()

  return (
    document.querySelector<HTMLStyleElement>(
      `style[data-weave-runtime-class="${className}"]`,
    )?.textContent ?? ''
  ).replace(/\s+/g, '')
}

describe('formal layout components', () => {
  it('maps Flex directly onto the View flex layout without an extra wrapper', () => {
    const { getByTestId } = render(
      <Flex
        direction="row-reverse"
        gap={1}
        data={{ testid: 'flex' }}
      >
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

  it('gives Row and Column fixed semantic directions', () => {
    const { getByTestId } = render(
      <>
        <Row data={{ testid: 'row' }} />
        <Column data={{ testid: 'column' }} />
      </>,
    )

    const row = getByTestId('row')
    const column = getByTestId('column')

    expect(row.dataset.weaveLayout).toBe('flex')
    expect(column.dataset.weaveLayout).toBe('flex')
    expect(runtimeRule(row)).toContain(
      '--weave-flex-direction:row;',
    )
    expect(runtimeRule(column)).toContain(
      '--weave-flex-direction:column;',
    )
  })

  it('maps Grid, Stack, and Absolute to the existing View layout engine', () => {
    const { getByTestId } = render(
      <>
        <Grid
          columns={3}
          data={{ testid: 'grid' }}
        />
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
    expect(runtimeRule(grid)).toContain(
      '--weave-grid-template-columns:repeat(3,minmax(0,1fr));',
    )
    expect(runtimeRule(absolute)).toContain(
      '--weave-position:relative;',
    )
  })

  it('keeps Stack as a full-size stacking plane and maps justify to item alignment', () => {
    const { getByTestId } = render(
      <Stack
        width={8}
        height={4}
        align="center"
        justify="center"
        data={{ testid: 'stack-plane' }}
      >
        <div data-testid="stack-background" />
        <span data-testid="stack-label">Stack</span>
      </Stack>,
    )

    const stack = getByTestId('stack-plane')
    const rule = runtimeRule(stack)
    const stylesheet =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-view-styles]',
      )?.textContent ?? ''

    expect(rule).toContain('--weave-width:8rem;')
    expect(rule).toContain('--weave-height:4rem;')
    expect(rule).toContain('--weave-align-items:center;')
    expect(rule).toContain('--weave-justify-content:center;')

    expect(stylesheet).toContain(
      'grid-template-columns: minmax(0, 1fr);',
    )
    expect(stylesheet).toContain(
      'grid-template-rows: minmax(0, 1fr);',
    )
    expect(stylesheet).toContain('justify-content: stretch;')
    expect(stylesheet).toContain('justify-items: var(')
    expect(stylesheet).toContain(
      '--weave-justify-content,',
    )
    expect(stylesheet).toContain('grid-area: 1 / 1;')

    expect(getByTestId('stack-background').parentElement).toBe(
      stack,
    )
    expect(getByTestId('stack-label').parentElement).toBe(stack)
  })

  it('keeps responsive View layout styles available through Flex', () => {
    const { getByTestId } = render(
      <Flex
        direction="column"
        md={{ direction: 'row' }}
        data={{ testid: 'responsive-flex' }}
      />,
    )

    const element = getByTestId('responsive-flex')
    expect(element.dataset.weaveLayout).toBe('flex')

    const breakpointClass = [...element.classList].find((name) =>
      name.startsWith('weave-breakpoints-'),
    )
    expect(breakpointClass).toBeDefined()
  })
})
