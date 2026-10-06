import { List, ListItem } from '../../../index'

export default function ListSingleSelectionDemo() {
  return (
    <List orientation="vertical" selection="single" defaultSelected="inbox">
      <ListItem id="inbox">Inbox</ListItem>
      <ListItem id="drafts">Drafts</ListItem>
      <ListItem id="archive">Archive</ListItem>
    </List>
  )
}
