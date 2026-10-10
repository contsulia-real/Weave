import type { ReactNode } from 'react'
import type { ColumnProps } from './layout-types'

export interface StepperItem {
  /** Visible step label. */
  label: ReactNode
  /** Optional supporting text below the label. */
  description?: ReactNode
  /** Prevent selecting this step. */
  disabled?: boolean
}

export interface StepperProps {
  /** Ordered steps; indices start at 1. */
  steps: readonly StepperItem[]
  /** Controlled current step, numbered from 1. */
  step?: number
  /** Initial step when uncontrolled; defaults to 1. */
  defaultStep?: number
  /** Called when an enabled, different step is selected. */
  onStepChange?: (step: number) => void
  /** Visual arrangement; defaults to horizontal. */
  orientation?: 'horizontal' | 'vertical'
  /** Show progress without clickable controls. */
  readOnly?: boolean
  /** Disable all step controls. */
  disabled?: boolean
  /** Accessible navigation landmark name. */
  label?: string
  /** Layout props applied to the outer Weave Column. */
  viewProps?: Omit<ColumnProps, 'children' | 'role' | 'label'>
}
