import type { ImageSource } from '../../core/image-types'

export interface DiCLoadedImage {
  drawable: CanvasImageSource
  width: number
  height: number
  dispose?: () => void
}

export type DiCImageResource =
  | {
      status: 'loading'
    }
  | {
      status: 'ready'
      drawable: CanvasImageSource
      width: number
      height: number
    }
  | {
      status: 'error'
      error: unknown
    }

export type DiCImageLoader = (
  source: ImageSource,
) => Promise<DiCLoadedImage>

export interface DiCImageResourceManager {
  get(source: ImageSource): DiCImageResource
  retain(source: ImageSource): void
  release(source: ImageSource): void
  subscribe(listener: () => void): () => void
  destroy(): void
}

interface Entry {
  resource: DiCImageResource
  dispose?: () => void
  references: number
  released: boolean
}

function browserImageLoader(
  source: ImageSource,
): Promise<DiCLoadedImage> {
  return new Promise((resolve, reject) => {
    if (
      typeof Image === 'undefined' ||
      typeof URL === 'undefined'
    ) {
      reject(
        new Error(
          'DiC image loading requires browser Image and URL APIs',
        ),
      )
      return
    }

    if (
      typeof source !== 'string' &&
      (
        typeof URL.createObjectURL !== 'function' ||
        typeof URL.revokeObjectURL !== 'function'
      )
    ) {
      reject(
        new Error(
          'DiC Blob image loading requires object URL APIs',
        ),
      )
      return
    }

    const image = new Image()
    const objectUrl =
      typeof source === 'string'
        ? undefined
        : URL.createObjectURL(source)

    const cleanupFailure = () => {
      if (objectUrl !== undefined) {
        URL.revokeObjectURL(objectUrl)
      }
    }

    image.onload = () => {
      resolve({
        drawable: image,
        width: image.naturalWidth,
        height: image.naturalHeight,
        dispose:
          objectUrl === undefined
            ? undefined
            : () => URL.revokeObjectURL(objectUrl),
      })
    }
    image.onerror = (event) => {
      cleanupFailure()
      reject(event)
    }
    image.src =
      typeof source === 'string'
        ? source
        : objectUrl ?? ''
  })
}

export function createDiCImageResourceManager(
  loader: DiCImageLoader = browserImageLoader,
): DiCImageResourceManager {
  const entries = new Map<ImageSource, Entry>()
  const listeners = new Set<() => void>()
  let destroyed = false

  const notify = () => {
    for (const listener of listeners) listener()
  }

  const start = (source: ImageSource): Entry => {
    const entry: Entry = {
      resource: {
        status: 'loading',
      },
      references: 0,
      released: false,
    }
    entries.set(source, entry)

    void loader(source).then(
      (loaded) => {
        if (destroyed || entry.released) {
          loaded.dispose?.()
          return
        }

        entry.dispose = loaded.dispose
        entry.resource = {
          status: 'ready',
          drawable: loaded.drawable,
          width: loaded.width,
          height: loaded.height,
        }
        notify()
      },
      (error: unknown) => {
        if (destroyed) return

        entry.resource = {
          status: 'error',
          error,
        }
        notify()
      },
    )

    return entry
  }

  return {
    get(source) {
      if (destroyed) {
        return {
          status: 'error',
          error: new Error(
            'DiC image resource manager is destroyed',
          ),
        }
      }

      return (
        entries.get(source) ??
        start(source)
      ).resource
    },
    retain(source) {
      if (destroyed) return

      const entry =
        entries.get(source) ??
        start(source)
      entry.references += 1
    },
    release(source) {
      if (destroyed) return

      const entry = entries.get(source)
      if (entry === undefined) return

      entry.references = Math.max(
        0,
        entry.references - 1,
      )
      if (entry.references > 0) return

      entry.released = true
      entry.dispose?.()
      entries.delete(source)
    },
    subscribe(listener) {
      if (destroyed) return () => {}
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    destroy() {
      if (destroyed) return
      destroyed = true

      for (const entry of entries.values()) {
        entry.dispose?.()
      }

      entries.clear()
      listeners.clear()
    },
  }
}
