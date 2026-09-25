# Weave — React UI 框架设计汇总

> 项目名：Weave
> 状态：当前设计汇总  
> 范围：仅 Web  
> 宿主：React  
> 主渲染路径：DOM-in-Canvas（DiC）  
> 兼容回退：DOM + CSS  
> 原则：本文件只整理当前已经形成的设计，不把已被否定的方案重新混入，不擅自缩减为概览版。

---

## 1. 项目定位

这是一个 **React UI 框架**。

不是“类 React 框架”，不是重新实现 React，也不是通用 Web 应用框架或全栈框架。

框架直接建立在 React 之上，因此以下能力直接继承 React，不重新设计另一套替代机制：

- 函数组件
- Hooks
- `props`
- `state`
- `context`
- React 事件模型
- React 生命周期语义
- React 的组合模型
- React 生态兼容

### 1.1 平台范围

当前只支持：

```text
Web
```

不再考虑：

- Windows
- macOS
- Linux 桌面
- iOS
- Android
- 原生平台桥接
- 多平台适配层
- 原生控件映射

---

## 2. 顶层设计原则

### 2.1 只支持函数组件

不提供类组件。

禁止把框架扩展模型建立在：

```text
class Foo extends Bar
```

之上。

不设计组件基类继承、生命周期继承链或通过子类重写行为的体系。

### 2.2 组件通过组合构建，不走继承体系

组件复用和扩展统一通过组合完成。

```tsx
function SaveButton(props) {
  return (
    <Button {...props}>
      <Icon name="device-floppy" />
      <Text>保存</Text>
    </Button>
  )
}
```

### 2.3 `ViewProps` 是统一通用能力入口

`View` 直接使用 `ViewProps`。

所有非 `View` 组件通过 `viewProps` 使用 `View` 的通用能力：

```tsx
<Button
  text="保存"
  viewProps={{
    width: "fill",
    padding: 1,
    transition: "fast",
  }}
/>
```

关系为：

```text
View
→ 直接使用 ViewProps

其他组件
→ 组件自身语义属性
+ viewProps: ViewProps
```

`viewProps` 不会改变组件自身的 DOM 内容模型。

组件是否允许 `children`、允许哪些 `children`，遵循其对应 DOM 元素的内容模型。

### 2.4 布局语义属于 `ViewProps`

布局策略与组件自身语义分离。

`View` 直接使用布局属性；非 `View` 组件通过 `viewProps` 使用布局属性。

对于不允许子内容的 DOM 元素，组件同样不接受 `children`，不会为了统一布局模型额外改变其 DOM 内容模型。

### 2.5 CSS 是内部实现和布局/样式语义基础，但公开 API 不是“裸 CSS API”

框架内部最终以 CSS 表达布局和样式。

但公开组件 API 应提供高层、语义化、适合 AI 易写易读，同时也适合人类阅读的属性。

例如：

```tsx
<Text
  size="large"
  weight="bold"
  color="primary"
  align="center"
>
  Hello
</Text>
```

而不是要求所有常见表达都退回：

```tsx
<Text
  viewProps={{
    style: {
      fontSize: "...",
      fontWeight: "...",
      color: "...",
      textAlign: "center",
    },
  }}
/>
```

两者关系是：

```text
高层组件 API
        ↓
内部映射
        ↓
CSS
```

### 2.6 不暴露 `as`

框架不让用户选择底层 HTML 标签。

禁止公开：

```tsx
<View as="main" />
<Text as="h1" />
```

同样不提供同类逃生口：

```text
asChild
element
tag
component
```

用户只面对框架组件语义。

具体 HTML / DOM 语义由框架内部决定。

---

## 3. DOM-in-Canvas 与 DOM + CSS

### 3.1 DiC 是默认主路径，不是增强插件

框架的默认语义以 **DOM-in-Canvas（DiC）** 为主。

不是：

```text
普通 DOM UI
+ 可选 Canvas 增强
```

而是：

```text
统一 UI API
    ↓
默认按 DiC 语义运行
    ├─ DiC 后端
    └─ DOM + CSS fallback 后端
```

### 3.2 DiC 不需要显式开启

开发者正常使用：

```tsx
<View
  blur={1}
  radius="large"
  shadow="medium"
  transition="fast"
/>
```

无需额外写：

```tsx
canvas={...}
```

才能获得“正常能力”。

### 3.3 DOM + CSS 是 fallback，但默认 API 与行为必须一致

DiC 与 DOM fallback 对普通组件 API 必须保持：

```text
同组件
同 props
同状态
同布局语义
同视觉语义
同动画语义
同交互语义
```

区别只能存在于内部实现。

开发者不应该因为当前浏览器进入 DOM fallback，就需要改写组件代码。

### 3.4 普通视觉能力不能被错误划入 Canvas 专属能力

以下属于默认组件 API，而不是 Canvas 专属：

- `blur`
- `shadow`
- `mask`
- `clip`
- `blend`
- `opacity`
- `transform`
- `transition`
- 普通滤镜
- 背景滤镜

这些能力由 DiC 和 DOM fallback 分别实现同样的公开语义。

### 3.5 允许显式 Canvas / DiC 高级配置

可以显式配置 Canvas 行为，但它的定位是：

> 覆盖或定制 DiC 的具体绘制 / 合成行为，而不是启用 DiC。

例如：

```tsx
<View
  canvas={{
    shader: glassShader,
    uniforms: {
      distortion: 0.2,
      refraction: 0.4,
    },
  }}
/>
```

`canvas` 适合承载真正属于绘制实现层的高级能力，例如：

```text
shader
uniforms
renderPass
composite strategy
custom draw
```

判断边界：

> 如果一个能力描述的是“组件最终应该长什么样、怎么交互”，它属于默认 API。  
> 只有描述“DiC 应该具体怎么绘制 / 合成它”时，才进入 `canvas`。

---

## 4. 数值与单位规则

这是全框架统一规则。

### 4.1 所有公开 API 中，不带单位的尺度数字统一按 `rem`

`style` 除外。

例如：

```tsx
<View
  width={20}
  padding={1}
  gap={0.5}
  top={1}
/>
```

解释为：

```text
width   = 20rem
padding = 1rem
gap     = 0.5rem
top     = 1rem
```

该规则适用于所有语义上表示：

- 长度
- 尺寸
- 间距
- 圆角
- 位移
- 边框宽度
- 阴影尺度
- 模糊半径
- 其他视觉尺度

### 4.2 非尺度数字不转成 `rem`

例如：

```tsx
<View
  opacity={0.8}
  scale={1.05}
  rotate={2}
  zIndex={10}
/>
```

这些不是尺度。

同样：

- 动画时长不是尺度
- 动画速度不是尺度
- 比例不是尺度
- 角度不是尺度
- 进度不是尺度

### 4.3 所有时间裸数字统一按毫秒

除 `style` 外，公开 API 中语义上表示时间的裸数字统一解释为毫秒（`ms`）。

例如：

```tsx
<Snack duration={3000} />

<View
  transition={{
    delay: 120,
  }}
/>
```

解释为：

```text
duration = 3000ms
delay    = 120ms
```

### 4.4 `style` 是明确例外

```tsx
<View
  style={{
    width: 20,
    padding: "1rem",
  }}
/>
```

`style` 完全遵循 React / CSS 自身规则，不应用框架的“裸数字 → rem”转换。

---

## 5. 组件分层模型

组件体系不是“所有东西都是同级组件”。

正式分成三层：

```text
基础原语
    ↓
基础组件
    ↓
组合组件
```

### 5.1 基础原语

基础原语只有一个：

```text
View
```

### 5.2 基础组件

基础组件的硬性规则：

> 基础组件只能由 `View` 构建。

