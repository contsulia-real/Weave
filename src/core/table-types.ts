import type { ReactNode, Ref } from 'react'
import type { Dimension, ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type TableCellAlign = 'start' | 'center' | 'end'

export interface TableSelectedCell {
  rowId: string
  cellId: string
}

export type TableViewProps = Omit<ViewCoreProps<HTMLDivElement>, 'children'> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLDivElement>
  }

export type TableSectionViewProps = Omit<ViewCoreProps<HTMLTableSectionElement>, 'children'> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLTableSectionElement>
  }

export type TableRowViewProps = Omit<ViewCoreProps<HTMLTableRowElement>, 'children'> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLTableRowElement>
  }

export type TableHeadViewProps = Omit<ViewCoreProps<HTMLTableCellElement>, 'children'> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLTableCellElement>
  }

export type TableCellViewProps = Omit<ViewCoreProps<HTMLTableCellElement>, 'children'> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLTableCellElement>
  }

interface TableBaseProps {
  children: ReactNode
  dense?: boolean
  verticalBorders?: boolean
  stickyHeader?: boolean
  viewProps?: TableViewProps
}

interface TableStaticProps extends TableBaseProps {
  selectable?: false
  selected?: never
  defaultSelected?: never
  onSelect?: never
}

interface TableSelectableProps extends TableBaseProps {
  selectable: true
  selected?: readonly TableSelectedCell[]
  defaultSelected?: readonly TableSelectedCell[]
  onSelect?: (selected: readonly TableSelectedCell[]) => void
}

export type TableProps = TableStaticProps | TableSelectableProps

export interface TableHeaderProps {
  children: ReactNode
  viewProps?: TableSectionViewProps
}

export interface TableBodyProps {
  children: ReactNode
  viewProps?: TableSectionViewProps
}

export interface TableRowProps {
  id?: string
  children: ReactNode
  viewProps?: TableRowViewProps
}

interface TableCellLayoutProps {
  align?: TableCellAlign
  width?: Dimension
  minWidth?: Dimension
  maxWidth?: Dimension
}

export interface TableHeadProps extends TableCellLayoutProps {
  children?: ReactNode
  viewProps?: TableHeadViewProps
}

export interface TableCellProps extends TableCellLayoutProps {
  id?: string
  children?: ReactNode
  viewProps?: TableCellViewProps
}
