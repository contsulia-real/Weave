import type { ResolvedTheme } from './theme-types'

export const defaultBreakpoints = {
  sm: 40,
  md: 48,
  lg: 64,
  xl: 80,
} as const

export type DefaultBreakpointName = keyof typeof defaultBreakpoints

export const defaultTheme: ResolvedTheme = {
  tokens: {
    color: {
      primary: '#6d5dfc',
      onPrimary: '#ffffff',
      primaryHover: '#5f50e8',
      primaryActive: '#5144d4',
      secondary: '#8b8b96',
      tertiary: '#71717a',
      disabled: '#a1a1aa',
      surface: '#ffffff',
      surfaceHover: '#f5f5f7',
      success: '#20a464',
      warning: '#d78b00',
      danger: '#d94040',
      outline: '#d8d8df',
      focus: '#6d5dfc',
    },
    typography: {
      size: {
        xsmall: 0.75,
        small: 0.875,
        medium: 1,
        large: 1.25,
        xlarge: 1.5,
        xxlarge: 2,
      },
      weight: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      small: 0.5,
      medium: 1,
      large: 1.5,
    },
    radius: {
      small: 0.375,
      medium: 0.75,
      large: 1,
      full: '9999px',
    },
    shadow: {
      small: '0 0.125rem 0.375rem rgb(0 0 0 / 0.08)',
      medium: '0 0.5rem 1.5rem rgb(0 0 0 / 0.12)',
      large: '0 1rem 3rem rgb(0 0 0 / 0.16)',
    },
    motion: {
      duration: {
        fast: 120,
        normal: 200,
        slow: 320,
      },
      curve: {
        linear: 'linear',
        standard: [0.2, 0, 0, 1],
        emphasized: [0.2, 0, 0, 1],
        enter: [0, 0, 0, 1],
        exit: [0.3, 0, 1, 1],
      },
    },
  },
  components: {
    Switch: {
      base: {
        background: 'outline',
        radius: 'full',
        cursor: 'pointer',
        thumbBackground: 'surface',
        thumbRadius: 'full',
        thumbInset: 0.125,
        focusOutlineWidth: 0.125,
        focusOutlineColor: 'focus',
        focusOutlineStyle: 'solid',
        focusOutlineOffset: 0.125,
      },
      sizes: {
        small: {
          width: 2,
          height: 1.125,
          thumbSize: 0.875,
          shift: 0.875,
        },
        medium: {
          width: 2.5,
          height: 1.5,
          thumbSize: 1.25,
          shift: 1,
        },
        large: {
          width: 3,
          height: 1.75,
          thumbSize: 1.5,
          shift: 1.25,
        },
      },
      states: {
        checked: {
          background: 'primary',
        },
        disabled: {
          opacity: 0.5,
          cursor: 'default',
        },
      },
    },
    Progress: {
      base: {
        trackColor: 'color-mix(in srgb, currentColor 16%, transparent)',
        linearRadius: 'full',
      },
      sizes: {
        small: {
          spinSize: 1.125,
          spinThickness: 0.125,
          linearWidth: 6,
          linearHeight: 0.25,
        },
        medium: {
          spinSize: 1.5,
          spinThickness: 0.15625,
          linearWidth: 8,
          linearHeight: 0.375,
        },
        large: {
          spinSize: 2,
          spinThickness: 0.1875,
          linearWidth: 10,
          linearHeight: 0.5,
        },
      },
    },
    Scrollbar: {
      base: {
        color: 'secondary',
        trackColor:
          'color-mix(in srgb, var(--weave-color-secondary) 16%, transparent)',
        radius: 'full',
        opacity: 1,
        thumbCursor: 'pointer',
      },
      sizes: {
        small: {
          thickness: 0.375,
        },
        medium: {
          thickness: 0.5,
        },
        large: {
          thickness: 0.625,
        },
      },
    },
  },
  breakpoints: defaultBreakpoints,
  layers: {
    base: 0,
    raised: 10,
    overlay: 100,
    modal: 200,
    snack: 300,
    tooltip: 400,
  },
}
