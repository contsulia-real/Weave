import type { ResolvedInput } from '../../core/resolved-input'
import type { ResolvedView } from '../../core/resolved-view'
import type { ResolvedTheme } from '../../theme/theme-types'
import {
  compileDiCView,
  type DiCInputContent,
  type DiCIntrinsicConstraints,
  type DiCIntrinsicEnvironment,
  type DiCIntrinsicSize,
  type DiCViewNode,
  type DiCViewPaint,
} from './compile-view'
import { applyDiCTextFont } from './text-layout'

function measureInput(
  input: ResolvedInput,
  constraints: DiCIntrinsicConstraints,
  environment: DiCIntrinsicEnvironment,
): DiCIntrinsicSize {
  const context = environment.context
  const typography = environment.typography

  if (
    context === undefined ||
    typography === undefined
  ) {
    throw new Error(
      'DiC Input measurement requires context and typography',
    )
  }

  applyDiCTextFont(
    context,
    {
      ...typography,
      align: 'start',
      wrap: 'nowrap',
      overflow: 'clip',
      case: 'none',
    },
  )

  const sample = '0'.repeat(20)
  const width =
    context.measureText(sample).width +
    Math.max(0, sample.length - 1) *
      typography.letterSpacing
  const rows =
    input.multiline
      ? Math.max(
          1,
          Math.floor(
            input.rows ?? 2,
          ),
        )
      : 1

  return {
    width: Math.min(
      constraints.maxWidth,
      width,
    ),
    height:
      typography.lineHeight *
      rows,
  }
}

function inputPaint(
  theme: ResolvedTheme,
): DiCViewPaint {
  const base =
    theme.components.Input?.base

  return {
    minHeight: base?.minHeight,
    paddingTop: base?.paddingY,
    paddingRight: base?.paddingX,
    paddingBottom: base?.paddingY,
    paddingLeft: base?.paddingX,
    background: base?.background,
    color: base?.color,
    borderTop: base?.borderWidth,
    borderRight: base?.borderWidth,
    borderBottom: base?.borderWidth,
    borderLeft: base?.borderWidth,
    borderTopColor: base?.borderColor,
    borderRightColor: base?.borderColor,
    borderBottomColor: base?.borderColor,
    borderLeftColor: base?.borderColor,
    borderStyle: 'solid',
    radiusTopLeft: base?.radius,
    radiusTopRight: base?.radius,
    radiusBottomRight: base?.radius,
    radiusBottomLeft: base?.radius,
    cursor: 'text',
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

export function compileDiCInput(
  view: ResolvedView,
  input: ResolvedInput,
  theme: ResolvedTheme,
  value: string,
  onChange?: (value: string) => void,
): DiCViewNode {
  const base =
    theme.components.Input?.base
  const disabled =
    theme.components.Input?.states?.disabled

  const content: DiCInputContent = {
    kind: 'input',
    input,
    value,
    onChange,
    selectionStart: value.length,
    selectionEnd: value.length,
    scrollLeft: 0,
    scrollTop: 0,
    focused: false,
  }

  const node = compileDiCView(
    view,
    {
      content,
      semantics: {
        disabled: input.disabled,
        readOnly: input.readOnly,
        required: input.required,
      },
      typography:
        base?.typo === undefined
          ? undefined
          : {
              typo: base.typo,
            },
      interaction: {
        focusable:
          input.disabled
            ? false
            : (
                view.interaction.focusable ??
                true
              ),
        autoFocus:
          input.disabled
            ? false
            : view.interaction.autoFocus,
        tabIndex: view.interaction.tabIndex,
      },
      measure: (constraints, environment) =>
        measureInput(
          input,
          constraints,
          environment,
        ),
    },
  )

  const focusColor =
    base?.focusOutlineColor

  return {
    ...node,
    paint: {
      ...inputPaint(theme),
      ...node.paint,
    },
    states: {
      ...node.states,
      focusVisible: stateDefaults(
        node,
        {
          borderTopColor: focusColor,
          borderRightColor: focusColor,
          borderBottomColor: focusColor,
          borderLeftColor: focusColor,
          outlineWidth:
            base?.focusOutlineWidth,
          outlineColor: focusColor,
          outlineStyle:
            base?.focusOutlineStyle,
          outlineOffset:
            base?.focusOutlineOffset,
        },
        node.states.focusVisible,
      ),
      disabled: stateDefaults(
        node,
        {
          opacity: disabled?.opacity,
          cursor: disabled?.cursor,
        },
        node.states.disabled,
      ),
    },
  }
}
