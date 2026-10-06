import { IconSearch } from '@tabler/icons-react'
import { Button, ToolTip } from '../../../index'

export default function ToolTipIconButtonTooltipDemo() {
  return (
    <ToolTip content="Search" placement="top" delay={0}>
      <Button icon={IconSearch} viewProps={{ label: 'Search' }} />
    </ToolTip>
  )
}
