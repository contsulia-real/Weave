import { DiCCapabilityError } from './capability-error'
import type { ViewProps } from '../../core/view-types'
import {
  VIEW_INTERNAL_PROP_KEYS,
} from '../../core/view-prop-keys'
import {
  breakpointEntries,
  containerBreakpointProp,
} from '../../core/breakpoints'

function present(
  value: unknown,
): boolean {
  return (
    value !== undefined &&
    value !== null &&
    value !== false &&
    value !== ''
  )
}

export function assertDiCViewPropsSupported(
  props: ViewProps<HTMLElement>,
  breakpoints: Readonly<Record<string, number>>,
  owner = 'View',
): void {
  if (props.style !== undefined) {
    throw new DiCCapabilityError(
      `${owner} raw style is not supported by the DiC React renderer yet`,
    )
  }
  if (present(props.className)) {
    throw new DiCCapabilityError(
      `${owner} className is DOM-only and cannot be applied by DiC`,
    )
  }
  if (props.ref !== undefined) {
    throw new DiCCapabilityError(
      `${owner} ref bridge is not implemented for DiC yet`,
    )
  }
  if (props.scrollbar !== undefined) {
    throw new DiCCapabilityError(
      `${owner} DiC scrolling / Scrollbar backend is not implemented yet`,
    )
  }
  if (
    props.overflow !== undefined ||
    props.overflowX !== undefined ||
    props.overflowY !== undefined
  ) {
    throw new DiCCapabilityError(
      `${owner} DiC overflow / scrolling backend is not implemented yet`,
    )
  }
  if (props.hidden !== undefined) {
    throw new DiCCapabilityError(
      `${owner} hidden semantic bridge is not implemented for DiC yet`,
    )
  }
  if (props.draggable !== undefined) {
    throw new DiCCapabilityError(
      `${owner} drag-and-drop backend is not implemented for DiC yet`,
    )
  }
  if (props.selectable !== undefined) {
    throw new DiCCapabilityError(
      `${owner} selectable text backend is not implemented for DiC yet`,
    )
  }

  const dynamic = new Set<string>()
  for (const breakpoint of breakpointEntries(breakpoints)) {
    dynamic.add(breakpoint.name)
    dynamic.add(
      containerBreakpointProp(
        breakpoint.name,
      ),
    )
  }

  for (const key of Object.keys(props)) {
    if (
      key === 'id' ||
      VIEW_INTERNAL_PROP_KEYS.has(key) ||
      dynamic.has(key)
    ) {
      continue
    }

    throw new DiCCapabilityError(
      `${owner} prop "${key}" has no DiC backend yet`,
    )
  }
}
