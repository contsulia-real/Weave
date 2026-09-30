import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createTheme, Tab, TabList, TabPanel, Tabs, Text, ThemeProvider } from '../src'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  delete (HTMLElement.prototype as Partial<HTMLElement>).animate
})

function runtimeRule(element: Element, prefix: string): string {
  const className = [...element.classList].find((name) => name.startsWith(prefix))
  expect(className).toBeDefined()

  return (
    document.querySelector<HTMLStyleElement>('style[data-weave-runtime-class="' + className + '"]')
      ?.textContent ?? ''
  ).replace(/\s+/g, '')
}

function BasicTabs({
  activation,
  orientation,
  variant,
}: {
  activation?: 'automatic' | 'manual'
  orientation?: 'horizontal' | 'vertical'
  variant?: 'underline' | 'pill'
}) {
  return (
    <Tabs activation={activation} orientation={orientation} variant={variant}>
      <TabList>
        <Tab value="general">General</Tab>
        <Tab value="appearance">Appearance</Tab>
        <Tab value="advanced" disabled>
          Advanced
        </Tab>
      </TabList>
      <TabPanel value="general">
        <Text>General panel</Text>
      </TabPanel>
      <TabPanel value="appearance">
        <Text>Appearance panel</Text>
      </TabPanel>
      <TabPanel value="advanced">
        <Text>Advanced panel</Text>
      </TabPanel>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('selects the first enabled tab by default and links tabs to panels', async () => {
    const { getAllByRole, getByRole } = render(<BasicTabs />)

    await waitFor(() => {
      expect(getByRole('tab', { name: 'General' }).getAttribute('aria-selected')).toBe('true')
    })

    const tabs = getAllByRole('tab')
    const general = getByRole('tab', { name: 'General' })
    const generalPanel = getByRole('tabpanel', { name: 'General' })
    const appearance = getByRole('tab', { name: 'Appearance' })
    const appearancePanel = document.getElementById(appearance.getAttribute('aria-controls') ?? '')

    expect(getByRole('tablist').getAttribute('aria-orientation')).toBe('horizontal')
    expect(general.tabIndex).toBe(0)
    expect(tabs[1]?.tabIndex).toBe(-1)
    expect(tabs[2]?.getAttribute('aria-disabled')).toBe('true')
    expect(general.getAttribute('aria-controls')).toBe(generalPanel.id)
    expect(generalPanel.getAttribute('aria-labelledby')).toBe(general.id)
    expect(generalPanel.hidden).toBe(false)
    expect(generalPanel.style.display).toBe('')
    expect(appearancePanel?.hidden).toBe(true)
    expect(appearancePanel?.style.display).toBe('none')
  })

  it('honors defaultValue', () => {
    const { getByRole } = render(
      <Tabs defaultValue="appearance">
        <TabList>
          <Tab value="general">General</Tab>
          <Tab value="appearance">Appearance</Tab>
        </TabList>
        <TabPanel value="general">General panel</TabPanel>
        <TabPanel value="appearance">Appearance panel</TabPanel>
      </Tabs>,
    )

    expect(getByRole('tab', { name: 'Appearance' }).getAttribute('aria-selected')).toBe('true')
    expect(getByRole('tabpanel', { name: 'Appearance' }).hidden).toBe(false)
  })

  it('lets controlled value take precedence over defaultValue', () => {
    const { getByRole } = render(
      <Tabs value="appearance" defaultValue="general">
        <TabList>
          <Tab value="general">General</Tab>
          <Tab value="appearance">Appearance</Tab>
        </TabList>
        <TabPanel value="general">General panel</TabPanel>
        <TabPanel value="appearance">Appearance panel</TabPanel>
      </Tabs>,
    )

    expect(getByRole('tab', { name: 'Appearance' }).getAttribute('aria-selected')).toBe('true')
    expect(getByRole('tab', { name: 'Appearance' }).tabIndex).toBe(0)
  })

  it('supports uncontrolled click selection', async () => {
    const { getByRole } = render(<BasicTabs />)

    await waitFor(() => {
      expect(getByRole('tab', { name: 'General' }).getAttribute('aria-selected')).toBe('true')
    })

    fireEvent.click(getByRole('tab', { name: 'Appearance' }))

    expect(getByRole('tab', { name: 'Appearance' }).getAttribute('aria-selected')).toBe('true')
    expect(getByRole('tabpanel', { name: 'Appearance' }).hidden).toBe(false)
    expect(getByRole('tabpanel', { name: 'Appearance' }).style.display).toBe('')
    const general = getByRole('tab', { name: 'General' })
    const generalPanel = document.getElementById(general.getAttribute('aria-controls') ?? '')
    expect(generalPanel?.hidden).toBe(true)
    expect(generalPanel?.style.display).toBe('none')
  })

  it('supports controlled value requests without mutating rejected state', () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(
      <Tabs value="general" onValueChange={onValueChange}>
        <TabList>
          <Tab value="general">General</Tab>
          <Tab value="appearance">Appearance</Tab>
        </TabList>
        <TabPanel value="general">General panel</TabPanel>
        <TabPanel value="appearance">Appearance panel</TabPanel>
      </Tabs>,
    )

    const appearance = getByRole('tab', { name: 'Appearance' })

    fireEvent.click(appearance)
    fireEvent.click(appearance)

    expect(onValueChange).toHaveBeenCalledTimes(2)
    expect(onValueChange).toHaveBeenNthCalledWith(1, 'appearance')
    expect(onValueChange).toHaveBeenNthCalledWith(2, 'appearance')
    expect(getByRole('tab', { name: 'General' }).getAttribute('aria-selected')).toBe('true')
    expect(appearance.getAttribute('aria-selected')).toBe('false')
  })

  it('automatically activates while roving horizontally and skips disabled tabs', async () => {
    const { getByRole } = render(<BasicTabs />)

    await waitFor(() => {
      expect(getByRole('tab', { name: 'General' }).getAttribute('aria-selected')).toBe('true')
    })

    const general = getByRole('tab', { name: 'General' })
    general.focus()
    fireEvent.keyDown(general, { key: 'ArrowRight' })

    const appearance = getByRole('tab', { name: 'Appearance' })
    expect(document.activeElement).toBe(appearance)
    expect(appearance.getAttribute('aria-selected')).toBe('true')

    fireEvent.keyDown(appearance, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(general)
    expect(general.getAttribute('aria-selected')).toBe('true')

    fireEvent.keyDown(general, { key: 'End' })
    expect(document.activeElement).toBe(appearance)

    fireEvent.keyDown(appearance, { key: 'Home' })
    expect(document.activeElement).toBe(general)
  })

  it('manual activation moves focus without selection until Enter or Space', async () => {
    const { getByRole } = render(<BasicTabs activation="manual" />)

    await waitFor(() => {
      expect(getByRole('tab', { name: 'General' }).getAttribute('aria-selected')).toBe('true')
    })

    const general = getByRole('tab', { name: 'General' })
    const appearance = getByRole('tab', { name: 'Appearance' })

    general.focus()
    fireEvent.keyDown(general, { key: 'ArrowRight' })

    expect(document.activeElement).toBe(appearance)
    expect(general.getAttribute('aria-selected')).toBe('true')
    expect(appearance.getAttribute('aria-selected')).toBe('false')
    expect(general.tabIndex).toBe(-1)
    expect(appearance.tabIndex).toBe(0)

    fireEvent.keyDown(appearance, { key: 'Enter' })
    expect(appearance.getAttribute('aria-selected')).toBe('true')

    fireEvent.keyDown(general, { key: ' ' })
    expect(general.getAttribute('aria-selected')).toBe('true')
  })

  it('uses vertical ArrowUp and ArrowDown navigation', async () => {
    const { getByRole } = render(<BasicTabs orientation="vertical" />)

    await waitFor(() => {
      expect(getByRole('tab', { name: 'General' }).getAttribute('aria-selected')).toBe('true')
    })

    const general = getByRole('tab', { name: 'General' })
    const appearance = getByRole('tab', { name: 'Appearance' })

    general.focus()
    fireEvent.keyDown(general, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(appearance)
    expect(appearance.getAttribute('aria-selected')).toBe('true')

    fireEvent.keyDown(appearance, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(general)

    fireEvent.keyDown(general, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(general)
  })

  it('applies Tabs theme variables and preserves viewProps escape hatches', () => {
    const theme = createTheme({
      components: {
        Tabs: {
          base: {
            indicatorThickness: 4,
          },
        },
      },
    })
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Tabs variant="pill" defaultValue="general" viewProps={{ data: { testid: 'tabs-root' } }}>
          <TabList>
            <Tab
              value="general"
              viewProps={{
                className: 'custom-tab',
                data: { testid: 'general-tab' },
              }}
            >
              General
            </Tab>
          </TabList>
          <TabPanel value="general">General panel</TabPanel>
        </Tabs>
      </ThemeProvider>,
    )

    const root = getByTestId('tabs-root')
    const tab = getByTestId('general-tab')
    const themeClass = [...root.classList].find((name) => name.startsWith('weave-tabs-theme-'))
    const runtimeStyle = (
      document.querySelector<HTMLStyleElement>(
        'style[data-weave-runtime-class="' + themeClass + '"]',
      )?.textContent ?? ''
    ).replace(/\s+/g, '')

    expect(themeClass).toBeDefined()
    expect(tab.classList.contains('custom-tab')).toBe(true)
    expect(runtimeStyle).toContain('--weave-tabs-indicator-thickness:4px')
    expect(runtimeStyle).not.toContain('--weave-tabs-pill-')
  })

  it('accepts indicatorThickness in pixels and renders one shared moving indicator', async () => {
    const { getByRole, getByTestId } = render(
      <Tabs
        indicatorThickness={5}
        defaultValue="general"
        viewProps={{ data: { testid: 'tabs-root' } }}
      >
        <TabList>
          <Tab value="general">General</Tab>
          <Tab value="appearance">Appearance</Tab>
        </TabList>
        <TabPanel value="general">General panel</TabPanel>
        <TabPanel value="appearance">Appearance panel</TabPanel>
      </Tabs>,
    )

    await waitFor(() => {
      expect(document.querySelectorAll('[data-weave-tab-indicator]')).toHaveLength(1)
    })

    expect(
      getByTestId('tabs-root').style.getPropertyValue('--weave-tabs-indicator-thickness'),
    ).toBe('5px')

    fireEvent.click(getByRole('tab', { name: 'Appearance' }))

    await waitFor(() => {
      expect(document.querySelectorAll('[data-weave-tab-indicator]')).toHaveLength(1)
    })
  })

  it.each(['underline', 'pill'] as const)(
    'moves the single shared %s indicator through View layoutAnimation',
    async (variant) => {
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
        const element = this as HTMLElement

        if (element.dataset.weaveTabList !== undefined) {
          return {
            x: 0,
            y: 0,
            left: 0,
            top: 0,
            width: 240,
            height: 40,
            right: 240,
            bottom: 40,
            toJSON: () => ({}),
          } as DOMRect
        }

        if (element.dataset.weaveTabValue === 'general') {
          return {
            x: 0,
            y: 0,
            left: 0,
            top: 0,
            width: 100,
            height: 40,
            right: 100,
            bottom: 40,
            toJSON: () => ({}),
          } as DOMRect
        }

        if (element.dataset.weaveTabValue === 'appearance') {
          return {
            x: 100,
            y: 0,
            left: 100,
            top: 0,
            width: 120,
            height: 40,
            right: 220,
            bottom: 40,
            toJSON: () => ({}),
          } as DOMRect
        }

        if (element.dataset.weaveTabIndicator !== undefined) {
          const left = Number.parseFloat(element.style.left || '0')
          const top =
            element.dataset.weaveTabIndicatorVariant === 'pill'
              ? Number.parseFloat(element.style.top || '0')
              : 38
          const width = Number.parseFloat(element.style.width || '0')
          const height =
            element.dataset.weaveTabIndicatorVariant === 'pill'
              ? Number.parseFloat(element.style.height || '0')
              : 2

          return {
            x: left,
            y: top,
            left,
            top,
            width,
            height,
            right: left + width,
            bottom: top + height,
            toJSON: () => ({}),
          } as DOMRect
        }

        return {
          x: 0,
          y: 0,
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          right: 0,
          bottom: 0,
          toJSON: () => ({}),
        } as DOMRect
      })

      const animationTargets: HTMLElement[] = []
      const animate = vi.fn(function (
        this: HTMLElement,
        _keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
        _options?: number | KeyframeAnimationOptions,
      ) {
        animationTargets.push(this)
        return {
          cancel: vi.fn(),
          finish: vi.fn(),
          onfinish: null,
        } as unknown as Animation
      })

      Object.defineProperty(HTMLElement.prototype, 'animate', {
        configurable: true,
        writable: true,
        value: animate,
      })

      const { getByRole } = render(
        <Tabs defaultValue="general" variant={variant}>
          <TabList>
            <Tab value="general">General</Tab>
            <Tab value="appearance">Appearance</Tab>
          </TabList>
          <TabPanel value="general">General panel</TabPanel>
          <TabPanel value="appearance">Appearance panel</TabPanel>
        </Tabs>,
      )

      await waitFor(() => {
        const indicator = document.querySelector<HTMLElement>('[data-weave-tab-indicator]')
        expect(indicator?.style.left).toBe('0px')
        expect(indicator?.style.width).toBe('100px')
        if (variant === 'pill') {
          expect(indicator?.style.top).toBe('0px')
          expect(indicator?.style.height).toBe('40px')
        }
      })

      fireEvent.click(getByRole('tab', { name: 'Appearance' }))

      await waitFor(() => {
        expect(animate).toHaveBeenCalledTimes(1)
      })

      expect(document.querySelectorAll('[data-weave-tab-indicator]')).toHaveLength(1)
      expect(animationTargets[0]?.dataset.weaveTabIndicator).toBe('')
      expect(animate.mock.calls[0]?.[0]).toEqual([
        expect.objectContaining({
          translate: '-100px 0px',
        }),
        expect.objectContaining({
          translate: '0px 0px',
        }),
      ])
    },
  )

  it('reuses Select/Input for the pill groove and Button for the moving active surface', async () => {
    const theme = createTheme({
      components: {
        Input: {
          base: {
            background: 'warning',
          },
        },
        Button: {
          variants: {
            primary: {
              background: 'danger',
              depthColor: 'warning',
            },
          },
        },
      },
    })

    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <BasicTabs variant="pill" />
      </ThemeProvider>,
    )

    await waitFor(() => {
      expect(document.querySelector('[data-weave-tab-indicator]')).not.toBeNull()
    })

    const list = getByRole('tablist')
    const indicator = document.querySelector<HTMLElement>('[data-weave-tab-indicator]')

    expect(list.classList).toContain('weave-select')
    expect(runtimeRule(list, 'weave-props-')).toContain('--weave-width:fit-content;')
    expect(runtimeRule(list, 'weave-input-theme-')).toContain(
      '--weave-input-background:var(--weave-color-warning',
    )

    expect(indicator?.classList).toContain('weave-button')
    expect(indicator?.getAttribute('aria-disabled')).toBe('true')
    expect(indicator?.style.opacity).toBe('1')
    expect(indicator?.classList).toContain('weave-button--primary')
    expect(indicator?.classList).toContain('weave-button--medium')
    expect(runtimeRule(indicator!, 'weave-button-theme-')).toContain(
      '--weave-button-theme-primary-background:var(--weave-color-danger',
    )
    expect(runtimeRule(indicator!, 'weave-button-theme-')).toContain(
      '--weave-button-theme-primary-depth-color:var(--weave-color-warning',
    )

    expect(document.querySelector('style[data-weave-input-styles]')).not.toBeNull()
    expect(document.querySelector('style[data-weave-button-styles]')).not.toBeNull()
  })

  it('renders underline by default and pill when requested', async () => {
    const { getByRole, rerender } = render(<BasicTabs />)

    await waitFor(() => {
      expect(getByRole('tab', { name: 'General' }).getAttribute('aria-selected')).toBe('true')
    })

    const root = getByRole('tablist').closest('[data-weave-tabs]')

    expect(root?.getAttribute('data-weave-tabs-variant')).toBe('underline')

    rerender(<BasicTabs variant="pill" />)

    expect(
      getByRole('tablist').closest('[data-weave-tabs]')?.getAttribute('data-weave-tabs-variant'),
    ).toBe('pill')
  })
})
