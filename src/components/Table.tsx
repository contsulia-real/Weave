import { useContext, useMemo } from 'react'
import type { TableProps } from '../core/table-types'
import { resolveTableTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { ensureTableStylesheet } from '../renderers/dom/table-stylesheet'
import { useTheme } from '../theme/theme-context'
import { TableContext, TableDeclaredCellsContext } from './internal/table-context'
import { useTableSelection } from './internal/use-table-selection'
import { View } from './View'

export function Table(props: TableProps): import('react').JSX.Element {
  const {
    children,
    dense = false,
    verticalBorders = false,
    stickyHeader = false,
    viewProps = {},
  } = props
  const { theme } = useTheme()
  const themeDeclarations = useMemo(() => resolveTableTheme(theme), [theme])
  const themeClassName = useRuntimeStyleClass('table-theme', themeDeclarations)
  const selection = useTableSelection(props)
  const declaredCells = useContext(TableDeclaredCellsContext)

  useStaticStylesheet(ensureTableStylesheet)

  const className = [
    'weave-table',
    dense ? 'weave-table--dense' : undefined,
    verticalBorders ? 'weave-table--vertical-borders' : undefined,
    stickyHeader ? 'weave-table--sticky-header' : undefined,
    selection.selectable ? 'weave-table--selectable' : undefined,
    themeClassName,
    viewProps.className,
  ]
    .filter(Boolean)
    .join(' ')

  const contextValue = useMemo(
    () => ({
      ...selection,
      dense,
    }),
    [dense, selection],
  )

  return (
    <TableContext.Provider value={contextValue}>
      <View {...viewProps} width={viewProps.width ?? 'fill'} overflowX="auto" className={className}>
        <table
          className="weave-table__table"
          aria-rowcount={
            viewProps.data?.['weave-data-grid-virtualized'] === 'true'
              ? declaredCells?.rowCount
              : undefined
          }
        >
          {children}
        </table>
      </View>
    </TableContext.Provider>
  )
}
