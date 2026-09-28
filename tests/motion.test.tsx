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
  Button,
  ThemeProvider,
  View,
} from '../src'

afterEach(cleanup)

function motionRule(element: Element): string {
  const className = [...element.classList].find((name) =>
    name.startsWith('weave-motion-'),
  )

  expect(className).toBeDefined()

  return (
    document.querySelector<HTMLStyleElement>(
      `style[data-weave-runtime-class="${className}"]`,
    )?.textContent ?? ''
  ).replace(/\s+/g, '')
}

describe('View motion', () => {
  it('maps transition duration tokens through theme variables', () => {
    const { getByTestId } = render(
      <View
        transition="fast"
        hover={{ scale: 1.03 }}
        data={{ testid: 'motion' }}
      />,
    )

    const element = getByTestId('motion')
    const rule = motionRule(element)

    expect(element.getAttribute('transition')).toBeNull()
    expect(rule).toContain('--weave-transition-property:all;')
    expect(rule).toContain(
      '--weave-transition-duration:var(--weave-motion-duration-fast);',
    )
    expect(rule).toContain(
      '--weave-transition-timing-function:var(--weave-motion-curve-standard);',
    )
    expect(rule).toContain('--weave-transition-delay:0ms;')
  })

  it('supports precise properties, numeric ms values, and cubic bezier curves', () => {
    const { getByTestId } = render(
      <View
        transition={{
          properties: ['opacity', 'backgroundColor', 'transform'],
          duration: 240,
          delay: 60,
          curve: [0.22, 1, 0.36, 1],
        }}
        data={{ testid: 'precise-motion' }}
      />,
    )

    const rule = motionRule(getByTestId('precise-motion'))

    expect(rule).toContain(
      '--weave-transition-property:opacity,background-color,transform;',
    )
    expect(rule).toContain('--weave-transition-duration:240ms;')
    expect(rule).toContain('--weave-transition-delay:60ms;')
    expect(rule).toContain(
      '--weave-transition-timing-function:cubic-bezier(0.22,1,0.36,1);',
    )
  })

  it('supports native CSS curves and steps', () => {
    const { getByTestId, rerender } = render(
      <View
        transition={{
          duration: 'normal',
          curve: 'linear(0, 0.4 30%, 1)',
        }}
        data={{ testid: 'curve-motion' }}
      />,
    )

    expect(motionRule(getByTestId('curve-motion'))).toContain(
      '--weave-transition-timing-function:linear(0,0.430%,1);',
    )

    rerender(
      <View
        transition={{
          duration: 'normal',
          curve: {
            steps: 6,
            position: 'end',
          },
        }}
        data={{ testid: 'curve-motion' }}
      />,
    )

    expect(motionRule(getByTestId('curve-motion'))).toContain(
      '--weave-transition-timing-function:steps(6,end);',
    )
  })

  it('disables framework transitions when reduced motion is forced', () => {
    const { getByTestId } = render(
      <ThemeProvider reducedMotion="reduce">
        <View
          transition="slow"
          hover={{ scale: 1.08 }}
          data={{ testid: 'reduced-motion' }}
        />
      </ThemeProvider>,
    )

    const element = getByTestId('reduced-motion')
    const scope = element.parentElement as HTMLElement
    const rule = motionRule(element)

    expect(scope.dataset.weaveReducedMotion).toBe('reduce')
    expect(element.dataset.weaveReducedMotion).toBe('reduce')
    expect(rule).toContain('--weave-transition-property:none;')
    expect(rule).toContain('--weave-transition-duration:0ms;')
    expect(rule).toContain('--weave-transition-delay:0ms;')
  })

  it('allows a nested provider to opt back into motion', () => {
    const { getByTestId } = render(
      <ThemeProvider reducedMotion="reduce">
        <ThemeProvider reducedMotion="no-preference">
          <View
            transition="normal"
            data={{ testid: 'nested-motion' }}
          />
        </ThemeProvider>
      </ThemeProvider>,
    )

    const element = getByTestId('nested-motion')
    const scope = element.parentElement as HTMLElement
    const rule = motionRule(element)

    expect(scope.dataset.weaveReducedMotion).toBe('no-preference')
    expect(rule).toContain(
      '--weave-transition-duration:var(--weave-motion-duration-normal);',
    )
    expect(element.dataset.weaveReducedMotion).toBe('no-preference')
    expect(rule).not.toContain('--weave-transition-property:none;')
  })

  it('defaults precise transition delay to zero', () => {
    const { getByTestId } = render(
      <View
        transition={{
          properties: ['opacity'],
          duration: 'fast',
        }}
        data={{ testid: 'zero-delay' }}
      />,
    )

    expect(motionRule(getByTestId('zero-delay'))).toContain(
      '--weave-transition-delay:0ms;',
    )
  })

  it('lets viewProps transition override component motion defaults', () => {
    const { getByRole } = render(
      <Button
        text="Motion button"
        viewProps={{
          transition: {
            properties: ['opacity'],
            duration: 480,
            curve: 'linear',
          },
        }}
      />,
    )

    const button = getByRole('button', {
      name: 'Motion button',
    })
    const rule = motionRule(button)
    const viewStyles =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-view-styles]',
      )?.textContent ?? ''
    const buttonStyles =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-button-styles]',
      )?.textContent ?? ''

    expect(rule).toContain('--weave-transition-property:opacity;')
    expect(rule).toContain('--weave-transition-duration:480ms;')
    expect(rule).toContain(
      '--weave-transition-timing-function:var(--weave-motion-curve-linear);',
    )
    expect(buttonStyles).toContain(
      '--weave-component-transition-property',
    )
    expect(viewStyles).toContain(
      'transition-property: var(',
    )
    expect(viewStyles).toContain(
      '--weave-transition-property,',
    )
    expect(viewStyles).toContain(
      '--weave-component-transition-property, none',
    )
  })

  it('registers motion variables as non-inheriting', () => {
    render(<View transition="fast" />)

    const viewStyles =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-view-styles]',
      )?.textContent ?? ''

    expect(viewStyles).toContain(
      '@property --weave-transition-property { syntax: "*"; inherits: false; }',
    )
    expect(viewStyles).toContain(
      '@property --weave-component-transition-property { syntax: "*"; inherits: false; }',
    )
  })
})
