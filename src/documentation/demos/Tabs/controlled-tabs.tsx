import { useState } from 'react'
import { Tab, TabList, TabPanel, Tabs, Text } from '../../../index'

export default function TabsControlledTabsDemo() {
  const [value, setValue] = useState('overview')

  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="details">Details</Tab>
      </TabList>
      <TabPanel value="overview">
        <Text>Selected: {value}</Text>
      </TabPanel>
      <TabPanel value="details">
        <Text>Selected: {value}</Text>
      </TabPanel>
    </Tabs>
  )
}
