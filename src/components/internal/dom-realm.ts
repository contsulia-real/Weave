export function isNode(value: unknown, ownerDocument: Document): value is Node {
  const NodeConstructor = ownerDocument.defaultView?.Node
  return NodeConstructor !== undefined && value instanceof NodeConstructor
}

export function isElement(value: unknown, ownerDocument: Document): value is Element {
  const ElementConstructor = ownerDocument.defaultView?.Element
  return ElementConstructor !== undefined && value instanceof ElementConstructor
}

export function isHTMLElement(value: unknown, ownerDocument: Document): value is HTMLElement {
  const HTMLElementConstructor = ownerDocument.defaultView?.HTMLElement
  return HTMLElementConstructor !== undefined && value instanceof HTMLElementConstructor
}