不能在内部依赖：

- 其他基础组件
- 组合组件

当前基础组件：

```text
Text
Image
Input
Icon
Switch
Progress
Scrollbar
```

### 5.3 组合组件

组合组件可以由以下任意组合构建：

```text
View
基础组件
其他组合组件
```

当前组合组件：

```text
Button
ToolTip
Snack
List
ListItem
```

### 5.4 分层判断看“真实内部依赖”

不能通过“这是 children 传进来的”之类说法规避真实依赖。

例如：

```text
Button
├─ View
└─ Text
```

因为内部真实包含 `Text`，所以它不是基础组件，而是组合组件。

同理：

```text
List
└─ ListItem
   ├─ Text
   └─ Icon?
```

因此 `List` 也是组合组件。

---

# 6. `View`

`View` 是：

> 整个框架唯一的基础原语，也是统一万能基础节点。

所有其他组件最终建立在 `View` 之上。

## 6.1 `View` 的通用职责

`View` 原生承载：

```text
children
CSS 样式与布局
事件
交互状态
可访问性语义
引用 / 标识
响应式覆盖
动画
视觉效果
```

基础组件只增加自身特有能力。

例如：

```text
Text   = View + 文本能力
Image  = View + 图像能力
Input  = View + 输入能力
Icon   = View + 图标能力
Switch = View + 开关行为
```

---

## 6.2 布局策略

`View` 直接使用布局属性；非 `View` 组件通过 `viewProps` 使用布局属性。

组件是否能够实际承载子项布局，遵循其对应 DOM 元素的内容模型。

当前公开模型：

```text
layout
├─ flex
├─ grid
├─ stack
└─ absolute
```

### Flex

```tsx
<View
  layout="flex"
  direction="column"
  wrap={false}
  gap={1}
  align="stretch"
  justify="start"
/>
```

`direction`：

```text
row
row-reverse
column
column-reverse
```

`wrap`：

```text
false
true
"reverse"
```

`align`：

```text
start
center
end
stretch
baseline
```

`justify`：

```text
start
center
end
space-between
space-around
space-evenly
```

注意：

> `wrap` 不是和 `row / column` 平级的布局策略。

它只是布局行为。

### Grid

```tsx
<View
  layout="grid"
  columns={3}
  rows="auto"
  gap={1}
/>
```

也允许更精确表达：

```tsx
<View
  layout="grid"
  columns="1fr 2fr 1fr"
  rows="auto 1fr"
/>
```

### Stack

```tsx
<View
  layout="stack"
  align="center"
/>
```

用于层叠子组件。

### Absolute

```tsx
<View layout="absolute">
  <View
    top={1}
    right={1}
    width={4}
    height={4}
  />
</View>
```

---

## 6.3 子项参与布局

```tsx
<View
  grow={1}
  shrink={0}
  basis={12}
  alignSelf="center"
  justifySelf="end"
  order={2}
/>
```

Grid 子项：

```tsx
<View
  column={2}
  columnSpan={2}
  row={1}
  rowSpan={2}
/>
```

---

## 6.4 尺寸

```tsx
<View
  width={20}
  height={12}

  minWidth={10}
  maxWidth={40}

  minHeight={6}
  maxHeight={30}

  aspectRatio={16 / 9}
/>
```

支持 CSS 语义字符串：

```tsx
<View
  width="100%"
  height="auto"
  maxWidth="60vw"
/>
```

高频意图允许语义值：

```tsx
<View width="fill" />
<View height="fill" />

<View width="fit" />
<View width="content" />
```

这些高层值由框架内部映射到合适 CSS 行为。

---

## 6.5 间距

```tsx
<View
  margin={1}
  marginX={2}
  marginY={0.5}

  padding={1}
  paddingX={1.5}
  paddingY={0.75}
/>
```

支持四边覆盖：

```tsx
<View
  padding={1}
  paddingTop={2}
/>
```

具体边覆盖聚合值。

---

## 6.6 定位

```tsx
<View
  position="absolute"
  inset={1}
/>
```

支持：

```tsx
<View
  insetX={1}
  insetY={0.5}
/>
```

以及：

```tsx
<View
  top={1}
  right={1}
  bottom={1}
  left={1}
/>
```

---

## 6.7 溢出

```tsx
<View
  overflow="hidden"
  overflowX="auto"
  overflowY="scroll"
/>
```

当产生滚动区域时，Scrollbar 由框架自动挂载，见后文。

---

## 6.8 通用交互与状态能力

以下属于 `View` 通用能力，不应错误地放进某个具体组件：

```text
selectable
focusable
disabled
draggable
hidden
pointerEvents
cursor
tabIndex
autoFocus
```

示例：

```tsx
<View
  selectable
  focusable
  disabled
  draggable
/>
```

`selectable` 明确属于通用能力，不是 `Text` 专属能力。

---

## 6.9 通用事件

事件沿用 React 风格，不额外发明另一套同义事件名称。

例如：

```tsx
<View
  onClick={...}
  onDoubleClick={...}

  onPointerDown={...}
  onPointerUp={...}
  onPointerMove={...}
  onPointerEnter={...}
  onPointerLeave={...}

  onKeyDown={...}
  onKeyUp={...}

  onFocus={...}
  onBlur={...}

  onScroll={...}

  onDragStart={...}
  onDrag={...}
  onDragEnd={...}
  onDrop={...}
/>
```

---

## 6.10 标识、引用与数据

```tsx
<View
  id="sidebar"
  ref={sidebarRef}
  data={{
    testid: "sidebar",
    state: "open",
  }}
/>
```

不要求用户到处手写：

```text
data-testid
data-state
data-foo
```

可以统一通过 `data` 对象提供。

---

# 7. 默认视觉 API

默认视觉能力属于 `ViewProps`。

`View` 直接使用；非 `View` 组件通过 `viewProps` 使用。

DiC 与 DOM fallback 都必须实现同样公开语义。

## 7.1 Background

颜色：

```tsx
<View background="surface" />
```

直接值：

```tsx
<View background="#18181b" />
```

线性渐变：

```tsx
<View
  background={{
    type: "linear",
    angle: 90,
    stops: [
      ["primary", 0],
      ["secondary", 1],
    ],
  }}
/>
```

径向渐变：

```tsx
<View
  background={{
    type: "radial",
    stops: [
      ["primary", 0],
      ["transparent", 1],
    ],
  }}
/>
```

---

## 7.2 Border

```tsx
<View
  border={0.0625}
  borderColor="outline"
  borderStyle="solid"
/>
```

单边：

```tsx
<View
  borderTop={0.0625}
  borderBottom={0}
  borderLeftColor="primary"
/>
```

---

## 7.3 Radius

```tsx
<View radius="medium" />
<View radius={1} />
```

语义值：

```text
none
small
medium
large
full
```

独立角：

```tsx
<View
  radiusTopLeft={1}
  radiusTopRight={1}
  radiusBottomLeft={0}
  radiusBottomRight={0}
/>
```

---

## 7.4 Shadow

语义预设：

```tsx
<View shadow="medium" />
```
精确描述：

```tsx
<View
  shadow={{
    x: 0,
    y: 0.5,
    blur: 1.5,
    spread: 0,
    color: "shadow",
    opacity: 0.2,
  }}
/>
```

支持多层阴影：

```tsx
<View
  shadow={[
    {
      y: 0.25,
      blur: 0.5,
      color: "#000",
      opacity: 0.08,
    },
    {
      y: 1,
      blur: 2,
      color: "#000",
      opacity: 0.12,
    },
  ]}
/>
```

`x / y / blur / spread` 均属于尺度数字，按 `rem` 解释。

---

## 7.5 Opacity

```tsx
<View opacity={0.7} />
```

