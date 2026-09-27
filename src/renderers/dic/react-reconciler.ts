import {
  createContext,
  createElement,
  type ReactNode,
} from 'react'
import createReconciler from 'react-reconciler'
import {
  ConcurrentRoot,
  DefaultEventPriority,
  NoEventPriority,
} from 'react-reconciler/constants'
import { resolveText } from '../../core/resolved-text'
import { DiCCapabilityError } from './capability-error'
import { resolveView } from '../../core/resolved-view'
import type { ResolvedTheme } from '../../theme/theme-types'
import { DiCRendererScope } from '../renderer-context'
import { compileDiCButton } from './compile-button'
import { compileDiCImage } from './compile-image'
import { compileDiCSwitch } from './compile-switch'
import { compileDiCText } from './compile-text'
import { compileDiCView, type DiCViewNode } from './compile-view'
import {
  DIC_BUTTON_HOST,
  DIC_IMAGE_HOST,
  DIC_SWITCH_HOST,
  DIC_TEXT_HOST,
  DIC_VIEW_HOST,
  type DiCButtonHostProps,
  type DiCHostProps,
  type DiCHostType,
  type DiCImageHostProps,
  type DiCSwitchHostProps,
  type DiCTextHostProps,
  type DiCViewHostProps,
} from './react-host-types'

interface DiCTextInstance {
  kind: 'text'
  value: string
  hidden: boolean
}

interface DiCHostInstance {
  kind: 'host'
  type: DiCHostType
  props: DiCHostProps
  children: DiCChild[]
  hidden: boolean
}

type DiCChild =
  | DiCHostInstance
  | DiCTextInstance

export interface DiCReactContainer {
  children: DiCChild[]
  nodes: readonly DiCViewNode[]
  onCommit?: (
    nodes: readonly DiCViewNode[],
  ) => void
}

export interface DiCReactRoot {
  render(node: ReactNode): void
  unmount(): void
  getNodes(): readonly DiCViewNode[]
}

function isHostType(
  type: string,
): type is DiCHostType {
  return (
    type === DIC_VIEW_HOST ||
    type === DIC_TEXT_HOST ||
    type === DIC_IMAGE_HOST ||
    type === DIC_BUTTON_HOST ||
    type === DIC_SWITCH_HOST
  )
}

function removeChild(
  children: DiCChild[],
  child: DiCChild,
): void {
  const index = children.indexOf(child)
  if (index >= 0) {
    children.splice(index, 1)
  }
}

function appendChild(
  children: DiCChild[],
  child: DiCChild,
): void {
  removeChild(children, child)
  children.push(child)
}

function insertBefore(
  children: DiCChild[],
  child: DiCChild,
  before: DiCChild,
): void {
  removeChild(children, child)
  const index = children.indexOf(before)

  if (index < 0) {
    children.push(child)
    return
  }

  children.splice(index, 0, child)
}

function assertNoHostChildren(
  instance: DiCHostInstance,
): void {
  if (
    instance.children.some(
      (child) =>
        !child.hidden &&
        (
          child.kind === 'host' ||
          child.value.length > 0
        ),
    )
  ) {
    throw new DiCCapabilityError(
      `${instance.type} does not accept DiC children`,
    )
  }
}

function textValue(
  instance: DiCHostInstance,
): string {
  let output = ''

  for (const child of instance.children) {
    if (child.hidden) continue

    if (child.kind !== 'text') {
      throw new DiCCapabilityError(
        'DiC Text rich inline children are not implemented yet',
      )
    }

    output += child.value
  }

  return output
}

function withTheme(
  node: DiCViewNode,
  theme: ResolvedTheme,
): DiCViewNode {
  node.theme = theme
  return node
}

function implicitText(
  value: string,
  theme: ResolvedTheme,
): DiCViewNode {
  return withTheme(
    compileDiCText(
      resolveView({}, theme.breakpoints),
      resolveText({}, theme.breakpoints),
      value,
    ),
    theme,
  )
}

function compileChildren(
  instance: DiCHostInstance,
  theme: ResolvedTheme,
): readonly DiCViewNode[] {
  const output: DiCViewNode[] = []

  for (const child of instance.children) {
    if (child.hidden) continue

    if (child.kind === 'text') {
      if (child.value.length > 0) {
        output.push(
          implicitText(
            child.value,
            theme,
          ),
        )
      }
      continue
    }

    output.push(compileInstance(child))
  }

  return output
}

