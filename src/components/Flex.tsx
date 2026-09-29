import type { FlexProps } from '../core/layout-types'
import { View } from './View'

export function Flex(props: FlexProps) {
  return <View {...props} layout="flex" />
}
