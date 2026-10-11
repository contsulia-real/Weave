import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, FormField, Input, MusicPlayer, Text } from '../../../index'

export default function MusicPlayerBasicUsageDemo() {
  const { t } = useTranslation('copy')
  const fileRef = useRef<HTMLInputElement>(null)
  const urlRef = useRef<string | null>(null)
  const [source, setSource] = useState('')

  useEffect(
    () => () => {
      if (urlRef.current !== null) URL.revokeObjectURL(urlRef.current)
    },
    [],
  )

  return (
    <Column gap={12}>
      <FormField label={t('Choose an audio file')}>
        <Input
          type="file"
          accept="audio/*"
          viewProps={{ ref: fileRef, width: 'fill' }}
          onChange={() => {
            const file = fileRef.current?.files?.[0]
            if (file === undefined) return
            const next = URL.createObjectURL(file)
            const previous = urlRef.current
            urlRef.current = next
            setSource(next)
            if (previous !== null) URL.revokeObjectURL(previous)
          }}
        />
      </FormField>
      <MusicPlayer src={source} />
      <Text typo="body-small" color="secondary">
        {t(
          'MusicPlayer owns playback and uses Weave controls for progress, volume, and visualization.',
        )}
      </Text>
    </Column>
  )
}
