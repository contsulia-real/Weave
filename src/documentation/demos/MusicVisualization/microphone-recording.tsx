import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Column, MusicVisualization, Row, Text } from '../../../index'

export default function MusicVisualizationMicrophoneDemo() {
  const { t } = useTranslation('copy')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [status, setStatus] = useState('')
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null)
  const recordingRef = useRef<{ recorder: MediaRecorder; stream: MediaStream } | null>(null)
  const urlRef = useRef<string | null>(null)

  useEffect(
    () => () => {
      recordingRef.current?.recorder.stop()
      recordingRef.current?.stream.getTracks().forEach((track) => track.stop())
      if (urlRef.current !== null) URL.revokeObjectURL(urlRef.current)
    },
    [],
  )

  const start = async () => {
    try {
      const microphone = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(microphone)
      const chunks: Blob[] = []
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data)
      }
      recorder.onstop = () => {
        if (urlRef.current !== null) URL.revokeObjectURL(urlRef.current)
        const next = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType }))
        urlRef.current = next
        setRecordedUrl(next)
      }
      recordingRef.current = { recorder, stream: microphone }
      recorder.start()
      setStream(microphone)
      setStatus(t('Recording in progress'))
    } catch {
      setStatus(t('Microphone access is unavailable'))
    }
  }

  const stop = () => {
    const session = recordingRef.current
    if (session === null) return
    recordingRef.current = null
    session.recorder.stop()
    session.stream.getTracks().forEach((track) => track.stop())
    setStream(null)
    setStatus(t('Recording stopped'))
  }

  return (
    <Column gap={12}>
      <Row gap={8}>
        <Button
          text={t('Start recording')}
          disabled={stream !== null}
          viewProps={{ onClick: () => void start() }}
        />
        <Button
          text={t('Stop recording')}
          disabled={stream === null}
          viewProps={{ onClick: stop }}
        />
      </Row>
      <Text typo="body-small">
        {status || t('Microphone permission is requested only when you start recording.')}
      </Text>
      <MusicVisualization
        source={stream}
        viewProps={{ height: 140, label: t('Live audio visualization') }}
      />
      {recordedUrl === null ? null : <audio controls src={recordedUrl} />}
    </Column>
  )
}
