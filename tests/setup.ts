import {
  beforeEach,
} from 'vitest'

type ReactActGlobal =
  typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean
  }

function enableReactActEnvironment(): void {
  const roots: unknown[] = [
    globalThis,
    typeof window === 'undefined'
      ? undefined
      : window,
    typeof self === 'undefined'
      ? undefined
      : self,
  ]

  for (const root of roots) {
    if (
      root === undefined ||
      root === null
    ) {
      continue
    }

    ;(
      root as ReactActGlobal
    ).IS_REACT_ACT_ENVIRONMENT =
      true
  }
}

enableReactActEnvironment()

beforeEach(() => {
  enableReactActEnvironment()
})
