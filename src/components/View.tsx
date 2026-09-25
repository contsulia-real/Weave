import { useInsertionEffect } from 'react'
import type { CSSProperties } from 'react'
import type { ViewProps } from '../core/view-types'
import { resolveDOMView } from '../renderers/dom/resolve-view'
import { ensureViewStylesheet } from '../renderers/dom/view-stylesheet'

export function View(props: ViewProps) {
  useInsertionEffect(ensureViewStylesheet, [])

  const {
    children,
    ref,
    className,
    style,
  } = props

  const resolved = resolveDOMView(props)
  const mergedStyle = {
    ...resolved.attributeStyle,
    ...style,
  } as CSSProperties

  return (
    <div
      {...resolved.domProps}
      ref={ref}
      data-weave-view=""
      data-weave-layout={resolved.layout}
      className={className}
      style={mergedStyle}
    >
      {children}
    </div>
  )
}
