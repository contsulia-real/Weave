import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  useCallback,
  useInsertionEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type {
  ReactElement,
  ReactNode,
  Ref,
} from 'react'
import type {
  IconComponent,
  IconSvg,
} from '../core/icon-types'
import type {
  ListDataItem,
  ListItemIcon,
  ListItemProps,
  ListProps,
} from '../core/list-types'
import type {
  TextTypo,
} from '../core/text-types'
import {
  resolveListTheme,
} from '../renderers/dom/resolve-component-theme'
import {
  ensureListStylesheet,
} from '../renderers/dom/list-stylesheet'
import {
  useRuntimeStyleClass,
} from '../renderers/dom/runtime-class'
import {
  useTheme,
} from '../theme/theme-context'
import {
  Icon,
} from './Icon'
import {
  ListItem,
} from './ListItem'
import {
  Text,
} from './Text'
import {
  View,
} from './View'
import {
  ListContext,
  type ListFocusMove,
} from './internal/list-context'
import {
  VirtualListWindow,
  type VirtualListEntry,
} from './internal/VirtualListWindow'

interface ListDescriptor {
  id: string
  disabled: boolean
}

interface SingleListSelectionState {
  selection: 'single'
  selected?: string | null
  defaultSelected?: string | null
  onSelect?: (
    selected: string | null,
  ) => void
}

interface MultipleListSelectionState {
  selection: 'multiple'
  selected?: readonly string[]
  defaultSelected?: readonly string[]
  onSelect?: (
    selected:
      readonly string[],
  ) => void
}

const EMPTY_SELECTED_IDS: readonly string[] = []

function assignRef<T>(
  ref: Ref<T> | undefined,
  value: T | null,
): void {
  if (ref === null || ref === undefined) {
    return
  }

  if (typeof ref === 'function') {
    ref(value)
    return
  }

  ref.current = value
}

function compositeDescriptors(
  children: ReactNode,
  output: ListDescriptor[] = [],
): ListDescriptor[] {
  Children.forEach(
    children,
    (child) => {
      if (!isValidElement(child)) {
        return
      }

      if (child.type === Fragment) {
        compositeDescriptors(
          (
            child.props as {
              children?: ReactNode
            }
          ).children,
          output,
        )
        return
      }

      if (child.type !== ListItem) {
        return
      }

      const itemProps =
        child.props as ListItemProps

      output.push({
        id: itemProps.id,
        disabled:
          itemProps.disabled === true,
      })
    },
  )

  return output
}

function compositeVirtualEntries(
  children: ReactNode,
  output:
    VirtualListEntry[] = [],
): VirtualListEntry[] {
  Children.forEach(
    children,
    (child) => {
      if (!isValidElement(child)) {
        return
      }

      if (child.type === Fragment) {
        compositeVirtualEntries(
          (
            child.props as {
              children?: ReactNode
            }
          ).children,
          output,
        )
        return
      }

      if (child.type !== ListItem) {
        return
      }

      const element =
        child as ReactElement<
          ListItemProps
        >
      const itemProps =
        element.props

      output.push({
        id: itemProps.id,
        node: cloneElement(
          element,
          {
            key: itemProps.id,
          },
        ),
      })
    },
  )

  return output
}

function assertUniqueIds(
  descriptors:
    readonly ListDescriptor[],
): void {
  const seen =
    new Set<string>()

  for (const item of descriptors) {
    if (seen.has(item.id)) {
      throw new Error(
        `List item id "${item.id}" is duplicated`,
      )
    }

    seen.add(item.id)
  }
}

function listIcon(
  icon: ListItemIcon,
) {
  if (isValidElement(icon)) {
    return (
      <Icon
        svg={icon as IconSvg}
        size="medium"
        stroke="regular"
        viewProps={{
          className:
            'weave-list-item__icon',
          width:
            'var(--weave-list-item-icon-size)',
          height:
            'var(--weave-list-item-icon-size)',
          'aria-hidden': true,
        }}
      />
    )
  }

  return (
    <Icon
      icon={icon as IconComponent}
      size="medium"
      stroke="regular"
      viewProps={{
        className:
          'weave-list-item__icon',
        'aria-hidden': true,
      }}
    />
  )
}

