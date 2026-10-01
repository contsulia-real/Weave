import type { TableHeaderProps } from '../core/table-types'
import { TableSectionContext } from './internal/table-context'
import { useViewHost } from './internal/use-view-host'

export function TableHeader({ children, viewProps = {} }: TableHeaderProps) {
  const { elementRef, className, inlineStyle, resolved } = useViewHost(viewProps)

  return (
    <TableSectionContext.Provider value="head">
      <thead
        {...resolved.domProps}
        ref={elementRef}
        data-weave-view=""
        data-weave-layout={resolved.layout}
        className={['weave-table__head', className].filter(Boolean).join(' ')}
        style={inlineStyle}
      >
        {children}
      </thead>
    </TableSectionContext.Provider>
  )
}
