import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../index'

export default function TableDenseTableDemo() {
  return (
    <Table dense verticalBorders>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead align="end">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow id="one">
          <TableCell id="name">Atlas</TableCell>
          <TableCell id="score" align="end">
            92
          </TableCell>
        </TableRow>
        <TableRow id="two">
          <TableCell id="name">Borealis</TableCell>
          <TableCell id="score" align="end">
            84
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
