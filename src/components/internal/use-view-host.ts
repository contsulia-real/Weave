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
import { useBreakpointStylesheet } from '../../renderers/dom/breakpoint-stylesheet'
import { useRuntimeStyleClass } from '../../renderers/dom/runtime-class'
import { ensureViewStylesheet } from '../../renderers/dom/view-stylesheet'
import { useTheme } from '../../theme/theme-context'

export interface ViewHostResult<TElement extends HTMLElement> {
  elementRef: RefObject<TElement | null>
  className: string | undefined
  inlineStyle: CSSProperties | undefined
  resolved: ResolvedDOMView<TElement>
}

export function useViewHost<
  TElement extends HTMLElement,
  TBreakpoint extends string = never,
>(
  props: ViewProps<TElement, TBreakpoint>,
  componentStyle?: CSSProperties,
  componentName?: string,
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

  const { theme } = useTheme()
  const breakpointClassName = useBreakpointStylesheet(theme.breakpoints)
  const resolved = resolveDOMView(props, theme.breakpoints)
  const componentClassName = useRuntimeStyleClass(
    componentName === undefined
      ? 'component-props'
      : `${componentName}-props`,
    componentStyle,
  )
  const attributeClassName = useRuntimeStyleClass(
    'props',
    resolved.attributeStyle,
  )

  const resolvedClassName = [
    'weave-view',
    breakpointClassName,
    componentClassName,
    attributeClassName,
    className,
  ]
    .filter(Boolean)
    .join(' ') || undefined

  return {
    elementRef,
    className: resolvedClassName,
    inlineStyle: style,
    resolved,
  }
}