范围：

```text
0 ~ 1
```

---

## 7.6 Filter

结构化 API：

```tsx
<View
  blur={1}
  brightness={1.1}
  contrast={1.2}
  saturate={1.3}
  grayscale={0.5}
  sepia={0.2}
  hueRotate={20}
/>
```

语义：

```text
blur        → 尺度
brightness  → 比例
contrast    → 比例
saturate    → 比例
grayscale   → 0~1
sepia       → 0~1
hueRotate   → 角度
```

---

## 7.7 Backdrop Filter

```tsx
<View
  backdropBlur={1}
  backdropSaturate={1.2}
/>
```

---

## 7.8 Transform

快捷属性：

```tsx
<View
  translateX={1}
  translateY={-0.5}
  scale={1.05}
  rotate={5}
/>
```

更细：

```tsx
<View
  scaleX={1.2}
  scaleY={0.8}
  skewX={4}
  skewY={0}
/>
```

快捷属性按照 CSS 的 transform 顺序语义解析。

需要显式表达变换顺序时使用数组：

```tsx
<View
  transform={[
    { translateX: 1 },
    { rotate: 5 },
    { scale: 1.05 },
  ]}
/>
```

因为变换顺序不可交换。

---

## 7.9 Transform Origin

```tsx
<View transformOrigin="center" />
```

或：

```tsx
<View
  transformOrigin={{
    x: "left",
    y: "top",
  }}
/>
```

精确尺度：

```tsx
<View
  transformOrigin={{
    x: 1,
    y: 0.5,
  }}
/>
```

---

## 7.10 Mask

遮罩属于默认 API，不是 Canvas 专属能力。

```tsx
<View mask={mask} />
```

可接受：

```text
图像
渐变
SVG
```

例如：

```tsx
<View
  mask={{
    type: "linear",
    angle: 90,
    stops: [
      ["transparent", 0],
      ["black", 1],
    ],
  }}
/>
```

---

## 7.11 Clip

不能只依赖 `overflow="hidden"`。

```tsx
<View
  clip={{
    type: "circle",
    radius: "50%",
  }}
/>
```

多边形：

```tsx
<View
  clip={{
    type: "polygon",
    points: [...],
  }}
/>
```

也允许 SVG path。

---

## 7.12 Blend

```tsx
<View blend="multiply" />
```

支持常见混合模式：

```text
normal
multiply
screen
overlay
darken
lighten
color-dodge
color-burn
hard-light
soft-light
difference
exclusion
hue
saturation
color
luminosity
```

---

## 7.13 Color

前景颜色属于 `View` 通用视觉能力：

```tsx
<View color="primary" />
```

接受主题颜色令牌或直接颜色值。

---

## 7.14 Outline

轮廓属于 `View` 通用视觉能力，并用于焦点等状态样式：

```tsx
<View
  outlineWidth={0.125}
  outlineColor="focus"
  outlineStyle="solid"
  outlineOffset={0.125}
/>
```

支持：

```text
outlineWidth
outlineColor
outlineStyle
outlineOffset
```

其中 `outlineWidth` / `outlineOffset` 的裸数字属于尺度，按 `rem` 解释。

---

# 8. 状态样式

状态样式属于 `View` 通用能力。

例如：

```tsx
<View
  background="surface"

  hover={{
    background: "surfaceHover",
  }}

  active={{
    scale: 0.98,
  }}

  focus={{
    outlineWidth: 0.125,
    outlineColor: "primary",
  }}

  disabledStyle={{
    opacity: 0.5,
  }}
/>
```

当前状态入口包括：

```text
hover
active
focus
focusVisible
disabledStyle
```

具体组件可以在主题中定义默认状态表现，实例也可以覆盖。

---

# 9. 响应式与自适应

响应式不另造一套组件或 DSL。

它是在现有组件 API 上进行条件覆盖。

## 9.1 Viewport Breakpoint

```tsx
<View
  layout="flex"
  direction="column"
  gap={1}

  md={{
    direction: "row",
    gap: 1.5,
  }}

  lg={{
    gap: 2,
  }}
/>
```

默认断点来自主题：

```ts
theme = {
  breakpoints: {
    sm: 40,
    md: 48,
    lg: 64,
    xl: 80,
  },
}
```

这些是尺度值：

```text
40 → 40rem
48 → 48rem
```

支持自定义断点名称：

```ts
breakpoints: {
  compact: 36,
  wide: 72,
}
```

然后：

```tsx
<View
  direction="column"

  compact={{
    padding: 0.75,
  }}

  wide={{
    direction: "row",
    padding: 2,
  }}
/>
```

---

## 9.2 Container Breakpoint

只依赖 viewport 不够。

`View` 可以声明响应式容器：

```tsx
<View container="sidebar">
  ...
</View>
```

内部组件可以根据最近响应式容器变化：

```tsx
<Card
  viewProps={{
    direction: "column",

    containerMd: {
      direction: "row",
    },
  }}
/>
```

概念区分：

```text
md / lg / xl
→ viewport breakpoint

containerMd / containerLg / ...
→ 最近响应式容器
```

---

## 9.3 响应式覆盖高层组件 API

响应式不是只能覆盖 CSS 属性。

可以直接覆盖组件语义属性：

```tsx
<Text
  size="small"
  md={{
    size: "medium",
  }}
/>

<Button
  size="small"
  lg={{
    size: "large",
  }}
/>

<Image
  viewProps={{
    radius: "medium",
    md: {
      radius: "large",
    },
  }}
/>
```

---

# 10. `style` 与 `className`

`View` 直接使用 `className` 与 `style`：

```tsx
<View
  className="foo"
  style={{
    backdropFilter: "blur(12px)",
    width: 20,
  }}
/>
```

非 `View` 组件通过 `viewProps` 使用：

```tsx
<Button
  text="保存"
  viewProps={{
    className: "foo",
    style: {
      width: "100%",
    },
  }}
/>
```

统一样式优先级：

```text
style
> className
> 属性体系
> 组件默认样式
```

组件默认视觉样式必须由框架内部 class 提供，并使用低 specificity 的 `:where(...)` 选择器，不允许通过内联 `style` 注入默认视觉。

例如：

```text
weave-switch
weave-switch--medium
weave-switch__thumb
```

这样用户自己的 `className` 天然高于组件默认 class，`style` 仍然保持最高优先级。

只有无法静态枚举、必须在运行时连续变化的值，才允许通过最小化的 CSS 自定义属性传递，例如：

```text
Progress progress={0.68}
Progress speed={800}
```

这类运行时值不承担组件默认视觉，只传递该实例的动态数据。

属性体系内部继续按照主题、组件变体、状态、实例属性与响应式覆盖规则解析。

`style` 的规则：

- 遵循 React / CSS 本身
- 不应用框架裸数字 `rem` 转换
- 是最终原始 CSS 逃生口
- 用于框架高层 API 未覆盖的精确控制

---

# 11. `Text`

`Text` 是基础组件。

依赖关系：

```text
Text
= View
+ 文本内容能力
+ 文本专属语义属性
```

它通过 `viewProps` 使用 `View` 的全部通用能力。

因此布局、视觉、状态样式、响应式、动画、通用事件等 `View` 能力统一放在 `viewProps` 中，不平铺到 `Text` 顶层。

## 11.1 文本 API

```tsx
<Text
  size="large"
  weight="bold"
  color="primary"
  align="center"
>
  Hello
</Text>
```

当前文本专属属性：

```text
size
weight
color
align
lineHeight
letterSpacing
wrap
overflow
maxLines
case
```

### size

语义值：

```text
xsmall
small
medium
large
xlarge
xxlarge
```

### weight

```text
light
regular
medium
semibold
bold
```

### color

语义颜色：

