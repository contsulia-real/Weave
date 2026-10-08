import { List } from '../../../index'

const items = Array.from({ length: 100 }, (_, index) => ({
  id: `item-${index + 1}`,
  text: `Item ${index + 1}`,
  secondaryText: `Row ${index + 1} of 100`,
}))

export default function ListVirtualizedListDemo() {
  return (
    <List
      items={items}
      virtualized
      selection="single"
      defaultSelected="item-1"
      viewProps={{ height: 192, width: 'fill', overflow: 'auto' }}
    />
  )
}
