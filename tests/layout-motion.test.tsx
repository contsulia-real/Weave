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

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  delete (HTMLElement.prototype as Partial<HTMLElement>).animate
})

interface MutableRect {
  left: number
  top: number
  width: number
  height: number
}

interface FakeAnimation extends Animation {
  onfinish: ((this: Animation, ev: AnimationPlaybackEvent) => unknown) | null
}

function domRect(value: MutableRect): DOMRect {
  return {
    x: value.left,
    y: value.top,
    left: value.left,
    top: value.top,
    width: value.width,
    height: value.height,
    right: value.left + value.width,
    bottom: value.top + value.height,
    toJSON: () => ({}),
  } as DOMRect
}

function setupAnimationEnvironment(box: MutableRect) {
  const animations: FakeAnimation[] = []
  const frames = new Map<number, FrameRequestCallback>()
  let frameId = 0

  vi.spyOn(
    HTMLElement.prototype,
    'getBoundingClientRect',
  ).mockImplementation(() => domRect(box))

  const animate = vi.fn(
    (
      _keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
      _options?: number | KeyframeAnimationOptions,
    ) => {
      const animation = {
        cancel: vi.fn(),
        onfinish: null,
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

  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(
    (callback) => {
      frameId += 1
      frames.set(frameId, callback)
      return frameId
    },
  )
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(
    (id) => {
      frames.delete(id)
    },
  )

  return {
    animate,
    animations,
    frames,
    runOneFrame(time = 16) {
      const entry = frames.entries().next().value as
        | [number, FrameRequestCallback]
        | undefined
      if (entry === undefined) return
      frames.delete(entry[0])
      entry[1](time)
    },
  }
}

describe('View layoutAnimation', () => {
  it('does not animate the initial mount', () => {
    const box = {
      left: 0,
      top: 0,
      width: 100,
      height: 50,
    }
    const { animate } = setupAnimationEnvironment(box)

    const { getByTestId } = render(
      <View
        layoutAnimation
        data={{ testid: 'layout-view' }}
      />,
    )

    expect(animate).not.toHaveBeenCalled()
    expect(
      getByTestId('layout-view').dataset.weaveLayoutAnimating,
    ).toBeUndefined()
  })

  it('animates position and size changes with FLIP variables', () => {
    const box = {
      left: 0,
      top: 0,
      width: 100,
      height: 50,
    }
    const { animate, animations } = setupAnimationEnvironment(box)

    const { getByTestId, rerender } = render(
      <View
        layoutAnimation
        data={{ testid: 'layout-view' }}
      />,
    )

    Object.assign(box, {
      left: 100,
      top: 20,
      width: 200,
      height: 100,
    })
    rerender(
      <View
        layoutAnimation
        data={{ testid: 'layout-view' }}
      />,
    )

    expect(animate).toHaveBeenCalledTimes(1)
    const [keyframes, options] = animate.mock.calls[0]
    expect(keyframes).toEqual([
      {
        translate: '-100px -20px',
        scale: '0.5 0.5',
      },
      {
        translate: '0px 0px',
        scale: '1 1',
      },
    ])
    expect(options).toMatchObject({
      duration: 200,
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
      fill: 'both',
    })

    const element = getByTestId('layout-view')
    expect(element.dataset.weaveLayoutAnimating).toBe('true')

    animations[0].onfinish?.call(
      animations[0],
      {} as AnimationPlaybackEvent,
    )
    expect(element.dataset.weaveLayoutAnimating).toBeUndefined()
    expect(animations[0].cancel).toHaveBeenCalledTimes(1)
  })

  it('resolves custom duration and curve configuration', () => {
    const box = {
      left: 0,
      top: 0,
      width: 100,
      height: 50,
    }
    const { animate } = setupAnimationEnvironment(box)

    const { rerender } = render(
      <View
        layoutAnimation={{
          duration: 'fast',
          curve: { steps: 4, position: 'end' },
        }}
      />,
    )

    box.left = 48
    rerender(
      <View
        layoutAnimation={{
          duration: 'fast',
          curve: { steps: 4, position: 'end' },
        }}
      />,
    )

    expect(animate.mock.calls[0][1]).toMatchObject({
      duration: 120,
      easing: 'steps(4, end)',
    })
  })

  it('retargets an interrupted animation from the sampled visual rect', () => {
    const box = {
      left: 0,
      top: 0,
      width: 100,
      height: 50,
    }
    const {
      animate,
      animations,
      runOneFrame,
    } = setupAnimationEnvironment(box)

    const { rerender } = render(<View layoutAnimation />)

    box.left = 100
    rerender(<View layoutAnimation />)
    expect(animate).toHaveBeenCalledTimes(1)

    box.left = 40
    runOneFrame()

    box.left = 200
    rerender(<View layoutAnimation />)

    expect(animations[0].cancel).toHaveBeenCalledTimes(1)
    expect(animate).toHaveBeenCalledTimes(2)
    const [secondKeyframes] = animate.mock.calls[1]
    expect(secondKeyframes).toEqual([
      expect.objectContaining({
        translate: '-160px 0px',
      }),
      expect.objectContaining({
        translate: '0px 0px',
      }),
    ])
  })

  it('resynchronizes the FLIP baseline after scrolling', () => {
    const box = {
      left: 0,
      top: 1000,
      width: 100,
      height: 50,
    }
    const {
      animate,
      runOneFrame,
    } = setupAnimationEnvironment(box)

    const { rerender } = render(<View layoutAnimation />)

    box.top = 100
    document.dispatchEvent(new Event('scroll'))
    runOneFrame()

    box.left = 200
    rerender(<View layoutAnimation />)

    expect(animate).toHaveBeenCalledTimes(1)
    const [keyframes] = animate.mock.calls[0]
    expect(keyframes).toEqual([
      expect.objectContaining({
        translate: '-200px 0px',
      }),
      expect.objectContaining({
        translate: '0px 0px',
      }),
    ])
  })

  it('skips layout animation when reduced motion is active', () => {
    const box = {
      left: 0,
      top: 0,
      width: 100,
      height: 50,
    }
    const { animate } = setupAnimationEnvironment(box)

    const { getByTestId, rerender } = render(
      <ThemeProvider reducedMotion="reduce">
        <View
          layoutAnimation
          data={{ testid: 'reduced-layout' }}
        />
      </ThemeProvider>,
    )

    box.left = 120
    box.width = 180
    rerender(
      <ThemeProvider reducedMotion="reduce">
        <View
          layoutAnimation
          data={{ testid: 'reduced-layout' }}
        />
      </ThemeProvider>,
    )

    expect(animate).not.toHaveBeenCalled()
    expect(
      getByTestId('reduced-layout').dataset.weaveLayoutAnimating,
    ).toBeUndefined()
  })

  it('installs a low-specificity layout-animation host state', () => {
    render(<View layoutAnimation />)

    const stylesheet =
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-view-styles]',
      )?.textContent ?? ''

    expect(stylesheet).toContain(
      ':where([data-weave-view][data-weave-layout-animating="true"])',
    )
    expect(stylesheet).toContain('transform-origin: 0 0;')
    expect(stylesheet).toContain('will-change: translate, scale;')
  })
})
