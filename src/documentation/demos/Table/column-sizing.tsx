import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../index'

export default function TableColumnSizingDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead width={224}>Project</TableHead>
          <TableHead minWidth={160} maxWidth={256} align="end">
            Owner
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow id="atlas">
          <TableCell id="project" width={224}>
            Atlas
          </TableCell>
          <TableCell id="owner" minWidth={160} maxWidth={256} align="end">
            Mina
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
