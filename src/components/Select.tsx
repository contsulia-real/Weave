import {
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useId,
  useInsertionEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { SelectProps, SelectValue } from '../core/select-types'
import type { ViewProps } from '../core/view-types'
import { resolveInputTheme, resolveSelectTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ensureSelectStylesheet } from '../renderers/dom/select-stylesheet'
import { useTheme } from '../theme/theme-context'
import { Icon } from './Icon'
import { assignRef } from './internal/assign-ref'
import { chevronDownIcon } from './internal/control-icons'
import { durationMilliseconds } from './internal/motion-duration'
import { OptionListboxHost } from './internal/OptionListboxHost'
import {
  handleOpenOptionListboxKey,
  initialOptionActiveValue,
  moveOptionActiveValue,
  optionDomId,
} from './internal/option-navigation'
import { renderIconSource } from './internal/render-icon-source'
import { SelectContext } from './internal/select-context'
import { selectedDescriptor, selectOptionDescriptors } from './internal/select-options'
import { useActiveOptionScrollIntoView } from './internal/use-active-option-scroll'
import {
  useAnchorViewportDismiss,
  useOutsideInteractionDismiss,
} from './internal/use-anchor-viewport-dismiss'
import { useControllableBoolean } from './internal/use-controllable-boolean'
import { useExitPresence, useExitTransitionEnd } from './internal/use-exit-presence'
import { usePopoverPosition } from './internal/use-popover-position'
import { useSelectTypeahead } from './internal/use-select-typeahead'
import { useViewHost } from './internal/use-view-host'
import { Text } from './Text'
import { View } from './View'

function printableKey(event: KeyboardEvent<HTMLButtonElement>): boolean {
  return (
    event.key.length === 1 && event.key !== ' ' && !event.altKey && !event.ctrlKey && !event.metaKey
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
  const options = useMemo(() => selectOptionDescriptors(children), [children])

  const controlledValue = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<SelectValue | null>(defaultValue)
  const selectedValue = controlledValue ? (value ?? null) : uncontrolledValue

  const { value: resolvedOpen, request: setOpenState } = useControllableBoolean(
    open,
    defaultOpen,
    onOpenChange,
  )

  const [activeValue, setActiveValue] = useState<SelectValue | null>(null)

  const reactId = useId()
  const triggerId = viewProps.id ?? 'weave-select-' + reactId
  const listboxId = listboxViewProps.id ?? triggerId + '-listbox'
  const listboxRef = useRef<HTMLDivElement>(null)

  const { theme, reducedMotion } = useTheme()
  const inputBaseTheme = theme.components.Input?.base
  const inputThemeClassName = useRuntimeStyleClass('input-theme', resolveInputTheme(theme))
  const themeClassName = useRuntimeStyleClass('select-theme', resolveSelectTheme(theme))
  const exitDuration = durationMilliseconds(theme.tokens.motion?.duration?.fast, 120)
  const { present, visualState, finishExit } = useExitPresence(
    resolvedOpen,
    reducedMotion,
    exitDuration,
  )

  useInsertionEffect(ensureSelectStylesheet, [])

  const selected = selectedDescriptor(options, selectedValue)
  const resolvedActiveValue = resolvedOpen
    ? (activeValue ?? initialOptionActiveValue(options, selectedValue))
    : null

  const close = useCallback(() => {
    setOpenState(false)
    setActiveValue(null)
  }, [setOpenState])

  const openSelect = useCallback(
    (preferred?: SelectValue | null) => {
      if (disabled) return

      setActiveValue(preferred ?? initialOptionActiveValue(options, selectedValue))
      setOpenState(true)
    },
    [disabled, options, selectedValue, setOpenState],
  )

  const selectValue = useCallback(
    (nextValue: SelectValue) => {
      const option = options.find((candidate) => candidate.value === nextValue)

      if (option === undefined || option.disabled) {
        return
      }

      if (nextValue !== selectedValue) {
        if (!controlledValue) {
          setUncontrolledValue(nextValue)
        }

        onValueChange?.(nextValue)
      }

      close()
    },
    [close, controlledValue, onValueChange, options, selectedValue],
  )

  const setEnabledActiveValue = useCallback(
    (nextValue: SelectValue) => {
      const option = options.find((candidate) => candidate.value === nextValue)

      if (option !== undefined && !option.disabled) {
        setActiveValue(nextValue)
      }
    },
    [options],
  )

  const handleTypeahead = useSelectTypeahead(
    options,
    resolvedActiveValue ?? selectedValue,
    (match) => {
      if (!resolvedOpen) {
        openSelect(match)
        return
      }

      setActiveValue(match)
    },
  )

  const hostProps: ViewProps<HTMLButtonElement> = {
    ...viewProps,
    disabled,
    expanded: resolvedOpen,
    controls: listboxId,
  }
  const {
    elementRef: triggerRef,
    className: triggerClassName,
    inlineStyle: triggerInlineStyle,
    resolved: triggerResolved,
  } = useViewHost(hostProps)

  useAnchorViewportDismiss(triggerRef, resolvedOpen, close)
  useOutsideInteractionDismiss(triggerRef, listboxRef, resolvedOpen, close)

  useActiveOptionScrollIntoView(triggerRef, listboxId, resolvedActiveValue, resolvedOpen)

  /*
   * Controlled open can close without passing through close().
   * Reset the per-open active override so the next open starts from
   * the current selected option again.
   */
  /* oxlint-disable react/set-state-in-effect */
  useEffect(() => {
    if (!resolvedOpen && activeValue !== null) {
      setActiveValue(null)
    }
  }, [activeValue, resolvedOpen])
  /* oxlint-enable react/set-state-in-effect */

  const {
    positioned,
    placement: resolvedPlacement,
    placementStyle,
  } = usePopoverPosition(triggerRef, listboxRef, present, placement, offset, viewportPadding)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    viewProps.onClick?.(event)

    if (event.defaultPrevented || disabled) {
      return
    }

    if (resolvedOpen) {
      close()
    } else {
      openSelect()
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    viewProps.onKeyDown?.(event)

    if (event.defaultPrevented || disabled) {
      return
    }

    if (!resolvedOpen) {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp' ||
        event.key === 'Enter' ||
        event.key === ' '
      ) {
        event.preventDefault()
        openSelect()
        return
      }

      if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault()
        const next = moveOptionActiveValue(options, null, event.key === 'Home' ? 'first' : 'last')
        openSelect(next)
        return
      }

      if (printableKey(event)) {
        event.preventDefault()
        handleTypeahead(event.key)
      }

      return
    }

    if (
      handleOpenOptionListboxKey(
        event,
        options,
        resolvedActiveValue,
        setActiveValue,
        selectValue,
        close,
        true,
      )
    ) {
      return
    }

    if (printableKey(event)) {
      event.preventDefault()
      handleTypeahead(event.key)
    }
  }

  const contextValue = useMemo(
    () => ({
      listboxId,
      selectedValue,
      activeValue: resolvedActiveValue,
      setActiveValue: setEnabledActiveValue,
      selectValue,
    }),
    [listboxId, resolvedActiveValue, selectValue, selectedValue, setEnabledActiveValue],
  )

  const handleTransitionEnd = useExitTransitionEnd(
    resolvedOpen,
    visualState,
    finishExit,
    listboxViewProps.onTransitionEnd,
  )

  const setListboxRef = (element: HTMLDivElement | null) => {
    listboxRef.current = element
    assignRef(listboxViewProps.ref, element)
  }

  const activeDescendant =
    resolvedOpen && resolvedActiveValue !== null
      ? optionDomId(listboxId, resolvedActiveValue)
      : undefined

  const portal = (
    <SelectContext.Provider value={contextValue}>
      <OptionListboxHost
        component="select"
        present={present}
        panelRef={setListboxRef}
        viewProps={listboxViewProps}
        id={listboxId}
        labelledBy={triggerId}
        visualState={visualState}
        placement={resolvedPlacement}
        positioned={positioned}
        placementStyle={placementStyle}
        reducedMotion={reducedMotion}
        themeClassNames={[inputThemeClassName, themeClassName]}
        onTransitionEnd={handleTransitionEnd}
      >
        {children}
      </OptionListboxHost>
    </SelectContext.Provider>
  )

  return (
    <>
      <button
        {...triggerResolved.domProps}
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={resolvedOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeDescendant}
        aria-autocomplete="none"
        disabled={disabled}
        data-weave-view=""
        data-weave-select=""
        data-weave-select-open={resolvedOpen ? 'true' : 'false'}
        data-weave-layout={triggerResolved.layout}
        className={['weave-select', inputThemeClassName, themeClassName, triggerClassName]
          .filter(Boolean)
          .join(' ')}
        style={triggerInlineStyle}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <View className="weave-select__value" pointerEvents="none">
          {selected?.icon === undefined
            ? null
            : renderIconSource(selected.icon, {
                size: 'small',
                stroke: 'regular',
                viewProps: {
                  className: 'weave-select__value-icon',
                  'aria-hidden': true,
                },
              })}

          <Text
            typo={inputBaseTheme?.typo ?? 'body-large'}
            viewProps={{
              className: selected === undefined ? 'weave-select__placeholder' : undefined,
            }}
          >
            {selected?.text ?? placeholder}
          </Text>
        </View>

        <Icon
          svg={chevronDownIcon}
          size="small"
          stroke="regular"
          viewProps={{
            className: 'weave-select__chevron',
            'aria-hidden': true,
            pointerEvents: 'none',
          }}
        />
      </button>

      {portal}
    </>
  )
}
