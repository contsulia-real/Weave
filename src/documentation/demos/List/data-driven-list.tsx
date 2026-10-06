import { IconFolder } from '@tabler/icons-react'
import { Button, List } from '../../../index'

export default function ListDataDrivenListDemo() {
  return (
    <List
      selection="multiple"
      defaultSelected={['alpha']}
      items={[
        {
          id: 'alpha',
          text: 'Alpha',
          icon: IconFolder,
          secondaryText: 'Ready',
          trailing: <Button text="Open" variant="ghost" />,
        },
        {
          id: 'beta',
          text: 'Beta',
          icon: IconFolder,
          secondaryText: 'Queued',
        },
        { id: 'gamma', text: 'Gamma', disabled: true },
      ]}
    />
  )
}
