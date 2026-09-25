import { cleanup, render } from '@testing-library/react'
import { IconSettings } from '@tabler/icons-react'
import { afterEach, describe, expect, it } from 'vitest'
import { Icon, Text } from '../src'

afterEach(cleanup)

describe('Icon', () => {
  it('renders a directly imported Tabler icon component', () => {
    const { getByTestId } = render(
      <Icon
        icon={IconSettings}
        size="large"
        stroke="bold"
        viewProps={{
          data: {
            testid: 'tabler-icon',
          },
        }}
      />,
    )

    const element = getByTestId('tabler-icon')
    const svg = element.querySelector('svg')

    expect(element.tagName).toBe('SPAN')
    expect(element.className).toContain('weave-view')
    expect(element.className).toContain('weave-icon')
    expect(element.className).toContain('weave-icon--large')
    expect(element.className).toContain('weave-icon--stroke-bold')
    expect(element.getAttribute('data-weave-icon-size')).toBe('large')
    expect(element.getAttribute('data-weave-icon-stroke')).toBe('bold')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('width')).toBe('100%')
    expect(svg?.getAttribute('height')).toBe('100%')
    expect(svg?.getAttribute('stroke-width')).toBe('2.5')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders and normalizes a custom SVG node', () => {
    const { getByTestId } = render(
      <Icon
        svg={
          <svg viewBox="0 0 24 24">
            <path d="M4 12h16" />
          </svg>
        }
        size="small"
        stroke="thin"
        viewProps={{
          data: {
            testid: 'custom-svg-icon',
          },
        }}
      />,
    )

    const element = getByTestId('custom-svg-icon')
    const svg = element.querySelector('svg')

    expect(element.className).toContain('weave-icon--small')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24')
    expect(svg?.getAttribute('width')).toBe('100%')
    expect(svg?.getAttribute('height')).toBe('100%')
    expect(svg?.getAttribute('stroke-width')).toBe('1.5')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
    expect(svg?.getAttribute('focusable')).toBe('false')
  })

  it('uses a semantic wrapper only when accessibility is requested', () => {
    const { getByTestId, rerender } = render(
      <Icon
        icon={IconSettings}
        viewProps={{
          data: {
            testid: 'semantic-icon',
          },
        }}
      />,
    )

    const element = getByTestId('semantic-icon')

    expect(element.getAttribute('role')).toBeNull()
    expect(element.getAttribute('aria-label')).toBeNull()

    rerender(
      <Icon
        icon={IconSettings}
        viewProps={{
          label: 'Settings',
          data: {
            testid: 'semantic-icon',
          },
        }}
      />,
    )

    expect(element.getAttribute('role')).toBe('img')
    expect(element.getAttribute('aria-label')).toBe('Settings')
  })

  it('keeps viewProps className and style as the final escape hatches', () => {
    const { getByTestId } = render(
      <Icon
        icon={IconSettings}
        size="xlarge"
        viewProps={{
          width: 2,
          className: 'custom-icon',
          style: {
            width: '18px',
          },
          data: {
            testid: 'priority-icon',
          },
        }}
      />,
    )

    const element = getByTestId('priority-icon')

    expect(element.className).toContain('weave-icon--xlarge')
    expect(element.className).toContain('custom-icon')
    expect(element.style.width).toBe('18px')

    const stylesheet = document.querySelector(
      'style[data-weave-icon-styles]',
    )

    expect(stylesheet?.textContent).toContain(
      '--weave-component-width: 1.5rem',
    )
  })

  it('stays valid when nested inside Text', () => {
    const { container } = render(
      <Text>
        Settings
        <Icon icon={IconSettings} />
      </Text>,
    )

    const text = container.querySelector('[data-weave-text]')
    const icon = container.querySelector('[data-weave-icon]')

    expect(text?.contains(icon)).toBe(true)
    expect(icon?.tagName).toBe('SPAN')
    expect(icon?.querySelector('svg')).not.toBeNull()
  })
})
