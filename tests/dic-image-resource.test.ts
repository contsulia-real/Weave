import { describe, expect, it, vi } from 'vitest'
import {
  createDiCImageResourceManager,
  type DiCLoadedImage,
} from '../src/renderers/dic/image-resource'

describe('DiC image resources', () => {
  it('deduplicates loads, notifies on readiness, and disposes owned resources', async () => {
    let resolveLoad:
      | ((value: DiCLoadedImage) => void)
      | undefined

    const loader = vi.fn(
      () =>
        new Promise<DiCLoadedImage>((resolve) => {
          resolveLoad = resolve
        }),
    )
    const dispose = vi.fn()
    const listener = vi.fn()
    const manager = createDiCImageResourceManager(loader)

    expect(manager.get('/cover.webp')).toEqual({
      status: 'loading',
    })
    expect(manager.get('/cover.webp')).toEqual({
      status: 'loading',
    })
    expect(loader).toHaveBeenCalledTimes(1)

    manager.subscribe(listener)

    resolveLoad?.({
      drawable: {} as CanvasImageSource,
      width: 200,
      height: 100,
      dispose,
    })
    await Promise.resolve()

    expect(listener).toHaveBeenCalledTimes(1)
    expect(manager.get('/cover.webp')).toMatchObject({
      status: 'ready',
      width: 200,
      height: 100,
    })

    manager.destroy()
    expect(dispose).toHaveBeenCalledTimes(1)
  })

  it('reports loader failures and notifies subscribers', async () => {
    let rejectLoad:
      | ((reason?: unknown) => void)
      | undefined

    const loader = vi.fn(
      () =>
        new Promise<DiCLoadedImage>((_resolve, reject) => {
          rejectLoad = reject
        }),
    )
    const listener = vi.fn()
    const manager = createDiCImageResourceManager(loader)

    manager.subscribe(listener)
    manager.get('/missing.webp')

    rejectLoad?.(new Error('missing'))
    await Promise.resolve()

    expect(listener).toHaveBeenCalledTimes(1)
    expect(manager.get('/missing.webp')).toMatchObject({
      status: 'error',
    })
  })
})
