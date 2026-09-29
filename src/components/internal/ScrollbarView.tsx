import type { ViewProps } from '../../core/view-types'
import { useViewHost } from './use-view-host'

export function ScrollbarView(props: ViewProps<HTMLDivElement>) {
  const { children } = props
  const { elementRef, className, inlineStyle, resolved } = useViewHost(props)

  return (
    <div
      {...resolved.domProps}
      ref={elementRef}
      data-weave-view=""
      data-weave-layout={resolved.layout}
      className={className}
      style={inlineStyle}
    >
      {children}
    </div>
  )
}
