import type { SkeletonProps } from '../core/skeleton-types'
import { resolveSkeletonTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ensureSkeletonStylesheet } from '../renderers/dom/skeleton-stylesheet'
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { useTheme } from '../theme/theme-context'
import { View } from './View'

export function Skeleton(props: SkeletonProps): import('react').JSX.Element {
  const { shape = 'rect', viewProps = {} } = props
  const { theme, reducedMotion } = useTheme()
  const themeClassName = useRuntimeStyleClass('skeleton-theme', resolveSkeletonTheme(theme))

  useStaticStylesheet(ensureSkeletonStylesheet)

  return (
    <View
      {...viewProps}
      className={['weave-skeleton', themeClassName, viewProps.className].filter(Boolean).join(' ')}
      data={{
        ...viewProps.data,
        'weave-skeleton': '',
        'weave-skeleton-shape': shape,
        'weave-reduced-motion': reducedMotion ? 'reduce' : 'no-preference',
      }}
    />
  )
}
