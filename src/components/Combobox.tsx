import {
  cloneElement,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ComboboxProps, ComboboxValue } from '../core/combobox-types'
import { ensureComboboxStylesheet } from '../renderers/dom/combobox-stylesheet'
import { resolveComboboxTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { useTheme } from '../theme/theme-context'
import { Button } from './Button'
import { Icon } from './Icon'
import { Input } from './Input'
import { assignRef } from './internal/assign-ref'
import { ComboboxContext } from './internal/combobox-context'
import {
  comboboxOptionDescriptors,
  comboboxOptionEntries,
  filteredComboboxEntries,
  selectedComboboxDescriptor,
} from './internal/combobox-options'
import { chevronDownIcon, closeIcon } from './internal/control-icons'
import { durationMilliseconds } from './internal/motion-duration'
import { OptionListboxHost } from './internal/OptionListboxHost'
import {
  handleOpenOptionListboxKey,
  initialOptionActiveValue,
  moveOptionActiveValue,
  optionDomId,
} from './internal/option-navigation'
import { useActiveOptionScrollIntoView } from './internal/use-active-option-scroll'
import {
  useAnchorViewportDismiss,
  useOutsideInteractionDismiss,
} from './internal/use-anchor-viewport-dismiss'
import { useAnchorWidth } from './internal/use-anchor-width'
import { useControllableBoolean } from './internal/use-controllable-boolean'
import { useExitPresence, useExitTransitionEnd } from './internal/use-exit-presence'
import { useFormReset } from './internal/use-form-reset'
import { usePopoverPosition } from './internal/use-popover-position'
import { Text } from './Text'
import { View } from './View'

export function Combobox(props: ComboboxProps): import('react').JSX.Element {
  const {
    children,
    value,
    defaultValue = null,
    onValueChange,
    inputValue,
    defaultInputValue,
    onInputValueChange,
    filter,
    emptyContent = 'No options',
    placeholder,
    name,
    disabled = false,
    clearable = true,
    clearLabel = 'Clear selection',
    placement = 'bottom-left',
    offset,
    overlapTrigger = false,
    viewportPadding = 8,
    open,
    defaultOpen = false,
    onOpenChange,
    viewProps = {},
    listboxViewProps = {},
  } = props
  const entries = useMemo(() => comboboxOptionEntries(children), [children])
  const options = useMemo(() => comboboxOptionDescriptors(entries), [entries])

  const controlledValue = value !== undefined
  const initialSelectedValue = controlledValue ? (value ?? null) : defaultValue
  const [uncontrolledValue, setUncontrolledValue] = useState<ComboboxValue | null>(
    initialSelectedValue,
  )
  const selectedValue = controlledValue ? (value ?? null) : uncontrolledValue
  const selected = selectedComboboxDescriptor(options, selectedValue)

  const controlledInput = inputValue !== undefined
  const [uncontrolledInput, setUncontrolledInput] = useState(
    defaultInputValue ?? selectedComboboxDescriptor(options, initialSelectedValue)?.textValue ?? '',
  )
  const resolvedInputValue = controlledInput ? inputValue : uncontrolledInput

  const { value: resolvedOpen, request: setOpenState } = useControllableBoolean(
    open,
    defaultOpen,
    onOpenChange,
  )

  const [activeValue, setActiveValue] = useState<ComboboxValue | null>(null)

  const filteredEntries = useMemo(
    () => filteredComboboxEntries(entries, resolvedInputValue, filter),
    [entries, filter, resolvedInputValue],
  )
  const filteredOptions = useMemo(
    () => comboboxOptionDescriptors(filteredEntries),
    [filteredEntries],
  )

  const activeStillAvailable =
    activeValue !== null &&
    filteredOptions.some((option) => option.value === activeValue && !option.disabled)
  const resolvedActiveValue = resolvedOpen
    ? activeStillAvailable
      ? activeValue
      : initialOptionActiveValue(filteredOptions, selectedValue)
    : null

  const reactId = useId()
  const inputId = viewProps.id ?? 'weave-combobox-' + reactId
  const listboxId = listboxViewProps.id ?? inputId + '-listbox'

  const rootRef = useRef<HTMLSpanElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxRef = useRef<HTMLDivElement>(null)

  const { theme, reducedMotion } = useTheme()
  const themeClassName = useRuntimeStyleClass('combobox-theme', resolveComboboxTheme(theme))
  const exitDuration = durationMilliseconds(theme.tokens.motion?.duration?.fast, 120)
  const { present, visualState, finishExit } = useExitPresence(
    resolvedOpen,
    reducedMotion,
    exitDuration,
  )

  useStaticStylesheet(ensureComboboxStylesheet)

  const close = useCallback(() => {
    setOpenState(false)
    setActiveValue(null)
  }, [setOpenState])

  const setInputState = useCallback(
    (next: string) => {
      if (next === resolvedInputValue) {
        return
      }

      if (!controlledInput) {
        setUncontrolledInput(next)
      }

      onInputValueChange?.(next)
    },
    [controlledInput, onInputValueChange, resolvedInputValue],
  )

  const setValueState = useCallback(
    (next: ComboboxValue | null) => {
      if (next === selectedValue) {
        return
      }

      if (!controlledValue) {
        setUncontrolledValue(next)
      }

      onValueChange?.(next)
    },
    [controlledValue, onValueChange, selectedValue],
  )

  const openCombobox = useCallback(
    (preferred?: ComboboxValue | null) => {
      if (disabled) return

      setActiveValue(preferred ?? initialOptionActiveValue(filteredOptions, selectedValue))
      setOpenState(true)
    },
    [disabled, filteredOptions, selectedValue, setOpenState],
  )

  const selectValue = useCallback(
    (nextValue: ComboboxValue) => {
      const option = options.find((candidate) => candidate.value === nextValue)

      if (option === undefined || option.disabled) {
        return
      }

      setValueState(nextValue)
      setInputState(option.textValue)
      close()
    },
    [close, options, setInputState, setValueState],
  )

  const setEnabledActiveValue = useCallback(
    (nextValue: ComboboxValue) => {
      const option = filteredOptions.find((candidate) => candidate.value === nextValue)

      if (option !== undefined && !option.disabled) {
        setActiveValue(nextValue)
      }
    },
    [filteredOptions],
  )

  const previousSelectedValueRef = useRef(selectedValue)

  /*
   * External value changes update an uncontrolled input display.
   * Typing does not touch value, so the two states remain separate.
   */
  /* oxlint-disable react/set-state-in-effect */
  useEffect(() => {
    if (previousSelectedValueRef.current === selectedValue) {
      return
    }

    previousSelectedValueRef.current = selectedValue

    if (!controlledInput) {
      setUncontrolledInput(selected?.textValue ?? '')
    }
  }, [controlledInput, selected?.textValue, selectedValue])
  /* oxlint-enable react/set-state-in-effect */

  const resetCombobox = useCallback(() => {
    const resetValue = controlledValue ? selectedValue : defaultValue

    if (!controlledValue) {
      setUncontrolledValue(defaultValue)
    }

    if (!controlledInput) {
      setUncontrolledInput(
        defaultInputValue ?? selectedComboboxDescriptor(options, resetValue)?.textValue ?? '',
      )
    }
  }, [controlledInput, controlledValue, defaultInputValue, defaultValue, options, selectedValue])

  useFormReset(inputRef, resetCombobox)
  useAnchorViewportDismiss(inputRef, resolvedOpen, close)
  useOutsideInteractionDismiss(rootRef, listboxRef, resolvedOpen, close, true)

  const anchorWidth = useAnchorWidth(inputRef, present)

  useActiveOptionScrollIntoView(inputRef, listboxId, resolvedActiveValue, resolvedOpen)

  const resolvedOffset = offset ?? (overlapTrigger ? 0 : 0.375)
  const {
    positioned,
    placement: resolvedPlacement,
    placementStyle,
  } = usePopoverPosition(
    inputRef,
    listboxRef,
    present,
    placement,
    resolvedOffset,
    viewportPadding,
    'center',
    overlapTrigger,
  )

  const handleChange = (next: string) => {
    const nextEntries = filteredComboboxEntries(entries, next, filter)
    const nextOptions = comboboxOptionDescriptors(nextEntries)

    setInputState(next)
    setActiveValue(initialOptionActiveValue(nextOptions, selectedValue))
    setOpenState(true)
  }

  const handleClick = (event: MouseEvent<HTMLInputElement>) => {
    viewProps.onClick?.(event)

    if (event.defaultPrevented || disabled || resolvedOpen) {
      return
    }

    openCombobox()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    viewProps.onKeyDown?.(event)

    if (event.defaultPrevented || disabled) {
      return
    }

    if (!resolvedOpen) {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        openCombobox(initialOptionActiveValue(filteredOptions, selectedValue))
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        openCombobox(moveOptionActiveValue(filteredOptions, null, 'last'))
      }

      return
    }

    handleOpenOptionListboxKey(
      event,
      filteredOptions,
      resolvedActiveValue,
      setActiveValue,
      selectValue,
      close,
      false,
    )
  }

  const clearSelection = useCallback(() => {
    setValueState(null)
    setInputState('')
    setActiveValue(null)
    close()

    queueMicrotask(() => {
      inputRef.current?.focus()
    })
  }, [close, inputRef, setInputState, setValueState])

  const handleClearPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
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

  const setInputRef = (element: HTMLInputElement | null) => {
    inputRef.current = element
    assignRef(viewProps.ref, element)
  }

  const setListboxRef = (element: HTMLDivElement | null) => {
    listboxRef.current = element
    assignRef(listboxViewProps.ref, element)
  }

  const activeDescendant =
    resolvedOpen && resolvedActiveValue !== null
      ? optionDomId(listboxId, resolvedActiveValue)
      : undefined

  const hasClear =
    clearable && !disabled && (resolvedInputValue.length > 0 || selectedValue !== null)

  const portal = (
    <ComboboxContext.Provider value={contextValue}>
      <OptionListboxHost
        component="combobox"
        present={present}
        panelRef={setListboxRef}
        viewProps={listboxViewProps}
        id={listboxId}
        labelledBy={inputId}
        visualState={visualState}
        placement={resolvedPlacement}
        positioned={positioned}
        placementStyle={placementStyle}
        reducedMotion={reducedMotion}
        themeClassNames={[themeClassName]}
        anchorWidth={anchorWidth}
        onTransitionEnd={handleTransitionEnd}
      >
        {filteredEntries.length === 0 ? (
          <View
            className="weave-combobox-empty"
            data={{
              'weave-combobox-empty': '',
            }}
          >
            <Text typo="body-small">{emptyContent}</Text>
          </View>
        ) : (
          filteredEntries.map((entry) =>
            cloneElement(entry.node, {
              key: entry.descriptor.value,
            }),
          )
        )}
      </OptionListboxHost>
    </ComboboxContext.Provider>
  )

  return (
    <>
      {name !== undefined && selectedValue !== null ? (
        <input type="hidden" name={name} value={selectedValue} disabled={disabled} />
      ) : null}

      <span
        ref={rootRef}
        className={['weave-combobox-root', themeClassName].filter(Boolean).join(' ')}
        data-weave-combobox-root=""
        data-weave-combobox-open={resolvedOpen ? 'true' : 'false'}
        data-weave-combobox-has-clear={hasClear ? 'true' : 'false'}
      >
        <Input
          value={resolvedInputValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          type="text"
          clearable={false}
          autoComplete="off"
          viewProps={{
            ...viewProps,
            ref: setInputRef,
            id: inputId,
            role: 'combobox',
            expanded: resolvedOpen,
            controls: listboxId,
            'aria-haspopup': 'listbox',
            'aria-activedescendant': activeDescendant,
            'aria-autocomplete': 'list',
            onClick: handleClick,
            onKeyDown: handleKeyDown,
            className: ['weave-combobox', viewProps.className].filter(Boolean).join(' '),
            data: {
              ...viewProps.data,
              'weave-combobox': '',
            },
          }}
        />

        <span className="weave-combobox__actions" aria-hidden={disabled ? true : undefined}>
          {hasClear ? (
            <Button
              icon={closeIcon}
              variant="ghost"
              size="small"
              viewProps={{
                className: 'weave-combobox__action',
                label: clearLabel,
                onPointerDown: handleClearPointerDown,
                onFocus: close,
                onClick: clearSelection,
              }}
            />
          ) : null}

          <Icon
            svg={chevronDownIcon}
            size="small"
            stroke="regular"
            viewProps={{
              className: 'weave-combobox__chevron',
              'aria-hidden': true,
              pointerEvents: 'none',
            }}
          />
        </span>
      </span>

      {portal}
    </>
  )
}
