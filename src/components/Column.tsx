import type { ColumnProps } from '../core/layout-types'
import { View } from './View'

export function Column(props: ColumnProps): import('react').JSX.Element {
  return <View {...props} layout="flex" direction="column" />
}
