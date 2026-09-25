import { cleanup, render } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { Text } from '../src'

afterEach(cleanup)

function runtimeRule(
  element: Element,
  prefix: string,
): string {
  const className = [...element.classList].find((name) =>
    name.startsWith(prefix),
  )

  expect(className).toBeDefined()

  return (
    document.querySelector<HTMLStyleElement>(
      `style[data-weave-runtime-class="${className}"]`,
    )?.textContent ?? ''
  ).replace(/\s+/g, '')
}

describe('Text', () => {
  it('renders a span and maps text semantics without leaking props', () => {
    const { getByTestId } = render(
      <Text
        size="large"
        weight="bold"
        color="primary"
        align="center"
        lineHeight={1.5}
        letterSpacing={0.02}
        wrap="balance"
        case="uppercase"
        viewProps={{
          padding: 1,
          hover: {
            color: 'danger',
          },
          data: {
            testid: 'text',
          },
        }}
      >
        Hello
      </Text>,
    )

    const element = getByTestId('text')
    const textRule = runtimeRule(element, 'weave-text-props-')
    const viewRule = runtimeRule(element, 'weave-props-')

    expect(element.tagName).toBe('SPAN')
    expect(element.className).toContain('weave-view')
    expect(element.className).toContain('weave-text')
    expect(element.getAttribute('size')).toBeNull()
    expect(element.getAttribute('weight')).toBeNull()

    expect(textRule).toContain(
      '--weave-text-font-size:var(--weave-typography-size-large);',
    )
    expect(textRule).toContain(
      '--weave-text-font-weight:var(--weave-typography-weight-bold);',
    )
    expect(textRule).toContain('--weave-text-line-height:1.5rem;')
    expect(textRule).toContain('--weave-text-letter-spacing:0.02rem;')
    expect(viewRule).toContain('--weave-padding-top:1rem;')
    expect(viewRule).toContain('--weave-color:var(--weave-color-primary')
    expect(viewRule).toContain(
      '--weave-hover-color:var(--weave-color-danger',
    )
    expect(element.style.getPropertyValue('--weave-text-font-size')).toBe('')
  })

  it('encodes responsive text semantics at the default breakpoints', () => {
    const { getByTestId } = render(
      <Text
        size="small"
        md={{
          size: 'large',
          color: 'success',
          overflow: 'ellipsis',
          maxLines: 2,
        }}
        viewProps={{
          data: {
            testid: 'responsive-text',
          },
        }}
      >
        Responsive
      </Text>,
    )

    const element = getByTestId('responsive-text')
    const textRule = runtimeRule(element, 'weave-text-props-')
    const viewRule = runtimeRule(element, 'weave-props-')
    const stylesheet = document.querySelector(
      'style[data-weave-text-styles]',
    )

    expect(textRule).toContain(
      '--weave-text-font-size:var(--weave-typography-size-small);',
    )
    expect(textRule).toContain(
      '--weave-text-md-font-size:var(--weave-typography-size-large);',
    )
    expect(viewRule).toContain(
      '--weave-md-color:var(--weave-color-success',
    )
    expect(element.getAttribute('data-weave-text-md-overflow')).toBe(
      'ellipsis',
    )
    expect(element.getAttribute('data-weave-text-md-max-lines')).toBe('2')
    expect(stylesheet?.textContent).toContain('@media (min-width: 48rem)')
  })

  it('keeps viewProps className and style as the escape hatches', () => {
    const { getByTestId } = render(
      <Text
        size="large"
        viewProps={{
          className: 'custom-text',
          style: {
            fontSize: '13px',
          },
          data: {
            testid: 'priority-text',
          },
        }}
      >
        Priority
      </Text>,
    )

    const element = getByTestId('priority-text')
    const textRule = runtimeRule(element, 'weave-text-props-')

    expect(element.className).toContain('weave-text')
    expect(element.className).toContain('custom-text')
    expect(element.style.fontSize).toBe('13px')
    expect(element.getAttribute('style')).toContain('font-size: 13px')
    expect(textRule).toContain(
      '--weave-text-font-size:var(--weave-typography-size-large);',
    )
  })

  it('exposes the real span through viewProps.ref', () => {
    const ref = createRef<HTMLSpanElement>()

    render(
      <Text viewProps={{ ref }}>
        Ref
      </Text>,
    )

    expect(ref.current?.tagName).toBe('SPAN')
  })

  it('supports nested Text using valid inline DOM structure', () => {
    const { container } = render(
      <Text color="secondary">
        Status:
        <Text color="success" weight="bold">
          OK
        </Text>
      </Text>,
    )

    const spans = container.querySelectorAll('span[data-weave-text]')

    expect(spans).toHaveLength(2)
    expect(spans[0]?.contains(spans[1] ?? null)).toBe(true)
  })
})
