import { Button, ToolTip } from '../../../index'

export default function ToolTipBasicUsageDemo() {
  return (
    <ToolTip content="Helpful tooltip" placement="top" delay={0} offset={0.5} defaultOpen>
      <Button text="Tooltip target" />
    </ToolTip>
  )
}
