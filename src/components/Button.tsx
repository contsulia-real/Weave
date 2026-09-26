import {
  isValidElement,
  useInsertionEffect,
} from 'react'
import type {
  ButtonIcon,
  ButtonProps,
  ButtonResponsiveProps,
} from '../core/button-types'
import type {
  IconComponent,
  IconSvg,
} from '../core/icon-types'
import type {
  ValidateDynamicBreakpointProps,
  ViewProps,
} from '../core/view-types'
import { breakpointEntries } from '../renderers/dom/breakpoint-utils'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ensureButtonStylesheet } from '../renderers/dom/button-stylesheet'
import { resolveButtonTheme } from '../renderers/dom/resolve-component-theme'
import { useTheme } from '../theme/theme-context'
import { Icon } from './Icon'
import { Text } from './Text'
import { ProgressVisual } from './Progress'
import { useViewHost } from './internal/use-view-host'

function iconContent(icon: ButtonIcon) {
  if (isValidElement(icon)) {
    return (
      <Icon
        svg={icon as IconSvg}
        size="medium"
        stroke="regular"
        viewProps={{
          width: '1em',
          height: '1em',
        }}
      />
    )
  }

  return (
    <Icon
      icon={icon as IconComponent}
      size="medium"
      stroke="regular"
      viewProps={{
        width: '1em',
        height: '1em',
      }}
    />
  )
}

function semanticContent(
  props: ButtonProps,
) {
  if ('children' in props && props.children !== undefined) {
    return props.children
  }

  const icon = props.icon
  const position = props.iconPosition ?? 'start'
  const iconNode = icon === undefined ? null : iconContent(icon)
  // The Button host establishes the active typo for its size.
  // Internal Text inherits that context so responsive size changes stay aligned.
  const textNode =
    props.text === undefined ? null : <Text>{props.text}</Text>

  return (
    <>
      {position === 'start' ? iconNode : null}
      {textNode}
      {position === 'end' ? iconNode : null}
    </>
  )
}

export function Button<
  TProps extends ButtonProps,
>(
  props: TProps &
    ValidateDynamicBreakpointProps<
      TProps,
      ButtonProps,
      ButtonResponsiveProps
    >,
) {
  const {
    variant = 'primary',
    size = 'medium',
    loading = false,
    viewProps = {},
  } = props

  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass(
    'button-theme',
    resolveButtonTheme(theme),
  )

  const hostProps: ViewProps<HTMLButtonElement> = {
    ...viewProps,
    disabled: loading || viewProps.disabled,
    busy: loading || undefined,
  }

  const {
    elementRef,
    className,
    inlineStyle,
    resolved,
  } = useViewHost(hostProps)

  useInsertionEffect(ensureButtonStylesheet, [])

  const responsiveAttributes: Record<string, string> = {}
  const propsRecord = props as Record<string, unknown>

  for (const breakpoint of breakpointEntries(theme.breakpoints)) {
    const value = propsRecord[
      breakpoint.name
    ] as ButtonResponsiveProps | undefined

    if (value?.variant !== undefined) {
      responsiveAttributes[
        `data-weave-button-${breakpoint.cssName}-variant`
      ] = value.variant
    }

    if (value?.size !== undefined) {
      responsiveAttributes[
        `data-weave-button-${breakpoint.cssName}-size`
      ] = value.size
    }
  }

  const disabled = loading || viewProps.disabled === true
  const iconOnly =
    'icon' in props &&
    props.icon !== undefined &&
    props.text === undefined

  return (
    <button
      {...resolved.domProps}
      {...responsiveAttributes}
      ref={elementRef}
      type="button"
      disabled={disabled}
      data-weave-view=""
      data-weave-button=""
      data-weave-button-variant={variant}
      data-weave-button-size={size}
      data-weave-button-loading={loading ? '' : undefined}
      data-weave-layout={resolved.layout}
      className={[
        'weave-button',
        `weave-button--${variant}`,
        `weave-button--${size}`,
        loading ? 'weave-button--loading' : undefined,
        iconOnly ? 'weave-button--icon-only' : undefined,
        themeClassName,
        className,
      ].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      <span className="weave-button__content">
        {semanticContent(props)}
      </span>

      {loading ? (
        <span className="weave-button__loader" aria-hidden="true">
          <ProgressVisual
            undetermined
            mode="spin"
            size="small"
            color="inherit"
            viewProps={{
              className: 'weave-button__progress',
              'aria-hidden': true,
            }}
          />
        </span>
      ) : null}
    </button>
  )
}
