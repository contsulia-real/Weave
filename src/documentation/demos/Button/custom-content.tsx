import { IconStar } from '@tabler/icons-react'
import { Button, Column, Icon, Row, Text } from '../../../index'

export default function ButtonCustomContentDemo() {
  return (
    <Button>
      <Row gap={0.5} align="center">
        <Icon icon={IconStar} size="small" />
        <Column gap={0}>
          <Text weight="semibold">Save favorite</Text>
          <Text typo="body-xsmall">Available offline</Text>
        </Column>
      </Row>
    </Button>
  )
}
