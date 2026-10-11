import { IconX } from '@tabler/icons-react'
import type { ChipProps } from '../core/chip-types'
import { ensureChipStylesheet } from '../renderers/dom/chip-stylesheet'
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { Button } from './Button'
import { useControllableBoolean } from './internal/use-controllable-boolean'
import { Row } from './Row'

export function Chip({
  text,
  selected,
  defaultSelected = false,
  onSelectedChange,
  onRemove,
  removeLabel,
  disabled = false,
  viewProps = {},
}: ChipProps): import('react').JSX.Element {
  const { value, request } = useControllableBoolean(selected, defaultSelected, onSelectedChange)
  const variant = value ? 'primary' : 'tertiary'

  useStaticStylesheet(ensureChipStylesheet)

  return (
    <Row
      {...viewProps}
      role="group"
      label={text}
      width={viewProps.width ?? 'fit'}
      gap={0}
      className={['weave-chip', viewProps.className].filter(Boolean).join(' ')}
      data={{
        ...viewProps.data,
        'weave-chip': '',
        'weave-chip-removable': onRemove === undefined ? 'false' : 'true',
      }}
    >
      <Button
        text={text}
        variant={variant}
        size="small"
        pressed={value}
        disabled={disabled}
        viewProps={{ onClick: () => request(!value) }}
      />
      {onRemove === undefined ? null : (
        <Button
          icon={IconX}
          variant={variant}
          size="small"
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
