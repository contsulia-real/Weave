import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, FormField, Input, MusicVisualization, Text } from '../../../index'

export default function MusicVisualizationMediaPlayerDemo() {
  const { t } = useTranslation('copy')
  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const urlRef = useRef<string | null>(null)
  const [element, setElement] = useState<HTMLAudioElement | null>(null)
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    setElement(audioRef.current)
    return () => {
      if (urlRef.current !== null) URL.revokeObjectURL(urlRef.current)
    }
  }, [])

  return (
    <Column gap={12}>
      <FormField label={t('Choose an audio file')}>
        <Input
          type="file"
          accept="audio/*"
          viewProps={{ ref: fileInputRef, width: 'fill' }}
          onChange={() => {
            const file = fileInputRef.current?.files?.[0]
            if (file === undefined) return
            if (urlRef.current !== null) URL.revokeObjectURL(urlRef.current)
            const next = URL.createObjectURL(file)
            urlRef.current = next
            setUrl(next)
          }}
        />
      </FormField>
      <audio ref={audioRef} controls src={url ?? undefined} style={{ width: '100%' }} />
      <MusicVisualization
        source={element}
        mode="waveform"
        viewProps={{ height: 140, label: t('Live audio visualization') }}
      />
      <Text color="secondary" typo="body-small">
        {t('Playback remains audible while its waveform is analysed.')}
      </Text>
    </Column>
  )
}
