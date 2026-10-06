import { SegmentedButton } from '../../../index'

export default function SegmentedButtonMultipleSelectionDemo() {
  return (
    <SegmentedButton
      variant="secondary"
      selection="multiple"
      defaultSelected={['bold', 'underline']}
      items={[
        { id: 'bold', children: 'Bold' },
        { id: 'italic', children: 'Italic' },
        { id: 'underline', children: 'Underline' },
      ]}
    />
  )
}
