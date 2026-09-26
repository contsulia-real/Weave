import type {
  DiCImageContent,
  DiCIntrinsicConstraints,
  DiCIntrinsicEnvironment,
  DiCIntrinsicSize,
} from './compile-view'

function ratioSize(
  width: number,
  height: number,
  constraints: DiCIntrinsicConstraints,
): DiCIntrinsicSize {
  if (width <= 0 || height <= 0) {
    return {
      width: 0,
      height: 0,
    }
  }

  const aspect = width / height
  const resolvedWidth = constraints.resolvedWidth
  const resolvedHeight = constraints.resolvedHeight

  if (
    resolvedWidth !== undefined &&
    resolvedHeight !== undefined
  ) {
    return {
      width: resolvedWidth,
      height: resolvedHeight,
    }
  }

  if (resolvedWidth !== undefined) {
    return {
      width: resolvedWidth,
      height: resolvedWidth / aspect,
    }
  }

  if (resolvedHeight !== undefined) {
    return {
      width: resolvedHeight * aspect,
      height: resolvedHeight,
    }
  }

  const widthFit = constraints.widthMode === 'fit'
  const heightFit = constraints.heightMode === 'fit'

  if (widthFit && heightFit) {
    const scale = Math.min(
      1,
      constraints.maxWidth / width,
      constraints.maxHeight / height,
    )

    return {
      width: width * scale,
      height: height * scale,
    }
  }

  if (widthFit && width > constraints.maxWidth) {
    const fittedWidth = constraints.maxWidth
    return {
      width: fittedWidth,
      height: fittedWidth / aspect,
    }
  }

  if (heightFit && height > constraints.maxHeight) {
    const fittedHeight = constraints.maxHeight
    return {
      width: fittedHeight * aspect,
      height: fittedHeight,
    }
  }

  return {
    width,
    height,
  }
}

export function measureDiCImage(
  content: DiCImageContent,
  constraints: DiCIntrinsicConstraints,
  environment: DiCIntrinsicEnvironment,
): DiCIntrinsicSize {
  const resources = environment.imageResources
  if (resources === undefined) {
    throw new Error(
      'DiC image measurement requires image resources',
    )
  }

  const resource = resources.get(content.image.src)
  if (resource.status !== 'ready') {
    return {
      width: 0,
      height: 0,
    }
  }

  return ratioSize(
    resource.width,
    resource.height,
    constraints,
  )
}