```text
inherit
primary
secondary
tertiary
success
warning
danger
disabled
```

也可以由主题扩展自定义颜色令牌。

### align

```text
start
center
end
justify
```

### wrap

```text
wrap
nowrap
balance
```

### overflow

```text
clip
ellipsis
```

### maxLines

数字。

### lineHeight / letterSpacing

支持精确数值，裸数字作为尺度处理：

```tsx
<Text
  lineHeight={1.5}
  letterSpacing={0.02}
/>
```

### case

避免和 `View` 的 transform 概念冲突，使用明确名称：

```tsx
<Text case="uppercase" />
```

支持：

```text
none
uppercase
lowercase
capitalize
```

## 11.2 Text 的子内容

`Text` 是否允许以及允许哪些 `children`，遵循其对应 DOM 元素的内容模型。

允许嵌套文本时：

```tsx
<Text color="secondary">
  当前状态：
  <Text color="success" weight="bold">
    正常
  </Text>
</Text>
```

合法的其他子内容同样遵循对应 DOM 内容模型：

```tsx
<Text>
  查看
  <Icon name="arrow-right" />
</Text>
```

---

# 12. `Icon`

`Icon` 是基础组件。

图标来源确定为：

```text
Tabler Icons
+
自定义 SVG
```

它仍然只能建立在 `View` 上。

## 12.1 Tabler Icons

```tsx
<Icon
  name="settings"
  size="medium"
  stroke="regular"
/>
```

公开名称使用简洁图标名：

```tsx
<Icon name="arrow-left" />
<Icon name="settings" />
<Icon name="search" />
<Icon name="user" />
```

不直接暴露 Tabler React 组件名：

```text
IconArrowLeft
IconSettings
...
```

图标名称应生成完整类型联合和自动补全。

例如：

```ts
type IconName =
  | "arrow-left"
  | "arrow-right"
  | "settings"
  | "search"
  | ...
```

拼写错误应在开发期暴露。

## 12.2 SVG

支持直接传 SVG：

```tsx
<Icon svg={mySvg} />
```

也支持 React SVG 节点：

```tsx
<Icon
  svg={
    <svg viewBox="0 0 24 24">
      ...
    </svg>
  }
/>
```

`name` 与 `svg` 互斥。

## 12.3 Icon 自身核心属性

```text
name
svg
size
stroke
```

`size` 支持：

```text
small
medium
large
xlarge
```

`stroke`：

```text
thin
regular
bold
```

颜色、旋转、透明度、动画等通用 `View` 能力通过 `viewProps` 使用，不需要改变 Icon 的分层。

---

# 13. `Image`

`Image` 是基础组件。

```text
Image
= View
+ 图像内容能力
```

## 13.1 核心 API

```tsx
<Image
  src="/cover.webp"
  alt="专辑封面"
  fit="cover"
  position="center"
  loading="lazy"
/>
```

当前属性：

```text
src
alt
fit
position
loading
onLoad
onError
```

### src

可接受：

```text
string
Blob
object URL
data URL
```

### fit

```text
contain
cover
fill
none
scale-down
```

### position

可使用常见位置：

```text
center
top
bottom
left
right
top-left
top-right
bottom-left
bottom-right
```

也允许更精确值。

### loading

```text
lazy
eager
```

## 13.2 不提供 `decorative`

`decorative` 已明确删除。

装饰图语义通过：

- `alt`
- `viewProps` 中的通用可访问性能力

表达。

例如：

```tsx
<Image src={background} alt="" />
```

## 13.3 Image 与 `viewProps`

`Image` 通过 `viewProps` 使用通用布局与视觉能力：

```tsx
<Image
  src="/cover.webp"
  fit="cover"
  viewProps={{
    width: 20,
    height: 12,
    radius: "medium",
  }}
/>
```

`Image` 对应的 DOM 元素不允许 `children`，因此 `Image` 不接受 `children`。

需要叠加其他内容时通过外层组件组合：

```tsx
<View layout="stack">
  <Image src="/cover.webp" fit="cover" />
  <Text>专辑名称</Text>
</View>
```

---

# 14. `Input`

`Input` 是基础组件。

```text
Input
= View
+ 可编辑输入能力
```

## 14.1 核心 API

```tsx
<Input
  value={name}
  onChange={setName}
  placeholder="名称"
/>
```

当前属性：

```text
value
defaultValue
onChange
placeholder
type
multiline
rows
readOnly
required
name
autoComplete
minLength
maxLength
pattern
```

### type

沿用 Web 用户熟悉的语义：

```text
text
password
email
number
search
tel
url
```

不重新发明同义名称。

## 14.2 多行输入仍然使用 Input

```tsx
<Input
  multiline
  rows={4}
/>
```

不额外建立 `TextArea` 基础组件。

## 14.3 基础 Input 不内建组合内容

以下不作为基础 Input 的固定内部结构：
```text
label
helperText
errorText
prefix
suffix
左图标
清除按钮
密码可见按钮
```

这些会引入 `Text`、`Icon`、`Button` 等依赖，因此属于更高层组合组件的职责。

---

# 15. `Switch`

`Switch` 是基础组件。

内部只需要 `View`：

```text
Switch
├─ View  // track
└─ View  // thumb
```

## 15.1 API

```tsx
<Switch
  checked={enabled}
  onChange={setEnabled}
/>
```

非受控：

```tsx
<Switch defaultChecked />
```

核心属性：

```text
checked
defaultChecked
onChange
size
```

### size

```text
small
medium
large
```

---

# 16. `Progress`

`Progress` 是基础组件。

它由 `View` 构建，用来表达确定进度与不确定进度。

状态语义与视觉形态分离：

```text
状态
├─ undetermined
└─ progress

mode
├─ spin
└─ linear

dotted
├─ false
└─ true

tracked
├─ false
└─ true
```

## 16.1 状态

不确定进度：

```tsx
<Progress undetermined />
```

确定进度：

```tsx
<Progress progress={0.68} />
```

`progress` 范围：

```text
0 ~ 1
```

`undetermined` 与 `progress` 互斥。

确定进度在 `progress` 数值发生变化时自动进行一次过渡；值稳定后不持续运动。

不确定进度持续运动。

## 16.2 mode

`mode` 决定 Progress 的基础视觉形态：

```text
spin
linear
```

### spin

环形进度：

```tsx
<Progress
  progress={0.68}
  mode="spin"
/>
```

不确定状态：

```tsx
<Progress
  undetermined
  mode="spin"
/>
```

### linear

线形进度：

```tsx
<Progress
  progress={0.68}
  mode="linear"
/>
```

不确定状态：

```tsx
<Progress
  undetermined
  mode="linear"
/>
```

默认：

```text
mode = spin
```

## 16.3 dotted

`dotted` 是视觉修饰，不是第三种 mode。

它不会改变：

- determined / undetermined 状态语义
- `progress` 数值
- `spin / linear` 的基础形态

而是把原本连续的形状变为由分段点状单元组成的不连续形状。

例如：

```tsx
<Progress
  progress={0.68}
  mode="spin"
  dotted
/>

<Progress
  progress={0.68}
  mode="linear"
  dotted
/>
```

关系：

```text
spin
→ 连续环形

spin + dotted
→ 点状 / 分段环形

linear
→ 连续线形

linear + dotted
→ 点状 / 分段线形
```

## 16.4 tracked

`tracked` 控制是否显示更浅色的轨道。

```tsx
<Progress
  progress={0.68}
  mode="spin"
  tracked
/>
```

规则：

```text
tracked = false
→ 不显示轨道，只显示前景进度 / 不确定运动

tracked = true
→ 显示同一基础形态的浅色连续轨道
```

`tracked` 与 `dotted` 同时存在时：

