import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react'
import { useCallback, useRef, useState } from 'react'
import type { MusicPlayerProps } from '../core/music-player-types'
import { Button } from './Button'
import { Column } from './Column'
import { MusicVisualization } from './MusicVisualization'
import { Row } from './Row'
import { Slider } from './Slider'
import { Text } from './Text'

function timeLabel(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const whole = Math.floor(seconds)
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}

export function MusicPlayer({ src }: MusicPlayerProps): import('react').JSX.Element {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const captureAudio = useCallback((element: HTMLAudioElement | null) => {
    audioRef.current = element
    setAudio(element)
  }, [])
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)

  const playable = Number.isFinite(duration) && duration > 0
  const togglePlayback = () => {
    const media = audioRef.current
    if (media === null) return
    if (media.paused) {
      void media.play().catch(() => {
        setPlaying(false)
      })
    } else {
      media.pause()
    }
  }

  return (
    <Column gap={12} width="fill" data={{ 'weave-music-player': '' }}>
      <audio
        ref={captureAudio}
        src={src}
        preload="metadata"
        hidden
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(event) => setPosition(event.currentTarget.currentTime)}
        onSeeked={(event) => setPosition(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => {
          const media = event.currentTarget
          setDuration(Number.isFinite(media.duration) ? media.duration : 0)
          setPosition(media.currentTime)
        }}
        onDurationChange={(event) => {
          const next = event.currentTarget.duration
          setDuration(Number.isFinite(next) ? next : 0)
        }}
        onEmptied={() => {
          setPlaying(false)
          setPosition(0)
          setDuration(0)
        }}
        onVolumeChange={(event) => setVolume(Math.round(event.currentTarget.volume * 100))}
      />
      <MusicVisualization source={audio} />
      <Row gap={8} align="center">
        <Button
          icon={playing ? IconPlayerPause : IconPlayerPlay}
          variant="tertiary"
          disabled={!src}
          viewProps={{
            label: playing ? 'Pause' : 'Play',
            onClick: togglePlayback,
          }}
        />
        <Text typo="body-small" color="secondary">
          {timeLabel(position)}
        </Text>
        <Slider
          label="Playback position"
          min={0}
          max={playable ? duration : 1}
          value={playable ? Math.min(position, duration) : 0}
          disabled={!playable}
          onChange={(next) => {
            const media = audioRef.current
            if (media === null) return
            media.currentTime = next
            setPosition(next)
          }}
          viewProps={{ grow: 1, minWidth: 0 }}
        />
        <Text typo="body-small" color="secondary">
          {timeLabel(duration)}
        </Text>
      </Row>
      <Row gap={8} align="center">
        <Text typo="label-small">Volume</Text>
        <Slider
          label="Volume"
          min={0}
          max={100}
          value={volume}
          onChange={(next) => {
            const media = audioRef.current
            if (media === null) return
            media.volume = next / 100
            setVolume(next)
          }}
          viewProps={{ grow: 1, minWidth: 0 }}
        />
      </Row>
    </Column>
  )
}
