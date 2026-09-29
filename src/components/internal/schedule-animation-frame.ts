export function scheduleAnimationFrame(callback: FrameRequestCallback): () => void {
  if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
    const id = window.requestAnimationFrame(callback)
    return () => window.cancelAnimationFrame(id)
  }

  const id = globalThis.setTimeout(() => callback(Date.now()), 16)
  return () => globalThis.clearTimeout(id)
}
