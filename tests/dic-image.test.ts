import { describe, expect, it, vi } from 'vitest'
import { resolveImage } from '../src/core/resolved-image'
import { resolveView } from '../src/core/resolved-view'
import { compileDiCImage } from '../src/renderers/dic/compile-image'
import {
  type DiCImageResourceManager,
} from '../src/renderers/dic/image-resource'
import {
  layoutDiCViewTree,
  measureDiCIntrinsicSize,
} from '../src/renderers/dic/layout-tree'
import {
  drawDiCImage,
  resolveDiCImagePlacement,
} from '../src/renderers/dic/draw-image'
import {
  defaultBreakpoints,
  defaultTheme,
} from '../src/theme/default-theme'

function readyResources(
  width = 200,
  height = 100,
): DiCImageResourceManager {
  const drawable = {} as CanvasImageSource

  return {
    get: vi.fn(() => ({
      status: 'ready' as const,
      drawable,
      width,
      height,
    })),
    retain: vi.fn(),
    release: vi.fn(),
    subscribe: vi.fn(() => () => {}),
    destroy: vi.fn(),
  }
}

describe('DiC Image', () => {
  it('keeps Image defaults renderer-neutral', () => {
    const image = resolveImage({
      src: '/cover.webp',
      alt: 'Cover',
    })

    expect(image).toEqual({
      src: '/cover.webp',
      alt: 'Cover',
      fit: 'fill',
      position: 'center',
      loading: undefined,
    })
    expect(JSON.stringify(image)).not.toContain('object-fit')
    expect(JSON.stringify(image)).not.toContain('--weave-')
  })

  it('uses the natural bitmap size as intrinsic size', () => {
    const resources = readyResources(200, 100)
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

    expect(
      measureDiCIntrinsicSize(
        node,
        {
          width: 500,
          height: 400,
        },
        {
          viewportWidth: 500,
          rem: 16,
          theme: defaultTheme,
          imageResources: resources,
        },
      ),
    ).toEqual({
      width: 200,
      height: 100,
    })
  })

  it('preserves aspect ratio when only one layout axis is explicit', () => {
    const resources = readyResources(200, 100)
    const node = compileDiCImage(
      resolveView(
        {
          width: 10,
          height: 'content',
        },
        defaultBreakpoints,
      ),
      resolveImage({
        src: '/cover.webp',
        alt: 'Cover',
      }),
    )

    const layout = layoutDiCViewTree(
      node,
      {
        width: 500,
        height: 400,
      },
      {
        viewportWidth: 500,
        rem: 16,
        theme: defaultTheme,
        imageResources: resources,
      },
    )

    expect(layout.frame).toEqual({
      x: 0,
      y: 0,
      width: 160,
      height: 80,
    })
  })

  it('scale-down fit preserves ratio within available layout space', () => {
    const resources = readyResources(400, 200)
    const node = compileDiCImage(
      resolveView(
        {
          width: 'fit',
          height: 'fit',
        },
        defaultBreakpoints,
      ),
      resolveImage({
        src: '/cover.webp',
        alt: 'Cover',
      }),
    )

    expect(
      measureDiCIntrinsicSize(
        node,
        {
          width: 160,
          height: 160,
        },
        {
          viewportWidth: 500,
          rem: 16,
          theme: defaultTheme,
          imageResources: resources,
        },
      ),
    ).toEqual({
      width: 160,
      height: 80,
    })
  })

  it('resolves contain, cover, and precise object positions', () => {
    const contain = resolveDiCImagePlacement(
      {
        kind: 'image',
        image: resolveImage({
          src: '/cover.webp',
          alt: 'Cover',
          fit: 'contain',
        }),
      },
      200,
      100,
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
      16,
    )

    expect(contain).toEqual({
      x: 0,
      y: 25,
      width: 100,
      height: 50,
    })

    const cover = resolveDiCImagePlacement(
      {
        kind: 'image',
        image: resolveImage({
          src: '/cover.webp',
          alt: 'Cover',
          fit: 'cover',
          position: '25% 75%',
        }),
      },
      200,
      100,
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
      16,
    )

    expect(cover).toEqual({
      x: -25,
      y: 0,
      width: 200,
      height: 100,
    })

    const reversedKeywords = resolveDiCImagePlacement(
      {
        kind: 'image',
        image: resolveImage({
          src: '/cover.webp',
          alt: 'Cover',
          fit: 'contain',
          position: 'top left',
        }),
      },
      200,
      100,
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
      16,
    )

    expect(reversedKeywords).toEqual({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
    })
  })

  it('clips and draws the resolved bitmap placement', () => {
    const resources = readyResources(200, 100)
    const drawImage = vi.fn()
    const context = {
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      beginPath: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
      drawImage,
    } as unknown as CanvasRenderingContext2D

    drawDiCImage(
      context,
      {
        kind: 'image',
        image: resolveImage({
          src: '/cover.webp',
          alt: 'Cover',
          fit: 'cover',
          position: 'top-left',
        }),
      },
      {
        x: 16,
        y: 24,
        width: 100,
        height: 100,
      },
      {
        imageResources: resources,
        rem: 16,
      },
    )

    expect(context.translate).toHaveBeenCalledWith(16, 24)
    expect(context.rect).toHaveBeenCalledWith(0, 0, 100, 100)
    expect(context.clip).toHaveBeenCalledTimes(1)
    expect(drawImage).toHaveBeenCalledWith(
      expect.anything(),
      0,
      0,
      200,
      100,
    )
  })

  it('does not draw while the resource is still loading', () => {
    const resources: DiCImageResourceManager = {
      get: vi.fn(() => ({
        status: 'loading',
      })),
      retain: vi.fn(),
      release: vi.fn(),
      subscribe: vi.fn(() => () => {}),
      destroy: vi.fn(),
    }
    const drawImage = vi.fn()
    const context = {
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      beginPath: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
      drawImage,
    } as unknown as CanvasRenderingContext2D

    drawDiCImage(
      context,
      {
        kind: 'image',
        image: resolveImage({
          src: '/cover.webp',
          alt: 'Cover',
        }),
      },
      {
        x: 0,
        y: 0,
        width: 100,
        height: 50,
      },
      {
        imageResources: resources,
        rem: 16,
      },
    )

    expect(drawImage).not.toHaveBeenCalled()
  })
})
