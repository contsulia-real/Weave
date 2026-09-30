import type { CSSProperties, ReactNode, Ref, TransitionEventHandler } from 'react'
import type { PopoverPlacement } from '../../core/popover-types'
import type { ViewProps } from '../../core/view-types'
import { View } from '../View'
import { ThemedPortal } from './ThemedPortal'
import type { ExitPresenceState } from './use-exit-presence'

type OptionListboxStyle = CSSProperties & {
  '--weave-option-listbox-anchor-width'?: string
}

interface OptionListboxHostProps {
  component: 'select' | 'combobox'
  present: boolean
  panelRef: Ref<HTMLDivElement>
  viewProps: ViewProps<HTMLDivElement>
  id: string
  labelledBy: string
  visualState: ExitPresenceState
  placement: PopoverPlacement
  positioned: boolean
  placementStyle: CSSProperties
  reducedMotion: boolean
  themeClassNames?: readonly (string | undefined)[]
  anchorWidth?: number
  onTransitionEnd: TransitionEventHandler<HTMLDivElement>
  children?: ReactNode
}

export function OptionListboxHost({
  component,
  present,
  panelRef,
  viewProps,
  id,
  labelledBy,
  visualState,
  placement,
  positioned,
  placementStyle,
  reducedMotion,
  themeClassNames = [],
  anchorWidth,
  onTransitionEnd,
  children,
}: OptionListboxHostProps) {
  if (!present) {
    return null
  }

  const componentClassName = `weave-${component}-listbox`
  const componentDataName = `weave-${component}`
  const style: OptionListboxStyle = {
    ...placementStyle,
    visibility: positioned ? 'visible' : 'hidden',
    ...viewProps.style,
  }

  if (anchorWidth !== undefined) {
    style['--weave-option-listbox-anchor-width'] = String(anchorWidth) + 'px'
  }

  return (
    <ThemedPortal>
      <View
        {...viewProps}
        ref={panelRef}
        id={id}
        role="listbox"
        labelledBy={labelledBy}
        tabIndex={-1}
        aria-hidden={visualState === 'closing' ? true : undefined}
        onTransitionEnd={onTransitionEnd}
        position="fixed"
        layer={viewProps.layer ?? 'overlay'}
        className={[
          'weave-option-listbox',
          componentClassName,
          ...themeClassNames,
          viewProps.className,
        ]
          .filter(Boolean)
          .join(' ')}
        data={{
          ...viewProps.data,
          'weave-option-listbox': '',
          'weave-option-listbox-state': visualState,
          [componentClassName]: '',
          [componentDataName + '-state']: visualState,
          placement,
          'weave-reduced-motion': reducedMotion ? 'reduce' : undefined,
        }}
        style={style}
      >
        {children}
      </View>
    </ThemedPortal>
  )
}
