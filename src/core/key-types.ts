import type { ReactNode, Ref } from 'react'
import type { ButtonSize, ButtonVariant } from './button-types'
import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type KeyMetaKey = 'auto' | 'command' | 'windows' | 'meta'

export type KeyViewProps = Omit<ViewCoreProps<HTMLElement>, 'children'> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLElement>
  }

export interface KeyProps {
  value: ReactNode
  metaKey?: KeyMetaKey
  variant?: ButtonVariant
  size?: ButtonSize
  viewProps?: KeyViewProps
}
