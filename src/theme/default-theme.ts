import type { ResolvedTheme } from './theme-types'

const controlBaseline = {
  radius: 0.75,
  borderWidth: 0.0625,
  focusOutlineWidth: 0.125,
  focusOutlineColor: 'focus',
  focusOutlineStyle: 'solid',
  focusOutlineOffset: 0.0625,
} as const

const controlMedium = {
  minHeight: 2.5,
  fontSize: 1,
} as const

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
      secondary: '#8f8881',
      tertiary: '#625c56',
      disabled: '#aaa39d',
      surface: '#fffdfa',
      surfaceHover: '#f7f2ec',
      success: '#20a464',
      warning: '#d78b00',
      danger: '#d94040',
      outline: '#d8cec4',
      focus: '#6d5dfc',
    },
    typography: {
      family: {
        body:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        mono:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
      },
      size: {
        xsmall: 0.75,
        compact: 0.8125,
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
      lineHeight: {
        tight: 1.15,
        compact: 1.25,
        body: 1.5,
        relaxed: 1.65,
      },
      letterSpacing: {
        tight: '-0.015em',
        normal: '0em',
        wide: '0.02em',
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
    feedback: {
      restDepth: 0.1875,
      hoverDepth: 0.25,
      hoverLift: 0.0625,
      pressDepth: 0.0625,
      pressOffset: 0.125,
      hoverScale: 1.03,
      pressScale: 0.985,
      dragScale: 1.08,
    },
    motion: {
      duration: {
        instant: 80,
        fast: 120,
        normal: 200,
        slow: 320,
      },
      curve: {
        linear: 'linear',
        standard: [0.2, 0, 0, 1],
        emphasized: [0.2, 0, 0, 1],
        spring: [0.16, 1.22, 0.3, 1],
        enter: [0, 0, 0, 1],
        exit: [0.3, 0, 1, 1],
      },
    },
  },
  components: {
    Button: {
      base: {
        ...controlBaseline,
        cursor: 'pointer',
        fontWeight: 600,
      },
      sizes: {
        small: {
          minHeight: 1.75,
          paddingX: 0.625,
          paddingY: 0.3125,
          gap: 0.3125,
          fontSize: 'var(--weave-typography-size-compact)',
        },
        medium: {
          minHeight: 2.125,
          paddingX: 0.75,
          paddingY: 0.4375,
          gap: 0.375,
          fontSize: 'var(--weave-typography-size-small)',
        },
        large: {
          ...controlMedium,
          paddingX: 1,
          paddingY: 0.625,
          gap: 0.5,
          fontSize: 'var(--weave-typography-size-medium)',
        },
      },
      variants: {
        primary: {
          background: 'primary',
          color: 'onPrimary',
          borderColor: 'primary',
          depthColor:
            'color-mix(in srgb, var(--weave-color-primary) 72%, black)',
          hoverBackground: 'primaryHover',
          activeBackground: 'primaryActive',
        },
        secondary: {
          background: 'surface',
          color: 'inherit',
          borderColor: 'outline',
          depthColor:
            'color-mix(in srgb, var(--weave-color-outline) 76%, #8f8377)',
          hoverBackground: 'surfaceHover',
          activeBackground:
            'color-mix(in srgb, var(--weave-color-outline) 65%, var(--weave-color-surface))',
        },
        tertiary: {
          background: 'surfaceHover',
          color: 'inherit',
          borderColor: 'outline',
          depthColor:
            'color-mix(in srgb, var(--weave-color-outline) 70%, #8f8377)',
          hoverBackground:
            'color-mix(in srgb, var(--weave-color-outline) 42%, var(--weave-color-surface))',
          activeBackground:
            'color-mix(in srgb, var(--weave-color-outline) 68%, var(--weave-color-surface))',
        },
        ghost: {
          background: 'transparent',
          color: 'inherit',
          borderColor: 'transparent',
          depthColor: 'transparent',
          hoverBackground: 'surfaceHover',
          activeBackground:
            'color-mix(in srgb, var(--weave-color-outline) 60%, transparent)',
        },
        danger: {
          background:
            'color-mix(in srgb, var(--weave-color-danger) 10%, var(--weave-color-surface))',
          color: 'danger',
          borderColor:
            'color-mix(in srgb, var(--weave-color-danger) 28%, var(--weave-color-surface))',
          depthColor:
            'color-mix(in srgb, var(--weave-color-danger) 48%, #8f8377)',
          hoverBackground:
            'color-mix(in srgb, var(--weave-color-danger) 15%, var(--weave-color-surface))',
          activeBackground:
            'color-mix(in srgb, var(--weave-color-danger) 21%, var(--weave-color-surface))',
        },
      },
      states: {
        disabled: {
          opacity: 0.5,
          cursor: 'default',
        },
      },
    },
    Input: {
      base: {
        ...controlBaseline,
        ...controlMedium,
        background: 'surface',
        color: 'inherit',
        placeholderColor: 'secondary',
        borderColor: 'outline',
        paddingX: 0.875,
        paddingY: 0.625,
        fontSize: 'var(--weave-typography-size-medium)',
        lineHeight: 'var(--weave-typography-line-height-body)',
      },
      states: {
        disabled: {
          opacity: 0.5,
          cursor: 'default',
        },
      },
    },
    Switch: {
      base: {
        background:
          'color-mix(in srgb, var(--weave-color-outline) 18%, var(--weave-color-surface))',
        radius: 'full',
        cursor: 'pointer',
        trackShadow:
          'inset 0 0.0625rem 0.125rem rgb(58 48 40 / 0.10), inset 0 0 0 0.0625rem rgb(58 48 40 / 0.05)',
        thumbBackground: 'surface',
        thumbRadius: 'full',
        thumbInset: 0.125,
        thumbShadow:
          '0 0.0625rem 0.125rem rgb(58 48 40 / 0.18), 0 0.125rem 0.25rem rgb(58 48 40 / 0.08)',
        thumbDragShrink: 0.68,
        thumbDragMaxWidth: 1.35,
        focusOutlineWidth: 0.125,
        focusOutlineColor: 'focus',
        focusOutlineStyle: 'solid',
        focusOutlineOffset: controlBaseline.focusOutlineOffset,
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
        color:
          'color-mix(in srgb, var(--weave-color-secondary) 72%, transparent)',
        hoverColor:
          'color-mix(in srgb, var(--weave-color-secondary) 88%, transparent)',
        dragColor: 'var(--weave-color-secondary)',
        trackColor:
          'color-mix(in srgb, var(--weave-color-secondary) 12%, transparent)',
        radius: 'full',
        opacity: 1,
        hitSize: 1,
        thumbCursor: 'pointer',
      },
      sizes: {
        small: {
          thickness: 0.25,
        },
        medium: {
          thickness: 0.375,
        },
        large: {
          thickness: 0.5,
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
