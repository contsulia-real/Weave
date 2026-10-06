import { useInsertionEffect } from 'react'
import type { FormFieldsetProps } from '../core/form-types'
import type { ViewProps } from '../core/view-types'
import { ensureFormStylesheet } from '../renderers/dom/form-stylesheet'
import { resolveFormTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { useViewHost } from './internal/use-view-host'

export function FormFieldset(props: FormFieldsetProps): import('react').JSX.Element {
  const { children, viewProps = {} } = props
  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass('form-theme', resolveFormTheme(theme))
  const hostProps: ViewProps<HTMLFieldSetElement> = {
    ...viewProps,
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)

  useInsertionEffect(ensureFormStylesheet, [])

  return (
    <fieldset
      {...resolved.domProps}
      ref={elementRef}
      data-weave-view=""
      data-weave-form-fieldset=""
      data-weave-layout={resolved.layout}
      className={['weave-form-fieldset', themeClassName, className].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      {children}
    </fieldset>
  )
}
