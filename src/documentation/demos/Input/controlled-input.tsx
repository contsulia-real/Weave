import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Column, Input } from '../../../index'

export default function InputControlledInputDemo() {
  const { t } = useTranslation('copy')
  const [name, setName] = useState('Weave')
  const slug = name.trim().toLowerCase().replace(/\s+/g, '-')

  return (
    <Column gap={12} width={320}>
      <Input
        value={name}
        onChange={setName}
        name="project"
        autoComplete="off"
        maxLength={24}
        viewProps={{ label: t('Project name') }}
      />
      <Input value={slug} readOnly viewProps={{ label: t('Project slug') }} />
      <Button
        text={t('Use sample project')}
        variant="secondary"
        viewProps={{ onClick: () => setName('Weave Studio') }}
      />
    </Column>
  )
}
