import type {
  ResolvedButton,
  ResolvedButtonBreakpoint,
} from '../../core/resolved-button'
import type { ResolvedView } from '../../core/resolved-view'
import type {
  ButtonSize,
  ButtonVariant,
} from '../../core/button-types'
import type {
  ResolvedTheme,
  ThemeScaleValue,
} from '../../theme/theme-types'
import type { ShadowDefinition } from '../../core/view-types'
import {
  compileDiCView,
  type DiCViewBreakpoint,
  type DiCViewNode,
  type DiCViewPaint,
} from './compile-view'

export interface CompileDiCButtonOptions {
  children?: readonly DiCViewNode[]
  onActivate?: () => void
}

function sizePaint(
  theme: ResolvedTheme,
  size: ButtonSize,
  iconOnly = false,
): DiCViewPaint {
  const sized = theme.components.Button?.sizes?.[size]

  return {
    minHeight: sized?.minHeight,
    minWidth:
      iconOnly
        ? sized?.minHeight
        : undefined,
    paddingTop: sized?.paddingY,
    paddingRight:
      iconOnly
        ? 0
        : sized?.paddingX,
    paddingBottom: sized?.paddingY,
    paddingLeft:
      iconOnly
        ? 0
        : sized?.paddingX,
    gap: sized?.gap,
  }
}

function depthShadow(
  depth: ThemeScaleValue | undefined,
  color: string | undefined,
): ShadowDefinition | undefined {
  if (
    depth === undefined ||
    color === undefined
  ) {
    return undefined
  }

  return {
    x: 0,
    y: depth,
    blur: 0,
    spread: 0,
    color,
  }
}

function variantPaint(
  theme: ResolvedTheme,
  variant: ButtonVariant,
): DiCViewPaint {
  const value =
    theme.components.Button?.variants?.[variant]

  return {
    background: value?.background,
    color: value?.color,
    borderTopColor: value?.borderColor,
    borderRightColor: value?.borderColor,
    borderBottomColor: value?.borderColor,
    borderLeftColor: value?.borderColor,
    shadow: depthShadow(
      theme.tokens.feedback?.restDepth,
      value?.depthColor,
    ),
  }
}

function negativeLength(
  value: ThemeScaleValue | undefined,
): ThemeScaleValue | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'number') return -value

  const input = value.trim()
  if (input.length === 0) return undefined
  if (input.startsWith('-')) return input.slice(1)
  return `-${input}`
}

function tactileTransform(
  theme: ResolvedTheme,
  state: 'hover' | 'active',
) {
  const feedback = theme.tokens.feedback
  if (state === 'hover') {
    const lift = negativeLength(
      feedback?.hoverLift,
    )
    const scale = feedback?.hoverScale

    return [
      ...(lift === undefined
        ? []
        : [{ translateY: lift } as const]),
      ...(scale === undefined
        ? []
        : [{ scale } as const]),
    ]
  }

  const offset = feedback?.pressOffset
  const scale = feedback?.pressScale

  return [
    ...(offset === undefined
      ? []
      : [{ translateY: offset } as const]),
    ...(scale === undefined
      ? []
      : [{ scale } as const]),
  ]
}

function componentBasePaint(
  theme: ResolvedTheme,
  button: ResolvedButton,
): DiCViewPaint {
  const base = theme.components.Button?.base

  return {
    layout: 'flex',
    direction: 'row',
    align: 'center',
    justify: 'center',
    ...sizePaint(
      theme,
      button.size,
      button.iconOnly,
    ),
    ...variantPaint(theme, button.variant),
    borderTop: base?.borderWidth,
    borderRight: base?.borderWidth,
    borderBottom: base?.borderWidth,
    borderLeft: base?.borderWidth,
    borderStyle: 'solid',
    radiusTopLeft: base?.radius,
    radiusTopRight: base?.radius,
    radiusBottomRight: base?.radius,
    radiusBottomLeft: base?.radius,
    cursor: base?.cursor,
  }
}

function stateDefaults(
  node: DiCViewNode,
  defaults: DiCViewPaint,
  user: DiCViewPaint | undefined,
): DiCViewPaint | undefined {
  const filtered = Object.fromEntries(
    Object.entries(defaults).filter(
      ([key, value]) =>
        value !== undefined &&
        node.paint[
          key as keyof DiCViewPaint
        ] === undefined,
    ),
  ) as DiCViewPaint

  const merged = {
    ...filtered,
    ...user,
  }

  return Object.keys(merged).length === 0
    ? undefined
    : merged
}

function responsiveState(
  baseNode: DiCViewNode,
  key: 'hover' | 'active',
  defaults: DiCViewPaint,
): DiCViewPaint | undefined {
  const user = baseNode.states[key]
  const output = Object.fromEntries(
    Object.entries(defaults).filter(
      ([property, value]) =>
        value !== undefined &&
        baseNode.paint[
          property as keyof DiCViewPaint
        ] === undefined &&
        user?.[
          property as keyof DiCViewPaint
        ] === undefined,
    ),
  ) as DiCViewPaint

  return Object.keys(output).length === 0
    ? undefined
    : output
}

