import { type KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { CommandPaletteCommand, CommandPaletteProps } from '../core/command-palette-types'
import type { ListDataItem } from '../core/list-types'
import { Column } from './Column'
import { Dialog } from './Dialog'
import { Input } from './Input'
import { useControllableBoolean } from './internal/use-controllable-boolean'
import { List } from './List'
import { Text } from './Text'

export function CommandPalette({
  groups,
  open,
  defaultOpen = false,
  onOpenChange,
  shortcut = false,
  searchLabel = 'Search commands',
  emptyContent = 'No matching commands',
  dialogLabel = 'Command palette',
}: CommandPaletteProps): import('react').JSX.Element {
  const { value: isOpen, request: requestOpen } = useControllableBoolean(
    open,
    defaultOpen,
    onOpenChange,
  )
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const listId = 'weave-command-palette-list-' + useId()

  useEffect(() => {
    if (!shortcut) return

    const handleShortcut = (event: globalThis.KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== 'k' ||
        (!event.ctrlKey && !event.metaKey) ||
        event.altKey ||
        event.shiftKey
      ) {
        return
      }

      event.preventDefault()
      requestOpen(true)
    }

    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [requestOpen, shortcut])

  const close = () => {
    setQuery('')
    requestOpen(false)
  }

  const normalizedQuery = query.trim().toLocaleLowerCase()
  const visibleGroups = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          commands: group.commands.filter((command) =>
            normalizedQuery.length === 0
              ? true
              : [command.title, command.description ?? '', ...(command.keywords ?? [])]
                  .join(' ')
                  .toLocaleLowerCase()
                  .includes(normalizedQuery),
          ),
        }))
        .filter((group) => group.commands.length > 0),
    [groups, normalizedQuery],
  )

  const actions = new Map<string, CommandPaletteCommand>()
  const items: ListDataItem[] = []

  for (const group of visibleGroups) {
    items.push({
      id: 'heading:' + group.id,
      text: <Text typo="label-small">{group.label}</Text>,
      disabled: true,
    })

    for (const command of group.commands) {
      const id = 'command:' + group.id + ':' + command.id
      actions.set(id, command)
      items.push({
        id,
        text: command.title,
        secondaryText: command.description,
        icon: command.icon,
        trailing:
          command.shortcut === undefined ? undefined : (
            <Text typo="label-small" color="secondary">
              {command.shortcut}
            </Text>
          ),
        disabled: command.disabled,
      })
    }
  }

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

    const enabledItems = listRef.current?.querySelectorAll<HTMLElement>(
      '[data-weave-list-item-id]:not([aria-disabled="true"])',
    )
    if (enabledItems === undefined || enabledItems.length === 0) return

    event.preventDefault()
    const item = event.key === 'ArrowDown' ? enabledItems[0] : enabledItems[enabledItems.length - 1]
    item?.focus()
  }

  const execute = (id: string | null) => {
    if (id === null) return

    const command = actions.get(id)
    if (command === undefined || command.disabled) return

    command.onSelect()
    close()
  }

  return (
    <Dialog
      modal
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) setQuery('')
        requestOpen(next)
      }}
      closeOnBackdrop
      initialFocus={inputRef}
      viewProps={{
        label: dialogLabel,
        // A disabled ListItem can receive pointer focus and prevent Escape's native cancel.
        onKeyDownCapture: (event) => {
          if (
            event.key === 'Escape' &&
            (event.target as HTMLElement).closest('[data-weave-list-item-id][aria-disabled="true"]')
          ) {
            close()
          }
        },
        data: { 'weave-command-palette': '' },
      }}
    >
      <Column gap={12}>
        <Input
          type="search"
          value={query}
          onChange={setQuery}
          placeholder={searchLabel}
          clearable={false}
          autoComplete="off"
          viewProps={{
            ref: inputRef,
            width: 'fill',
            label: searchLabel,
            controls: listId,
            onKeyDown: handleSearchKeyDown,
          }}
        />
        {items.length === 0 ? (
          <Text typo="body-medium" color="secondary" viewProps={{ role: 'status' }}>
            {emptyContent}
          </Text>
        ) : (
          <List
            items={items}
            selection="single"
            selected=""
            onSelect={execute}
            noDividers
            viewProps={{
              ref: listRef,
              id: listId,
              maxHeight: 360,
              overflowY: 'auto',
            }}
          />
        )}
      </Column>
    </Dialog>
  )
}
