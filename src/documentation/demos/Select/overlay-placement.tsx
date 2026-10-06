import { Column, Select, SelectOption, Text } from '../../../index'

export default function SelectOverlayPlacementDemo() {
  return (
    <Column gap={0.75} padding={3} align="center">
      <Text typo="body-small" color="secondary">
        Open the select to see a right-placed listbox overlapping its trigger edge.
      </Text>
      <Select
        placement="right"
        offset={0.5}
        overlapTrigger
        viewportPadding={1}
        placeholder="Placement"
      >
        <SelectOption value="one" text="One" />
        <SelectOption value="two" text="Two" />
        <SelectOption value="three" text="Three" />
      </Select>
    </Column>
  )
}
