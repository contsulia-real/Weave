import type { AbsoluteProps } from '../core/layout-types'
import { View } from './View'

export function Absolute(props: AbsoluteProps): import('react').JSX.Element {
  return <View {...props} layout="absolute" />
}
