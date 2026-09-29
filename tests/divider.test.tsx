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
  Divider,
  Row,
} from '../src'

afterEach(cleanup)

describe('Divider', () => {
  it('renders a horizontal separator by default and applies gap vertically', () => {
    const {
      getByRole,
    } = render(
      <Divider
        gap={0.5}
        size={2}
      />,
    )

    const divider =
      getByRole('separator')

    expect(
      divider.getAttribute(
        'aria-orientation',
      ),
    ).toBe('horizontal')
    expect(
      divider.getAttribute(
        'data-weave-divider-direction',
      ),
    ).toBe('horizontal')
    expect(
      divider.style.getPropertyValue(
        '--weave-divider-gap',
      ),
    ).toBe('0.5rem')
    expect(
      divider.style.getPropertyValue(
        '--weave-divider-thickness',
      ),
    ).toBe('2px')
  })

  it('supports a vertical direction and keeps the same gap contract on the horizontal axis', () => {
    const {
      getByRole,
    } = render(
      <Row height={4}>
        <Divider
          direction="vertical"
          gap={0.25}
          size={3}
        />
      </Row>,
    )

    const divider =
      getByRole('separator')

    expect(
      divider.getAttribute(
        'aria-orientation',
      ),
    ).toBe('vertical')
    expect(
      divider.getAttribute(
        'data-weave-divider-direction',
      ),
    ).toBe('vertical')
    expect(
      divider.style.getPropertyValue(
        '--weave-divider-gap',
      ),
    ).toBe('0.25rem')
    expect(
      divider.style.getPropertyValue(
        '--weave-divider-thickness',
      ),
    ).toBe('3px')

    const stylesheet =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-divider-styles]',
      )?.textContent ?? ''

    expect(stylesheet)
      .toContain(
        'data-weave-divider-direction="horizontal"',
      )
    expect(stylesheet)
      .toContain(
        'data-weave-divider-direction="vertical"',
      )
    expect(stylesheet)
      .toContain(
        'calc(var(--weave-divider-gap) * 2)',
      )
  })
})
