import {
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import type { CSSProperties } from 'react'
import type { ViewProps } from '../core/view-types'
import { resolveDOMView } from '../renderers/dom/resolve-view'
import { ensureViewStylesheet } from '../renderers/dom/view-stylesheet'

export function View(props: ViewProps) {
  useInsertionEffect(ensureViewStylesheet, [])

  const {
    autoFocus,
    children,
    ref,
    className,
    style,
  } = props

  const elementRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => elementRef.current as HTMLDivElement)

  useLayoutEffect(() => {
    if (autoFocus) elementRef.current?.focus()
  }, [autoFocus])

  const resolved = resolveDOMView(props)
  const mergedStyle = {
    ...resolved.attributeStyle,
    ...style,
  } as CSSProperties

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
