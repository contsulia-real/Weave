import {
  useCallback,
  useContext,
  useId,
  useInsertionEffect,
  useRef,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type TransitionEvent,
} from 'react'
import type {
  IconSvg,
} from '../core/icon-types'
import type {
  MenuItemIcon,
  MenuItemProps,
} from '../core/menu-types'
import {
  resolveMenuTheme,
} from '../renderers/dom/resolve-component-theme'
import {
  ensureMenuStylesheet,
} from '../renderers/dom/menu-stylesheet'
import {
  useRuntimeStyleClass,
} from '../renderers/dom/runtime-class'
import {
  useTheme,
} from '../theme/theme-context'
import { Icon } from './Icon'
import { renderIconSource } from './internal/render-icon-source'
import {
  MenuLevelContext,
  MenuRootContext,
} from './internal/menu-state'
import {
  syncMenuTabIndex,
} from './internal/menu-navigation'
import { MenuSurface } from './internal/MenuSurface'
import { ThemedPortal } from './internal/ThemedPortal'
import {
  durationMilliseconds,
} from './internal/motion-duration'
import {
  finishExitOnTransition,
  useExitPresence,
} from './internal/use-exit-presence'
import {
  useSubmenuPosition,
} from './internal/use-submenu-position'
import { Text } from './Text'
import { View } from './View'

const submenuArrow = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)

function menuIcon(
  icon: MenuItemIcon,
) {
  return renderIconSource(
    icon,
    {
      size: 'small',
      stroke: 'regular',
      viewProps: {
        className:
          'weave-menu-item__icon',
        'aria-hidden': true,
      },
    },
  )
}

