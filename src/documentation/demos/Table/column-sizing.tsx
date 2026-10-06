import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../index'

export default function TableColumnSizingDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead width={14}>Project</TableHead>
          <TableHead minWidth={10} maxWidth={16} align="end">
            Owner
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow id="atlas">
          <TableCell id="project" width={14}>
            Atlas
          </TableCell>
          <TableCell id="owner" minWidth={10} maxWidth={16} align="end">
            Mina
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