function compileInstance(
  instance: DiCHostInstance,
): DiCViewNode {
  switch (instance.type) {
    case DIC_VIEW_HOST: {
      const props =
        instance.props as DiCViewHostProps

      return withTheme(
        compileDiCView(
          props.view,
          {
            children: compileChildren(
              instance,
              props.theme,
            ),
          },
        ),
        props.theme,
      )
    }

    case DIC_TEXT_HOST: {
      const props =
        instance.props as DiCTextHostProps

      return withTheme(
        compileDiCText(
          props.view,
          props.text,
          textValue(instance),
        ),
        props.theme,
      )
    }

    case DIC_IMAGE_HOST: {
      assertNoHostChildren(instance)
      const props =
        instance.props as DiCImageHostProps

      return withTheme(
        compileDiCImage(
          props.view,
          props.image,
        ),
        props.theme,
      )
    }

    case DIC_BUTTON_HOST: {
      const props =
        instance.props as DiCButtonHostProps

      return withTheme(
        compileDiCButton(
          props.view,
          props.button,
          props.theme,
          {
            children: compileChildren(
              instance,
              props.theme,
            ),
          },
        ),
        props.theme,
      )
    }

    case DIC_SWITCH_HOST: {
      assertNoHostChildren(instance)
      const props =
        instance.props as DiCSwitchHostProps

      return withTheme(
        compileDiCSwitch(
          props.view,
          props.value,
          props.theme,
          {
            onChange: props.onChange,
          },
        ),
        props.theme,
      )
    }
  }
}

function compileContainer(
  container: DiCReactContainer,
): readonly DiCViewNode[] {
  const output: DiCViewNode[] = []

  for (const child of container.children) {
    if (child.hidden) continue

    if (child.kind === 'text') {
      if (child.value.trim().length !== 0) {
        throw new DiCCapabilityError(
          'Raw text cannot be a DiC React root',
        )
      }
      continue
    }

    output.push(compileInstance(child))
  }

  return output
}

function commitContainer(
  container: DiCReactContainer,
): void {
  const nodes = compileContainer(container)
  container.nodes = nodes
  container.onCommit?.(nodes)
}

let currentUpdatePriority = NoEventPriority

const hostTransitionContext =
  createContext<null>(null)

