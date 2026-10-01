import type { TableBodyProps } from '../core/table-types'
import { TableSectionContext } from './internal/table-context'
import { useViewHost } from './internal/use-view-host'

export function TableBody({ children, viewProps = {} }: TableBodyProps) {
  const { elementRef, className, inlineStyle, resolved } = useViewHost(viewProps)

  return (
    <TableSectionContext.Provider value="body">
      <tbody
        {...resolved.domProps}
        ref={elementRef}
        data-weave-view=""
        data-weave-layout={resolved.layout}
        className={['weave-table__body', className].filter(Boolean).join(' ')}
        style={inlineStyle}
      >
        {children}
      </tbody>
    </TableSectionContext.Provider>
  )
}
