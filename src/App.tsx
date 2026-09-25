import { View } from './index'

function App() {
  return (
    <View
      layout="grid"
      minHeight="100vh"
      align="center"
    >
      <View
        width="fit"
        padding={2}
        gap={1}
        layout="flex"
        direction="column"
        radius="large"
        background="surface"
        shadow="medium"
      >
        <p className="eyebrow">Weave playground</p>
        <h1>Weave</h1>
        <p>React UI framework development surface.</p>
      </View>
    </View>
  )
}

export default App
