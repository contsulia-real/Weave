import {
  useState,
} from 'react'
import {
  IconBell,
  IconHome,
  IconSettings,
  IconUser,
  IconWifi,
} from '@tabler/icons-react'
import {
  List,
  Switch,
  Text,
  View,
} from '../index'
import {
  PlaygroundSection,
} from './PlaygroundSection'

export function ListPlayground() {
  const [
    selected,
    setSelected,
  ] = useState<string | null>(
    'home',
  )
  const [
    multiple,
    setMultiple,
  ] = useState<
    readonly string[]
  >([
    'alerts',
  ])
  const [
    wifi,
    setWifi,
  ] = useState(true)

  const virtualItems =
    Array.from(
      {
        length: 100,
      },
      (_, index) => ({
        id:
          `virtual-${index}`,
        text:
          `Virtual row ${index + 1}`,
        secondaryText:
          `Only the visible window is mounted · #${index + 1}`,
      }),
    )

  return (
    <PlaygroundSection
      title="List / ListItem"
      description="List 管理数据、选择、方向键、焦点与虚拟化；ListItem 只表达单项内容和状态。"
    >
      <View
        layout="flex"
        direction="column"
        gap={1.5}
      >
        <View
          layout="flex"
          direction="column"
          gap={0.5}
        >
          <Text typo="label-medium">
            Data-driven · single selection
          </Text>

          <List
            selection="single"
            selected={selected}
            onSelect={setSelected}
            items={[
              {
                id: 'home',
                text: 'Home',
                icon: IconHome,
              },
              {
                id: 'profile',
                text: 'Profile',
                secondaryText:
                  'Identity and personal details',
                icon: IconUser,
              },
              {
                id: 'settings',
                text: 'Settings',
                secondaryText:
                  'Application preferences',
                icon: IconSettings,
              },
              {
                id: 'disabled',
                text: 'Unavailable',
                secondaryText:
                  'Disabled rows are skipped by keyboard navigation',
                icon: IconBell,
                disabled: true,
              },
            ]}
            viewProps={{
              maxWidth: 34,
            }}
          />

          <Text
            typo="body-small"
            color="secondary"
          >
            selected: {selected ?? 'none'}
          </Text>
        </View>

        <View
          layout="flex"
          direction="column"
          gap={0.5}
        >
          <Text typo="label-medium">
            Trailing control · noDividers
          </Text>

          <List
            noDividers
            items={[
              {
                id: 'wifi',
                text: 'Wi-Fi',
                secondaryText:
                  'Nested Switch handles its own interaction',
                icon: IconWifi,
                trailing:
                  <Switch
                    checked={wifi}
                    onChange={setWifi}
                    size="small"
                  />,
              },
              {
                id: 'notifications',
                text: 'Notifications',
                secondaryText:
                  'Interactive trailing content does not trigger the row',
                icon: IconBell,
                trailing:
                  <Switch
                    defaultChecked
                    size="small"
                  />,
              },
            ]}
            viewProps={{
              maxWidth: 34,
            }}
          />
        </View>

        <View
          layout="flex"
          direction="column"
          gap={0.5}
        >
          <Text typo="label-medium">
            Multiple selection
          </Text>

          <List
            selection="multiple"
            selected={multiple}
            onSelect={setMultiple}
            items={[
              {
                id: 'alerts',
                text: 'Alerts',
                icon: IconBell,
              },
              {
                id: 'profile',
                text: 'Profile',
                icon: IconUser,
              },
              {
                id: 'settings',
                text: 'Settings',
                icon: IconSettings,
              },
            ]}
            viewProps={{
              maxWidth: 34,
            }}
          />

          <Text
            typo="body-small"
            color="secondary"
          >
            selected: {
              multiple.length === 0
                ? 'none'
                : multiple.join(', ')
            }
          </Text>
        </View>

        <View
          layout="flex"
          direction="column"
          gap={0.5}
        >
          <Text typo="label-medium">
            Virtualized · 100 rows
          </Text>

          <Text
            typo="body-small"
            color="secondary"
          >
            List 自己维护窗口化渲染；滚动仍然使用 viewProps + Weave Scrollbar。
          </Text>

          <List
            items={virtualItems}
            virtualized
            gap={0.25}
            viewProps={{
              height: 16,
              overflow: 'auto',
              border: 0.0625,
              borderColor:
                'outline',
              radius: 'medium',
              padding: 0.5,
              scrollbar: {
                size: 'small',
              },
            }}
          />
        </View>
      </View>
    </PlaygroundSection>
  )
}
