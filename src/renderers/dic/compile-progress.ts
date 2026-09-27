import type { ResolvedProgress } from '../../core/resolved-progress'
import type { ResolvedView } from '../../core/resolved-view'
import type { ResolvedTheme } from '../../theme/theme-types'
import {
  compileDiCView,
  type DiCProgressContent,
  type DiCViewNode,
  type DiCViewPaint,
} from './compile-view'

function progressPaint(
  progress: ResolvedProgress,
  theme: ResolvedTheme,
): DiCViewPaint {
  const base =
    theme.components.Progress?.base
  const sized =
    theme.components.Progress?.sizes?.[
      progress.size
    ]

  if (progress.mode === 'spin') {
    return {
      width: sized?.spinSize,
      height: sized?.spinSize,
      color: progress.color,
    }
  }

  return {
    width: sized?.linearWidth,
    height: sized?.linearHeight,
    color: progress.color,
    radiusTopLeft: base?.linearRadius,
    radiusTopRight: base?.linearRadius,
    radiusBottomRight: base?.linearRadius,
    radiusBottomLeft: base?.linearRadius,
  }
}

export function compileDiCProgress(
  view: ResolvedView,
  progress: ResolvedProgress,
  theme: ResolvedTheme,
): DiCViewNode {
  const content: DiCProgressContent = {
    kind: 'progress',
    progress,
  }
  const node = compileDiCView(
    view,
    {
      content,
    },
  )

  return {
    ...node,
    paint: {
      ...progressPaint(
        progress,
        theme,
      ),
      ...node.paint,
    },
  }
}
