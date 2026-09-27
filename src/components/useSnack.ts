import {
  useContext,
} from 'react'
import type {
  SnackController,
} from '../core/snack-types'
import {
  SnackContext,
} from './internal/snack-context'

export function useSnack(): SnackController {
  const context =
    useContext(SnackContext)

  if (context === null) {
    throw new Error(
      'useSnack() requires a SnackProvider',
    )
  }

  return context
}
