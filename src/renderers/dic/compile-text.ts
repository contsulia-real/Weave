import type { ResolvedText } from '../../core/resolved-text'
import type { ResolvedView } from '../../core/resolved-view'
import {
  compileDiCView,
  type DiCTextContent,
  type DiCViewNode,
} from './compile-view'
import { measureDiCText } from './text-layout'

export function compileDiCText(
  view: ResolvedView,
  text: ResolvedText,
  value: string | number | bigint,
): DiCViewNode {
  const content: DiCTextContent = {
    kind: 'text',
    text: String(value),
    style: text,
  }

  return compileDiCView(
    view,
    {
      content,
      measure: (constraints, environment) =>
        measureDiCText(
          content,
          constraints,
          environment,
        ),
    },
  )
}
