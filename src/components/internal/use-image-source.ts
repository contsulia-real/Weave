import {
  useEffect,
  useState,
} from 'react'
import type { ImageSource } from '../../core/image-types'

export function useImageSource(src: ImageSource): string | undefined {
  const [resolved, setResolved] = useState<string | undefined>(
    typeof src === 'string' ? src : undefined,
  )

  useEffect(() => {
    if (typeof src === 'string') {
      setResolved(src)
      return
    }

    if (
      typeof URL === 'undefined' ||
      typeof URL.createObjectURL !== 'function'
    ) {
      setResolved(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(src)
    setResolved(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [src])

  return resolved
}
