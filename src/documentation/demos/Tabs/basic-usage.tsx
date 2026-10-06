import { Tab, TabList, TabPanel, Tabs } from '../../../index'

export default function TabsBasicUsageDemo() {
  return (
    <Tabs defaultValue="overview" indicatorThickness={2}>
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="details">Details</Tab>
      </TabList>
      <TabPanel value="overview">Overview panel.</TabPanel>
      <TabPanel value="details">Details panel.</TabPanel>
    </Tabs>
  )
}
