import { Tab, TabList, TabPanel, Tabs } from '../../../index'

export default function TabsManualActivationDemo() {
  return (
    <Tabs defaultValue="preview" activation="manual">
      <TabList>
        <Tab value="preview">Preview</Tab>
        <Tab value="source">Source</Tab>
      </TabList>
      <TabPanel value="preview">Preview panel</TabPanel>
      <TabPanel value="source">Source panel</TabPanel>
    </Tabs>
  )
}
