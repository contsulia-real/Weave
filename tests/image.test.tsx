import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Image } from '../src'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function runtimeRule(
  element: Element,
  prefix: string,
): string {
  const className = [...element.classList].find((name) =>
    name.startsWith(prefix),
  )

  expect(className).toBeDefined()

  return (
    document.querySelector<HTMLStyleElement>(
      `style[data-weave-runtime-class="${className}"]`,
    )?.textContent ?? ''
  )
}

describe('Image', () => {
  it('renders a real img with image semantics and View props', () => {
    const onLoad = vi.fn()
    const onError = vi.fn()

    const { getByTestId } = render(
      <Image
        src="/cover.webp"
        alt="Album cover"
        fit="cover"
        position="top-left"
        loading="lazy"
        onLoad={onLoad}
        onError={onError}
        viewProps={{
          width: 20,
          height: 12,
          radius: 'medium',
          data: {
            testid: 'image',
          },
        }}
      />,
    )

    const element = getByTestId('image') as HTMLImageElement
    const imageRule = runtimeRule(element, 'weave-component-props-')
    const viewRule = runtimeRule(element, 'weave-view-props-')

    expect(element.tagName).toBe('IMG')
    expect(element.getAttribute('src')).toBe('/cover.webp')
    expect(element.getAttribute('alt')).toBe('Album cover')
    expect(element.getAttribute('loading')).toBe('lazy')
    expect(element.getAttribute('fit')).toBeNull()
    expect(element.getAttribute('position')).toBeNull()

    expect(imageRule).toContain('--weave-image-fit:cover;')
    expect(imageRule).toContain('--weave-image-position:left top;')
    expect(viewRule).toContain('--weave-width:20rem;')
    expect(viewRule).toContain('--weave-height:12rem;')
    expect(element.style.getPropertyValue('--weave-image-fit')).toBe('')

    fireEvent.load(element)
    fireEvent.error(element)

    expect(onLoad).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('keeps viewProps className and style above Image semantic props', () => {
    const { getByTestId } = render(
      <Image
        src="/cover.webp"
        alt=""
        fit="cover"
        viewProps={{
          className: 'custom-image',
          style: {
            objectFit: 'contain',
          },
          data: {
            testid: 'priority-image',
          },
        }}
      />,
    )

    const element = getByTestId('priority-image') as HTMLImageElement
    const imageRule = runtimeRule(element, 'weave-component-props-')

    expect(element.className).toContain('custom-image')
    expect(element.style.objectFit).toBe('contain')
    expect(imageRule).toContain('--weave-image-fit:cover;')

    const stylesheet = document.querySelector(
      'style[data-weave-image-styles]',
    )
    expect(stylesheet?.textContent).toContain(
      ':where([data-weave-image])',
    )
    expect(stylesheet?.textContent).toContain(
      'var(--weave-overflow, clip)',
    )
  })

  it('passes precise object-position values through unchanged', () => {
    const { getByTestId } = render(
      <Image
        src="/cover.webp"
        alt=""
        position="25% 75%"
        viewProps={{
          data: {
            testid: 'position-image',
          },
        }}
      />,
    )

    const element = getByTestId('position-image')
    expect(runtimeRule(element, 'weave-component-props-')).toContain(
      '--weave-image-position:25% 75%;',
    )
  })

  it('revokes the previous object URL when Blob source changes', () => {
    const createObjectURL = vi
      .fn()
      .mockReturnValueOnce('blob:weave-image-a')
      .mockReturnValueOnce('blob:weave-image-b')
    const revokeObjectURL = vi.fn()

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectURL,
    })

    const first = new Blob(['first'], { type: 'image/png' })
    const second = new Blob(['second'], { type: 'image/png' })

    const { getByTestId, rerender, unmount } = render(
      <Image
        src={first}
        alt=""
        viewProps={{
          data: {
            testid: 'blob-swap-image',
          },
        }}
      />,
    )

    const element = getByTestId('blob-swap-image') as HTMLImageElement

    expect(element.getAttribute('src')).toBe('blob:weave-image-a')

    rerender(
      <Image
        src={second}
        alt=""
        viewProps={{
          data: {
            testid: 'blob-swap-image',
          },
        }}
      />,
    )

    expect(revokeObjectURL).toHaveBeenCalledWith('blob:weave-image-a')
    expect(element.getAttribute('src')).toBe('blob:weave-image-b')

    unmount()

    expect(revokeObjectURL).toHaveBeenCalledWith('blob:weave-image-b')
  })

  it('creates and revokes object URLs for Blob sources', () => {
    const createObjectURL = vi.fn(() => 'blob:weave-image')
    const revokeObjectURL = vi.fn()

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectURL,
    })

    const blob = new Blob(['image'], { type: 'image/png' })
    const { getByTestId, unmount } = render(
      <Image
        src={blob}
        alt=""
        viewProps={{
          data: {
            testid: 'blob-image',
          },
        }}
      />,
    )

    const element = getByTestId('blob-image') as HTMLImageElement

    expect(createObjectURL).toHaveBeenCalledWith(blob)
    expect(element.getAttribute('src')).toBe('blob:weave-image')

    unmount()

    expect(revokeObjectURL).toHaveBeenCalledWith('blob:weave-image')
  })
})
