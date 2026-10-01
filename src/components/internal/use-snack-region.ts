import { useLayoutEffect, useState, useSyncExternalStore } from 'react'
import type { SnackContainer, SnackPlacement } from '../../core/snack-types'
import { resolveSnackHost } from './snack-host-context'
import { retainSnackRegion, syncSnackRegion } from './snack-region'
import { subscribeTopLayerHost, topLayerHostRevision } from './top-layer-host'
import type { ExitPresenceState } from './use-exit-presence'

export function useSnackRegion(
  present: boolean,
  target: SnackContainer | undefined,
  scopeId: string,
  placement: SnackPlacement,
  visualState: ExitPresenceState,
) {
  const [region, setRegion] = useState<HTMLDivElement | null>(null)
  const topLayerRevision = useSyncExternalStore(
    subscribeTopLayerHost,
    topLayerHostRevision,
    () => 0,
  )

  // The shared portal region is external DOM state. React
  // needs one synchronization render after retaining it.
  /* oxlint-disable react/set-state-in-effect */
  useLayoutEffect(() => {
    if (!present || typeof document === 'undefined') {
      setRegion(null)
      return
    }

    const host = resolveSnackHost(target, document)

    if (host === null) {
      setRegion(null)
      return
    }

    const handle = retainSnackRegion(host, scopeId, placement)

    setRegion(handle.element)

    return () => {
      handle.release()
    }
  }, [placement, present, scopeId, target, topLayerRevision])
  /* oxlint-enable react/set-state-in-effect */

  useLayoutEffect(() => {
    if (region === null) return
    syncSnackRegion(region)
  }, [region, visualState])

  return region
}