export function MenuItem({
  text,
  secondaryText,
  icon,
  disabled = false,
  danger = false,
  onSelect,
  closeOnSelect,
  submenu,
  viewProps = {},
}: MenuItemProps) {
  const root =
    useContext(MenuRootContext)
  const level =
    useContext(MenuLevelContext)

  if (
    root === null ||
    level === null
  ) {
    throw new Error(
      'MenuItem must be rendered inside Menu',
    )
  }

  const itemRef =
    useRef<HTMLDivElement>(null)
  const submenuPanelRef =
    useRef<HTMLDivElement>(null)
  const reactId = useId()
  const itemId =
    'weave-menu-item-' +
    reactId
  const submenuId =
    'weave-submenu-' +
    reactId
  const submenuLevelId =
    'weave-menu-level-' +
    reactId
  const hasSubmenu =
    submenu !== undefined
  const submenuOpen =
    hasSubmenu &&
    level.openSubmenuId ===
      itemId

  const {
    theme,
    reducedMotion,
  } = useTheme()
  const itemTheme =
    theme.components.Menu
      ?.item
  const themeClassName =
    useRuntimeStyleClass(
      'menu-theme',
      resolveMenuTheme(theme),
    )
  const exitDuration =
    durationMilliseconds(
      theme.tokens.motion
        ?.duration?.fast,
      120,
    )
  const {
    present,
    visualState,
    finishExit,
  } = useExitPresence(
    submenuOpen,
    reducedMotion,
    exitDuration,
  )

  useInsertionEffect(
    ensureMenuStylesheet,
    [],
  )

  const offsetValue =
    root.submenuOffset
  const viewportPaddingValue =
    root.viewportPadding
  const {
    positioned,
    side,
    placementStyle,
  } = useSubmenuPosition(
    itemRef,
    submenuPanelRef,
    present,
    offsetValue,
    viewportPaddingValue,
  )

  const openSubmenu =
    useCallback(
      (
        focusFirst:
          boolean,
      ) => {
        if (
          disabled ||
          !hasSubmenu
        ) {
          return
        }

        level.setOpenSubmenuId(
          itemId,
        )

        if (focusFirst) {
          queueMicrotask(() => {
            const panel =
              submenuPanelRef.current

            if (panel === null) {
              return
            }

            const items =
              panel.querySelectorAll<HTMLDivElement>(
                '[data-weave-menu-item]',
              )

            for (
              const candidate of items
            ) {
              if (
                candidate.dataset
                  .weaveMenuLevel ===
                  submenuLevelId &&
                candidate.getAttribute(
                  'aria-disabled',
                ) !== 'true'
              ) {
                candidate.focus()
                break
              }
            }
          })
        }
      },
      [
        disabled,
        hasSubmenu,
        itemId,
        level,
        submenuLevelId,
      ],
    )

  const closeSubmenu =
    useCallback(() => {
      if (
        level.openSubmenuId ===
        itemId
      ) {
        level.setOpenSubmenuId(
          null,
        )
      }
    }, [
      itemId,
      level,
    ])

  const activate = () => {
    if (disabled) {
      return
    }

    if (hasSubmenu) {
      openSubmenu(true)
      return
    }

    onSelect?.()

    if (
      closeOnSelect ??
      root.closeOnSelect
    ) {
      root.closeAll()
    }
  }

  const handlePointerEnter = (
    event:
      PointerEvent<HTMLDivElement>,
  ) => {
    viewProps.onPointerEnter?.(
      event,
    )

    if (
      event.defaultPrevented ||
      disabled
    ) {
      return
    }

    event.currentTarget.focus()

    if (hasSubmenu) {
      openSubmenu(false)
    } else {
      level.setOpenSubmenuId(
        null,
      )
    }
  }

  const handleFocus = (
    event:
      FocusEvent<HTMLDivElement>,
  ) => {
    viewProps.onFocus?.(
      event,
    )

    if (
      event.defaultPrevented ||
      disabled ||
      event.target !==
        event.currentTarget
    ) {
      return
    }

    syncMenuTabIndex(
      level.panelRef.current,
      level.levelId,
      event.currentTarget,
    )

    if (
      level.openSubmenuId !==
        null &&
      level.openSubmenuId !==
        itemId
    ) {
      level.setOpenSubmenuId(
        null,
      )
    }
  }

  const handleClick = (
    event:
      MouseEvent<HTMLDivElement>,
  ) => {
    if (disabled) {
      event.preventDefault()
      return
    }

    viewProps.onClick?.(
      event,
    )

    if (
      event.defaultPrevented
    ) {
      return
    }

    activate()
  }

  const handleKeyDown = (
    event:
      KeyboardEvent<HTMLDivElement>,
  ) => {
    if (disabled) {
      event.preventDefault()
      return
    }

    viewProps.onKeyDown?.(
      event,
    )

    if (
      event.defaultPrevented
    ) {
      return
    }

    if (
      event.key ===
        'ArrowDown' ||
      event.key ===
        'ArrowUp' ||
      event.key ===
        'Home' ||
      event.key ===
        'End'
    ) {
      event.preventDefault()

      level.moveFocus(
        event.currentTarget,
        event.key ===
          'ArrowDown'
          ? 'next'
          : event.key ===
              'ArrowUp'
            ? 'previous'
            : event.key ===
                'Home'
              ? 'first'
              : 'last',
      )
      return
    }

    if (
      event.key ===
        'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()
      activate()
      return
    }

    if (
      event.key ===
        'ArrowRight' &&
      hasSubmenu
    ) {
      event.preventDefault()
      openSubmenu(true)
      return
    }

    if (
      event.key ===
        'ArrowLeft' &&
      submenuOpen
    ) {
      event.preventDefault()
      closeSubmenu()
      return
    }

    if (
      event.key ===
        'ArrowLeft' &&
      level.parentItemRef !==
        undefined
    ) {
      event.preventDefault()
      event.stopPropagation()
      level.closeLevel()
      queueMicrotask(() => {
        level.parentItemRef
          ?.current
          ?.focus()
      })
      return
    }

    if (
      event.key === 'Escape'
    ) {
      event.preventDefault()
      event.stopPropagation()

      if (submenuOpen) {
        closeSubmenu()
        return
      }

      if (
        level.parentItemRef !==
        undefined
      ) {
        level.closeLevel()
        queueMicrotask(() => {
          level.parentItemRef
            ?.current
            ?.focus()
        })
      } else {
        root.closeAll()
      }
    }
  }

  const handleSubmenuKeyDown = (
    event:
      KeyboardEvent<HTMLDivElement>,
  ) => {
    if (
      event.key ===
        'ArrowLeft' ||
      event.key ===
        'Escape'
    ) {
      event.preventDefault()
      event.stopPropagation()
      closeSubmenu()
      queueMicrotask(() => {
        itemRef.current
          ?.focus()
      })
    }
  }

  const handleSubmenuTransitionEnd = (
    event:
      TransitionEvent<HTMLDivElement>,
  ) => {
    finishExitOnTransition(
      event,
      submenuOpen,
      visualState,
      finishExit,
    )
  }

  const submenuPortal =
    present
      ? (
          <ThemedPortal>
            <MenuSurface
              panelRef={
                submenuPanelRef
              }
              rootId={
                root.rootId
              }
              levelId={
                submenuLevelId
              }
              parentItemRef={
                itemRef
              }
              closeLevel={
                closeSubmenu
              }
              active={
                submenuOpen
              }
              placement={side}
              positioned={
                positioned
              }
              placementStyle={
                placementStyle
              }
              visualState={
                visualState
              }
              themeClassName={
                themeClassName
              }
              reducedMotion={
                reducedMotion
              }
              id={submenuId}
              onKeyDown={
                handleSubmenuKeyDown
              }
              onTransitionEnd={
                handleSubmenuTransitionEnd
              }
            >
              {submenu}
            </MenuSurface>
          </ThemedPortal>
        )
      : null

  return (
    <>
      <View
        {...viewProps}
        ref={itemRef}
        id={
          viewProps.id ??
          itemId
        }
        role="menuitem"
        disabled={
          disabled
            ? true
            : undefined
        }
        tabIndex={
          viewProps.tabIndex ??
          -1
        }
        aria-haspopup={
          hasSubmenu
            ? 'menu'
            : undefined
        }
        aria-controls={
          hasSubmenu
            ? submenuId
            : undefined
        }
        aria-expanded={
          hasSubmenu
            ? submenuOpen
            : undefined
        }
        onPointerEnter={
          handlePointerEnter
        }
        onFocus={handleFocus}
        onClick={handleClick}
        onKeyDown={
          handleKeyDown
        }
        className={[
          'weave-menu-item',
          viewProps.className,
        ].filter(Boolean).join(' ')}
        data={{
          ...viewProps.data,
          'weave-menu-item':
            '',
          'weave-menu-level':
            level.levelId,
          'weave-menu-item-danger':
            danger
              ? 'true'
              : 'false',
          'weave-menu-item-submenu':
            hasSubmenu
              ? 'true'
              : 'false',
          'weave-menu-item-submenu-open':
            submenuOpen
              ? 'true'
              : 'false',
        }}
      >
        {icon === undefined
          ? null
          : menuIcon(icon)}

        <View
          className="weave-menu-item__text"
        >
          <Text
            typo={
              itemTheme
                ?.primaryTypo ??
              'body-medium'
            }
          >
            {text}
          </Text>

          {secondaryText ===
          undefined
            ? null
            : (
                <Text
                  typo={
                    itemTheme
                      ?.secondaryTypo ??
                    'body-small'
                  }
                  viewProps={{
                    className:
                      'weave-menu-item__secondary',
                  }}
                >
                  {secondaryText}
                </Text>
              )}
        </View>

        {hasSubmenu ? (
          <Icon
            svg={
              submenuArrow as IconSvg
            }
            size="small"
            stroke="regular"
            viewProps={{
              className:
                'weave-menu-item__submenu-icon',
              'aria-hidden': true,
              pointerEvents:
                'none',
            }}
          />
        ) : null}
      </View>

      {submenuPortal}
    </>
  )
}
