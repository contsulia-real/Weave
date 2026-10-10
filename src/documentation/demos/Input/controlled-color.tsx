import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Column, Input, View } from '../../../index'

export default function ControlledColorDemo() {
  const { t } = useTranslation('copy')
  const [color, setColor] = useState('#3b82f6')

  return (
    <Column width={352} gap={12} align="start">
      <Input
        type="color"
        value={color}
        onChange={setColor}
        viewProps={{ label: t('Selected color') }}
      />
      <View
        width="fill"
        height={80}
        radius="medium"
        background={color}
        role="img"
        label={t('Selected color preview')}
      />
      <Button
        text={t('Use preset color')}
        variant="secondary"
        viewProps={{ onClick: () => setColor('#e76b94') }}
      />
    </Column>
  )
}
