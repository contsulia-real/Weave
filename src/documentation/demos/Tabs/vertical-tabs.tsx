import { Tab, TabList, TabPanel, Tabs } from '../../../index'

export default function TabsVerticalTabsDemo() {
  return (
    <Tabs defaultValue="general" orientation="vertical">
      <TabList>
        <Tab value="general">General</Tab>
        <Tab value="privacy">Privacy</Tab>
      </TabList>
      <TabPanel value="general">General settings</TabPanel>
      <TabPanel value="privacy">Privacy settings</TabPanel>
    </Tabs>
  )
}
