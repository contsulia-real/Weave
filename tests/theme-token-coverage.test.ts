import { describe, expect, it } from 'vitest'
import { defaultTheme } from '../src'
import {
  resolveAvatarTheme,
  resolveBadgeTheme,
  resolveChoiceControlTheme,
  resolveComboboxTheme,
  resolveDialogTheme,
  resolveDividerTheme,
  resolveDrawerTheme,
  resolveIconTheme,
  resolveLinkTheme,
  resolveListItemTheme,
  resolveMenuTheme,
  resolvePopoverTheme,
  resolveSelectTheme,
  resolveSliderTheme,
  resolveSwitchTheme,
  resolveToolTipTheme,
} from '../src/renderers/dom/resolve-component-theme'

describe('component visual theme coverage', () => {
  it('routes Avatar default size through Avatar theme', () => {
    expect(resolveAvatarTheme(defaultTheme)['--weave-avatar-theme-default-size']).toBe('2.5rem')
  })

  it('routes Badge motion geometry through Badge theme', () => {
    expect(resolveBadgeTheme(defaultTheme)).toMatchObject({
      '--weave-badge-theme-motion-distance': '0.5rem',
      '--weave-badge-theme-motion-diagonal': '0.35rem',
      '--weave-badge-theme-enter-scale': 0.65,
      '--weave-badge-theme-overshoot-scale': 1.08,
      '--weave-badge-theme-exit-scale': 0.72,
    })
  })

  it('routes Radio press feedback through Radio theme', () => {
    expect(resolveChoiceControlTheme(defaultTheme, 'radio', 'medium')).toMatchObject({
      '--weave-choice-press-offset': '0.03125rem',
      '--weave-choice-press-scale': 0.94,
      '--weave-choice-state-layer-rest-scale': 0.72,
    })
  })

  it('routes Checkbox press feedback through Checkbox theme', () => {
    expect(resolveChoiceControlTheme(defaultTheme, 'checkbox', 'medium')).toMatchObject({
      '--weave-choice-press-offset': '0.03125rem',
      '--weave-choice-press-scale': 0.94,
      '--weave-choice-state-layer-rest-scale': 0.72,
    })
  })

  it('routes Combobox empty-state padding and listbox motion through Combobox theme', () => {
    expect(resolveComboboxTheme(defaultTheme)).toMatchObject({
      '--weave-combobox-empty-padding-x': '0.75rem',
      '--weave-combobox-empty-padding-y': '0.625rem',
      '--weave-option-listbox-enter-scale': 0.98,
      '--weave-option-listbox-exit-scale': 0.985,
    })
  })

  it('routes ComboboxOption text spacing through option theme', () => {
    expect(resolveComboboxTheme(defaultTheme)['--weave-option-text-gap']).toBe('0.125rem')
  })

  it('routes Divider default thickness through Divider theme', () => {
    expect(resolveDividerTheme(defaultTheme)['--weave-divider-theme-thickness']).toBe('1px')
  })

  it('routes Icon semantic sizes through Icon theme', () => {
    expect(resolveIconTheme(defaultTheme, 'small')['--weave-icon-theme-size']).toBe('0.875rem')
    expect(resolveIconTheme(defaultTheme, 'medium')['--weave-icon-theme-size']).toBe('1rem')
    expect(resolveIconTheme(defaultTheme, 'large')['--weave-icon-theme-size']).toBe('1.25rem')
    expect(resolveIconTheme(defaultTheme, 'xlarge')['--weave-icon-theme-size']).toBe('1.5rem')
  })

  it('routes Link underline state widths through Link theme', () => {
    expect(resolveLinkTheme(defaultTheme)).toMatchObject({
      '--weave-link-theme-underline-width': '45%',
      '--weave-link-theme-underline-hover-width': '60%',
      '--weave-link-theme-underline-active-width': '80%',
    })
  })

  it('routes ListItem text spacing through ListItem theme', () => {
    expect(resolveListItemTheme(defaultTheme)['--weave-list-item-text-gap']).toBe('0.125rem')
  })

  it('routes Menu popup scales through Menu theme', () => {
    expect(resolveMenuTheme(defaultTheme)).toMatchObject({
      '--weave-menu-enter-scale': 0.98,
      '--weave-menu-exit-scale': 0.985,
    })
  })

  it('routes MenuItem text spacing through Menu item theme', () => {
    expect(resolveMenuTheme(defaultTheme)['--weave-menu-item-text-gap']).toBe('0.125rem')
  })

  it('routes Select listbox motion through Select theme', () => {
    expect(resolveSelectTheme(defaultTheme)).toMatchObject({
      '--weave-option-listbox-enter-scale': 0.98,
      '--weave-option-listbox-exit-scale': 0.985,
    })
  })

  it('routes SelectOption text spacing through option theme', () => {
    expect(resolveSelectTheme(defaultTheme)['--weave-option-text-gap']).toBe('0.125rem')
  })

  it('routes Slider field geometry and active-track shadow through Slider theme', () => {
    expect(resolveSliderTheme(defaultTheme, 'medium')).toMatchObject({
      '--weave-slider-field-gap': '0.5rem',
      '--weave-slider-width': '16rem',
      '--weave-slider-active-track-shadow':
        '0 0.125rem 0 color-mix(in srgb, var(--weave-slider-fill-color) 72%, black)',
    })
  })

  it('routes Switch field spacing through Switch theme', () => {
    expect(resolveSwitchTheme(defaultTheme, 'medium')['--weave-switch-field-gap']).toBe('0.5rem')
  })

  it('routes Dialog popup scales through Dialog theme', () => {
    expect(resolveDialogTheme(defaultTheme)).toMatchObject({
      '--weave-dialog-enter-scale': 0.97,
      '--weave-dialog-exit-scale': 0.98,
    })
  })

  it('routes Drawer surface visuals through Drawer theme', () => {
    expect(resolveDrawerTheme(defaultTheme)).toMatchObject({
      '--weave-drawer-background': 'var(--weave-color-surface, surface)',
      '--weave-drawer-border-width': '0.0625rem',
      '--weave-drawer-padding-x': '1rem',
      '--weave-drawer-padding-y': '1rem',
      '--weave-drawer-shadow': 'var(--weave-shadow-large)',
    })
  })

  it('routes Popover popup scales through Popover theme', () => {
    expect(resolvePopoverTheme(defaultTheme)).toMatchObject({
      '--weave-popover-enter-scale': 0.97,
      '--weave-popover-exit-scale': 0.98,
    })
  })

  it('routes ToolTip popup scales through ToolTip theme', () => {
    expect(resolveToolTipTheme(defaultTheme)).toMatchObject({
      '--weave-tooltip-enter-scale': 0.985,
      '--weave-tooltip-exit-scale': 0.99,
    })
  })
})
