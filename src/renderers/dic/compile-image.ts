import type { ResolvedImage } from '../../core/resolved-image'
import type { ResolvedView } from '../../core/resolved-view'
import {
  compileDiCView,
  type DiCImageContent,
  type DiCViewNode,
} from './compile-view'
import { measureDiCImage } from './image-layout'

export function compileDiCImage(
  view: ResolvedView,
  image: ResolvedImage,
): DiCViewNode {
  const content: DiCImageContent = {
    kind: 'image',
    image,
  }

  return compileDiCView(
    view,
    {
      content,
      measure: (constraints, environment) =>
        measureDiCImage(
          content,
          constraints,
          environment,
        ),
    },
  )
}