> `dotted` 只作用于前景 value；track 仍保持连续，不跟随 dotted 变成点状或分段。

因此：

```text
spin + tracked + dotted
→ 连续浅色圆环轨道 + 点状前景环

linear + tracked + dotted
→ 连续浅色直线轨道 + 点状前景线
```

## 16.5 speed

`speed`：

```text
slow
normal
fast
number
```

裸数字按全框架时间规则解释为毫秒。

语义：

```text
undetermined
→ 控制持续运动速度

progress
→ 控制 progress 改变时单次过渡时长
```

## 16.6 当前公开能力

```text
undetermined
progress
mode
dotted
tracked
size
color
speed
viewProps
```

类型层表达：

```ts
type ProgressProps =
  {
    mode?: "spin" | "linear"
    dotted?: boolean
    tracked?: boolean
    size?: "small" | "medium" | "large"
    color?: Color
    speed?: "slow" | "normal" | "fast" | number
    viewProps?: ViewProps
  } &
  (
    | {
        undetermined: true
        progress?: never
      }
    | {
        undetermined?: false
        progress: number
      }
  )
```

默认视觉样式遵循统一规则：

```text
style
> className
> 属性体系
> 组件默认 class
```

`mode / dotted / size / speed` 的静态默认视觉由低 specificity 的内部 class 提供。

只有运行时连续值，例如确定进度的实际 `progress` 与数字型 `speed`，才允许通过最小化 CSS 自定义属性传递。

---

# 17. `Scrollbar`

`Scrollbar` 是一个特殊的基础组件。

## 17.1 它是由 View 构建的基础组件

不是：

```css
::-webkit-scrollbar
```

不是 WebKit 伪元素皮肤。

不是单纯的 CSS scrollbar 主题。

它是：

> 框架自己的、由 `View` 构建的基础组件。

## 17.2 不需要显式插入

开发者不会写：

```tsx
<Scrollbar />
```

当组件产生滚动区域：

```tsx
<View overflow="auto">
  ...
</View>
```

框架自动创建并挂载对应的 `Scrollbar`。

概念结构：

```text
Scrollable View
├─ Content
└─ Scrollbar       // 框架自动生成
   ├─ Track : View
   └─ Thumb : View
```

## 17.3 行为和定位沿用默认 scrollbar 语义

包括：

- 滚动绑定
- Thumb 位置
- 拖动行为
- 滚轮联动
- 显示 / 隐藏行为
- 方向与定位

不要求应用开发者重建滚动条行为。

## 17.4 视觉实体仍然是框架组件

因此它可以拥有 `View` 的通用能力并接受主题。

局部定制挂在滚动容器上：

```tsx
<View
  overflow="auto"
  scrollbar={{
    size: "medium",
    color: "secondary",
    trackColor: "transparent",
    radius: "full",
  }}
>
  ...
</View>
```

这里的 `scrollbar` 是把配置传给框架自动生成的 `Scrollbar`，不是映射到 `::-webkit-scrollbar`。

当前视觉 API：

```text
size
  small
  medium
  large
color
trackColor
radius
opacity
```

不公开用于篡改默认滚动行为的：

```text
position
direction
dragBehavior
scrollBinding
thumbPosition
visibilityAlgorithm
```

### 17.5 DOM fallback 实现约束

DOM fallback 下：

- 原 `View` 仍然是真实原生滚动容器，不额外包裹内容，不改变 flex / grid 子项结构。
- 滚轮、触摸板、键盘滚动、`scrollTop` / `scrollLeft` 继续使用浏览器原生滚动机制。
- 原生滚动条轨道通过标准 CSS 能力隐藏，不使用 `::-webkit-scrollbar` 作为视觉实现。
- 框架自动挂载由 `View` 语义节点构成的 track / thumb，并与真实滚动位置同步。
- track / thumb 的默认视觉遵循统一 class 优先级规则；几何位置、thumb 长度、滚动进度等连续运行时值允许通过最小化的 inline CSS / CSS 变量同步。
- 自动挂载不能改变用户拿到的 `View` ref 所指向的真实滚动元素。

---

# 18. `Button`

`Button` 是组合组件。

真实依赖：

```text
Button
= View
+ Text
+ 可选 Icon
+ 可选 Progress
```

因此它不能被归为基础组件。

## 18.1 快捷语义 API

```tsx
<Button
  text="保存"
  icon="device-floppy"
  variant="primary"
  size="medium"
  loading={false}
  viewProps={{
    onClick: save,
  }}
/>
```

## 18.2 完整组合能力

```tsx
<Button>
  <Icon name="device-floppy" />
  <Text>保存</Text>
</Button>
```

框架同时支持：

```text
快捷语义 API
+
完整 children 组合
```

两种内容入口互斥：

- 使用 `children` 时，不再同时使用 `text`、`icon`、`iconPosition`。
- `variant`、`size`、`loading`、`viewProps` 等不属于内容入口，可用于两种模式。

## 18.3 核心属性

```text
text
icon
iconPosition
variant
size
loading
children
```

### iconPosition

```text
start
end
```

### variant

当前：

```text
primary
secondary
tertiary
ghost
danger
```

### size

```text
small
medium
large
```

### icon

接受 Icon 的两类来源：

```text
Tabler name
SVG
```

例如：

```tsx
<Button icon="plus" />
```

或：

```tsx
<Button icon={customSvg} />
```

## 18.4 loading

```tsx
<Button
  text="提交"
  loading
/>
```

内部可组合 `Progress`。

默认期望：

- 阻止重复触发
- 显示 Progress
- 保留按钮尺寸

如果用户需要完全自定义，仍然可以 children 组合。

## 18.5 Button 的 `viewProps`

`Button` 的通用布局、视觉、状态、响应式与动画能力通过 `viewProps` 使用：

```tsx
<Button
  viewProps={{
    direction: "column",
    gap: 0.25,
  }}
>
  <Icon name="upload" />
  <Text>上传</Text>
</Button>
```

---

# 19. `ToolTip`

`ToolTip` 是组合组件。

至少依赖：

```text
View
Text
```

它附着在目标组件上，开发者不需要手工计算坐标。

## 19.1 API

推荐：

```tsx
<ToolTip content="保存">
  <Button icon="device-floppy" />
</ToolTip>
```

复杂内容：

```tsx
<ToolTip
  content={
    <View>
      <Text weight="bold">保存</Text>
      <Text size="small">保存当前修改</Text>
    </View>
  }
>
  <Button icon="device-floppy" />
</ToolTip>
```

这里：

- `children` 永远是被附着的目标
- `content` 永远是提示内容

避免 children 语义混乱。

## 19.2 当前属性

```text
content
placement
delay
offset
open
defaultOpen
onOpenChange
```

### placement

当前基础值：

```text
top
bottom
left
right
```

以后如有需要可以扩展：

```text
top-start
top-end
...
```

### offset

尺度值：

```tsx
<ToolTip offset={0.5} />
```

表示 `0.5rem`。

### delay

时间裸数字按毫秒（`ms`）解释。

### 受控 / 非受控

```tsx
<ToolTip
  content="说明"
  open={open}
  onOpenChange={setOpen}
>
  ...
</ToolTip>
```

或：

```tsx
<ToolTip
  content="说明"
  defaultOpen
>
  ...
</ToolTip>
```

---

# 20. `Snack`

`Snack` 是组合组件。

可能依赖：

```text
View
Text
Icon?
Button?
```

## 20.1 基础用法

```tsx
<Snack
  text="保存成功"
  variant="success"
  duration={3000}
/>
```

带图标：

```tsx
<Snack
  text="网络连接已断开"
  icon="wifi-off"
  variant="warning"
/>
```

带操作：

