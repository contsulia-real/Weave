# Weave

Weave is a browser-native React UI framework for the Web. It provides semantic React components, theme tokens, responsive props and motion orchestration while keeping DOM and CSS as the single rendering path.

The authoritative framework design specification is [Weave UI.md](./Weave%20UI.md).

## Status

Weave is currently an **alpha public package targeting JSR**. npm publication remains intentionally disabled with `private: true`; the current version is `0.1.0-alpha.3`.

Weave is licensed under the MIT License. See [LICENSE](./LICENSE).

## Install

```bash
pnpm add jsr:@contsulia/weave
```

### Optional packages

Weave's `Icon` accepts any compatible icon component or SVG. The documentation examples use Tabler Icons; install it only if you want to use those icons:

```bash
pnpm add @tabler/icons-react
```

Weave's `Code` component uses Shiki for syntax highlighting. Install Shiki when using `Code`:

```bash
pnpm add shiki
```

## Architecture

Weave does not implement a custom React renderer. Components ultimately render ordinary semantic DOM and CSS, so browser layout, text rendering, forms, focus, scrolling, accessibility and compositing remain browser-native.

`View` is a public construction primitive for component authors and internal infrastructure, not a normal application-level UI component. Application code, Documentation and examples must use existing semantic components and the formal layout components instead of rendering `View` directly. Weave's own DOM-hosting components reuse the same common host capabilities through the internal `useViewHost` mechanism rather than requiring extra `<View>` wrappers.

The main layers are:

- public components and semantic props;
- internal ViewHost, motion, presence, responsive and interaction helpers;
- theme and component-theme resolution;
- CSS variables, framework stylesheets and runtime classes;
- native React DOM and browser behavior.

## Public API

Runtime components are published through component subpaths such as `@contsulia/weave/components/Button` and `@contsulia/weave/components/Column`. The package root `@contsulia/weave` exposes application/theme runtime APIs (`createRoot`, `hydrateRoot`, `ThemeProvider`, `useTheme`, `createTheme`, `createThemeFromColorSeed`, `defaultTheme`) plus the public type surface.

### Foundation and layout

`View`, `Flex`, `Row`, `Column`, `Grid`, `Stack`, `Absolute`, `SplitBox`, `SplitBoxPane`, `Presence`.

### Content and actions

`Text`, `Code`, `Image`, `Icon`, `Avatar`, `Divider`, `Link`, `Badge`, `Button`, `Card`, `AppBar`.

### Forms and status

`Input`, `Select`, `SelectOption`, `Combobox`, `ComboboxOption`, `Slider`, `RangeSlider`, `Switch`, `Radio`, `Checkbox`, `Progress`, `Skeleton`.

### Composite UI

`Form`, `FormField`, `FormLabel`, `FormDescription`, `FormError`, `FormFieldset`, `FormLegend`, `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionPanel`, `ToolTip`, `Popover`, `Dialog`, `Drawer`, `Menu`, `MenuItem`, `Tabs`, `TabList`, `Tab`, `TabPanel`, `Snack`, `SnackProvider`, `useSnack`, `List`, `ListItem`.

### Theme and application

`ThemeProvider`, `useTheme`, `createTheme`, `createThemeFromColorSeed`, `defaultTheme`, `createRoot`, `hydrateRoot`.

The root package also exports the public prop, motion and theme customization types, including component-level theme interfaces such as `ButtonTheme`, `CardTheme`, `AppBarTheme`, `TableTheme`, `AvatarTheme`, `DividerTheme`, `IconTheme`, `SkeletonTheme`, `SelectTheme`, `ComboboxTheme`, `SliderTheme`, `SwitchTheme`, `SplitBoxTheme`, `DrawerTheme`, `FormTheme`, `AccordionTheme`, `ToolTipTheme`, `PopoverTheme`, `MenuTheme`, `SnackTheme` and `ThemeComponents`.

## Basic usage

