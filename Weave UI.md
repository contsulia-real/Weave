# Weave — React UI 框架设计汇总

> 项目名：Weave
> 状态：当前设计汇总  
> 范围：仅 Web  
> 宿主：React  
> 渲染路径：React DOM + CSS  
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
import { IconDeviceFloppy } from "@tabler/icons-react"

function SaveButton(props) {
  return (
    <Button {...props}>
      <Icon icon={IconDeviceFloppy} />
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

### 2.7 默认设计语言：动效、反馈、开箱即用

Weave 的设计完成度不能只体现在静态截图上。

默认组件必须同时满足：

```text
视觉完成度
+ 即时反馈
+ 连续状态变化
+ 直接操作
+ 开箱即用
```

动效不是装饰层，而是组件状态语义的一部分。

设计规则：

- 用户产生输入后，应尽快看到可感知反馈；不要等待完整业务状态变化后才反馈。
- 连续输入优先采用连续反馈。拖动、滚动、进度等不能退化为离散跳变。
- 组件应尽量让视觉变化与用户动作形成直接因果关系。
- 默认组件必须已经具有完整视觉和交互设计，不要求应用再额外补 hover / active / focus / drag 动效才能“看起来像成品”。
- 动效必须服务于状态、方向、层级、直接操作或确认感；不为“热闹”而增加无意义运动。
- 不同组件应采用最符合自身语义的反馈方式，不允许把一种动画机械复制到所有组件。

典型映射：

```text
Button
→ hover 轻微抬起
→ press 下沉、厚度收缩
→ release 回弹

Switch
→ 关闭态 track 不填充背景，只保留轻微凹槽
→ 开启态 track 使用 primary 强调色
→ thumb 使用轻微突起表达可操作层级
→ thumb 可直接拖动
→ 拖动时圆形核心先明显缩小，并从运动反方向拉出同色拖尾
→ 拖尾长度随拖动距离增长，到状态临界点封顶
→ 松手后拖尾消失、圆形核心恢复，并按最终状态连续归位

Scrollbar
→ thumb 必须紧跟真实 scrollTop / scrollLeft
→ 高频滚动路径不得用昂贵布局测量拖慢反馈

Input
→ focus / invalid / disabled / editing 状态必须明确且连续
→ multiline scrollbar 与其他可滚动组件使用同一反馈体系

Progress
→ 确定进度变化有一次连续过渡
→ 不确定进度保持连续运动，不允许循环边界卡顿
```

全局交互动力学由：

```text
theme.tokens.feedback
theme.tokens.motion
```

提供基础参数。

当前 feedback token：

```text
restDepth
hoverDepth
hoverLift
hoverScale
pressDepth
pressOffset
pressScale
dragScale
```

这些 token 描述全框架共同的“反馈物理量”，但组件可以按自己的语义选择其中一部分使用。

例如：

- Button 使用 depth / lift / press 系列构造实体按压反馈。
- Switch 的拖动形变由自己的 `thumbDragShrink / thumbDragStretch` 描述；全局 motion 只负责松手后的恢复节奏，不照搬 Button 或 Scrollbar 的缩放反馈。
- Scrollbar 可以使用 `hoverScale / dragScale` 增强 thumb 抓取反馈，但核心仍然是边缘可命中、位置跟手和低延迟。

`prefers-reduced-motion: reduce` 下仍必须保留状态可辨识性和直接操作结果，但应移除非必要的自动位移动画、弹性过渡和持续运动。

---

## 3. DOM + CSS 渲染架构

### 3.1 单一渲染路径

Weave 只维护一条渲染路径：

```text
React / Weave 组件
→ 真实 HTML / DOM
→ CSS
→ 浏览器原生 layout / paint / compositing
```

框架不提供第二套 Canvas renderer、custom renderer 或渲染 fallback。HTML / DOM / CSS 是组件视觉、布局与交互的唯一真值。

### 3.2 React 直接渲染真实 DOM

Weave 不提供 React custom renderer，不使用 `react-reconciler` 构造私有 host tree。

组件正常产生真实 DOM：

```text
View     → div
Text     → span
Image    → img
Input    → input / textarea
Button   → button
...
```

因此：

- CSS layout 与 compositing 由浏览器负责；
- 文本 shaping、换行、双向文字、字体与 emoji 由浏览器负责；
- Input / textarea、selection、clipboard、IME 由浏览器负责；
- DOM event、pointer、keyboard 与 focus 由浏览器负责；
- scrolling 与原生控件行为由浏览器负责；
- ARIA / accessibility tree 由真实 DOM 负责。

### 3.3 `createRoot` 直接创建 React DOM root

公开入口：

```tsx
const root = createRoot(container)
root.render(<App />)
```

内部直接使用 `react-dom/client.createRoot(container)`。业务不需要选择 renderer，也没有 feature detect、renderer fallback 或渲染模式切换。

### 3.4 禁止重新实现浏览器

以下内容不得在 Weave 中另造一套平行实现：

- View tree layout engine；
- flex / grid / absolute 布局器；
- 文本测量、换行、ellipsis、shaping；
- Image intrinsic layout；
- pointer / keyboard event bubbling 系统；
- focus / Tab 系统；
- ARIA semantic mirror；
- Input editor / IME / selection bridge；
- React custom reconciler；
- 为组件手工复刻浏览器已经提供的 HTML / CSS 行为。

若某项能力可以由标准 HTML / CSS / DOM 表达，应优先使用浏览器原生能力，而不是建立第二套渲染语义。
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

面向 Weave 使用者的基础原语只有一个：

```text
View
```

`View` 是用户编写界面时直接使用的公开基础组件。它承载完整的 `ViewProps` 通用能力，并通过内部的 `useViewHost` 落到真实 DOM 宿主。

`useViewHost` 不属于公开组件层，也不是第二个基础原语。它是 Weave 自己实现组件时复用 `View` 通用能力的底层机制。`Text`、`Image`、`Input`、`Button` 等组件可以通过 `useViewHost` 直接把这些通用能力应用到最合适的真实 DOM 元素，而不需要为了复用能力额外包一层 `<View>`。

本文后续所说的 **ViewHost**，指通过这套内部宿主机制承载 `View` 通用能力的真实 DOM 宿主。

### 5.2 基础组件

基础组件的硬性规则：

> 基础组件必须通过 `useViewHost` 复用 `View` 的通用能力；它们可以直接承载与自身语义匹配的真实 DOM 元素，不要求在 DOM 中嵌套一个 `<View>`。

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
Radio
Checkbox
Progress
Scrollbar

Flex
Row
Column
Grid
Stack
Absolute
```

其中 `Flex / Row / Column / Grid / Stack / Absolute` 是正式布局组件。它们是对公开 `View` 布局能力的约束封装，不增加第二套布局引擎，也不增加额外 DOM 层。

### 5.3 组合组件

组合组件同样可以通过内部 `useViewHost` 直接承载自己的真实 DOM 宿主，并可以组合以下任意公开组件：

```text
View
基础组件
其他组合组件
```

当前组合组件：

```text
Button
Link
Badge
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
├─ useViewHost → <button>
└─ Text
```

`Button` 自己通过 `useViewHost` 复用 `View` 的通用宿主能力，同时内部真实依赖 `Text`，所以它不是基础组件，而是组合组件。

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

> 面向 Weave 使用者的唯一公开基础原语，也是编写通用界面节点的统一入口。

Weave 内部通过 `useViewHost` 抽取并复用 `View` 的通用宿主能力。其他组件最终建立在这套共同能力模型之上，但不要求实际渲染一个 `<View>` DOM 包装层。

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

基础组件只在 ViewHost 通用能力之上增加自身特有能力。

例如：

```text
Text   = ViewHost 通用能力 + 文本能力
Image  = ViewHost 通用能力 + 图像能力
Input  = ViewHost 通用能力 + 输入能力
Icon   = ViewHost 通用能力 + 图标能力
Switch = ViewHost 通用能力 + 开关行为
```

---

## 6.2 布局策略

`View.layout` 仍然是底层布局能力和兼容逃生口，但业务代码的正式布局入口是布局组件：

```text
Flex      → View layout="flex"
Row       → View layout="flex" direction="row"
Column    → View layout="flex" direction="column"
Grid      → View layout="grid"
Stack     → View layout="stack"
Absolute  → View layout="absolute"
```

这些组件最终都只渲染一个 `View` 对应的 `<div>`，不增加 wrapper。`Row / Column` 锁定自己的方向，`Grid / Stack / Absolute` 锁定自己的 layout；`Flex` 保留完整 direction 能力。响应式、状态、尺寸、间距、事件、ARIA、scrollbar 等其他能力继续直接继承 `View`。

推荐业务代码优先写：

```tsx
<Row gap={1} align="center" />
<Column gap={1} />
<Grid columns={3} gap={1} />
<Stack align="center" />
<Absolute />
```

需要响应式切换 flex 方向时使用 `Flex`：

```tsx
<Flex
  direction="column"
  md={{ direction: 'row' }}
/>
```

`View layout="..."` 仍然可用，但不再是一般业务布局的首选写法。

Weave 自身必须 dogfood 正式布局组件：Playground、示例页以及组合组件中的一般布局应使用 `Flex / Row / Column / Grid / Stack / Absolute`。裸 `View layout="flex|grid|stack|absolute"` 只允许保留在这六个布局组件自己的实现边界，或确有底层实现理由且无法用正式布局组件表达的内部基础设施中；不能为了省事在业务/示例代码里继续回退到裸布局 View。

组件是否能够实际承载子项布局，遵循其对应 DOM 元素的内容模型。

当前底层公开模型：

```text
layout
├─ flex
├─ grid
├─ stack
└─ absolute
```

### Flex

```tsx
<Flex
  direction="column"
  wrap={false}
  gap={1}
  align="stretch"
  justify="start"
/>
```

高频固定方向直接使用：

```tsx
<Row gap={1} />
<Column gap={1} />
```

Playground 对 `Flex` 的验证必须体现它作为通用 flex 容器的可配置性：使用固定宽度、多个固定宽度子项与 `wrap`，让换行行为肉眼可见；不能只做一个与 Row 看起来完全一样的横排示例。

`Column` 则必须明确验证纵向主轴：示例使用足够高的固定容器、`align="end"` 和 `justify="space-between"`，让三个子项从上到下拉开明显距离并沿交叉轴靠右。容器高度必须留下真实剩余空间，不能让三个子项几乎塞满后导致 `space-between` 肉眼不可辨。这样可以直接区分 `Column` 与普通 Row/Flex。

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
<Grid
  columns={3}
  rows="auto"
  gap={1}
/>
```

也允许更精确表达：

```tsx
<Grid
  columns="1fr 2fr 1fr"
  rows="auto 1fr"
/>
```

### Stack

```tsx
<Stack
  width={8}
  height={4}
  align="center"
  justify="center"
>
  <View width="fill" height="fill" />
  <Text>Overlay</Text>
</Stack>
```

`Stack` 必须建立一个覆盖自身完整尺寸的单一 stacking plane：DOM/CSS 后端固定使用 `grid-template-columns: minmax(0, 1fr)` 与 `grid-template-rows: minmax(0, 1fr)`，所有直接子项进入 `grid-area: 1 / 1`。因此显式 `width / height` 不得被内容尺寸压缩。Playground 的 Stack 示例必须使用至少三层可辨识内容：第一层 `width="fill" height="fill"` 明确铺满整个 stacking plane，第二层使用较小尺寸独立居中，第三层文字叠在最上层；禁止再用“背景 + 单行文字”这种无法验证 fill 是否真实生效的示例。

在 `Stack` 中，`align` 控制子项在 stacking plane 内的纵向 `align-items`，`justify` 控制子项的横向 `justify-items`；它不能复用普通 Grid 的 `justify-content` 语义去移动或压缩整个 grid track。响应式和交互状态下的 `justify` 也遵循同一 item-alignment 语义。

用于层叠子组件。

### Absolute

```tsx
<Absolute>
  <View
    top={1}
    right={1}
    width={4}
    height={4}
  />
</Absolute>
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

DOM + CSS 是唯一实现路径，所有公开语义都由这一路径实现。

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

结构化 `Gradient` 直接使用 Weave 的渐变对象；图像和 SVG 使用合法的 CSS `mask-image` 字符串（例如 `url(...)`，包括 SVG fragment / data URL）。

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

breakpoint 遵循主题的正常继承与深合并规则。自定义名称会加入当前主题已有断点；同名断点覆盖上层 / defaultTheme 的值，而不是要求整组替换。

例如：

```ts
createTheme({
  breakpoints: {
    md: 52,      // 覆盖 defaultTheme.md = 48
    compact: 36, // 新增
    wide: 72,    // 新增
  },
})
```

当前有效 breakpoint 会按数值从小到大参与响应式级联，而不是依赖对象声明顺序。

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

`View`、所有组件的 `viewProps`、以及支持高层响应式语义的组件（当前包括 `Text`）都读取当前 ThemeProvider 的有效 breakpoint 集合。DOM 实现不把 `sm / md / lg / xl` 的媒体查询写死在静态 stylesheet 中，而是根据当前主题生成对应的低 specificity breakpoint class。

嵌套 ThemeProvider 可以具有不同 breakpoint 配置；生成的响应式规则只作用于带有对应 breakpoint class 的组件实例，不污染外层或相邻主题作用域。

只有当前有效主题中存在的 breakpoint 名称才参与响应式解析。未激活的响应式对象属性不会透传到真实 DOM。

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
compact / wide / ...
→ viewport breakpoint

containerMd / containerLg / ...
containerCompact / containerWide / ...
→ 最近响应式容器
```

container breakpoint 名称由 viewport breakpoint 名称派生：

```text
compact
→ containerCompact

wide
→ containerWide
```

它们使用同一组主题 breakpoint 数值，但 viewport 通过 `@media` 判断，container 通过 `@container` 判断。

---

## 9.3 响应式覆盖高层组件 API

响应式不是只能覆盖 CSS 属性。

可以直接覆盖组件语义属性，并使用当前主题中的自定义 breakpoint 名称：

```tsx
<Text
  size="small"
  md={{
    size: "medium",
  }}
  wide={{
    size: "large",
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
> 实例属性 class
> 当前主题组件样式
> defaultTheme 组件样式
```

框架语义样式不通过 React 内联 `style` 注入。ThemeProvider 的主题变量、组件主题解析结果、`ViewProps`、Text / Image 等组件语义属性，以及 Progress 这类实例运行时值，都解析为框架生成的 class。

但是用户显式传入的 `style` 不参与这套 class 生成流程，也不允许被哈希或转换为生成 class。它必须原样保留为宿主 DOM 元素的真实 `style=""`，作为最高优先级的原始 CSS 逃生口。

每个组件同时必须保留稳定、可读的身份 class。生成 class 只能附加样式信息，不能取代组件身份。

例如 Switch 实例的 class 结构应类似：

```text
weave-view
weave-switch
weave-switch--medium
weave-switch-theme-*
weave-props-*
user-class
```

Text / Image / Input 等也分别保留：

```text
weave-view weave-text ...
weave-view weave-image ...
weave-view weave-input ...
```

Text / Image 自身无法静态枚举的语义值使用组件专属生成 class，例如：

```text
weave-text-props-*
weave-image-props-*
```

组件默认视觉样式与框架生成 class 使用低 specificity 的 `:where(...)` 选择器。实例属性与组件主题使用不同变量层，基础样式固定优先读取实例属性变量，再回退到组件主题变量，因此不依赖样式表插入先后顺序。

用户自己的普通 `className` 具有高于 `:where(...)` 的选择器权重，因此可以覆盖框架主题与属性 class；显式 `style` 仍然保持最高优先级。

例如：

```tsx
<View
  width={20}
  className="custom"
  style={{ width: "10px" }}
/>
```

其有效覆盖关系为：

```text
defaultTheme
→ 当前 ThemeProvider
→ width={20} 生成的实例属性 class
→ custom
→ style={{ width: "10px" }}
```

渲染后端为同步真实几何而产生的内部测量值不属于公开样式级联。例如自动 Scrollbar 的位置、滚动 thumb 位移等可以由后端直接同步；它们不能承载组件默认视觉，也不能替代主题、实例属性、`className` 或用户显式 `style`。

属性体系内部继续按照主题、组件变体、状态、实例属性与响应式覆盖规则解析。

`style` 的规则：

- 遵循 React / CSS 本身
- 用户显式传入的 `style` 必须保留在真实 DOM `style=""` 属性上
- 不转换为 `weave-props-*`、组件 props class 或主题 class
- 不参与框架哈希 class 的生成
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
typo
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

### typo

`typo` 是完整的排版层级，不是少量快捷别名。默认 type scale 为：

```text
display-large
display-medium
display-small

headline-large
headline-medium
headline-small

title-large
title-medium
title-small

body-large
body-medium
body-small
body-xsmall

label-large
label-medium
label-small
```

每个 typo 同时定义 `fontSize / fontWeight / lineHeight / letterSpacing`。整套定义来自 `theme.tokens.typography.styles`，因此品牌主题可以替换任意层级，而不是把 preset 写死在 Text renderer 中。

默认 label scale 用于 Button 等紧凑控件，字号刻意低于正文层级，避免控件文字在视觉上压过内容：

```text
label-small  = 0.75rem   // 12px
label-medium = 0.8125rem // 13px
label-large  = 0.875rem  // 14px
```

Playground 的普通说明文字使用 `body-medium`；`body-small` 保留给 caption / meta 信息；`body-xsmall` 用于 ToolTip 这类需要明显低于控件标签的紧凑辅助信息。

显式传入的文本属性优先于 `typo`，因此可以只覆盖需要调整的一项：

```tsx
<Text typo="title-medium" weight="bold">
  标题
</Text>
```

响应式可以直接切换完整排版层级：

```tsx
<Text
  typo="body-small"
  md={{ typo: "body-large" }}
>
  ...
</Text>
```

标题语义与视觉排版保持分离，通过统一语义层表达：

```tsx
<Text
  typo="display-large"
  viewProps={{
    role: "heading",
    level: 1,
  }}
>
  Weave
</Text>
```

DOM 实现将 `level` 映射到 `aria-level`。

### size

`size` 是对 typo 的局部覆盖入口，也可以脱离 typo 单独使用：

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
import { IconArrowRight } from "@tabler/icons-react"

<Text>
  查看
  <Icon icon={IconArrowRight} />
</Text>
```

---

# 12. `Icon`

`Icon` 是基础组件。

图标来源确定为：

```text
Tabler Icons React 组件
+
自定义 SVG
```

它仍然只能建立在 `View` 上。

## 12.1 Tabler Icons

Weave 不维护完整 Tabler 图标 registry，也不提供 `name="settings"` 这类运行时字符串查表。

使用 Tabler Icons 时，由调用方按照 Tabler 官方 React 包的方式静态导入具体图标组件，再传给 Weave：

```tsx
import { IconSettings } from "@tabler/icons-react"

<Icon
  icon={IconSettings}
  size="medium"
  stroke="regular"
/>
```

其他图标同样直接静态导入：

```tsx
import {
  IconArrowLeft,
  IconSearch,
  IconUser,
} from "@tabler/icons-react"

<Icon icon={IconArrowLeft} />
<Icon icon={IconSearch} />
<Icon icon={IconUser} />
```

这样由 `@tabler/icons-react` 自身的 ES module 导出与应用 bundler 负责 tree-shaking；Weave 不复制 Tabler SVG，不生成全量图标名称联合，也不把完整图标表打进自身运行时。

Weave 对传入的图标组件只负责统一应用自身的 `size`、`stroke`、颜色继承、布局与可访问性规则。

### Outline / Filled

Tabler 的 outline 与 filled 是不同的 React 组件导出，不由 Weave 的 `Icon` 在运行时切换。

命名规则：

```text
outline → Icon{Name}
filled  → Icon{Name}Filled
```

例如：

```tsx
import {
  IconSearch,
  IconSearchFilled,
} from "@tabler/icons-react"

<Icon icon={IconSearch} />
<Icon icon={IconSearchFilled} />
```

因此 Weave 不额外提供 `variant="outline" | "filled"`。这样可以继续保持直接静态导入和 tree-shaking，也不会要求 Weave 建立 outline / filled 配对 registry。

`stroke` 主要影响 outline 图标的线条粗细；filled 图标的实体形状由图标本身决定。两种风格都继承当前颜色。

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

`icon` 与 `svg` 互斥。

## 12.3 Icon 自身核心属性

```text
icon
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

当前默认映射：

```text
size
small   → 0.875rem
medium  → 1rem
large   → 1.25rem
xlarge  → 1.5rem

stroke
thin    → 1.5
regular → 2
bold    → 2.5
```

默认：

```text
size = medium
stroke = regular
```

Icon 的宿主节点使用内联 `span`，因此可以合法嵌套在 `Text` 中。内部真实 SVG 默认 `aria-hidden`，Icon 本身默认作为装饰内容；当 `viewProps.label` 存在而未显式指定 `role` 时，宿主自动使用 `role="img"` 并承载可访问名称。

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

单行与多行输入共享同一套组件主题和 View 通用能力。

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
disabled
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

DOM 下仍然使用真实 `<textarea>`，保留浏览器原生文本编辑、选择、输入法与 `scrollTop / scrollLeft` 行为。

当 textarea 内容溢出时，原生滚动条视觉隐藏，并自动挂载与普通可滚动 View 相同的 Weave `Scrollbar`。因此 multiline Input 不再显示浏览器默认 scrollbar。

`viewProps.scrollbar` 可以继续配置该自动 Scrollbar。

## 14.3 默认视觉主题

Input 的默认控件视觉来自：

```text
theme.components.Input
```

而不是要求每个使用点重复写 padding / border / radius。

默认中等控件语言与 Button 使用同一组 control baseline；文字不再单独维护 font size / line-height，而是直接选择完整 typo：

```text
minHeight   = 2.5rem
radius      = 0.75rem
border      = 0.0625rem solid outline
background  = surface
typo        = body-large
focus       = 0.125rem focus outline
focusOffset = 0.0625rem
```

input value、textarea value 与 placeholder 共享该 typo 的 `fontSize / fontWeight / lineHeight / letterSpacing`。

单行与 multiline 使用同一套：

- background
- foreground / placeholder color
- border
- radius
- padding
- typography
- focus
- disabled visual state

`disabled`、`required`、`readOnly` 等语义状态由 Input 自己的高层属性提供，不在 `viewProps` 中重复建立第二真值。其他实例 `viewProps` 仍然按统一优先级覆盖组件主题。

## 14.4 Input 与 `viewProps`

布局、尺寸、视觉逃生口、事件和 Scrollbar 配置继续通过 `viewProps`：

```tsx
<Input
  placeholder="Name"
  viewProps={{
    width: "fill",
  }}
/>
```

精确覆盖仍然可以：

```tsx
<Input
  viewProps={{
    radius: "large",
    className: "custom-input",
    style: {
      minHeight: "48px",
    },
  }}
/>
```

## 14.5 基础 Input 不内建组合内容

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

Switch 的视觉仍由 Weave View 样式系统驱动，但语义宿主使用真实 labelable button：

```text
Switch
├─ <button type="button" role="switch">  // track + 可绑定语义宿主
│  └─ View                                // thumb
└─ <label> + visible label                // 仅传 label 时出现
```

这样既保留 track / thumb 的 Weave 视觉与拖动行为，又让 `label` 使用浏览器原生 label activation，而不是额外模拟一次点击。

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
disabled
label
size
```

交互同时支持：

- 点击 track / thumb 切换
- Space / Enter 键盘切换
- Switch 的 thumb drag feedback 是所有切换路径共享的视觉语言：thumb 的纵向基准始终使用 `top: 50% + translateY(-50%)`，静止、checked、自动 drag、手动 drag 都只能改变水平位移和宽高，不能各自计算不同的纵向位置；pointer down 在 thumb 或 track 任意位置都立即进入 `thumbDragShrink` 形变；实际拖动时继续按距离实时拉长并跟手，释放时以轨道中点决定最终状态；普通点击、点击 label、Space / Enter 等没有手动拖动距离的切换，也必须自动播放同一套 shrink → stretch → 到达另一端 → 恢复圆形的完整轨迹，不能退化成普通圆点平移
- 拖动完成后产生的兼容 click 不得再次反向切换
- disabled 状态下点击、键盘与拖动都不能改变状态
- `label` 是可见且可点击的真实绑定标签；Switch 宿主使用可 label 的原生 `<button type="button" role="switch">`，点击 label 与点击控件本体等价，同时 label 参与 accessible name；Switch 控件与可见 label 默认保留 `0.5rem`（8px）间距

拖动中的 thumb 位置属于组件内部交互几何，可由渲染后端直接同步；它不是用户显式 `style`，也不改变公开样式优先级。拖动期间不对 pointer movement 做缓动，保证直接跟手；松手后的归位才允许使用主题 motion curve。

### size

```text
small
medium
large
```

## 15.2 `Radio` 与 `Checkbox`

`Radio` 与 `Checkbox` 都是基础组件，并使用真实原生输入控件，而不是用 `div role=...` 模拟：

```text
Radio    → <input type="radio">
Checkbox → <input type="checkbox">
```

公开 API：

```text
checked
defaultChecked
onChange
disabled
label
group
value
size
viewProps
```

`group` 是框架级分组键，并直接映射到原生 `name`：

```tsx
<Radio group="theme" value="light" />
<Radio group="theme" value="dark" />

<Checkbox group="permissions" value="read" />
<Checkbox group="permissions" value="write" />
```

规则：

- 相同 `group` 的 Radio 属于同一个原生 radio group，由浏览器负责互斥、键盘与表单语义；
- 不同 `group` 的 Radio 相互独立；
- 相同 `group` 的 Checkbox 属于同一个 checkbox group，原生 `name` 相同，但每一项的 checked 状态仍然独立；
- `group` 不创建额外包装 DOM，也不引入单独的 `RadioGroup` / `CheckboxGroup` 组件；
- `checked / defaultChecked / onChange` 延续 Switch 的受控 / 非受控布尔状态模型；
- `disabled` 是组件自己的高层属性，并落到真实原生 input；
- `label` 是可见的原生 `<label>` 绑定内容；点击 label 文本必须直接触发对应 Radio / Checkbox 状态变化，不能依赖调用方自己补 `onClick`；
- `small / medium / large` 三档默认尺寸分别为 `1.125rem / 1.375rem / 1.625rem`（18 / 22 / 26px），由 `theme.components.Radio / Checkbox.sizes` 提供；Playground 必须同时展示三档，不能只展示默认 medium。

默认视觉继续使用 Weave 的物理层级语言，但 Radio 与 Checkbox 的 checked 形态不同：

- 未选中时，两者都有 `0.125rem` 实体边界与方向性 inset shadow，形成明确凹陷厚度；hover 加深凹槽，press 再下沉并缩放；
- Radio checked 后，外壳仍然是凹槽，内部 primary 圆点以 `scale(0) → scale(1)` + spring 方式长出来；unchecked 时同一 transition 反向执行 `scale(1) → scale(0)`。默认使用 slow motion token（当前 320ms），保证正反过渡肉眼明确可见；
- Checkbox checked 后，**Checkbox 外壳本身整块铺满 primary**，不存在内部 primary 方块、padding 或第二层填充；
- Checkbox 的 `onPrimary` 对号使用真实 SVG path，并通过 `pathLength + stroke-dasharray + stroke-dashoffset` 从起点到终点画出；unchecked 时同一 320ms path transition 反向把 `stroke-dashoffset` 从 `0` 推回 `1`，同时 checked background 平滑退回未选中 surface；press 时 checkbox 本体与 checkmark 视觉层必须使用完全相同的 `translateY + scale`，禁止再出现长按后勾与方框错位；
- Radio / Checkbox 外围都有独立圆形 state layer。small / medium / large 的 halo 分别为 `2.125rem / 2.375rem / 2.625rem`（34 / 38 / 42px），相对 18 / 22 / 26px 控件本体**每一侧向外扩 8px**。**halo 自己就是 spacing**：shell 的布局尺寸等于 halo 直径，控件居中其中，field 的额外 `gap` 固定为 `0`，因此控件本体到 label 的可见距离只来自 halo 多出来的一侧（当前 8px），禁止再叠加第二份 label gap；
- halo 的 hover 命中属于整个 field：鼠标位于控件、halo 区域或可见 label 文字上时都保持同一个圆形 halo；focus-visible 与 press 继续提高 state layer 强度，checked 时 halo 颜色切到 primary；
- `prefers-reduced-motion: reduce` 下取消 scale、state layer scale 与 path drawing transition，直接显示最终状态；
- 深色模式保持完全相同的结构，只调整 surface、border 和阴影 token。

因此 Checkbox checked 与 Radio checked 不强求同一种几何结构，但都必须保持 Weave 的 tactile depth、press feedback 与状态动效。

---

# 16. `Progress`

`Progress` 是基础组件。

它通过 `useViewHost` 复用 `View` 的通用宿主能力，用来表达确定进度与不确定进度。

状态语义与视觉形态分离：

```text
状态
├─ undetermined
└─ progress

mode
├─ spin
└─ linear

tracked
├─ false
└─ true
```

## 16.1 状态

不确定进度：

```tsx
<Progress undetermined />
```

`mode="spin"` 的不确定动画使用固定弧段并仅通过线性 transform 旋转。运行中的弧段渐变本身保持静态，避免逐帧重绘渐变角度以及周期端点反向造成的卡顿。

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

不确定进度必须持续运动。

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

不确定 `spin` 使用固定弧段并进行线性匀速旋转。

当前实现规则：

```text
固定 conic-gradient 弧段
+ transform: rotate(...)
+ linear
+ infinite
```

运行期间不动态改变渐变起止角度，不使用 `alternate` 弧长伸缩，以避免周期端点速度变化和渐变逐帧重绘造成的顿挫。

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

不确定 `linear` 必须在自身边界内同时裁切 X / Y 两轴，并保持连续的水平运动。实现需要让至少一个前景运动段持续处于可视运动阶段；单个运动段只能在完全离开可视区域后复位，因此循环边界不能出现可见空档、跳变、停顿或越界覆盖相邻内容。

默认：

```text
mode = spin
```

## 16.3 tracked

`tracked` 控制是否显示更浅色的连续轨道。

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

默认 Progress 延续 Switch 的触感语言：track 使用轻微内凹阴影，前景 progress / 不确定运动段使用轻微抬起阴影。深度必须保持克制，不能让细小的进度视觉变成厚重实体；track 与前景阴影均属于 `theme.components.Progress.base`，品牌主题可以覆盖。

## 16.4 speed

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

## 16.5 当前公开能力

```text
undetermined
progress
mode
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

`mode / tracked / size / speed` 的静态默认视觉由低 specificity 的内部 class 提供。

只有运行时连续值，例如确定进度的实际 `progress` 与数字型 `speed`，才允许通过最小化 CSS 自定义属性传递。

---

# 17. `Scrollbar`

`Scrollbar` 是一个特殊的基础组件。

## 17.1 它是复用 ViewHost 通用能力的基础组件

不是：

```css
::-webkit-scrollbar
```

不是 WebKit 伪元素皮肤。

不是单纯的 CSS scrollbar 主题。

它是：

> 框架自己的基础组件；内部通过 `useViewHost` 复用 `View` 的通用能力，并直接操作真实滚动宿主，不依赖浏览器私有 scrollbar 伪元素皮肤。

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
   ├─ HitRegion : View   // 透明命中区，不绘制轨道
   └─ Thumb : View
```

Scrollbar 不再提供可见 track / rail。透明 HitRegion 只负责命中、分页点击与拖动几何，视觉上只存在 thumb。

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

Scrollbar 的默认视觉刻意与 Switch / Progress 区分：它没有可见轨道，也没有凸起阴影，只保留平面的 thumb。hover / drag 仍可改变颜色和横截面尺度，但不会通过 shadow 模拟抬起。

圆角宿主必须为角落保留安全区。右侧 Scrollbar 的运动区从 top-right 圆角结束处开始，到 bottom-right 圆角开始处结束；底部 Scrollbar 同理只占用 bottom-left 与 bottom-right 之间的直线段。DOM 实现根据宿主最终计算得到的四角半径和边框动态求出这个直线区域；圆角越大，可用滚动条长度越短。

局部定制挂在滚动容器上：

```tsx
<View
  overflow="auto"
  scrollbar={{
    size: "medium",
    color: "secondary",
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
radius
opacity
```

不提供 `tracked` 或 `trackColor`；Scrollbar 没有第二套带轨道的视觉模式。

不公开用于篡改默认滚动行为的：

```text
position
direction
dragBehavior
scrollBinding
thumbPosition
visibilityAlgorithm
```

### 17.5 DOM 实现约束

DOM 实现中：

- 原 `View` 仍然是真实原生滚动容器，不额外包裹内容，不改变 flex / grid 子项结构。
- multiline `Input` 的真实 `textarea` 同样可以直接作为 Scrollbar target，不需要外包一层伪滚动容器。
- 滚轮、触摸板、键盘滚动、`scrollTop` / `scrollLeft` 继续使用浏览器原生滚动机制。
- 原生滚动条轨道通过标准 CSS 能力隐藏，不使用 `::-webkit-scrollbar` 作为视觉实现。
- 框架自动挂载由 `View` 语义节点构成的 track / thumb，并与真实滚动位置同步。
- track / thumb 的默认视觉遵循统一 class 优先级规则；几何位置、thumb 长度、滚动进度等连续运行时值允许通过最小化的 inline CSS / CSS 变量同步。
- Scrollbar 必须把“视觉位置”和“交互命中区”分离：可见 rail/thumb 避开 target border 并保留内部 inset，但透明 hit target 必须延伸到 target 的真实外边缘，因此用户把指针贴在边缘时仍能抓住与拖动 thumb。
- hover 必须提供明确的 thumb 颜色反馈；drag 状态可以进一步加深，但不得为了扩大视觉而牺牲边缘命中。
- 高频 target `scroll` 路径只能读取 `scrollTop / scrollLeft` 并更新 thumb transform；不得在每个 scroll event 中重新执行 `getBoundingClientRect()` / `getComputedStyle()` 等布局测量。
- track/thumb 几何只在 resize、theme/layout 改变、DOM 尺寸变化或外层滚动导致 target viewport 位置变化时重新计算。
- document-level scroll 监听必须排除 target 自己的 scroll，避免同一次滚动同时触发位置同步与完整几何重算。
- 自动挂载不能改变用户拿到的 `View` / `Input` ref 所指向的真实滚动元素。

---

# 18. `Button`

`Button` 是组合组件。

真实依赖：

```text
Button
= View 宿主能力
+ Text
+ 可选 Icon
```

DOM 使用真实 `<button type="button">`，不使用 `div role="button"`。

Button 不内建 `loading` 状态。需要阻止重复提交或暂时不可操作时直接使用 `disabled`；需要展示任务进度时，由调用方在布局中组合公开 `Progress`。这样 Button 不再维护一套只服务于“加载中”的特殊内容与状态。

## 18.1 快捷语义 API

```tsx
import { IconDeviceFloppy } from "@tabler/icons-react"

<Button
  text="保存"
  icon={IconDeviceFloppy}
  variant="primary"
  size="medium"
  disabled={false}
  pressed={false}
  viewProps={{
    onClick: save,
  }}
/>
```

快捷入口支持：

```text
text
icon
iconPosition
```

`icon` 接受与 `Icon` 相同的两类来源：

```text
静态导入的 React SVG 图标组件
自定义 SVG ReactElement
```

例如：

```tsx
import {
  IconPlus,
  IconSearchFilled,
} from "@tabler/icons-react"

<Button text="Add" icon={IconPlus} />
<Button
  icon={IconSearchFilled}
  variant="ghost"
  viewProps={{ label: "Search" }}
/>
```

## 18.2 完整 children 组合

```tsx
<Button variant="secondary">
  <Icon icon={IconDeviceFloppy} />
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
- `variant`、`size`、`disabled`、`pressed`、`viewProps` 等不属于内容入口，可用于两种模式。

## 18.3 variant

当前：

```text
primary
secondary
tertiary
ghost
danger
```

默认：

```text
variant = primary
```

variant 的默认视觉由 `theme.components.Button.variants` 提供。

## 18.4 size

```text
small
medium
large
```

默认：

```text
size = medium
```

size 的高度、水平/垂直 padding、内容 gap 和 typo 由 `theme.components.Button.sizes` 提供。

默认三档重新按紧凑控件尺度定义：

```text
small
minHeight = 1.75rem
typo      = label-small

medium
minHeight = 2.125rem
typo      = label-medium

large
minHeight = 2.5rem
typo      = label-large
```

Button 不再自己保存 `fontSize / fontWeight / lineHeight / letterSpacing`。size 只选择一个 typo，由统一 type scale 提供四项排版值；响应式 size 切换时 typo 随 size 一起切换。

也就是旧的 small 视觉尺度成为新的 medium，旧的 medium 成为新的 large；small 重新设计为更紧凑的一档。

## 18.5 iconPosition

```text
start
end
```

默认：

```text
iconPosition = start
```

只有 `icon`、没有 `text` 的快捷入口属于 icon-only Button。icon-only Button 使用当前 size 的 control height 作为最小宽度并清除水平 padding，因此形成稳定的方形点击区域，而不是只留下一个漂浮图标。

## 18.6 disabled

```tsx
<Button
  text="提交"
  disabled
/>
```

`disabled` 是 Button 自己的高层属性，不放在 `viewProps` 中重复暴露。框架同时映射真实 `button.disabled = true` 与 `aria-disabled="true"`，阻止点击与键盘激活，并使用统一 disabled 主题状态。

## 18.7 pressed

`pressed` 用于需要维持按下状态的 toggle button：

```tsx
<Button
  text="固定"
  pressed={pinned}
  viewProps={{
    onClick: () => setPinned(!pinned),
  }}
/>
```

`pressed` 是受业务控制的持久状态，不是点击事件本身。未传 `pressed` 时 Button 是普通按钮，不生成 `aria-pressed`；显式 `pressed={false}` / `pressed={true}` 时分别映射 `aria-pressed="false"` / `aria-pressed="true"`，表达 toggle button 语义。

视觉上 `pressed=true` 直接维持与瞬时 pointer press 相同的 `activeBackground / pressOffset / pressScale / pressDepth`，不会另造一套 pressed 设计语言；hover 也不会把已按下的 Button 再抬起来。`disabled` 优先于 `pressed`。

## 18.8 默认交互反馈

Button 是 Weave “反馈优先”设计语言的典型组件之一。

默认状态序列：

```text
rest
→ 有实体厚度

hover
→ 轻微抬起并增加深度

pointer press (`:active`)
→ 向下位移
→ 深度明显收缩
→ 轻微缩放

release
→ 使用 spring curve 回到 rest / hover 状态
```

这套反馈模拟“可按下实体”，与 Button 的行为语义一致。

具体动力学不写死在 Button 私有常量中，而读取：

```text
theme.tokens.feedback
theme.tokens.motion
```

因此 Button 只解释全局 feedback token，不拥有另一套孤立的物理系统。

`viewProps.active` 只表示 `:active` 样式覆盖，不是 Button 的持久“激活值”。Button 的按压态由 pointer / keyboard 交互瞬时产生。实例状态样式仍然高于组件默认 press 表现。

`prefers-reduced-motion: reduce` 下保留颜色、阴影等可辨识状态变化，但移除自动位移 / 缩放动画。

## 18.9 ThemeProvider

Button 的默认视觉属于组件主题：

```ts
createTheme({
  components: {
    Button: {
      sizes: {
        medium: {
          minHeight: 3,
          paddingX: 1.25,
        },
      },
      variants: {
        primary: {
          background: "success",
        },
      },
    },
  },
})
```

实例 `viewProps` 的通用 View 能力仍按统一优先级覆盖组件主题。

## 18.9 响应式高层语义

`size` 与 `variant` 支持当前 ThemeProvider 的动态 viewport breakpoint：

```tsx
<Button
  text="Continue"
  size="small"
  variant="secondary"
  md={{
    size: "large",
    variant: "primary",
  }}
/>
```

自定义 breakpoint 名称同样适用：

```tsx
<Button
  text="Continue"
  compact={{
    size: "large",
    variant: "danger",
  }}
/>
```

响应式 Button 语义读取当前 ThemeProvider 的有效 breakpoint，不写死 `sm / md / lg / xl` 数值。

## 18.10 viewProps

Button 的通用布局、视觉、状态、事件、响应式 View 能力继续通过 `viewProps` 使用：

```tsx
<Button
  text="保存"
  viewProps={{
    width: "fill",
    className: "save-button",
    style: {
      minWidth: "12rem",
    },
  }}
/>
```

统一优先级仍然保持：

```text
style
> user className
> instance View props
> Button semantic props / current ThemeProvider component theme
> defaultTheme
```

---

# 18A. `Link`

`Link` 是组合组件，语义宿主必须是真实 `<a>`，不能用 Button / div 模拟导航。

核心 API：

```text
href        // required
text        // optional display text
hideIcon    // optional, default false
hideUnderline // optional, default false
target      // optional, native anchor target
viewProps
```

显示规则：

```tsx
<Link href="https://example.com/docs" />
// 显示：https://example.com/docs + link icon

<Link
  href="https://example.com/docs"
  text="Documentation"
/>
// 显示：Documentation + link icon

<Link
  href="/docs"
  text="Docs"
  hideIcon
/>
// 显示：Docs
```

- `text` 未提供时，直接显示 `href`；提供后只改变可见文字，不改变真实 `href`。
- 默认在内容末尾追加一个装饰性 link icon；icon 不进入 accessible name。只有 `hideIcon` 才隐藏。
- `hideUnderline` 为 `true` 时完全隐藏底部 link marker；它不影响文字、icon、focus outline 或原生 `<a>` 导航行为。
- `target` 直接写到真实 `<a target>`，例如 `_self`、`_blank`；框架不重写浏览器原生导航行为，也不自动添加或修改 `rel`。
- 其他通用事件、ARIA、className、style 和布局逃生口继续通过 `viewProps`。

Link 默认使用一条底部 link marker 表达“这是链接”。由于真实 `border-bottom` 无法只占部分宽度，DOM/CSS 后端使用 `::after` 绘制等价底边线；传 `hideUnderline` 时该 marker 完全不生成可见结果：

```text
rest    45%
hover   60%
active  80%
```

底边线从左侧起始，并使用 `theme.tokens.motion.duration.normal / curve.standard` 平滑改变宽度。`prefers-reduced-motion: reduce` 下取消宽度 transition，但仍直接切换到对应 45 / 60 / 80% 状态。

默认颜色、icon 尺寸、内容间距、底线颜色 / 厚度 / offset 与 focus outline 来自 `theme.components.Link.base`。默认颜色和底线都使用 `primary` token，因此 Light / Dark 自动沿主题变化。

---

# 18B. `Badge`

`Badge` 是附着在任意内容边界上的组合角标，不创建 viewport overlay，也不要求调用方手写 absolute 坐标。

核心 API：

```text
children     // required, 被 Badge 附着的内容
placement    // optional, default top-right
visible      // optional, default true；控制 Badge 本体显隐并保留 children
text         // normal 模式 required
dot          // optional; true 时只显示小圆点
viewProps
```

`placement` 支持八个边缘位置：

```text
top-left     top     top-right
left                  right
bottom-left  bottom  bottom-right
```

默认是 `top-right`。Badge 以被包裹目标的**实时视觉边界**为锚点，并以目标边缘向外偏移自身的一半，因此不占用被包裹内容的正常布局空间。目标因 hover、press、transition、animation 或其他 transform 发生视觉位移 / 缩放时，Badge 必须继续跟随实际目标边界，而不是停在外层包装容器的静态 layout box 上。

正常文本模式：

```tsx
<Badge text="8" placement="top-right">
  <Button text="Inbox" />
</Badge>
```

小圆点模式：

```tsx
<Badge dot placement="bottom-right">
  <Button text="Online" />
</Badge>
```

规则：

- 不传 `dot` 时是正常 Badge，必须提供 `text`；`text` 可以是 ReactNode。
- `dot` 为 `true` 时只显示小圆点，不显示文字；类型层不允许同时传 `text`。
- dot 是纯视觉状态点，因此自身 `aria-hidden=true`；正常文本 Badge 保留可读文本。
- Badge 默认 `pointer-events: none`，不会盖住或拦截被附着控件的点击、hover、focus、drag。
- `visible` 默认为 `true`。设为 `false` 只隐藏 Badge 本体，不卸载或隐藏被包裹的 `children`。
- Badge 出现时默认播放 popup（opacity + scale，带轻微 overshoot）；消失时先播放 dismiss（fade + shrink），完成后再卸载 Badge DOM。`reducedMotion=reduce` 时跳过这两段动画。
- Badge 不使用 ToolTip / Snack 的 portal 或 layer region；它仍在本地包装容器内做定位，但锚点坐标来自被包裹目标的实时视觉边界。

默认主题来自 `theme.components.Badge.base`：正常 Badge 使用 `primary / onPrimary`，并用 `surface` 边界把角标与复杂背景分离；默认高度 `1.25rem`，dot 直径 `0.625rem`。背景、文字、边界、圆角、padding、dot 尺寸、shadow 与 typography 均可由主题覆盖。

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
  <Button icon={IconDeviceFloppy} />
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
  <Button icon={IconDeviceFloppy} />
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

## 19.3 默认行为

当前默认值：

```text
placement = top
delay = 500ms
offset = 0.5rem
layer = tooltip
```

触发规则：

- pointer 进入目标后按 `delay` 打开；
- focus 进入目标后按同一 `delay` 打开；
- pointer 与 focus 任一仍停留在目标内时保持打开；
- 两者都离开后立即关闭；
- `Escape` 关闭当前 ToolTip；
- ToolTip 默认 `pointer-events: none`，它不是交互式弹层。

定位由框架自动根据目标真实 `getBoundingClientRect()` 计算，并在 viewport resize、任意祖先 scroll、目标尺寸变化时更新。ToolTip 使用 `position: fixed`，业务不手工提供坐标。

ToolTip 不增加会改变目标布局的可见包裹层。内部 anchor 只使用 `display: contents` 找到目标真实 DOM。

## 19.4 浮层、主题与可访问性

ToolTip 由框架内部 portal 到 document body，普通用户不创建 portal root。React context 仍按原组件树继承；portal 内重新建立当前 ThemeProvider 的 CSS 变量作用域，因此主题 token 与局部主题不会丢失。

默认语义：

```text
tooltip content → role="tooltip"
target → aria-describedby="<tooltip id>"
```

ToolTip 关闭或卸载时只移除自己添加的 description id，不覆盖目标已有或期间新增的其他 `aria-describedby` 关联。

字符串 / 数字 `content` 使用 `theme.components.ToolTip.base.typo`；复杂 React 内容由调用方通过 View / Text 自行组合。

ToolTip 的默认视觉来自：

```text
theme.components.ToolTip.base
```

ToolTip 的默认视觉必须遵循 Weave 已有的“材质 + 层级”语言，但必须和 Button 的“可按压实体”语言区分开：

- 默认使用主题 `primary` 作为背景、`onPrimary` 作为文字颜色，让辅助信息与普通 surface 内容保持高辨识度；
- 边界默认跟随 `primary`，避免在主题色气泡上额外引入冲突色；
- 只使用 ambient shadow 表达浮层层级，不使用 Button 式实体厚度 / 底边 extrusion；
- 使用 `small` 圆角，而不是与 Button 接近的较大圆角；
- 默认水平 / 垂直 padding 分别为 `0.5rem / 0.25rem`；
- 默认文字使用 `body-xsmall`，尺寸和字重都低于 Button 的 label scale；
- 使用指向目标的锚点箭头，明确 ToolTip 与目标之间的空间关系；
- 进入时从锚点方向轻微位移并淡入，只保留几乎不可察觉的缩放；不使用 Button 式弹跳；
- 退出时沿相反过程向锚点收回并淡出，完成过渡后才卸载 DOM，不允许瞬间消失；
- 位移距离由 `theme.components.ToolTip.base.motionOffset` 控制；默认 `0.1875rem`；
- 进入使用全局 `motion.duration.normal + motion.curve.emphasized`，透明度使用较短的 `fast + enter`；退出使用 `fast + exit`；
- `prefers-reduced-motion: reduce` 下取消位移、缩放与退出等待。

当前可主题化字段：

```text
background
color
borderColor
borderWidth
radius
paddingX
paddingY
maxWidth
shadow
arrowSize
motionOffset
typo
```

通用视觉覆盖继续通过 `viewProps` 使用；ToolTip 自己拥有 `role` 与 fixed positioning 语义。

---

# 20. `Snack`

`Snack` 是组合组件，同时提供：

```text
Snack
→ 单个声明式通知实例

SnackProvider + useSnack()
→ 正常业务使用的通知队列
```

依赖：

```text
View
Text
Icon?
Button?
Progress
```

## 20.1 推荐：队列触发

应用根建立一次队列：

```tsx
<ThemeProvider>
  <SnackProvider>
    <App />
  </SnackProvider>
</ThemeProvider>
```

不传 `container` 时，Snack region 挂到 `document.body`，placement 相对 viewport。

需要把 Snack 限定在某个组件内部时，在 `SnackProvider` 指定容器：

```tsx
const panelRef =
  useRef<HTMLDivElement>(null)

<View ref={panelRef}>
  <SnackProvider
    container={panelRef}
  >
    <PanelContent />
  </SnackProvider>
</View>
```

也支持直接 HTMLElement 或 getter：

```tsx
<SnackProvider
  container={panelElement}
/>

<SnackProvider
  container={() => panelRef.current}
/>
```

`container` 类型：

```text
HTMLElement
RefObject<HTMLElement | null>
() => HTMLElement | null
null
```

语义：

- 未传 `container`：挂到 `document.body`，region 使用 viewport 定位；
- 指定容器：region 作为该容器子节点挂载，placement 相对该容器；
- 指定容器 region 使用 `position: absolute`；
- 如果容器当前是 `position: static`，框架在 region 存活期间自动建立 `position: relative` 定位上下文，并在最后一个 region 移除后恢复原 inline position；
- `container=null` 或 ref/getter 当前返回 `null` 时不挂载 Snack region；
- 不同 `SnackProvider` 即使使用同一个 container 和 placement，也必须维护独立 region / FIFO 队列，不得串队列。

业务侧：

```tsx
const snack = useSnack()

<Button
  text="Save"
  viewProps={{
    onClick: () => {
      snack.show({
        text: "保存成功",
        variant: "success",
      })
    },
  }}
/>
```

每一次 `show()` 都创建一个新的 Snack 实例。

同一个触发器连续点击：

```text
click → Snack #1
click → Snack #2
click → Snack #3
```

不会复用一个 `open` 布尔实例，也不会因为新增通知而重置已有 Snack 的生命周期计时。

`show()` 返回实例 id：

```tsx
const id = snack.show({
  text: "Uploading...",
  persistent: true,
})

snack.dismiss(id)
snack.dismissAll()
```

## 20.2 声明式单实例

需要直接控制单个实例时仍可使用：

```tsx
<Snack
  text="保存成功"
  variant="success"
  open={open}
  onOpenChange={setOpen}
/>
```

声明式 `Snack` 是底层能力；通知队列不应通过复用一个声明式实例来模拟。

## 20.3 内容

快捷内容：

```tsx
<Snack
  text="网络连接已断开"
  icon={IconWifiOff}
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

`action` 与 `onAction` 必须成对出现；执行 action 后当前 Snack 请求关闭。

完整组合：

```tsx
<Snack>
  <View>
    <Icon icon={IconCloudOff} />
    <Text>同步暂时不可用</Text>
    <Button text="重试" />
  </View>
</Snack>
```

使用 `children` 时，不同时使用 `text`、`icon`、`action`、`onAction`。

## 20.4 当前属性

```text
text
children

variant
  default
  success
  warning
  danger
  info

icon
duration
persistent
progress
action
onAction

placement
  top-left
  top-center
  top-right
  bottom-left
  bottom-center
  bottom-right

open
defaultOpen
onOpenChange
onDismissed

viewProps
```

默认：

```text
variant     = default
duration    = 4000ms
persistent  = false
progress    = false
placement   = bottom-center
defaultOpen = true
layer       = snack
```

Snack 的进入与退出方向只由 placement 的屏幕边缘语义自动决定：

```text
top-*    → 从顶部边缘进入 / 向顶部边缘退出
bottom-* → 从底部边缘进入 / 向底部边缘退出
```

不允许再增加与 placement 冲突的第二套方向配置。

## 20.5 生命周期计时

每个 Snack 的自动关闭计时从**该实例自己的创建 / 打开时刻**开始。

新增其他 Snack：

```text
不得
→ 清除旧实例 timer
→ 重启旧实例 duration
```

因此不同时间创建的 Snack 必须在不同时间到期。

规则：

- `persistent=false` 时按自己的 `duration` 自动关闭；
- 默认不显示 lifetime Progress；只有 `progress=true` 时，自动关闭 Snack 底部才显示一条从 1 线性下降到 0 的线性 lifetime Progress；
- lifetime Progress 必须直接使用公开的 `Progress` 组件，固定 `mode="linear"`，不得调用 `ProgressVisual` 或另外实现一条私有进度条；
- lifetime Progress 必须位于 Snack 圆角 surface 内部：左右至少按 `paddingX` inset，不得贴着或穿出外层 border radius；
- lifetime Progress 使用自身 linear radius / track 语义，不通过 Snack 边框充当进度轨道；
- 启用 `progress` 时，Progress 与自动关闭计时必须共享同一份剩余时间状态，不允许视觉进度和真实关闭时刻分离；
- pointer 停留在当前 Snack 上时暂停该实例；启用 `progress` 时同时暂停 lifetime Progress；
- focus 位于当前 Snack 或其 action 内时暂停该实例；启用 `progress` 时同时暂停 lifetime Progress；
- 离开后从真实剩余时间继续，不得重新获得完整 `duration`；
- `persistent=true` 时完全禁用自动关闭，并且不显示 lifetime Progress；
- 关闭进入 exit transition，transition 完成后才从队列移除。

## 20.6 placement、视觉 FIFO 与容量溢出

每个 `SnackProvider` 在自己的 mount scope 中按 placement 维护独立 region：

```text
SnackProvider
→ container / document.body
  → top-left region
  → top-center region
  → top-right region
  → bottom-left region
  → bottom-center region
  → bottom-right region
```

不传 `container` 时 mount scope 是 `document.body`；指定 `container` 时 mount scope 是该 HTMLElement。

业务不创建 portal host、不计算坐标、不维护队列 index。

FIFO 容量与驱逐只在**同一个 provider scope + placement** 内计算；不同 provider、不同 container、不同 placement 互不影响。

同一 placement 的**可见容量固定为 3**。

视觉顺序严格按照创建顺序：

```text
A 先创建
B 后创建
C 再创建

视觉：
A
B
C
```

placement 只决定队列从哪个屏幕边缘向内延伸：

```text
top-*
→ A 最靠近顶部
→ B 在 A 之后
→ C 在 B 之后

bottom-*
→ A 最靠近底部
→ B 在 A 之后向上排列
→ C 在 B 之后继续向上排列
```

### 容量溢出必须 FIFO 驱逐

当 A / B / C 已占满容量，第 4 条 D 进入时：

```text
A
B
C

D 到达
→ D 进入 pending，不渲染
→ A 立即进入 closing
→ A 播放完整退出动效
→ 退出期间视觉上仍然只有 A / B / C 三条

A 退出完成后：
→ B / C 使用 layout motion 向 FIFO 前方补位
→ D 此时才渲染并进入队尾

B
C
D
```

因此：

- 最早进入的可见 Snack 永远最先因容量溢出而退出；
- 被驱逐项必须播放和正常关闭相同的 exit motion，不能瞬间消失；
- 溢出过渡期间可见完整 Snack 数量不得超过 3；
- 新 Snack 必须等最旧项退出完成后再进入可见队尾，不能提前出现成第 4 张；
- 旧项移除后的 B / C 补位必须使用 layout animation，从当前视觉位置连续前移，不能瞬移；
- 新 Snack 不能覆盖旧 Snack；
- 超出可见容量的新项只允许作为短暂 pending 等待当前 FIFO 头完成退出；pending 不渲染、不占视觉位置，也不提前启动 lifetime；
- 任意时刻同一 placement 最多渲染 3 条 Snack；
- 不存在 `+N` overflow 指示；
- 不允许卡片重叠、负 margin、scale 堆叠或 z-index 模拟栈；
- 每条 Snack 的 duration 从它真正进入可见 FIFO 并挂载时开始计算；
- 新增 Snack 不得重置其他 Snack 的 timer。


## 20.7 默认视觉语言

Snack 必须从“短暂系统通知”的组件语义推导视觉，不允许复制 Button、ToolTip 或其他组件的表面造型。

它使用 Weave 的共享设计词汇：

```text
surface
outline
shadow
typography
variant color
motion
layer
```

但组合方式属于 Snack 自己。

默认：

- Snack 是 `layer="snack"` 的浮层通知；
- 卡片主体使用主题 `surface`；
- 使用 `outline` 建立边界；
- 使用 ambient shadow 表达浮层层级；
- **不使用 Button 的 depth / hoverLift / pressDepth / 实体底边语义**；
- Snack 本体没有 hover 抬升、press 下沉或可按压反馈；
- variant 影响通知语义、图标 / action 强调色和可访问性，而不是把整张卡片染成状态色；
- 图标与 action 可以使用 variant accent，但正文仍遵循正常信息层级；
- typography 来自统一 type scale；
- spacing、radius、shadow、motion 必须来自 theme token / component theme；
- lifetime Progress 必须位于 Snack 自己的底部 padding 内部，与左右内容边界对齐，不得贴到或穿过外层 border radius。
- Snack 不自行规定 `minWidth` / `maxWidth`；默认宽度由内容自然决定。需要明确宽度约束时由调用方通过 `viewProps.width / minWidth / maxWidth` 指定。

组件主题入口：

```text
theme.components.Snack.base
theme.components.Snack.variants
```

base：

```text
background
color
borderColor
borderWidth
radius
paddingX
paddingY
gap
shadow
iconSize
progressHeight
typo
motionOffset
```

variant：

```text
accentColor
```

## 20.8 动效

Snack 的动效只表达：

```text
出现
正常退出
FIFO 容量溢出时最旧项的退出
队列中某一项被移除后的自然布局补位
```

单条进入：

```text
从 FIFO 队尾的增长方向轻微进入
+ opacity 0 → 1
```

单条退出：

```text
最旧项朝对应屏幕边缘轻微退出
+ opacity 1 → 0
→ transition 完成后移除
```

因此：

```text
top-*    → 新项从下方进入；最旧项向上退出
bottom-* → 新项从上方进入；最旧项向下退出
```

A 移除后的 B / C 使用 FLIP / layout animation 从旧位置平滑补位；快速连续变化时新布局从当前视觉值接管，不排动画队列。

不使用 Button 式弹跳、depth、press/release，也不使用多卡重叠缩放。

队列补位属于 layout change；浏览器布局变化应保持连续，不额外排一套动画队列。

`prefers-reduced-motion: reduce` 下取消非必要位移，只保留状态变化。


## 20.9 可访问性

```text
default / success / info
→ role="status"

warning / danger
→ role="alert"
```

Snack root 使用 `aria-atomic="true"`。

进入 closing 后设置 `aria-hidden="true"`；视觉退出可以完成，但不会继续作为有效通知暴露给辅助技术。


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
      icon: IconUser,
    },
    {
      id: "settings",
      text: "设置",
      icon: IconSettings,
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
      icon: IconWifi,
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

不需要选择时：

```tsx
<List
  items={items}
/>
```

默认：

```text
selection = none
```

单选：

```tsx
<List
  items={items}
  selection="single"
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

选择值：

```text
none
→ 不存在 selected / defaultSelected / onSelect

single
→ string | null

multiple
→ readonly string[]
```

`selected` 存在时为受控模式；否则使用 `defaultSelected` 建立非受控初值。

single 模式再次激活已经选中的项不会自动清空选择；multiple 模式再次激活已选项会取消该项。

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

List 默认在相邻 item 之间显示分割线；需要无分割线列表时使用：

```tsx
<List items={items} noDividers />
```

`noDividers` 只控制 item 之间的视觉分割线，不改变 ListItem 的选择、焦点、虚拟化或布局语义。

## 21.6 键盘、焦点与可访问性

`selection="none"`：

```text
List     → role="list"
ListItem → role="listitem"
```

`selection="single" | "multiple"`：

```text
List     → role="listbox"
ListItem → role="option"
```

multiple 额外暴露：

```text
aria-multiselectable="true"
```

可选择 List 使用 roving focus：

- 当前 roving focus target 为 `tabIndex=0`；
- 其他可选择项为 `tabIndex=-1`；
- disabled item 不进入键盘移动序列；
- vertical：`ArrowUp / ArrowDown`；
- horizontal：`ArrowLeft / ArrowRight`；
- `Home / End` 移动到首个 / 最后一个可用项；
- `Enter / Space` 激活当前项；
- 鼠标 / focus 进入某项后，该项成为新的 roving focus target。

ListItem 内部的 Button / Switch / input / link 等交互控件拥有自己的交互语义；操作这些 trailing 控件时，不得同时触发行选择。

## 21.7 滚动

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

## 21.8 虚拟化

虚拟化是 List 自己的自然能力：

```tsx
<List
  items={items}
  virtualized
/>
```

不另造 `VirtualList`。

`virtualized` 使用真正的窗口化渲染：

- 只挂载 viewport + overscan 范围内的 ListItem；
- 使用内部估算建立初始窗口；
- 项挂载后通过真实尺寸测量修正后续 offset；
- vertical / horizontal 使用各自主轴尺寸；
- 当前 roving focus target 即使暂时位于窗口外，也必须保留挂载，保证焦点和辅助技术状态连续；
- 键盘移动到尚未挂载的项时，先让该项进入渲染窗口，再 focus；
- 滚动容器仍然是 List 自身的 `viewProps`，继续复用 Weave Scrollbar；
- 不增加 `VirtualList`、`itemHeight` 或另一套滚动 API。

## 21.9 视觉与反馈

ListItem 是“列表行 / 可选择项”，不是 Button。

默认视觉：

- List 自身是一个轻量 surface 容器，默认不预设边框；统一圆角和小幅内边距用于组织多行，若产品需要外框再通过 `theme.components.List.base` 显式配置；
- ListItem 是连续 row，不是彼此独立的卡片或大胶囊；默认行圆角必须明显小于外层 List；
- flat surface，不使用 Button 的 depth / hoverLift / pressDepth；
- hover 只改变行 surface；
- active 只表达当前直接操作；
- selected 使用清晰但克制的 primary tonal surface，并将主要前景切到 primary；强调选择但不能把 row 变成 Button / Chip；
- focus-visible 使用统一 focus outline；
- disabled 降低强调并从键盘移动序列中排除；
- 不使用 scale、弹跳或实体底边。

共享设计词汇仍来自主题的 color / typography / spacing / radius / feedback / motion，但按 ListItem 自己的语义组合。

主题入口：

```text
theme.components.List.base
theme.components.ListItem.base
```

`List.base`：

```text
background
borderColor
borderWidth
radius
padding
gap
```

`ListItem.base`：

```text
background
hoverBackground
activeBackground
selectedBackground
selectedHoverBackground
color
secondaryColor
selectedColor
radius
paddingX
paddingY
gap
iconSize
primaryTypo
secondaryTypo
focusOutlineWidth
focusOutlineColor
focusOutlineStyle
focusOutlineOffset
disabledOpacity
```

## 21.10 List 当前 API

```text
items
disabled
selection
selected
defaultSelected
onSelect
orientation
gap
noDividers
virtualized
children
viewProps
```

`ListItem`：

```text
id
children
disabled
viewProps
```

数据模式和组合模式中的 `id` 都要求在同一个 List 内唯一；重复 id 直接视为配置错误。

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
feedback
motion
```

### components

组件级配置：

```text
Badge
Link
Button
Input
Switch
Radio
Checkbox
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
      family: {
        body: "Inter, ui-sans-serif, system-ui, sans-serif",
        mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
      },

      size: {
        xsmall: 0.75,
        compact: 0.8125,
        small: 0.875,
        medium: 1,
        large: 1.25,
        xlarge: 1.5,
        xxlarge: 2,
      },

      weight: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },

      lineHeight: {
        tight: 1.15,
        compact: 1.25,
        body: 1.5,
        relaxed: 1.65,
      },

      letterSpacing: {
        tight: "-0.015em",
        normal: "0em",
        wide: "0.02em",
      },

      styles: {
        "display-large": {
          fontSize: 3.5,
          fontWeight: 700,
          lineHeight: "1.05",
          letterSpacing: "-0.035em",
        },
        "headline-small": {
          fontSize: 1.5,
          fontWeight: 600,
          lineHeight: "1.22",
          letterSpacing: "-0.01em",
        },
        "body-medium": {
          fontSize: 0.875,
          fontWeight: 400,
          lineHeight: "1.5",
          letterSpacing: "0em",
        },
        // ...其余完整 type scale
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

    feedback: {
      restDepth: 0.1875,
      hoverDepth: 0.25,
      hoverLift: 0.0625,
      hoverScale: 1.03,
      pressDepth: 0.0625,
      pressOffset: 0.125,
      pressScale: 0.985,
      dragScale: 1.08,
    },

    motion: {
      duration: {
        instant: 80,
        fast: 120,
        normal: 200,
        slow: 320,
      },

      curve: {
        linear: "linear",
        standard: [0.2, 0, 0, 1],
        emphasized: [0.2, 0, 0, 1],
        spring: [0.16, 1.22, 0.3, 1],
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

### 全局 Typography

`tokens.typography` 同时承担两层职责：提供整个 Weave 子树的全局排版基线，并通过 `styles` 定义 `Text.typo` 的完整 type scale。

ThemeProvider 默认建立一个 `body-large` 排版上下文：

```text
font-family    = typography.family.body
font-size      = typography.styles.body-large.fontSize
font-weight    = typography.styles.body-large.fontWeight
line-height    = typography.styles.body-large.lineHeight
letter-spacing = typography.styles.body-large.letterSpacing
```

普通 View 不再重置文字排版，而是继承当前排版上下文。因此：

- `Text` 显式设置 `typo` 时切换到该完整 type style；未设置时继承父级上下文。
- Button 的每个 size 选择 `label-small / label-medium / label-large`。
- Input 默认选择 `body-large`，value / textarea / placeholder 全部共用。
- 以后 ToolTip / Snack / ListItem 等任何产生文字视觉的组件也必须选择或继承 typo，不能平行维护字体四项。
- 嵌套 ThemeProvider 可以局部替换整套排版语言。
- `family.mono` 等附加 family token 可用于需要等宽字体的局部内容。

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

Weave 默认主题内置完整 light / dark 配色。`ThemeProvider` 未显式传 `mode` 时默认继承 `system`，跟随 `prefers-color-scheme`；也可以显式固定为 `light` 或 `dark`。

默认深色模式不是对浅色值做滤镜或简单反相，而是提供独立的语义 token：深色 surface、提高亮度的 primary、适配深色背景的正文 / 次级文字、outline、状态色、focus 色与阴影。组件继续只消费语义 token，不需要知道当前模式。

深色模式必须保持与浅色模式相同的组件设计语言，而不是另起一套“加边框提高对比度”的规则。Button 继续沿用同一套 variant 配方与实体厚度：rest 有 depth，hover 抬起并增加 depth，press 下沉并收缩 depth；dark 只替换语义 token 和必要的阴影颜色。Switch 继续保持“track 凹陷、thumb 凸起”的物理层级：off track 沿用默认混色并用方向性 inset shadow 表达凹槽，不使用均匀 outline；on track 使用 primary；thumb 用外部投影与顶部高光表达突起。

默认深色核心颜色：

```text
primary       #a99cff
onPrimary     #1b1633
secondary     #aaa3b5
tertiary      #e9e5ef
surface       #18161b
surfaceHover  #242129
outline       #5b5262
focus         #b8adff
success       #55d792
warning       #f4b44c
danger        #ff7272
```

主题本身也可以继续定义自己的模式覆盖：

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

组件本身不需要知道当前是否深色。默认 dark override 先应用，再应用主题的基础覆盖，最后应用主题自己的 `modes.dark` 覆盖；因此品牌在基础主题中声明的颜色会自然延续到 dark，除非品牌显式提供暗色版本。

`ThemeProvider` 同时建立当前主题的继承文字色与 CSS `color-scheme`，让使用 `inherit` 的组件与浏览器原生 UI 都能跟随有效模式。

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
      typo: "label-small",
      iconSize: "small",
    },

    medium: {
      viewProps: {
        height: 2.5,
        paddingX: 1,
        gap: 0.5,
      },
      typo: "label-medium",
      iconSize: "medium",
    },

    large: {
      viewProps: {
        height: 3,
        paddingX: 1.25,
        gap: 0.625,
      },
      typo: "label-large",
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
defaultTheme
→ 当前 ThemeProvider 的组件主题
→ theme base
→ size
→ variant
→ shared state
→ variant state
→ instance props
→ responsive overrides
→ className
→ style
```

其中 defaultTheme 与应用 / 局部 ThemeProvider 先经过主题继承与深合并，再由组件解析当前有效的 `base / sizes / variants / states`。

最终总原则：

```text
style > className > 实例属性体系 > 当前主题 > defaultTheme
```

`style` 是最终原始 CSS 逃生口。除渲染器内部必须同步的真实几何外，框架自身的主题、默认视觉、语义属性与实例动态样式都通过 class 输出，不占用用户的内联 `style` 优先级。

---

# 24. 动画系统

动画是 `ViewProps` 通用能力。

`View` 直接使用；非 `View` 组件通过 `viewProps` 使用。

不单独要求 `<Animation>` 包裹组件。

当前动画模型：

> 实现状态：本章公开 Motion 模型已经全部落地：`transition`、`enter / exit + Presence`、`layoutAnimation`、物理 `spring`、`keyframes`、`repeat / repeatDelay / direction`、`stagger`、受管动画 interruption，以及统一 `reducedMotion`。CSS transition / Presence 与 WAAPI animation / layoutAnimation 使用各自适合的执行后端，但共享同一套 duration / curve / spring token 与 reduced-motion policy。

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

当前实现规则：

- `transition="fast"` 这类简写默认作用于 `all`，时长优先解析当前主题的 `motion.duration.fast`。
- `properties` 可以使用 React 风格 camelCase，例如 `backgroundColor`，DOM/CSS 后端统一输出 `background-color`。
- `duration / delay` 裸数字按毫秒解释；精确配置未提供 `delay` 时必须是 `0ms`，不能偷偷继承 `instant` token。
- `curve` 的字符串若命中当前主题曲线名则解析为主题变量；否则按原生 CSS timing-function 字符串处理。tuple 转为 `cubic-bezier(...)`，steps 对象转为 `steps(...)`。
- View stylesheet 是宿主 `transition-*` 的唯一输出层。组件默认动效只能写 `--weave-component-transition-*` fallback，公开 `viewProps.transition` 写 `--weave-transition-*` 实例变量，因此公共优先级保持 `style > className > viewProps Motion > 组件默认 Motion`。
- Motion 变量与其他 View 实例变量一样使用 `@property ... inherits: false`，禁止父组件 transition 无意泄漏到子 View。

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

内置 preset：

```text
fade
fade-up
fade-down
scale
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
    delay: 0,
    curve: "enter",
  }}
/>
```

当前 `MotionStyle` 支持视觉型属性：`opacity / background / color / translateX / translateY / scale / scaleX / scaleY / rotate / skewX / skewY / blur / brightness / contrast / saturate / grayscale / sepia / hueRotate`。尺寸和布局变化不塞进 enter/exit；它们由后续 `layoutAnimation` 负责。

`enter` 不需要额外容器：宿主第一次挂载时从 `from` 进入 `to`，结束后恢复普通 View 样式层。浏览器时序必须使用双 `requestAnimationFrame` paint barrier：首次提交保持 `enter-from`，第一帧让浏览器真正 paint 起始样式，下一帧才切到 `enter-to`；禁止用固定 `16ms setTimeout` 猜测 paint 时机，否则挂载与目标状态可能在首次绘制前被合并，导致 enter 看起来直接跳到最终状态。enter / exit 同时保留独立 timeout watchdog，防止后台标签页暂停 rAF 时 Presence 永久停留在退出中间态。enter 生命周期还必须兼容 React StrictMode 的开发期 effect setup → cleanup → setup 重放：第一次 setup 被模拟 cleanup 取消时不得把 enter 标记为已经消费；只有真正跨过 paint barrier、切到 `enter-to` 后才算本次 enter 已启动。若 `to` 某个值需要在动画结束后持续存在，同一个最终值也应由普通 View props 表达；`to` 不是永久覆盖层。

React 条件卸载需要 Presence，否则组件已经从 React tree 移除，任何 CSS 都没有机会执行 exit：

```tsx
<Presence present={open}>
  <Button
    text="Save"
    viewProps={{
      enter: "fade-up",
      exit: "fade-down",
    }}
  />
</Presence>
```

`Presence` 本身不产生 DOM。`present=false` 后，它会保留子树，并等待其中所有声明了 `exit` 的 ViewHost 完成后再真正卸载；因此一个 Presence 内可以有多个需要同步离场的宿主。没有声明 `exit` 的子树直接卸载。

`ThemeProvider reducedMotion="reduce"` 下 enter 不播放，Presence exit 也不等待动画，直接完成最终挂载/卸载状态。

---

## 24.3 Layout Animation

`layoutAnimation` 动画的是**当前 ViewHost 自身的几何变化**。开启后，框架在每次 React commit 的 layout effect 阶段测量真实 `getBoundingClientRect()`，将新布局反向映射回旧视觉 rect，再通过 FLIP 释放到新布局；不增加 wrapper，也不把真实 layout 本身做逐帧插值。

基础用法：

```tsx
<View layoutAnimation />
```

精确控制：

```tsx
<View
  layoutAnimation={{
    duration: "fast",
    curve: "standard",
  }}
/>
```

`true` 默认使用 `motion.duration.normal` 与 `motion.curve.standard`。`duration` 同其他 Motion API：裸数字按毫秒，字符串优先解析主题 duration token，也接受原生 `ms / s`；`curve` 支持主题 token、cubic-bezier tuple、steps 与原生 CSS easing 字符串。也可以改用 `spring: "standard|snappy|gentle"` 或直接传物理 spring 参数；spring 自己求解 natural duration，因此与 `duration / curve` 互斥。`layoutAnimation.interruption` 支持 `continue / restart / finish`，默认 `continue`。

当前 FLIP 后端规则：

- **位置变化**通过独立 `translate` 层从旧 rect 偏移回新 rect。
- **尺寸变化**通过独立 `scale` 层从旧宽高比例恢复到新宽高；动画期间 `transform-origin` 使用左上角，结束后恢复普通 View 样式。
- layoutAnimation 通过 WAAPI 直接动画 CSS 独立属性 `translate / scale`，与 View 原有 `transform` 分层组合，因此 hover / enter / 普通 transform 不需要被 FLIP 覆盖。
- 动画期间 ViewHost 只增加内部 `data-weave-layout-animating` 状态，由低 specificity 的 View stylesheet 临时设定左上角 `transform-origin` 与 `will-change`；不存在第二个布局 DOM，也不依赖可插值 custom property。
- 快速连续更新不会排动画队列：旧 WAAPI animation 先采样当前视觉 `getBoundingClientRect()`，新布局 commit 后取消旧 animation，再从该视觉 rect 重新 FLIP 到最新目标。
- FLIP 使用 viewport rect，因此必须把**滚动造成的 viewport 坐标变化**与真正 layout change 分离：宿主监听 document/ancestor scroll、window resize 与自身 ResizeObserver，在没有 layout animation 运行时只同步 baseline，不播放动画。否则滚动后第一次重排会错误把 scroll delta 当成元素位移，把节点反向送出屏幕。
- `ThemeProvider reducedMotion="reduce"` 时不创建 layout animation，直接使用最新布局。
- 浏览器不存在 `Element.animate` 时安全降级为立即布局，不为兼容性注入 JS animation polyfill。

插入 / 删除 / 重排的职责要分开：

- **重排**：对会被移动的稳定 keyed 子项启用 `layoutAnimation`。
- **插入**：新节点没有旧 rect，自己没有可做的 FLIP；新节点的视觉入场使用 `enter`，已有兄弟项仍可通过 `layoutAnimation` 平滑让位。
- **删除**：待删除节点使用 `Presence + exit` 保留到离场结束；留下来的稳定兄弟项使用 `layoutAnimation` 从旧位置补到新位置。
- **尺寸变化**：同一个稳定 ViewHost 的宽高发生变化时直接由 layoutAnimation 的 scale FLIP 处理。

例如重排：

```tsx
<Row>
  {items.map((item) => (
    <View
      key={item.id}
      layoutAnimation={{
        duration: "normal",
        curve: "emphasized",
      }}
    >
      {item.content}
    </View>
  ))}
</Row>
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

Spring 是真实二阶阻尼系统，不把“弹簧感”伪装成 cubic-bezier。框架根据 `stiffness / damping / mass / velocity` 求解位移与速度，按 `restDelta / restSpeed` 自动求 natural duration，再采样为浏览器原生 CSS `linear(...)` easing。

直接参数：

```tsx
<View
  transition={{
    properties: ["transform"],
    spring: {
      stiffness: 280,
      damping: 24,
      mass: 1,
      velocity: 0,
    },
  }}
/>
```

主题 preset：

```tsx
<View
  transition={{
    properties: ["transform"],
    spring: "snappy",
  }}
/>
```

默认主题提供 `standard / snappy / gentle`。主题 spring 是结构化 JS token；ThemeProvider 同时把每个 preset 求解成 `--weave-motion-spring-*-duration` 与 `--weave-motion-spring-*-easing`，供 Button / Switch / Radio / Checkbox / Scrollbar 等内部触觉动画复用。因此框架内部不再把旧 `motion.curve.spring` 当成物理弹簧使用；旧 curve token 只保留兼容。

Spring 可以用于：

- `transition`
- `enter / exit`
- `animation` keyframes
- `layoutAnimation`
- stagger child enter

`spring` 与 `duration / curve` 在类型层互斥：spring 自己决定自然结束时间；`delay`、repeat 编排等外层时间仍可独立存在。

---

## 24.6 延迟、重复与方向

`delay` 继续适用于 transition / enter / exit / animation；裸数字按毫秒解释。

循环属于 `animation`：

```tsx
<View
  animation={{
    keyframes: [
      { opacity: 0.5, scale: 0.96 },
      { opacity: 1, scale: 1.04 },
    ],
    duration: 700,
    repeat: 2,
    repeatDelay: 120,
    direction: "alternate",
    curve: "standard",
  }}
/>
```

规则：

- `repeat: 0` 或省略：只执行一次。
- `repeat: 2`：初始 cycle 之后再重复 2 次，总共 3 个 cycle。
- `repeat: "infinite"`：持续循环直到 props 改变或卸载。
- `repeatDelay`：cycle 之间等待时间，裸数字按毫秒。
- `direction: "normal"`：每个 cycle 正向。
- `reverse`：每个 cycle 反向。
- `alternate`：正向 / 反向交替。
- `alternate-reverse`：反向 / 正向交替。

repeat/repeatDelay 由 Weave sequence runner 编排，而不是依赖一个永久占用的 CSS animation，因此 interruption 可以在 cycle 边界正确接管。

---

## 24.7 Keyframes

`ViewProps.animation` 是受管 WAAPI keyframe 入口：

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

`at` 范围固定为 `0 ~ 1`；超界值会 clamp。首尾未提供时分别补 0 / 1，中间缺失 offset 在相邻显式锚点之间等距插值。

Keyframe 使用同一 `MotionStyle` 视觉属性集合，因此支持 opacity / color / background / transform / filter 家族，不把 width/height 等真实 layout 字段混进来。

也可使用物理 Spring：

```tsx
<View
  animation={{
    keyframes: [
      { scale: 0.8 },
      { scale: 1 },
    ],
    spring: "snappy",
  }}
/>
```

主题可提供结构化 animation preset：

```tsx
<View animation="pulse" />
```

默认主题内置 `pulse` 作为基础诊断 preset；产品主题可覆盖或增加同名/新名称 preset。

---

## 24.8 动画编排 / Stagger

Stagger 属于父 ViewHost 的 enter 编排。父宿主读取自己的 direct ViewHost children，并按实际 DOM 顺序分配 delay，不增加 wrapper：

```tsx
<Row
  enter={{
    animation: "fade-up",
    children: {
      stagger: 50,
      delay: 100,
      from: "first",
    },
    spring: "snappy",
  }}
>
  <View />
  <View />
  <View />
</Row>
```

简写：

```tsx
<View
  enter={{
    animation: "fade-up",
    stagger: 40,
  }}
/>
```

`from` 支持：

```text
first   // 0 → n
last    // n → 0
center  // 从中间向两侧
```

父 ViewHost 自己仍执行同一 enter 定义；children 获得相同 from/to/timing，只增加各自 delay。Stagger 只编排**直接** ViewHost children，避免隐式穿透复杂组件树。若 child 同时对同一 transform/filter 属性运行独立 `animation`，两套 WAAPI 会竞争同一属性，业务应明确选择一套编排来源。

StrictMode effect replay 不得重复启动 stagger；`reducedMotion="reduce"` 下不创建 stagger child animation。

---

## 24.9 动画中断

状态快速变化不能无限排队。Weave 对**受管 WAAPI 动画**统一提供：

```text
continue   // 默认，从当前视觉状态接管
restart    // 取消旧动画，从新动画声明起点重来
finish     // 先结束当前 cycle / FLIP，再执行最新目标
```

Keyframe animation：

```tsx
<View
  animation={{
    keyframes: [
      { translateX: 0 },
      { translateX: 8 },
    ],
    duration: 900,
    interruption: "continue",
  }}
/>
```

- `continue`：读取当前 computed opacity/background/color/transform/filter，把当前视觉值注入新 animation 的逻辑起点，然后取消旧 WAAPI。
- `restart`：取消旧 animation，直接从新 keyframe 声明起点开始。
- `finish`：当前 cycle 自然完成后才接管；等待期间如果目标继续变化，只保留**最新** pending target，不形成动画队列。若正处于 `repeatDelay`，直接跳过剩余等待并执行最新目标。

`layoutAnimation.interruption` 同样支持三种策略：`continue` 使用采样到的当前视觉 rect；`restart` 从上一逻辑 layout target 重新 FLIP；`finish` 先把当前 WAAPI FLIP 推到旧 target，再从旧 target FLIP 到最新布局。

普通 CSS `transition` 与 Presence enter/exit 不暴露 `restart / finish`：浏览器 CSS cascade 本身采用 continue 语义。Presence 在 exit 中途重新 `present=true` 时，不先卸载/重挂，也不先跑完 exit；它直接从当前视觉状态反向过渡到 `enter-to`。

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

当前实现规则：

- `system` 由主题层唯一的 `(prefers-reduced-motion: reduce)` 订阅解析；组件、renderer 和布局动画辅助代码不得再次自行调用 `matchMedia`。
- 每个使用 ViewHost 的真实宿主都会得到最终的 `data-weave-reduced-motion="reduce|no-preference"`，组件内部 thumb、marker、progress animation、tooltip/snack presence 等都服从这个最终 policy。
- `reduce` 会把框架宿主 transition 解析成 `property: none / duration: 0ms / delay: 0ms`；enter 不播放，Presence exit 不等待，layoutAnimation 不创建 WAAPI，stagger 不启动 child animation。
- 有限 keyframe animation 在 reduced motion 下用 0ms 固定到**最后一个逻辑 cycle 的终点**，因此 alternate / reverse 仍有确定语义；`repeat: "infinite"` 没有逻辑终点，固定到第一帧/rest frame，不保留持续运动。
- Spring 在 reduced motion 下同样不播放物理振荡；不会因为 spring natural duration 而延迟最终状态。
- `no-preference` 是显式覆盖，因此嵌套在外层 `reduce` Provider 中时必须能够重新启用 motion；不能再靠组件自己的 `@media` 把它强制关闭。
- 未显式传 `ThemeProvider` 时仍默认按 `system` 解析，而不是默认假设允许动画。

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
Button.disabled
Input.disabled
Switch.disabled
List.disabled
ListItem.disabled
→ `disabled` 是对应组件自己的高层属性，不再同时提供 `viewProps.disabled`

Button.pressed
→ 不再同时提供 viewProps.pressed

Switch.checked
Radio.checked
Checkbox.checked
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

`Switch` 自己保证切换语义。其持久状态叫 `checked`，不是 `active`。

`List` 在可选择模式下提供对应键盘导航语义；持久选择状态叫 `selected`，内部 roving focus target 不作为公开 `active` 状态。

Button 的 `:active` 只表示瞬时按压；需要维持按下状态时使用 Button 自己的 `pressed`。Weave 不提供一个跨 Button / Switch / List 的通用 `active: boolean`，因为瞬时 press、持久 pressed、checked、selected、focus 是不同语义。

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
Weave 公开 API
│
├─ 应用挂载
│  └─ createRoot
│
├─ View
│  ├─ 面向用户的唯一基础原语
│  └─ 直接使用 ViewProps
│
├─ 正式布局组件
│  ├─ Flex
│  ├─ Row
│  ├─ Column
│  ├─ Grid
│  ├─ Stack
│  └─ Absolute
│      └─ 对 View 布局能力的受约束封装，不增加额外 DOM
│
├─ 基础组件
│  ├─ Text
│  ├─ Image
│  ├─ Input
│  ├─ Icon
│  ├─ Switch
│  ├─ Radio
│  ├─ Checkbox
│  ├─ Progress
│  └─ Scrollbar
│
├─ 组合组件
│  ├─ Button
│  ├─ Link
│  ├─ Badge
│  ├─ ToolTip
│  ├─ Snack
│  ├─ List
│  └─ ListItem
│
├─ Motion 生命周期控制
│  └─ Presence
│      └─ 自身不产生 DOM，只负责 enter / exit 卸载时序
│
└─ Context / 配置 / 命令式支撑 API
   ├─ ThemeProvider / useTheme
   ├─ createTheme / defaultTheme
   └─ SnackProvider / useSnack

真实 DOM 宿主组件
│
├─ View
└─ 需要承载自身 DOM 的基础 / 组合组件
    │
    ▼
内部 useViewHost
│
│  复用 View 的通用宿主能力，不是公开基础原语
│
├─ ViewProps 通用能力
│  ├─ 布局 / 尺寸 / 间距
│  ├─ 视觉 / Mask / Clip / Transform
│  ├─ 状态样式
│  ├─ 响应式
│  ├─ Motion
│  ├─ 可访问性
│  ├─ 事件 / 焦点 / data
│  ├─ layer / scrollbar
│  └─ style / className 逃生口
│
└─ 组件自身语义能力
    │
    ▼
内部 Theme / responsive / state / motion 解析
    │
    ▼
CSS variables + runtime classes + framework stylesheet
    │
    ▼
单一渲染路径：React DOM + CSS
    │
    └── 浏览器原生 layout / paint / input / focus / scroll / compositing
```

其中 `Presence`、Provider 与 Hook 不属于 ViewHost 宿主链路；它们分别负责生命周期编排和 React context / 命令式能力。只有实际承载 DOM 的组件才进入 `useViewHost → DOM + CSS` 这条宿主路径。

---

# 28. 全局硬约束汇总

以下是当前设计中不能随意破坏的约束。

1. 这是 **React UI 框架**，不是替代 React 的框架。
2. 当前只支持 Web。
3. 只支持函数组件。
4. 组件通过组合构建，不走继承体系。
5. 面向用户的基础原语只有 `View`；`useViewHost` 是 Weave 内部复用通用宿主能力的实现机制，不是第二个公开基础原语。
6. `View` 直接使用 `ViewProps`；直接承载自身 DOM 的组件通过 `viewProps` 暴露通用能力，并在内部使用 `useViewHost` 复用这套能力；正式布局组件可以作为受约束的 `View` 封装直接接受对应布局属性。
7. 组件是否允许 `children`、允许哪些 `children`，遵循其对应 DOM 元素的内容模型。
8. 基础组件不得依赖其他基础组件或组合组件；它们通过 `useViewHost` 复用 `View` 通用能力，并可以直接渲染与自身语义匹配的真实 DOM 元素，不要求额外嵌套 `<View>`。
9. 组合组件可以通过 `useViewHost` 承载自身宿主，并由 `View`、基础组件、其他组合组件共同构建。
10. 组件层级判断按真实内部依赖，不靠 children 绕开依赖关系。
11. 不暴露 `as`、`asChild` 或底层 HTML 标签选择权。
12. CSS 是内部实现与语义基础，但公开 API 应提供高层、语义化属性。
13. `style` 保留为原始 CSS 逃生口。
14. 除 `style` 外，所有表示尺度的无单位数字统一按 `rem`。
15. 所有表示时间的裸数字统一按毫秒（`ms`）。
16. 组件公开 `size` 只接受该组件定义的语义尺寸值，不接受数字。
17. 样式最终优先级为 `style > className > 属性体系`。
18. 通用布局、视觉、状态样式、响应式、动画与通用事件能力属于 `ViewProps`；具体组件可以提供自身更自然的高层语义属性。
19. DOM + CSS 是唯一渲染路径，不维护第二套组件 renderer。
20. 组件视觉、布局、状态与交互必须以真实 DOM / CSS / 浏览器语义为唯一真值。
21. 布局、文本、表单、事件、焦点、滚动与可访问性必须继续由浏览器 HTML / CSS / DOM 负责，禁止平行重复实现。
22. 框架自身不提供 Canvas UI 渲染后端；业务自行使用普通 Web `<canvas>` 不改变 Weave 的 DOM 渲染模型。
23. Scrollbar 是复用 ViewHost 通用能力的基础组件，不是伪元素样式。
24. Scrollbar 由框架自动插入，不要求开发者显式使用。
25. `selectable` 是 `ViewProps` 通用能力，不是 Text 专属。
26. `Image` 不提供 `decorative`，且遵循对应 DOM 内容模型，不接受 `children`。
27. `Progress` 用 `undetermined` 明确表示未知进度，用 `progress` 表示确定进度。
28. 主题语义值、组件变体、状态样式、响应式覆盖、`className` 和 `style` 有明确优先级。
29. 组件默认承担正确可访问性和键盘语义，不把标准行为推给业务开发者。
30. 浮层使用语义 layer，普通用户不需要手工管理 portal 或全局 z-index。
31. 具体组件已经提供同义语义状态属性时，该状态不在其 `viewProps` 中重复暴露，组件属性作为唯一真值。
32. 框架自身的 playground、示例与组合组件必须优先 dogfood 已有 Weave 语义组件；已有 `Text`、`Progress` 等能力时，不再平行维护裸 DOM / 私有 CSS 的同义实现。
33. 组合组件复用基础组件的视觉内核时，可以由组合组件自己承担更高层语义；不得因此重复暴露冲突的 ARIA 角色。
34. `Text.typo` 必须来自主题中的完整 type scale；不能退回 renderer 内部的少量硬编码 preset。
35. Scrollbar 只绘制 thumb，不提供 tracked / trackColor；带圆角宿主必须把圆角曲线区域排除出 thumb 的运动区。
36. 所有框架拥有的文字视觉必须选择或继承 `theme.tokens.typography.styles` 中的 typo；Button、Input 等组件不得平行维护 `fontSize / fontWeight / lineHeight / letterSpacing`。
37. 普通 View 继承当前排版上下文；根节点与 ThemeProvider 默认建立 `body-large` 上下文，允许 Button 等组件建立自己的 typo 上下文后由内部 Text 继承。
38. API 的目标是：AI 易写易读，同时人类易读。