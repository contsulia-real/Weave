import { Column, Grid, Text } from '../../../index'

export default function LayoutGridDemo() {
  return (
    <Grid columns={3} rows={2} gap={16} width="fill">
      <Column
        column={1}
        columnSpan={2}
        row={1}
        background="surfaceHover"
        padding={24}
        radius="medium"
      >
        <Text>A · spans two columns</Text>
      </Column>
      <Column column={3} row={1} rowSpan={2} background="surfaceHover" padding={24} radius="medium">
        <Text>B · spans two rows</Text>
      </Column>
      <Column column={1} row={2} background="surfaceHover" padding={24} radius="medium">
        <Text>C</Text>
      </Column>
      <Column column={2} row={2} background="surfaceHover" padding={24} radius="medium">
        <Text>D</Text>
      </Column>
    </Grid>
  )
}
