import { IconX } from '@tabler/icons-react'
import type { ChipProps } from '../core/chip-types'
import { ensureButtonStylesheet } from '../renderers/dom/button-stylesheet'
import { ensureChipStylesheet } from '../renderers/dom/chip-stylesheet'
import { resolveButtonTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { useTheme } from '../theme/theme-context'
import { Button } from './Button'
import { useControllableBoolean } from './internal/use-controllable-boolean'
import { Row } from './Row'

export function Chip({
  text,
  selectable = false,
  size = 'small',
  pill = false,
  selected,
  defaultSelected,
  onSelectedChange,
  onRemove,
  removeLabel,
  disabled = false,
  viewProps = {},
}: ChipProps): import('react').JSX.Element {
  const { value, request } = useControllableBoolean(
    selected,
    defaultSelected ?? false,
    onSelectedChange,
  )
  const canSelect =
    selectable ||
    selected !== undefined ||
    defaultSelected !== undefined ||
    onSelectedChange !== undefined
  const variant = canSelect && value ? 'primary' : 'tertiary'
  const { theme } = useTheme()
  const buttonThemeClass = useRuntimeStyleClass('button-theme', resolveButtonTheme(theme))

  useStaticStylesheet(ensureButtonStylesheet)
  useStaticStylesheet(ensureChipStylesheet)

  return (
    <Row
      {...viewProps}
      role="group"
      label={text}
      width={viewProps.width ?? 'fit'}
      gap={0}
      className={['weave-chip', buttonThemeClass, viewProps.className].filter(Boolean).join(' ')}
      data={{
        ...viewProps.data,
        'weave-chip': '',
        'weave-chip-removable': onRemove === undefined ? 'false' : 'true',
        'weave-chip-pill': pill ? 'true' : 'false',
      }}
    >
      {canSelect ? (
        <Button
          text={text}
          variant={variant}
          size={size}
          pressed={value}
          disabled={disabled}
          viewProps={{ onClick: () => request(!value) }}
        />
      ) : (
        <span
          data-weave-view=""
          data-weave-chip-label=""
          className={`weave-button weave-chip__label weave-button--${variant} weave-button--${size}`}
        >
          <span className="weave-button__content">{text}</span>
        </span>
      )}
      {onRemove === undefined ? null : (
        <Button
          icon={IconX}
          variant={variant}
          size={size}
          disabled={disabled}
          viewProps={{
            label: removeLabel ?? `Remove ${text}`,
            onClick: onRemove,
          }}
        />
      )}
    </Row>
  )
}
