import type {
  ReactNode,
  Ref,
} from 'react'
import type {
  ViewCoreProps,
  ViewDynamicBreakpointProps,
} from './view-types'

export type BadgePlacement =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left'

export type BadgeViewProps = Omit<
  ViewCoreProps<HTMLSpanElement>,
  'children'
> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLSpanElement>
  }

interface BadgeBaseProps {
  children: ReactNode
  placement?: BadgePlacement
  visible?: boolean
  viewProps?: BadgeViewProps
}

type BadgeTextContent = {
  dot?: false
  text: ReactNode
}

type BadgeDotContent = {
  dot: true
  text?: never
}

export type BadgeProps =
  BadgeBaseProps &
  (BadgeTextContent | BadgeDotContent)
