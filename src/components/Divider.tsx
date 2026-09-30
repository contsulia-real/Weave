import { useInsertionEffect, useMemo } from 'react'
import type { DividerProps } from '../core/divider-types'
import { length } from '../core/values'
import { ensureDividerStylesheet } from '../renderers/dom/divider-stylesheet'
import { resolveDividerTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { View } from './View'

export function Divider({ direction = 'horizontal', gap = 0, size, viewProps = {} }: DividerProps) {
  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass('divider-theme', resolveDividerTheme(theme))

  useInsertionEffect(ensureDividerStylesheet, [])

  const semanticDeclarations = useMemo(
    () => ({
      '--weave-divider-gap': length(gap) ?? '0rem',
      '--weave-divider-thickness': size === undefined ? undefined : `${Math.max(0, size)}px`,
    }),
    [gap, size],
  )
  const semanticClassName = useRuntimeStyleClass('divider-props', semanticDeclarations)

  return (
    <View
      {...viewProps}
      role="separator"
      aria-orientation={direction}
      className={['weave-divider', themeClassName, semanticClassName, viewProps.className]
        .filter(Boolean)
        .join(' ')}
      data={{
        ...viewProps.data,
        'weave-divider': '',
        'weave-divider-direction': direction,
      }}
    />
  )
}
