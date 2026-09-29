import { useState } from 'react'
import { Button, Column, Presence, Row, Text, ThemeProvider } from '../index'
import { PlaygroundSection } from './PlaygroundSection'

function LayoutAnimationPlayground() {
  const [alternate, setAlternate] = useState(false)
  const order = alternate ? (['C', 'B', 'A'] as const) : (['A', 'B', 'C'] as const)

  return (
    <Column gap={0.75} align="start">
      <Button
        text={alternate ? 'Reset layout' : 'Reorder + resize'}
        variant="secondary"
        viewProps={{
          onClick: () => setAlternate((current) => !current),
        }}
      />

      <Row
        width={26}
        minHeight={6}
        gap={0.75}
        align="center"
        padding={0.75}
        outlineWidth={0.0625}
        outlineColor="outline"
        outlineStyle="dashed"
        radius="medium"
      >
        {order.map((label) => (
          <Column
            key={label}
            width={label === 'B' ? (alternate ? 9 : 5) : 5}
            height={4}
            align="center"
            justify="center"
            radius="medium"
            background={label === 'B' ? 'primary' : 'surfaceHover'}
            color={label === 'B' ? 'onPrimary' : 'tertiary'}
            shadow="small"
            layoutAnimation={{
              spring: 'snappy',
              interruption: 'continue',
            }}
          >
            <Text typo="label-medium">{label}</Text>
          </Column>
        ))}
      </Row>
    </Column>
  )
}

function AdvancedMotionPlayground() {
  return (
    <Row gap={1.25} wrap align="center">
      <Column
        width={10}
        height={5}
        align="center"
        justify="center"
        radius="medium"
        background="surfaceHover"
        transition={{
          properties: ['transform'],
          spring: 'snappy',
        }}
        hover={{ scale: 1.14, translateY: -0.25 }}
      >
        <Text typo="label-medium">Hover · spring</Text>
      </Column>

      <Column
        width={10}
        height={5}
        align="center"
        justify="center"
        radius="medium"
        background="primary"
        color="onPrimary"
        animation={{
          keyframes: [
            { at: 0, scale: 0.94, opacity: 0.65 },
            { at: 0.55, scale: 1.08, opacity: 1 },
            { at: 1, scale: 1, opacity: 0.82 },
          ],
          duration: 700,
          repeat: 'infinite',
          repeatDelay: 180,
          direction: 'alternate',
          curve: 'emphasized',
        }}
      >
        <Text typo="label-medium">Keyframes · repeat</Text>
      </Column>

      <Column
        width={10}
        height={5}
        align="center"
        justify="center"
        radius="medium"
        background="surfaceHover"
        animation="pulse"
      >
        <Text typo="label-medium">Theme · pulse</Text>
      </Column>
    </Row>
  )
}

function StaggerPlayground() {
  const [run, setRun] = useState(0)

  return (
    <Column gap={0.75} align="start">
      <Button
        text="Replay stagger"
        variant="secondary"
        viewProps={{ onClick: () => setRun((value) => value + 1) }}
      />

      <Row
        key={run}
        gap={0.75}
        padding={0.75}
        radius="medium"
        outlineWidth={0.0625}
        outlineColor="outline"
        outlineStyle="dashed"
        enter={{
          animation: 'fade-up',
          children: {
            stagger: 90,
            delay: 80,
            from: 'first',
          },
          spring: 'snappy',
        }}
      >
        {['A', 'B', 'C', 'D'].map((label) => (
          <Column
            key={label}
            width={4}
            height={3}
            align="center"
            justify="center"
            radius="medium"
            background={label === 'C' ? 'primary' : 'surfaceHover'}
            color={label === 'C' ? 'onPrimary' : 'tertiary'}
          >
            <Text typo="label-medium">{label}</Text>
          </Column>
        ))}
      </Row>
    </Column>
  )
}

function InterruptionPlayground() {
  const [alternate, setAlternate] = useState(false)
  const target = alternate ? 8 : 0

  return (
    <Column gap={0.75} align="start">
      <Button
        text="Retarget all"
        variant="secondary"
        viewProps={{
          onClick: () => setAlternate((current) => !current),
        }}
      />

      <Column gap={0.75}>
        {(['continue', 'restart', 'finish'] as const).map((mode) => (
          <Row key={mode} gap={0.75} align="center">
            <Text typo="label-medium" viewProps={{ width: 5.5 }}>
              {mode}
            </Text>
            <Row
              width={18}
              height={3.5}
              align="center"
              paddingX={0.5}
              radius="medium"
              background="surfaceHover"
            >
              <Column
                width={3}
                height={2.25}
                align="center"
                justify="center"
                radius="medium"
                background={mode === 'continue' ? 'primary' : 'tertiary'}
                color={mode === 'continue' ? 'onPrimary' : 'surface'}
                animation={{
                  keyframes: [
                    { translateX: target === 0 ? 8 : 0, scale: 0.94 },
                    { translateX: target, scale: 1 },
                  ],
                  duration: 1100,
                  curve: 'emphasized',
                  interruption: mode,
                }}
              >
                <Text typo="label-small">{mode[0].toUpperCase()}</Text>
              </Column>
            </Row>
          </Row>
        ))}
      </Column>
    </Column>
  )
}

