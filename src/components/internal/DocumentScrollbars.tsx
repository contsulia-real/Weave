import { useLayoutEffect, useState } from 'react'
import { WeaveDocumentProvider } from '../../renderers/dom/DocumentProvider'
import { useWeaveDocument } from '../../renderers/dom/document-context'
import { AutoScrollbar } from './AutoScrollbar'
import { usesCustomScrollbar } from './scroll-host-discovery'

interface ManagedScrollHost {
  id: number
  element: HTMLElement
  targetRef: { current: HTMLElement }
}

const documentManagers = new WeakMap<Document, Set<(active: boolean) => void>>()
const managerChangeListeners = new Set<() => void>()

function notifyManagerChanges() {
  for (const listener of managerChangeListeners) listener()
}

const GLOBAL_SCROLL_HOST = 'data-weave-global-scroll-host'
const SHADOW_SCROLLBAR_STYLE = `
:where([${GLOBAL_SCROLL_HOST}]) { scrollbar-width: none; }
:where([${GLOBAL_SCROLL_HOST}])::-webkit-scrollbar { display: none; width: 0; height: 0; }
`

function isScrollbarElement(node: Node): boolean {
  return node.nodeType === 1 && (node as Element).closest('.weave-scrollbar') !== null
}

function isOwnMutation(record: MutationRecord): boolean {
  if (record.type === 'attributes' && record.attributeName === GLOBAL_SCROLL_HOST) return true
  if (isScrollbarElement(record.target)) return true
  if (record.type !== 'childList') return false

  const nodes = [...record.addedNodes, ...record.removedNodes]
  return nodes.length > 0 && nodes.every(isScrollbarElement)
}

function childRoots(
  document: Document,
  onShadowRoot: (root: ShadowRoot) => void,
  onDocument: (document: Document) => boolean,
  onElement: (element: HTMLElement) => void,
): void {
  const visited = new Set<Node>()

  const scanRoot = (root: Document | ShadowRoot) => {
    if (visited.has(root)) return
    visited.add(root)

    if (root.nodeType === 9) {
      if (!onDocument(root as Document)) return
    } else onShadowRoot(root as ShadowRoot)

    for (const element of root.querySelectorAll('*')) {
      const view = element.ownerDocument.defaultView
      if (view === null) continue

      if (element instanceof view.HTMLElement) onElement(element)

      if (element.shadowRoot !== null) scanRoot(element.shadowRoot)

      if (element instanceof view.HTMLIFrameElement) {
        try {
          if (element.contentDocument !== null) scanRoot(element.contentDocument)
        } catch {
          // Cross-origin frames are isolated by the browser.
        }
      }
    }
  }

  scanRoot(document)
}

