import { IconDots } from '@tabler/icons-react'
import { Button, Column, Popover } from '../../../index'

export default function PopoverContextualActionsDemo() {
  return (
    <Popover
      content={
        <Column gap={8}>
          <Button text="Rename" variant="ghost" />
          <Button text="Archive" variant="ghost" />
        </Column>
      }
      placement="bottom-right"
    >
      <Button icon={IconDots} viewProps={{ label: 'More actions' }} />
    </Popover>
  )
}
