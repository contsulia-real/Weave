import {
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import type {
  CSSProperties,
  RefObject,
} from 'react'
import type { ViewProps } from '../../core/view-types'
import {
  resolveDOMView,
  type ResolvedDOMView,
} from '../../renderers/dom/resolve-view'
import { ensureViewStylesheet } from '../../renderers/dom/view-stylesheet'

export type HostAttributeStyle = CSSProperties &
  Record<`--${string}`, string | number | undefined>

export interface ViewHostResult<TElement extends HTMLElement> {
  elementRef: RefObject<TElement | null>
  className: string | undefined
  mergedStyle: CSSProperties
  resolved: ResolvedDOMView<TElement>
}

export function useViewHost<TElement extends HTMLElement>(
  props: ViewProps<TElement>,
  componentStyle?: HostAttributeStyle,
): ViewHostResult<TElement> {
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
  const mergedStyle: CSSProperties = {
    ...resolved.attributeStyle,
    ...componentStyle,
    ...style,
  }

  return {
    elementRef,
    className,
    mergedStyle,
    resolved,
  }
}