```tsx
import { ThemeProvider, createRoot } from '@contsulia/weave'
import { Button } from '@contsulia/weave/components/Button'
import { Column } from '@contsulia/weave/components/Column'
import { Text } from '@contsulia/weave/components/Text'

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

`createRoot(container)` is a thin wrapper around the normal React DOM root. `hydrateRoot(container, node)` hydrates server-rendered Weave markup in place using React DOM hydration. Both APIs bind Weave runtime DOM work to the container's own `Document`, so accessible secondary documents such as same-origin iframes receive their own stylesheets, media-query subscriptions, portals, observers, and viewport behavior. Weave does not maintain a Canvas renderer or alternate rendering fallback.

## Theme customization

```tsx
import { ThemeProvider, createTheme } from '@contsulia/weave'
import { Button } from '@contsulia/weave/components/Button'

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

Theme definitions support tokens, component themes, dynamic breakpoints, light/dark mode overrides and motion configuration. Runtime custom breakpoint thresholds come from `theme.breakpoints`; projects that want typed custom breakpoint prop names augment `BreakpointRegistry` from `@contsulia/weave/registry`. Custom color-token names can likewise augment `ColorTokenRegistry` from that module for editor completion while their values remain owned by the active theme. See the specification for the complete contract.

## Documentation

The Vite application hosts the in-repository Weave documentation surface under `/docs/*` as a single-page route. Every visible part of the Documentation UI is 100% dogfooded through public Weave components and Theme: shell, navigation, search input, theme chooser, language chooser, content layout and future examples. Documentation must not introduce raw DOM visual replacements, documentation-only visual CSS, or third-party UI components where Weave already provides the capability. React state, browser History routing, i18n and data helpers remain non-visual infrastructure. Documentation i18n uses `i18next` + `react-i18next` as development-only dependencies; they are not Weave runtime dependencies.

```bash
pnpm install
pnpm dev
```

Node.js: `^22.22.2 || ^24.15.0 || >=26`.

The root runtime entry is `src/package.ts`. Public component/type metadata is sourced from `src/index.ts`, while each runtime component is built from its own `src/components/*` entry. Production output is generated under `dist/`.

## AI and LLM tooling

Weave exposes a generated AI-facing layer without introducing a second API or Theme source of truth. `llms.txt` and `DESIGN.md` summarize the framework, while `ai/generated/*.json` contains machine-readable component contracts, real Documentation examples, Theme data and framework/package metadata derived from the existing sources.

```bash
pnpm ai:generate
pnpm ai:metadata:check
pnpm ai:check -- path/to/file.tsx
pnpm ai:mcp
pnpm ai:mcp:verify
pnpm ai:benchmark:check
```

`ai/guidance.json` only adds component-selection intent that cannot be derived from TypeScript types alone. The MCP server reads the generated metadata, and the semantic checker adds Weave-specific diagnostics such as package-correct imports, the application-level `View` boundary, incompatible `Input` props and fixed-axis layout guidance.

## JSR publishing

```bash
pnpm verify:jsr
pnpm publish:jsr
```

The GitHub Actions `Publish JSR` workflow uses JSR's OIDC publishing path and performs a dry run before publishing. Before the first CI publish, create `@contsulia/weave` on JSR and link it to `contsulia-real/Weave` in the package settings.

## Verification

```bash
pnpm format:check
pnpm typecheck
pnpm lint
pnpm build
```

The automated test suite was removed by project decision on 2026-10-01 after false-positive validation around interactive Drawer behavior created unjustified confidence in incorrect UI behavior. Current repository verification is formatting, static type checking, linting, production build, declaration pruning and package verification. Interactive UI behavior must be checked directly in documentation examples rather than inferred from deleted synthetic tests. `pnpm build` emits only declarations reachable from the public entry and verifies the built runtime, public types, packed npm file set and ReactDOM externalization. `npm pack` runs the build automatically through `prepack`.

## Repository

Development repository: `contsulia-real/Weave` on GitHub.

Public releases target JSR as `@contsulia/weave`; npm publication remains disabled by the repository's `private: true` guard.
