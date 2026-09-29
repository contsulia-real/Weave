import type { MotionSpring } from './motion-types'

const DEFAULT_STIFFNESS = 280
const DEFAULT_DAMPING = 24
const DEFAULT_MASS = 1
const DEFAULT_VELOCITY = 0
const DEFAULT_REST_DELTA = 0.001
const DEFAULT_REST_SPEED = 0.01
const MAX_DURATION_SECONDS = 10
const SAMPLE_RATE = 60
const MAX_EASING_POINTS = 80

interface SpringState {
  value: number
  velocity: number
}

interface ResolvedSpring {
  durationMs: number
  easing: string
  samples: readonly number[]
}

interface NormalizedSpring {
  stiffness: number
  damping: number
  mass: number
  velocity: number
  restDelta: number
  restSpeed: number
}

function positive(value: number | undefined, fallback: number): number {
  return value !== undefined && Number.isFinite(value) && value > 0 ? value : fallback
}

function finite(value: number | undefined, fallback: number): number {
  return value !== undefined && Number.isFinite(value) ? value : fallback
}

function normalizedSpring(input: MotionSpring): NormalizedSpring {
  return {
    stiffness: positive(input.stiffness, DEFAULT_STIFFNESS),
    damping: positive(input.damping, DEFAULT_DAMPING),
    mass: positive(input.mass, DEFAULT_MASS),
    velocity: finite(input.velocity, DEFAULT_VELOCITY),
    restDelta: positive(input.restDelta, DEFAULT_REST_DELTA),
    restSpeed: positive(input.restSpeed, DEFAULT_REST_SPEED),
  }
}

function springStateAt(spring: NormalizedSpring, seconds: number): SpringState {
  const { stiffness, damping, mass, velocity: initialVelocity } = spring
  const omega0 = Math.sqrt(stiffness / mass)
  const zeta = damping / (2 * Math.sqrt(stiffness * mass))
  const y0 = -1

  if (zeta < 1 - 1e-4) {
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta)
    const a = y0
    const b = (initialVelocity + zeta * omega0 * a) / omegaD
    const decay = Math.exp(-zeta * omega0 * seconds)
    const cos = Math.cos(omegaD * seconds)
    const sin = Math.sin(omegaD * seconds)
    const y = decay * (a * cos + b * sin)
    const velocity =
      decay * (-zeta * omega0 * (a * cos + b * sin) + (-a * omegaD * sin + b * omegaD * cos))

    return {
      value: 1 + y,
      velocity,
    }
  }

  if (zeta > 1 + 1e-4) {
    const root = Math.sqrt(zeta * zeta - 1)
    const r1 = -omega0 * (zeta - root)
    const r2 = -omega0 * (zeta + root)
    const c1 = (initialVelocity - r2 * y0) / (r1 - r2)
    const c2 = y0 - c1
    const e1 = Math.exp(r1 * seconds)
    const e2 = Math.exp(r2 * seconds)
    const y = c1 * e1 + c2 * e2

    return {
      value: 1 + y,
      velocity: c1 * r1 * e1 + c2 * r2 * e2,
    }
  }

  const a = y0
  const b = initialVelocity + omega0 * a
  const decay = Math.exp(-omega0 * seconds)
  const y = (a + b * seconds) * decay
  const velocity = (b - omega0 * (a + b * seconds)) * decay

  return {
    value: 1 + y,
    velocity,
  }
}

function settleDuration(spring: NormalizedSpring): number {
  const frame = 1 / SAMPLE_RATE
  let settledFrames = 0

  for (let seconds = frame; seconds <= MAX_DURATION_SECONDS; seconds += frame) {
    const state = springStateAt(spring, seconds)
    const settled =
      Math.abs(1 - state.value) <= spring.restDelta && Math.abs(state.velocity) <= spring.restSpeed

    settledFrames = settled ? settledFrames + 1 : 0
    if (settledFrames >= 3) return seconds
  }

  return MAX_DURATION_SECONDS
}

function rounded(value: number): string {
  const normalized = Math.abs(value) < 1e-6 ? 0 : value
  return Number(normalized.toFixed(5)).toString()
}

function samplesFor(spring: NormalizedSpring, durationSeconds: number): number[] {
  const naturalPoints = Math.ceil(durationSeconds * SAMPLE_RATE) + 1
  const count = Math.max(2, Math.min(MAX_EASING_POINTS, naturalPoints))
  const output: number[] = []

  for (let index = 0; index < count; index += 1) {
    const progress = index / (count - 1)
    const seconds = durationSeconds * progress
    output.push(springStateAt(spring, seconds).value)
  }

  output[0] = 0
  output[output.length - 1] = 1
  return output
}

function linearEasing(samples: readonly number[]): string {
  return `linear(${samples
    .map((value, index) => {
      const percent = (index / (samples.length - 1)) * 100
      return `${rounded(value)} ${rounded(percent)}%`
    })
    .join(', ')})`
}

export function solveSpring(input: MotionSpring = {}): ResolvedSpring {
  const spring = normalizedSpring(input)
  const durationSeconds = settleDuration(spring)
  const samples = samplesFor(spring, durationSeconds)

  return {
    durationMs: Math.max(16, Math.round(durationSeconds * 1000)),
    easing: linearEasing(samples),
    samples,
  }
}
