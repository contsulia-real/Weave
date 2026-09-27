declare module 'react-reconciler' {
  import type { ReactNode } from 'react'

  export interface ReactReconcilerInstance {
    createContainer(...args: unknown[]): unknown
    updateContainer(
      element: ReactNode,
      container: unknown,
      parentComponent: unknown,
      callback: (() => void) | null,
    ): void
    updateContainerSync(
      element: ReactNode,
      container: unknown,
      parentComponent: unknown,
      callback: (() => void) | null,
    ): void
    flushSyncWork(): void
  }

  export default function createReconciler(
    config: Record<string, unknown>,
  ): ReactReconcilerInstance
}

declare module 'react-reconciler/constants' {
  export const ConcurrentRoot: number
  export const DefaultEventPriority: number
  export const NoEventPriority: number
}
