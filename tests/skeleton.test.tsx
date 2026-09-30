import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { createTheme, Skeleton, ThemeProvider } from '../src'

afterEach(cleanup)

function runtimeRule(element: Element, prefix: string): string {
  const className = [...element.classList].find((name) => name.startsWith(prefix))
  expect(className).toBeDefined()

  return (
    document.querySelector<HTMLStyleElement>(`style[data-weave-runtime-class="${className}"]`)
      ?.textContent ?? ''
  ).replace(/\s+/g, '')
}

describe('Skeleton', () => {
  it('renders rect by default with themed shimmer variables', () => {
    const { getByTestId } = render(
      <Skeleton viewProps={{ width: 12, height: 4, data: { testid: 'skeleton' } }} />,
    )

    const skeleton = getByTestId('skeleton')
    expect(skeleton.getAttribute('data-weave-skeleton-shape')).toBe('rect')
    expect(skeleton.getAttribute('data-weave-reduced-motion')).toBe('no-preference')

    const themeRule = runtimeRule(skeleton, 'weave-skeleton-theme-')
    expect(themeRule).toContain(
      '--weave-skeleton-background:color-mix(insrgb,currentColor20%,transparent);',
    )
    expect(themeRule).toContain(
      '--weave-skeleton-highlight:color-mix(insrgb,currentColor32%,transparent);',
    )
    expect(themeRule).toContain('--weave-skeleton-radius:var(--weave-radius-medium);')
    expect(themeRule).toContain('--weave-skeleton-text-radius:var(--weave-radius-full);')
    expect(themeRule).toContain('--weave-skeleton-shimmer-duration:1280ms;')
  })

  it('exposes circle and text as explicit shapes', () => {
    const { getByTestId } = render(
      <>
        <Skeleton shape="circle" viewProps={{ width: 4, data: { testid: 'circle' } }} />
        <Skeleton shape="text" viewProps={{ width: 10, data: { testid: 'text' } }} />
      </>,
    )

    expect(getByTestId('circle').getAttribute('data-weave-skeleton-shape')).toBe('circle')
    expect(getByTestId('text').getAttribute('data-weave-skeleton-shape')).toBe('text')
  })

  it('uses the existing reduced-motion preference', () => {
    const { getByTestId } = render(
      <ThemeProvider reducedMotion="reduce">
        <Skeleton viewProps={{ width: 10, height: 2, data: { testid: 'reduced' } }} />
      </ThemeProvider>,
    )

    expect(getByTestId('reduced').getAttribute('data-weave-reduced-motion')).toBe('reduce')
  })

  it('resolves Skeleton theme customization', () => {
    const theme = createTheme({
      components: {
        Skeleton: {
          base: {
            background: 'primary',
            highlight: 'onPrimary',
            radius: 'large',
            textRadius: 'small',
            shimmerDuration: 900,
          },
        },
      },
    })

    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Skeleton viewProps={{ width: 10, height: 2, data: { testid: 'themed' } }} />
      </ThemeProvider>,
    )

    const rule = runtimeRule(getByTestId('themed'), 'weave-skeleton-theme-')
    expect(rule).toContain('--weave-skeleton-background:var(--weave-color-primary,primary);')
    expect(rule).toContain('--weave-skeleton-highlight:var(--weave-color-onPrimary,onPrimary);')
    expect(rule).toContain('--weave-skeleton-radius:var(--weave-radius-large);')
    expect(rule).toContain('--weave-skeleton-text-radius:var(--weave-radius-small);')
    expect(rule).toContain('--weave-skeleton-shimmer-duration:900ms;')
  })
})
