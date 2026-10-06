import { readdirSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { transform as transformCss } from 'lightningcss'
import { defineConfig, type Plugin } from 'vite'

const componentEntries = Object.fromEntries(
  readdirSync(new URL('./src/components/', import.meta.url), { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(?:ts|tsx)$/.test(entry.name))
    .map((entry) => [
      `components/${entry.name.replace(/\.(?:ts|tsx)$/, '')}`,
      fileURLToPath(new URL(`./src/components/${entry.name}`, import.meta.url)),
    ]),
)
const libraryEntries = {
  weave: fileURLToPath(new URL('./src/package.ts', import.meta.url)),
  ...componentEntries,
}

const staticStylesheetPattern = /const stylesheet = `([\s\S]*?)`/

function minifyStaticStylesheets(): Plugin {
  return {
    name: 'weave:minify-static-stylesheets',
    apply: 'build',
    transform(code, id) {
      if (!id.endsWith('-stylesheet.ts')) return

      const match = code.match(staticStylesheetPattern)
      const css = match?.[1]
      if (match === null || css === undefined || css.includes('${')) return

      const minified = transformCss({
        filename: id,
        code: Buffer.from(css),
        minify: true,
      }).code.toString()

      return code.replace(match[0], `const stylesheet = ${JSON.stringify(minified)}`)
    },
  }
}

export default defineConfig({
  plugins: [minifyStaticStylesheets(), react()],
  build: {
    copyPublicDir: false,
    lib: {
      entry: libraryEntries,
      formats: ['es'],
    },
    rolldownOptions: {
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'shiki'],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '_chunks/[name]-[hash].js',
      },
      experimental: {
        attachDebugInfo: 'none',
      },
    },
  },
})