const hostConfig: Record<string, unknown> = {
  isPrimaryRenderer: false,
  warnsIfNotActing: false,
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,

  getRootHostContext() {
    return null
  },
  getChildHostContext() {
    return null
  },
  getPublicInstance(
    instance: DiCHostInstance,
  ) {
    return instance
  },

  createInstance(
    type: string,
    props: DiCHostProps,
  ): DiCHostInstance {
    if (!isHostType(type)) {
      throw new DiCCapabilityError(
        `Unsupported DiC React host "${type}"`,
      )
    }

    return {
      kind: 'host',
      type,
      props,
      children: [],
      hidden: false,
    }
  },
  createTextInstance(
    value: string,
  ): DiCTextInstance {
    return {
      kind: 'text',
      value,
      hidden: false,
    }
  },
  appendInitialChild(
    parent: DiCHostInstance,
    child: DiCChild,
  ) {
    appendChild(parent.children, child)
  },
  finalizeInitialChildren() {
    return false
  },
  shouldSetTextContent() {
    return false
  },

  appendChild(
    parent: DiCHostInstance,
    child: DiCChild,
  ) {
    appendChild(parent.children, child)
  },
  appendChildToContainer(
    container: DiCReactContainer,
    child: DiCChild,
  ) {
    appendChild(container.children, child)
  },
  insertBefore(
    parent: DiCHostInstance,
    child: DiCChild,
    before: DiCChild,
  ) {
    insertBefore(
      parent.children,
      child,
      before,
    )
  },
  insertInContainerBefore(
    container: DiCReactContainer,
    child: DiCChild,
    before: DiCChild,
  ) {
    insertBefore(
      container.children,
      child,
      before,
    )
  },
  removeChild(
    parent: DiCHostInstance,
    child: DiCChild,
  ) {
    removeChild(parent.children, child)
  },
  removeChildFromContainer(
    container: DiCReactContainer,
    child: DiCChild,
  ) {
    removeChild(container.children, child)
  },
  clearContainer(
    container: DiCReactContainer,
  ) {
    container.children.length = 0
    return false
  },

  commitUpdate(
    instance: DiCHostInstance,
    _type: DiCHostType,
    _oldProps: DiCHostProps,
    newProps: DiCHostProps,
  ) {
    instance.props = newProps
  },
  commitTextUpdate(
    instance: DiCTextInstance,
    _oldText: string,
    newText: string,
  ) {
    instance.value = newText
  },
  commitMount() {},
  resetTextContent(
    instance: DiCHostInstance,
  ) {
    instance.children.length = 0
  },

  hideInstance(
    instance: DiCHostInstance,
  ) {
    instance.hidden = true
  },
  unhideInstance(
    instance: DiCHostInstance,
  ) {
    instance.hidden = false
  },
  hideTextInstance(
    instance: DiCTextInstance,
  ) {
    instance.hidden = true
  },
  unhideTextInstance(
    instance: DiCTextInstance,
  ) {
    instance.hidden = false
  },

  prepareForCommit() {
    return null
  },
  resetAfterCommit(
    container: DiCReactContainer,
  ) {
    commitContainer(container)
  },
  preparePortalMount() {},

  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  supportsMicrotasks: true,
  scheduleMicrotask(
    callback: () => void,
  ) {
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(callback)
      return
    }

    void Promise.resolve().then(callback)
  },

  getInstanceFromNode() {
    return null
  },
  beforeActiveInstanceBlur() {},
  afterActiveInstanceBlur() {},
  detachDeletedInstance() {},
  prepareScopeUpdate() {},
  getInstanceFromScope() {
    return null
  },

  shouldAttemptEagerTransition() {
    return false
  },
  trackSchedulerEvent() {},
  resolveEventType() {
    return null
  },
  resolveEventTimeStamp() {
    return -1
  },
  requestPostPaintCallback() {},

  maySuspendCommit() {
    return false
  },
  preloadInstance() {
    return true
  },
  startSuspendingCommit() {},
  suspendInstance() {},
  waitForCommitToBeReady() {
    return null
  },

  NotPendingTransition: null,
  HostTransitionContext:
    hostTransitionContext,

  setCurrentUpdatePriority(
    priority: number,
  ) {
    currentUpdatePriority = priority
  },
  getCurrentUpdatePriority() {
    return currentUpdatePriority
  },
  resolveUpdatePriority() {
    return currentUpdatePriority ===
      NoEventPriority
      ? DefaultEventPriority
      : currentUpdatePriority
  },

  resetFormInstance() {},

  rendererPackageName: 'weave',
  rendererVersion: '0.0.0',

  applyViewTransitionName() {},
  restoreViewTransitionName() {},
  cancelViewTransitionName() {},
  cancelRootViewTransitionName() {},
  restoreRootViewTransitionName() {},
  InstanceMeasurement: null,
  measureInstance() {
    return null
  },
  wasInstanceInViewport() {
    return true
  },
  hasInstanceChanged() {
    return false
  },
  hasInstanceAffectedParent() {
    return false
  },
  suspendOnActiveViewTransition() {},
  startViewTransition(
    _state: unknown,
    _container: unknown,
    _types: unknown,
    mutation: () => void,
    layout: () => void,
    _afterMutation: () => void,
    spawned: () => void,
  ) {
    mutation()
    layout()
    spawned()
    return null
  },
}

const reconciler =
  createReconciler(hostConfig)

function wrappedNode(
  node: ReactNode,
): ReactNode {
  return createElement(
    DiCRendererScope,
    null,
    node,
  )
}

export function createDiCReactRoot(
  onCommit?: (
    nodes: readonly DiCViewNode[],
  ) => void,
): DiCReactRoot {
  const container: DiCReactContainer = {
    children: [],
    nodes: [],
    onCommit,
  }

  const root = reconciler.createContainer(
    container,
    ConcurrentRoot,
    null,
    false,
    null,
    'weave_dic_',
    (error: unknown) => {
      throw error
    },
    (error: unknown) => {
      console.error(error)
    },
    (error: unknown) => {
      console.error(error)
    },
    () => undefined,
  )

  return {
    render(node) {
      reconciler.updateContainerSync(
        wrappedNode(node),
        root,
        null,
        null,
      )
      reconciler.flushSyncWork()
    },
    unmount() {
      reconciler.updateContainerSync(
        null,
        root,
        null,
        null,
      )
      reconciler.flushSyncWork()
    },
    getNodes() {
      return container.nodes
    },
  }
}
