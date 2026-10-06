import type { SplitBoxPaneProps } from '../core/splitbox-types'
import type { ViewProps } from '../core/view-types'
import { AutoScrollbar } from './internal/AutoScrollbar'
import { useSplitBoxPaneContext } from './internal/splitbox-context'
import { useViewHost } from './internal/use-view-host'

const splitBoxPaneOverflowIntent = {}

export function SplitBoxPane(props: SplitBoxPaneProps): import('react').JSX.Element {
  const { children, viewProps = {} } = props
  const pane = useSplitBoxPaneContext()
  const hostProps: ViewProps<HTMLDivElement> = {
    ...viewProps,
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)

  return (
    <>
      <div
        {...resolved.domProps}
        ref={elementRef}
        inert={pane.collapsed ? true : undefined}
        data-weave-view=""
        data-weave-scroll-host=""
        data-weave-splitbox-pane=""
        data-weave-splitbox-pane-position={pane.position}
        data-weave-splitbox-pane-collapsed={pane.collapsed ? 'true' : 'false'}
        data-weave-layout={resolved.layout}
        className={['weave-splitbox-pane', 'weave-scroll-host', className]
          .filter(Boolean)
          .join(' ')}
        style={inlineStyle}
      >
        {children}
      </div>

      {pane.collapsed ? null : (
        <AutoScrollbar
          targetRef={elementRef}
          config={viewProps.scrollbar}
          overflowIntent={splitBoxPaneOverflowIntent}
        />
      )}
    </>
  )
}