```tsx
<Snack
  text="文件已删除"
  action="撤销"
  onAction={undo}
/>
```

## 20.2 当前属性

```text
text

variant
  default
  success
  warning
  danger
  info

icon
duration
persistent
action
onAction
placement
open
defaultOpen
onOpenChange
children
```

### icon

接受：

```text
Tabler name
SVG
```

### duration

时间裸数字按毫秒（`ms`）解释。

### persistent

```tsx
<Snack
  text="正在等待连接"
  persistent
/>
```

表示不自动消失。

### 完整组合

```tsx
<Snack>
  <Icon name="cloud-off" />
  <Text>同步暂时不可用</Text>
  <Button text="重试" />
</Snack>
```

快捷内容与完整组合互斥：

- 使用 `children` 时，不再同时使用 `text`、`icon`、`action`、`onAction`。
- `variant`、`duration`、`persistent`、`placement`、受控状态等仍可用于两种模式。

### placement

当前：

```text
top-left
top-center
top-right
bottom-left
bottom-center
bottom-right
```

多个 Snack 同时存在时，框架负责在对应位置堆叠，不要求用户手算坐标。

---

# 21. `List` 与 `ListItem`

`List` 是组合组件，不是“一个纵向 View”。

它是一个真正的数据列表组合控件。

结构：

```text
List
└─ ListItem × N
   ├─ Icon?
   ├─ Text
   └─ trailing?
```

`ListItem` 同样是组合组件。

## 21.1 数据驱动 API

```tsx
<List
  items={[
    {
      id: "profile",
      text: "个人资料",
      icon: "user",
    },
    {
      id: "settings",
      text: "设置",
      icon: "settings",
    },
  ]}
/>
```

复杂项：

```tsx
<List
  items={[
    {
      id: "wifi",
      text: "Wi-Fi",
      icon: "wifi",
      trailing: <Switch checked={wifi} />,
    },
  ]}
/>
```

## 21.2 ListItem 数据结构

```text
id
text
icon?
secondaryText?
trailing?
disabled?
```

## 21.3 完整组合 API

```tsx
<List>
  <ListItem id="profile">
    <Icon name="user" />
    <Text>个人资料</Text>
  </ListItem>

  <ListItem id="settings">
    <Icon name="settings" />
    <Text>设置</Text>
    <Switch />
  </ListItem>
</List>
```

`items` 与 `children` 是两种列表内容入口，互斥使用。

完整组合模式下，`ListItem.id` 与数据驱动模式中的 `id` 具有相同的列表项身份语义；如果需要给 `ListItem` 的底层 View 设置 DOM `id`，使用 `viewProps.id`。

## 21.4 选择

```tsx
<List
  items={items}
  selected={selected}
  onSelect={setSelected}
/>
```

多选：

```tsx
<List
  items={items}
  selection="multiple"
  selected={selected}
  onSelect={setSelected}
/>
```

`selection`：

```text
none
single
multiple
```

## 21.5 方向与间距

```text
orientation
  vertical
  horizontal
```

```tsx
<List gap={0.5} />
```

`gap={0.5}` 表示 `0.5rem`。

## 21.6 滚动

List 不重新发明滚动 API。

通过 `viewProps` 使用 `View` 的滚动能力：

```tsx
<List
  viewProps={{
    overflow: "auto",
  }}
/>
```

需要滚动时框架自动挂载 Scrollbar。

## 21.7 虚拟化

虚拟化是 List 自己的自然能力：

```tsx
<List
  items={items}
  virtualized
/>
```

不另造 `VirtualList`。

## 21.8 List 当前 API

```text
items
selection
selected
defaultSelected
onSelect
orientation
gap
virtualized
children
```

---

# 22. 主题与设计令牌

主题系统的职责：

> 把高层语义值映射成最终 CSS / 渲染值，并给组件提供统一设计系统。

## 22.1 ThemeProvider

```tsx
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

## 22.2 Theme 顶层结构

当前文档中 Theme 已包含以下顶层配置：

```text
Theme
├─ tokens
├─ components
├─ breakpoints
├─ layers
└─ modes
```

其中 `breakpoints` 对应响应式系统，`layers` 对应语义层级系统，`modes` 对应主题模式；本节继续展开 `tokens` 与 `components`。

### tokens

全局设计词汇：

```text
color
typography
size
spacing
radius
shadow
motion
```

### components

组件级配置：

```text
Button
Input
Switch
Progress
Scrollbar
ToolTip
Snack
List
...
```

## 22.3 示例

以下用于展示 Theme 的结构，不是默认主题全部 token 的穷举；完整默认主题必须覆盖框架所有预定义语义值。

```ts
const theme = {
  tokens: {
    color: {
      primary: "#6d5dfc",
      onPrimary: "#ffffff",
      primaryHover: "#5f50e8",
      primaryActive: "#5144d4",
      secondary: "#8b8b96",
      surface: "#ffffff",
      surfaceHover: "#f5f5f7",
      success: "#20a464",
      warning: "#d78b00",
      danger: "#d94040",
      outline: "#d8d8df",
      focus: "#6d5dfc",
    },

    typography: {
      size: {
        small: 0.875,
        medium: 1,
        large: 1.25,
        xlarge: 1.5,
      },

      weight: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },

    spacing: {
      small: 0.5,
      medium: 1,
      large: 1.5,
    },

    radius: {
      small: 0.375,
      medium: 0.75,
      large: 1,
      full: "9999px",
    },

    shadow: {
      small: "...",
      medium: "...",
      large: "...",
    },

    motion: {
      duration: {
        fast: 120,
        normal: 200,
        slow: 320,
      },

      curve: {
        linear: "linear",
        standard: [0.2, 0, 0, 1],
        emphasized: [0.2, 0, 0, 1],
        enter: [0, 0, 0, 1],
        exit: [0.3, 0, 1, 1],
      },
    },
  },

  components: {
    Button: { ... },
    Input: { ... },
    Switch: { ... },
    Progress: { ... },
    Scrollbar: { ... },
    ToolTip: { ... },
    Snack: { ... },
    List: { ... },
  },
}
```

尺度 token 中的裸数字遵守 `rem` 规则。

时间 token 的裸数字统一按毫秒（`ms`）解释。

---

## 22.4 主题继承

支持局部覆盖：

```tsx
<ThemeProvider
  theme={{
    tokens: {
      color: {
        primary: "#ff4f87",
      },
    },
  }}
>
  <View>
    ...  </View>
</ThemeProvider>
```

继承关系：

```text
默认主题
   ↓
应用主题
   ↓
局部主题
```

未覆盖的值继承外层。

---

## 22.5 深色模式

主题本身拥有模式：

```ts
const theme = {
  modes: {
    light: {
      tokens: { ... },
    },

    dark: {
      tokens: { ... },
    },
  },
}
```

使用：

```tsx
<ThemeProvider theme={theme} mode="dark">
  <App />
</ThemeProvider>
```

支持：

```text
light
dark
system
```

组件本身不需要知道当前是否深色。

---

## 22.6 自定义设计令牌

允许扩展：

```ts
tokens: {
  color: {
    brandPurple: "...",
    editorBackground: "...",
  },
}
```

然后：

```tsx
<Text color="brandPurple">
  ...
