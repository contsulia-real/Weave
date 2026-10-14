import ts from 'typescript'

const compilerOptions: ts.CompilerOptions = {
  esModuleInterop: true,
  jsx: ts.JsxEmit.ReactJSX,
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ES2022,
}

type WorkerRequest = { id: number; source: string }
type WorkerResponse =
  | { type: 'ready' }
  | { type: 'failed'; error: string }
  | { type: 'compiled'; id: number; outputText?: string; error?: string }

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function compile(source: string): { outputText?: string; error?: string } {
  const result = ts.transpileModule(source, { compilerOptions, reportDiagnostics: true })
  const errors = result.diagnostics?.filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  )

  if (errors !== undefined && errors.length > 0) {
    return {
      error: errors
        .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
        .join('\n'),
    }
  }

  return { outputText: result.outputText }
}

const context = self as unknown as {
  postMessage: (response: WorkerResponse) => void
  onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null
}

context.onmessage = (event) => {
  const { id, source } = event.data
  try {
    context.postMessage({ type: 'compiled', id, ...compile(source) })
  } catch (error) {
    context.postMessage({ type: 'compiled', id, error: errorText(error) })
  }
}

try {
  // Initialize TypeScript's cold transpilation path before enabling any editor.
  compile('export default function Demo() { return null }')
  context.postMessage({ type: 'ready' })
} catch (error) {
  context.postMessage({ type: 'failed', error: errorText(error) })
}
