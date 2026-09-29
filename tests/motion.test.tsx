import { act, cleanup, render } from '@testing-library/react'
import { StrictMode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Button, Presence, ThemeProvider, View } from '../src'

afterEach(cleanup)

function motionRule(element: Element): string {
  const className = [...element.classList].find(
    (name) => name.startsWith('weave-motion-') && !name.startsWith('weave-motion-frames-'),
  )

  expect(className).toBeDefined()

  return (
    document.querySelector<HTMLStyleElement>(`style[data-weave-runtime-class="${className}"]`)
      ?.textContent ?? ''
  ).replace(/\s+/g, '')
}

function motionFramesRule(element: Element): string {
  const className = [...element.classList].find((name) => name.startsWith('weave-motion-frames-'))

  expect(className).toBeDefined()

  return (
    document.querySelector<HTMLStyleElement>(`style[data-weave-runtime-class="${className}"]`)
      ?.textContent ?? ''
  ).replace(/\s+/g, '')
}

describe('View motion', () => {
  it('maps transition duration tokens through theme variables', () => {
    const { getByTestId } = render(
      <View transition="fast" hover={{ scale: 1.03 }} data={{ testid: 'motion' }} />,
    )

    const element = getByTestId('motion')
    const rule = motionRule(element)

    expect(element.getAttribute('transition')).toBeNull()
    expect(rule).toContain('--weave-transition-property:all;')
    expect(rule).toContain('--weave-transition-duration:var(--weave-motion-duration-fast);')
    expect(rule).toContain('--weave-transition-timing-function:var(--weave-motion-curve-standard);')
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

    expect(rule).toContain('--weave-transition-property:opacity,background-color,transform;')
    expect(rule).toContain('--weave-transition-duration:240ms;')
    expect(rule).toContain('--weave-transition-delay:60ms;')
    expect(rule).toContain('--weave-transition-timing-function:cubic-bezier(0.22,1,0.36,1);')
  })

  it('uses a physical spring for CSS transitions', () => {
    const { getByTestId } = render(
      <View
        transition={{
          properties: ['transform'],
          spring: 'snappy',
        }}
        hover={{ scale: 1.08 }}
        data={{ testid: 'spring-transition' }}
      />,
    )

    const rule = motionRule(getByTestId('spring-transition'))
    expect(rule).toContain('--weave-transition-property:transform;')
    expect(rule).toMatch(/--weave-transition-duration:\d+ms;/)
    expect(rule).toContain('--weave-transition-timing-function:linear(')
    expect(rule).toContain('100%')
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
        <View transition="slow" hover={{ scale: 1.08 }} data={{ testid: 'reduced-motion' }} />
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
          <View transition="normal" data={{ testid: 'nested-motion' }} />
        </ThemeProvider>
      </ThemeProvider>,
    )

    const element = getByTestId('nested-motion')
    const scope = element.parentElement as HTMLElement
    const rule = motionRule(element)

    expect(scope.dataset.weaveReducedMotion).toBe('no-preference')
    expect(rule).toContain('--weave-transition-duration:var(--weave-motion-duration-normal);')
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

    expect(motionRule(getByTestId('zero-delay'))).toContain('--weave-transition-delay:0ms;')
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
      document.querySelector<HTMLStyleElement>('style[data-weave-view-styles]')?.textContent ?? ''
    const buttonStyles =
      document.querySelector<HTMLStyleElement>('style[data-weave-button-styles]')?.textContent ?? ''

    expect(rule).toContain('--weave-transition-property:opacity;')
    expect(rule).toContain('--weave-transition-duration:480ms;')
    expect(rule).toContain('--weave-transition-timing-function:var(--weave-motion-curve-linear);')
    expect(buttonStyles).toContain('--weave-component-transition-property')
    expect(viewStyles).toContain('transition-property: var(')
    expect(viewStyles).toContain('--weave-transition-property,')
    expect(viewStyles).toContain('--weave-component-transition-property, none')
  })

  it('keeps enter-from painted for one frame before switching to enter-to', () => {
    const frames: FrameRequestCallback[] = []
    const requestFrame = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        frames.push(callback)
        return frames.length
      })
    const cancelFrame = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})

    try {
      const { getByTestId } = render(<View enter="fade-up" data={{ testid: 'enter-view' }} />)

      const element = getByTestId('enter-view')
      const motionFrames = motionFramesRule(element)
      const transition = motionRule(element)

      expect(element.dataset.weaveMotionState).toBe('enter-from')
      expect(motionFrames).toContain('--weave-motion-enter-from-opacity:0;')
      expect(motionFrames).toContain('--weave-motion-enter-from-transform:translate(0rem,0.5rem);')
      expect(motionFrames).toContain('--weave-motion-enter-to-opacity:1;')
      expect(transition).toContain(
        '--weave-transition-timing-function:var(--weave-motion-curve-enter);',
      )
      expect(frames).toHaveLength(1)

      act(() => {
        frames.shift()?.(16)
      })
      expect(element.dataset.weaveMotionState).toBe('enter-from')
      expect(frames).toHaveLength(1)

      act(() => {
        frames.shift()?.(32)
      })
      expect(element.dataset.weaveMotionState).toBe('enter-to')
    } finally {
      requestFrame.mockRestore()
      cancelFrame.mockRestore()
    }
  })

  it('survives StrictMode effect replay without consuming enter', () => {
    const frames: FrameRequestCallback[] = []
    const requestFrame = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        frames.push(callback)
        return frames.length
      })
    const cancelFrame = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})

    try {
      const { getByTestId } = render(
        <StrictMode>
          <View enter="fade-up" data={{ testid: 'strict-enter' }} />
        </StrictMode>,
      )

      const element = getByTestId('strict-enter')
      expect(element.dataset.weaveMotionState).toBe('enter-from')
      expect(frames.length).toBeGreaterThanOrEqual(1)

      while (frames.length > 1) frames.shift()

      act(() => {
        frames.shift()?.(16)
      })
      expect(element.dataset.weaveMotionState).toBe('enter-from')
      expect(frames).toHaveLength(1)

      act(() => {
        frames.shift()?.(32)
      })
      expect(element.dataset.weaveMotionState).toBe('enter-to')
    } finally {
      requestFrame.mockRestore()
      cancelFrame.mockRestore()
    }
  })

  it('supports exact enter frame timing and curve configuration', () => {
    const { getByTestId } = render(
      <View
        enter={{
          from: {
            opacity: 0,
            translateY: 1,
            scale: 0.96,
          },
          to: {
            opacity: 1,
            translateY: 0,
            scale: 1,
          },
          duration: 260,
          delay: 40,
          curve: [0.22, 1, 0.36, 1],
        }}
        data={{ testid: 'exact-enter' }}
      />,
    )

    const element = getByTestId('exact-enter')
    const frames = motionFramesRule(element)
    const transition = motionRule(element)

    expect(frames).toContain('--weave-motion-enter-from-opacity:0;')
    expect(frames).toContain('--weave-motion-enter-from-transform:translate(0rem,1rem)scale(0.96);')
    expect(frames).toContain('--weave-motion-enter-to-opacity:1;')
    expect(transition).toContain('--weave-transition-duration:260ms;')
    expect(transition).toContain('--weave-transition-delay:40ms;')
    expect(transition).toContain('--weave-transition-timing-function:cubic-bezier(0.22,1,0.36,1);')
  })

  it('keeps Presence content mounted until exit completes', () => {
    vi.useFakeTimers()

    try {
      const { queryByTestId, rerender } = render(
        <Presence present>
          <View exit="fade-down" data={{ testid: 'presence-view' }} />
        </Presence>,
      )

      rerender(
        <Presence present={false}>
          <View exit="fade-down" data={{ testid: 'presence-view' }} />
        </Presence>,
      )

      const exiting = queryByTestId('presence-view')
      expect(exiting).not.toBeNull()
      expect(exiting?.dataset.weaveMotionState).toBe('exit-to')

      act(() => {
        vi.advanceTimersByTime(240)
      })
      expect(queryByTestId('presence-view')).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })

  it('reverses an in-flight Presence exit from the current visual state', () => {
    vi.useFakeTimers()

    try {
      const base = (
        <View enter="fade-up" exit="fade-down" data={{ testid: 'reversible-presence' }} />
      )
      const { queryByTestId, rerender } = render(
        <Presence present>
          <View exit="fade-down" data={{ testid: 'reversible-presence' }} />
        </Presence>,
      )

      rerender(<Presence present>{base}</Presence>)
      rerender(<Presence present={false}>{base}</Presence>)
      expect(queryByTestId('reversible-presence')?.dataset.weaveMotionState).toBe('exit-to')

      act(() => {
        vi.advanceTimersByTime(80)
      })
      rerender(<Presence present>{base}</Presence>)

      expect(queryByTestId('reversible-presence')).not.toBeNull()
      expect(queryByTestId('reversible-presence')?.dataset.weaveMotionState).toBe('enter-to')

      act(() => {
        vi.advanceTimersByTime(240)
      })
      expect(queryByTestId('reversible-presence')).not.toBeNull()
      expect(queryByTestId('reversible-presence')?.dataset.weaveMotionState).toBeUndefined()
    } finally {
      vi.useRealTimers()
    }
  })

  it('lets non-View components exit through viewProps inside Presence', () => {
    vi.useFakeTimers()

    try {
      const { queryByRole, rerender } = render(
        <Presence present>
          <Button text="Presence button" viewProps={{ exit: 'scale' }} />
        </Presence>,
      )

      rerender(
        <Presence present={false}>
          <Button text="Presence button" viewProps={{ exit: 'scale' }} />
        </Presence>,
      )

      expect(queryByRole('button', { name: 'Presence button' })).not.toBeNull()

      act(() => {
        vi.advanceTimersByTime(280)
      })

      expect(queryByRole('button', { name: 'Presence button' })).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })

  it('waits for every exiting host inside one Presence', () => {
    vi.useFakeTimers()

    try {
      const { queryByTestId, rerender } = render(
        <Presence present>
          <View
            exit={{
              to: { opacity: 0 },
              duration: 80,
            }}
            data={{ testid: 'short-exit' }}
          />
          <View
            exit={{
              to: { opacity: 0 },
              duration: 260,
            }}
            data={{ testid: 'long-exit' }}
          />
        </Presence>,
      )

      rerender(
        <Presence present={false}>
          <View
            exit={{
              to: { opacity: 0 },
              duration: 80,
            }}
            data={{ testid: 'short-exit' }}
          />
          <View
            exit={{
              to: { opacity: 0 },
              duration: 260,
            }}
            data={{ testid: 'long-exit' }}
          />
        </Presence>,
      )

      act(() => {
        vi.advanceTimersByTime(160)
      })
      expect(queryByTestId('short-exit')).not.toBeNull()
      expect(queryByTestId('long-exit')).not.toBeNull()

      act(() => {
        vi.advanceTimersByTime(180)
      })
      expect(queryByTestId('short-exit')).toBeNull()
      expect(queryByTestId('long-exit')).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })

  it('does not wait for exit when reduced motion is active', () => {
    const { queryByTestId, rerender } = render(
      <ThemeProvider reducedMotion="reduce">
        <Presence present>
          <View exit="fade" data={{ testid: 'reduced-exit' }} />
        </Presence>
      </ThemeProvider>,
    )

    rerender(
      <ThemeProvider reducedMotion="reduce">
        <Presence present={false}>
          <View exit="fade" data={{ testid: 'reduced-exit' }} />
        </Presence>
      </ThemeProvider>,
    )

    expect(queryByTestId('reduced-exit')).toBeNull()
  })

  it('registers motion variables as non-inheriting', () => {
    render(<View transition="fast" />)

    const viewStyles =
      document.querySelector<HTMLStyleElement>('style[data-weave-view-styles]')?.textContent ?? ''

    expect(viewStyles).toContain(
      '@property --weave-transition-property { syntax: "*"; inherits: false; }',
    )
    expect(viewStyles).toContain(
      '@property --weave-component-transition-property { syntax: "*"; inherits: false; }',
    )
  })
})
