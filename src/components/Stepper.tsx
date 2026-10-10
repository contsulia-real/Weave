import type { CSSProperties } from 'react'
import { useState } from 'react'
import type { StepperItem, StepperProps } from '../core/stepper-types'
import { ensureChoiceControlStylesheet } from '../renderers/dom/choice-control-stylesheet'
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { ensureStepperStylesheet } from '../renderers/dom/stepper-stylesheet'
import { useTheme } from '../theme/theme-context'
import { Button } from './Button'
import { Column } from './Column'
import { CheckboxCheckMark } from './internal/CheckboxCheckMark'
import { Progress } from './Progress'
import { Row } from './Row'
import { Text } from './Text'
import { View } from './View'

function clampStep(value: number, count: number): number {
  if (!Number.isFinite(value)) return 1
  return Math.max(1, Math.min(count || 1, Math.floor(value)))
}

function StepMarker({
  number,
  completed,
  current,
  delay,
  reducedMotion,
}: {
  number: number
  completed: boolean
  current: boolean
  delay: string
  reducedMotion: boolean
}) {
  const selected = completed || current
  const numberDelay = reducedMotion
    ? '0ms'
    : completed
      ? delay
      : `calc(${delay} + var(--weave-motion-duration-slow))`
  const checkDelay = reducedMotion
    ? '0ms'
    : completed
      ? `calc(${delay} + var(--weave-motion-duration-fast))`
      : delay

  return (
    <View
      width={32}
      height={32}
      minWidth={32}
      radius="full"
      color="onPrimary"
      background={selected ? 'primary' : 'surfaceHover'}
      border={selected ? 0 : 1}
      borderColor="outline"
      transition={{ properties: ['background-color', 'border-color'], duration: 'normal', delay }}
    >
      <Row position="relative" width="fill" height="fill" align="center" justify="center">
        <Text
          typo="label-small"
          color={selected ? 'onPrimary' : 'secondary'}
          weight="semibold"
          viewProps={{
            opacity: completed ? 0 : 1,
            transition: { properties: ['opacity'], duration: 'fast', delay: numberDelay },
          }}
        >
          {number}
        </Text>
        <span
          className="weave-choice-field"
          data-weave-reduced-motion={reducedMotion ? 'reduce' : 'no-preference'}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <CheckboxCheckMark
            checked={completed}
            delay={checkDelay}
            style={{ width: 16, height: 16 }}
          />
        </span>
      </Row>
    </View>
  )
}

function StepContent({
  item,
  number,
  completed,
  current,
  orientation,
  delay,
  reducedMotion,
}: {
  item: StepperItem
  number: number
  completed: boolean
  current: boolean
  orientation: 'horizontal' | 'vertical'
  delay: string
  reducedMotion: boolean
}) {
  const marker = (
    <StepMarker
      number={number}
      completed={completed}
      current={current}
      delay={delay}
      reducedMotion={reducedMotion}
    />
  )
  const label = (
    <Column gap={4} minWidth={0} align={orientation === 'horizontal' ? 'center' : 'start'}>
      <Text
        weight={current ? 'semibold' : 'medium'}
        typo="label-small"
        align={orientation === 'horizontal' ? 'center' : 'start'}
      >
        {item.label}
      </Text>
      {item.description === undefined ? null : (
        <Text
          typo="body-small"
          color="secondary"
          align={orientation === 'horizontal' ? 'center' : 'start'}
        >
          {item.description}
        </Text>
      )}
    </Column>
  )

  return orientation === 'vertical' ? (
    <Row gap={12} align="start">
      {marker}
      {label}
    </Row>
  ) : (
    <Column gap={8} align="center">
      {marker}
      {label}
    </Column>
  )
}

