import { List, ListItem } from '../../../index'

export default function ListBasicUsageDemo() {
  return (
    <List orientation="vertical" selection="none">
      <ListItem id="one">First item</ListItem>
      <ListItem id="two">Second item</ListItem>
      <ListItem id="three">Third item</ListItem>
    </List>
  )
}
