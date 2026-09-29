import {
  useInsertionEffect,
  type CSSProperties,
} from 'react'
import type {
  DividerProps,
} from '../core/divider-types'
import { length } from '../core/values'
import {
  ensureDividerStylesheet,
} from '../renderers/dom/divider-stylesheet'
import { View } from './View'

type DividerStyle =
  CSSProperties & {
    '--weave-divider-gap'?:
      string
    '--weave-divider-thickness'?:
      string
  }

export function Divider({
  direction = 'horizontal',
  gap = 0,
  size = 1,
  viewProps = {},
}: DividerProps) {
  useInsertionEffect(
    ensureDividerStylesheet,
    [],
  )

  const dividerStyle:
    DividerStyle = {
      ...viewProps.style,
      '--weave-divider-gap':
        length(gap) ?? '0rem',
      '--weave-divider-thickness':
        `${Math.max(0, size)}px`,
    }

  return (
    <View
      {...viewProps}
      role="separator"
      aria-orientation={
        direction
      }
      className={[
        'weave-divider',
        viewProps.className,
      ].filter(Boolean).join(' ')}
      data={{
        ...viewProps.data,
        'weave-divider': '',
        'weave-divider-direction':
          direction,
      }}
      style={dividerStyle}
    />
  )
}
