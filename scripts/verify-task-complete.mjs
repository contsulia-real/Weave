import { execFileSync } from 'node:child_process'

function git(...args) {
  return execFileSync(
    'git',
    args,
    {
      encoding: 'utf8',
      stdio: [
        'ignore',
        'pipe',
        'pipe',
      ],
    },
  ).trim()
}

const status = git(
  'status',
  '--porcelain',
)

if (status.length > 0) {
  console.error(
    'Task verification failed: working tree is not clean.',
  )
  console.error(status)
  process.exit(1)
}

const branch = git(
  'branch',
  '--show-current',
)
const commit = git(
  'rev-parse',
  '--short',
  'HEAD',
)
const subject = git(
  'log',
  '-1',
  '--pretty=%s',
)

console.log(
  'Task verification passed.',
)
console.log(
  `branch: ${branch || '(detached)'}`,
)
console.log(
  `commit: ${commit} ${subject}`,
)
console.log(
  'working tree: clean',
)
