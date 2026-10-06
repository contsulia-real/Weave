import fs from 'node:fs'
import path from 'node:path'
import { McpServer } from '@modelcontextprotocol/server'
import { serveStdio } from '@modelcontextprotocol/server/stdio'
import * as z from 'zod/v4'

const root = process.cwd()
const generated = path.join(root, 'ai', 'generated')

function read(name) {
  return JSON.parse(fs.readFileSync(path.join(generated, name), 'utf8'))
}

const framework = read('framework.json')
const { components } = read('components.json')
const { examples } = read('examples.json')
const theme = read('theme.json')

function result(value) {
  return {
    content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
  }
}

function terms(value) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((part) => part.length > 1)
}

function componentSearchText(component) {
  return [
    component.name,
    component.category,
    component.intent,
    ...(component.preferWhen ?? []),
    ...(component.avoidWhen ?? []),
    ...(component.alternatives ?? []),
  ]
    .join(' ')
    .toLowerCase()
}

function rankComponents(query) {
  const queryTerms = terms(query)

  return Object.values(components)
    .map((component) => {
      const text = componentSearchText(component)
      const name = component.name.toLowerCase()
      let score = 0

      for (const term of queryTerms) {
        if (name === term) score += 12
        else if (name.includes(term)) score += 6
        if (text.includes(term)) score += 2
      }

      if (text.includes(query.toLowerCase())) score += 8
      return { component, score }
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score || left.component.name.localeCompare(right.component.name),
    )
}

function rankExamples(component, query) {
  const queryTerms = query === undefined ? [] : terms(query)

  return examples
    .filter(
      (example) =>
        component === undefined ||
        example.components.includes(component) ||
        example.component === component,
    )
    .map((example) => {
      const text = [
        example.id,
        example.title,
        example.description,
        ...example.concepts,
        ...example.components,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      const score =
        queryTerms.length === 0
          ? 1
          : queryTerms.reduce((total, term) => total + (text.includes(term) ? 2 : 0), 0)
      return { example, score }
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (left, right) => right.score - left.score || left.example.id.localeCompare(right.example.id),
    )
}

function createServer() {
  const server = new McpServer({
    name: 'weave',
    version: '0.1.0',
  })

  server.registerTool(
    'search_components',
    {
      description: 'Search public Weave components by name, category, and semantic intent.',
      inputSchema: z.object({
        query: z.string().min(1),
        limit: z.number().int().min(1).max(20).default(8),
      }),
    },
    async ({ query, limit }) =>
      result(
        rankComponents(query)
          .slice(0, limit)
          .map(({ component, score }) => ({
            name: component.name,
            score,
            import: component.import,
            intent: component.intent,
            category: component.category,
          })),
      ),
  )

  server.registerTool(
    'get_component',
    {
      description:
        'Get one public Weave component contract, including import, props, relations, intent, and examples.',
      inputSchema: z.object({
        name: z.string().min(1),
      }),
    },
    async ({ name }) => {
      const component = components[name]
      return result(
        component ?? {
          error: `Unknown Weave component: ${name}`,
          suggestions: rankComponents(name)
            .slice(0, 5)
            .map((entry) => entry.component.name),
        },
      )
    },
  )

  server.registerTool(
    'get_examples',
    {
      description:
        'Retrieve real Documentation demo source for a component and optional concept query.',
      inputSchema: z.object({
        component: z.string().optional(),
        query: z.string().optional(),
        limit: z.number().int().min(1).max(20).default(6),
      }),
    },
    async ({ component, query, limit }) =>
      result(
        rankExamples(component, query)
          .slice(0, limit)
          .map((entry) => entry.example),
      ),
  )

  server.registerTool(
    'get_theme_tokens',
    {
      description:
        'Get generated default Weave Theme tokens. Supply a domain such as color, typography, spacing, radius, shadow, feedback, or motion.',
      inputSchema: z.object({
        domain: z.string().optional(),
      }),
    },
    async ({ domain }) => {
      if (domain === undefined) return result(theme.tokens)

      return result(
        theme.tokens[domain] ?? {
          error: `Unknown Theme token domain: ${domain}`,
          availableDomains: Object.keys(theme.tokens).sort(),
        },
      )
    },
  )

  server.registerTool(
    'find_component_for_intent',
    {
      description: 'Recommend public Weave components for a natural-language UI intent.',
      inputSchema: z.object({
        intent: z.string().min(1),
        limit: z.number().int().min(1).max(10).default(5),
      }),
    },
    async ({ intent, limit }) =>
      result({
        intent,
        recommendations: rankComponents(intent)
          .slice(0, limit)
          .map(({ component, score }) => ({
            name: component.name,
            score,
            import: component.import,
            intent: component.intent,
            preferWhen: component.preferWhen,
            avoidWhen: component.avoidWhen,
            alternatives: component.alternatives,
            examples: component.examples.slice(0, 4),
          })),
        decisionGuide: framework.rules,
      }),
  )

  return server
}

await serveStdio(createServer)
