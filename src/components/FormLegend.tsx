import { useInsertionEffect } from 'react'
import type { FormLegendProps } from '../core/form-types'
import type { ViewProps } from '../core/view-types'
import { ensureFormStylesheet } from '../renderers/dom/form-stylesheet'
import { resolveFormTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { useViewHost } from './internal/use-view-host'

export function FormLegend({ children, viewProps = {} }: FormLegendProps) {
  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass('form-theme', resolveFormTheme(theme))
  const hostProps: ViewProps<HTMLLegendElement> = {
    ...viewProps,
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)

  useInsertionEffect(ensureFormStylesheet, [])

  return (
    <legend
      {...resolved.domProps}
      ref={elementRef}
      data-weave-view=""
      data-weave-form-legend=""
      data-weave-layout={resolved.layout}
      className={['weave-form-legend', themeClassName, className].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      {children}
    </legend>
  )
}
