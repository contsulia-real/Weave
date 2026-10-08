import { useState } from 'react'
import { Column, Date, SegmentedButton } from '../../../index'

export default function DateForcedLocaleDemo() {
  const [locale, setLocale] = useState('fr')

  return (
    <Column gap={1} width={23}>
      <SegmentedButton
        selection="single"
        selected={locale}
        onSelect={(next) => {
          if (next !== null) setLocale(next)
        }}
        items={[
          { id: 'en', children: 'English' },
          { id: 'zh-CN', children: '简体中文' },
          { id: 'zh-TW', children: '繁體中文' },
          { id: 'fr', children: 'Français' },
        ]}
      />
      <Date locale={locale} defaultValue="2026-10-09" viewProps={{ label: 'Date' }} />
    </Column>
  )
}
