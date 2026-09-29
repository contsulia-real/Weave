import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useInsertionEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type Ref,
  type TransitionEvent,
} from 'react'
import { createPortal } from 'react-dom'
import type {
  IconSvg,
} from '../core/icon-types'
import type {
  ComboboxProps,
  ComboboxValue,
} from '../core/combobox-types'
import type {
  ViewProps,
} from '../core/view-types'
import { length } from '../core/values'
import {
  resolveComboboxTheme,
} from '../renderers/dom/resolve-component-theme'
import {
  ensureComboboxStylesheet,
} from '../renderers/dom/combobox-stylesheet'
import {
  useRuntimeStyleClass,
} from '../renderers/dom/runtime-class'
import {
  useTheme,
} from '../theme/theme-context'
import { ThemeProvider } from '../theme/ThemeProvider'
import { Icon } from './Icon'
import {
  ComboboxContext,
} from './internal/combobox-context'
import {
  comboboxOptionDescriptors,
  comboboxOptionEntries,
  filteredComboboxEntries,
  selectedComboboxDescriptor,
} from './internal/combobox-options'
import {
  initialOptionActiveValue,
  moveOptionActiveValue,
  optionDomId,
} from './internal/option-navigation'
import {
  durationMilliseconds,
} from './internal/motion-duration'
import {
  useAnchorWidth,
} from './internal/use-anchor-width'
import {
  useComboboxInteraction,
} from './internal/use-combobox-interaction'
import {
  useExitPresence,
} from './internal/use-exit-presence'
import {
  usePopoverPosition,
} from './internal/use-popover-position'
import {
  useViewHost,
} from './internal/use-view-host'
import { Text } from './Text'
import { View } from './View'

const clearIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m7 7 10 10M17 7 7 17" />
  </svg>
)

const chevronIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

type ComboboxListboxStyle =
  CSSProperties & {
    '--weave-combobox-anchor-width'?:
      string
  }

function assignRef<T>(
  ref: Ref<T> | undefined,
  value: T | null,
): void {
  if (
    ref === undefined ||
    ref === null
  ) {
    return
  }

  if (typeof ref === 'function') {
    ref(value)
    return
  }

  ref.current = value
}

