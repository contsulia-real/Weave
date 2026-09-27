# Weave

Weave is a React UI framework for the Web.

The current framework design specification lives in [Weave UI.md](./Weave%20UI.md).

## Usage

```tsx
import { View, Text, createRoot } from 'weave'

const root = createRoot(
  document.getElementById('app')!,
)

root.render(
  <View padding={1}>
    <Text>Hello from Weave</Text>
  </View>,
)
```

Weave renders ordinary React DOM and CSS. Layout, text rendering, events, form controls, focus, scrolling, animation and accessibility remain browser-native.

`createRoot(container)` creates a normal React DOM root. Weave does not maintain an alternate Canvas renderer or rendering fallback.

## Development

Node.js: `^22.22.2 || ^24.15.0 || >=26`

```bash
pnpm install
pnpm dev
```

The Vite page is a local development playground. The published library entry is `src/index.ts`.

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Status

The component system is implemented with real DOM elements and CSS, using the browser as the single rendering and interaction engine.
