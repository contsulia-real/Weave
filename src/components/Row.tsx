import type { RowProps } from '../core/layout-types'
import { View } from './View'

export function Row(props: RowProps): import('react').JSX.Element {
  return <View {...props} layout="flex" direction="row" />
}
