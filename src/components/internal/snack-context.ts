import { createContext } from 'react'
import type { SnackController } from '../../core/snack-types'

export const SnackContext = createContext<SnackController | null>(null)
