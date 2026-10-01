import { cloneElement, isValidElement, useInsertionEffect, useMemo } from 'react'
import type { AppBarProps } from '../core/appbar-types'
import { ensureAppBarStylesheet } from '../renderers/dom/appbar-stylesheet'
import { resolveAppBarTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { useViewHost } from './internal/use-view-host'
import { Text } from './Text'

export function AppBar({
  leading,
  title,
  trailing,
  size = 'medium',
  mode = 'full',
  titleAlign = 'start',
  sticky = false,
  elevated = false,
  viewProps = {},
}: AppBarProps) {
  const { theme } = useTheme()
  const themeDeclarations = useMemo(() => resolveAppBarTheme(theme), [theme])
  const themeClassName = useRuntimeStyleClass('appbar-theme', themeDeclarations)
  const { elementRef, className, inlineStyle, resolved } = useViewHost(viewProps)

  useInsertionEffect(ensureAppBarStylesheet, [])

  if (!isValidElement(title) || title.type !== Text) {
    throw new TypeError('AppBar title must be a Text component')
  }

  const titleTypo = theme.components.AppBar?.sizes?.[size]?.titleTypo
  const resolvedTitle = cloneElement(title, {
    typo: title.props.typo ?? titleTypo,
  })

  return (
    <header
      {...resolved.domProps}
      ref={elementRef}
      data-weave-view=""
      data-weave-appbar=""
      data-weave-appbar-size={size}
      data-weave-appbar-mode={mode}
      data-weave-appbar-title-align={titleAlign}
      data-weave-appbar-sticky={sticky ? 'true' : 'false'}
      data-weave-appbar-elevated={elevated ? 'true' : 'false'}
      data-weave-layout={resolved.layout}
      className={['weave-appbar', themeClassName, className].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      <div className="weave-appbar__leading">{leading}</div>
      <div className="weave-appbar__title">{resolvedTitle}</div>
      <div className="weave-appbar__trailing">{trailing}</div>
    </header>
  )
}
