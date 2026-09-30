import type { SplitBoxPaneProps } from '../core/splitbox-types'
import type { ViewProps } from '../core/view-types'
import { useSplitBoxPaneContext } from './internal/splitbox-context'
import { useViewHost } from './internal/use-view-host'

export function SplitBoxPane({ children, viewProps = {} }: SplitBoxPaneProps) {
  const pane = useSplitBoxPaneContext()
  const hostProps: ViewProps<HTMLDivElement> = {
    ...viewProps,
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)

  return (
    <div
      {...resolved.domProps}
      ref={elementRef}
      inert={pane.collapsed ? true : undefined}
      data-weave-view=""
      data-weave-splitbox-pane=""
      data-weave-splitbox-pane-position={pane.position}
      data-weave-splitbox-pane-collapsed={pane.collapsed ? 'true' : 'false'}
      data-weave-layout={resolved.layout}
      className={['weave-splitbox-pane', className].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      {children}
    </div>
  )
}
