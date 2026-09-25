import type {
  ElementType,
  ReactElement,
  Ref,
  SVGProps,
} from 'react'
import type {
  ViewCoreProps,
  ViewDynamicBreakpointProps,
} from './view-types'

export type IconSize = 'small' | 'medium' | 'large' | 'xlarge'
export type IconStroke = 'thin' | 'regular' | 'bold'

export type IconComponent = ElementType

export type IconSvg = ReactElement<SVGProps<SVGSVGElement>>

export type IconViewProps = Omit<
  ViewCoreProps<HTMLSpanElement>,
  'children'
> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLSpanElement>
  }

interface IconBaseProps {
  size?: IconSize
  stroke?: IconStroke
  viewProps?: IconViewProps
}

export type IconProps =
  IconBaseProps &
  (
    | {
        icon: IconComponent
        svg?: never
      }
    | {
        icon?: never
        svg: IconSvg
      }
  )
