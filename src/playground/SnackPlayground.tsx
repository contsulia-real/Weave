import { IconAlertTriangle, IconBell, IconCheck, IconTrash } from '@tabler/icons-react'
import { useRef, useState } from 'react'
import {
  Button,
  Column,
  Row,
  type SnackPlacement,
  SnackProvider,
  Text,
  useSnack,
  View,
} from '../index'
import { PlaygroundSection } from './PlaygroundSection'

const snackPlacements: readonly SnackPlacement[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]

function PlacementPicker({
  value,
  onChange,
}: {
  value: SnackPlacement
  onChange: (placement: SnackPlacement) => void
}) {
  return (
    <Column gap={0.5}>
      <Text typo="label-small" color="secondary">
        Placement
      </Text>

      <Row gap={0.5} wrap>
        {snackPlacements.map((placement) => (
          <Button
            key={placement}
            text={placement}
            size="small"
            variant={value === placement ? 'primary' : 'secondary'}
            viewProps={{
              onClick: () => {
                onChange(placement)
              },
            }}
          />
        ))}
      </Row>
    </Column>
  )
}

function SnackTriggerButtons({ placement }: { placement: SnackPlacement }) {
  const snack = useSnack()

  return (
    <Row gap={0.75} wrap>
      <Button
        text="Success snack"
        variant="secondary"
        viewProps={{
          onClick: () => {
            snack.show({
              text: 'Changes saved',
              icon: IconCheck,
              variant: 'success',
              placement,
              duration: 3200,
              progress: true,
            })
          },
        }}
      />

      <Button
        text="Warning snack"
        variant="secondary"
        viewProps={{
          onClick: () => {
            snack.show({
              text: 'Connection is unstable',
              icon: IconAlertTriangle,
              variant: 'warning',
              placement,
              duration: 4200,
            })
          },
        }}
      />

      <Button
        text="Action snack"
        variant="secondary"
        viewProps={{
          onClick: () => {
            snack.show({
              text: 'File deleted',
              icon: IconTrash,
              variant: 'danger',
              action: 'Undo',
              onAction: () => {},
              placement,
              duration: 5000,
            })
          },
        }}
      />

      <Button
        text="FIFO ×4"
        variant="secondary"
        viewProps={{
          onClick: () => {
            snack.show({
              text: 'First notification',
              icon: IconCheck,
              variant: 'success',
              placement,
              duration: 5000,
            })
            snack.show({
              text: 'Second notification',
              icon: IconBell,
              variant: 'info',
              placement,
              duration: 5000,
            })
            snack.show({
              text: 'Third notification',
              icon: IconAlertTriangle,
              variant: 'warning',
              placement,
              duration: 5000,
            })
            snack.show({
              text: 'Fourth notification',
              icon: IconTrash,
              variant: 'danger',
              placement,
              duration: 5000,
            })
          },
        }}
      />
    </Row>
  )
}

function ScopedSnackControls() {
  const [placement, setPlacement] = useState<SnackPlacement>('bottom-right')

  return (
    <Column gap={0.75} width="fill">
      <Text typo="label-medium">Scoped provider</Text>

      <Text typo="body-small" color="secondary">
        这些 Snack 只会出现在下面这个 panel 内。
      </Text>

      <PlacementPicker value={placement} onChange={setPlacement} />

      <SnackTriggerButtons placement={placement} />
    </Column>
  )
}

function ScopedSnackExample() {
  const hostRef = useRef<HTMLDivElement>(null)

  return (
    <View
      ref={hostRef}
      width="fill"
      minHeight={18}
      padding={1.25}
      border={0.0625}
      borderColor="outline"
      radius="large"
      background="surfaceHover"
      overflow="hidden"
    >
      <SnackProvider container={hostRef}>
        <ScopedSnackControls />
      </SnackProvider>
    </View>
  )
}

export function SnackPlayground() {
  const [placement, setPlacement] = useState<SnackPlacement>('bottom-right')

  return (
    <PlaygroundSection
      title="Snack"
      description="页面级与容器级 Snack 使用同一套 API。FIFO、placement、可选 lifetime Progress 和挂载作用域都由各自的 SnackProvider 管理。"
    >
      <Column gap={1.25}>
        <Column gap={0.75}>
          <Text typo="label-medium">Viewport provider</Text>

          <Text typo="body-small" color="secondary">
            使用 App 根部的 SnackProvider，region 挂到 document.body，placement 相对 viewport。
          </Text>

          <PlacementPicker value={placement} onChange={setPlacement} />

          <SnackTriggerButtons placement={placement} />
        </Column>

        <View height={0.0625} background="outline" width="fill" />

        <Column gap={0.75}>
          <Text typo="label-medium">Container-scoped provider</Text>

          <Text typo="body-small" color="secondary">
            下面的 SnackProvider 指定了 container ref，所有 placement 都相对这个 panel，而不是整页。
          </Text>

          <ScopedSnackExample />
        </Column>
      </Column>
    </PlaygroundSection>
  )
}
