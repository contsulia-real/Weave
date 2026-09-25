import {
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import type { CSSProperties } from 'react'
import type { ViewProps } from '../../core/view-types'
import { resolveDOMView } from '../../renderers/dom/resolve-view'
import { ensureViewStylesheet } from '../../renderers/dom/view-stylesheet'

export type HostAttributeStyle = CSSProperties &
  Record<`--weave-${string}`, string | number | undefined>

export function useViewHost<TElement extends HTMLElement>(
  props: ViewProps<TElement>,
  componentStyle?: HostAttributeStyle,
) {
  useInsertionEffect(ensureViewStylesheet, [])

  const {
    autoFocus,
    ref,
    className,
    style,
  } = props

  const elementRef = useRef<TElement>(null)
  useImperativeHandle(ref, () => elementRef.current as TElement)

  useLayoutEffect(() => {
    if (autoFocus) elementRef.current?.focus()
  }, [autoFocus])

  const resolved = resolveDOMView(props)
  const mergedStyle = {
    ...resolved.attributeStyle,
    ...componentStyle,
    ...style,
  } as CSSProperties

  return {
    elementRef,
    className,
    mergedStyle,
    resolved,
  }
}
