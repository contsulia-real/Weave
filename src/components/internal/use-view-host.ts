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
import { useRuntimeStyleClass } from '../../renderers/dom/runtime-class'
import { ensureViewStylesheet } from '../../renderers/dom/view-stylesheet'

export interface ViewHostResult<TElement extends HTMLElement> {
  elementRef: RefObject<TElement | null>
  className: string | undefined
  mergedStyle: CSSProperties
  resolved: ResolvedDOMView<TElement>
}

export function useViewHost<TElement extends HTMLElement>(
  props: ViewProps<TElement>,
  componentStyle?: CSSProperties,
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
  const componentClassName = useRuntimeStyleClass(
    'component-props',
    componentStyle,
  )
  const attributeClassName = useRuntimeStyleClass(
    'view-props',
    resolved.attributeStyle,
  )

  const resolvedClassName = [
    componentClassName,
    attributeClassName,
    className,
  ]
    .filter(Boolean)
    .join(' ') || undefined

  return {
    elementRef,
    className: resolvedClassName,
    mergedStyle: style ?? {},
    resolved,
  }
}
