import { execFileSync } from 'node:child_process'

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: options.inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'],
  })
}

function git(...args) {
  return run('git', args).trim()
}

function pnpm(...args) {
  console.log(`> pnpm ${args.join(' ')}`)

  if (process.platform === 'win32') {
    run(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', `pnpm ${args.join(' ')}`], {
      inherit: true,
    })
    return
  }

  run('pnpm', args, { inherit: true })
}

const initialStatus = git('status', '--porcelain')

if (initialStatus.length > 0) {
  console.error('Task verification failed: working tree is not clean before verification.')
  console.error(initialStatus)
  process.exit(1)
}

pnpm('format:check')
pnpm('typecheck')
pnpm('lint')
pnpm('test')
pnpm('build')

const finalStatus = git('status', '--porcelain')

if (finalStatus.length > 0) {
  console.error('Task verification failed: verification changed the working tree.')
  console.error(finalStatus)
  process.exit(1)
}

const branch = git('branch', '--show-current')
const commit = git('rev-parse', '--short', 'HEAD')
const subject = git('log', '-1', '--pretty=%s')

console.log('Task verification passed.')
console.log(`branch: ${branch || '(detached)'}`)
console.log(`commit: ${commit} ${subject}`)
console.log('working tree: clean')
