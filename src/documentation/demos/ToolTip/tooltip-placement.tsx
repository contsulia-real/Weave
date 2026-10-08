import { IconStar } from '@tabler/icons-react'
import { Button, ToolTip } from '../../../index'

export default function ToolTipTooltipPlacementDemo() {
  return (
    <ToolTip content="Saved items" placement="right" offset={16} delay={0} defaultOpen>
      <Button icon={IconStar} viewProps={{ label: 'Saved items' }} />
    </ToolTip>
  )
}
