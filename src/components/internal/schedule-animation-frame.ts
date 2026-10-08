export function scheduleAnimationFrame(
  callback: FrameRequestCallback,
  view: Window | null = typeof window === 'undefined' ? null : window,
): () => void {
  if (view !== null && typeof view.requestAnimationFrame === 'function') {
    const id = view.requestAnimationFrame(callback)
    return () => view.cancelAnimationFrame(id)
  }

  const id = globalThis.setTimeout(() => callback(Date.now()), 16)
  return () => globalThis.clearTimeout(id)
}
