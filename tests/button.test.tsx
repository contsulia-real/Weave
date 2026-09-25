import { cleanup, fireEvent, render } from '@testing-library/react'
import { IconPlus } from '@tabler/icons-react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  Button,
  Text,
  ThemeProvider,
  createTheme,
} from '../src'

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

function breakpointStyles(element: Element): string {
  const className = [...element.classList].find((name) =>
    name.startsWith('weave-breakpoints-'),
  )

  expect(className).toBeDefined()

  return (
    document.querySelector<HTMLStyleElement>(
      `style[data-weave-breakpoint-styles="${className}"]`,
    )?.textContent ?? ''
  ).replace(/\s+/g, '')
}

describe('Button', () => {
  it('renders a real button and forwards click behavior through viewProps', () => {
    const onClick = vi.fn()

    const { getByRole } = render(
      <Button
        text="Save"
        viewProps={{
          onClick,
        }}
      />,
    )

    const element = getByRole('button', { name: 'Save' })

    expect(element.tagName).toBe('BUTTON')
    expect(element.getAttribute('type')).toBe('button')
    expect(element.className).toContain('weave-view')
    expect(element.className).toContain('weave-button')
    expect(element.className).toContain('weave-button--primary')
    expect(element.className).toContain('weave-button--medium')

    fireEvent.click(element)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders imported Tabler icons and custom SVG icons', () => {
    const { getByTestId } = render(
      <>
        <Button
          text="Add"
          icon={IconPlus}
          iconPosition="start"
          viewProps={{
            data: {
              testid: 'tabler-button',
            },
          }}
        />

        <Button
          text="Custom"
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M4 12h16" />
            </svg>
          }
          iconPosition="end"
          viewProps={{
            data: {
              testid: 'svg-button',
            },
          }}
        />
      </>,
    )

    const tabler = getByTestId('tabler-button')
    const custom = getByTestId('svg-button')

    expect(tabler.querySelector('.tabler-icon-plus')).not.toBeNull()
    expect(custom.querySelector('svg[viewBox="0 0 24 24"]')).not.toBeNull()

    const tablerContent = tabler.querySelector('.weave-button__content')
    const customContent = custom.querySelector('.weave-button__content')

    expect(tablerContent?.firstElementChild?.matches('[data-weave-icon]')).toBe(
      true,
    )
    expect(customContent?.lastElementChild?.matches('[data-weave-icon]')).toBe(
      true,
    )
  })

  it('gives icon-only buttons square control geometry', () => {
    const { getByRole } = render(
      <Button
        icon={IconPlus}
        variant="secondary"
        viewProps={{
          label: 'Add',
        }}
      />,
    )

    const element = getByRole('button', { name: 'Add' })
    const stylesheet = document.querySelector(
      'style[data-weave-button-styles]',
    )?.textContent ?? ''

    expect(element.className).toContain('weave-button--icon-only')
    expect(stylesheet).toContain(
      '--weave-component-min-width: var(--weave-button-min-height)',
    )
    expect(stylesheet).toContain(
      '--weave-component-padding-left: 0',
    )
    expect(stylesheet).toContain(
      '--weave-component-padding-right: 0',
    )
  })

  it('keeps custom children as the complete content entry', () => {
    const { getByRole } = render(
      <Button>
        <Text weight="bold">Custom content</Text>
      </Button>,
    )

    const element = getByRole('button', { name: 'Custom content' })

    expect(element.querySelector('[data-weave-text]')).not.toBeNull()
    expect(element.textContent).toContain('Custom content')
  })

  it('disables natively while loading without removing its content', () => {
    const onClick = vi.fn()

    const { getByRole } = render(
      <Button
        text="Submit"
        loading
        viewProps={{
          onClick,
        }}
      />,
    )

    const element = getByRole('button', { name: 'Submit' }) as HTMLButtonElement

    expect(element.disabled).toBe(true)
    expect(element.getAttribute('aria-disabled')).toBe('true')
    expect(element.getAttribute('aria-busy')).toBe('true')
    expect(element.className).toContain('weave-button--loading')
    expect(element.textContent).toContain('Submit')
    expect(element.querySelector('.weave-button__spinner')).not.toBeNull()

    fireEvent.click(element)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('maps viewProps disabled to both native and aria disabled state', () => {
    const { getByRole } = render(
      <Button
        text="Disabled"
        viewProps={{
          disabled: true,
        }}
      />,
    )

    const element = getByRole('button', {
      name: 'Disabled',
    }) as HTMLButtonElement

    expect(element.disabled).toBe(true)
    expect(element.getAttribute('aria-disabled')).toBe('true')
  })

  it('keeps viewProps className and style as the final escape hatches', () => {
    const { getByRole } = render(
      <Button
        text="Priority"
        variant="secondary"
        size="large"
        viewProps={{
          className: 'custom-button',
          width: 12,
          style: {
            width: '140px',
          },
        }}
      />,
    )

    const element = getByRole('button', { name: 'Priority' })
    const propsRule = runtimeRule(element, 'weave-props-')

    expect(element.className).toContain('weave-button--secondary')
    expect(element.className).toContain('weave-button--large')
    expect(element.className).toContain('custom-button')
    expect(propsRule).toContain('--weave-width:12rem;')
    expect(element.style.width).toBe('140px')
  })

  it('keeps user state styles above Button component state defaults', () => {
    const { getByRole } = render(
      <Button
        text="States"
        viewProps={{
          hover: {
            background: 'success',
          },
          focusVisible: {
            outlineColor: 'danger',
          },
          disabledStyle: {
            opacity: 0.25,
          },
        }}
      />,
    )

    const element = getByRole('button', { name: 'States' })
    const propsRule = runtimeRule(element, 'weave-props-')
    const stylesheet = document.querySelector(
      'style[data-weave-button-styles]',
    )?.textContent ?? ''

    expect(propsRule).toContain(
      '--weave-hover-background:var(--weave-color-success',
    )
    expect(propsRule).toContain(
      '--weave-focus-visible-outline-color:var(--weave-color-danger',
    )
    expect(propsRule).toContain('--weave-disabled-opacity:0.25;')

    expect(stylesheet).toContain(
      '--weave-component-background: var(--weave-button-hover-background)',
    )
    expect(stylesheet).not.toContain(
      '--weave-hover-background: var(--weave-button-theme-',
    )
  })

  it('uses global feedback tokens for tactile press behavior', () => {
    render(<Button text="Press me" />)

    const stylesheet = document.querySelector(
      'style[data-weave-button-styles]',
    )?.textContent ?? ''

    expect(stylesheet).toContain(
      '--weave-feedback-rest-depth',
    )
    expect(stylesheet).toContain(
      '--weave-feedback-hover-lift',
    )
    expect(stylesheet).toContain(
      '--weave-feedback-press-offset',
    )
    expect(stylesheet).toContain(
      '--weave-feedback-press-scale',
    )
    expect(stylesheet).toContain(
      'var(--weave-motion-curve-spring)',
    )
    expect(stylesheet).toContain(
      ':where(.weave-button:active:not([aria-disabled="true"]))',
    )
  })

  it('takes visual defaults from the Button component theme', () => {
    const { getByRole } = render(
      <Button
        text="Theme"
        variant="primary"
        size="medium"
      />,
    )

    const element = getByRole('button', { name: 'Theme' })
    const rule = runtimeRule(element, 'weave-button-theme-')

    expect(rule).toContain(
      '--weave-button-theme-medium-min-height:2.125rem;',
    )
    expect(rule).toContain(
      '--weave-button-theme-primary-background:var(--weave-color-primary',
    )
    expect(rule).toContain(
      '--weave-button-theme-radius:0.75rem;',
    )
  })

  it('uses the redesigned three-step Button size scale', () => {
    const { getByRole, rerender } = render(
      <Button text="Sized" size="small" />,
    )

    let rule = runtimeRule(
      getByRole('button', { name: 'Sized' }),
      'weave-button-theme-',
    )

    expect(rule).toContain(
      '--weave-button-theme-small-min-height:1.75rem;',
    )
    expect(rule).toContain(
      '--weave-button-theme-small-font-size:var(--weave-typography-size-compact);',
    )

    rerender(<Button text="Sized" size="large" />)

    rule = runtimeRule(
      getByRole('button', { name: 'Sized' }),
      'weave-button-theme-',
    )

    expect(rule).toContain(
      '--weave-button-theme-large-min-height:2.5rem;',
    )
    expect(rule).toContain(
      '--weave-button-theme-large-font-size:var(--weave-typography-size-medium);',
    )
  })

  it('lets ThemeProvider override Button size and variant visuals', () => {
    const theme = createTheme({
      components: {
        Button: {
          sizes: {
            medium: {
              minHeight: 4,
              paddingX: 2,
            },
          },
          variants: {
            primary: {
              background: 'success',
            },
          },
        },
      },
    })

    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <Button text="Themed" />
      </ThemeProvider>,
    )

    const rule = runtimeRule(
      getByRole('button', { name: 'Themed' }),
      'weave-button-theme-',
    )

    expect(rule).toContain(
      '--weave-button-theme-medium-min-height:4rem;',
    )
    expect(rule).toContain(
      '--weave-button-theme-medium-padding-x:2rem;',
    )
    expect(rule).toContain(
      '--weave-button-theme-primary-background:var(--weave-color-success',
    )
  })

  it('uses active ThemeProvider breakpoint names for responsive size and variant', () => {
    const theme = createTheme({
      breakpoints: {
        compact: 36,
      },
    })

    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <Button
          text="Responsive"
          size="small"
          variant="secondary"
          compact={{
            size: 'large',
            variant: 'danger',
          }}
        />
      </ThemeProvider>,
    )

    const element = getByRole('button', { name: 'Responsive' })
    const styles = breakpointStyles(element)

    expect(
      element.getAttribute('data-weave-button-compact-size'),
    ).toBe('large')
    expect(
      element.getAttribute('data-weave-button-compact-variant'),
    ).toBe('danger')
    expect(styles).toContain('@media(min-width:36rem)')
    expect(styles).toContain(
      '[data-weave-button-compact-size="large"]',
    )
    expect(styles).toContain(
      '[data-weave-button-compact-variant="danger"]',
    )
  })

  it('uses the global tactile feedback language for press and release', () => {
    render(<Button text="Tactile" />)

    const stylesheet = document.querySelector(
      'style[data-weave-button-styles]',
    )?.textContent ?? ''

    expect(stylesheet).toContain(
      'var(--weave-feedback-rest-depth)',
    )
    expect(stylesheet).toContain(
      'var(--weave-feedback-hover-lift)',
    )
    expect(stylesheet).toContain(
      'var(--weave-feedback-press-offset)',
    )
    expect(stylesheet).toContain(
      'var(--weave-feedback-press-scale)',
    )
    expect(stylesheet).toContain(
      'var(--weave-motion-curve-spring)',
    )
  })

  it('installs reduced-motion handling for the loading spinner', () => {
    render(<Button text="Loading" loading />)

    const stylesheet = document.querySelector(
      'style[data-weave-button-styles]',
    )

    expect(stylesheet?.textContent).toContain(
      '@media (prefers-reduced-motion: reduce)',
    )
  })
})