export function DocumentScrollbars(): import('react').JSX.Element | null {
  const ownerDocument = useWeaveDocument()
  const [hosts, setHosts] = useState<ManagedScrollHost[]>([])
  const [isPrimaryManager, setIsPrimaryManager] = useState(false)

  /* oxlint-disable react/set-state-in-effect */
  useLayoutEffect(() => {
    if (ownerDocument === null) return

    let managers = documentManagers.get(ownerDocument)
    if (managers === undefined) {
      managers = new Set()
      documentManagers.set(ownerDocument, managers)
    }
    const update = (active: boolean) => setIsPrimaryManager(active)
    managers.add(update)
    const notify = () => {
      const first = managers.values().next().value
      for (const manager of managers) manager(manager === first)
    }
    notify()
    notifyManagerChanges()
    return () => {
      managers.delete(update)
      if (managers.size === 0) documentManagers.delete(ownerDocument)
      else notify()
      notifyManagerChanges()
    }
  }, [ownerDocument])

  /* oxlint-disable react/set-state-in-effect */
  useLayoutEffect(() => {
    if (ownerDocument === null || !isPrimaryManager) return

    let nextId = 0
    let active = new Map<HTMLElement, ManagedScrollHost>()
    const watchedRoots = new Map<Document | ShadowRoot, MutationObserver>()
    const watchedDocuments = new Map<Document, () => void>()
    const shadowStyles = new Map<ShadowRoot, HTMLStyleElement>()
    const view = ownerDocument.defaultView
    let frame: number | null = null

    const check = () => {
      frame = null
      const next = new Map<HTMLElement, ManagedScrollHost>()
      const currentRoots = new Set<Document | ShadowRoot>()
      const currentDocuments = new Set<Document>()

      childRoots(
        ownerDocument,
        (root) => {
          currentRoots.add(root)
          if (!shadowStyles.has(root)) {
            const style = root.ownerDocument.createElement('style')
            style.textContent = SHADOW_SCROLLBAR_STYLE
            root.append(style)
            shadowStyles.set(root, style)
          }
        },
        (document) => {
          if (document !== ownerDocument && documentManagers.has(document)) return false
          currentRoots.add(document)
          currentDocuments.add(document)
          return true
        },
        (element) => {
          if (!usesCustomScrollbar(element)) return
          const existing = active.get(element)
          next.set(element, existing ?? { id: ++nextId, element, targetRef: { current: element } })
          if (!element.hasAttribute(GLOBAL_SCROLL_HOST)) {
            element.setAttribute(GLOBAL_SCROLL_HOST, '')
          }
        },
      )

      for (const element of active.keys()) {
        if (!next.has(element)) element.removeAttribute(GLOBAL_SCROLL_HOST)
      }

      for (const root of currentRoots) {
        if (watchedRoots.has(root)) continue
        const constructor = (root.nodeType === 9 ? (root as Document) : root.ownerDocument)
          ?.defaultView?.MutationObserver
        if (constructor === undefined) continue
        const observer = new constructor((records) => {
          if (!records.every(isOwnMutation)) schedule()
        })
        observer.observe(root, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true,
        })
        watchedRoots.set(root, observer)
      }
      for (const [root, observer] of watchedRoots) {
        if (currentRoots.has(root)) continue
        observer.disconnect()
        watchedRoots.delete(root)
      }
      for (const [root, style] of shadowStyles) {
        if (currentRoots.has(root)) continue
        style.remove()
        shadowStyles.delete(root)
      }

      for (const document of currentDocuments) {
        if (watchedDocuments.has(document)) continue
        const handler = () => schedule()
        const events = [
          'pointerover',
          'pointerout',
          'focusin',
          'focusout',
          'transitionend',
          'animationend',
          'load',
        ]
        for (const name of events) document.addEventListener(name, handler, true)
        document.defaultView?.addEventListener('resize', handler)
        watchedDocuments.set(document, () => {
          for (const name of events) document.removeEventListener(name, handler, true)
          document.defaultView?.removeEventListener('resize', handler)
        })
      }
      for (const [document, dispose] of watchedDocuments) {
        if (currentDocuments.has(document)) continue
        dispose()
        watchedDocuments.delete(document)
      }

      if (next.size !== active.size || [...next.keys()].some((element) => !active.has(element))) {
        setHosts([...next.values()])
      }
      active = next
    }

    const schedule = () => {
      if (frame !== null || view === null) return
      frame = view.requestAnimationFrame(check)
    }

    managerChangeListeners.add(schedule)
    check()

    return () => {
      managerChangeListeners.delete(schedule)
      if (frame !== null) view?.cancelAnimationFrame(frame)
      for (const observer of watchedRoots.values()) observer.disconnect()
      for (const dispose of watchedDocuments.values()) dispose()
      for (const style of shadowStyles.values()) style.remove()
      for (const element of active.keys()) element.removeAttribute(GLOBAL_SCROLL_HOST)
      active.clear()
    }
  }, [isPrimaryManager, ownerDocument])
  /* oxlint-enable react/set-state-in-effect */

  return (
    <>
      {hosts.map(({ id, element, targetRef }) => (
        <WeaveDocumentProvider key={id} ownerDocument={element.ownerDocument}>
          <AutoScrollbar
            targetRef={targetRef}
            overflowIntent={
              element.ownerDocument.scrollingElement === element ? { styleOverflow: 'auto' } : {}
            }
          />
        </WeaveDocumentProvider>
      ))}
    </>
  )
}
