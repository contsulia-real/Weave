import type { FormDescriptionProps } from '../core/form-types'
import type { ViewProps } from '../core/view-types'
import { useRequiredFormFieldContext } from './internal/form-field-context'
import { useViewHost } from './internal/use-view-host'

export function FormDescription({ children, viewProps = {} }: FormDescriptionProps) {
  const field = useRequiredFormFieldContext('FormDescription')
  const hostProps: ViewProps<HTMLSpanElement> = {
    ...viewProps,
    id: field.descriptionId,
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)

  return (
    <span
      {...resolved.domProps}
      ref={elementRef}
      id={field.descriptionId}
      data-weave-view=""
      data-weave-form-description=""
      data-weave-layout={resolved.layout}
      className={['weave-form-description', className].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      {children}
    </span>
  )
}
