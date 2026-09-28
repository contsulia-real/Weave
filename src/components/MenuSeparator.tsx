import {
  useInsertionEffect,
} from 'react'
import type {
  MenuSeparatorProps,
} from '../core/menu-types'
import {
  ensureMenuStylesheet,
} from '../renderers/dom/menu-stylesheet'
import { View } from './View'

export function MenuSeparator({
  viewProps = {},
}: MenuSeparatorProps) {
  useInsertionEffect(
    ensureMenuStylesheet,
    [],
  )

  return (
    <View
      {...viewProps}
      role="separator"
      className={[
        'weave-menu-separator',
        viewProps.className,
      ].filter(Boolean).join(' ')}
      data={{
        ...viewProps.data,
        'weave-menu-separator':
          '',
      }}
    />
  )
}
