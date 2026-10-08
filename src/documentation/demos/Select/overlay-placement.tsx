import { Column, Select, SelectOption, Text } from '../../../index'

export default function SelectOverlayPlacementDemo() {
  return (
    <Column gap={12} padding={48} align="center">
      <Text typo="body-small" color="secondary">
        Open the select to see a right-placed listbox overlapping its trigger edge.
      </Text>
      <Select
        placement="right"
        offset={8}
        overlapTrigger
        viewportPadding={16}
        placeholder="Placement"
      >
        <SelectOption value="one" text="One" />
        <SelectOption value="two" text="Two" />
        <SelectOption value="three" text="Three" />
      </Select>
    </Column>
  )
}
