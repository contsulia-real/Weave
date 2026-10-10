import { useId, useRef, useState } from 'react'
import type { TreeViewItem, TreeViewProps } from '../core/tree-view-types'
import { ensureListStylesheet } from '../renderers/dom/list-stylesheet'
import { resolveListItemTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { useTheme } from '../theme/theme-context'
import { Column } from './Column'
import { Grid } from './Grid'
import { Icon } from './Icon'
import { assignRef } from './internal/assign-ref'
import { chevronRightIcon } from './internal/control-icons'
import { fromInteractiveDescendant } from './internal/interactive-descendant'
import { Presence } from './Presence'
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
}

function visibleNodes(
  items: readonly TreeViewItem[],
  expanded: ReadonlySet<string>,
): VisibleNode[] {
  const result: VisibleNode[] = []
  const visit = (nodes: readonly TreeViewItem[], parentId: string | null) => {
    for (const node of nodes) {
      result.push({ node, parentId })
      if (expanded.has(node.id) && node.children !== undefined) {
        visit(node.children, node.id)
      }
    }
  }
  visit(items, null)
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
  const baseId = useId().replace(/:/g, '')
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

  const renderItems = (nodes: readonly TreeViewItem[], depth: number): React.ReactNode =>
    nodes.map((node, index) => {
      const hasChildren = (node.children?.length ?? 0) > 0
      const open = hasChildren && expandedSet.has(node.id)
      const active = currentSelected === node.id
      const groupId = `weave-tree-${baseId}-group-${encodeURIComponent(node.id)}`

      return (
        <Column key={node.id} role="presentation" minWidth={0} width="fill">
          <Row
            role="treeitem"
            level={depth + 1}
            aria-posinset={index + 1}
            aria-setsize={nodes.length}
            owns={hasChildren ? groupId : undefined}
            expanded={hasChildren ? open : undefined}
            selected={active}
            disabled={node.disabled || undefined}
            tabIndex={!node.disabled && focusId === node.id ? 0 : -1}
            onFocus={(event) => {
              if (event.target === event.currentTarget) setStoredFocusId(node.id)
            }}
            onKeyDown={(event) => handleKeyDown(event, node)}
            onClick={(event) => {
              if (!fromInteractiveDescendant(event.target, event.currentTarget)) activate(node)
            }}
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
                width={`calc(var(--weave-list-item-icon-size) * ${depth})`}
                shrink={0}
              />
            ) : null}
            <Row
              className="weave-list-item__icon"
              align="center"
              justify="center"
              aria-hidden="true"
            >
              {hasChildren ? (
                <Row
                  align="center"
                  justify="center"
                  width="fill"
                  height="fill"
                  rotate={open ? 90 : 0}
                  transition={{ properties: ['transform'], spring: 'gentle' }}
                >
                  <Icon
                    svg={chevronRightIcon}
                    size="medium"
                    viewProps={{ width: '100%', height: '100%' }}
                  />
                </Row>
              ) : null}
            </Row>
            {node.leading === undefined ? null : (
              <Row
                className="weave-list-item__icon"
                align="center"
                justify="center"
                aria-hidden="true"
              >
                {node.leading}
              </Row>
            )}
            <Text
              singleLine
              color="inherit"
              typo={primaryTypo}
              viewProps={{ grow: 1, minWidth: 0 }}
            >
              {node.label}
            </Text>
            {node.trailing === undefined ? null : (
              <View className="weave-list-item__trailing">{node.trailing}</View>
            )}
          </Row>
          {hasChildren ? (
            <Grid
              rows={open ? 'minmax(0, 1fr)' : 'minmax(0, 0fr)'}
              transition={{ properties: ['gridTemplateRows'], spring: 'gentle' }}
              minWidth={0}
              role="presentation"
            >
              <View
                id={groupId}
                role="group"
                minWidth={0}
                minHeight={0}
                overflow="hidden"
                inert={!open}
                aria-hidden={open ? undefined : true}
              >
                <Presence present={open}>
                  <Column exit={{ animation: 'fade-up', spring: 'gentle' }}>
                    {renderItems(node.children ?? [], depth + 1)}
                  </Column>
                </Presence>
              </View>
            </Grid>
          ) : null}
        </Column>
      )
    })

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
      {renderItems(items, 0)}
    </Column>
  )
}
