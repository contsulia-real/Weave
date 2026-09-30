import type { FormLabelProps } from '../core/form-types'
import type { ViewProps } from '../core/view-types'
import { useRequiredFormFieldContext } from './internal/form-field-context'
import { useViewHost } from './internal/use-view-host'

export function FormLabel({ children, viewProps = {} }: FormLabelProps) {
  const field = useRequiredFormFieldContext('FormLabel')
  const hostProps: ViewProps<HTMLSpanElement> = {
    ...viewProps,
    id: field.labelId,
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)

  return (
    <span
      {...resolved.domProps}
      ref={elementRef}
      id={field.labelId}
      data-weave-view=""
      data-weave-form-label=""
      data-weave-layout={resolved.layout}
      className={['weave-form-label', className].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      {children}
      {field.required ? (
        <span className="weave-form-required" aria-hidden="true">
          {' *'}
        </span>
      ) : null}
    </span>
  )
}
