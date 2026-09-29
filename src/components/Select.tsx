import {
  useCallback,
  useEffect,
  useId,
  useInsertionEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type TransitionEvent,
} from 'react'
import { createPortal } from 'react-dom'
import type {
  IconSvg,
} from '../core/icon-types'
import type {
  SelectProps,
  SelectValue,
} from '../core/select-types'
import type {
  ViewProps,
} from '../core/view-types'
import { length } from '../core/values'
import {
  resolveInputTheme,
  resolveSelectTheme,
} from '../renderers/dom/resolve-component-theme'
import {
  ensureSelectStylesheet,
} from '../renderers/dom/select-stylesheet'
import {
  useRuntimeStyleClass,
} from '../renderers/dom/runtime-class'
import {
  useTheme,
} from '../theme/theme-context'
import { ThemeProvider } from '../theme/ThemeProvider'
import { Icon } from './Icon'
import { assignRef } from './internal/assign-ref'
import { chevronDownIcon } from './internal/control-icons'
import { renderIconSource } from './internal/render-icon-source'
import {
  SelectContext,
} from './internal/select-context'
import {
  initialOptionActiveValue,
  moveOptionActiveValue,
  optionDomId,
} from './internal/option-navigation'
import {
  selectOptionDescriptors,
  selectedDescriptor,
} from './internal/select-options'
import {
  durationMilliseconds,
} from './internal/motion-duration'
import {
  useControllableBoolean,
} from './internal/use-controllable-boolean'
import {
  useExitPresence,
} from './internal/use-exit-presence'
import {
  usePopoverPosition,
} from './internal/use-popover-position'
import {
  useAnchorViewportDismiss,
  useOutsideInteractionDismiss,
} from './internal/use-anchor-viewport-dismiss'
import {
  useSelectTypeahead,
} from './internal/use-select-typeahead'
import { Text } from './Text'
import { View } from './View'
import {
  useViewHost,
} from './internal/use-view-host'

function printableKey(
  event:
    KeyboardEvent<HTMLButtonElement>,
): boolean {
  return (
    event.key.length === 1 &&
    event.key !== ' ' &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey
  )
}

