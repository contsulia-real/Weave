import { cleanup, render } from '@testing-library/react'
import { StrictMode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider, View } from '../src'

interface FakeAnimation extends Animation {
  cancel: ReturnType<typeof vi.fn>
  finish: ReturnType<typeof vi.fn>
  onfinish: ((this: Animation, ev: AnimationPlaybackEvent) => unknown) | null
  playState: AnimationPlayState
}

function installAnimationStub() {
  const animations: FakeAnimation[] = []
  const animate = vi.fn(
    (
      _keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
      _options?: number | KeyframeAnimationOptions,
    ) => {
      const animation = {
        cancel: vi.fn(),
        finish: vi.fn(),
        onfinish: null,
        playState: 'running' as AnimationPlayState,
      } as unknown as FakeAnimation
      animations.push(animation)
      return animation
    },
  )

  Object.defineProperty(HTMLElement.prototype, 'animate', {
    configurable: true,
    writable: true,
    value: animate,
  })

  return { animate, animations }
}

function finish(animation: FakeAnimation) {
  animation.playState = 'finished'
  animation.onfinish?.call(animation, {} as AnimationPlaybackEvent)
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  delete (HTMLElement.prototype as Partial<HTMLElement>).animate
  vi.useRealTimers()
})

describe('View keyframe animation', () => {
  it('maps MotionStyle keyframes and explicit at offsets into WAAPI', () => {
    const { animate } = installAnimationStub()

    const { getByTestId } = render(
      <View
        animation={{
          keyframes: [
            { at: 0, scale: 1, opacity: 1 },
            { at: 0.5, scale: 1.08, opacity: 0.8 },
            { at: 1, scale: 1, opacity: 1 },
          ],
          duration: 600,
          curve: 'standard',
        }}
        data={{ testid: 'animated' }}
      />,
    )

    expect(getByTestId('animated').getAttribute('animation')).toBeNull()
    expect(animate).toHaveBeenCalledTimes(1)
    const [frames, options] = animate.mock.calls[0]
    expect(frames).toEqual([
      expect.objectContaining({
        offset: 0,
        opacity: 1,
        transform: 'scale(1)',
      }),
      expect.objectContaining({
        offset: 0.5,
        opacity: 0.8,
        transform: 'scale(1.08)',
      }),
      expect.objectContaining({
        offset: 1,
        opacity: 1,
        transform: 'scale(1)',
      }),
    ])
    expect(options).toMatchObject({
      duration: 600,
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
      direction: 'normal',
      fill: 'both',
    })
  })

  it('loads structured animation presets from the active theme', () => {
    const { animate } = installAnimationStub()

    render(<View animation="pulse" />)

    expect(animate).toHaveBeenCalledTimes(1)
    expect(animate.mock.calls[0][1]).toMatchObject({
      duration: 600,
    })
    expect(animate.mock.calls[0][0]).toHaveLength(3)
  })

  it('uses a solved physical spring instead of a cubic bezier', () => {
    const { animate } = installAnimationStub()

    render(
      <View
        animation={{
          keyframes: [{ scale: 0.8 }, { scale: 1 }],
          spring: 'snappy',
        }}
      />,
    )

    const options = animate.mock.calls[0][1] as KeyframeAnimationOptions
    expect(options.duration).toBeGreaterThan(100)
    expect(options.easing).toMatch(/^linear\(/)
    expect(options.easing).toContain('100%')
  })

  it('repeats with repeatDelay and alternates direction per cycle', () => {
    vi.useFakeTimers()
    const { animate, animations } = installAnimationStub()

    render(
      <View
        animation={{
          keyframes: [{ opacity: 0 }, { opacity: 1 }],
          duration: 100,
          repeat: 2,
          repeatDelay: 80,
          direction: 'alternate',
        }}
      />,
    )

    expect(animate).toHaveBeenCalledTimes(1)
    expect(animate.mock.calls[0][1]).toMatchObject({ direction: 'normal' })

    finish(animations[0])
    expect(animate).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(79)
    expect(animate).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(1)
    expect(animate).toHaveBeenCalledTimes(2)
    expect(animate.mock.calls[1][1]).toMatchObject({ direction: 'reverse' })

    finish(animations[1])
    vi.advanceTimersByTime(80)
    expect(animate).toHaveBeenCalledTimes(3)
    expect(animate.mock.calls[2][1]).toMatchObject({ direction: 'normal' })

    finish(animations[2])
    vi.advanceTimersByTime(1000)
    expect(animate).toHaveBeenCalledTimes(3)
  })

  it('restarts keyframes and repeat after StrictMode effect replay', () => {
    const { animate, animations } = installAnimationStub()

    render(
      <StrictMode>
        <View
          animation={{
            keyframes: [{ opacity: 0 }, { opacity: 1 }],
            duration: 100,
            repeat: 1,
            direction: 'alternate',
          }}
        />
      </StrictMode>,
    )

    expect(animate).toHaveBeenCalledTimes(2)
    expect(animations[0]?.cancel).toHaveBeenCalledTimes(1)
    expect(animations[1]?.cancel).not.toHaveBeenCalled()

    finish(animations[1]!)

    expect(animate).toHaveBeenCalledTimes(3)
    expect(animate.mock.calls[2]?.[1]).toMatchObject({ direction: 'reverse' })
  })

  it('supports reverse and alternate-reverse direction', () => {
    const first = installAnimationStub()
    const { unmount } = render(
      <View
        animation={{
          keyframes: [{ opacity: 0 }, { opacity: 1 }],
          duration: 100,
          direction: 'reverse',
        }}
      />,
    )
    expect(first.animate.mock.calls[0][1]).toMatchObject({
      direction: 'reverse',
    })
    unmount()

    const second = installAnimationStub()
    render(
      <View
        animation={{
          keyframes: [{ opacity: 0 }, { opacity: 1 }],
          duration: 100,
          repeat: 1,
          direction: 'alternate-reverse',
        }}
      />,
    )
    expect(second.animate.mock.calls[0][1]).toMatchObject({
      direction: 'reverse',
    })
    finish(second.animations[0])
    expect(second.animate.mock.calls[1][1]).toMatchObject({
      direction: 'normal',
    })
  })

  it('keeps infinite repeat running beyond arbitrary cycle counts', () => {
    const { animate, animations } = installAnimationStub()

    render(
      <View
        animation={{
          keyframes: [{ opacity: 0.5 }, { opacity: 1 }],
          duration: 100,
          repeat: 'infinite',
        }}
      />,
    )

    for (let index = 0; index < 4; index += 1) {
      finish(animations[index])
    }
    expect(animate).toHaveBeenCalledTimes(5)
  })

  it('continues an interrupted animation from the current computed visual value', () => {
    const { animate, animations } = installAnimationStub()
    const computed = vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      opacity: '0.42',
      backgroundColor: 'rgb(1, 2, 3)',
      color: 'rgb(4, 5, 6)',
      transform: 'matrix(1, 0, 0, 1, 18, 0)',
      filter: 'none',
    } as CSSStyleDeclaration)

    const { rerender } = render(
      <View
        animation={{
          keyframes: [{ opacity: 1 }, { opacity: 0 }],
          duration: 1000,
        }}
      />,
    )

    rerender(
      <View
        animation={{
          keyframes: [{ opacity: 0 }, { opacity: 1 }],
          duration: 400,
          interruption: 'continue',
        }}
      />,
    )

    expect(computed).toHaveBeenCalled()
    expect(animations[0].cancel).toHaveBeenCalled()
    expect(animate).toHaveBeenCalledTimes(2)
    expect(animate.mock.calls[1][0]).toEqual([
      expect.objectContaining({ offset: 0, opacity: '0.42' }),
      expect.objectContaining({ offset: 1, opacity: 1 }),
    ])
  })

  it('restarts from the declared new keyframe start when requested', () => {
    const { animate, animations } = installAnimationStub()
    const { rerender } = render(
      <View
        animation={{
          keyframes: [{ opacity: 1 }, { opacity: 0 }],
          duration: 1000,
        }}
      />,
    )

    rerender(
      <View
        animation={{
          keyframes: [{ opacity: 0.2 }, { opacity: 0.9 }],
          duration: 400,
          interruption: 'restart',
        }}
      />,
    )

    expect(animations[0].cancel).toHaveBeenCalled()
    expect(animate.mock.calls[1][0]).toEqual([
      expect.objectContaining({ opacity: 0.2 }),
      expect.objectContaining({ opacity: 0.9 }),
    ])
  })

  it('finishes the current cycle before starting only the latest pending target', () => {
    const { animate, animations } = installAnimationStub()
    const { rerender } = render(
      <View
        animation={{
          keyframes: [{ opacity: 0 }, { opacity: 1 }],
          duration: 1000,
        }}
      />,
    )

    rerender(
      <View
        animation={{
          keyframes: [{ opacity: 1 }, { opacity: 0.5 }],
          duration: 500,
          interruption: 'finish',
        }}
      />,
    )
    rerender(
      <View
        animation={{
          keyframes: [{ opacity: 0.7 }, { opacity: 0.2 }],
          duration: 300,
          interruption: 'finish',
        }}
      />,
    )

    expect(animate).toHaveBeenCalledTimes(1)
    finish(animations[0])
    expect(animate).toHaveBeenCalledTimes(2)
    expect(animate.mock.calls[1][0]).toEqual([
      expect.objectContaining({ opacity: 0.7 }),
      expect.objectContaining({ opacity: 0.2 }),
    ])
  })

  it('drops a stale finish target when the latest target returns to the active animation', () => {
    const { animate, animations } = installAnimationStub()
    const first = {
      keyframes: [{ opacity: 0 }, { opacity: 1 }],
      duration: 1000,
      interruption: 'finish' as const,
    }
    const second = {
      keyframes: [{ opacity: 1 }, { opacity: 0 }],
      duration: 1000,
      interruption: 'finish' as const,
    }

    const { rerender } = render(<View animation={first} />)

    rerender(<View animation={second} />)
    finish(animations[0])

    expect(animate).toHaveBeenCalledTimes(2)

    rerender(<View animation={first} />)
    rerender(<View animation={second} />)

    finish(animations[1])

    expect(animate).toHaveBeenCalledTimes(2)
    expect(animations[1].cancel).not.toHaveBeenCalled()
  })

  it('reduces repeating motion to a zero-duration final frame', () => {
    const { animate } = installAnimationStub()

    render(
      <ThemeProvider reducedMotion="reduce">
        <View
          animation={{
            keyframes: [{ opacity: 0 }, { opacity: 1 }],
            duration: 100,
            repeat: 'infinite',
          }}
        />
      </ThemeProvider>,
    )

    expect(animate).toHaveBeenCalledTimes(1)
    expect(animate.mock.calls[0][1]).toMatchObject({
      duration: 0,
      fill: 'both',
    })
  })
})
