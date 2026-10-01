import type { ResolvedTheme, ThemeOverride } from './theme-types'

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
} as const

const raisedSurfaceDepthColor =
  'color-mix(in srgb, var(--weave-color-outline) 76%, #8f8377)' as const

const secondaryRaisedSurface = {
  background: 'surface',
  borderColor: 'outline',
  depthColor: raisedSurfaceDepthColor,
  hoverBackground: 'surfaceHover',
  activeBackground:
    'color-mix(in srgb, var(--weave-color-outline) 65%, var(--weave-color-surface))',
} as const

const optionListboxBase = {
  background: 'surface',
  color: 'tertiary',
  borderColor: 'outline',
  borderWidth: 0.0625,
  radius: 'medium',
  padding: 0.25,
  gap: 0.25,
  minWidth: 12,
  maxWidth: 24,
  maxHeight: 20,
  shadow: 'medium',
  motionOffset: 0.25,
  enterScale: 0.98,
  exitScale: 0.985,
} as const

const optionItemBase = {
  background: 'transparent',
  activeBackground: 'surfaceHover',
  selectedBackground:
    'color-mix(in srgb, var(--weave-color-primary) 12%, var(--weave-color-surface))',
  color: 'tertiary',
  selectedColor: 'primary',
  secondaryColor: 'secondary',
  radius: 'small',
  paddingX: 0.75,
  paddingY: 0.5,
  gap: 0.625,
  iconSize: 1.125,
  checkSize: 1,
  textGap: 0.125,
  primaryTypo: 'body-medium',
  secondaryTypo: 'body-small',
  disabledOpacity: 0.5,
} as const

const inputBase = {
  ...controlBaseline,
  ...controlMedium,
  background: 'color-mix(in srgb, var(--weave-color-outline) 34%, var(--weave-color-surface))',
  shadow:
    'inset 0 0.125rem 0.1875rem rgb(58 48 40 / 0.24), inset 0 -0.0625rem 0 rgb(255 255 255 / 0.42)',
  color: 'inherit',
  placeholderColor: 'secondary',
  borderColor: 'outline',
  minWidth: 12,
  paddingX: 0.875,
  typo: 'body-large',
} as const

export const defaultBreakpoints = {
  sm: 40,
  md: 48,
  lg: 64,
  xl: 80,
} as const

export type DefaultBreakpointName = keyof typeof defaultBreakpoints

