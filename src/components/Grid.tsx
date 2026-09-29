import type { GridProps } from '../core/layout-types'
import { View } from './View'

export function Grid(props: GridProps) {
  return <View {...props} layout="grid" />
}
