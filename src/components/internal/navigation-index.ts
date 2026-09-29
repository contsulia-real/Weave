export type NavigationMove = 'previous' | 'next' | 'first' | 'last'

export function resolveNavigationIndex(
  length: number,
  currentIndex: number,
  move: NavigationMove,
): number | null {
  if (length <= 0) {
    return null
  }

  if (move === 'first') {
    return 0
  }

  if (move === 'last') {
    return length - 1
  }

  if (currentIndex < 0) {
    return move === 'next' ? 0 : length - 1
  }

  const delta = move === 'next' ? 1 : -1
  return (currentIndex + delta + length) % length
}