function dataItemContent(
  item: ListDataItem,
  primaryTypo:
    TextTypo | undefined,
  secondaryTypo:
    TextTypo | undefined,
) {
  return (
    <>
      {item.icon === undefined
        ? null
        : listIcon(item.icon)}

      <View
        className=
          "weave-list-item__text"
      >
        <Text
          typo={
            primaryTypo ??
            'body-medium'
          }
        >
          {item.text}
        </Text>

        {item.secondaryText ===
        undefined
          ? null
          : (
              <Text
                typo={
                  secondaryTypo ??
                  'body-small'
                }
                viewProps={{
                  className:
                    'weave-list-item__secondary',
                }}
              >
                {
                  item.secondaryText
                }
              </Text>
            )}
      </View>

      {item.trailing === undefined
        ? null
        : (
            <View
              className=
                "weave-list-item__trailing"
            >
              {item.trailing}
            </View>
          )}
    </>
  )
}

function findInitialActiveId(
  enabledIds:
    readonly string[],
  selectedIds:
    ReadonlySet<string>,
): string | null {
  for (const id of enabledIds) {
    if (selectedIds.has(id)) {
      return id
    }
  }

  return enabledIds[0] ?? null
}

export function List(
  props: ListProps,
) {
  const {
    orientation = 'vertical',
    gap,
    virtualized = false,
    viewProps = {},
  } = props
  const selection =
    props.selection ?? 'none'
  const rootRef =
    useRef<HTMLDivElement>(null)
  const { theme } =
    useTheme()

  useInsertionEffect(
    ensureListStylesheet,
    [],
  )

  const themeClassName =
    useRuntimeStyleClass(
      'list-theme',
      resolveListTheme(theme),
    )

  const descriptors =
    useMemo<
      readonly ListDescriptor[]
    >(
      () => {
        const next =
          props.items !== undefined
            ? props.items.map(
                (item) => ({
                  id: item.id,
                  disabled:
                    item.disabled ===
                    true,
                }),
              )
            : compositeDescriptors(
                props.children,
              )

        assertUniqueIds(next)
        return next
      },
      [
        props.items,
        props.children,
      ],
    )

  const enabledIds =
    useMemo(
      () =>
        descriptors
          .filter(
            (item) =>
              !item.disabled,
          )
          .map(
            (item) => item.id,
          ),
      [descriptors],
    )

  const singleProps =
    selection === 'single'
      ? (
          props as
            SingleListSelectionState
        )
      : undefined
  const multipleProps =
    selection === 'multiple'
      ? (
          props as
            MultipleListSelectionState
        )
      : undefined

  const [
    uncontrolledSingle,
    setUncontrolledSingle,
  ] = useState<string | null>(
    singleProps?.defaultSelected ??
      null,
  )
  const [
    uncontrolledMultiple,
    setUncontrolledMultiple,
  ] = useState<
    readonly string[]
  >(
    multipleProps?.defaultSelected ??
      [],
  )

  const currentSingle =
    selection === 'single'
      ? (
          singleProps?.selected ??
          uncontrolledSingle
        )
      : null
  const currentMultiple =
    selection === 'multiple'
      ? (
          multipleProps?.selected ??
          uncontrolledMultiple
        )
      : EMPTY_SELECTED_IDS

  const selectedIds =
    useMemo(
      () => {
        if (
          selection === 'single'
        ) {
          return new Set(
            currentSingle === null
              ? []
              : [currentSingle],
          )
        }

        if (
          selection === 'multiple'
        ) {
          return new Set(
            currentMultiple,
          )
        }

        return new Set<string>()
      },
      [
        currentMultiple,
        currentSingle,
        selection,
      ],
    )

  const [
    storedActiveId,
    setStoredActiveId,
  ] = useState<string | null>(
    () =>
      findInitialActiveId(
        enabledIds,
        selectedIds,
      ),
  )

  const activeId =
    storedActiveId !== null &&
    enabledIds.includes(
      storedActiveId,
    )
      ? storedActiveId
      : findInitialActiveId(
          enabledIds,
          selectedIds,
        )

  const setActiveId =
    useCallback(
      (id: string) => {
        if (
          enabledIds.includes(id)
        ) {
          setStoredActiveId(id)
        }
      },
      [enabledIds],
    )

  const selectItem =
    useCallback(
      (id: string) => {
        if (
          !enabledIds.includes(id)
        ) {
          return
        }

        if (
          selection === 'single'
        ) {
          const selectionProps =
            props as
              SingleListSelectionState

          if (
            currentSingle === id
          ) {
            return
          }

          if (
            selectionProps.selected ===
            undefined
          ) {
            setUncontrolledSingle(
              id,
            )
          }

          selectionProps.onSelect?.(
            id,
          )
          return
        }

        if (
          selection === 'multiple'
        ) {
          const selectionProps =
            props as
              MultipleListSelectionState
          const next =
            currentMultiple.includes(
              id,
            )
              ? currentMultiple.filter(
                  (selectedId) =>
                    selectedId !== id,
                )
              : [
                  ...currentMultiple,
                  id,
                ]

          if (
            selectionProps.selected ===
            undefined
          ) {
            setUncontrolledMultiple(
              next,
            )
          }

          selectionProps.onSelect?.(
            next,
          )
        }
      },
      [
        currentMultiple,
        currentSingle,
        enabledIds,
        props,
        selection,
      ],
    )

  const moveFocus =
    useCallback(
      (
        id: string,
        move: ListFocusMove,
      ) => {
        if (
          enabledIds.length === 0
        ) {
          return
        }

        const currentIndex =
          Math.max(
            0,
            enabledIds.indexOf(id),
          )
        let nextIndex =
          currentIndex

        if (move === 'first') {
          nextIndex = 0
        } else if (
          move === 'last'
        ) {
          nextIndex =
            enabledIds.length - 1
        } else if (
          move === 'previous'
        ) {
          nextIndex =
            Math.max(
              0,
              currentIndex - 1,
            )
        } else {
          nextIndex =
            Math.min(
              enabledIds.length - 1,
              currentIndex + 1,
            )
        }

        const nextId =
          enabledIds[nextIndex]

        if (nextId === undefined) {
          return
        }

        setStoredActiveId(nextId)

        const focusItem = () => {
          const items =
            rootRef.current
              ?.querySelectorAll<HTMLElement>(
                '[data-weave-list-item-id]',
              )

          if (items === undefined) {
            return false
          }

          for (const item of items) {
            if (
              item.dataset
                .weaveListItemId ===
              nextId
            ) {
              item.focus()
              return true
            }
          }

          return false
        }

        if (focusItem()) {
          return
        }

        const view =
          rootRef.current
            ?.ownerDocument
            .defaultView

        if (
          view !== null &&
          view !== undefined &&
          typeof view
            .requestAnimationFrame ===
            'function'
        ) {
          view.requestAnimationFrame(
            focusItem,
          )
        } else {
          queueMicrotask(
            focusItem,
          )
        }
      },
      [enabledIds],
    )

  const contextValue =
    useMemo(
      () => ({
        selection,
        orientation,
        selectedIds,
        activeId,
        setActiveId,
        selectItem,
        moveFocus,
      }),
      [
        activeId,
        moveFocus,
        orientation,
        selectItem,
        selectedIds,
        selection,
        setActiveId,
      ],
    )

  const setRootRef =
    useCallback(
      (
        element:
          HTMLDivElement | null,
      ) => {
        rootRef.current =
          element
        assignRef(
          viewProps.ref,
          element,
        )
      },
      [viewProps.ref],
    )

  const itemTheme =
    theme.components.ListItem
      ?.base

  const dataEntries =
    props.items === undefined
      ? undefined
      : props.items.map(
          (item) => ({
            id: item.id,
            node: (
              <ListItem
                key={item.id}
                id={item.id}
                disabled={
                  item.disabled
                }
              >
                {dataItemContent(
                  item,
                  itemTheme
                    ?.primaryTypo,
                  itemTheme
                    ?.secondaryTypo,
                )}
              </ListItem>
            ),
          }),
        )

  const virtualEntries =
    dataEntries ??
    compositeVirtualEntries(
      props.children,
    )

  const content =
    virtualized
      ? (
          <VirtualListWindow
            entries={
              virtualEntries
            }
            orientation={
              orientation
            }
            rootRef={
              rootRef
            }
            activeId={
              activeId
            }
          />
        )
      : (
          dataEntries ===
          undefined
            ? props.children
            : dataEntries.map(
                (entry) =>
                  entry.node,
              )
        )

  return (
    <ListContext.Provider
      value={contextValue}
    >
      <View
        {...viewProps}
        ref={setRootRef}
        role={
          selection === 'none'
            ? 'list'
            : 'listbox'
        }
        aria-multiselectable={
          selection === 'multiple'
            ? true
            : undefined
        }
        aria-orientation={
          selection === 'none'
            ? undefined
            : orientation
        }
        layout={
          virtualized
            ? undefined
            : 'flex'
        }
        direction={
          virtualized
            ? undefined
            : (
                orientation ===
                  'vertical'
                  ? 'column'
                  : 'row'
              )
        }
        gap={gap}
        position={
          virtualized
            ? 'relative'
            : viewProps.position
        }
        className={[
          'weave-list',
          themeClassName,
          viewProps.className,
        ].filter(Boolean).join(' ')}
        data={{
          ...viewProps.data,
          'weave-list': '',
          'weave-list-orientation':
            orientation,
          'weave-list-selection':
            selection,
          'weave-list-virtualized':
            virtualized
              ? 'true'
              : 'false',
        }}
      >
        {content}
      </View>
    </ListContext.Provider>
  )
}