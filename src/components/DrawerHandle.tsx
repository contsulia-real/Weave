import { useInsertionEffect } from 'react'
import type { DrawerHandleProps } from '../core/drawer-types'
import type { ViewProps } from '../core/view-types'
import { ensureDrawerStylesheet } from '../renderers/dom/drawer-stylesheet'
import { useDrawerHandleContext } from './internal/drawer-context'
import { useViewHost } from './internal/use-view-host'

export function DrawerHandle({ viewProps = {} }: DrawerHandleProps) {
  const drawer = useDrawerHandleContext()
  const {
    onPointerDown: viewOnPointerDown,
    onPointerMove: viewOnPointerMove,
    onPointerUp: viewOnPointerUp,
    onPointerCancel: viewOnPointerCancel,
    ...restViewProps
  } = viewProps
  const hostProps: ViewProps<HTMLDivElement> = {
    ...restViewProps,
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)

  useInsertionEffect(ensureDrawerStylesheet, [])

  return (
    <div
      {...resolved.domProps}
      ref={elementRef}
      aria-hidden="true"
      data-weave-view=""
      data-weave-drawer-handle=""
      data-weave-drawer-handle-active={drawer.active ? 'true' : 'false'}
      data-weave-drawer-handle-dragging={drawer.dragging ? 'true' : 'false'}
      data-weave-drawer-side={drawer.side}
      data-weave-layout={resolved.layout}
      className={['weave-drawer-handle', className].filter(Boolean).join(' ')}
      style={inlineStyle}
      onPointerDown={(event) => {
        viewOnPointerDown?.(event)
        if (!event.defaultPrevented) drawer.onPointerDown(event)
      }}
      onPointerMove={(event) => {
        viewOnPointerMove?.(event)
        if (!event.defaultPrevented) drawer.onPointerMove(event)
      }}
      onPointerUp={(event) => {
        viewOnPointerUp?.(event)
        if (!event.defaultPrevented) drawer.onPointerUp(event)
      }}
      onPointerCancel={(event) => {
        viewOnPointerCancel?.(event)
        if (!event.defaultPrevented) drawer.onPointerCancel(event)
      }}
    />
  )
}
