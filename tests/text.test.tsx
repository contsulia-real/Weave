import { cleanup, render } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { Text } from '../src'

afterEach(cleanup)

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

    expect(element.tagName).toBe('SPAN')
    expect(element.getAttribute('size')).toBeNull()
    expect(element.getAttribute('weight')).toBeNull()

    expect(element.style.getPropertyValue('--weave-text-font-size')).toBe(
      'var(--weave-typography-size-large)',
    )
    expect(element.style.getPropertyValue('--weave-text-font-weight')).toBe(
      'var(--weave-typography-weight-bold)',
    )
    expect(element.style.getPropertyValue('--weave-text-line-height')).toBe(
      '1.5rem',
    )
    expect(
      element.style.getPropertyValue('--weave-text-letter-spacing'),
    ).toBe('0.02rem')
    expect(element.style.getPropertyValue('--weave-padding-top')).toBe('1rem')
    expect(element.style.getPropertyValue('--weave-color')).toContain(
      '--weave-color-primary',
    )
    expect(element.style.getPropertyValue('--weave-hover-color')).toContain(
      '--weave-color-danger',
    )
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
    const stylesheet = document.querySelector(
      'style[data-weave-text-styles]',
    )

    expect(element.style.getPropertyValue('--weave-text-font-size')).toBe(
      'var(--weave-typography-size-small)',
    )
    expect(element.style.getPropertyValue('--weave-text-md-font-size')).toBe(
      'var(--weave-typography-size-large)',
    )
    expect(element.style.getPropertyValue('--weave-md-color')).toContain(
      '--weave-color-success',
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

    expect(element.className).toBe('custom-text')
    expect(element.style.fontSize).toBe('13px')
    expect(element.style.getPropertyValue('--weave-text-font-size')).toBe(
      'var(--weave-typography-size-large)',
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
