import {
  Text,
  View,
} from './index'
import {
  FoundationPlayground,
} from './playground/FoundationPlayground'
import {
  FormPlayground,
} from './playground/FormPlayground'
import {
  LayoutPlayground,
} from './playground/LayoutPlayground'
import {
  ListPlayground,
} from './playground/ListPlayground'
import {
  SnackPlayground,
} from './playground/SnackPlayground'

function App() {
  return (
    <View
      layout="grid"
      height="100vh"
      overflow="auto"
      align="start"
      padding={2}
    >
      <View
        width="fill"
        maxWidth={64}
        justifySelf="center"
        padding={2}
        gap={2}
        layout="flex"
        direction="column"
        radius="large"
        background="surface"
        shadow="medium"
      >
        <View
          layout="flex"
          direction="column"
          gap={0.5}
        >
          <Text
            typo="label-small"
            color="secondary"
            case="uppercase"
            letterSpacing="0.08em"
          >
            Weave playground
          </Text>

          <Text
            typo="display-large"
            viewProps={{
              role: 'heading',
              level: 1,
            }}
          >
            Weave
          </Text>

          <Text
            typo="body-medium"
            color="secondary"
            md={{
              typo: 'body-large',
              color: 'primary',
            }}
          >
            React UI framework development
            surface.
          </Text>
        </View>

        <FoundationPlayground />
        <SnackPlayground />
        <ListPlayground />
        <FormPlayground />
        <LayoutPlayground />
      </View>
    </View>
  )
}

export default App
