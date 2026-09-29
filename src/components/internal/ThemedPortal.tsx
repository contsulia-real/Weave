import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ThemeProvider } from '../../theme/ThemeProvider'
import { useTheme } from '../../theme/theme-context'

interface ThemedPortalProps {
  children?: ReactNode
  target?: Element | DocumentFragment
}

export function ThemedPortal({ children, target }: ThemedPortalProps) {
  const { theme, mode } = useTheme()

  const resolvedTarget = target ?? (typeof document !== 'undefined' ? document.body : null)

  if (resolvedTarget === null) {
    return null
  }

  return createPortal(
    <ThemeProvider theme={theme} mode={mode}>
      {children}
    </ThemeProvider>,
    resolvedTarget,
  )
}
