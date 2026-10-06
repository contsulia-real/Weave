import type { StackProps } from '../core/layout-types'
import { View } from './View'

export function Stack(props: StackProps): import('react').JSX.Element {
  return <View {...props} layout="stack" />
}
