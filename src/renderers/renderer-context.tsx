import {
  createContext,
  useContext,
  type ReactNode,
} from 'react'

export type WeaveRenderer = 'dom' | 'dic'

const RendererContext =
  createContext<WeaveRenderer>('dom')

export function useWeaveRenderer(): WeaveRenderer {
  return useContext(RendererContext)
}

export function DiCRendererScope({
  children,
}: {
  children?: ReactNode
}) {
  return (
    <RendererContext.Provider value="dic">
      {children}
    </RendererContext.Provider>
  )
}
