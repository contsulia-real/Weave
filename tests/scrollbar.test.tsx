import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  ThemeProvider,
  View,
  createTheme,
} from '../src'

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
  ).replace(/\s+/g, '')
}

afterEach(cleanup)

describe('automatic Scrollbar', () => {
  it('auto-mounts for semantic scroll overflow without leaking config', () => {
    const { getByTestId } = render(
      <View
        overflow="auto"
        scrollbar={{
          size: 'large',
          color: 'primary',
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
    expect(track.style.top).toBe('24px')
    expect(track.style.left).toBe('210px')
    expect(
      track.style.getPropertyValue('--weave-scrollbar-edge-inset'),
    ).toBe('4px')
    expect(track.style.height).toBe('92px')
    expect(thumb.style.height).toBe('24px')

    host.scrollTop = 150
    fireEvent.scroll(host)

    expect(thumb.style.transform).toBe('translateY(34px)')
  })

  it('keeps the thumb inside the straight edge between rounded corners', () => {
    const { getByTestId } = render(
      <View
        style={{
          overflowY: 'auto',
          width: '200px',
          height: '100px',
          borderTopRightRadius: '24px',
          borderBottomRightRadius: '18px',
        }}
        data={{
          testid: 'rounded-scroll-host',
        }}
      >
        <View height={40} />
      </View>,
    )

    const host = getByTestId('rounded-scroll-host') as HTMLDivElement

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

    const hitRegion = document.body.querySelector(
      '[data-weave-scrollbar-orientation="vertical"]',
    ) as HTMLDivElement

    expect(hitRegion.style.top).toBe('44px')
    expect(hitRegion.style.height).toBe('58px')
  })

  it('keeps a horizontal thumb between the bottom rounded corners', () => {
    const { getByTestId } = render(
      <View
        style={{
          overflowX: 'auto',
          width: '200px',
          height: '100px',
          borderBottomLeftRadius: '30px',
          borderBottomRightRadius: '20px',
        }}
        data={{
          testid: 'rounded-horizontal-scroll-host',
        }}
      >
        <View width={40} />
      </View>,
    )

    const host = getByTestId(
      'rounded-horizontal-scroll-host',
    ) as HTMLDivElement

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
        value: 400,
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

    const hitRegion = document.body.querySelector(
      '[data-weave-scrollbar-orientation="horizontal"]',
    ) as HTMLDivElement

    expect(hitRegion.style.left).toBe('40px')
    expect(hitRegion.style.width).toBe('150px')
  })

  it('keeps the hit target flush to the edge while the thumb stays inset', () => {
    const { getByTestId } = render(
      <View
        style={{
          overflowY: 'auto',
          width: '200px',
          height: '100px',
        }}
        data={{
          testid: 'edge-scroll-host',
        }}
      >
        <View height={40} />
      </View>,
    )

    const host = getByTestId('edge-scroll-host') as HTMLDivElement

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

    track.getBoundingClientRect = () => ({
      x: 194,
      y: 24,
      top: 24,
      right: 210,
      bottom: 116,
      left: 194,
      width: 16,
      height: 92,
      toJSON: () => ({}),
    })
    thumb.getBoundingClientRect = () => ({
      x: 200,
      y: 24,
      top: 24,
      right: 206,
      bottom: 48,
      left: 200,
      width: 6,
      height: 24,
      toJSON: () => ({}),
    })

    fireEvent.pointerDown(track, {
      pointerId: 41,
      button: 0,
      clientX: 209,
      clientY: 30,
    })

    expect(track.dataset.weaveScrollbarDragging).toBe('true')

    fireEvent.pointerMove(track, {
      pointerId: 41,
      clientX: 209,
      clientY: 50,
    })

    expect(host.scrollTop).toBeGreaterThan(0)

    fireEvent.pointerUp(track, {
      pointerId: 41,
      clientX: 209,
      clientY: 50,
    })

    expect(track.dataset.weaveScrollbarDragging).toBeUndefined()
  })

  it('keeps hit regions active for overflow scroll semantics', () => {
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

  it('takes size and appearance defaults from the component theme', () => {
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
    const rule = runtimeRule(track, 'weave-scrollbar-theme-')

    expect(track).not.toBeNull()
    expect(track.style.width).toBe('')
    expect(track.style.getPropertyValue('--weave-width')).toBe('')
    expect(rule).toContain('--weave-scrollbar-thickness:0.25rem;')
    expect(rule).toContain('--weave-scrollbar-hit-size:1rem;')
    expect(rule).toContain(
      '--weave-scrollbar-color:color-mix(insrgb,var(--weave-color-secondary)72%,transparent);',
    )
    expect(rule).toContain(
      '--weave-scrollbar-hover-color:color-mix(insrgb,var(--weave-color-secondary)88%,transparent);',
    )
    expect(rule).toContain(
      '--weave-scrollbar-drag-color:var(--weave-color-secondary);',
    )

    const stylesheet = document.querySelector(
      'style[data-weave-scrollbar-styles]',
    )?.textContent ?? ''

    expect(stylesheet).toContain(
      '--weave-component-width: var(--weave-scrollbar-hit-size)',
    )
    expect(stylesheet).toContain(
      '--weave-component-width: var(--weave-scrollbar-thickness)',
    )
    expect(stylesheet).not.toContain('weave-scrollbar--tracked')
    expect(stylesheet).not.toContain('weave-scrollbar-track-color')
    expect(stylesheet).not.toContain('weave-scrollbar-thumb-shadow')
  })

  it('uses global hover and drag feedback without touching scroll geometry', () => {
    render(<View overflow="scroll" />)

    const track = document.body.querySelector(
      '.weave-scrollbar--vertical',
    ) as HTMLDivElement
    const thumb = track.querySelector(
      '[data-weave-scrollbar-thumb]',
    ) as HTMLDivElement
    const stylesheet = document.querySelector(
      'style[data-weave-scrollbar-styles]',
    )?.textContent ?? ''

    expect(stylesheet).toContain(
      '--weave-component-background: var(--weave-scrollbar-hover-color)',
    )
    expect(stylesheet).toContain(
      '--weave-component-background: var(--weave-scrollbar-drag-color)',
    )
    expect(stylesheet).toContain(
      'scale: var(--weave-feedback-hover-scale) 1',
    )
    expect(stylesheet).toContain(
      'scale: var(--weave-feedback-drag-scale) 1',
    )

    fireEvent.pointerDown(thumb, {
      pointerId: 21,
      button: 0,
      clientY: 0,
    })

    expect(track.dataset.weaveScrollbarDragging).toBe('true')

    fireEvent.pointerUp(thumb, {
      pointerId: 21,
      clientY: 0,
    })

    expect(track.dataset.weaveScrollbarDragging).toBeUndefined()
  })

  it('lets ThemeProvider replace Scrollbar defaults', () => {
    const theme = createTheme({
      components: {
        Scrollbar: {
          base: {
            color: 'danger',
            opacity: 0.6,
          },
          sizes: {
            medium: {
              thickness: 0.75,
            },
          },
        },
      },
    })

    render(
      <ThemeProvider theme={theme} mode="light">
        <View overflow="auto" />
      </ThemeProvider>,
    )

    const track = document.body.querySelector(
      '.weave-scrollbar--medium.weave-scrollbar--vertical',
    ) as HTMLDivElement
    const rule = runtimeRule(track, 'weave-scrollbar-theme-')

    expect(rule).toContain('--weave-scrollbar-thickness:0.75rem;')
    expect(rule).toContain(
      '--weave-scrollbar-color:var(--weave-color-danger',
    )
    expect(rule).toContain('--weave-scrollbar-opacity:0.6;')
  })
})
