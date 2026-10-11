/** MediaElementAudioSourceNode can only be constructed once per media element. */
const mediaElements = new WeakMap<
  HTMLMediaElement,
  { context: AudioContext; analyser: AnalyserNode }
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
        node.connect(analyser)
        analyser.connect(context.destination)
        existing = { context, analyser }
        mediaElements.set(source, existing)
      } catch (error) {
        void context.close()
        throw error
      }
    }

    const { context, analyser } = existing
    const resume = () => {
      if (context.state === 'suspended') void context.resume().catch(() => {})
    }
    source.addEventListener('play', resume)
    source.addEventListener('playing', resume)
    if (!source.paused) resume()
    return {
      analyser,
      cleanup: () => {
        source.removeEventListener('play', resume)
        source.removeEventListener('playing', resume)
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
