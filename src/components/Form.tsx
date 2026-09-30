import { useInsertionEffect } from 'react'
import type { FormProps } from '../core/form-types'
import type { ViewProps } from '../core/view-types'
import { ensureFormStylesheet } from '../renderers/dom/form-stylesheet'
import { resolveFormTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { useViewHost } from './internal/use-view-host'

export function Form({ children, onSubmit, onReset, viewProps = {} }: FormProps) {
  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass('form-theme', resolveFormTheme(theme))
  const hostProps: ViewProps<HTMLFormElement> = {
    ...viewProps,
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)

  useInsertionEffect(ensureFormStylesheet, [])

  return (
    <form
      {...resolved.domProps}
      ref={elementRef}
      onSubmit={onSubmit}
      onReset={onReset}
      data-weave-view=""
      data-weave-form=""
      data-weave-layout={resolved.layout}
      className={['weave-form', themeClassName, className].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      {children}
    </form>
  )
}
