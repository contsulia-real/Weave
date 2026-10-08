import type { RefObject } from 'react'

interface SemanticReferenceSubscription {
  references: readonly RefObject<HTMLElement | null>[]
  sync: () => void
  targets: readonly (HTMLElement | null)[]
}

interface SemanticReferenceRegistry {
  observer: MutationObserver
  subscriptions: Set<SemanticReferenceSubscription>
  subscriptionsByTarget: Map<HTMLElement, Set<SemanticReferenceSubscription>>
}

const registries = new WeakMap<Document, SemanticReferenceRegistry>()

function readTargets(
  references: readonly RefObject<HTMLElement | null>[],
): readonly (HTMLElement | null)[] {
  return references.map((reference) => reference.current)
}

function sameTargets(
  left: readonly (HTMLElement | null)[],
  right: readonly (HTMLElement | null)[],
): boolean {
  return left.length === right.length && left.every((target, index) => target === right[index])
}

function targetSet(targets: readonly (HTMLElement | null)[]): Set<HTMLElement> {
  return new Set(targets.filter((target): target is HTMLElement => target !== null))
}

function updateTargets(
  registry: SemanticReferenceRegistry,
  subscription: SemanticReferenceSubscription,
  targets: readonly (HTMLElement | null)[],
): void {
  for (const target of targetSet(subscription.targets)) {
    const subscriptions = registry.subscriptionsByTarget.get(target)
    subscriptions?.delete(subscription)
    if (subscriptions?.size === 0) registry.subscriptionsByTarget.delete(target)
  }

  subscription.targets = targets

  for (const target of targetSet(targets)) {
    const subscriptions = registry.subscriptionsByTarget.get(target) ?? new Set()
    subscriptions.add(subscription)
    registry.subscriptionsByTarget.set(target, subscriptions)
  }
}

function handleMutations(
  registry: SemanticReferenceRegistry,
  records: readonly MutationRecord[],
): void {
  const subscriptionsToSync = new Set<SemanticReferenceSubscription>()

  if (records.some((record) => record.type === 'childList')) {
    for (const subscription of registry.subscriptions) {
      const targets = readTargets(subscription.references)
      if (!sameTargets(subscription.targets, targets)) {
        updateTargets(registry, subscription, targets)
        subscriptionsToSync.add(subscription)
      }
    }
  }

  for (const record of records) {
    if (record.type !== 'attributes' || record.attributeName !== 'id') continue

    for (const subscription of registry.subscriptionsByTarget.get(record.target as HTMLElement) ??
      []) {
      subscriptionsToSync.add(subscription)
    }
  }

  for (const subscription of subscriptionsToSync) {
    subscription.sync()
    updateTargets(registry, subscription, readTargets(subscription.references))
  }
}

function registryFor(ownerDocument: Document): SemanticReferenceRegistry | undefined {
  const existing = registries.get(ownerDocument)
  if (existing !== undefined) return existing
  const MutationObserverConstructor = ownerDocument.defaultView?.MutationObserver
  if (MutationObserverConstructor === undefined) return undefined

  const root = ownerDocument.documentElement
  if (root === null) return undefined

  let registry: SemanticReferenceRegistry
  const observer = new MutationObserverConstructor((records) => handleMutations(registry, records))
  registry = {
    observer,
    subscriptions: new Set(),
    subscriptionsByTarget: new Map(),
  }
  observer.observe(root, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['id'],
  })
  registries.set(ownerDocument, registry)
  return registry
}

export function observeSemanticReferences(
  ownerDocument: Document,
  references: readonly RefObject<HTMLElement | null>[],
  sync: () => void,
): () => void {
  const registry = registryFor(ownerDocument)
  if (registry === undefined) return () => {}

  const subscription: SemanticReferenceSubscription = {
    references,
    sync,
    targets: [],
  }
  registry.subscriptions.add(subscription)
  updateTargets(registry, subscription, readTargets(references))

  return () => {
    updateTargets(registry, subscription, [])
    registry.subscriptions.delete(subscription)

    if (registry.subscriptions.size === 0) {
      registry.observer.disconnect()
      registries.delete(ownerDocument)
    }
  }
}
