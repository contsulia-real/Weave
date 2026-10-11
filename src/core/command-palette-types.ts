import type { ListItemIcon } from './list-types'

export interface CommandPaletteCommand {
  id: string
  title: string
  description?: string
  keywords?: readonly string[]
  icon?: ListItemIcon
  shortcut?: string
  disabled?: boolean
  onSelect: () => void
}

export interface CommandPaletteGroup {
  id: string
  label: string
  commands: readonly CommandPaletteCommand[]
}

export interface CommandPaletteProps {
  groups: readonly CommandPaletteGroup[]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  shortcut?: boolean
  searchLabel?: string
  emptyContent?: string
  dialogLabel?: string
}
