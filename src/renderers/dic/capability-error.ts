export class DiCCapabilityError extends Error {
  override readonly name =
    'DiCCapabilityError'
}

export function isDiCCapabilityError(
  error: unknown,
): error is DiCCapabilityError {
  return error instanceof DiCCapabilityError
}
