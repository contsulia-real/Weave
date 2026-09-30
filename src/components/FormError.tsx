import type { FormErrorProps } from '../core/form-types'
import type { ViewProps } from '../core/view-types'
import { useRequiredFormFieldContext } from './internal/form-field-context'
import { useViewHost } from './internal/use-view-host'

export function FormError({ children, viewProps = {} }: FormErrorProps) {
  const field = useRequiredFormFieldContext('FormError')
  const hostProps: ViewProps<HTMLSpanElement> = {
    ...viewProps,
    id: field.errorId,
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)

  return (
    <span
      {...resolved.domProps}
      ref={elementRef}
      id={field.errorId}
      data-weave-view=""
      data-weave-form-error=""
      data-weave-layout={resolved.layout}
      className={['weave-form-error', className].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      {children}
    </span>
  )
}
