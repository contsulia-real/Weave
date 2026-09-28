import { useInsertionEffect } from 'react'
import type { BadgeProps } from '../core/badge-types'
import type { ViewProps } from '../core/view-types'
import { ensureBadgeStylesheet } from '../renderers/dom/badge-stylesheet'
import { resolveBadgeTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { useBadgeAnchor } from './internal/use-badge-anchor'
import { useViewHost } from './internal/use-view-host'

export function Badge({
  children,
  placement = 'top-right',
  viewProps = {},
  ...content
}: BadgeProps) {
  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass(
    'badge-theme',
    resolveBadgeTheme(theme),
  )
  const hostProps: ViewProps<HTMLSpanElement> = viewProps
  const {
    elementRef,
    className,
    inlineStyle,
    resolved,
  } = useViewHost(hostProps)
  const dot = content.dot === true

  useBadgeAnchor(elementRef, children)
  useInsertionEffect(ensureBadgeStylesheet, [])

  return (
    <span
      {...resolved.domProps}
      ref={elementRef}
      data-weave-view=""
      data-weave-badge-anchor=""
      data-weave-badge-placement={placement}
      data-weave-layout={resolved.layout}
      className={[
        'weave-badge-anchor',
        themeClassName,
        className,
      ].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      {children}

      <span
        data-weave-badge=""
        data-weave-badge-dot={dot ? 'true' : 'false'}
        className={[
          'weave-badge',
          dot ? 'weave-badge--dot' : undefined,
        ].filter(Boolean).join(' ')}
        aria-hidden={dot ? true : undefined}
      >
        {dot ? null : content.text}
      </span>
    </span>
  )
}
