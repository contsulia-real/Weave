export type DocumentationCompilation = { outputText?: string; error?: string }
type CompilerStatus = 'loading' | 'ready' | 'failed'
type CompilationJob = {
  id: number
  owner: symbol
  source: string
  callback: (result: DocumentationCompilation) => void
  cancelled: boolean
}
type WorkerResponse =
  | { type: 'ready' }
  | { type: 'failed'; error: string }
  | { type: 'compiled'; id: number; outputText?: string; error?: string }

let worker: Worker | null = null
let status: CompilerStatus = 'loading'
let nextId = 0
let active: CompilationJob | null = null
const queued = new Map<symbol, CompilationJob>()
const subscribers = new Set<(status: CompilerStatus) => void>()

function notify() {
  for (const subscriber of subscribers) subscriber(status)
}

function fail(error: string) {
  worker?.terminate()
  worker = null
  active = null
  queued.clear()
  status = 'failed'
  console.error('Documentation example compiler failed:', error)
  notify()
}

function dispatch() {
  if (status !== 'ready' || active !== null || worker === null) return
  const next = queued.values().next().value
  if (next === undefined) return
  queued.delete(next.owner)
  active = next
  worker.postMessage({ id: next.id, source: next.source })
}

function start() {
  if (worker !== null || status === 'failed') return
  try {
    worker = new Worker(new URL('./documentation-example-worker.ts', import.meta.url), {
      type: 'module',
    })
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const message = event.data
      if (message.type === 'ready') {
        status = 'ready'
        notify()
        dispatch()
      } else if (message.type === 'failed') {
        fail(message.error)
      } else if (active?.id === message.id) {
        const finished = active
        active = null
        if (!finished.cancelled) {
          finished.callback({ outputText: message.outputText, error: message.error })
        }
        dispatch()
      }
    }
    worker.onerror = (event) => {
      event.preventDefault()
      fail(event.message)
    }
    worker.onmessageerror = () => fail('Invalid worker response')
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error))
  }
}

export function subscribeDocumentationCompiler(
  callback: (status: CompilerStatus) => void,
): () => void {
  subscribers.add(callback)
  start()
  callback(status)
  return () => subscribers.delete(callback)
}

export function compileDocumentationSource(
  owner: symbol,
  source: string,
  callback: (result: DocumentationCompilation) => void,
): () => void {
  const previous = queued.get(owner)
  if (previous !== undefined) previous.cancelled = true
  const job: CompilationJob = { id: ++nextId, owner, source, callback, cancelled: false }
  queued.set(owner, job)
  dispatch()
  return () => {
    job.cancelled = true
    if (queued.get(owner) === job) queued.delete(owner)
  }
}
