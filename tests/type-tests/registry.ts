import type { ButtonProps, TextColor, TextProps, ViewProps } from '../../src'

declare global {
  namespace Weave {
    interface BreakpointRegistry {
      compact: true
      wide: true
    }

    interface ColorTokenRegistry {
      brandPurple: true
    }
  }
}

const viewProps: ViewProps = {
  compact: { width: 22 },
  containerWide: { gap: 3 },
  title: 'typed native attribute',
}

const textProps: TextProps = {
  children: 'Brand',
  color: 'brandPurple',
  compact: {
    color: 'brandPurple',
    size: 'large',
  },
}

const buttonProps: ButtonProps = {
  text: 'Responsive',
  compact: {
    size: 'large',
    variant: 'danger',
  },
}

const brandColor: TextColor = 'brandPurple'

// @ts-expect-error arbitrary breakpoint names require registry declaration
const invalidBreakpoint: ViewProps = { mystery: { width: 1 } }

// @ts-expect-error arbitrary primitive props are not a public View escape hatch
const invalidPrimitive: ViewProps = { mystery: 'leak' }

void [viewProps, textProps, buttonProps, brandColor, invalidBreakpoint, invalidPrimitive]