export function Combobox({
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
  disabled = false,
  clearable = true,
  clearLabel = 'Clear selection',
  placement = 'bottom-left',
  offset = 0.375,
  viewportPadding = 0.5,
  open,
  defaultOpen = false,
  onOpenChange,
  viewProps = {},
  listboxViewProps = {},
}: ComboboxProps) {
  const entries =
    useMemo(
      () =>
        comboboxOptionEntries(
          children,
        ),
      [children],
    )
  const options =
    useMemo(
      () =>
        comboboxOptionDescriptors(
          entries,
        ),
      [entries],
    )

  const controlledValue =
    value !== undefined
  const initialSelectedValue =
    controlledValue
      ? value ?? null
      : defaultValue
  const [
    uncontrolledValue,
    setUncontrolledValue,
  ] = useState<
    ComboboxValue | null
  >(initialSelectedValue)
  const selectedValue =
    controlledValue
      ? value ?? null
      : uncontrolledValue
  const selected =
    selectedComboboxDescriptor(
      options,
      selectedValue,
    )

  const controlledInput =
    inputValue !== undefined
  const [
    uncontrolledInput,
    setUncontrolledInput,
  ] = useState(
    defaultInputValue ??
    selectedComboboxDescriptor(
      options,
      initialSelectedValue,
    )?.textValue ??
    '',
  )
  const resolvedInputValue =
    controlledInput
      ? inputValue
      : uncontrolledInput

  const controlledOpen =
    open !== undefined
  const [
    uncontrolledOpen,
    setUncontrolledOpen,
  ] = useState(defaultOpen)
  const resolvedOpen =
    open ??
    uncontrolledOpen
  const requestedOpenRef =
    useRef(resolvedOpen)

  const [
    activeValue,
    setActiveValue,
  ] = useState<
    ComboboxValue | null
  >(null)

  const filteredEntries =
    useMemo(
      () =>
        filteredComboboxEntries(
          entries,
          resolvedInputValue,
          filter,
        ),
      [
        entries,
        filter,
        resolvedInputValue,
      ],
    )
  const filteredOptions =
    useMemo(
      () =>
        comboboxOptionDescriptors(
          filteredEntries,
        ),
      [filteredEntries],
    )

  const activeStillAvailable =
    activeValue !== null &&
    filteredOptions.some(
      (option) =>
        option.value ===
          activeValue &&
        !option.disabled,
    )
  const resolvedActiveValue =
    resolvedOpen
      ? (
          activeStillAvailable
            ? activeValue
            : initialOptionActiveValue(
                filteredOptions,
                selectedValue,
              )
        )
      : null

  const reactId = useId()
  const inputId =
    viewProps.id ??
    'weave-combobox-' +
      reactId
  const listboxId =
    listboxViewProps.id ??
    inputId +
      '-listbox'

  const rootRef =
    useRef<HTMLSpanElement>(
      null,
    )
  const listboxRef =
    useRef<HTMLDivElement>(
      null,
    )

  const {
    theme,
    mode,
    reducedMotion,
  } = useTheme()
  const themeClassName =
    useRuntimeStyleClass(
      'combobox-theme',
      resolveComboboxTheme(
        theme,
      ),
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
    ensureComboboxStylesheet,
    [],
  )

  useEffect(() => {
    requestedOpenRef.current =
      resolvedOpen
  }, [resolvedOpen])

  const setOpenState =
    useCallback(
      (next: boolean) => {
        if (
          requestedOpenRef.current ===
          next
        ) {
          return
        }

        requestedOpenRef.current =
          next

        if (!controlledOpen) {
          setUncontrolledOpen(
            next,
          )
        }

        onOpenChange?.(next)
      },
      [
        controlledOpen,
        onOpenChange,
      ],
    )

  const close =
    useCallback(() => {
      setOpenState(false)
      setActiveValue(null)
    }, [setOpenState])

  const setInputState =
    useCallback(
      (next: string) => {
        if (
          next ===
          resolvedInputValue
        ) {
          return
        }

        if (!controlledInput) {
          setUncontrolledInput(
            next,
          )
        }

        onInputValueChange?.(
          next,
        )
      },
      [
        controlledInput,
        onInputValueChange,
        resolvedInputValue,
      ],
    )

  const setValueState =
    useCallback(
      (
        next:
          ComboboxValue | null,
      ) => {
        if (
          next ===
          selectedValue
        ) {
          return
        }

        if (!controlledValue) {
          setUncontrolledValue(
            next,
          )
        }

        onValueChange?.(next)
      },
      [
        controlledValue,
        onValueChange,
        selectedValue,
      ],
    )

  const openCombobox =
    useCallback(
      (
        preferred?:
          ComboboxValue | null,
      ) => {
        if (disabled) return

        setActiveValue(
          preferred ??
          initialOptionActiveValue(
            filteredOptions,
            selectedValue,
          ),
        )
        setOpenState(true)
      },
      [
        disabled,
        filteredOptions,
        selectedValue,
        setOpenState,
      ],
    )

  const selectValue =
    useCallback(
      (
        nextValue:
          ComboboxValue,
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

        setValueState(
          nextValue,
        )
        setInputState(
          option.textValue,
        )
        close()
      },
      [
        close,
        options,
        setInputState,
        setValueState,
      ],
    )

  const setEnabledActiveValue =
    useCallback(
      (
        nextValue:
          ComboboxValue,
      ) => {
        const option =
          filteredOptions.find(
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
      [filteredOptions],
    )

  const previousSelectedValueRef =
    useRef(selectedValue)

  /*
   * External value changes update an uncontrolled input display.
   * Typing does not touch value, so the two states remain separate.
   */
  /* oxlint-disable react/set-state-in-effect */
  useEffect(() => {
    if (
      previousSelectedValueRef
        .current ===
      selectedValue
    ) {
      return
    }

    previousSelectedValueRef.current =
      selectedValue

    if (!controlledInput) {
      setUncontrolledInput(
        selected?.textValue ??
        '',
      )
    }
  }, [
    controlledInput,
    selected?.textValue,
    selectedValue,
  ])
  /* oxlint-enable react/set-state-in-effect */

  const hostProps:
    ViewProps<HTMLInputElement> = {
      ...viewProps,
      disabled,
      expanded:
        resolvedOpen,
      controls:
        listboxId,
    }
  const {
    elementRef:
      inputRef,
    className:
      inputClassName,
    inlineStyle:
      inputInlineStyle,
    resolved:
      inputResolved,
  } = useViewHost(
    hostProps,
  )

  useComboboxInteraction(
    inputRef,
    rootRef,
    listboxRef,
    resolvedOpen,
    close,
  )

  const anchorWidth =
    useAnchorWidth(
      inputRef,
      present,
    )

  useEffect(() => {
    if (
      !resolvedOpen ||
      resolvedActiveValue === null
    ) {
      return
    }

    const option =
      inputRef.current
        ?.ownerDocument
        .getElementById(
          optionDomId(
            listboxId,
            resolvedActiveValue,
          ),
        )

    option?.scrollIntoView?.({
      block: 'nearest',
    })
  }, [
    inputRef,
    listboxId,
    resolvedActiveValue,
    resolvedOpen,
  ])

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
    inputRef,
    listboxRef,
    present,
    placement,
    offsetValue,
    viewportPaddingValue,
  )

  const handleChange = (
    event:
      ChangeEvent<HTMLInputElement>,
  ) => {
    const next =
      event.currentTarget.value
    const nextEntries =
      filteredComboboxEntries(
        entries,
        next,
        filter,
      )
    const nextOptions =
      comboboxOptionDescriptors(
        nextEntries,
      )

    setInputState(next)
    setActiveValue(
      initialOptionActiveValue(
        nextOptions,
        selectedValue,
      ),
    )
    setOpenState(true)
  }

  const handleClick = (
    event:
      MouseEvent<HTMLInputElement>,
  ) => {
    viewProps.onClick?.(
      event,
    )

    if (
      event.defaultPrevented ||
      disabled ||
      resolvedOpen
    ) {
      return
    }

    openCombobox()
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
        filteredOptions,
        resolvedActiveValue,
        move,
      )

    if (next !== null) {
      setActiveValue(next)
    }
  }

  const handleKeyDown = (
    event:
      KeyboardEvent<HTMLInputElement>,
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
        'ArrowDown'
      ) {
        event.preventDefault()
        openCombobox(
          initialOptionActiveValue(
            filteredOptions,
            selectedValue,
          ),
        )
        return
      }

      if (
        event.key ===
        'ArrowUp'
      ) {
        event.preventDefault()
        openCombobox(
          moveOptionActiveValue(
            filteredOptions,
            null,
            'last',
          ),
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

    if (event.key === 'Enter') {
      if (
        resolvedActiveValue !==
        null
      ) {
        event.preventDefault()
        selectValue(
          resolvedActiveValue,
        )
      }
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }
  }

  const clearSelection =
    useCallback(() => {
      setValueState(null)
      setInputState('')
      setActiveValue(null)
      close()

      queueMicrotask(() => {
        inputRef.current
          ?.focus()
      })
    }, [
      close,
      inputRef,
      setInputState,
      setValueState,
    ])

  const handleClearPointerDown = (
    event:
      PointerEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
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

  const hasClear =
    clearable &&
    !disabled &&
    (
      resolvedInputValue
        .length > 0 ||
      selectedValue !== null
    )

  const listboxStyle:
    ComboboxListboxStyle = {
      ...listboxViewProps.style,
      ...placementStyle,
      '--weave-combobox-anchor-width':
        String(anchorWidth) +
        'px',
      visibility:
        positioned
          ? 'visible'
          : 'hidden',
    }

  const portal =
    present &&
    typeof document !==
      'undefined'
      ? createPortal(
          <ThemeProvider
            theme={theme}
            mode={mode}
          >
            <ComboboxContext.Provider
              value={contextValue}
            >
              <View
                {...listboxViewProps}
                ref={setListboxRef}
                id={listboxId}
                role="listbox"
                labelledBy={
                  inputId
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
                  'weave-combobox-listbox',
                  themeClassName,
                  listboxViewProps
                    .className,
                ].filter(Boolean).join(' ')}
                data={{
                  ...listboxViewProps
                    .data,
                  'weave-combobox-listbox':
                    '',
                  'weave-combobox-state':
                    visualState,
                  placement:
                    resolvedPlacement,
                  'weave-reduced-motion':
                    reducedMotion
                      ? 'reduce'
                      : undefined,
                }}
                style={listboxStyle}
              >
                {filteredEntries
                  .length === 0 ? (
                    <View
                      className="weave-combobox-empty"
                      data={{
                        'weave-combobox-empty':
                          '',
                      }}
                    >
                      <Text typo="body-small">
                        {emptyContent}
                      </Text>
                    </View>
                  ) : (
                    filteredEntries.map(
                      (entry) =>
                        cloneElement(
                          entry.node,
                          {
                            key:
                              entry
                                .descriptor
                                .value,
                          },
                        ),
                    )
                  )}
              </View>
            </ComboboxContext.Provider>
          </ThemeProvider>,
          document.body,
        )
      : null

  return (
    <>
      <span
        ref={rootRef}
        className={[
          'weave-combobox-root',
          themeClassName,
        ].filter(Boolean).join(' ')}
        data-weave-combobox-root=""
        data-weave-combobox-open={
          resolvedOpen
            ? 'true'
            : 'false'
        }
        data-weave-combobox-has-clear={
          hasClear
            ? 'true'
            : 'false'
        }
      >
        <input
          {...inputResolved.domProps}
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          value={
            resolvedInputValue
          }
          placeholder={
            placeholder
          }
          disabled={disabled}
          autoComplete="off"
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
          aria-autocomplete="list"
          data-weave-view=""
          data-weave-combobox=""
          data-weave-layout={
            inputResolved.layout
          }
          className={[
            'weave-combobox',
            inputClassName,
          ].filter(Boolean).join(' ')}
          style={inputInlineStyle}
          onChange={
            handleChange
          }
          onClick={handleClick}
          onKeyDown={
            handleKeyDown
          }
        />

        <span
          className="weave-combobox__actions"
          aria-hidden={
            disabled
              ? true
              : undefined
          }
        >
          {hasClear ? (
            <button
              type="button"
              className="weave-combobox__action"
              aria-label={
                clearLabel
              }
              onPointerDown={
                handleClearPointerDown
              }
              onFocus={close}
              onClick={
                clearSelection
              }
            >
              <Icon
                svg={
                  clearIcon as IconSvg
                }
                size="small"
                stroke="regular"
                viewProps={{
                  className:
                    'weave-combobox__action-icon',
                  'aria-hidden':
                    true,
                  pointerEvents:
                    'none',
                }}
              />
            </button>
          ) : null}

          <Icon
            svg={
              chevronIcon as IconSvg
            }
            size="small"
            stroke="regular"
            viewProps={{
              className:
                'weave-combobox__chevron',
              'aria-hidden': true,
              pointerEvents:
                'none',
            }}
          />
        </span>
      </span>

      {portal}
    </>
  )
}
