import { List, ListItem } from '../../../index'

export default function ListHorizontalListDemo() {
  return (
    <List
      orientation="horizontal"
      selection="single"
      defaultSelected="overview"
      gap={0.5}
      noDividers
      singleLine
      viewProps={{ width: 'fill', overflow: 'auto' }}
    >
      <ListItem id="overview">Overview</ListItem>
      <ListItem id="activity">Recent activity with a deliberately long label</ListItem>
      <ListItem id="settings">Settings</ListItem>
    </List>
  )
}
