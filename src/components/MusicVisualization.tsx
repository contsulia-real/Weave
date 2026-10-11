import { useEffect, useRef } from 'react'
import type {
  MusicVisualizationAlign,
  MusicVisualizationDirection,
  MusicVisualizationProps,
} from '../core/music-visualization-types'
import { useTheme } from '../theme/theme-context'
import { connectMusicVisualizationSource } from './internal/music-visualization-source'
import { View } from './View'

function drawBars(
  context: CanvasRenderingContext2D,
  frequency: Uint8Array<ArrayBuffer>,
  analyser: AnalyserNode,
  width: number,
  height: number,
  direction: MusicVisualizationDirection,
  align: MusicVisualizationAlign,
  barCount: number | undefined,
): void {
  const vertical = direction === 'vertical'
  const length = vertical ? width : height
  const amplitude = vertical ? height : width
  const count =
    barCount === undefined || !Number.isFinite(barCount)
      ? Math.min(64, Math.max(1, Math.floor(length / 6)))
      : Math.max(1, Math.floor(barCount))
  const slot = length / count
  const barWidth = slot * 0.7

  analyser.getByteFrequencyData(frequency)
  for (let index = 0; index < count; index += 1) {
    const from = Math.min(frequency.length - 1, Math.floor(frequency.length ** (index / count)))
    const to = Math.min(
      frequency.length,
      Math.max(from + 1, Math.ceil(frequency.length ** ((index + 1) / count))),
    )
    let peak = 0
    for (let bin = from; bin < to; bin += 1) peak = Math.max(peak, frequency[bin] ?? 0)
    const extent = (peak / 255) * amplitude
    const position = index * slot + (slot - barWidth) / 2
    const offset =
      align === 'center' ? (amplitude - extent) / 2 : align === 'end' ? amplitude - extent : 0
    if (extent <= 0) continue
    const radius = Math.min(barWidth, extent) / 2
    context.beginPath()
    if (vertical) context.roundRect(position, offset, barWidth, extent, radius)
    else context.roundRect(offset, position, extent, barWidth, radius)
    context.fill()
  }
}

function drawWaveform(
  context: CanvasRenderingContext2D,
  time: Uint8Array<ArrayBuffer>,
  frequency: Uint8Array<ArrayBuffer>,
  analyser: AnalyserNode,
  width: number,
  height: number,
): void {
  analyser.getByteTimeDomainData(time)
  analyser.getByteFrequencyData(frequency)

  // The entire fftSize window often contains dozens of audio cycles.
  // Draw one ACTUALLY sampled dominant cycle rather than squeezing those
  // cycles into the same narrow waveform or synthesizing repeated periods.
  let dominantBin = 0
  let dominantLevel = 8
  for (let bin = 1; bin < frequency.length; bin += 1) {
    if (frequency[bin] > dominantLevel) {
      dominantBin = bin
      dominantLevel = frequency[bin]
    }
  }

  const windowSize =
    dominantBin === 0
      ? Math.min(128, time.length - 1)
      : Math.min(time.length - 1, Math.max(4, Math.round(analyser.fftSize / dominantBin)))
  if (windowSize < 1) return

  // Start on a rising zero crossing so a steady tone remains visually stable.
  const lastStart = time.length - windowSize - 1
  let start = 0
  for (let index = 1; index <= lastStart; index += 1) {
    if (time[index - 1] < 128 && time[index] >= 128) {
      start = index
      break
    }
  }

  context.beginPath()
  for (let index = 0; index <= windowSize; index += 1) {
    const x = (index / windowSize) * width
    const y = (1 - (time[start + index] ?? 128) / 255) * height
    if (index === 0) context.moveTo(x, y)
    else context.lineTo(x, y)
  }
  context.stroke()
}

