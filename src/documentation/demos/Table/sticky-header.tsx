import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../index'

const rows = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta']

export default function TableStickyHeaderDemo() {
  return (
    <Table stickyHeader viewProps={{ maxHeight: 12, overflowY: 'auto' }}>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead align="end">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((name, index) => (
          <TableRow key={name} id={name.toLowerCase()}>
            <TableCell id="name">{name}</TableCell>
            <TableCell id="value" align="end">
              {(index + 1) * 10}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
