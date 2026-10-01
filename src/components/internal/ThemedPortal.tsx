import { type ReactNode, useContext } from 'react'
import { createPortal } from 'react-dom'
import { ThemeProvider } from '../../theme/ThemeProvider'
import { useTheme } from '../../theme/theme-context'
import { ModalPortalHostContext } from './top-layer-host'

interface ThemedPortalProps {
  children?: ReactNode
  target?: Element | DocumentFragment
  preferTopLayerHost?: boolean
}

export function ThemedPortal({ children, target, preferTopLayerHost = true }: ThemedPortalProps) {
  const { theme, mode } = useTheme()
  const modalPortalHost = useContext(ModalPortalHostContext)

  const resolvedTarget =
    target ??
    (preferTopLayerHost ? modalPortalHost : null) ??
    (typeof document !== 'undefined' ? document.body : null)

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
