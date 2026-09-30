import { Children, isValidElement, useId, useInsertionEffect, useMemo } from 'react'
import type { FormFieldProps } from '../core/form-types'
import type { ViewProps } from '../core/view-types'
import { ensureFormStylesheet } from '../renderers/dom/form-stylesheet'
import { resolveFormTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { FormDescription } from './FormDescription'
import { FormError } from './FormError'
import { FormLabel } from './FormLabel'
import { FormFieldContext } from './internal/form-field-context'
import { useViewHost } from './internal/use-view-host'

function hasDirectChild(children: FormFieldProps['children'], component: unknown): boolean {
  return Children.toArray(children).some(
    (child) => isValidElement(child) && child.type === component,
  )
}

function hasContent(value: FormFieldProps['description'] | FormFieldProps['error']): boolean {
  return value !== undefined && value !== null && value !== false && value !== ''
}

export function FormField({
  children,
  label,
  description,
  error,
  required = false,
  viewProps = {},
}: FormFieldProps) {
  const baseId = useId().replace(/:/g, '')
  const hasExplicitLabel = hasDirectChild(children, FormLabel)
  const hasExplicitDescription = hasDirectChild(children, FormDescription)
  const hasExplicitError = hasDirectChild(children, FormError)
  const hasLabel = hasContent(label) || hasExplicitLabel
  const hasDescription = hasContent(description) || hasExplicitDescription
  const hasError = hasContent(error) || hasExplicitError

  if (hasContent(label) && hasExplicitLabel) {
    throw new Error('FormField cannot use both label and FormLabel')
  }
  if (hasContent(description) && hasExplicitDescription) {
    throw new Error('FormField cannot use both description and FormDescription')
  }
  if (hasContent(error) && hasExplicitError) {
    throw new Error('FormField cannot use both error and FormError')
  }

  const contextValue = useMemo(
    () => ({
      labelId: hasLabel ? `weave-form-field-${baseId}-label` : undefined,
      descriptionId: hasDescription ? `weave-form-field-${baseId}-description` : undefined,
      errorId: hasError ? `weave-form-field-${baseId}-error` : undefined,
      required,
      invalid: hasError,
    }),
    [baseId, hasDescription, hasError, hasLabel, required],
  )

  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass('form-theme', resolveFormTheme(theme))
  const hostProps: ViewProps<HTMLDivElement> = {
    ...viewProps,
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)

  useInsertionEffect(ensureFormStylesheet, [])

  return (
    <FormFieldContext.Provider value={contextValue}>
      <div
        {...resolved.domProps}
        ref={elementRef}
        data-weave-view=""
        data-weave-form-field=""
        data-weave-form-field-required={required ? 'true' : 'false'}
        data-weave-form-field-invalid={hasError ? 'true' : 'false'}
        data-weave-layout={resolved.layout}
        className={['weave-form-field', themeClassName, className].filter(Boolean).join(' ')}
        style={inlineStyle}
      >
        {hasContent(label) ? <FormLabel>{label}</FormLabel> : null}
        {children}
        {hasContent(description) ? <FormDescription>{description}</FormDescription> : null}
        {hasContent(error) ? <FormError>{error}</FormError> : null}
      </div>
    </FormFieldContext.Provider>
  )
}
