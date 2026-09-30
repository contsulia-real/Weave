import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createTheme, Slider, ThemeProvider } from '../src'

afterEach(cleanup)

function runtimeRule(element: Element, prefix: string): string {
  const className = [...element.classList].find((name) => name.startsWith(prefix))
  expect(className).toBeDefined()

  return (
    document.querySelector<HTMLStyleElement>(`style[data-weave-runtime-class="${className}"]`)
      ?.textContent ?? ''
  ).replace(/\s+/g, '')
}

describe('Slider', () => {
  it('uses native range defaults and exposes its label', () => {
    const { getByLabelText } = render(<Slider label="Volume" />)

    const slider = getByLabelText('Volume') as HTMLInputElement
    expect(slider.type).toBe('range')
    expect(slider.min).toBe('0')
    expect(slider.max).toBe('100')
    expect(slider.step).toBe('1')
    expect(slider.value).toBe('0')
    expect(slider.getAttribute('data-weave-slider-size')).toBe('medium')
  })

  it('updates uncontrolled value and emits numeric changes', () => {
    const onChange = vi.fn()
    const { getByLabelText } = render(
      <Slider defaultValue={25} onChange={onChange} label="Opacity" />,
    )

    const slider = getByLabelText('Opacity') as HTMLInputElement
    fireEvent.change(slider, { target: { value: '75' } })

    expect(slider.value).toBe('75')
    expect(onChange).toHaveBeenLastCalledWith(75)
    expect(slider.parentElement?.style.getPropertyValue('--weave-slider-progress')).toBe('75%')
  })

  it('clamps controlled and default values to the configured range', () => {
    const { getByTestId } = render(
      <>
        <Slider value={120} min={0} max={100} viewProps={{ data: { testid: 'controlled' } }} />
        <Slider
          defaultValue={-20}
          min={10}
          max={30}
          viewProps={{ data: { testid: 'uncontrolled' } }}
        />
      </>,
    )

    expect((getByTestId('controlled') as HTMLInputElement).value).toBe('100')
    expect((getByTestId('uncontrolled') as HTMLInputElement).value).toBe('10')
  })

  it('passes min, max, step, disabled and size to the native control', () => {
    const { getByTestId } = render(
      <Slider
        min={-20}
        max={20}
        step={5}
        defaultValue={5}
        disabled
        size="large"
        viewProps={{ data: { testid: 'slider' } }}
      />,
    )

    const slider = getByTestId('slider') as HTMLInputElement
    expect(slider.min).toBe('-20')
    expect(slider.max).toBe('20')
    expect(slider.step).toBe('5')
    expect(slider.disabled).toBe(true)
    expect(slider.value).toBe('5')
    expect(slider.getAttribute('data-weave-slider-size')).toBe('large')
    expect(slider.parentElement?.style.getPropertyValue('--weave-slider-progress')).toBe('62.5%')
  })

  it('inherits the tactile surface language from Switch by default', () => {
    const theme = createTheme({
      components: {
        Switch: {
          base: {
            background: 'warning',
            trackShadow: 'inset 0 2px 3px black',
            thumbBackground: 'tertiary',
            thumbShadow: '0 2px 3px black',
            thumbHoverShadow: '0 3px 5px black',
            cursor: 'grab',
          },
          states: {
            checked: {
              background: 'success',
            },
            disabled: {
              opacity: 0.35,
            },
          },
        },
      },
    })

    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Slider viewProps={{ data: { testid: 'slider' } }} />
      </ThemeProvider>,
    )

    const rule = runtimeRule(getByTestId('slider'), 'weave-slider-theme-')
    expect(rule).toContain('--weave-slider-track-color:var(--weave-color-warning,warning);')
    expect(rule).toContain('--weave-slider-track-shadow:inset02px3pxblack;')
    expect(rule).toContain('--weave-slider-fill-color:var(--weave-color-success,success);')
    expect(rule).toContain(
      '--weave-slider-active-dot-color:var(--weave-color-onPrimary,onPrimary);',
    )
    expect(rule).toContain('--weave-slider-thumb-background:var(--weave-color-success,success);')
    expect(rule).toContain('--weave-slider-thumb-shadow:02px3pxblack;')
    expect(rule).toContain('--weave-slider-thumb-hover-shadow:03px5pxblack;')
    expect(rule).toContain('--weave-slider-cursor:grab;')
    expect(rule).toContain('--weave-slider-disabled-opacity:0.35;')
  })

  it('renders an explicit dot for every valid step', () => {
    const { getByTestId } = render(
      <Slider
        min={-20}
        max={20}
        step={5}
        defaultValue={5}
        viewProps={{ data: { testid: 'slider' } }}
      />,
    )

    const control = getByTestId('slider').parentElement
    const steps = control?.querySelectorAll('.weave-slider__step') ?? []
    const activeSteps = control?.querySelectorAll('[data-weave-slider-step-active="true"]') ?? []

    expect(steps).toHaveLength(9)
    expect(activeSteps).toHaveLength(6)
    expect(control?.querySelectorAll('.weave-slider__stop-indicator')).toHaveLength(0)
  })

  it('resolves Slider theme customization', () => {
    const theme = createTheme({
      components: {
        Slider: {
          base: {
            trackColor: 'secondary',
            trackShadow: 'inset 0 1px 2px black',
            fillColor: 'success',
            thumbBackground: 'surface',
            thumbBorderColor: 'primary',
            thumbBorderWidth: 0.125,
            thumbShadow: 'none',
            thumbHoverShadow: 'none',
            thumbPressShadow: 'none',
            cursor: 'crosshair',
          },
          sizes: {
            small: {
              trackHeight: 0.5,
              thumbSize: 1.5,
              thumbTrackGap: 0.1875,
            },
          },
          states: {
            disabled: {
              opacity: 0.25,
            },
          },
        },
      },
    })

    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Slider size="small" viewProps={{ data: { testid: 'slider' } }} />
      </ThemeProvider>,
    )

    const rule = runtimeRule(getByTestId('slider'), 'weave-slider-theme-')
    expect(rule).toContain('--weave-slider-track-color:var(--weave-color-secondary,secondary);')
    expect(rule).toContain('--weave-slider-track-shadow:inset01px2pxblack;')
    expect(rule).toContain('--weave-slider-fill-color:var(--weave-color-success,success);')
    expect(rule).toContain('--weave-slider-thumb-border-width:0.125rem;')
    expect(rule).toContain('--weave-slider-track-height:0.5rem;')
    expect(rule).toContain('--weave-slider-thumb-size:1.5rem;')
    expect(rule).toContain('--weave-slider-thumb-track-gap:0.1875rem;')
    expect(rule).toContain('--weave-slider-cursor:crosshair;')
    expect(rule).toContain('--weave-slider-disabled-opacity:0.25;')
  })
})
