import { createContext, useContext } from 'react'
import type { SemanticReference } from '../../core/view-types'

export interface FormFieldContextValue {
  labelId?: string
  descriptionId?: string
  errorId?: string
  required: boolean
  invalid: boolean
}

export const FormFieldContext = createContext<FormFieldContextValue | null>(null)

export function useFormFieldContext(): FormFieldContextValue | null {
  return useContext(FormFieldContext)
}

export function useRequiredFormFieldContext(component: string): FormFieldContextValue {
  const context = useFormFieldContext()

  if (context === null) {
    throw new Error(`${component} must be used inside FormField`)
  }

  return context
}

export function formFieldAssociationOverrides(
  context: FormFieldContextValue | null,
  labelledBy: SemanticReference | undefined,
  describedBy: SemanticReference | undefined,
) {
  if (context === null) return undefined

  return {
    labelledBy: [labelledBy, context.labelId],
    describedBy: [describedBy, context.descriptionId, context.errorId],
  } as const
}
