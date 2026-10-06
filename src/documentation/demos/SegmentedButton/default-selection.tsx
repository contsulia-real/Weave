import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react'
import { Icon, SegmentedButton } from '../../../index'

export default function SegmentedButtonDefaultSelectionDemo() {
  return (
    <SegmentedButton
      variant="secondary"
      selection="single"
      defaultSelected="light"
      items={[
        {
          id: 'auto',
          children: <Icon icon={IconDeviceDesktop} size="medium" />,
          viewProps: { label: 'System theme' },
        },
        {
          id: 'light',
          children: <Icon icon={IconSun} size="medium" />,
          viewProps: { label: 'Light theme' },
        },
        {
          id: 'dark',
          children: <Icon icon={IconMoon} size="medium" />,
          viewProps: { label: 'Dark theme' },
        },
      ]}
    />
  )
}
