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

Weave uses the browser-native [HTML-in-Canvas](https://wicg.github.io/html-in-canvas/) API as its primary rendering path when the API is available. React still renders real HTML elements with normal CSS, layout, events, form behavior and accessibility semantics. The canvas opts its HTML descendants into drawable layout with the native HTML-in-Canvas attributes and the 2D context paints the real HTML subtree with `drawElementImage()`. During the current experimental API transition, Weave emits both `layoutsubtree` (required by current Chromium builds) and `content="drawable"` (used by the latest WICG explainer).

If the browser does not expose HTML-in-Canvas, `createRoot(container)` falls back to ordinary DOM + CSS rendering. Pass `{ fallback: 'none' }` to make missing native support an explicit error.

Applications do not create or manage the internal canvas.

## HTML-in-Canvas status

HTML-in-Canvas is currently an experimental Web Platform API implemented behind a Chromium flag. Weave feature-detects the API at runtime; it does not emulate HTML-in-Canvas by reimplementing browser layout, text rendering, hit testing, input editing or accessibility in JavaScript.

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

The component system and DOM/CSS implementation are the semantic source used by both paths. Native HTML-in-Canvas is the primary path; ordinary DOM + CSS is the compatibility fallback.
