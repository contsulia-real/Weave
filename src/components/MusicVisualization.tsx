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
    if (vertical) context.fillRect(position, offset, barWidth, extent)
    else context.fillRect(offset, position, extent, barWidth)
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

    let analysis: ReturnType<typeof connectMusicVisualizationSource> | undefined
    if (source !== null) {
      try {
        analysis = connectMusicVisualizationSource(source)
      } catch {
        // Unsupported or already-bound media sources can instead supply an AnalyserNode.
      }
    }

    const analyser = analysis?.analyser
    const frequency =
      analyser === undefined
        ? undefined
        : new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount))
    const time =
      analyser === undefined ? undefined : new Uint8Array(new ArrayBuffer(analyser.fftSize))
    let frame = 0
    let width = 0
    let height = 0
    let density = view.devicePixelRatio || 1
    const ink = view.getComputedStyle(canvas).color

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

    measure()
    const Observer = view.ResizeObserver
    const observer = Observer === undefined ? null : new Observer(measure)
    observer?.observe(canvas)
    view.addEventListener('resize', measure)

    const paint = () => {
      context.setTransform(density, 0, 0, density, 0, 0)
      context.clearRect(0, 0, width, height)
      context.fillStyle = ink
      context.strokeStyle = ink
      context.lineWidth = 2
      if (analyser !== undefined && width > 0 && height > 0) {
        if (mode === 'bars' && frequency !== undefined) {
          drawBars(context, frequency, analyser, width, height, direction, align, barCount)
        } else if (mode === 'waveform' && time !== undefined && frequency !== undefined) {
          drawWaveform(context, time, frequency, analyser, width, height)
        }
      }
      if (analyser !== undefined) frame = view.requestAnimationFrame(paint)
    }

    frame = view.requestAnimationFrame(paint)
    return () => {
      view.cancelAnimationFrame(frame)
      observer?.disconnect()
      view.removeEventListener('resize', measure)
      analysis?.cleanup()
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
