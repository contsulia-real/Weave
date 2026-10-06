import { Tab, TabList, TabPanel, Tabs } from '../../../index'

export default function TabsDisabledTabDemo() {
  return (
    <Tabs>
      <TabList>
        <Tab value="general">General</Tab>
        <Tab value="advanced" disabled>
          Advanced
        </Tab>
        <Tab value="about">About</Tab>
      </TabList>
      <TabPanel value="general">General settings</TabPanel>
      <TabPanel value="advanced">Advanced settings</TabPanel>
      <TabPanel value="about">About this app</TabPanel>
    </Tabs>
  )
}
