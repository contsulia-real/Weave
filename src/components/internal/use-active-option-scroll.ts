import { type RefObject, useEffect } from 'react'
import { optionDomId } from './option-navigation'

export function useActiveOptionScrollIntoView<TElement extends HTMLElement>(
  anchorRef: RefObject<TElement | null>,
  listboxId: string,
  activeValue: string | null,
  open: boolean,
): void {
  useEffect(() => {
    if (!open || activeValue === null) {
      return
    }

    const option = anchorRef.current?.ownerDocument.getElementById(
      optionDomId(listboxId, activeValue),
    )

    option?.scrollIntoView?.({
      block: 'nearest',
    })
  }, [activeValue, anchorRef, listboxId, open])
}