export function Select({
  children,
  value,
  defaultValue = null,
  onValueChange,
  placeholder = 'Select…',
  disabled = false,
  placement = 'bottom-left',
  offset = 0.375,
  viewportPadding = 0.5,
  open,
  defaultOpen = false,
  onOpenChange,
  viewProps = {},
  listboxViewProps = {},
}: SelectProps) {
  const options = useMemo(
    () =>
      selectOptionDescriptors(
        children,
      ),
    [children],
  )

  const controlledValue =
    value !== undefined
  const [
    uncontrolledValue,
    setUncontrolledValue,
  ] = useState<
    SelectValue | null
  >(defaultValue)
  const selectedValue =
    controlledValue
      ? value ?? null
      : uncontrolledValue

  const {
    value: resolvedOpen,
    request: setOpenState,
  } = useControllableBoolean(
    open,
    defaultOpen,
    onOpenChange,
  )

  const [
    activeValue,
    setActiveValue,
  ] = useState<
    SelectValue | null
  >(null)

  const reactId = useId()
  const triggerId =
    viewProps.id ??
    'weave-select-' +
      reactId
  const listboxId =
    listboxViewProps.id ??
    triggerId +
      '-listbox'
  const listboxRef =
    useRef<HTMLDivElement>(
      null,
    )

  const {
    theme,
    mode,
    reducedMotion,
  } = useTheme()
  const inputBaseTheme =
    theme.components.Input
      ?.base
  const inputThemeClassName =
    useRuntimeStyleClass(
      'input-theme',
      resolveInputTheme(theme),
    )
  const themeClassName =
    useRuntimeStyleClass(
      'select-theme',
      resolveSelectTheme(theme),
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
    resolvedOpen,
    reducedMotion,
    exitDuration,
  )

  useInsertionEffect(
    ensureSelectStylesheet,
    [],
  )

  const selected =
    selectedDescriptor(
      options,
      selectedValue,
    )
  const resolvedActiveValue =
    resolvedOpen
      ? (
          activeValue ??
          initialOptionActiveValue(
            options,
            selectedValue,
          )
        )
      : null

  const close =
    useCallback(() => {
      setOpenState(false)
      setActiveValue(null)
    }, [setOpenState])

  const openSelect =
    useCallback(
      (
        preferred?:
          SelectValue | null,
      ) => {
        if (disabled) return

        setActiveValue(
          preferred ??
          initialOptionActiveValue(
            options,
            selectedValue,
          ),
        )
        setOpenState(true)
      },
      [
        disabled,
        options,
        selectedValue,
        setOpenState,
      ],
    )

  const selectValue =
    useCallback(
      (
        nextValue:
          SelectValue,
      ) => {
        const option =
          options.find(
            (candidate) =>
              candidate.value ===
              nextValue,
          )

        if (
          option === undefined ||
          option.disabled
        ) {
          return
        }

        if (
          nextValue !==
          selectedValue
        ) {
          if (!controlledValue) {
            setUncontrolledValue(
              nextValue,
            )
          }

          onValueChange?.(
            nextValue,
          )
        }

        close()
      },
      [
        close,
        controlledValue,
        onValueChange,
        options,
        selectedValue,
      ],
    )

  const setEnabledActiveValue =
    useCallback(
      (
        nextValue:
          SelectValue,
      ) => {
        const option =
          options.find(
            (candidate) =>
              candidate.value ===
              nextValue,
          )

        if (
          option !== undefined &&
          !option.disabled
        ) {
          setActiveValue(
            nextValue,
          )
        }
      },
      [options],
    )

  const handleTypeahead =
    useSelectTypeahead(
      options,
      resolvedActiveValue ??
        selectedValue,
      (match) => {
        if (!resolvedOpen) {
          openSelect(match)
          return
        }

        setActiveValue(match)
      },
    )

  const hostProps:
    ViewProps<HTMLButtonElement> = {
      ...viewProps,
      disabled,
      expanded:
        resolvedOpen,
      controls:
        listboxId,
    }
  const {
    elementRef:
      triggerRef,
    className:
      triggerClassName,
    inlineStyle:
      triggerInlineStyle,
    resolved:
      triggerResolved,
  } = useViewHost(
    hostProps,
  )

  useAnchorViewportDismiss(
    triggerRef,
    resolvedOpen,
    close,
  )
  useOutsideInteractionDismiss(
    triggerRef,
    listboxRef,
    resolvedOpen,
    close,
  )

  useEffect(() => {
    if (
      !resolvedOpen ||
      resolvedActiveValue === null
    ) {
      return
    }

    const option =
      triggerRef.current
        ?.ownerDocument
        .getElementById(
          optionDomId(
            listboxId,
            resolvedActiveValue,
          ),
        )

    if (
      option !== null &&
      option !== undefined &&
      typeof option.scrollIntoView ===
        'function'
    ) {
      option.scrollIntoView({
        block: 'nearest',
      })
    }
  }, [
    listboxId,
    resolvedActiveValue,
    resolvedOpen,
    triggerRef,
  ])

  /*
   * Controlled open can close without passing through close().
   * Reset the per-open active override so the next open starts from
   * the current selected option again.
   */
  /* oxlint-disable react/set-state-in-effect */
  useEffect(() => {
    if (
      !resolvedOpen &&
      activeValue !== null
    ) {
      setActiveValue(null)
    }
  }, [
    activeValue,
    resolvedOpen,
  ])
  /* oxlint-enable react/set-state-in-effect */

  const offsetValue =
    length(offset) ??
    '0rem'
  const viewportPaddingValue =
    length(viewportPadding) ??
    '0rem'
  const {
    positioned,
    placement:
      resolvedPlacement,
    placementStyle,
  } = usePopoverPosition(
    triggerRef,
    listboxRef,
    present,
    placement,
    offsetValue,
    viewportPaddingValue,
  )

  const handleClick = (
    event:
      MouseEvent<HTMLButtonElement>,
  ) => {
    viewProps.onClick?.(
      event,
    )

    if (
      event.defaultPrevented ||
      disabled
    ) {
      return
    }

    if (resolvedOpen) {
      close()
    } else {
      openSelect()
    }
  }

  const moveActive = (
    move:
      | 'previous'
      | 'next'
      | 'first'
      | 'last',
  ) => {
    const next =
      moveOptionActiveValue(
        options,
        resolvedActiveValue,
        move,
      )

    if (next !== null) {
      setActiveValue(next)
    }
  }

  const handleKeyDown = (
    event:
      KeyboardEvent<HTMLButtonElement>,
  ) => {
    viewProps.onKeyDown?.(
      event,
    )

    if (
      event.defaultPrevented ||
      disabled
    ) {
      return
    }

    if (!resolvedOpen) {
      if (
        event.key ===
          'ArrowDown' ||
        event.key ===
          'ArrowUp' ||
        event.key ===
          'Enter' ||
        event.key === ' '
      ) {
        event.preventDefault()
        openSelect()
        return
      }

      if (
        event.key === 'Home' ||
        event.key === 'End'
      ) {
        event.preventDefault()
        const next =
          moveOptionActiveValue(
            options,
            null,
            event.key ===
              'Home'
              ? 'first'
              : 'last',
          )
        openSelect(next)
        return
      }

      if (printableKey(event)) {
        event.preventDefault()
        handleTypeahead(
          event.key,
        )
      }

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
      moveActive(
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

      if (
        resolvedActiveValue !==
        null
      ) {
        selectValue(
          resolvedActiveValue,
        )
      }
      return
    }

    if (
      event.key === 'Escape'
    ) {
      event.preventDefault()
      close()
      return
    }

    if (printableKey(event)) {
      event.preventDefault()
      handleTypeahead(
        event.key,
      )
    }
  }

  const contextValue =
    useMemo(
      () => ({
        listboxId,
        selectedValue,
        activeValue:
          resolvedActiveValue,
        setActiveValue:
          setEnabledActiveValue,
        selectValue,
      }),
      [
        listboxId,
        resolvedActiveValue,
        selectValue,
        selectedValue,
        setEnabledActiveValue,
      ],
    )

  const handleTransitionEnd = (
    event:
      TransitionEvent<HTMLDivElement>,
  ) => {
    listboxViewProps
      .onTransitionEnd?.(
        event,
      )

    if (
      event.target !==
        event.currentTarget ||
      resolvedOpen ||
      visualState !==
        'closing'
    ) {
      return
    }

    finishExit()
  }

  const setListboxRef = (
    element:
      HTMLDivElement | null,
  ) => {
    listboxRef.current =
      element
    assignRef(
      listboxViewProps.ref,
      element,
    )
  }

  const activeDescendant =
    resolvedOpen &&
    resolvedActiveValue !== null
      ? optionDomId(
          listboxId,
          resolvedActiveValue,
        )
      : undefined

  const portal =
    present &&
    typeof document !==
      'undefined'
      ? createPortal(
          <ThemeProvider
            theme={theme}
            mode={mode}
          >
            <SelectContext.Provider
              value={contextValue}
            >
              <View
                {...listboxViewProps}
                ref={setListboxRef}
                id={listboxId}
                role="listbox"
                labelledBy={
                  triggerId
                }
                tabIndex={-1}
                aria-hidden={
                  visualState ===
                    'closing'
                    ? true
                    : undefined
                }
                onTransitionEnd={
                  handleTransitionEnd
                }
                position="fixed"
                layer={
                  listboxViewProps
                    .layer ??
                  'overlay'
                }
                className={[
                  'weave-option-listbox',
                  'weave-select-listbox',
                  inputThemeClassName,
          themeClassName,
                  listboxViewProps
                    .className,
                ].filter(Boolean).join(' ')}
                data={{
                  ...listboxViewProps
                    .data,
                  'weave-option-listbox':
                    '',
                  'weave-option-listbox-state':
                    visualState,
                  'weave-select-listbox':
                    '',
                  'weave-select-state':
                    visualState,
                  placement:
                    resolvedPlacement,
                  'weave-reduced-motion':
                    reducedMotion
                      ? 'reduce'
                      : undefined,
                }}
                style={{
                  ...listboxViewProps
                    .style,
                  ...placementStyle,
                  visibility:
                    positioned
                      ? 'visible'
                      : 'hidden',
                }}
              >
                {children}
              </View>
            </SelectContext.Provider>
          </ThemeProvider>,
          document.body,
        )
      : null

  return (
    <>
      <button
        {...triggerResolved.domProps}
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={
          resolvedOpen
        }
        aria-controls={
          listboxId
        }
        aria-activedescendant={
          activeDescendant
        }
        aria-autocomplete="none"
        disabled={disabled}
        data-weave-view=""
        data-weave-select=""
        data-weave-select-open={
          resolvedOpen
            ? 'true'
            : 'false'
        }
        data-weave-layout={
          triggerResolved.layout
        }
        className={[
          'weave-select',
          inputThemeClassName,
          themeClassName,
          triggerClassName,
        ].filter(Boolean).join(' ')}
        style={triggerInlineStyle}
        onClick={handleClick}
        onKeyDown={
          handleKeyDown
        }
      >
        <View
          className="weave-select__value"
          pointerEvents="none"
        >
          {selected?.icon ===
          undefined
            ? null
            : renderIconSource(
              selected.icon,
              {
                size: 'small',
                stroke: 'regular',
                viewProps: {
                  className:
                    'weave-select__value-icon',
                  'aria-hidden': true,
                },
              },
            )}

          <Text
            typo={
              inputBaseTheme
                ?.typo ??
              'body-large'
            }
            viewProps={{
              className:
                selected ===
                undefined
                  ? 'weave-select__placeholder'
                  : undefined,
            }}
          >
            {selected?.text ??
              placeholder}
          </Text>
        </View>

        <Icon
          svg={
            chevronDownIcon as IconSvg
          }
          size="small"
          stroke="regular"
          viewProps={{
            className:
              'weave-select__chevron',
            'aria-hidden': true,
            pointerEvents: 'none',
          }}
        />
      </button>

      {portal}
    </>
  )
}
