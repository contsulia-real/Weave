import { useRef, useState } from 'react'
import {
  Button,
  Column,
  createRoot,
  Dialog,
  List,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
  ThemeProvider,
} from '../../src'

export function AuditBrowserFixture() {
  const [modalOpen, setModalOpen] = useState(false)
  const modalFocusRef = useRef<HTMLButtonElement>(null)
  const virtualItems = Array.from({ length: 100 }, (_, index) => ({
    id: `browser-virtual-${index}`,
    text: `Browser virtual row ${index + 1}`,
  }))

  return (
    <ThemeProvider mode="light">
      <Column gap={2}>
        <Button
          text="Open browser modal"
          viewProps={{
            data: { testid: 'browser-modal-open' },
            onClick: () => setModalOpen(true),
          }}
        />

        <Dialog modal open={modalOpen} onOpenChange={setModalOpen} initialFocus={modalFocusRef}>
          <Column gap={0.5}>
            <Text>Browser modal dialog</Text>
            <Button
              text="Browser modal cancel"
              viewProps={{
                ref: modalFocusRef,
                onClick: () => setModalOpen(false),
              }}
            />
          </Column>
        </Dialog>

        <List
          selection="single"
          items={virtualItems}
          virtualized
          viewProps={{
            height: 12,
            overflow: 'auto',
            data: { testid: 'browser-virtual-list' },
          }}
        />

        <Tabs viewProps={{ data: { testid: 'browser-tabs' } }}>
          <TabList>
            <Tab value="first">Browser first tab</Tab>
            <Tab value="second">Browser second tab</Tab>
          </TabList>
          <TabPanel value="first">Browser first panel</TabPanel>
          <TabPanel value="second">Browser second panel</TabPanel>
        </Tabs>
      </Column>
    </ThemeProvider>
  )
}

const container = document.getElementById('root')
if (container === null) {
  throw new Error('Audit browser fixture root is missing')
}

createRoot(container).render(<AuditBrowserFixture />)