</Text>
```

类型系统应能从主题声明推导合法 token。

例如：

```ts
createTheme({
  tokens: {
    color: {
      brand: "#...",
    },
  },
})
```

之后：

```tsx
<Text color="brand" />
```

应获得 TypeScript 与 IDE 自动补全。

---

## 22.7 默认主题

框架必须自带完整默认主题。

因此：

```tsx
<Button text="保存" variant="primary" />
```

在没有 ThemeProvider 的情况下也必须可以直接使用。

ThemeProvider 用于覆盖和品牌化，不是框架运行的必填项。

---

# 23. 组件主题模型

统一组件主题层级：

```text
ComponentTheme
├─ base
├─ sizes
├─ variants
└─ states
```

## 23.1 base

所有实例共有的默认样式。

## 23.2 sizes

尺寸不是单一高度，而是一整套协调设计。

例如：

```ts
Button: {
  sizes: {
    small: {
      viewProps: {
        height: 2,
        paddingX: 0.75,
        gap: 0.375,
      },
      textSize: "small",
      iconSize: "small",
    },

    medium: {
      viewProps: {
        height: 2.5,
        paddingX: 1,
        gap: 0.5,
      },
      textSize: "medium",
      iconSize: "medium",
    },

    large: {
      viewProps: {
        height: 3,
        paddingX: 1.25,
        gap: 0.625,
      },
      textSize: "large",
      iconSize: "large",
    },
  },
}
```

## 23.3 variants

`variant` 不是单纯颜色别名。

它代表完整组件视觉语义。

例如：

```ts
Button: {
  variants: {
    primary: {
      base: {
        viewProps: {
          background: "primary",
          color: "onPrimary",
        },
      },

      hover: {
        viewProps: {
          background: "primaryHover",
        },
      },

      active: {
        viewProps: {
          background: "primaryActive",
        },
      },

      focus: {
        viewProps: {
          outlineColor: "focus",
        },
      },

      disabled: {
        viewProps: {
          opacity: 0.5,
        },
      },
    },
  },
}
```

## 23.4 states

用于多个 variant 共用的状态行为：

```ts
Button: {
  states: {
    disabled: {
      viewProps: {
        opacity: 0.5,
      },
    },

    focusVisible: {
      viewProps: {
        outlineWidth: 0.125,
        outlineColor: "focus",
      },
    },
  },
}
```

variant 可以覆盖公共状态。

---

## 23.5 样式优先级

当前统一顺序：

```text
theme base
→ size
→ variant
→ shared state
→ variant state
→ instance props
→ responsive overrides
→ className
→ style
```

最终总原则：

```text
style > className > 属性体系
```

`style` 是最终原始 CSS 逃生口。

---

# 24. 动画系统

动画是 `ViewProps` 通用能力。

`View` 直接使用；非 `View` 组件通过 `viewProps` 使用。

不单独要求 `<Animation>` 包裹组件。

当前动画模型：

```text
Motion
├─ transition
├─ enter
├─ exit
├─ layoutAnimation
├─ duration
├─ delay
├─ curve
├─ spring
├─ repeat
├─ repeatDelay
├─ direction
├─ keyframes
├─ stagger
├─ interruption
└─ reducedMotion
```

---

## 24.1 Transition

```tsx
<Button
  viewProps={{
    transition: "fast",
    hover: {
      scale: 1.03,
      opacity: 0.9,
    },
  }}
/>
```

精确控制：

```tsx
<View
  transition={{
    properties: ["opacity", "transform"],
    duration: "normal",
    curve: "standard",
  }}
/>
```

---

## 24.2 Enter / Exit

```tsx
<Snack
  viewProps={{
    enter: "fade-up",
    exit: "fade-down",
  }}
/>
```

完整定义：

```tsx
<View
  enter={{
    from: {
      opacity: 0,
      translateY: 1,
    },
    to: {
      opacity: 1,
      translateY: 0,
    },
    duration: "normal",
  }}
/>
```

---

## 24.3 Layout Animation

```tsx
<List
  viewProps={{
    layoutAnimation: true,
  }}
>
  ...
</List>
```

适用于：

- 插入
- 删除
- 重排
- 尺寸变化

也可以：

```tsx
<View
  layoutAnimation={{
    duration: "fast",
    curve: "standard",
  }}
/>
```

---

## 24.4 Curve

曲线是一等公民。

主题中：

```ts
motion: {
  duration: {
    fast: 120,
    normal: 200,
    slow: 320,
  },

  curve: {
    linear: "linear",
    standard: [0.2, 0, 0, 1],
    emphasized: [0.2, 0, 0, 1],
    enter: [0, 0, 0, 1],
    exit: [0.3, 0, 1, 1],
  },
}
```

使用主题曲线：

```tsx
<View
  transition={{
    duration: "normal",
    curve: "standard",
  }}
/>
```

自定义 cubic-bezier：

```tsx
<View
  transition={{
    curve: [0.22, 1, 0.36, 1],
  }}
/>
```

也允许 CSS 原生曲线表达：

```tsx
<View
  transition={{
    curve: "linear(0, 0.4 30%, 1)",
  }}
/>
```

以及 steps：

```tsx
<View
  transition={{
    curve: {
      steps: 6,
      position: "end",
    },
  }}
/>
```

---

## 24.5 Spring

弹簧不是普通时间曲线，不硬塞进 `curve`。

```tsx
<View
  transition={{
    spring: {
      stiffness: 280,
      damping: 24,
      mass: 1,
    },
  }}
/>
```

`curve` 与 `spring` 互斥。

---

## 24.6 延迟与重复

```tsx
<View
  transition={{
    duration: "normal",
    delay: 120,
    curve: "standard",
  }}
/>
```

循环：

```tsx
<Progress
  animation="spin"
  viewProps={{
    animation: {
      duration: 800,
      repeat: "infinite",
      curve: "linear",
    },
  }}
/>
```

统一能力：

```text
delay
repeat
repeatDelay
direction
```

其中 `delay`、`repeatDelay` 以及其他时间裸数字统一按毫秒（`ms`）解释。

`repeat`：

```text
number
"infinite"
```

`direction`：

```text
normal
reverse
alternate
alternate-reverse
```

---

## 24.7 Keyframes

```tsx
<View
  animation={{
    keyframes: [
      { at: 0, scale: 1, opacity: 1 },
      { at: 0.5, scale: 1.08, opacity: 0.8 },
      { at: 1, scale: 1, opacity: 1 },
    ],
    duration: 600,
    curve: "standard",
  }}
/>
```

`at`：

```text
0 ~ 1
```

主题可以提供动画预设：

```tsx
<View animation="pulse" />
```

---

## 24.8 动画编排

支持 stagger：

```tsx
<List
  viewProps={{
    enter: {
      animation: "fade-up",
      stagger: 40,
    },
  }}
/>
```

或者：

```tsx
<View
  enter={{
    animation: "fade-in",
    children: {
      stagger: 50,
      delay: 100,
    },
  }}
>
  ...
</View>
```

---

## 24.9 动画中断

状态快速变化时不能让动画一直排队。

默认规则：

> 新状态立即接管当前动画，并从当前视觉值继续过渡。

可配置：

```tsx
<View
  transition={{
    interruption: "continue",
  }}
/>
```

候选：

```text
continue   // 默认，从当前值继续
restart    // 从新动画起点重来
finish     // 先完成旧动画
```

---

## 24.10 Reduced Motion

```tsx
<ThemeProvider reducedMotion="system">
```

支持：

```text
system
reduce
no-preference
```

默认：

```text
system
```

---

# 25. 可访问性与语义

因为框架完全不暴露 `as`，所以 HTML / ARIA 语义必须由框架自己负责。

核心原则：

> 每个组件自带正确默认语义；用户只在必要时补充或覆盖语义信息。

例如：

```tsx
<Button text="保存" />
<Switch checked={enabled} />
<Input value={name} />
<List items={items} />
```

框架自己知道：

```text
Button          → button 语义
Switch          → switch 语义
Input           → 输入语义
List            → list 语义
ListItem        → listitem 语义
Image           → image 语义
Progress→ progress / busy 语义
```

`View` 默认是无特殊语义的通用节点。

---

## 25.1 View 通用语义 API

高层语义：

```tsx
<View
  role="navigation"
  label="主导航"
