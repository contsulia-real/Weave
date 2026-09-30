import type { TabPanelProps } from '../core/tabs-types'
import { useTabsContext } from './internal/tabs-context'
import { View } from './View'

export function TabPanel({ value, children, viewProps = {} }: TabPanelProps) {
  const context = useTabsContext('TabPanel')
  const selected = context.value === value

  return (
    <View
      {...viewProps}
      id={context.panelId(value)}
      role="tabpanel"
      aria-labelledby={context.tabId(value)}
      hidden={!selected}
      tabIndex={viewProps.tabIndex ?? 0}
      className={['weave-tab-panel', viewProps.className].filter(Boolean).join(' ')}
      data={{
        ...viewProps.data,
        'weave-tab-panel': '',
        'weave-tab-panel-value': value,
        'weave-tab-panel-selected': selected ? 'true' : 'false',
      }}
    >
      {children}
    </View>
  )
}