export function MusicVisualization({
  source,
  mode = 'bars',
  direction = 'vertical',
  align = 'center',
  barCount,
  viewProps = {},
}: MusicVisualizationProps): import('react').JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { mode: themeMode } = useTheme()

  const analysisRef = useRef<ReturnType<typeof connectMusicVisualizationSource> | undefined>(
    undefined,
  )

  // Own the audio graph only while the source identity changes, not on visual updates.
  useEffect(() => {
    let analysis: ReturnType<typeof connectMusicVisualizationSource> | undefined
    if (source !== null) {
      try {
        analysis = connectMusicVisualizationSource(source)
      } catch {
        // A media element already connected elsewhere must provide its AnalyserNode.
      }
    }
    analysisRef.current = analysis
    return () => {
      analysisRef.current = undefined
      analysis?.cleanup()
    }
  }, [source])

  useEffect(() => {
    const canvas = canvasRef.current
    const view = canvas?.ownerDocument.defaultView
    const context = canvas?.getContext('2d')
    if (
      canvas === null ||
      canvas === undefined ||
      view === null ||
      view === undefined ||
      context === null ||
      context === undefined
    )
      return

    const analyser = analysisRef.current?.analyser
    const frequency =
      analyser === undefined
        ? undefined
        : new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount))
    const time =
      analyser === undefined ? undefined : new Uint8Array(new ArrayBuffer(analyser.fftSize))
    let frame: number | undefined
    let width = 0
    let height = 0
    let density = view.devicePixelRatio || 1
    const ink = view.getComputedStyle(canvas).color

    const clear = () => {
      context.setTransform(density, 0, 0, density, 0, 0)
      context.clearRect(0, 0, width, height)
    }

    const measure = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(0, rect.width)
      height = Math.max(0, rect.height)
      density = view.devicePixelRatio || 1
      const pixelWidth = Math.round(width * density)
      const pixelHeight = Math.round(height * density)
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight
    }

    const active = () => {
      if (
        width <= 0 ||
        height <= 0 ||
        view.document.hidden ||
        analyser === undefined ||
        analyser.context.state !== 'running'
      ) {
        return false
      }
      if (source instanceof HTMLMediaElement) return !source.paused && !source.ended
      if (source instanceof MediaStream) {
        return source.getAudioTracks().some((track) => track.readyState === 'live' && !track.muted)
      }
      return true
    }

    const paint = () => {
      frame = undefined
      if (!active()) {
        clear()
        return
      }
      clear()
      context.fillStyle = ink
      context.strokeStyle = ink
      context.lineWidth = 2
      if (width > 0 && height > 0 && analyser !== undefined) {
        if (mode === 'bars' && frequency !== undefined) {
          drawBars(context, frequency, analyser, width, height, direction, align, barCount)
        } else if (mode === 'waveform' && time !== undefined && frequency !== undefined) {
          drawWaveform(context, time, frequency, analyser, width, height)
        }
      }
      frame = view.requestAnimationFrame(paint)
    }

    const sync = () => {
      if (active()) {
        if (frame === undefined) frame = view.requestAnimationFrame(paint)
      } else {
        if (frame !== undefined) view.cancelAnimationFrame(frame)
        frame = undefined
        clear()
      }
    }

    const onResize = () => {
      measure()
      sync()
    }

    measure()
    const Observer = view.ResizeObserver
    const observer = Observer === undefined ? null : new Observer(onResize)
    observer?.observe(canvas)
    view.addEventListener('resize', onResize)
    view.document.addEventListener('visibilitychange', sync)
    analyser?.context.addEventListener('statechange', sync)

    if (source instanceof HTMLMediaElement) {
      for (const event of ['play', 'playing', 'pause', 'ended', 'emptied']) {
        source.addEventListener(event, sync)
      }
    }

    const tracked = new Set<MediaStreamTrack>()
    const syncTracks = () => {
      if (!(source instanceof MediaStream)) return
      const current = new Set(source.getAudioTracks())
      for (const track of tracked) {
        if (current.has(track)) continue
        for (const event of ['ended', 'mute', 'unmute']) track.removeEventListener(event, sync)
        tracked.delete(track)
      }
      for (const track of current) {
        if (tracked.has(track)) continue
        for (const event of ['ended', 'mute', 'unmute']) track.addEventListener(event, sync)
        tracked.add(track)
      }
      sync()
    }

    if (source instanceof MediaStream) {
      syncTracks()
      source.addEventListener('addtrack', syncTracks)
      source.addEventListener('removetrack', syncTracks)
    }

    sync()
    return () => {
      if (frame !== undefined) view.cancelAnimationFrame(frame)
      observer?.disconnect()
      view.removeEventListener('resize', onResize)
      view.document.removeEventListener('visibilitychange', sync)
      analyser?.context.removeEventListener('statechange', sync)
      if (source instanceof HTMLMediaElement) {
        for (const event of ['play', 'playing', 'pause', 'ended', 'emptied']) {
          source.removeEventListener(event, sync)
        }
      }
      if (source instanceof MediaStream) {
        for (const track of tracked) {
          for (const event of ['ended', 'mute', 'unmute']) track.removeEventListener(event, sync)
        }
        source.removeEventListener('addtrack', syncTracks)
        source.removeEventListener('removetrack', syncTracks)
      }
    }
  }, [source, mode, direction, align, barCount, themeMode, viewProps.color])

  return (
    <View
      {...viewProps}
      role="img"
      label={viewProps.label ?? 'Audio visualization'}
      color={viewProps.color ?? 'primary'}
      width={viewProps.width ?? 'fill'}
      data={{
        ...viewProps.data,
        'weave-music-visualization': '',
        'weave-music-visualization-mode': mode,
        'weave-music-visualization-direction': mode === 'bars' ? direction : undefined,
        'weave-music-visualization-align': mode === 'bars' ? align : undefined,
        'weave-music-visualization-bar-count': mode === 'bars' ? barCount : undefined,
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        width={300}
        height={150}
        style={{
          display: 'block',
          width: '100%',
          height: viewProps.height === undefined ? 'auto' : '100%',
        }}
      />
    </View>
  )
}
