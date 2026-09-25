# Weave

Weave is a React UI framework for the Web.

The current framework design specification lives in [Weave UI.md](./Weave%20UI.md).

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

Implementation is starting from the core `View` / `ViewProps` layer. DOM + CSS is the compatibility backend; DOM-in-Canvas is the primary rendering direction defined by the design specification.
