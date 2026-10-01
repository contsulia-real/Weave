import type { FormEventHandler, ReactNode, Ref } from 'react'
import type { TextHostElement } from './text-types'
import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type FormViewProps = Omit<
  ViewCoreProps<HTMLFormElement>,
  'children' | 'onSubmit' | 'onReset'
> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLFormElement>
  }

export type FormFieldViewProps = Omit<ViewCoreProps<HTMLDivElement>, 'children'> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLDivElement>
  }

export type FormTextViewProps = Omit<ViewCoreProps<TextHostElement>, 'children'> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<TextHostElement>
  }

export type FormFieldsetViewProps = Omit<ViewCoreProps<HTMLFieldSetElement>, 'children'> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLFieldSetElement>
  }

export type FormLegendViewProps = Omit<ViewCoreProps<HTMLLegendElement>, 'children'> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLLegendElement>
  }

export interface FormProps {
  children: ReactNode
  onSubmit?: FormEventHandler<HTMLFormElement>
  onReset?: FormEventHandler<HTMLFormElement>
  viewProps?: FormViewProps
}

export interface FormFieldProps {
  children: ReactNode
  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
  required?: boolean
  viewProps?: FormFieldViewProps
}

export interface FormLabelProps {
  children: ReactNode
  viewProps?: FormTextViewProps
}

export interface FormDescriptionProps {
  children: ReactNode
  viewProps?: FormTextViewProps
}

export interface FormErrorProps {
  children: ReactNode
  viewProps?: FormTextViewProps
}

export interface FormFieldsetProps {
  children: ReactNode
  viewProps?: FormFieldsetViewProps
}

export interface FormLegendProps {
  children: ReactNode
  viewProps?: FormLegendViewProps
}
