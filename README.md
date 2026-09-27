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

`createRoot(container)` uses the DiC renderer as the primary path and falls the whole root back to DOM when the initial tree has an explicit DiC capability gap. Applications do not create or manage the internal canvas.

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

DiC is the primary renderer and DOM + CSS is the compatibility fallback. The React-to-DiC surface, semantic mirror, renderer-neutral event bridge, and public `createRoot(container)` entry are implemented; remaining capability gaps are tracked in the design specification.
