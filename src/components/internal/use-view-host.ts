import type { CSSProperties, RefObject } from 'react'
import { useId, useImperativeHandle, useInsertionEffect, useLayoutEffect, useRef } from 'react'
import type { SemanticReference, ViewProps } from '../../core/view-types'
import { useBreakpointStylesheet } from '../../renderers/dom/breakpoint-stylesheet'
import { type ResolvedDOMView, resolveDOMView } from '../../renderers/dom/resolve-view'
import { useRuntimeStyleClass } from '../../renderers/dom/runtime-class'
import { ensureViewStylesheet } from '../../renderers/dom/view-stylesheet'
import { useTheme } from '../../theme/theme-context'
import { useViewAnimation } from './use-view-animation'
import { useViewLayoutAnimation } from './use-view-layout-animation'
import { useViewMotion } from './use-view-motion'
import { useViewEnterStagger } from './use-view-stagger'

const SEMANTIC_ASSOCIATIONS = [
  ['labelledBy', 'aria-labelledby'],
  ['describedBy', 'aria-describedby'],
  ['controls', 'aria-controls'],
  ['owns', 'aria-owns'],
] as const

function semanticReferenceId(
  reference: SemanticReference,
  generatedId: string,
): string | undefined {
  if (typeof reference === 'string') return reference

  const target = reference.current
  if (target === null) return undefined

  if (target.id.length === 0) {
    target.id = generatedId
  }

  return target.id
}

type SemanticAssociationName = (typeof SEMANTIC_ASSOCIATIONS)[number][0]

type SemanticAssociationOverrides = Partial<
  Record<SemanticAssociationName, readonly (SemanticReference | undefined)[]>
>

interface ViewHostResult<TElement extends HTMLElement> {
  elementRef: RefObject<TElement | null>
  className: string | undefined
  inlineStyle: CSSProperties | undefined
  resolved: ResolvedDOMView<TElement>
}

export function useViewHost<TElement extends HTMLElement>(
  props: ViewProps<TElement>,
  componentStyle?: CSSProperties,
  componentName?: string,
  semanticOverrides?: SemanticAssociationOverrides,
): ViewHostResult<TElement> {
  useInsertionEffect(ensureViewStylesheet, [])

  const { autoFocus, ref, className, style } = props

  const elementRef = useRef<TElement>(null)
  const semanticId = useId().replace(/:/g, '')
  useImperativeHandle(ref, () => elementRef.current as TElement)
  const labelledBy = props.labelledBy
  const describedBy = props.describedBy
  const controls = props.controls
  const owns = props.owns

  useLayoutEffect(() => {
    if (autoFocus) elementRef.current?.focus()
  }, [autoFocus])

  useLayoutEffect(() => {
    const host = elementRef.current
    if (host === null) return

    const baseReferences = {
      labelledBy,
      describedBy,
      controls,
      owns,
    }
    const references = Object.fromEntries(
      SEMANTIC_ASSOCIATIONS.map(([propName]) => [
        propName,
        semanticOverrides?.[propName] ??
          (baseReferences[propName] === undefined ? undefined : [baseReferences[propName]]),
      ]),
    ) as Record<SemanticAssociationName, readonly (SemanticReference | undefined)[] | undefined>

    const sync = () => {
      for (const [propName, attributeName] of SEMANTIC_ASSOCIATIONS) {
        const associationReferences = references[propName]
        if (associationReferences === undefined) continue

        const ids = associationReferences.flatMap((reference, index) => {
          if (reference === undefined) return []
          if (typeof reference === 'string') return reference.split(/\s+/).filter(Boolean)

          const id = semanticReferenceId(
            reference,
            `weave-semantic-${semanticId}-${propName}-${index}`,
          )
          return id === undefined ? [] : [id]
        })
        const value = [...new Set(ids)].join(' ')

        if (value.length === 0) {
          host.removeAttribute(attributeName)
        } else {
          host.setAttribute(attributeName, value)
        }
      }
    }

    sync()

    const hasRefAssociation = Object.values(references).some((associationReferences) =>
      associationReferences?.some(
        (reference) => reference !== undefined && typeof reference !== 'string',
      ),
    )

    if (!hasRefAssociation || typeof MutationObserver === 'undefined') return

    const root = host.ownerDocument.documentElement
    if (root === null) return

    const observer = new MutationObserver(sync)
    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['id'],
    })

    return () => observer.disconnect()
  }, [controls, describedBy, labelledBy, owns, semanticId, semanticOverrides])

  const { theme, reducedMotion } = useTheme()
  const breakpointClassName = useBreakpointStylesheet(theme.breakpoints)
  const resolved = resolveDOMView(props, theme.breakpoints)
  const motion = useViewMotion(props, theme, reducedMotion)
  useViewAnimation(elementRef, props.animation, theme, reducedMotion)
  useViewEnterStagger(elementRef, props.enter, theme, reducedMotion)
  useViewLayoutAnimation(elementRef, props.layoutAnimation, theme, reducedMotion)
  ;(resolved.domProps as Record<string, unknown>)['data-weave-reduced-motion'] = reducedMotion
    ? 'reduce'
    : 'no-preference'
  ;(resolved.domProps as Record<string, unknown>)['data-weave-motion-state'] = motion.state
  const componentClassName = useRuntimeStyleClass(
    componentName === undefined ? 'component-props' : `${componentName}-props`,
    componentStyle,
  )
  const attributeClassName = useRuntimeStyleClass('props', resolved.attributeStyle)
  const resolvedClassName =
    [
      'weave-view',
      breakpointClassName,
      componentClassName,
      attributeClassName,
      motion.className,
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
