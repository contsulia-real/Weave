# Weave

Weave is a browser-native React UI framework for the Web. It provides semantic React components, theme tokens, responsive props and motion orchestration while keeping DOM and CSS as the single rendering path.

The authoritative framework design specification is [Weave UI.md](./Weave%20UI.md).

## Status

Weave is currently an **alpha, private development package**. The repository package remains `private: true` intentionally, so it cannot be published accidentally. The current development version is `0.1.0-alpha.0`.

No open-source license has been selected yet; the package is therefore marked `UNLICENSED`.

## Architecture

Weave does not implement a custom React renderer. Components ultimately render ordinary semantic DOM and CSS, so browser layout, text rendering, forms, focus, scrolling, accessibility and compositing remain browser-native.

`View` is the public general-purpose primitive. Weave's own DOM-hosting components reuse the same common host capabilities through the internal `useViewHost` mechanism rather than requiring extra `<View>` wrappers.

The main layers are:

- public components and semantic props;
- internal ViewHost, motion, presence, responsive and interaction helpers;
- theme and component-theme resolution;
- CSS variables, framework stylesheets and runtime classes;
- native React DOM and browser behavior.

## Public API

### Foundation and layout

`View`, `Flex`, `Row`, `Column`, `Grid`, `Stack`, `Absolute`, `Presence`.

### Content and actions

`Text`, `Image`, `Icon`, `Avatar`, `Divider`, `Link`, `Badge`, `Button`, `Card`.

### Forms and status

`Input`, `Select`, `SelectOption`, `Combobox`, `ComboboxOption`, `Slider`, `Switch`, `Radio`, `Checkbox`, `Progress`, `Skeleton`.

### Composite UI

`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionPanel`, `ToolTip`, `Popover`, `Dialog`, `Menu`, `MenuItem`, `Tabs`, `TabList`, `Tab`, `TabPanel`, `Snack`, `SnackProvider`, `useSnack`, `List`, `ListItem`.

### Theme and application

`ThemeProvider`, `useTheme`, `createTheme`, `defaultTheme`, `createRoot`.

The root package also exports the public prop, motion and theme customization types, including component-level theme interfaces such as `ButtonTheme`, `CardTheme`, `AvatarTheme`, `DividerTheme`, `IconTheme`, `SkeletonTheme`, `SelectTheme`, `ComboboxTheme`, `SliderTheme`, `SwitchTheme`, `AccordionTheme`, `ToolTipTheme`, `PopoverTheme`, `MenuTheme`, `SnackTheme` and `ThemeComponents`.

## Basic usage

```tsx
import {
  Button,
  Column,
  Text,
  ThemeProvider,
  createRoot,
} from 'weave'

const root = createRoot(
  document.getElementById('app')!,
)

root.render(
  <ThemeProvider mode="system">
    <Column gap={1} padding={2}>
      <Text typo="title-large">
        Hello from Weave
      </Text>

      <Button
        text="Continue"
        variant="primary"
      />
    </Column>
  </ThemeProvider>,
)
```

`createRoot(container)` is a thin wrapper around the normal React DOM root. Weave does not maintain a Canvas renderer or alternate rendering fallback.

## Theme customization

```tsx
import {
  Button,
  ThemeProvider,
  createTheme,
} from 'weave'

const theme = createTheme({
  components: {
    Button: {
      variants: {
        primary: {
          background: 'primary',
          color: 'onPrimary',
        },
      },
    },
  },
})

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <Button
        text="Themed action"
        variant="primary"
      />
    </ThemeProvider>
  )
}
```

Theme definitions support tokens, component themes, dynamic breakpoints, light/dark mode overrides and motion configuration. Runtime custom breakpoint thresholds come from `theme.breakpoints`; projects that want typed custom breakpoint prop names register those names through `Weave.BreakpointRegistry`. Custom color-token names can likewise be registered through `Weave.ColorTokenRegistry` for editor completion while their values remain owned by the active theme. See the specification for the complete contract.

## Playground

The Vite application is the development playground for the framework. It dogfoods the public Weave API and contains interactive examples for layout, responsive behavior, motion, masks, form controls, Select, Badge, ToolTip, Popover, Menu with nested submenus, Snack, List, Scrollbar and other implemented capabilities.

```bash
pnpm install
pnpm dev
```

Node.js: `^22.22.2 || ^24.15.0 || >=26`.

The library entry is `src/index.ts`; production output is generated under `dist/`.

## Verification

```bash
pnpm format:check
pnpm typecheck
pnpm lint
pnpm test
pnpm test:browser --project=firefox
pnpm build
```

`pnpm test` is self-contained and does not require a prior build. The Firefox browser regression suite exercises real scrolling, anchored overlay repositioning and the framework Scrollbar, including protection against Firefox scroll-linked positioning warnings. `pnpm build` emits only declarations reachable from the public entry and verifies the built runtime, public types, packed npm file set and ReactDOM externalization. `npm pack` runs the build automatically through `prepack`.

## Repository

Development repository: `contsulia-real/Weave` on GitHub.

Until the package is deliberately made publishable and a license is selected, treat the repository artifacts as private development output rather than a published npm release.
