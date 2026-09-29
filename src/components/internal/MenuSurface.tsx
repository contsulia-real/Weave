import {
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  type TransitionEvent,
} from 'react'
import type { MenuViewProps } from '../../core/menu-types'
import { View } from '../View'
import { MenuLevelProvider } from './menu-context'
import type { ExitPresenceState } from './use-exit-presence'

export function MenuSurface({
  children,
  panelRef,
  viewProps = {},
  rootId,
  levelId,
  parentItemRef,
  closeLevel,
  active,
  placement,
  positioned,
  placementStyle,
  visualState,
  themeClassName,
  reducedMotion,
  id,
  onKeyDown,
  onTransitionEnd,
}: {
  children?: ReactNode
  panelRef: RefObject<HTMLDivElement | null>
  viewProps?: MenuViewProps
  rootId: string
  levelId: string
  parentItemRef?: RefObject<HTMLDivElement | null>
  closeLevel(): void
  active: boolean
  placement: string
  positioned: boolean
  placementStyle: CSSProperties
  visualState: ExitPresenceState
  themeClassName?: string
  reducedMotion: boolean
  id?: string
  onKeyDown?(event: KeyboardEvent<HTMLDivElement>): void
  onTransitionEnd?(event: TransitionEvent<HTMLDivElement>): void
}) {
  return (
    <MenuLevelProvider
      levelId={levelId}
      panelRef={panelRef}
      parentItemRef={parentItemRef}
      closeLevel={closeLevel}
      active={active}
    >
      <View
        {...viewProps}
        ref={panelRef}
        id={id ?? viewProps.id}
        role="menu"
        tabIndex={-1}
        aria-hidden={visualState === 'closing' ? true : undefined}
        onKeyDown={onKeyDown}
        onTransitionEnd={onTransitionEnd}
        position="fixed"
        layer={viewProps.layer ?? 'overlay'}
        className={['weave-menu', themeClassName, viewProps.className].filter(Boolean).join(' ')}
        data={{
          ...viewProps.data,
          'weave-menu': '',
          'weave-menu-root': rootId,
          'weave-menu-level': levelId,
          'weave-menu-state': visualState,
          placement,
          'weave-reduced-motion': reducedMotion ? 'reduce' : undefined,
        }}
        style={{
          ...viewProps.style,
          ...placementStyle,
          visibility: positioned ? 'visible' : 'hidden',
        }}
      >
        {children}
      </View>
    </MenuLevelProvider>
  )
}
