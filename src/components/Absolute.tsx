import type { AbsoluteProps } from '../core/layout-types'
import { View } from './View'

export function Absolute(props: AbsoluteProps) {
  return <View {...props} layout="absolute" />
}
