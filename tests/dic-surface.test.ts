import { describe, expect, it, vi } from 'vitest'
import { resolveImage } from '../src/core/resolved-image'
import { resolveView } from '../src/core/resolved-view'
import type { ViewProps } from '../src/core/view-types'
import { compileDiCImage } from '../src/renderers/dic/compile-image'
import {
  compileDiCView,
  type DiCViewInteraction,
} from '../src/renderers/dic/compile-view'
import type {
  DiCImageResource,
  DiCImageResourceManager,
} from '../src/renderers/dic/image-resource'
import {
  createDiCSurface,
  type DiCSurfaceScheduler,
} from '../src/renderers/dic/surface'
import { defaultBreakpoints, defaultTheme } from '../src/theme/default-theme'

describe('DiC surface', () => {
  it('coalesces invalidation, scales the backing store, and draws in CSS pixels', () => {
    let scheduled:
      | FrameRequestCallback
      | undefined

    const scheduler: DiCSurfaceScheduler = {
      request: vi.fn((callback) => {
        scheduled = callback
        return 17
      }),
      cancel: vi.fn(),
    }

    const context = {
      globalAlpha: 1,
      fillStyle: '',
      setTransform: vi.fn(),
      clearRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      transform: vi.fn(),
      beginPath: vi.fn(),
      roundRect: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      createLinearGradient: vi.fn(),
      createRadialGradient: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const canvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => context),
      getBoundingClientRect: vi.fn(),
    } as unknown as HTMLCanvasElement

    const props: ViewProps = {
      width: 10,
      height: 'fill',
      padding: 1,
      background: 'primary',
      radius: 'medium',
    }

    const scene = {
      node: compileDiCView(
        resolveView(props, defaultBreakpoints),
      ),
      theme: defaultTheme,
      rem: 16,
    }

    const surface = createDiCSurface(
      canvas,
      scene,
      {
        autoResize: false,
        scheduler,
      },
    )

    surface.resize(240, 120, 2)
    surface.invalidate()
    surface.update(scene)

    expect(canvas.width).toBe(480)
    expect(canvas.height).toBe(240)
    expect(scheduler.request).toHaveBeenCalledTimes(1)

    scheduled?.(0)

    expect(context.setTransform).toHaveBeenCalledWith(
      2,
      0,
      0,
      2,
      0,
      0,
    )
    expect(context.clearRect).toHaveBeenCalledWith(
      0,
      0,
      240,
      120,
    )
    expect(surface.getLayout()).toMatchObject({
      frame: {
        x: 0,
        y: 0,
        width: 160,
        height: 120,
      },
      contentFrame: {
        x: 16,
        y: 16,
        width: 128,
        height: 88,
      },
      children: [],
    })
  })

  it('cancels pending work when destroyed', () => {
    const scheduler: DiCSurfaceScheduler = {
      request: vi.fn(() => 23),
      cancel: vi.fn(),
    }

    const context = {
      setTransform: vi.fn(),
      clearRect: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const canvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => context),
      getBoundingClientRect: vi.fn(),
    } as unknown as HTMLCanvasElement

    const surface = createDiCSurface(
      canvas,
      {
        node: compileDiCView(
          resolveView({}, defaultBreakpoints),
        ),
        theme: defaultTheme,
      },
      {
        autoResize: false,
        scheduler,
      },
    )

    surface.resize(100, 60, 1)
    surface.destroy()

    expect(scheduler.cancel).toHaveBeenCalledWith(23)

    surface.invalidate()
    expect(scheduler.request).toHaveBeenCalledTimes(1)
  })

  it('bridges native canvas pointer and keyboard input into DiC interaction', () => {
    let scheduled:
      | FrameRequestCallback
      | undefined
    const listeners = new Map<
      string,
      EventListenerOrEventListenerObject
    >()
    const click = vi.fn()
    const keyDown = vi.fn()
    const focus = vi.fn()
    const preventDefault = vi.fn()

    const scheduler: DiCSurfaceScheduler = {
      request: vi.fn((callback) => {
        scheduled = callback
        return 29
      }),
      cancel: vi.fn(),
    }

    const context = {
      globalAlpha: 1,
      fillStyle: '',
      setTransform: vi.fn(),
      clearRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      transform: vi.fn(),
      beginPath: vi.fn(),
      roundRect: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      createLinearGradient: vi.fn(),
      createRadialGradient: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const canvas = {
      width: 0,
      height: 0,
      tabIndex: 0,
      style: {
        cursor: '',
      },
      getContext: vi.fn(() => context),
      getBoundingClientRect: vi.fn(() => ({
        left: 10,
        top: 20,
        width: 200,
        height: 100,
        right: 210,
        bottom: 120,
        x: 10,
        y: 20,
        toJSON: () => ({}),
      })),
      addEventListener: vi.fn(
        (
          type: string,
          listener: EventListenerOrEventListenerObject,
        ) => {
          listeners.set(type, listener)
        },
      ),
      removeEventListener: vi.fn(
        (type: string) => {
          listeners.delete(type)
        },
      ),
      hasAttribute: vi.fn(() => true),
      focus,
      setPointerCapture: vi.fn(),
      hasPointerCapture: vi.fn(() => false),
      releasePointerCapture: vi.fn(),
    } as unknown as HTMLCanvasElement

    const interaction: DiCViewInteraction = {
      focusable: true,
      onPointerDown: (event) => {
        event.preventDefault()
      },
      onClick: click,
      onKeyDown: keyDown,
    }

    const node = compileDiCView(
      resolveView(
        {
          width: 10,
          height: 5,
          cursor: 'pointer',
          hover: {
            opacity: 0.8,
          },
          active: {
            opacity: 0.6,
          },
        },
        defaultBreakpoints,
      ),
      {
        interaction,
      },
    )

    const surface = createDiCSurface(
      canvas,
      {
        node,
        theme: defaultTheme,
      },
      {
        autoResize: false,
        scheduler,
      },
    )

    surface.resize(200, 100, 1)
    scheduled?.(0)

    const fire = (
      type: string,
      event: object,
    ) => {
      const listener = listeners.get(type)
      if (typeof listener === 'function') {
        listener(event as Event)
      } else {
        listener?.handleEvent(event as Event)
      }
    }

    const pointerBase = {
      pointerId: 1,
      button: 0,
      buttons: 1,
      clientX: 30,
      clientY: 40,
      preventDefault,
      stopPropagation: vi.fn(),
    }

    fire('pointermove', pointerBase)

    expect(canvas.style.cursor).toBe('pointer')
    expect(
      surface.getInteraction()?.stateForNode(node).hover,
    ).toBe(true)

    fire('pointerdown', pointerBase)

    expect(preventDefault).toHaveBeenCalled()
    expect(focus).toHaveBeenCalledWith({
      preventScroll: true,
    })
    expect(
      surface.getInteraction()?.stateForNode(node).active,
    ).toBe(true)

    fire('pointerup', {
      ...pointerBase,
      buttons: 0,
    })

    expect(click).toHaveBeenCalledTimes(1)
    expect(
      surface.getInteraction()?.stateForNode(node).active,
    ).toBe(false)

    fire('keydown', {
      key: 'Enter',
      code: 'Enter',
      repeat: false,
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    })

    expect(keyDown).toHaveBeenCalledTimes(1)
    expect(
      surface.getInteraction()?.stateForNode(node).focusVisible,
    ).toBe(true)

    surface.destroy()
    expect(listeners.size).toBe(0)
  })

  it('reflows and redraws when an image resource becomes ready', () => {
    let scheduled:
      | FrameRequestCallback
      | undefined
    let listener:
      | (() => void)
      | undefined
    let resource: DiCImageResource = {
      status: 'loading',
    }

    const scheduler: DiCSurfaceScheduler = {
      request: vi.fn((callback) => {
        scheduled = callback
        return 31
      }),
      cancel: vi.fn(),
    }

    const retain = vi.fn()
    const release = vi.fn()
    const imageResources: DiCImageResourceManager = {
      get: vi.fn(() => resource),
      retain,
      release,
      subscribe: vi.fn((next) => {
        listener = next
        return () => {
          listener = undefined
        }
      }),
      destroy: vi.fn(),
    }

    const drawImage = vi.fn()
    const context = {
      globalAlpha: 1,
      fillStyle: '',
      setTransform: vi.fn(),
      clearRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      transform: vi.fn(),
      beginPath: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
      roundRect: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      drawImage,
      createLinearGradient: vi.fn(),
      createRadialGradient: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const canvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => context),
      getBoundingClientRect: vi.fn(),
    } as unknown as HTMLCanvasElement

    const node = compileDiCImage(
      resolveView(
        {
          width: 'content',
          height: 'content',
        },
        defaultBreakpoints,
      ),
      resolveImage({
        src: '/cover.webp',
        alt: 'Cover',
      }),
    )

    const surface = createDiCSurface(
      canvas,
      {
        node,
        theme: defaultTheme,
      },
      {
        autoResize: false,
        scheduler,
        imageResources,
      },
    )

    expect(retain).toHaveBeenCalledWith('/cover.webp')

    surface.resize(300, 200, 1)
    scheduled?.(0)

    expect(surface.getLayout()?.frame).toEqual({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    })
    expect(drawImage).not.toHaveBeenCalled()

    resource = {
      status: 'ready',
      drawable: {} as CanvasImageSource,
      width: 200,
      height: 100,
    }
    listener?.()

    expect(scheduler.request).toHaveBeenCalledTimes(2)

    scheduled?.(16)

    expect(surface.getLayout()?.frame).toEqual({
      x: 0,
      y: 0,
      width: 200,
      height: 100,
    })
    expect(drawImage).toHaveBeenCalledTimes(1)

    const nextNode = compileDiCImage(
      resolveView(
        {
          width: 'content',
          height: 'content',
        },
        defaultBreakpoints,
      ),
      resolveImage({
        src: '/next.webp',
        alt: 'Next',
      }),
    )

    surface.update({
      node: nextNode,
      theme: defaultTheme,
    })

    expect(release).toHaveBeenCalledWith('/cover.webp')
    expect(retain).toHaveBeenCalledWith('/next.webp')

    surface.destroy()
    expect(release).toHaveBeenCalledWith('/next.webp')
    expect(imageResources.destroy).not.toHaveBeenCalled()
  })
})
