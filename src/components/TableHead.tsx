import type { CSSProperties } from 'react'
import type { TableHeadProps } from '../core/table-types'
import { dimension } from '../core/values'
import { useTableRow } from './internal/table-context'
import { useViewHost } from './internal/use-view-host'

export function TableHead(props: TableHeadProps): import('react').JSX.Element {
  const { children, align = 'start', width, minWidth, maxWidth, viewProps = {} } = props
  const row = useTableRow()

  if (row.section !== 'head') {
    throw new TypeError('TableHead must be used inside a TableHeader row')
  }

  const componentStyle: CSSProperties = {
    textAlign: align,
    width: dimension(width),
    minWidth: dimension(minWidth),
    maxWidth: dimension(maxWidth),
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(
    viewProps,
    componentStyle,
    'table-head',
  )

  return (
    <th
      {...resolved.domProps}
      ref={elementRef}
      scope="col"
      data-weave-view=""
      data-weave-table-head=""
      data-weave-layout={resolved.layout}
      className={['weave-table__head-cell', className].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      {children}
    </th>
  )
}