export function Stepper({
  steps,
  step,
  defaultStep = 1,
  onStepChange,
  orientation = 'horizontal',
  readOnly = false,
  disabled = false,
  label = 'Steps',
  viewProps = {},
}: StepperProps): import('react').JSX.Element {
  const [uncontrolledStep, setUncontrolledStep] = useState(defaultStep)
  const current = clampStep(step ?? uncontrolledStep, steps.length)
  const [transitionSteps, setTransitionSteps] = useState({ from: current, to: current })
  if (transitionSteps.to !== current) {
    setTransitionSteps({ from: transitionSteps.to, to: current })
  }
  const from = transitionSteps.from
  const { reducedMotion } = useTheme()
  useStaticStylesheet(ensureChoiceControlStylesheet)
  useStaticStylesheet(ensureStepperStylesheet)
  const forward = current > from
  const backward = current < from
  const stageDelay = (stage: number) =>
    reducedMotion || stage <= 0 ? '0ms' : `calc(var(--weave-motion-duration-normal) * ${stage})`
  const fillVerticalHeight = orientation === 'vertical' && viewProps.height !== undefined

  const selectStep = (next: number) => {
    if (disabled || readOnly || next === current || steps[next - 1]?.disabled) return
    if (step === undefined) setUncontrolledStep(next)
    onStepChange?.(next)
  }

  return (
    <Column {...viewProps} data={{ ...viewProps.data, 'weave-stepper': '' }}>
      <nav
        aria-label={label}
        data-weave-stepper-orientation={orientation}
        style={{ height: fillVerticalHeight ? '100%' : undefined }}
      >
        <ol
          style={{
            display: 'flex',
            flexDirection: orientation === 'horizontal' ? 'row' : 'column',
            height: fillVerticalHeight ? '100%' : undefined,
            listStyle: 'none',
            gap: orientation === 'vertical' ? 16 : 0,
            padding: 0,
            margin: 0,
          }}
        >
          {steps.map((item, index) => {
            const number = index + 1
            const completed = number < current
            const isCurrent = number === current
            const unavailable = disabled || item.disabled === true
            const markerStage =
              forward && number > from && number <= current
                ? number - from
                : backward && number >= current && number <= from
                  ? from - number
                  : 0
            const segmentStage =
              forward && number >= from && number < current
                ? number - from
                : backward && number >= current && number < from
                  ? from - number - 1
                  : 0
            const content = (
              <StepContent
                item={item}
                number={number}
                completed={completed}
                current={isCurrent}
                orientation={orientation}
                delay={stageDelay(markerStage)}
                reducedMotion={reducedMotion}
              />
            )

            return (
              <li
                key={index}
                data-weave-step-state={
                  unavailable
                    ? 'disabled'
                    : completed
                      ? 'completed'
                      : isCurrent
                        ? 'current'
                        : 'upcoming'
                }
                aria-current={isCurrent ? 'step' : undefined}
                aria-disabled={unavailable || undefined}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: orientation === 'horizontal' ? 'center' : 'flex-start',
                  minWidth: 0,
                  flex:
                    orientation === 'horizontal'
                      ? '1 1 0'
                      : fillVerticalHeight && index < steps.length - 1
                        ? '1 1 0'
                        : undefined,
                  opacity: readOnly && unavailable ? 0.5 : 1,
                }}
              >
                {index < steps.length - 1 ? (
                  <View
                    position="absolute"
                    pointerEvents="none"
                    aria-hidden="true"
                    {...(orientation === 'vertical'
                      ? { top: 40, left: 15, bottom: -8, width: 2 }
                      : {
                          top: 15,
                          left: 'calc(50% + 24px)',
                          right: 'calc(-50% + 24px)',
                          height: 2,
                        })}
                  >
                    <Progress
                      mode="linear"
                      tracked
                      progress={completed ? 1 : 0}
                      color="primary"
                      direction={orientation}
                      inverse={orientation === 'vertical'}
                      viewProps={{
                        width: 'fill',
                        height: 'fill',
                        style: {
                          display: 'block',
                          '--weave-stepper-segment-delay': stageDelay(segmentStage),
                        } as CSSProperties & Record<'--weave-stepper-segment-delay', string>,
                      }}
                    />
                  </View>
                ) : null}
                {readOnly ? (
                  content
                ) : (
                  <Button
                    variant="ghost"
                    size="small"
                    disabled={unavailable}
                    viewProps={{
                      width: 'fit',
                      border: 0,
                      'aria-current': isCurrent ? 'step' : undefined,
                      onClick: () => selectStep(number),
                      style: {
                        padding: 0,
                        marginInline: orientation === 'horizontal' ? 'auto' : undefined,
                        background: 'transparent',
                        boxShadow: 'none',
                        transform: 'none',
                        justifyContent: orientation === 'vertical' ? 'flex-start' : 'center',
                      },
                    }}
                  >
                    {content}
                  </Button>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </Column>
  )
}
