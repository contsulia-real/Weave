import type { ReactNode } from 'react'

export type DocumentationPlaygroundValue = string | number | boolean

export type DocumentationPlaygroundControl =
  | {
      prop: string
      kind: 'boolean' | 'number' | 'text'
    }
  | {
      prop: string
      kind: 'select'
      options: readonly string[]
    }

export interface DocumentationPlaygroundOverrides {
  attributes: Record<string, DocumentationPlaygroundValue>
  viewProps: Record<string, DocumentationPlaygroundValue>
}

export interface DocumentationComponentDefinition {
  description: string
  controls: readonly DocumentationPlaygroundControl[]
  defaults: Record<string, DocumentationPlaygroundValue>
  render: (
    values: Record<string, DocumentationPlaygroundValue>,
    overrides: DocumentationPlaygroundOverrides,
  ) => ReactNode
}

export const sizeOptions = ['small', 'medium', 'large'] as const
export const axisOptions = ['horizontal', 'vertical'] as const
export const alignOptions = ['start', 'center', 'end', 'stretch'] as const
export const justifyOptions = [
  'start',
  'center',
  'end',
  'space-between',
  'space-around',
  'space-evenly',
] as const
export const flexDirectionOptions = ['row', 'row-reverse', 'column', 'column-reverse'] as const
export const placementOptions = [
  'top-left',
  'top',
  'top-right',
  'right',
  'bottom-right',
  'bottom',
  'bottom-left',
  'left',
] as const
export const imageFitOptions = ['contain', 'cover', 'fill', 'none', 'scale-down'] as const
export const imageLoadingOptions = ['lazy', 'eager'] as const
export const buttonVariantOptions = ['primary', 'secondary', 'tertiary', 'ghost', 'danger'] as const
export const appBarModeOptions = ['full', 'floating'] as const
export const textTypoOptions = [
  'display-small',
  'headline-small',
  'title-medium',
  'body-medium',
  'label-medium',
] as const
export const textWeightOptions = ['light', 'regular', 'medium', 'semibold', 'bold'] as const
export const textAlignOptions = ['start', 'center', 'end', 'justify'] as const
export const textCaseOptions = ['none', 'uppercase', 'lowercase', 'capitalize'] as const
export const inputTypeOptions = [
  'text',
  'password',
  'email',
  'number',
  'search',
  'tel',
  'url',
] as const
export const progressModeOptions = ['spin', 'linear'] as const
export const skeletonShapeOptions = ['rect', 'circle', 'text'] as const
export const tableAlignOptions = ['start', 'center', 'end'] as const
export const tooltipPlacementOptions = ['top', 'bottom', 'left', 'right'] as const
export const drawerSideOptions = ['left', 'right', 'top', 'bottom'] as const
export const drawerModeOptions = ['auto', 'modal', 'non-modal'] as const
export const tabsOrientationOptions = ['horizontal', 'vertical'] as const
export const tabsActivationOptions = ['automatic', 'manual'] as const
export const tabsVariantOptions = ['underline', 'pill'] as const
export const snackVariantOptions = ['default', 'success', 'warning', 'danger', 'info'] as const
export const snackPlacementOptions = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const
export const listOrientationOptions = ['vertical', 'horizontal'] as const
export const listSelectionOptions = ['none', 'single', 'multiple'] as const
export const themeModeOptions = ['light', 'dark', 'system'] as const
export const reducedMotionOptions = ['system', 'reduce', 'no-preference'] as const
export const splitCollapsibleOptions = ['false', 'start', 'end', 'both'] as const

export const booleanControl = (prop: string): DocumentationPlaygroundControl => ({
  prop,
  kind: 'boolean',
})
export const numberControl = (prop: string): DocumentationPlaygroundControl => ({
  prop,
  kind: 'number',
})
export const textControl = (prop: string): DocumentationPlaygroundControl => ({
  prop,
  kind: 'text',
})
export const selectControl = (
  prop: string,
  options: readonly string[],
): DocumentationPlaygroundControl => ({ prop, kind: 'select', options })

export function textValue(
  values: Record<string, DocumentationPlaygroundValue>,
  prop: string,
): string {
  return String(values[prop] ?? '')
}

export function numberValue(
  values: Record<string, DocumentationPlaygroundValue>,
  prop: string,
): number {
  const value = values[prop]
  return typeof value === 'number' ? value : Number(value)
}

export function booleanValue(
  values: Record<string, DocumentationPlaygroundValue>,
  prop: string,
): boolean {
  return values[prop] === true
}

export function optionValue<const T extends readonly string[]>(
  values: Record<string, DocumentationPlaygroundValue>,
  prop: string,
  options: T,
): T[number] {
  const value = String(values[prop])
  return (options.includes(value) ? value : options[0]) as T[number]
}

export function splitCollapsibleValue(values: Record<string, DocumentationPlaygroundValue>) {
  const value = optionValue(values, 'collapsible', splitCollapsibleOptions)
  return value === 'false' ? false : value
}

export const sampleImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"%3E%3Crect width="320" height="180" rx="24" fill="%238E8E93"/%3E%3Ccircle cx="92" cy="72" r="28" fill="%23FFFFFF"/%3E%3Cpath d="M34 150l72-62 45 38 38-32 97 56H34z" fill="%23FFFFFF"/%3E%3C/svg%3E'
