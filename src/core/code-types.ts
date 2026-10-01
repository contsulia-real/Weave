import type { Ref } from 'react'
import type { BundledLanguage, LanguageRegistration } from 'shiki'
import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type CodeLanguage = BundledLanguage | 'custom'

export type CodeViewProps = Omit<ViewCoreProps<HTMLDivElement>, 'children'> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLDivElement>
  }

interface CodeBaseProps {
  children: string
  viewProps?: CodeViewProps
}

export type CodeProps =
  | (CodeBaseProps & {
      language: BundledLanguage
      syntax?: never
    })
  | (CodeBaseProps & {
      language: 'custom'
      syntax: LanguageRegistration
    })
