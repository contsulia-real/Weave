import {
  useCallback,
  useInsertionEffect,
  useMemo,
  useRef,
  type Ref,
} from 'react'
import type { ListProps } from '../core/list-types'
import { resolveListTheme } from '../renderers/dom/resolve-component-theme'
import { ensureListStylesheet } from '../renderers/dom/list-stylesheet'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { View } from './View'
import { ListContext } from './internal/list-context'
import {
  compositeVirtualEntries,
  dataVirtualEntries,
  listDescriptors,
} from './internal/list-content'
import { useListFocus } from './internal/use-list-focus'
import { useListSelection } from './internal/use-list-selection'
import {
  VirtualListWindow,
} from './internal/VirtualListWindow'

function assignRef<T>(
  ref: Ref<T> | undefined,
  value: T | null,
): void {
  if (ref === null || ref === undefined) return

  if (typeof ref === 'function') {
    ref(value)
    return
  }

  ref.current = value
}

export function List(
  props: ListProps,
) {
  const {
    disabled = false,
    orientation = 'vertical',
    gap,
    noDividers = false,
    virtualized = false,
    viewProps = {},
  } = props
  const rootRef =
    useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useInsertionEffect(
    ensureListStylesheet,
    [],
  )

  const themeClassName =
    useRuntimeStyleClass(
      'list-theme',
      resolveListTheme(theme),
    )

  const descriptors = useMemo(
    () =>
      listDescriptors(
        props.items,
        props.children,
      ),
    [
      props.items,
      props.children,
    ],
  )

  const enabledIds = useMemo(
    () =>
      descriptors
        .filter(
          (item) =>
            !disabled &&
            !item.disabled,
        )
        .map((item) => item.id),
    [descriptors, disabled],
  )

  const {
    selection,
    selectedIds,
    selectItem,
  } = useListSelection(
    props,
    enabledIds,
  )
  const {
    focusId,
    setFocusId,
    moveFocus,
  } = useListFocus(
    enabledIds,
    selectedIds,
    rootRef,
  )

  const contextValue = useMemo(
    () => ({
      selection,
      orientation,
      disabled,
      selectedIds,
      focusId,
      setFocusId,
      selectItem,
      moveFocus,
    }),
    [
      disabled,
      focusId,
      moveFocus,
      orientation,
      selectItem,
      selectedIds,
      selection,
      setFocusId,
    ],
  )

  const setRootRef = useCallback(
    (
      element:
        HTMLDivElement | null,
    ) => {
      rootRef.current = element
      assignRef(
        viewProps.ref,
        element,
      )
    },
    [viewProps.ref],
  )

  const itemTheme =
    theme.components.ListItem?.base
  const dataEntries =
    props.items === undefined
      ? undefined
      : dataVirtualEntries(
          props.items,
          disabled,
          itemTheme?.primaryTypo,
          itemTheme?.secondaryTypo,
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
            entries={virtualEntries}
            orientation={orientation}
            rootRef={rootRef}
            focusId={focusId}
          />
        )
      : (
          dataEntries === undefined
            ? props.children
            : dataEntries.map(
                (entry) => entry.node,
              )
        )

  return (
    <ListContext.Provider
      value={contextValue}
    >
      <View
        {...viewProps}
        ref={setRootRef}
        disabled={
          disabled
            ? true
            : undefined
        }
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
          'weave-list-dividers':
            noDividers
              ? 'false'
              : 'true',
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
