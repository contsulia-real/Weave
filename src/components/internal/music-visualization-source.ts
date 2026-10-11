/** MediaElementAudioSourceNode can only be constructed once per media element. */
const mediaElements = new WeakMap<
  HTMLMediaElement,
  {
    context: AudioContext
    analyser: AnalyserNode
    node: MediaElementAudioSourceNode
    listeners: number
    resume: () => void
  }
>()

interface AudioAnalysis {
  analyser: AnalyserNode
  cleanup: () => void
}

export function connectMusicVisualizationSource(
  source: HTMLMediaElement | MediaStream | AnalyserNode,
): AudioAnalysis {
  if (source instanceof AnalyserNode) {
    return { analyser: source, cleanup: () => {} }
  }

  if (source instanceof HTMLMediaElement) {
    let existing = mediaElements.get(source)
    if (existing === undefined) {
      const Context = source.ownerDocument.defaultView?.AudioContext
      if (Context === undefined) throw new Error('Web Audio API is not available')
      const context = new Context()
      try {
        const node = context.createMediaElementSource(source)
        const analyser = context.createAnalyser()
        // Keep the media element audible even when no visualization is mounted.
        node.connect(context.destination)
        analyser.connect(context.destination)
        const resume = () => {
          if (context.state === 'suspended') void context.resume().catch(() => {})
        }
        // The source node keeps routing this element even after the last
        // visualization unmounts, so later playback must still resume it.
        source.addEventListener('play', resume)
        source.addEventListener('playing', resume)
        existing = { context, analyser, node, listeners: 0, resume }
        mediaElements.set(source, existing)
      } catch (error) {
        void context.close()
        throw error
      }
    }

    const { context, analyser, node } = existing
    if (existing.listeners === 0) {
      // A media element can only have one source node for its lifetime.
      // Reuse it, switching off FFT processing between visualization mounts.
      node.connect(analyser)
      node.disconnect(context.destination)
    }
    existing.listeners += 1
    if (!source.paused) existing.resume()
    return {
      analyser,
      cleanup: () => {
        if (--existing.listeners === 0) {
          node.connect(context.destination)
          node.disconnect(analyser)
          // Do not close context: doing so would permanently silence this
          // HTMLMediaElement because its source node cannot be recreated.
        }
      },
    }
  }

  const Context = window.AudioContext
  if (Context === undefined) throw new Error('Web Audio API is not available')
  const context = new Context()
  const node = context.createMediaStreamSource(source)
  const analyser = context.createAnalyser()
  node.connect(analyser)
  // Intentionally do NOT connect microphone input to context.destination.
  return {
    analyser,
    cleanup: () => {
      node.disconnect()
      void context.close()
      // The MediaStream and its tracks are owned by the caller.
    },
  }
}