function componentBreakpoint(
  theme: ResolvedTheme,
  breakpoint: ResolvedButtonBreakpoint,
  baseNode: DiCViewNode,
  disabled: boolean,
  iconOnly: boolean,
): DiCViewBreakpoint {
  const paint: DiCViewPaint = {
    ...(breakpoint.size === undefined
      ? {}
      : sizePaint(
          theme,
          breakpoint.size,
          iconOnly,
        )),
    ...(breakpoint.variant === undefined
      ? {}
      : variantPaint(theme, breakpoint.variant)),
  }

  for (const key of Object.keys(paint) as Array<
    keyof DiCViewPaint
  >) {
    if (baseNode.paint[key] !== undefined) {
      delete paint[key]
    }
  }

  const variant =
    breakpoint.variant === undefined
      ? undefined
      : theme.components.Button?.variants?.[
          breakpoint.variant
        ]

  return {
    name: breakpoint.name,
    minWidth: breakpoint.minWidth,
    scope: 'viewport',
    paint,
    states:
      disabled || variant === undefined
        ? undefined
        : {
            hover: responsiveState(
              baseNode,
              'hover',
              {
                background:
                  variant.hoverBackground,
                shadow: depthShadow(
                  theme.tokens.feedback?.hoverDepth,
                  variant.depthColor,
                ),
              },
            ),
            active: responsiveState(
              baseNode,
              'active',
              {
                background:
                  variant.activeBackground,
                shadow: depthShadow(
                  theme.tokens.feedback?.pressDepth,
                  variant.depthColor,
                ),
              },
            ),
          },
    typography:
      breakpoint.size === undefined
        ? undefined
        : {
            typo:
              theme.components.Button?.sizes?.[
                breakpoint.size
              ]?.typo,
          },
  }
}

export function compileDiCButton(
  view: ResolvedView,
  button: ResolvedButton,
  theme: ResolvedTheme,
  options: CompileDiCButtonOptions = {},
): DiCViewNode {
  let spacePressed = false

  const node = compileDiCView(
    view,
    {
      children: options.children,
      semantics: {
        role:
          view.semantics.role ??
          'button',
        disabled: button.disabled,
        busy:
          button.loading ||
          view.semantics.busy ||
          undefined,
      },
      typography: {
        typo:
          theme.components.Button?.sizes?.[
            button.size
          ]?.typo,
      },
      interaction: {
        focusable: !button.disabled,
        autoFocus:
          button.disabled
            ? false
            : view.interaction.autoFocus,
        tabIndex: view.interaction.tabIndex,
        onClick: () => {
          if (button.disabled) return
          options.onActivate?.()
        },
        onKeyDown: (event) => {
          if (button.disabled) return

          if (
            event.key === 'Enter' &&
            !event.repeat
          ) {
            event.preventDefault()
            options.onActivate?.()
            return
          }

          if (event.key === ' ') {
            event.preventDefault()
            spacePressed = true
          }
        },
        onKeyUp: (event) => {
          if (
            button.disabled ||
            event.key !== ' ' ||
            !spacePressed
          ) {
            return
          }

          event.preventDefault()
          spacePressed = false
          options.onActivate?.()
        },
        onBlur: () => {
          spacePressed = false
        },
      },
    },
  )

  const basePaint = componentBasePaint(
    theme,
    button,
  )
  const variant =
    theme.components.Button?.variants?.[
      button.variant
    ]
  const disabled =
    theme.components.Button?.states?.disabled

  const hoverDefaults: DiCViewPaint = button.disabled
    ? {}
    : {
        background: variant?.hoverBackground,
        transform:
          node.paint.transform === undefined
            ? tactileTransform(theme, 'hover')
            : undefined,
        shadow: depthShadow(
          theme.tokens.feedback?.hoverDepth,
          variant?.depthColor,
        ),
      }
  const activeDefaults: DiCViewPaint = button.disabled
    ? {}
    : {
        background: variant?.activeBackground,
        transform:
          node.paint.transform === undefined
            ? tactileTransform(theme, 'active')
            : undefined,
        shadow: depthShadow(
          theme.tokens.feedback?.pressDepth,
          variant?.depthColor,
        ),
      }
  const disabledDefaults: DiCViewPaint = {
    opacity: disabled?.opacity,
    cursor: disabled?.cursor,
  }
  const base =
    theme.components.Button?.base
  const focusVisibleDefaults: DiCViewPaint = {
    outlineWidth:
      base?.focusOutlineWidth,
    outlineColor:
      base?.focusOutlineColor,
    outlineStyle:
      base?.focusOutlineStyle,
    outlineOffset:
      base?.focusOutlineOffset,
  }

  return {
    ...node,
    paint: {
      ...basePaint,
      ...node.paint,
    },
    states: {
      ...node.states,
      hover: stateDefaults(
        node,
        hoverDefaults,
        node.states.hover,
      ),
      active: stateDefaults(
        node,
        activeDefaults,
        node.states.active,
      ),
      focusVisible: stateDefaults(
        node,
        focusVisibleDefaults,
        node.states.focusVisible,
      ),
      disabled: stateDefaults(
        node,
        disabledDefaults,
        node.states.disabled,
      ),
    },
    responsive: [
      ...button.responsive.map((breakpoint) =>
        componentBreakpoint(
          theme,
          breakpoint,
          node,
          button.disabled,
          button.iconOnly,
        ),
      ),
      ...node.responsive,
    ],
  }
}
