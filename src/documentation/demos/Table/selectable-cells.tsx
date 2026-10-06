import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type TableSelectedCell,
} from '../../../index'

export default function TableSelectableCellsDemo() {
  const [selected, setSelected] = useState<readonly TableSelectedCell[]>([
    { rowId: 'alpha', cellId: 'value' },
  ])

  return (
    <Table selectable selected={selected} onSelect={setSelected}>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow id="alpha">
          <TableCell id="name">Alpha</TableCell>
          <TableCell id="value">42</TableCell>
        </TableRow>
        <TableRow id="beta">
          <TableCell id="name">Beta</TableCell>
          <TableCell id="value">84</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
