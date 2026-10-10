import { IconChevronDown, IconChevronRight } from '@tabler/icons-react'
import { useRef, useState } from 'react'
import type { TreeViewItem, TreeViewProps } from '../core/tree-view-types'
import { ensureListStylesheet } from '../renderers/dom/list-stylesheet'
import { resolveListItemTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { useTheme } from '../theme/theme-context'
import { Column } from './Column'
import { Icon } from './Icon'
import { assignRef } from './internal/assign-ref'
import { Row } from './Row'
import { Text } from './Text'
import { View } from './View'

function assertUniqueIds(items: readonly TreeViewItem[]): void {
  const ids = new Set<string>()
  const visit = (nodes: readonly TreeViewItem[]) => {
    for (const node of nodes) {
      if (ids.has(node.id)) throw new Error(`TreeView item id "${node.id}" must be unique`)
      ids.add(node.id)
      if (node.children !== undefined) visit(node.children)
    }
  }
  visit(items)
}

interface VisibleNode {
  node: TreeViewItem
  parentId: string | null
  depth: number
  position: number
  setSize: number
}

function visibleNodes(
  items: readonly TreeViewItem[],
  expanded: ReadonlySet<string>,
): VisibleNode[] {
  const result: VisibleNode[] = []
  const visit = (nodes: readonly TreeViewItem[], parentId: string | null, depth: number) => {
    nodes.forEach((node, index) => {
      result.push({ node, parentId, depth, position: index + 1, setSize: nodes.length })
      if (expanded.has(node.id) && node.children !== undefined) {
        visit(node.children, node.id, depth + 1)
      }
    })
  }
  visit(items, null, 0)
  return result
}

export function TreeView({
  items,
  label,
  expanded,
  defaultExpanded = [],
  onExpandedChange,
  selected,
  defaultSelected = null,
  onSelect,
  viewProps = {},
}: TreeViewProps): import('react').JSX.Element {
  assertUniqueIds(items)
  const [uncontrolledExpanded, setUncontrolledExpanded] =
    useState<readonly string[]>(defaultExpanded)
  const [uncontrolledSelected, setUncontrolledSelected] = useState<string | null>(defaultSelected)
  const [storedFocusId, setStoredFocusId] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  useStaticStylesheet(ensureListStylesheet)
  const listItemClassName = useRuntimeStyleClass('list-item-theme', resolveListItemTheme(theme))
  const primaryTypo = theme.components.ListItem?.base?.primaryTypo ?? 'body-medium'

  const expandedIds = expanded ?? uncontrolledExpanded
  const expandedSet = new Set(expandedIds)
  const currentSelected = selected === undefined ? uncontrolledSelected : selected
  const visible = visibleNodes(items, expandedSet)
  const enabledIds = visible.filter(({ node }) => !node.disabled).map(({ node }) => node.id)
  const focusId =
    storedFocusId !== null && enabledIds.includes(storedFocusId)
      ? storedFocusId
      : currentSelected !== null && enabledIds.includes(currentSelected)
        ? currentSelected
        : (enabledIds[0] ?? null)

  const focusNode = (id: string) => {
    const nodes = rootRef.current?.querySelectorAll<HTMLElement>('[data-weave-tree-item-id]')
    for (const node of nodes ?? []) {
      if (node.dataset.weaveTreeItemId !== id) continue
      setStoredFocusId(id)
      node.focus()
      return
    }
  }

  const toggle = (id: string) => {
    const next = expandedSet.has(id)
      ? expandedIds.filter((value) => value !== id)
      : [...expandedIds, id]
    if (expanded === undefined) setUncontrolledExpanded(next)
    onExpandedChange?.(next)
  }

  const choose = (id: string) => {
    if (currentSelected === id) return
    if (selected === undefined) setUncontrolledSelected(id)
    onSelect?.(id)
  }

  const activate = (node: TreeViewItem) => {
    if (node.disabled) return
    focusNode(node.id)
    choose(node.id)
    if (node.children !== undefined && node.children.length > 0) toggle(node.id)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, node: TreeViewItem) => {
    if (event.target !== event.currentTarget || node.disabled) return

    const index = enabledIds.indexOf(node.id)
    let nextId: string | undefined

    switch (event.key) {
      case 'ArrowDown':
        nextId = enabledIds[index + 1]
        break
      case 'ArrowUp':
        nextId = enabledIds[index - 1]
        break
      case 'Home':
        nextId = enabledIds[0]
        break
      case 'End':
        nextId = enabledIds[enabledIds.length - 1]
        break
      case 'ArrowRight': {
        if (node.children?.length) {
          if (!expandedSet.has(node.id)) toggle(node.id)
          else nextId = node.children.find((child) => enabledIds.includes(child.id))?.id
        }
        break
      }
      case 'ArrowLeft': {
        if (node.children?.length && expandedSet.has(node.id)) toggle(node.id)
        else {
          const parentId = visible.find(({ node: current }) => current.id === node.id)?.parentId
          if (parentId !== null && parentId !== undefined && enabledIds.includes(parentId)) {
            nextId = parentId
          }
        }
        break
      }
      case 'Enter':
      case ' ':
        activate(node)
        break
      default:
        return
    }

    event.preventDefault()
    if (nextId !== undefined) focusNode(nextId)
  }

  return (
    <Column
      {...viewProps}
      ref={(node) => {
        rootRef.current = node
        assignRef(viewProps.ref, node)
      }}
      role="tree"
      label={label}
      data={{ ...viewProps.data, 'weave-tree-view': '' }}
    >
      {visible.map(({ node, depth, position, setSize }) => {
        const hasChildren = (node.children?.length ?? 0) > 0
        const open = hasChildren && expandedSet.has(node.id)
        const active = currentSelected === node.id

        return (
          <Row
            key={node.id}
            role="treeitem"
            level={depth + 1}
            aria-posinset={position}
            aria-setsize={setSize}
            expanded={hasChildren ? open : undefined}
            selected={active}
            disabled={node.disabled || undefined}
            tabIndex={!node.disabled && focusId === node.id ? 0 : -1}
            onFocus={(event) => {
              if (event.target === event.currentTarget) setStoredFocusId(node.id)
            }}
            onKeyDown={(event) => handleKeyDown(event, node)}
            onClick={() => activate(node)}
            className={['weave-list-item', listItemClassName].filter(Boolean).join(' ')}
            data={{
              'weave-tree-item-id': node.id,
              'weave-list-item-selectable': node.disabled ? 'false' : 'true',
              'weave-list-item-selected': active ? 'true' : 'false',
            }}
          >
            {depth > 0 ? (
              <View
                role="presentation"
                aria-hidden="true"
                width={'calc(var(--weave-list-item-icon-size) * ' + depth + ')'}
                shrink={0}
              />
            ) : null}
            <View className="weave-list-item__icon" aria-hidden="true">
              {hasChildren ? (
                <Icon icon={open ? IconChevronDown : IconChevronRight} size="small" />
              ) : null}
            </View>
            <Text
              singleLine
              color="inherit"
              typo={primaryTypo}
              viewProps={{ grow: 1, minWidth: 0 }}
            >
              {node.label}
            </Text>
          </Row>
        )
      })}
    </Column>
  )
}
