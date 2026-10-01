import { createContext } from 'react'

interface ModalHostEntry {
  dialog: HTMLDialogElement
  portalHost: HTMLDivElement
}

const listeners = new Set<() => void>()
const modalStack: ModalHostEntry[] = []
let revision = 0

export const ModalPortalHostContext = createContext<Element | null>(null)

function emitChange(): void {
  revision += 1

  for (const listener of listeners) {
    listener()
  }
}

function createPortalHost(dialog: HTMLDialogElement): HTMLDivElement {
  const host = dialog.ownerDocument.createElement('div')
  host.className = 'weave-modal-portal-host'
  host.dataset.weaveModalPortalHost = ''
  host.setAttribute('popover', 'manual')
  dialog.append(host)
  host.showPopover()
  return host
}

function destroyPortalHost(host: HTMLDivElement): void {
  if (host.matches(':popover-open')) {
    host.hidePopover()
  }

  host.remove()
}

function pruneModalStack(): void {
  let changed = false

  for (let index = modalStack.length - 1; index >= 0; index -= 1) {
    const entry = modalStack[index]

    if (
      entry === undefined ||
      !entry.dialog.isConnected ||
      !entry.dialog.open ||
      !entry.portalHost.isConnected
    ) {
      if (entry?.portalHost.isConnected) {
        destroyPortalHost(entry.portalHost)
      }
      modalStack.splice(index, 1)
      changed = true
    }
  }

  if (changed) {
    emitChange()
  }
}

export function activateModalHost(dialog: HTMLDialogElement): HTMLDivElement {
  const existingIndex = modalStack.findIndex((entry) => entry.dialog === dialog)
  let portalHost: HTMLDivElement

  if (existingIndex >= 0) {
    const existing = modalStack[existingIndex]
    if (existing === undefined) {
      throw new Error('Modal portal host registry is inconsistent')
    }
    portalHost = existing.portalHost
    modalStack.splice(existingIndex, 1)

    if (portalHost.matches(':popover-open')) {
      portalHost.hidePopover()
    }
    portalHost.showPopover()
  } else {
    portalHost = createPortalHost(dialog)
  }

  modalStack.push({ dialog, portalHost })
  emitChange()
  return portalHost
}

export function deactivateModalHost(dialog: HTMLDialogElement): void {
  const existingIndex = modalStack.findIndex((entry) => entry.dialog === dialog)

  if (existingIndex < 0) return

  const [entry] = modalStack.splice(existingIndex, 1)
  if (entry !== undefined) {
    destroyPortalHost(entry.portalHost)
  }
  emitChange()
}

export function portalHostForDialog(dialog: HTMLDialogElement | null): HTMLDivElement | null {
  if (dialog === null) return null
  return modalStack.find((entry) => entry.dialog === dialog)?.portalHost ?? null
}

export function topmostModalPortalHost(document: Document): HTMLDivElement | null {
  pruneModalStack()

  for (let index = modalStack.length - 1; index >= 0; index -= 1) {
    const entry = modalStack[index]

    if (entry?.dialog.ownerDocument === document) {
      return entry.portalHost
    }
  }

  return null
}

export function modalPortalHostForElement(element: HTMLElement | null): HTMLDivElement | null {
  if (element === null) return null

  const dialog = element.matches('dialog[data-weave-dialog-modal="true"]')
    ? (element as HTMLDialogElement)
    : element.closest<HTMLDialogElement>('dialog[data-weave-dialog-modal="true"]')

  return portalHostForDialog(dialog)
}

export function subscribeTopLayerHost(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function topLayerHostRevision(): number {
  return revision
}
