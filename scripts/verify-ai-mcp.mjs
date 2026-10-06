import assert from 'node:assert/strict'
import path from 'node:path'
import { Client } from '@modelcontextprotocol/client'
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio'

const root = process.cwd()
const client = new Client({
  name: 'weave-mcp-verifier',
  version: '1.0.0',
})
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [path.join(root, 'scripts', 'weave-mcp.mjs')],
})

function textResult(result) {
  const block = result.content?.find((item) => item.type === 'text')
  assert(block?.type === 'text', 'MCP tool did not return text content')
  return JSON.parse(block.text)
}

try {
  await client.connect(transport)

  const listed = await client.listTools()
  const names = listed.tools.map((tool) => tool.name).sort()
  assert.deepEqual(names, [
    'find_component_for_intent',
    'get_component',
    'get_examples',
    'get_theme_tokens',
    'search_components',
  ])

  const intent = textResult(
    await client.callTool({
      name: 'find_component_for_intent',
      arguments: { intent: 'editable search through a known option set', limit: 5 },
    }),
  )
  assert(
    intent.recommendations.some((item) => item.name === 'Combobox'),
    'Intent lookup did not recommend Combobox',
  )

  const button = textResult(
    await client.callTool({
      name: 'get_component',
      arguments: { name: 'Button' },
    }),
  )
  assert.equal(button.importPath, '@contsulia/weave/components/Button')

  const themeProvider = textResult(
    await client.callTool({
      name: 'get_component',
      arguments: { name: 'ThemeProvider' },
    }),
  )
  assert.equal(themeProvider.importPath, '@contsulia/weave')

  const multilineExamples = textResult(
    await client.callTool({
      name: 'get_examples',
      arguments: { component: 'Input', query: 'multiline', limit: 4 },
    }),
  )
  assert(
    multilineExamples.some((example) => example.id === 'Input/multiline-input'),
    'Example retrieval did not return the real multiline Input demo',
  )

  const colors = textResult(
    await client.callTool({
      name: 'get_theme_tokens',
      arguments: { domain: 'color' },
    }),
  )
  assert(typeof colors.primary === 'string', 'Theme token lookup did not return color.primary')

  console.log('Weave MCP verification passed.')
} finally {
  await client.close()
}
