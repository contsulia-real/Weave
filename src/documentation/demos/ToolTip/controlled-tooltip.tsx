import { useState } from 'react'
import { Button, ToolTip } from '../../../index'

export default function ToolTipControlledTooltipDemo() {
  const [open, setOpen] = useState(false)

  return (
    <ToolTip content="Controlled visibility" open={open} onOpenChange={setOpen} delay={0}>
      <Button text={open ? 'Tooltip open' : 'Hover or focus me'} />
    </ToolTip>
  )
}
