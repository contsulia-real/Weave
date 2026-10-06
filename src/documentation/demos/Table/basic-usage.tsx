import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../index'

export default function TableBasicUsageDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead align="end">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow id="alpha">
          <TableCell id="name">Alpha</TableCell>
          <TableCell id="value" align="end">
            42
          </TableCell>
        </TableRow>
        <TableRow id="beta">
          <TableCell id="name">Beta</TableCell>
          <TableCell id="value" align="end">
            84
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
