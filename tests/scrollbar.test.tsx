import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { View } from '../src'

afterEach(cleanup)

describe('automatic Scrollbar', () => {
  it('auto-mounts for semantic scroll overflow without leaking config', () => {
    const { getByTestId } = render(
      <View
        overflow="auto"
        scrollbar={{
          size: 'large',
          color: 'primary',
          trackColor: 'surfaceHover',
          radius: 'full',
          opacity: 0.8,
        }}
        data={{
          testid: 'scroll-host',
        }}
      >
        content
      </View>,
    )

    const host = getByTestId('scroll-host')

    expect(host.className).toContain('weave-scroll-host')
    expect(host.className).toContain(
      'weave-scroll-host--overflow-auto',
    )
    expect(host.getAttribute('scrollbar')).toBeNull()

    const tracks = document.body.querySelectorAll(
      '[data-weave-scrollbar]',
    )

    expect(tracks).toHaveLength(2)
    expect(
      document.body.querySelector('.weave-scrollbar--large'),
    ).not.toBeNull()

    const stylesheet = document.querySelector(
      'style[data-weave-scrollbar-styles]',
    )

    expect(stylesheet?.textContent).toContain(
      ':where(.weave-scroll-host)',
    )
    expect(stylesheet?.textContent).toContain(
      'scrollbar-width: none',
    )
  })

  it('guarantees native overflow clipping through a low-specificity class', () => {
    render(<View overflow="auto">content</View>)

    const stylesheet = document.querySelector(
      'style[data-weave-view-styles]',
    )

    expect(stylesheet?.textContent).toContain(
      ':where(.weave-scroll-host--overflow-auto)',
    )
    expect(stylesheet?.textContent).toContain(
      'overflow: auto;',
    )
  })

  it('does not mount for non-scroll overflow', () => {
    render(<View overflow="hidden">content</View>)

    expect(
      document.body.querySelector('[data-weave-scrollbar]'),
    ).toBeNull()
  })

  it('syncs vertical thumb geometry to native scroll state', () => {
    const { getByTestId } = render(
      <View
        style={{
          overflowY: 'auto',
          width: '200px',
          height: '100px',
        }}
        data={{
          testid: 'scroll-host',
        }}
      >
        <View height={40} />
      </View>,
    )

    const host = getByTestId('scroll-host') as HTMLDivElement

    Object.defineProperties(host, {
      clientHeight: {
        configurable: true,
        value: 100,
      },
      scrollHeight: {
        configurable: true,
        value: 400,
      },
      clientWidth: {
        configurable: true,
        value: 200,
      },
      scrollWidth: {
        configurable: true,
        value: 200,
      },
    })

    host.getBoundingClientRect = () => ({
      x: 10,
      y: 20,
      top: 20,
      right: 210,
      bottom: 120,
      left: 10,
      width: 200,
      height: 100,
      toJSON: () => ({}),
    })

    fireEvent(window, new Event('resize'))

    const track = document.body.querySelector(
      '[data-weave-scrollbar-orientation="vertical"]',
    ) as HTMLDivElement
    const thumb = track.querySelector(
      '[data-weave-scrollbar-thumb]',
    ) as HTMLDivElement

    expect(track.dataset.weaveScrollbarVisible).toBe('true')
    expect(track.style.top).toBe('20px')
    expect(track.style.left).toBe('210px')
    expect(track.style.height).toBe('100px')
    expect(thumb.style.height).toBe('25px')

    host.scrollTop = 150
    fireEvent.scroll(host)

    expect(thumb.style.transform).toBe('translateY(37.5px)')
  })

  it('keeps tracks visible for overflow scroll semantics', () => {
    const { getByTestId } = render(
      <View
        style={{
          overflow: 'scroll',
          width: '200px',
          height: '100px',
        }}
        data={{
          testid: 'always-scroll-host',
        }}
      />,
    )

    const host = getByTestId('always-scroll-host') as HTMLDivElement

    Object.defineProperties(host, {
      clientHeight: {
        configurable: true,
        value: 100,
      },
      scrollHeight: {
        configurable: true,
        value: 100,
      },
      clientWidth: {
        configurable: true,
        value: 200,
      },
      scrollWidth: {
        configurable: true,
        value: 200,
      },
    })

    host.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      top: 0,
      right: 200,
      bottom: 100,
      left: 0,
      width: 200,
      height: 100,
      toJSON: () => ({}),
    })

    fireEvent(window, new Event('resize'))

    expect(
      (
        document.body.querySelector(
          '[data-weave-scrollbar-orientation="vertical"]',
        ) as HTMLDivElement
      ).dataset.weaveScrollbarVisible,
    ).toBe('true')

    expect(
      (
        document.body.querySelector(
          '[data-weave-scrollbar-orientation="horizontal"]',
        ) as HTMLDivElement
      ).dataset.weaveScrollbarVisible,
    ).toBe('true')
  })

  it('shows a lighter track only when tracked', () => {
    const { rerender } = render(
      <View
        overflow="scroll"
        scrollbar={{
          tracked: true,
          color: 'primary',
        }}
      />,
    )

    let tracks = document.body.querySelectorAll(
      '[data-weave-scrollbar]',
    )

    expect(tracks).toHaveLength(2)

    for (const track of tracks) {
      expect(track.className).toContain('weave-scrollbar--tracked')
      expect(
        track.getAttribute('data-weave-scrollbar-tracked'),
      ).toBe('true')
    }

    const stylesheet = document.querySelector(
      'style[data-weave-scrollbar-styles]',
    )

    expect(stylesheet?.textContent).toContain(
      ':where(.weave-scrollbar--tracked)',
    )

    rerender(
      <View
        overflow="scroll"
        scrollbar={{
          color: 'primary',
        }}
      />,
    )

    tracks = document.body.querySelectorAll(
      '[data-weave-scrollbar]',
    )

    for (const track of tracks) {
      expect(track.className).not.toContain('weave-scrollbar--tracked')
      expect(
        track.getAttribute('data-weave-scrollbar-tracked'),
      ).toBeNull()
    }
  })

  it('keeps size defaults class-based', () => {
    render(
      <View
        overflow="auto"
        scrollbar={{
          size: 'small',
        }}
      />,
    )

    const track = document.body.querySelector(
      '.weave-scrollbar--small.weave-scrollbar--vertical',
    ) as HTMLDivElement

    expect(track).not.toBeNull()
    expect(track.style.width).toBe('')
    expect(track.style.getPropertyValue('--weave-width')).toBe('')
  })
})
