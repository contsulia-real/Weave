import { StrictMode } from 'react'
import {
  cleanup,
  render,
} from '@testing-library/react'
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  ThemeProvider,
  View,
} from '../src'

function installAnimationStub() {
  const animate = vi.fn(() => ({
    cancel: vi.fn(),
    onfinish: null,
  }) as unknown as Animation)

  Object.defineProperty(HTMLElement.prototype, 'animate', {
    configurable: true,
    writable: true,
    value: animate,
  })
  return animate
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  delete (HTMLElement.prototype as Partial<HTMLElement>).animate
})

describe('enter stagger orchestration', () => {
  it('stagger direct ViewHost children from first to last', () => {
    const animate = installAnimationStub()

    render(
      <View
        enter={{
          animation: 'fade-up',
          children: {
            stagger: 50,
            delay: 100,
          },
          duration: 200,
        }}
      >
        <View />
        <View />
        <View />
      </View>,
    )

    expect(animate).toHaveBeenCalledTimes(3)
    expect(animate.mock.calls.map((call) => call[1])).toEqual([
      expect.objectContaining({ delay: 100 }),
      expect.objectContaining({ delay: 150 }),
      expect.objectContaining({ delay: 200 }),
    ])
  })

  it('supports last and center stagger origins', () => {
    const animate = installAnimationStub()
    const { unmount } = render(
      <View
        enter={{
          animation: 'fade',
          children: { stagger: 40, from: 'last' },
        }}
      >
        <View />
        <View />
        <View />
      </View>,
    )

    expect(animate.mock.calls.map((call) => call[1]?.delay)).toEqual([
      80,
      40,
      0,
    ])
    unmount()

    const center = installAnimationStub()
    render(
      <View
        enter={{
          animation: 'fade',
          children: { stagger: 40, from: 'center' },
        }}
      >
        <View />
        <View />
        <View />
      </View>,
    )

    expect(center.mock.calls.map((call) => call[1]?.delay)).toEqual([
      40,
      0,
      40,
    ])
  })

  it('uses spring timing for the staggered child sequence', () => {
    const animate = installAnimationStub()

    render(
      <View
        enter={{
          animation: 'scale',
          spring: 'snappy',
          stagger: 30,
        }}
      >
        <View />
        <View />
      </View>,
    )

    const options = animate.mock.calls[0][1] as KeyframeAnimationOptions
    expect(options.duration).toBeGreaterThan(100)
    expect(options.easing).toMatch(/^linear\(/)
    expect(animate.mock.calls[1][1]).toMatchObject({ delay: 30 })
  })

  it('does not duplicate child animations under StrictMode effect replay', () => {
    const animate = installAnimationStub()

    render(
      <StrictMode>
        <View
          enter={{
            animation: 'fade-up',
            stagger: 25,
          }}
        >
          <View />
          <View />
          <View />
        </View>
      </StrictMode>,
    )

    expect(animate).toHaveBeenCalledTimes(3)
  })

  it('skips stagger orchestration under reduced motion', () => {
    const animate = installAnimationStub()

    render(
      <ThemeProvider reducedMotion="reduce">
        <View
          enter={{
            animation: 'fade-up',
            stagger: 25,
          }}
        >
          <View />
          <View />
        </View>
      </ThemeProvider>,
    )

    expect(animate).not.toHaveBeenCalled()
  })
})
