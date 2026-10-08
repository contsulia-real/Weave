import { type ReactNode, useContext } from 'react'
import { createPortal } from 'react-dom'
import { WeaveDocumentProvider } from '../../renderers/dom/DocumentProvider'
import { useWeaveDocument } from '../../renderers/dom/document-context'
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
  const ownerDocument = useWeaveDocument()
  const modalPortalHost = useContext(ModalPortalHostContext)

  const resolvedTarget =
    target ??
    (preferTopLayerHost && modalPortalHost?.ownerDocument === ownerDocument
      ? modalPortalHost
      : null) ??
    ownerDocument?.body ??
    null

  if (resolvedTarget === null) {
    return null
  }

  return createPortal(
    <WeaveDocumentProvider ownerDocument={resolvedTarget.ownerDocument}>
      <ThemeProvider theme={theme} mode={mode}>
        {children}
      </ThemeProvider>
    </WeaveDocumentProvider>,
    resolvedTarget,
  )
}