function EnterExitPlayground() {
  const [present, setPresent] = useState(true)

  return (
    <Column gap={0.75} align="start">
      <Button
        text={present ? 'Run exit' : 'Run enter'}
        variant="secondary"
        viewProps={{
          onClick: () => setPresent((current) => !current),
        }}
      />

      <Column
        width={16}
        height={7}
        align="center"
        justify="center"
        outlineWidth={0.0625}
        outlineColor="outline"
        outlineStyle="dashed"
        radius="medium"
      >
        <Presence present={present}>
          <Column
            width={11}
            height={4}
            align="center"
            justify="center"
            radius="medium"
            background="primary"
            color="onPrimary"
            shadow="small"
            enter="fade-up"
            exit="fade-down"
          >
            <Text typo="label-medium">Presence child</Text>
          </Column>
        </Presence>
      </Column>
    </Column>
  )
}

export function FoundationMotionPlayground() {
  return (
    <>
      <PlaygroundSection
        title="Motion · transition"
        description="ViewProps transition 使用主题 motion token；hover 状态由浏览器原生 CSS transition 插值。右侧 reducedMotion=reduce 直接跳到最终状态。"
      >
        <Row gap={1.5} wrap align="center">
          <Column
            width={9}
            height={5}
            align="center"
            justify="center"
            radius="medium"
            background="surfaceHover"
            transition="slow"
            hover={{
              scale: 1.08,
              background: 'primary',
              color: 'onPrimary',
            }}
          >
            <Text typo="label-medium">Hover · slow</Text>
          </Column>

          <Column
            width={9}
            height={5}
            align="center"
            justify="center"
            radius="medium"
            background="surfaceHover"
            transition={{
              properties: ['transform', 'opacity'],
              duration: 240,
              delay: 40,
              curve: [0.22, 1, 0.36, 1],
            }}
            hover={{
              translateY: -0.25,
              scale: 1.04,
              opacity: 0.72,
            }}
          >
            <Text typo="label-medium">Precise · 240ms</Text>
          </Column>

          <ThemeProvider reducedMotion="reduce">
            <Column
              width={9}
              height={5}
              align="center"
              justify="center"
              radius="medium"
              background="surfaceHover"
              transition="slow"
              hover={{
                scale: 1.08,
                background: 'primary',
                color: 'onPrimary',
              }}
            >
              <Text typo="label-medium">Reduced · instant</Text>
            </Column>
          </ThemeProvider>
        </Row>
      </PlaygroundSection>

      <PlaygroundSection
        title="Motion · enter / exit"
        description="enter 直接在挂载时运行；Presence 不增加 DOM，并在 present=false 后保留子树直到 exit 完成再真正卸载。"
      >
        <EnterExitPlayground />
      </PlaygroundSection>

      <PlaygroundSection
        title="Motion · layout animation"
        description="三个 keyed 子项都启用 FLIP。切换时 A / C 重排，B 同时改变宽度；连续点击会从当前视觉位置重新接管，不排动画队列。"
      >
        <LayoutAnimationPlayground />
      </PlaygroundSection>

      <PlaygroundSection
        title="Motion · spring / keyframes / repeat"
        description="物理 spring 使用求解后的 natural duration + linear()；keyframes 支持 at、repeat、repeatDelay、direction，也可以直接读取主题 animation preset。"
      >
        <AdvancedMotionPlayground />
      </PlaygroundSection>

      <PlaygroundSection
        title="Motion · stagger"
        description="父 ViewHost 直接编排 direct ViewHost children。Replay 后 A → B → C → D 按 spring fade-up 依次入场。"
      >
        <StaggerPlayground />
      </PlaygroundSection>

      <PlaygroundSection
        title="Motion · interruption"
        description="连续点击 Retarget all：continue 从当前视觉值接管；restart 从新动画起点重来；finish 先完成当前 cycle，再只执行最新目标。"
      >
        <InterruptionPlayground />
      </PlaygroundSection>
    </>
  )
}
