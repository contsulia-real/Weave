import { Tab, TabList, TabPanel, Tabs } from '../../../index'

export default function TabsPillTabsDemo() {
  return (
    <Tabs defaultValue="day" variant="pill" indicatorThickness={3}>
      <TabList>
        <Tab value="day">Day</Tab>
        <Tab value="week">Week</Tab>
        <Tab value="month">Month</Tab>
      </TabList>
      <TabPanel value="day">Daily view</TabPanel>
      <TabPanel value="week">Weekly view</TabPanel>
      <TabPanel value="month">Monthly view</TabPanel>
    </Tabs>
  )
}