export const defaultDarkTheme: ThemeOverride = {
  tokens: {
    color: {
      primary: '#a99cff',
      onPrimary: '#1b1633',
      primaryHover: '#b8adff',
      primaryActive: '#9283f0',
      secondary: '#aaa3b5',
      tertiary: '#e9e5ef',
      disabled: '#716b78',
      surface: '#18161b',
      surfaceHover: '#242129',
      success: '#55d792',
      warning: '#f4b44c',
      danger: '#ff7272',
      outline: '#5b5262',
      focus: '#b8adff',
    },
    shadow: {
      small: '0 0.125rem 0.5rem rgb(0 0 0 / 0.32)',
      medium: '0 0.5rem 1.75rem rgb(0 0 0 / 0.42)',
      large: '0 1rem 3.5rem rgb(0 0 0 / 0.52)',
    },
  },
  components: {
    Form: {
      base: {
        formGap: 'var(--weave-spacing-medium)',
        fieldGap: 'var(--weave-spacing-small)',
        fieldsetGap: 'var(--weave-spacing-medium)',
        labelColor: 'tertiary',
        labelTypo: 'label-medium',
        descriptionColor: 'secondary',
        descriptionTypo: 'body-small',
        errorColor: 'danger',
        errorTypo: 'body-small',
        legendColor: 'tertiary',
        legendTypo: 'label-large',
      },
    },
    Button: {
      variants: {
        secondary: {
          depthColor: 'color-mix(in srgb, var(--weave-color-outline) 72%, black)',
        },
        tertiary: {
          depthColor: 'color-mix(in srgb, var(--weave-color-outline) 66%, black)',
        },
        danger: {
          depthColor: 'color-mix(in srgb, var(--weave-color-danger) 38%, black)',
        },
      },
    },
    Input: {
      base: {
        shadow:
          'inset 0 0.125rem 0.1875rem rgb(0 0 0 / 0.58), inset 0 -0.0625rem 0 rgb(255 255 255 / 0.045)',
      },
    },
    Tabs: {
      base: {
        tabHoverBackground: 'surfaceHover',
      },
    },
    Switch: {
      base: {
        trackShadow:
          'inset 0 0.125rem 0.1875rem rgb(0 0 0 / 0.58), inset 0 -0.0625rem 0 rgb(255 255 255 / 0.045)',
        thumbBackground: 'tertiary',
        thumbShadow:
          '0 0.0625rem 0.125rem rgb(0 0 0 / 0.52), 0 0.1875rem 0.375rem rgb(0 0 0 / 0.34), inset 0 0.0625rem 0 rgb(255 255 255 / 0.18)',
        thumbHoverShadow:
          '0 0.0625rem 0.125rem rgb(0 0 0 / 0.58), 0 0.25rem 0.5rem rgb(0 0 0 / 0.42), inset 0 0.0625rem 0 rgb(255 255 255 / 0.22)',
      },
    },
    Radio: {
      base: {
        shadow:
          '0 0.0625rem 0 rgb(0 0 0 / 0.58), inset 0 0.125rem 0.1875rem rgb(0 0 0 / 0.52), inset 0 -0.0625rem 0 rgb(255 255 255 / 0.05)',
        hoverShadow:
          '0 0.09375rem 0 rgb(0 0 0 / 0.64), inset 0 0.15625rem 0.21875rem rgb(0 0 0 / 0.60), inset 0 -0.0625rem 0 rgb(255 255 255 / 0.07)',
        pressShadow:
          '0 0.03125rem 0 rgb(0 0 0 / 0.52), inset 0 0.1875rem 0.25rem rgb(0 0 0 / 0.68), inset 0 -0.03125rem 0 rgb(255 255 255 / 0.04)',
        indicatorShadow:
          '0 0.0625rem 0.125rem rgb(0 0 0 / 0.46), 0 0.125rem 0.25rem rgb(0 0 0 / 0.28), inset 0 0.0625rem 0 rgb(255 255 255 / 0.18)',
      },
    },
    Checkbox: {
      base: {
        shadow:
          '0 0.0625rem 0 rgb(0 0 0 / 0.58), inset 0 0.125rem 0.1875rem rgb(0 0 0 / 0.52), inset 0 -0.0625rem 0 rgb(255 255 255 / 0.05)',
        hoverShadow:
          '0 0.09375rem 0 rgb(0 0 0 / 0.64), inset 0 0.15625rem 0.21875rem rgb(0 0 0 / 0.60), inset 0 -0.0625rem 0 rgb(255 255 255 / 0.07)',
        pressShadow:
          '0 0.03125rem 0 rgb(0 0 0 / 0.52), inset 0 0.1875rem 0.25rem rgb(0 0 0 / 0.68), inset 0 -0.03125rem 0 rgb(255 255 255 / 0.04)',
        indicatorShadow:
          '0 0.0625rem 0.125rem rgb(0 0 0 / 0.46), 0 0.125rem 0.25rem rgb(0 0 0 / 0.28), inset 0 0.0625rem 0 rgb(255 255 255 / 0.18)',
      },
      states: {
        checked: {
          shadow:
            '0 0.0625rem 0 rgb(0 0 0 / 0.48), inset 0 0.125rem 0.1875rem rgb(0 0 0 / 0.36), inset 0 -0.0625rem 0 rgb(255 255 255 / 0.12)',
        },
      },
    },
    Progress: {
      base: {
        trackShadow:
          'inset 0 0.0625rem 0.125rem rgb(0 0 0 / 0.42), inset 0 0 0 0.0625rem rgb(255 255 255 / 0.035)',
        valueShadow: '0 0.0625rem 0.125rem rgb(0 0 0 / 0.32), 0 0.125rem 0.25rem rgb(0 0 0 / 0.18)',
      },
    },
  },
}

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
        body: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
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
      styles: {
        'display-large': {
          fontSize: 3.5,
          fontWeight: 700,
          lineHeight: '1.05',
          letterSpacing: '-0.035em',
        },
        'display-medium': {
          fontSize: 3,
          fontWeight: 700,
          lineHeight: '1.08',
          letterSpacing: '-0.03em',
        },
        'display-small': {
          fontSize: 2.5,
          fontWeight: 700,
          lineHeight: '1.1',
          letterSpacing: '-0.025em',
        },
        'headline-large': {
          fontSize: 2,
          fontWeight: 600,
          lineHeight: '1.15',
          letterSpacing: '-0.015em',
        },
        'headline-medium': {
          fontSize: 1.75,
          fontWeight: 600,
          lineHeight: '1.18',
          letterSpacing: '-0.012em',
        },
        'headline-small': {
          fontSize: 1.5,
          fontWeight: 600,
          lineHeight: '1.22',
          letterSpacing: '-0.01em',
        },
        'title-large': {
          fontSize: 1.375,
          fontWeight: 600,
          lineHeight: '1.25',
          letterSpacing: '-0.005em',
        },
        'title-medium': {
          fontSize: 1.125,
          fontWeight: 600,
          lineHeight: '1.3',
          letterSpacing: '0em',
        },
        'title-small': {
          fontSize: 1,
          fontWeight: 600,
          lineHeight: '1.35',
          letterSpacing: '0em',
        },
        'body-large': {
          fontSize: 1,
          fontWeight: 400,
          lineHeight: '1.55',
          letterSpacing: '0em',
        },
        'body-medium': {
          fontSize: 0.875,
          fontWeight: 400,
          lineHeight: '1.5',
          letterSpacing: '0em',
        },
        'body-small': {
          fontSize: 0.75,
          fontWeight: 400,
          lineHeight: '1.45',
          letterSpacing: '0.005em',
        },
        'body-xsmall': {
          fontSize: 0.6875,
          fontWeight: 400,
          lineHeight: '1.35',
          letterSpacing: '0.005em',
        },
        'label-large': {
          fontSize: 0.875,
          fontWeight: 600,
          lineHeight: '1.25',
          letterSpacing: '0em',
        },
        'label-medium': {
          fontSize: 0.8125,
          fontWeight: 600,
          lineHeight: '1.25',
          letterSpacing: '0.005em',
        },
        'label-small': {
          fontSize: 0.75,
          fontWeight: 600,
          lineHeight: '1.25',
          letterSpacing: '0.01em',
        },
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
      spring: {
        standard: {
          stiffness: 280,
          damping: 24,
          mass: 1,
        },
        snappy: {
          stiffness: 420,
          damping: 30,
          mass: 0.9,
        },
        gentle: {
          stiffness: 180,
          damping: 22,
          mass: 1.1,
        },
      },
      animation: {
        pulse: {
          keyframes: [
            { at: 0, scale: 1, opacity: 1 },
            { at: 0.5, scale: 1.06, opacity: 0.82 },
            { at: 1, scale: 1, opacity: 1 },
          ],
          duration: 600,
          curve: 'standard',
        },
      },
    },
  },
  components: {
    SplitBox: {
      base: {
        thickness: '1px',
        hitSize: 1,
        color: 'outline',
        hoverColor: 'primary',
        activeColor: 'primaryActive',
        focusOutlineWidth: 0.125,
        focusOutlineColor: 'focus',
        focusOutlineStyle: 'solid',
        focusOutlineOffset: 0,
      },
    },
    Badge: {
      base: {
        background: 'primary',
        color: 'onPrimary',
        borderColor: 'surface',
        borderWidth: 0.125,
        radius: 'full',
        minHeight: 1.25,
        paddingX: 0.375,
        dotSize: 0.625,
        shadow: '0 0.0625rem 0.1875rem rgb(0 0 0 / 0.24)',
        motionDistance: 0.5,
        motionDiagonal: 0.35,
        enterScale: 0.65,
        overshootScale: 1.08,
        exitScale: 0.72,
        typo: 'label-small',
      },
    },
    Link: {
      base: {
        color: 'primary',
        gap: 0.25,
        iconSize: 0.875,
        underlineColor: 'primary',
        underlineThickness: 0.125,
        underlineOffset: 0.125,
        underlineWidth: '45%',
        underlineHoverWidth: '60%',
        underlineActiveWidth: '80%',
        focusOutlineWidth: 0.125,
        focusOutlineColor: 'focus',
        focusOutlineStyle: 'solid',
        focusOutlineOffset: controlBaseline.focusOutlineOffset,
      },
    },
    Button: {
      base: {
        ...controlBaseline,
        cursor: 'pointer',
      },
      sizes: {
        small: {
          minHeight: 1.75,
          paddingX: 0.625,
          paddingY: 0.3125,
          gap: 0.3125,
          typo: 'label-small',
        },
        medium: {
          minHeight: 2.125,
          paddingX: 0.75,
          paddingY: 0.4375,
          gap: 0.375,
          typo: 'label-medium',
        },
        large: {
          ...controlMedium,
          paddingX: 1,
          paddingY: 0.625,
          gap: 0.5,
          typo: 'label-large',
        },
      },
      variants: {
        primary: {
          background: 'primary',
          color: 'onPrimary',
          borderColor: 'primary',
          depthColor: 'color-mix(in srgb, var(--weave-color-primary) 72%, black)',
          hoverBackground: 'primaryHover',
          activeBackground: 'primaryActive',
        },
        secondary: {
          ...secondaryRaisedSurface,
          color: 'inherit',
        },
        tertiary: {
          background: 'surfaceHover',
          color: 'inherit',
          borderColor: 'outline',
          depthColor: 'color-mix(in srgb, var(--weave-color-outline) 70%, #8f8377)',
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
          activeBackground: 'color-mix(in srgb, var(--weave-color-outline) 60%, transparent)',
        },
        danger: {
          background:
            'color-mix(in srgb, var(--weave-color-danger) 10%, var(--weave-color-surface))',
          color: 'danger',
          borderColor:
            'color-mix(in srgb, var(--weave-color-danger) 28%, var(--weave-color-surface))',
          depthColor: 'color-mix(in srgb, var(--weave-color-danger) 48%, #8f8377)',
          hoverBackground:
            'color-mix(in srgb, var(--weave-color-danger) 15%, var(--weave-color-surface))',
          activeBackground:
            'color-mix(in srgb, var(--weave-color-danger) 21%, var(--weave-color-surface))',
        },
      },
      states: {
        disabled: {
          opacity: 0.5,
        },
      },
    },
    AppBar: {
      base: {
        background: 'surface',
        elevatedBackground: 'surfaceHover',
        borderColor: 'outline',
        borderWidth: 0.0625,
        radius: 'large',
        restDepth: 0.125,
        depthColor: raisedSurfaceDepthColor,
        floatingMargin: 1,
      },
      sizes: {
        small: {
          height: 3,
          marginX: 0.75,
          gap: 0.5,
          titleTypo: 'title-small',
        },
        medium: {
          height: 3.5,
          marginX: 1,
          gap: 0.75,
          titleTypo: 'title-medium',
        },
        large: {
          height: 4,
          marginX: 1.25,
          gap: 1,
          titleTypo: 'title-large',
        },
      },
    },
    Card: {
      base: {
        ...secondaryRaisedSurface,
        borderWidth: 0.0625,
        radius: 'large',
        padding: 1,
        restDepth: 0.125,
        hoverDepth: 0.1875,
        pressDepth: 0.03125,
        selectedBackground:
          'color-mix(in srgb, var(--weave-color-primary) 10%, var(--weave-color-surface))',
        selectedBorderColor: 'primary',
        cursor: 'pointer',
        focusOutlineWidth: 0.125,
        focusOutlineColor: 'focus',
        focusOutlineStyle: 'solid',
        focusOutlineOffset: controlBaseline.focusOutlineOffset,
      },
    },
    Input: {
      base: {
        ...inputBase,
        paddingY: 0.625,
      },
      states: {
        disabled: {
          opacity: 0.5,
        },
      },
    },
    Select: {
      base: {
        gap: 0.625,
        iconSize: 1,
      },
      listbox: {
        ...optionListboxBase,
      },
      option: {
        ...optionItemBase,
      },
    },
    Combobox: {
      base: {
        iconSize: 1,
        actionSize: 1.75,
        actionGap: 0.5,
        actionInset: inputBase.paddingX,
        emptyPaddingX: 0.75,
        emptyPaddingY: 0.625,
      },
      listbox: {
        ...optionListboxBase,
      },
      option: {
        ...optionItemBase,
      },
    },
    Slider: {
      base: {
        fieldGap: 0.5,
        width: 16,
        thumbBorderColor: 'outline',
        thumbBorderWidth: 0,
        activeTrackShadow:
          '0 0.125rem 0 color-mix(in srgb, var(--weave-slider-fill-color) 72%, black)',
      },
      sizes: {
        small: {
          trackHeight: 0.75,
          thumbSize: 1,
          thumbTrackGap: 0.28125,
        },
        medium: {
          trackHeight: 1,
          thumbSize: 1.25,
          thumbTrackGap: 0.375,
        },
        large: {
          trackHeight: 1.25,
          thumbSize: 1.5,
          thumbTrackGap: 0.46875,
        },
      },
    },
    Switch: {
      base: {
        fieldGap: 0.5,
        background:
          'color-mix(in srgb, var(--weave-color-outline) 34%, var(--weave-color-surface))',
        radius: 'full',
        cursor: 'pointer',
        trackShadow:
          'inset 0 0.0625rem 0.125rem rgb(58 48 40 / 0.10), inset 0 0 0 0.0625rem rgb(58 48 40 / 0.05)',
        thumbBackground: 'surface',
        thumbRadius: 'full',
        thumbInset: 0.125,
        thumbShadow:
          '0 0.0625rem 0.125rem rgb(58 48 40 / 0.18), 0 0.125rem 0.25rem rgb(58 48 40 / 0.08)',
        thumbHoverShadow:
          '0 0.0625rem 0.125rem rgb(58 48 40 / 0.22), 0 0.1875rem 0.375rem rgb(58 48 40 / 0.12)',
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
        },
      },
    },
    Radio: {
      base: {
        background: 'surface',
        borderColor: 'outline',
        borderWidth: 0.125,
        radius: 'full',
        cursor: 'pointer',
        pressOffset: 0.03125,
        pressScale: 0.94,
        stateLayerRestScale: 0.72,
        shadow:
          '0 0.0625rem 0 color-mix(in srgb, var(--weave-color-outline) 48%, transparent), inset 0 0.125rem 0.1875rem rgb(58 48 40 / 0.18), inset 0 -0.0625rem 0 rgb(255 255 255 / 0.48)',
        hoverShadow:
          '0 0.09375rem 0 color-mix(in srgb, var(--weave-color-outline) 54%, transparent), inset 0 0.125rem 0.1875rem rgb(58 48 40 / 0.22), inset 0 -0.0625rem 0 rgb(255 255 255 / 0.58)',
        pressShadow:
          '0 0.03125rem 0 color-mix(in srgb, var(--weave-color-outline) 42%, transparent), inset 0 0.1875rem 0.25rem rgb(58 48 40 / 0.28), inset 0 -0.03125rem 0 rgb(255 255 255 / 0.40)',
        indicatorShadow:
          '0 0.0625rem 0.125rem rgb(58 48 40 / 0.24), 0 0.125rem 0.25rem rgb(58 48 40 / 0.12), inset 0 0.0625rem 0 rgb(255 255 255 / 0.28)',
        stateLayerColor: 'secondary',
        stateLayerHoverOpacity: 0.1,
        stateLayerFocusOpacity: 0.14,
        stateLayerPressOpacity: 0.18,
        focusOutlineWidth: 0.125,
        focusOutlineColor: 'focus',
        focusOutlineStyle: 'solid',
        focusOutlineOffset: controlBaseline.focusOutlineOffset,
      },
      sizes: {
        small: {
          size: 1.125,
          indicatorSize: 0.5,
          markSize: 0.625,
          stateLayerSize: 2.125,
        },
        medium: {
          size: 1.375,
          indicatorSize: 0.625,
          markSize: 0.75,
          stateLayerSize: 2.375,
        },
        large: {
          size: 1.625,
          indicatorSize: 0.75,
          markSize: 0.875,
          stateLayerSize: 2.625,
        },
      },
      states: {
        checked: {
          background: 'surface',
          borderColor: 'primary',
          indicatorBackground: 'primary',
          indicatorColor: 'primary',
          stateLayerColor: 'primary',
        },
        disabled: {
          opacity: 0.5,
        },
      },
    },
    Checkbox: {
      base: {
        background: 'surface',
        borderColor: 'outline',
        borderWidth: 0.125,
        radius: 'small',
        cursor: 'pointer',
        pressOffset: 0.03125,
        pressScale: 0.94,
        stateLayerRestScale: 0.72,
        shadow:
          '0 0.0625rem 0 color-mix(in srgb, var(--weave-color-outline) 48%, transparent), inset 0 0.125rem 0.1875rem rgb(58 48 40 / 0.18), inset 0 -0.0625rem 0 rgb(255 255 255 / 0.48)',
        hoverShadow:
          '0 0.09375rem 0 color-mix(in srgb, var(--weave-color-outline) 54%, transparent), inset 0 0.125rem 0.1875rem rgb(58 48 40 / 0.22), inset 0 -0.0625rem 0 rgb(255 255 255 / 0.58)',
        pressShadow:
          '0 0.03125rem 0 color-mix(in srgb, var(--weave-color-outline) 42%, transparent), inset 0 0.1875rem 0.25rem rgb(58 48 40 / 0.28), inset 0 -0.03125rem 0 rgb(255 255 255 / 0.40)',
        indicatorShadow:
          '0 0.0625rem 0.125rem rgb(58 48 40 / 0.24), 0 0.125rem 0.25rem rgb(58 48 40 / 0.12), inset 0 0.0625rem 0 rgb(255 255 255 / 0.28)',
        stateLayerColor: 'secondary',
        stateLayerHoverOpacity: 0.1,
        stateLayerFocusOpacity: 0.14,
        stateLayerPressOpacity: 0.18,
        focusOutlineWidth: 0.125,
        focusOutlineColor: 'focus',
        focusOutlineStyle: 'solid',
        focusOutlineOffset: controlBaseline.focusOutlineOffset,
      },
      sizes: {
        small: {
          size: 1.125,
          markSize: 0.75,
          stateLayerSize: 2.125,
        },
        medium: {
          size: 1.375,
          markSize: 0.9375,
          stateLayerSize: 2.375,
        },
        large: {
          size: 1.625,
          markSize: 1.125,
          stateLayerSize: 2.625,
        },
      },
      states: {
        checked: {
          background: 'primary',
          borderColor: 'primaryActive',
          shadow:
            'inset 0 0.125rem 0.1875rem color-mix(in srgb, var(--weave-color-primaryActive) 28%, transparent), inset 0 -0.0625rem 0 rgb(255 255 255 / 0.18)',
          indicatorColor: 'onPrimary',
          stateLayerColor: 'primary',
        },
        disabled: {
          opacity: 0.5,
        },
      },
    },
    Avatar: {
      base: {
        defaultSize: 2.5,
        background: 'surfaceHover',
        color: 'tertiary',
        borderColor: 'outline',
        borderWidth: 0.0625,
      },
    },
    Divider: {
      base: {
        thickness: 1,
      },
    },
    Icon: {
      sizes: {
        small: { size: 0.875 },
        medium: { size: 1 },
        large: { size: 1.25 },
        xlarge: { size: 1.5 },
      },
    },
    Skeleton: {
      base: {
        background: 'color-mix(in srgb, currentColor 20%, transparent)',
        highlight: 'color-mix(in srgb, currentColor 32%, transparent)',
        radius: 'medium',
        textRadius: 'full',
        shimmerDuration: 1280,
      },
    },
    Progress: {
      base: {
        trackColor: 'color-mix(in srgb, currentColor 16%, transparent)',
        trackShadow:
          'inset 0 0.0625rem 0.125rem rgb(58 48 40 / 0.10), inset 0 0 0 0.0625rem rgb(58 48 40 / 0.04)',
        valueShadow:
          '0 0.0625rem 0.125rem rgb(58 48 40 / 0.14), 0 0.125rem 0.1875rem rgb(58 48 40 / 0.06)',
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
        color: 'color-mix(in srgb, var(--weave-color-secondary) 72%, transparent)',
        hoverColor: 'color-mix(in srgb, var(--weave-color-secondary) 88%, transparent)',
        dragColor: 'var(--weave-color-secondary)',
        radius: 'full',
        opacity: 1,
        hitSize: 1,
        hoverScale: 1.18,
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
    ToolTip: {
      base: {
        background: 'primary',
        color: 'onPrimary',
        borderColor: 'primary',
        borderWidth: 0.0625,
        radius: 'small',
        paddingX: 0.5,
        paddingY: 0.25,
        maxWidth: 16,
        shadow: 'small',
        arrowSize: 0.5,
        motionOffset: 0.1875,
        enterScale: 0.985,
        exitScale: 0.99,
        typo: 'body-xsmall',
      },
    },
    Dialog: {
      base: {
        background: 'surface',
        color: 'tertiary',
        borderColor: 'outline',
        borderWidth: 0.0625,
        radius: 'large',
        paddingX: 1,
        paddingY: 1,
        width: 28,
        maxWidth: 'calc(100vw - 2rem)',
        maxHeight: 'calc(100vh - 2rem)',
        shadow: 'large',
        depthColor: raisedSurfaceDepthColor,
        backdropColor: 'rgb(0 0 0 / 0.48)',
        motionOffset: 0.5,
        enterScale: 0.97,
        exitScale: 0.98,
      },
    },
    Drawer: {
      base: {
        background: 'surface',
        color: 'tertiary',
        borderColor: 'outline',
        borderWidth: 0.0625,
        radius: 'large',
        paddingX: 1,
        paddingY: 1,
        shadow: 'large',
        backdropColor: 'rgb(0 0 0 / 0.48)',
      },
    },
    Popover: {
      base: {
        background: 'surface',
        color: 'tertiary',
        borderColor: 'outline',
        borderWidth: 0.0625,
        radius: 'medium',
        paddingX: 0.75,
        paddingY: 0.75,
        minWidth: 12,
        maxWidth: 24,
        shadow: 'medium',
        motionOffset: 0.25,
        enterScale: 0.97,
        exitScale: 0.98,
      },
    },
    Menu: {
      base: {
        background: 'surface',
        color: 'tertiary',
        borderColor: 'outline',
        borderWidth: 0.0625,
        radius: 'medium',
        padding: 0.25,
        gap: 0,
        minWidth: 12,
        maxWidth: 22,
        shadow: 'medium',
        motionOffset: 0.25,
        enterScale: 0.98,
        exitScale: 0.985,
      },
      item: {
        background: 'transparent',
        hoverBackground: 'surfaceHover',
        activeBackground:
          'color-mix(in srgb, var(--weave-color-outline) 44%, var(--weave-color-surface))',
        color: 'tertiary',
        secondaryColor: 'secondary',
        dangerColor: 'danger',
        dangerBackground:
          'color-mix(in srgb, var(--weave-color-danger) 12%, var(--weave-color-surface))',
        radius: 'small',
        paddingX: 0.75,
        paddingY: 0.5,
        gap: 0.625,
        iconSize: 1.125,
        submenuIconSize: 1,
        textGap: 0.125,
        primaryTypo: 'body-medium',
        secondaryTypo: 'body-small',
        focusOutlineWidth: 0.125,
        focusOutlineColor: 'focus',
        focusOutlineStyle: 'solid',
        focusOutlineOffset: 0.0625,
        disabledOpacity: 0.5,
      },
    },
    Snack: {
      base: {
        background: 'surface',
        color: 'tertiary',
        borderColor: 'outline',
        borderWidth: 0.0625,
        radius: 'large',
        paddingX: 0.875,
        paddingY: 0.625,
        gap: 0.625,
        shadow: 'medium',
        iconSize: 1.625,
        progressHeight: 0.125,
        typo: 'body-medium',
        motionOffset: 0.5,
      },
      variants: {
        default: {
          accentColor: 'secondary',
        },
        success: {
          accentColor: 'success',
        },
        warning: {
          accentColor: 'warning',
        },
        danger: {
          accentColor: 'danger',
        },
        info: {
          accentColor: 'primary',
        },
      },
    },
    Accordion: {
      base: {
        dividerColor: 'outline',
        triggerBackground: 'transparent',
        triggerHoverBackground: 'surfaceHover',
        triggerOpenBackground: 'surfaceHover',
        triggerPressedBackground:
          'color-mix(in srgb, var(--weave-color-outline) 44%, var(--weave-color-surface))',
        triggerColor: 'tertiary',
        triggerPaddingX: 0.75,
        triggerPaddingY: 0.75,
        panelPaddingX: 0.75,
        panelPaddingY: 0.75,
        radius: 0,
        typo: 'label-medium',
        disabledOpacity: 0.5,
        focusOutlineWidth: 0.125,
        focusOutlineColor: 'focus',
        focusOutlineStyle: 'solid',
        focusOutlineOffset: 0.0625,
        indicatorSize: 1.25,
      },
    },
    Tabs: {
      base: {
        gap: 1,
        listGap: 0.25,
        tabBackground: 'transparent',
        tabHoverBackground: 'surface',
        tabColor: 'secondary',
        tabSelectedColor: 'primary',
        tabRadius: 'medium',
        tabPaddingX: 0.75,
        tabPaddingY: 0.5,
        indicatorColor: 'primary',
        indicatorThickness: 2,
        typo: 'label-medium',
        focusOutlineWidth: 0.125,
        focusOutlineColor: 'focus',
        focusOutlineStyle: 'solid',
        focusOutlineOffset: 0.0625,
        disabledOpacity: 0.5,
      },
    },
    List: {
      base: {
        background: 'surface',
        borderWidth: 0,
        radius: 'medium',
        padding: 0.25,
        gap: 0,
      },
    },
    ListItem: {
      base: {
        background: 'transparent',
        hoverBackground: 'surfaceHover',
        activeBackground:
          'color-mix(in srgb, var(--weave-color-outline) 44%, var(--weave-color-surface))',
        selectedBackground:
          'color-mix(in srgb, var(--weave-color-primary) 14%, var(--weave-color-surface))',
        selectedHoverBackground:
          'color-mix(in srgb, var(--weave-color-primary) 20%, var(--weave-color-surface))',
        color: 'tertiary',
        secondaryColor: 'secondary',
        selectedColor: 'primary',
        radius: 0,
        paddingX: 0.75,
        paddingY: 0.5625,
        gap: 0.625,
        iconSize: 1.125,
        textGap: 0.125,
        primaryTypo: 'body-medium',
        secondaryTypo: 'body-small',
        focusOutlineWidth: 0.125,
        focusOutlineColor: 'focus',
        focusOutlineStyle: 'solid',
        focusOutlineOffset: 0.0625,
        disabledOpacity: 0.5,
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