/>
```

统一能力：

```text
role
label
description

disabled
required
invalid
busy
expanded
selected
checked
pressed
readOnly

valueMin
valueMax
valueNow
valueText
```

`View` 直接使用完整的通用语义 API。

非 `View` 组件的 `viewProps` 以 `ViewProps` 为基础；如果组件自身已经提供了同义的语义状态属性，则该字段不在该组件的 `viewProps` 中重复暴露，组件自身属性是唯一真值。

例如：

```text
Switch.checked
→ 不再同时提供 viewProps.checked

Input.required
→ 不再同时提供 viewProps.required

Input.readOnly
→ 不再同时提供 viewProps.readOnly
```

这样组件自动映射到底层 HTML / ARIA 时不会出现两个状态来源。

---

## 25.2 组件自动映射状态

例如：

```tsx
<Switch
  checked={enabled}
  viewProps={{
    label: "启用通知",
  }}
/>
```

框架自动获得：

```text
role = switch
checked = enabled
label = 启用通知
```

不要求用户重复写底层 ARIA。

---

## 25.3 关联语义

支持通过框架 `ref` 关联：

```tsx
<Text
  viewProps={{
    ref: titleRef,
  }}
>
  删除账户
</Text>

<Input
  viewProps={{
    labelledBy: titleRef,
  }}
/>
```

当前关联能力：

```text
labelledBy
describedBy
controls
owns
```

优先接受框架 ref，而不是要求用户自己管理 DOM id。

---

## 25.4 焦点

```tsx
<View
  focusable
  autoFocus
  tabIndex={0}
/>
```

ref：

```ts
ref.current.focus()
ref.current.blur()
```

默认焦点语义：

```text
Button  默认 focusable
Input   默认 focusable
Switch  默认 focusable

Text    默认不 focusable
Image   默认不 focusable
View    默认不 focusable
```

---

## 25.5 键盘语义由组件负责

标准组件行为不能要求用户自己拼。

例如 `Button` 自己保证：

```text
Enter
Space
```

可以正确激活。

`Switch` 自己保证切换语义。

`List` 在可选择模式下提供对应键盘导航语义。

公开事件仍然存在，但标准交互不是业务层责任。

---

## 25.6 Progress 的语义

```tsx
<Progress undetermined />
```

自动表达：

```text
loading / busy
未知进度
```

```tsx
<Progress progress={0.68} />
```

自动表达：

```text
当前进度 68%
```

不要求用户再手工重复一份无障碍进度值。

---

# 26. 浮层与层级系统

为了避免 `ToolTip`、`Snack`、后续菜单 / 弹层 / 对话框各自争抢 `z-index`，框架提供语义层级。

## 26.1 Layer

```tsx
<View layer="raised" />
```

主题中定义：

```ts
layers: {
  base: 0,
  raised: 10,
  overlay: 100,
  modal: 200,
  snack: 300,
  tooltip: 400,
}
```

当前语义层：

```text
base
raised
overlay
modal
snack
tooltip
```

## 26.2 zIndex 仍然保留

```tsx
<View zIndex={7} />
```

`layer` 用于框架级语义层次。

`zIndex` 用于局部精确控制。

## 26.3 浮层自动进入对应 layer

例如：

```text
ToolTip
→ 默认 layer="tooltip"

Snack
→ 默认 layer="snack"
```

开发者不需要显式创建 portal 根节点。

React 结构归属仍在原组件树中，但视觉上由框架进入对应浮层层级。

概念：

```text
React 归属
→ 原组件树

视觉归属
→ 对应 layer
```

这样 context、状态、React 关系不需要因为浮层而改变公开 API。

## 26.4 不要求显式使用 Portal

普通用户不需要理解或手工创建：

```html
<div id="overlays">
```

也不要求必须写 `<Portal>`。

如果以后需要高级控制，可以提供高级能力，但它不是 `ToolTip / Snack` 的使用前提。

---

# 27. 当前整体结构

当前框架设计可以整体表示为：

```text
React
│
├─ 函数组件
├─ Hooks
├─ props / state / context
└─ React 生态
    │
    ▼
View
│
│  唯一基础原语
│  直接使用 ViewProps
│
├─ Text
├─ Image
├─ Input
├─ Icon
├─ Switch
├─ Progress
└─ Scrollbar
    │
    ▼
组合组件
├─ Button
├─ ToolTip
├─ Snack
├─ List
└─ ListItem    │
    ▼
非 View 组件
├─ 自身语义属性
└─ viewProps: ViewProps
    │
    ▼
统一组件公开 API
├─ 语义化高层属性
├─ 布局
├─ 视觉
├─ 状态样式
├─ 响应式
├─ 动画
├─ 可访问性
├─ 层级
├─ 主题
└─ ViewProps 中的 style / className 逃生口
    │
    ▼
主路径：DOM-in-Canvas
    │
    └── fallback：DOM + CSS
```

---

# 28. 全局硬约束汇总

以下是当前设计中不能随意破坏的约束。

1. 这是 **React UI 框架**，不是替代 React 的框架。
2. 当前只支持 Web。
3. 只支持函数组件。
4. 组件通过组合构建，不走继承体系。
5. 基础原语只有 `View`。
6. `View` 直接使用 `ViewProps`；所有非 `View` 组件通过 `viewProps` 使用 `View` 的通用能力。
7. 组件是否允许 `children`、允许哪些 `children`，遵循其对应 DOM 元素的内容模型。
8. 基础组件只能由 `View` 构建；这里描述的是 Weave 组件依赖关系。
9. 组合组件可以由 `View`、基础组件、组合组件共同构建。
10. 组件层级判断按真实内部依赖，不靠 children 绕开依赖关系。
11. 不暴露 `as`、`asChild` 或底层 HTML 标签选择权。
12. CSS 是内部实现与语义基础，但公开 API 应提供高层、语义化属性。
13. `style` 保留为原始 CSS 逃生口。
14. 除 `style` 外，所有表示尺度的无单位数字统一按 `rem`。
15. 所有表示时间的裸数字统一按毫秒（`ms`）。
16. 组件公开 `size` 只接受该组件定义的语义尺寸值，不接受数字。
17. 样式最终优先级为 `style > className > 属性体系`。
18. 通用布局、视觉、状态样式、响应式、动画与通用事件能力属于 `ViewProps`；具体组件可以提供自身更自然的高层语义属性。
19. DiC 是默认主路径，不是可选增强插件。
20. DOM + CSS 是 fallback，但默认 API、展示语义和交互语义必须一致。
21. 普通能力不能错误地塞进 Canvas 专属 API。
22. 显式 `canvas` 只用于真正的高级 DiC 绘制 / 合成控制。
23. Scrollbar 是由 `View` 构建的基础组件，不是伪元素样式。
24. Scrollbar 由框架自动插入，不要求开发者显式使用。
25. `selectable` 是 `ViewProps` 通用能力，不是 Text 专属。
26. `Image` 不提供 `decorative`，且遵循对应 DOM 内容模型，不接受 `children`。
27. `Progress` 用 `undetermined` 明确表示未知进度，用 `progress` 表示确定进度。
28. 主题语义值、组件变体、状态样式、响应式覆盖、`className` 和 `style` 有明确优先级。
29. 组件默认承担正确可访问性和键盘语义，不把标准行为推给业务开发者。
30. 浮层使用语义 layer，普通用户不需要手工管理 portal 或全局 z-index。
31. 具体组件已经提供同义语义状态属性时，该状态不在其 `viewProps` 中重复暴露，组件属性作为唯一真值。
32. API 的目标是：AI 易写易读，同时人类易读。