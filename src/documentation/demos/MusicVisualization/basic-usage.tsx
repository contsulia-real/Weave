import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type {
  MusicVisualizationAlign,
  MusicVisualizationDirection,
  MusicVisualizationMode,
} from '../../../index'
import { Button, Column, MusicVisualization, Row, Text } from '../../../index'

export default function MusicVisualizationBasicUsageDemo() {
  const { t } = useTranslation('copy')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [useAnalyser, setUseAnalyser] = useState(false)
  const [mode, setMode] = useState<MusicVisualizationMode>('bars')
  const [direction, setDirection] = useState<MusicVisualizationDirection>('vertical')
  const [align, setAlign] = useState<MusicVisualizationAlign>('center')
  const audioRef = useRef<{
    context: AudioContext
    oscillator: OscillatorNode
    analyser: AnalyserNode
    stream: MediaStream
  } | null>(null)

  useEffect(
    () => () => {
      const audio = audioRef.current
      if (audio === null) return
      audio.oscillator.stop()
      audio.stream.getTracks().forEach((track) => track.stop())
      void audio.context.close()
    },
    [],
  )

  const toggleAudio = async () => {
    if (audioRef.current !== null) {
      const audio = audioRef.current
      audioRef.current = null
      audio.oscillator.stop()
      audio.stream.getTracks().forEach((track) => track.stop())
      void audio.context.close()
      setStream(null)
      setAnalyser(null)
      return
    }

    const context = new AudioContext()
    const oscillator = context.createOscillator()
    const destination = context.createMediaStreamDestination()
    const node = context.createAnalyser()
    const gain = context.createGain()
    gain.gain.value = 0.08
    oscillator.frequency.value = 440
    oscillator.connect(gain)
    gain.connect(node)
    node.connect(destination)
    oscillator.start()
    audioRef.current = { context, oscillator, analyser: node, stream: destination.stream }
    setAnalyser(node)
    setStream(destination.stream)
    await context.resume()
  }

  return (
    <Column gap={12}>
      <Row gap={8} wrap>
        <Button
          text={stream === null ? t('Start test signal') : t('Stop test signal')}
          viewProps={{ onClick: () => void toggleAudio() }}
        />
        <Button
          text={t('Bars')}
          variant={mode === 'bars' ? 'primary' : 'tertiary'}
          viewProps={{ onClick: () => setMode('bars') }}
        />
        <Button
          text={t('Waveform')}
          variant={mode === 'waveform' ? 'primary' : 'tertiary'}
          viewProps={{ onClick: () => setMode('waveform') }}
        />
      </Row>
      <Row gap={8} wrap>
        <Button
          text={useAnalyser ? t('Use audio stream') : t('Use external analyser')}
          variant="tertiary"
          viewProps={{ onClick: () => setUseAnalyser((current) => !current) }}
        />
        <Button
          text={t('Vertical')}
          variant={direction === 'vertical' ? 'secondary' : 'tertiary'}
          disabled={mode !== 'bars'}
          viewProps={{ onClick: () => setDirection('vertical') }}
        />
        <Button
          text={t('Horizontal')}
          variant={direction === 'horizontal' ? 'secondary' : 'tertiary'}
          disabled={mode !== 'bars'}
          viewProps={{ onClick: () => setDirection('horizontal') }}
        />
        {(['start', 'center', 'end'] as const).map((value) => (
          <Button
            key={value}
            text={t(
              value === 'start'
                ? 'Start alignment'
                : value === 'center'
                  ? 'Center alignment'
                  : 'End alignment',
            )}
            variant={align === value ? 'secondary' : 'tertiary'}
            disabled={mode !== 'bars'}
            viewProps={{ onClick: () => setAlign(value) }}
          />
        ))}
      </Row>
      <MusicVisualization
        source={useAnalyser ? analyser : stream}
        mode={mode}
        direction={direction}
        align={align}
        viewProps={{ height: 160, label: t('Live audio visualization') }}
      />
      <Text color="secondary" typo="body-small">
        {t('The test tone is analysed but is not played through your speakers.')}
      </Text>
    </Column>
  )
}
