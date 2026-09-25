import type { ViewProps } from '../core/view-types'
import { useViewHost } from './internal/use-view-host'

export function View(props: ViewProps<HTMLDivElement>) {
  const { children } = props
  const {
    elementRef,
    className,
    mergedStyle,
    resolved,
  } = useViewHost(props)

  return (
    <div
      {...resolved.domProps}
      ref={elementRef}
      data-weave-view=""
      data-weave-layout={resolved.layout}
      className={className}
      style={mergedStyle}
    >
      {children}
    </div>
  )
}
