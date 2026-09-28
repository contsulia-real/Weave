import type {
  AnchorHTMLAttributes,
  ReactNode,
  Ref,
} from 'react'
import type {
  ViewCoreProps,
  ViewDynamicBreakpointProps,
} from './view-types'

export type LinkTarget =
  AnchorHTMLAttributes<HTMLAnchorElement>['target']

export type LinkViewProps = Omit<
  ViewCoreProps<HTMLAnchorElement>,
  'children'
> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLAnchorElement>
  }

export interface LinkProps {
  href: string
  text?: ReactNode
  hideIcon?: boolean
  target?: LinkTarget
  viewProps?: LinkViewProps
}
