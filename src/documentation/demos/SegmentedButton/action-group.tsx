import { useState } from 'react'
import { Column, SegmentedButton, Text } from '../../../index'

export default function SegmentedButtonActionGroupDemo() {
  const [action, setAction] = useState('No action yet')

  return (
    <Column gap={1} align="start">
      <SegmentedButton
        variant="tertiary"
        size="small"
        items={[
          {
            id: 'copy',
            children: 'Copy',
            viewProps: { onClick: () => setAction('Copied') },
          },
          {
            id: 'share',
            children: 'Share',
            viewProps: { onClick: () => setAction('Shared') },
          },
          {
            id: 'archive',
            children: 'Archive',
            viewProps: { onClick: () => setAction('Archived') },
          },
        ]}
      />
      <Text typo="body-small" color="secondary">
        {action}
      </Text>
    </Column>
  )
}
