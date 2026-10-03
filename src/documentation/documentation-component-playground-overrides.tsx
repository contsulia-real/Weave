import {
  Children,
  cloneElement,
  type ElementType,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import * as Weave from '../index'
import type { DocumentationPlaygroundValue } from './documentation-component-playground-data'

type PlaygroundValues = Record<string, DocumentationPlaygroundValue>

function componentTarget(componentName: string): ElementType {
  const target = (Weave as Record<string, unknown>)[componentName]

  if (target === undefined) {
    throw new Error(`Missing public component export for Documentation target ${componentName}`)
  }

  return target as ElementType
}

function cloneWithOverrides(
  node: ReactNode,
  target: ElementType,
  hasViewProps: boolean,
  attributes: PlaygroundValues,
  viewProps: PlaygroundValues,
): ReactNode {
  if (!isValidElement(node)) return node

  const element = node as ReactElement<Record<string, unknown>>

  if (element.type === target) {
    if (hasViewProps) {
      const existingViewProps =
        typeof element.props.viewProps === 'object' &&
        element.props.viewProps !== null &&
        !Array.isArray(element.props.viewProps)
          ? (element.props.viewProps as Record<string, unknown>)
          : {}

      return cloneElement(element, {
        ...attributes,
        viewProps: {
          ...existingViewProps,
          ...viewProps,
        },
      })
    }

    return cloneElement(element, viewProps)
  }

  if (element.props.children === undefined) return element

  const children = Children.map(element.props.children as ReactNode, (child) =>
    cloneWithOverrides(child, target, hasViewProps, attributes, viewProps),
  )

  return cloneElement(element, undefined, children)
}

export function applyDocumentationPlaygroundOverrides(
  node: ReactNode,
  componentName: string,
  hasViewProps: boolean,
  attributes: PlaygroundValues,
  viewProps: PlaygroundValues,
): ReactNode {
  return cloneWithOverrides(
    node,
    componentTarget(componentName),
    hasViewProps,
    attributes,
    viewProps,
  )
}
