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

### 4.1 所有公开 API 中，不带单位的尺度数字默认统一按 `rem`

`style` 除外。只有组件规范明确声明的像素单位例外不走这条规则；当前例外只有 `Divider.size` 与 `Tabs.indicatorThickness`，两者的裸数字固定按 `px`。

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

## 5. 组件复用模型

Weave 不使用“基础组件 / 组合组件”的依赖层级来决定一个组件能不能复用另一个组件。组件之间是否复用，只看现有公开组件的语义、API 和交互是否已经匹配当前子职责。

### 5.1 `View` 与 `useViewHost`

面向 Weave 使用者的通用公开原语是：

```text
View
```

`View` 承载完整的 `ViewProps` 通用能力，并通过内部 `useViewHost` 落到真实 DOM 宿主。

`useViewHost` 不是第二个公开组件，也不是用来绕开已有公开组件的理由。它只负责让需要直接承载真实 DOM 的组件复用 View 的布局、尺寸、视觉、响应式、motion、可访问性、事件、focus、layer 与 escape hatch 等宿主能力。

### 5.2 强制复用顺序

实现组件内部子职责时按以下顺序处理：

```text
1. 已有公开组件
2. 已有 internal helper / primitive
3. 浏览器原生 HTML / CSS / DOM 能力
4. 新实现 / 新抽象
```

只要已有公开组件的语义和 API 匹配，就直接复用，不因为组件分类、文件位置或所谓“层级”重新手写同义 DOM / 样式 / 交互。

当前明确例子：

```text
Input clear action       → Button
Combobox editable input  → Input
Combobox clear action    → Button
Link visible text        → Text
non-dot Badge text       → Text
```

Select 的 trigger 语义必须是 `<button role="combobox">`，因此不能直接组合 `Input` 宿主；但它的 field surface 直接复用 Input stylesheet / Input theme，不再复制一套近似 field CSS。

复用公开组件不会自动转移外层组件自己的状态模型、ARIA ownership 或业务语义。外层组件仍负责自身语义，只把匹配的内部子职责交给已有组件。

### 5.3 布局组件

`Flex / Row / Column / Grid / Stack / Absolute` 是对公开 `View` 布局能力的约束封装，不增加第二套布局引擎，也不增加额外 DOM 层。

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

具体组件可以在 ViewHost 通用能力之上增加自身特有能力，也可以直接复用已有公开组件提供的匹配职责。

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

`View layout="..."` 仍然可用，但不再是一般业务布局的首选写法。未设置 `layout` 的公开 `View` 仍保持其真实 `<div>` 的默认 block display；通用 View stylesheet 不得把它降级为 CSS 初始值 `inline`。

Weave 自身必须 dogfood 正式布局组件：Playground、示例页以及组件内部的一般布局应使用 `Flex / Row / Column / Grid / Stack / Absolute`。裸 `View layout="flex|grid|stack|absolute"` 只允许保留在这六个布局组件自己的实现边界，或确有底层实现理由且无法用正式布局组件表达的内部基础设施中；不能为了省事在业务/示例代码里继续回退到裸布局 View。

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

`View`、所有组件的 `viewProps`、以及支持高层响应式语义的组件（当前包括 `Text` 与 `Button`）都读取当前 ThemeProvider 的有效 breakpoint 集合。DOM 实现不把 `sm / md / lg / xl` 的媒体查询写死在静态 stylesheet 中，而是根据当前主题生成对应的低 specificity breakpoint class。

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

可以直接覆盖组件语义属性。默认 breakpoint 名称直接可用；自定义 breakpoint 名称同时来自当前主题的运行时 `breakpoints` 与 Weave 的静态 breakpoint 注册表。两者名称必须一致：主题决定实际阈值，注册表只让 TypeScript 知道哪些自定义顶层属性是合法 breakpoint，避免开放任意字符串属性并泄漏到 DOM。

```ts
declare global {
  namespace Weave {
    interface BreakpointRegistry {
      compact: true
      wide: true
    }
  }
}
```

随后可以使用：

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

框架中可稳定枚举 / 哈希的语义样式不通过 React 内联 `style` 注入。ThemeProvider 的主题变量、组件主题解析结果、`ViewProps`、Text / Image 等组件语义属性都解析为框架生成的 class。

连续运行时通道属于例外：它们的值高频变化、由实时状态或浏览器测量产生，不能把每一帧 / 每一个数值都注册成新的 runtime class。例如 determined `Progress` 的当前百分比、Scrollbar thumb 位移、浮层实时定位几何。此类值可以通过内部元素上的最小化 inline CSS / CSS variable 同步，但只能承载连续运行时数据，不能承载默认视觉、主题或可稳定哈希的公开语义样式，也不能降低用户宿主 `style` 的最终覆盖优先级。

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

`Text` 是文字组件。

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
bold
italic
color
align
lineHeight
letterSpacing
wrap
overflow
maxLines
case
underline
strikethrough
overline
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

`typo` 同时决定 Text 的默认语义宿主标签；字号与字重等视觉值仍完全来自 Weave typography token，不使用浏览器默认标题/段落样式。固定映射为：

```text
display-*  -> <h1>
headline-* -> <h2>
title-*    -> <h3>
body-*     -> <p>
label-*    -> <span>
无 typo     -> <span>
```

Text 会清除这些原生元素自带的 margin，最终视觉仍由 Weave 自己的 typo / 显式文本属性控制。响应式 `typo` 只切换排版样式，不在 breakpoint 变化时替换 DOM；宿主标签始终由基础 `typo` 决定。调用方仍可通过 `viewProps` 补充 ARIA 语义，但不再需要为了普通标题手工写 `role="heading" / level`。

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

### decoration

Text 直接提供五个可选布尔属性：

```text
bold
italic
underline
strikethrough
overline
```

`bold` 是粗体快捷入口：`true` 使用 typography 的 `bold` weight，`false` 使用 `regular`；如果同时显式传入 `weight`，精确的 `weight` 优先。`italic` 在 `italic / normal` 之间切换。Text 层允许浏览器进行 style synthesis，因此即使当前字体没有独立 italic face，`italic` 仍必须产生斜体视觉；weight synthesis 仍不因此开启。`underline / strikethrough / overline` 统一映射到 `text-decoration-line`，三者可以任意组合。所有这些属性都支持响应式覆盖。

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

# 11A. `Code`

`Code` 用于渲染带语法高亮的代码块，语法解析与 tokenization 直接使用 Shiki。Weave 不实现自己的语法分析器，也不做语言自动探测。

基础 API：

```tsx
<Code language="tsx">{source}</Code>
```

`language` 是必填属性，必须显式指定 Shiki 支持的 bundled language。没有 `language` 的调用无效。

自定义语言使用：

```tsx
<Code language="custom" syntax={languageRegistration}>
  {source}
</Code>
```

约束固定为：

```text
language = "custom"  -> syntax 必填，类型为 Shiki LanguageRegistration
language != "custom" -> syntax 禁止传入
```

这组约束同时由 TypeScript discriminated union 和运行时校验保证。`syntax` 直接作为 Shiki grammar registration 使用，不是另一个语言名称字符串。

Code 输出使用 Shiki 的 `<pre><code>` 结果；高亮主题采用 Shiki CSS-variable theme，并映射到当前 Weave color token。代码字体使用 `theme.tokens.typography.family.mono`。Code 自身不增加另一套 Theme component，也不自动添加 surface、padding 或装饰；这些容器视觉继续通过 `viewProps` 控制。

Shiki 是 Weave 的运行时依赖，并在 library bundle 中保持 external，不把整套 Shiki 语言实现复制进 Weave bundle。

---

# 12. `Icon`

`Icon` 是图标组件。

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

当前默认映射由 `theme.components.Icon.sizes` 提供：

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

颜色、旋转、透明度、动画等通用 `View` 能力通过 `viewProps` 使用。

---

# 13. `Image`

`Image` 是图片组件。

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
<Stack>
  <Image src="/cover.webp" fit="cover" />
  <Text>专辑名称</Text>
</Stack>
```

---

# 14. `Input`

`Input` 是输入组件。

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
clearable
clearLabel
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

单行 Input 默认 `clearable=true`。当前实际输入文字非空，且 Input 不是 disabled / readOnly 时显示 clear action；`clearable={false}` 可完全隐藏该 action，`clearLabel` 控制 accessible name，默认 `Clear input`。clear 会把非受控 input 直接清空、调用 `onChange("")` 并把 focus 保持 / 恢复到真实 input；受控 Input 只发出 `onChange("")`，最终 value 仍由调用方决定。multiline Input 不提供 clear action。

Input 的 clear action 直接复用公开 `Button`，不维护私有 button DOM / hover / focus / pressed 视觉；clear button 在 Input 高度内使用上下左右一致的 inset，文本右侧也保留同等间距；`viewProps.ref` 仍然指向真实 `<input>`，不会改指 clear wrapper。

## 14.2 多行输入仍然使用 Input

```tsx
<Input
  multiline
  rows={4}
/>
```

不额外建立 `TextArea` 组件。

DOM 下仍然使用真实 `<textarea>`，保留浏览器原生文本编辑、选择、输入法与 `scrollTop / scrollLeft` 行为。

当 textarea 内容溢出时，原生滚动条视觉隐藏，并自动挂载与普通可滚动 View 相同的 Weave `Scrollbar`。因此 multiline Input 不再显示浏览器默认 scrollbar。

`viewProps.scrollbar` 可以继续配置该自动 Scrollbar。

## 14.3 默认视觉主题

Input 的主题入口仍然是：

```text
theme.components.Input
```

单行 Input 是 field surface 的唯一视觉实现与主题来源。Select 不复制这套 CSS，而是直接加载 Input stylesheet 并使用 `theme.components.Input`；Combobox 直接组合公开 `Input`。Select / Combobox 自己的 theme 只保留它们新增的结构、popup 与 option 属性。

默认 Input field surface：

```text
minHeight   = 2.5rem
minWidth    = 12rem
paddingX    = 0.875rem
radius      = 0.75rem
border      = 0.0625rem solid outline
background  = surface
typo        = body-large
focus       = 0.125rem focus outline
focusOffset = 0.0625rem
```

Input / Select / Combobox 默认使用完全相同的 Input field surface。默认 surface 的 background / shadow / border 全部由 `theme.components.Input.base` 自己定义；Input 不再借用 Switch track 的 background / trackShadow。Light / Dark 必须保持相同的 field-surface 几何。现有 Dark field surface 作为视觉基准保持不变；Light 必须使用同样的方向性凹陷几何与材质层次，只把阴影颜色 / 透明度调整为适合浅色 palette 的数值。默认不增加 hover 额外加深、thumb 式凸起、底边 extrusion 或外凸 drop shadow。Focus 只叠加既有 outline，不改变 field surface 本身。禁止为了实现 Select 或 Combobox 再复制一份“看起来差不多”的 input CSS，也禁止为了共享这些视觉再增加一个与 Input 平行的 Field Control 层。

单行 Input 不再用 `paddingY` 把自身撑高；垂直尺寸由共享 `minHeight + typography` 基线统一。`Input.base.paddingY` 只用于 multiline textarea 的内容内边距。

精确 field 宽度属于布局，继续通过 `viewProps.width / minWidth / maxWidth` 控制。Input field surface 规定相同的默认 `minWidth`；**浏览器原生 `<input>` intrinsic width 不能作为 Weave 的设计尺寸来源**。Playground 在并列验证 Input / Select / Combobox 时应给三者相同的显式 width。

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

这些能力如果要提供，应优先直接复用现有 `Text`、`Icon`、`Button` 等组件，而不是重新实现同义版本。

---

# 14A. `Select`

`Select` 是非可输入的单选组合控件。它不是 `Menu`，也不是 `Input`；它使用 select-only combobox 语义，并把 popup 选择面板实现为 anchored listbox。

## 14A.1 组合 API

```tsx
<Select
  value={workspace}
  onValueChange={setWorkspace}
  placeholder="Choose workspace"
>
  <SelectOption
    value="design"
    text="Design"
    secondaryText="UI and visual work"
    icon={IconPalette}
  />

  <SelectOption
    value="archive"
    text="Archive"
    disabled
  />
</Select>
```

`Select`：

```text
children
value
defaultValue
onValueChange
placeholder
disabled
placement
offset
overlapTrigger
viewportPadding
open
defaultOpen
onOpenChange
viewProps
listboxViewProps
```

`value` 为 `string | null`。`value !== undefined` 时为受控值模式；否则使用 `defaultValue` 建立非受控状态。`null` 表示没有选择。

`SelectOption`：

```text
value
text
textValue
secondaryText
icon
disabled
viewProps
```

`value` 在同一个 Select 内必须唯一；重复 value 直接报错。`textValue` 只在 `text` 不是可直接转换为字符串的复杂 ReactNode 时提供，用于 typeahead 匹配。

## 14A.2 语义模型

Select 使用 select-only combobox 模型：

```text
trigger  → <button role="combobox">
popup    → role="listbox"
option   → role="option"
```

trigger 提供：

```text
aria-haspopup="listbox"
aria-expanded
aria-controls
aria-activedescendant
aria-autocomplete="none"
```

Option 使用 `aria-selected`，disabled option 使用 disabled 语义并从键盘导航和 typeahead 中跳过。

与 Menu 不同，打开 Select 后 DOM focus **始终留在 combobox trigger 上**；当前键盘目标通过 `aria-activedescendant` 指向 listbox 内的 active option。Option 本身不进入 Tab 顺序。

## 14A.3 打开与键盘导航

默认打开时：

- 如果当前 selected option 可用，则 active option 从当前 selected 开始；
- 否则 active option 为第一个 enabled option；
- trigger click / Enter / Space 打开；
- `ArrowDown / ArrowUp` 在关闭状态打开；
- `Home / End` 在关闭状态打开并定位到 first / last enabled option。

打开后：

```text
ArrowDown / ArrowUp   → 循环移动 active option
Home / End            → first / last enabled option
Enter / Space         → 提交 active option 并关闭
Escape                → 关闭，不改变 value
printable characters  → typeahead
```

键盘移动 active option 不会立即提交 value；只有 Enter / Space 或 pointer 选择才调用 `onValueChange`。这样“浏览候选项”和“已提交选择”保持不同语义。

## 14A.4 Typeahead

trigger 聚焦时输入可打印字符会进行前缀匹配：

- disabled option 不参与匹配；
- 连续字符在短时间内组成查询串；
- 若组合字符串没有匹配，会退回当前字符重新查找；
- 关闭状态下命中 typeahead 会打开 listbox，并把命中项设为 active；
- typeahead 只移动 active option，不自动提交 value。

普通字符串 `text` 自动作为匹配文本；复杂 `text` 通过显式 `textValue` 提供稳定搜索文本。

## 14A.5 Anchored overlay

Select 不实现第二套 popup 系统。listbox 复用 anchored-overlay infrastructure：

- placement 支持与 Popover 相同的八向位置；默认 `bottom-left`；
- 默认 `offset = 0.375rem`；
- `overlapTrigger=false` 为默认；设为 `true` 时，popup 的主轴基准改为 trigger 自身，从而覆盖 trigger，而不是从 trigger 外侧再留出默认间距；未显式传 `offset` 时 overlap 模式使用 `0`；
- 默认 `viewportPadding = 0.5rem`；
- 使用实时 anchor rect + panel 尺寸执行 flip / shift；
- scroll / resize / mutation 后重新定位；scroll callback 只调度下一动画帧，不在同步滚动回调中直接修改定位 / style，避免与 Firefox APZ 的异步平移产生 scroll-linked positioning；hover / press / transition / animation 产生的瞬时视觉 transform 不改变 overlay 锚点；
- trigger 只要仍与 viewport 相交就保持打开；完全离开 viewport 后自动 dismiss；
- anchor-hidden dismiss 不额外把 focus 拉回已经离屏的 trigger；
- outside pointer dismiss 关闭 listbox；
- exit motion 完成后才卸载 listbox；
- reduced motion 下跳过位移 / scale motion。

Select 只复用 anchored-overlay 的几何与生命周期基础设施，不复用 Popover 的 `role="dialog"`，也不复用 Menu 的 `menu/menuitem` focus 模型。

## 14A.6 Option 内容与 trigger 回显

`SelectOption` 支持：

```text
text
secondaryText
icon
disabled
```

trigger 回显当前 selected option 的 `text` 与可选 `icon`；`secondaryText` 只属于 listbox option，不塞进 trigger。没有 selected option 时显示 `placeholder`。

listbox option 默认保留 selected check affordance；selected 与 active 是不同状态，可以同时存在。Option 之间默认使用 `0.25rem` gap，Select 不在 option 之间插入 Divider。

## 14A.7 Theme

默认视觉来自：

```text
theme.components.Input
theme.components.Select.base
theme.components.Select.listbox
theme.components.Select.option
```

Select trigger 的 field surface 直接来自 `theme.components.Input` 与 Input stylesheet；`Select.base` 只控制 Select 自己新增的 trigger 内容结构，例如 gap / chevron icon size。`listbox` 控制 popup surface / 尺寸 / shadow / motion，包括 `enterScale / exitScale`；`option` 控制 active / selected / disabled、icon、check、`textGap` 与 typography。

`viewProps` 作用于 trigger；`listboxViewProps` 作用于 popup listbox。Select 自己拥有 combobox role、listbox role、fixed positioning、collision 坐标和 selection 语义，调用方不能通过这些 escape hatch 把它改成另一种控件。

## 14A.8 与 Combobox 的边界

Select 是**非可输入、固定候选集、单选**控件。以下能力不塞进 Select：

```text
editable text
filtering
free-form value
async suggestions
create option
multi-select
```

可输入 / 可过滤的固定候选输入由 `Combobox` 负责。Select 不通过不断增加布尔属性演化成 Combobox。

---
# 14B. `Divider`

`Divider` 是通用分割线组件，不属于 Menu 或 List 私有实现。

```tsx
<Divider />

<Divider
  direction="vertical"
  gap={0.5}
/>
```

公开属性：

```text
direction
  horizontal
  vertical

gap
size
viewProps
```

默认：

```text
direction = horizontal
gap = 0
size = 1
```

`size` 设置分割线厚度，类型为 number，**固定以 px 为单位**。例如 `size={1}` 表示 1px，`size={2}` 表示 2px。它不使用 Weave 常规数字 Length 的 rem 规则。未显式传 `size` 时，默认厚度来自 `theme.components.Divider.base.thickness`，默认主题为 1px；显式 `size` 始终覆盖 Theme 默认值。

`gap` 始终表示**分割线两侧的留白**：

- `direction="horizontal"`：gap 作用于上 / 下；
- `direction="vertical"`：gap 作用于左 / 右。

Divider 自身负责 `role="separator"` 与对应的 `aria-orientation`。

当 `gap=0` 时，Divider 的主轴布局尺寸为 0，线绘制在内容边界上，不额外撑开布局。因此 List 可以用 `<Divider gap={0} />` 保持紧邻 item 的边界分割；Menu 若需要视觉分组留白，则直接写带 gap 的 Divider。

---

# 14C. `Combobox`

`Combobox` 是**可输入、可过滤、固定候选集、单选**控件。它内部复用公开 `Input` 提供真实 `<input>` 宿主，并在该真实 input 上叠加 `role="combobox"` 与 editable-combobox 交互；popup 为 anchored `listbox`。第一版不支持 free-form / creatable：输入文本不是 value，只有提交已有 option 或 clear 才改变 value。

```tsx
<Combobox
  value={value}
  onValueChange={setValue}
  placeholder="Search workspace"
>
  <ComboboxOption
    value="design"
    text="Design"
    textValue="Design"
  />
  <ComboboxOption
    value="profile"
    text="Profile"
  />
</Combobox>
```

## 14C.1 双状态模型

Combobox 明确区分：

```text
value / defaultValue / onValueChange
inputValue / defaultInputValue / onInputValueChange
```

`value` 是已提交的 option value；`inputValue` 是输入框当前文字。用户打字只更新 inputValue 和过滤结果，**不会清空或修改 value**。只有 option 提交时才把 value 改成该 option；clear 会显式把 value 设为 null 并清空 inputValue。

当 inputValue 未受控时，提交 option 后输入框显示该 option 的 `textValue`。外部 value 改变时，未受控 input 也同步到新 selected option 的 textValue。

## 14C.2 Option 与 filtering

`ComboboxOption`：

```text
value
text
textValue
secondaryText
icon
disabled
viewProps
```

value 在同一 Combobox 内必须唯一。字符串 / number text 会自动生成 textValue；复杂 ReactNode 应显式提供 textValue。

默认 filter 对 textValue 做 case-insensitive substring 匹配。可以通过：

```tsx
filter={(option, inputValue) =>
  option.value.startsWith(inputValue.toLowerCase())
}
```

替换默认规则。filter 收到 `{ value, textValue, disabled }` 与当前 inputValue。`emptyContent` 控制无匹配项时 listbox 内显示的内容，默认 `No options`。

disabled option 可以显示，但不会成为 active，也不能被提交。

## 14C.3 ARIA / focus

```text
input  → <input role="combobox">
popup  → role="listbox"
item   → role="option"
```

input 提供 `aria-haspopup="listbox" / aria-expanded / aria-controls / aria-activedescendant / aria-autocomplete="list"`。打开 listbox 时 DOM focus 保持在 input；候选浏览状态通过 aria-activedescendant 表达。

键盘：

```text
ArrowDown / ArrowUp   → 打开或移动 active option
Home / End            → listbox 打开时 first / last enabled option
Enter                 → 提交 active option
Escape                → 关闭，不改变 value / inputValue
```

普通文本编辑键保持浏览器原生 input 行为；Combobox 不把 Space 或可打印字符劫持成菜单命令。

## 14C.4 Clear

`clearable=true` 为默认值。当存在 selected value 或输入文字时显示 clear action。clear：

- value → null；
- inputValue → ""；
- 关闭 popup；
- pointer 激活后 focus 回到 input。

`clearLabel` 控制 clear button 的 accessible name，默认 `Clear selection`。clear action 内部复用公开 `Button`，不再维护一套私有 `<button>` 实现。

## 14C.5 Anchored listbox

Combobox 复用统一 anchored-overlay 基础设施：8 向 placement、flip / shift、scroll / resize / mutation 跟踪、anchor 完全离开 viewport 后 dismiss、outside pointer dismiss 与 exit presence。hover / press / transition / animation 产生的瞬时视觉 transform 不改变 listbox 锚点。

listbox 默认至少和 input anchor 一样宽；input 宽度变化时会实时更新最小宽度。`offset` 默认 0.375rem，`viewportPadding` 默认 0.5rem。`overlapTrigger=false` 为默认；设为 `true` 时 listbox 以 input 自身作为主轴定位基准并覆盖 input，未显式传 `offset` 时使用 0。

focus 移出整个 Combobox root / listbox 时 popup 关闭；clear action 属于 root 内部交互。

## 14C.6 Theme

```text
theme.components.Input
theme.components.Combobox.base
theme.components.Combobox.listbox
theme.components.Combobox.option
```

Combobox 的真实输入直接是公开 `Input`，所以 field surface 与 typography 只由 `theme.components.Input` 控制。Combobox 关闭 Input 自身的 clear action，因为 Combobox clear 还必须同步清理 committed value；`Combobox.base` 控制 Combobox 自己新增的 chevron / action 尺寸、`actionGap / actionInset` 与空状态 `emptyPaddingX / emptyPaddingY`。clear 与 chevron 之间必须有显式 gap，chevron 到 field 右边缘必须有显式 inset，不能依赖 SVG 自身空白或偶然 padding。`listbox` 控制 popup surface / gap / size / shadow / motion，包括 `enterScale / exitScale`；`option` 控制 active / selected / disabled、icon、check、`textGap` 和 typography。

`viewProps` 作用于真实 input；`listboxViewProps` 作用于 popup listbox。

## 14C.7 边界

第一版 Combobox 不支持：

```text
free-form value
create option
multi-select
内建 async/loading 协议
```

业务可以通过更新 children 提供异步候选数据，但框架不把请求生命周期塞进 Combobox。本组件只负责输入、过滤、候选浏览与已有 option 的提交。

---
# 15. `Switch`

`Switch` 是开关组件。

Switch 的视觉仍由 Weave ViewHost 样式变量体系驱动；语义宿主使用真实 labelable button，thumb 是 Switch 自己的内部视觉 DOM：

```text
Switch
├─ <button type="button" role="switch">  // useViewHost；track + 可绑定语义宿主
│  └─ <div class="weave-view weave-switch__thumb"> // 内部视觉节点，不是公开 View 组件依赖
└─ <label> + visible label                // 仅传 label 时出现
```

这样保留 track / thumb 的 Weave 视觉变量体系与拖动行为；`label` 继续使用浏览器原生 label activation，而不是额外模拟一次点击。

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
- Switch 的 thumb drag feedback 是所有切换路径共享的视觉语言：thumb 的纵向基准始终使用 `top: 50% + translateY(-50%)`，静止、checked、自动 drag、手动 drag 都只能改变水平位移和宽高，不能各自计算不同的纵向位置；pointer down 在 thumb 或 track 任意位置都立即进入 `thumbDragShrink` 形变；实际拖动时继续按距离实时拉长并跟手，释放时以轨道中点决定最终状态；普通点击、点击 label、Space / Enter 等没有手动拖动距离的切换，也必须自动播放同一套 shrink → stretch → 后半程连续收窄并恢复高度 → 以正常圆形到达另一端的完整轨迹。自动轨迹在终点前必须已经回到静止几何，不能在最后一帧靠清除 inline width / height / transform 产生可见跳变，也不能退化成普通圆点平移
- 拖动完成后产生的兼容 click 不得再次反向切换
- disabled 状态下点击、键盘与拖动都不能改变状态
- `label` 是可见且可点击的真实绑定标签；Switch 宿主使用可 label 的原生 `<button type="button" role="switch">`，点击 label 与点击控件本体等价，同时 label 参与 accessible name；Switch 控件与可见 label 的间距来自 `theme.components.Switch.base.fieldGap`，默认 `0.5rem`（8px）

拖动中的 thumb 位置属于组件内部交互几何，可由渲染后端直接同步；它不是用户显式 `style`，也不改变公开样式优先级。拖动期间不对 pointer movement 做缓动，保证直接跟手；松手后的归位才允许使用主题 motion curve。

### size

```text
small
medium
large
```

## 15.2 `Radio` 与 `Checkbox`

`Radio` 与 `Checkbox` 都使用真实原生输入控件，而不是用 `div role=...` 模拟：

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
- `small / medium / large` 三档默认尺寸分别为 `1.125rem / 1.375rem / 1.625rem`（18 / 22 / 26px），由 `theme.components.Radio / Checkbox.sizes` 提供；press 位移 / 缩放与 state-layer 初始 scale 分别由各自 `base.pressOffset / pressScale / stateLayerRestScale` 提供，不得在 stylesheet 中写死；Playground 必须同时展示三档，不能只展示默认 medium。

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

`Progress` 是进度组件。

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

`Scrollbar` 是一个特殊的滚动条组件。

## 17.1 它复用 ViewHost 通用能力

不是：

```css
::-webkit-scrollbar
```

不是 WebKit 伪元素皮肤。

不是单纯的 CSS scrollbar 主题。

它是：

> 框架自己的组件；内部通过 `useViewHost` 复用 `View` 的通用能力，并直接操作真实滚动宿主，不依赖浏览器私有 scrollbar 伪元素皮肤。

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

Scrollbar 的默认视觉刻意与 Switch / Progress 区分：它没有可见轨道，也没有凸起阴影，只保留平面的 thumb。hover / drag 仍可改变颜色和横截面尺度，但不会通过 shadow 模拟抬起。hover 的横截面放大使用 `theme.components.Scrollbar.base.hoverScale`，默认 `1.18`；vertical 只增宽 X 轴，horizontal 只增高 Y 轴，不改变滚动方向上的 thumb 长度和 scroll geometry。drag 继续使用全局 drag feedback。

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
- 高频 target `scroll` 路径只能读取 `scrollTop / scrollLeft` 并更新 thumb transform；不得在每个 scroll event 中重新执行 `getBoundingClientRect()` / `getComputedStyle()` 等布局测量。scroll listener 本身只负责调度下一动画帧，不能在 Firefox APZ 的同步 scroll callback 内直接写 position / transform / style。
- track/thumb 几何只在 resize、theme/layout 改变、DOM 尺寸变化或外层滚动导致 target viewport 位置变化时重新计算。
- document-level scroll 监听必须排除 target 自己的 scroll，避免同一次滚动同时触发位置同步与完整几何重算。
- 自动挂载不能改变用户拿到的 `View` / `Input` ref 所指向的真实滚动元素。

---

# 18. `Button`

`Button` 直接复用 `Text`，并可承载已有 Icon 内容能力。

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

自定义 breakpoint 名称同样适用；其名称需要同时注册到 `Weave.BreakpointRegistry`，阈值仍由当前 ThemeProvider 的 `breakpoints` 提供：

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

`Link` 的语义宿主必须是真实 `<a>`，不能用 Button / div 模拟导航。

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

- `text` 未提供时，直接显示 `href`；提供后只改变可见文字，不改变真实 `href`。可见文字内部复用公开 `Text`，不维护私有文本 span 的平行实现。
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

默认颜色、icon 尺寸、内容间距、底线颜色 / 厚度 / offset、rest / hover / active 的 marker 宽度与 focus outline 来自 `theme.components.Link.base`。默认 `underlineWidth / underlineHoverWidth / underlineActiveWidth` 分别为 `45% / 60% / 80%`；默认颜色和底线都使用 `primary` token，因此 Light / Dark 自动沿主题变化。

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

- 不传 `dot` 时是正常 Badge，必须提供 `text`；`text` 可以是 ReactNode，并由公开 `Text` 承载可见文字。dot 模式不渲染 `Text`。
- `dot` 为 `true` 时只显示小圆点，不显示文字；类型层不允许同时传 `text`。
- dot 是纯视觉状态点，因此自身 `aria-hidden=true`；正常文本 Badge 保留可读文本。
- Badge 默认 `pointer-events: none`，不会盖住或拦截被附着控件的点击、hover、focus、drag。
- `visible` 默认为 `true`。设为 `false` 只隐藏 Badge 本体，不卸载或隐藏被包裹的 `children`。
- Badge 的动画**方向**由 `placement` 决定，而不是使用目标中心到 placement 的真实距离：popup 以“组件中心 → placement”为朝向，从最终位置内侧的一小段固定距离滑入并完成 opacity + scale；dismiss 沿相反方向退回同样的短距离后 fade + shrink。八个 placement 只决定方向，实际 motion 距离保持短且稳定，不随目标尺寸变化。`reducedMotion=reduce` 时跳过这两段动画。
- Badge 不使用 ToolTip / Snack 的 portal 或 layer region；它仍在本地包装容器内做定位，但锚点坐标来自被包裹目标的实时视觉边界。

默认主题来自 `theme.components.Badge.base`：正常 Badge 使用 `primary / onPrimary`，并用 `surface` 边界把角标与复杂背景分离；默认高度 `1.25rem`，dot 直径 `0.625rem`。背景、文字、边界、圆角、padding、dot 尺寸、shadow、typography，以及 `motionDistance / motionDiagonal / enterScale / overshootScale / exitScale` 均由主题提供。

---

# 18.11 `Tabs`

`Tabs` 是标准 compound selection / navigation 组件，由 `Tabs / TabList / Tab / TabPanel` 四个公开组件组成。

## 18.11.1 组合 API

```tsx
<Tabs value={tab} onValueChange={setTab}>
  <TabList>
    <Tab value="general">General</Tab>
    <Tab value="appearance">Appearance</Tab>
    <Tab value="advanced" disabled>
      Advanced
    </Tab>
  </TabList>

  <TabPanel value="general">...</TabPanel>
  <TabPanel value="appearance">...</TabPanel>
  <TabPanel value="advanced">...</TabPanel>
</Tabs>
```

`Tabs` 当前高层属性：

```text
children
value
defaultValue
onValueChange
orientation
activation
variant
indicatorThickness
viewProps
```

默认：

```text
orientation = horizontal
activation = automatic
variant = underline
indicatorThickness = theme.components.Tabs.base.indicatorThickness (默认 2px)
```

如果既没有 `value` 也没有 `defaultValue`，默认选择声明顺序中的第一个 enabled Tab。disabled Tab 不参与默认选择与 roving focus。

## 18.11.2 variant

默认视觉是 underline：

```tsx
<Tabs>
  ...
</Tabs>
```

选中 Tab 使用 primary 文字与一个共享 indicator。整个 TabList 只渲染一个 indicator 元素；选中值变化时根据目标 Tab 的真实几何更新该元素的位置与长度，并直接复用 View 的 `layoutAnimation`（spring snappy + interruption=continue）完成连续 FLIP 位移，因此 indicator 不是旧 indicator 淡出、新 indicator 淡入。horizontal 时 indicator 位于底部并沿 X 轴移动，vertical 时位于左侧并沿 Y 轴移动。

Underline 的 indicator **不得贴住 Tab item**。安全间距直接复用 Tabs 已有的 `listGap`，不新增另一套 gap：horizontal TabList 在底部预留 `listGap + indicatorThickness`；vertical TabList 在左侧预留 `listGap + indicatorThickness`。因此 item 边缘到 indicator 边缘的实际安全 gap 恒等于 `listGap`。

需要 pill 时显式：

```tsx
<Tabs variant="pill">
  ...
</Tabs>
```

pill 只改变视觉，不改变选择、focus、ARIA 或键盘语义。整个 TabList **直接复用 Select/Input 的 field surface**：加载同一份 Input stylesheet，并使用同一个 `resolveInputTheme(theme)` runtime class；不得在 Tabs theme 内复制 background / border / shadow / radius。pill TabList 默认 `width="fit"`、`minWidth=0`，只包住自身 Tab，不允许因为 Tabs root 的 column stretch 而横向拉满。

PillItem 之间必须有安全 gap，并直接使用现有 `listGap`；TabList 必须把它显式作为 View 的 `gap`，不能只依赖 component fallback。默认 `listGap=0.25rem`。

Pill 槽内默认四边 padding 保持完全一致（默认 0.25rem），不得为了 active item 的突起效果改变整个 TabList 的 bottom padding，否则会把所有 non-active Tab 一起推偏。Button rest surface 的实体 depth 只向下延伸，因此只对 **selected pill Tab 自己**压缩 bottom padding：`tabPaddingY - feedback.restDepth`；non-active Tab 继续保持完整的 `tabPaddingY`。horizontal pill 的 TabList 必须使用 `align-items:start`，禁止 flex stretch 把 selected Tab 压缩后的 box 高度重新拉满。这样 active Tab 少掉的下 padding才会真正缩短 box，再由 Button rest depth 补回可见高度，使 active 与 non-active 的上下视觉位置一致。

active / selected pill 不是给当前 Tab 自己加一套 shadow，而是与 underline 相同地只保留**一个共享 moving surface**。这个 surface 直接挂 Button 的真实 `weave-button + weave-button--primary + weave-button--medium + resolveButtonTheme(theme)` 配方，并关闭 pointer interaction；选择变化时仍使用同一套 `View.layoutAnimation` FLIP，从一个 Tab 连续位移/缩放到另一个 Tab。Tab 文本本身位于 moving Button surface 上方。不得在 Tabs 内复制 Button 的 background / border / depthColor / rest-depth 配方。

Light 默认 hover 必须明显区别于复用的 Input 槽面：Light 的 `tabHoverBackground` 使用现有 `surface` token；Dark 保持原来的 `surfaceHover`，不因为 Light 的可见性修正改变 Dark。

`variant`：

```text
underline
pill
```

## 18.11.3 受控与非受控

`value / defaultValue / onValueChange` 使用单值选择模型：

- `value` 存在时为 controlled；
- controlled 请求只触发 `onValueChange(next)`，不会自行篡改父级值；
- 父级拒绝一次请求后，再次请求同一个 next value 仍必须再次触发 callback；
- uncontrolled 时点击或激活 Tab 直接更新内部值。

所有 TabPanel 保持挂载；未选中 Panel 保留原生 `hidden`，同时 Tabs 必须显式保证其真实 display 为 `none`，因为通用 View stylesheet 会定义 display，不能依赖浏览器 UA 的 `[hidden] { display: none }` 在 cascade 中碰巧获胜。

## 18.11.4 Focus 与键盘

Tab 使用 roving tabindex：

```text
当前 roving focus target → tabIndex=0
其他 enabled Tab          → tabIndex=-1
disabled Tab               → disabled + aria-disabled=true
```

horizontal：

```text
ArrowLeft  → previous enabled Tab
ArrowRight → next enabled Tab
```

vertical：

```text
ArrowUp   → previous enabled Tab
ArrowDown → next enabled Tab
```

两种方向都支持：

```text
Home → first enabled Tab
End  → last enabled Tab
```

previous / next 在首尾循环，并跳过 disabled。

`activation="automatic"` 时，Arrow / Home / End 移动 focus 后同时激活目标 Tab。

`activation="manual"` 时，Arrow / Home / End 只移动 focus 与 roving tabindex，不改变 selected value；Enter / Space 才激活当前 focused Tab。Pointer click 在两种 activation 模式下都会同时更新 roving focus 与 selected value。

## 18.11.5 ARIA

DOM 语义固定为：

```text
TabList  → role="tablist" + aria-orientation
Tab      → native button + role="tab"
           aria-selected
           aria-controls
TabPanel → role="tabpanel"
           aria-labelledby
           hidden when inactive
```

同一 Tabs root 使用稳定 id namespace 将每个 `Tab value` 与同 value 的 `TabPanel` 双向关联。Tab 与 TabPanel 必须处于同一个 Tabs context；脱离 Tabs 单独使用属于开发错误。

## 18.11.6 Theme

默认视觉来自：

```text
theme.components.Tabs.base
```

当前字段：

```text
gap
listGap
tabBackground
tabHoverBackground
tabColor
tabSelectedColor
tabRadius
tabPaddingX
tabPaddingY
indicatorColor
indicatorThickness
typo
focusOutlineWidth
focusOutlineColor
focusOutlineStyle
focusOutlineOffset
disabledOpacity
```

`indicatorThickness` 与 Divider 的 `size` 一样以 px 为唯一数字单位：`indicatorThickness={3}` 就是 3px；theme 中的数字同样直接输出 px，不经过 rem scale。

Underline Tab 不复用 Button 的 press / depth 反馈；hover 只使用轻量 state background。Pill variant 的凹槽**必须来自 Input/Select field surface**，active moving surface **必须来自 Button primary / medium 的 rest surface**。Tabs 只负责组合这两个既有视觉源与 shared-indicator 位移，不得拥有 `pillListShadow / pillSelectedShadow / pillSelectedBackground` 等平行视觉实现。moving surface 不是可交互 Button，因此不响应 Button hover-lift / press-depth。

---

# 18.12 `Card`

`Card` 是通用实体表面容器。它默认只负责视觉容器能力，也可以按需独立开启点击激活与选择能力。

## 18.12.1 API

```tsx
<Card>
  <Text typo="title-medium">普通 Card</Text>
</Card>

<Card clickable viewProps={{ onClick: openDetails }}>
  ...
</Card>

<Card
  selectable
  selected={selected}
  onSelectedChange={setSelected}
>
  ...
</Card>

<Card
  clickable
  selectable
  onSelectedChange={setSelected}
  viewProps={{ onClick: openDetails }}
>
  ...
</Card>
```

当前高层属性：

```text
children
clickable
selectable
selected
defaultSelected
onSelectedChange
viewProps
```

`clickable` 与 `selectable` 是两个彼此独立的可选能力，四种组合都合法：

```text
clickable=false + selectable=false → 普通实体容器
clickable=true  + selectable=false → 可激活 Card
clickable=false + selectable=true  → 可选择 Card
clickable=true  + selectable=true  → 同时可激活、可选择
```

只有 `selectable=true` 时才能使用 `selected / defaultSelected / onSelectedChange`。

## 18.12.2 点击与选择

`selectable` 使用标准受控 / 非受控 boolean 模型：

- `selected` 存在时为 controlled；
- `defaultSelected` 只设置 uncontrolled 初始状态；
- 状态请求通过 `onSelectedChange(next)` 上报；
- controlled 父级拒绝一次状态请求后，再次请求同一个值仍会再次触发 callback。

`clickable + selectable` 同时开启时，同一次 Card 激活同时执行两个能力：

```text
activation
├─ clickable → viewProps.onClick
└─ selectable → toggle selected
```

如果 `viewProps.onClick` 调用了 `preventDefault()`，本次默认 selection toggle 被取消；这与已有 ListItem 的可取消选择行为一致。

Card 内可以组合 Button、Link、Input、Switch 等交互子元素。来自交互子元素的 pointer / click 不得冒泡成 Card 自身 activation，也不得切换 Card selection。该判定与 ListItem 复用同一个内部 interactive-descendant helper，不维护第二套 selector。

## 18.12.3 DOM、键盘与 ARIA

Card 继续使用普通 View / `<div>` 宿主，不改成 native `<button>`，因此允许内部合法组合 Button、Link、Input 等交互控件。

当 `clickable || selectable` 时：

```text
role="button"
tabIndex=0（除非 viewProps 显式覆盖）
Enter → activation
Space → activation
```

当 `selectable=true` 时：

```text
aria-pressed = selected
```

Card 不伪造 listbox / option 关系；独立 Card 的选择状态使用 button + `aria-pressed` 表达。

`viewProps.disabled=true` 沿用 View 通用 disabled 语义，并阻止 Card activation 与 selection change。

## 18.12.4 默认视觉

Card 无论是否可交互，都属于 Weave 的 raised / tactile surface，并始终具有无 blur 的实体 depth。它不再使用普通 ambient blur shadow。

默认 Card：

```text
background  = surface
border      = outline / 0.0625rem
radius      = large
padding     = 1rem
restDepth   = 0.125rem   // 2px
```

Card 的实体 depth 明确弱于 Button。默认 raised surface 与 Button secondary 共用颜色来源：

```text
background       = surface
borderColor      = outline
depthColor       = raisedSurfaceDepthColor
hoverBackground  = surfaceHover
activeBackground = Button secondary active surface
```

Card 自己拥有较弱的 depth 尺度：

```text
restDepth  = 0.125rem    // 2px
hoverDepth = 0.1875rem   // 3px
pressDepth = 0.03125rem  // 0.5px
```

Button 默认仍为 3px / 4px / 1px，因此 Card 在 rest / hover / press 三个阶段都更弱。

只有 `clickable || selectable` 时才响应 hover / press；Passive Card 始终停留在 2px rest depth。交互位移与缩放继续复用全局 `feedback.hoverLift / hoverScale / pressOffset / pressScale`，不创建 Card 私有 motion token。

`selectable=true && selected=true` 时：

```text
background  = primary 轻量染色 surface
borderColor = primary
```

选中态不自动插入勾选图标或额外装饰 UI。

## 18.12.5 Theme

默认视觉来自：

```text
theme.components.Card.base
```

当前字段：

```text
background
borderColor
borderWidth
radius
padding
restDepth
hoverDepth
pressDepth
depthColor
hoverBackground
activeBackground
selectedBackground
selectedBorderColor
cursor
focusOutlineWidth
focusOutlineColor
focusOutlineStyle
focusOutlineOffset
```

Card 没有 `variant`、`size`、header/footer 等额外高层 API；内容结构继续由 children 与现有 Weave 组件组合。

---

# 18.12A `AppBar`

`AppBar` 是应用顶部栏容器，固定由 `leading / title / trailing` 三个区域组成。它不提供 collapse / large-title scroll transition，也不会根据滚动状态改变 elevation。

## 18.12A.1 API

```tsx
<AppBar
  leading={<Button text="Back" />}
  title={<Text>Settings</Text>}
  trailing={<Button text="Save" />}
/>
```

公开高层属性：

```text
leading?: ReactNode
title: Text element
trailing?: ReactNode
size?: "small" | "medium" | "large"
mode?: "full" | "floating"
titleAlign?: "start" | "center" | "end"
sticky?: boolean
elevated?: boolean
viewProps
```

默认值：

```text
size = "medium"
mode = "full"
titleAlign = "start"
sticky = false
elevated = false
```

`leading` 与 `trailing` 接受任意 ReactNode。两侧区域按水平 flex 排列并垂直居中。

`title` 只允许直接传入 Weave `<Text>` 元素；其他元素无效。AppBar 会按当前 size 提供默认 typo，但调用方显式传给 Text 的 `typo` 优先。

## 18.12A.2 Size

默认三档：

```text
small:
  height = 3rem
  marginX = 0.75rem
  gap = 0.5rem
  titleTypo = title-small

medium:
  height = 3.5rem
  marginX = 1rem
  gap = 0.75rem
  titleTypo = title-medium

large:
  height = 4rem
  marginX = 1.25rem
  gap = 1rem
  titleTypo = title-large
```

这些值来自 `theme.components.AppBar.sizes`，不是 renderer 常量。`marginX` 不作用于 AppBar 宿主：`leading` 只使用左 margin，`title` 使用左右 margin，`trailing` 只使用右 margin。相邻 slot 之间不会把两份 margin 叠加；`leading / trailing` 内多个 action 的间距仍由 `gap` 控制。

## 18.12A.3 三区域与 titleAlign

内部固定为三列：

```text
leading | title | trailing
auto      1fr     auto
```

`titleAlign` 控制 title 在中间 title 区域内的对齐：

```text
start
center
end
```

它不通过复制左右区域宽度来强制标题相对整个 viewport 绝对居中，因此 leading / trailing 宽度不同时，中间区域本身仍由真实剩余空间决定。

## 18.12A.4 mode

`full`：

```text
width = fill
margin = 0
borderRadius = 0
```

`floating`：

```text
width = available width minus both margins
margin = 1rem
borderRadius = theme.components.AppBar.base.radius
```

默认 floating margin 为 1rem，并由 `theme.components.AppBar.base.floatingMargin` 控制。

## 18.12A.5 Surface / depth

AppBar 默认是 flat surface：使用 `background`，没有 border，也没有 depth。

只有显式传 `elevated` 时才进入 raised surface：背景切换为 `elevatedBackground`，并启用 AppBar theme 的 border、rest depth 与 depth color。默认 `elevatedBackground = surfaceHover`。AppBar 不继承 Card 的 clickable / selectable / hover / press 行为。

`full` 始终覆盖 radius 为 0；`floating` 保留 AppBar theme radius。

`elevated` 的 depth 是固定 rest depth；滚动、sticky 状态不会改变 elevation。

## 18.12A.6 sticky

AppBar 默认参与普通文档流。

```tsx
<AppBar sticky ... />
```

启用后使用原生：

```css
position: sticky;
top: 0;
```

不创建第二套 scroll observer，不根据 scroll position 改变视觉状态。

## 18.12A.7 DOM 与 Theme

AppBar 宿主使用原生 `<header>`。辅助语义仍可通过 `viewProps` 补充。

Theme：

```text
theme.components.AppBar.base:
  background
  elevatedBackground
  borderColor
  borderWidth
  radius
  restDepth
  depthColor
  floatingMargin

theme.components.AppBar.sizes.small / medium / large:
  height
  marginX
  gap
  titleTypo
```

# 18.13 `Skeleton`

`Skeleton` 是无内容的加载占位组件，只负责表达内容尚未就绪的视觉状态。它继续使用普通 ViewHost，不引入独立布局系统，也不承载 children。

## 18.13.1 API

```tsx
<Skeleton viewProps={{ width: 12, height: 6 }} />
<Skeleton shape="circle" viewProps={{ width: 4 }} />
<Skeleton shape="text" viewProps={{ width: 16 }} />
```

当前高层属性只有：

```text
shape = "rect" | "circle" | "text"
viewProps
```

默认 `shape="rect"`。尺寸继续使用 `viewProps`，不额外创建 `width / height / size` 高层属性。

## 18.13.2 Shape

`rect` 是普通块状占位。它使用 Skeleton 主题默认圆角，具体宽高由 `viewProps` 决定。

`circle` 使用 `aspect-ratio: 1 / 1` 与 full radius；调用方提供单一主尺寸即可得到 1:1 圆形占位。

`text` 用于模拟当前排版上下文中的一行文字：

```text
width  = 100%（可由 viewProps.width 覆盖）
height = 1lh
radius = theme.components.Skeleton.base.textRadius
```

因此 text Skeleton 的高度直接跟随当前元素实际 `line-height`，不维护另一套字号表。

## 18.13.3 Shimmer 与 reduced motion

Skeleton 默认持续运行单向 shimmer。底色与高光从当前文字色派生，以便在 light / dark mode 下都与 surface 保持清晰分层：

```text
background = color-mix(in srgb, currentColor 20%, transparent)
highlight  = color-mix(in srgb, currentColor 32%, transparent)
```

shimmer 只在 Skeleton 自身表面移动，不改变布局、尺寸、opacity 或 transform 状态。

默认 `shimmerDuration = 1280ms`，相当于默认 theme `motion.duration.slow` 的四倍；该值属于 `SkeletonTheme`，不是组件级 prop。

Skeleton 必须复用全局 reduced-motion 偏好。当 resolved reduced motion 为 `reduce` 时：

```text
animation = none
shimmer highlight = hidden
```

不得继续播放 pulse、opacity 呼吸或替代运动。

## 18.13.4 Theme

默认视觉来自：

```text
theme.components.Skeleton.base
```

字段：

```text
background
highlight
radius
textRadius
shimmerDuration
```

Skeleton 不增加 variant、size、lines/count 或 children API。多行文字骨架由多个 `Skeleton shape="text"` 通过现有 Column / Row 组合。

---

# 18.14 `Avatar`

`Avatar` 是固定圆形的人物 / 实体视觉标识。它复用现有 `Image` 处理图片内容，并使用普通 ViewHost 承载容器、主题和语义。

## 18.14.1 API

```tsx
<Avatar src={url} name="Ada Lovelace" />
<Avatar name="Ada Lovelace" />
<Avatar name="Ada Lovelace" fallback="AL" />
<Avatar />
```

公开高层属性只有：

```text
src?: ImageSource
name?: string
fallback?: ReactNode
viewProps
```

Avatar 不提供 `size`、status、group、clickable 或独立 children API。尺寸继续由 `viewProps.width / height` 控制。

## 18.14.2 圆形与尺寸

Avatar 固定使用圆形裁切。

默认尺寸：

```text
width  = 2.5rem
height = 2.5rem
aspect-ratio = 1 / 1
```

如果只提供 `viewProps.width` 或只提供 `viewProps.height`，另一边由 `aspect-ratio: 1 / 1` 补齐。

## 18.14.3 图片

存在可用 `src` 时，Avatar 内部复用 `Image`：

```text
fit      = cover
position = center
```

内部图片是视觉内容，使用空 alt；Avatar 本身需要语义时由调用方继续通过 `viewProps.label / role / description` 等 View 语义属性提供。

图片加载失败后，Avatar 自动进入 fallback 路径。

## 18.14.4 Fallback

fallback 优先级固定为：

```text
有效图片
→ 显式 fallback
→ name initials
→ 空内容
```

`fallback` 类型为 `ReactNode`，因此可以传字符串、Icon 或其他现有 Weave 组合。

没有 `src` 时，Avatar 自身必须仍然绘制 background-color；当图片失败进入 fallback 时同样显示该容器表面。

如果 `fallback` 与 `name` 都没有，Avatar 保持空白，不自动插入 generic user icon。

## 18.14.5 Initials

`name` 自动 initials 规则：

```text
"Ada Lovelace" → "AL"
"Ada Byron Lovelace" → "AL"
"Cher" → "CH"
```

多词名称取首词与末词的第一个字符；单词名称取前两个字符；结果转为大写。

initials / 文本 fallback 的字号按 Avatar 当前宽度同比例缩放。默认 2.5rem Avatar 对应 1rem fallback 字号。

## 18.14.6 Theme

默认主题来自：

```text
theme.components.Avatar.base
```

字段：

```text
defaultSize = 2.5rem
background = surfaceHover
color      = tertiary
borderColor = outline
borderWidth = 0.0625rem
```

这套 neutral fallback surface 同时用于 initials、显式 fallback、空白 Avatar 和图片失败状态。图片成功时仍保留相同容器边框，图片覆盖容器背景。

---

# 18.15 `Slider`

`Slider` 是单值、水平数值滑块。它直接使用原生 `<input type="range">` 作为交互与可访问性基础，不实现自定义 ARIA slider 状态机。

## 18.15.1 API

```tsx
<Slider />
<Slider value={volume} onChange={setVolume} />
<Slider min={-20} max={20} step={5} defaultValue={5} />
```

公开高层属性：

```text
value?: number
defaultValue?: number
onChange?: (value: number) => void
min?: number
max?: number
step?: number
disabled?: boolean
label?: ReactNode
size?: "small" | "medium" | "large"
viewProps
```

默认值：

```text
min = 0
max = 100
step = 1
defaultValue = min
size = "medium"
```

Slider 支持 controlled / uncontrolled 两种状态。传入 value 或 defaultValue 超出 `min..max` 时，渲染值 clamp 到当前范围。

Slider 本身只支持单值 horizontal 模式；双 thumb 范围选择由独立 `RangeSlider` 提供。Slider 仍不提供 vertical / orientation、marks / ticks、tooltip、value bubble、formatter 或 `onChangeEnd`。

## 18.15.2 Native interaction

Slider 直接保留原生 range 的行为：

```text
track click
thumb drag
Arrow keys
Home / End
PageUp / PageDown
```

拖动过程中原生 range 的连续数值更新进入 `onChange`。组件不创建第二套 pointer drag 或 keyboard state machine。

## 18.15.3 Label

`label` 存在时，它只作为 Slider 旁边的普通可见文本，不使用原生 `<label>`、不建立 `htmlFor` 激活关系；点击这段文字不能聚焦、跳值或触发 Slider。组件仍通过 `aria-labelledby` 引用该文本，使它可以作为 range 的 accessible name。

因此 Slider 的 `label` 语义与 Switch / Radio / Checkbox 不同：后者的可见 label 本身就是交互命中区域，而 Slider 的可见 label 不是交互控件的一部分。未提供高层 `label` 时，语义继续通过 `viewProps.label / labelledBy / description` 等 View 语义字段提供。Slider 本体与可见 label 之间必须保留安全 gap，直接使用现有 `theme.components.Slider.base.fieldGap`；默认值为 `0.5rem`（8px）。

## 18.15.4 Geometry

Slider 默认宽度：

```text
16rem
```

`viewProps.width` 可覆盖。

Slider 的基础几何采用 M3 Slider 的粗 track + 独立圆形 thumb + thumb-track gap 结构，再叠加 Weave 自己的实体层级与触感。

track 厚度与 gap 保留 M3 的粗轨道比例；静止 thumb 使用 Weave Slider 已冻结的圆形尺寸：

```text
small  = track 0.75rem / thumb 1rem    / gap 0.28125rem
medium = track 1rem    / thumb 1.25rem / gap 0.375rem
large  = track 1.25rem / thumb 1.5rem  / gap 0.46875rem
```

active / inactive track 必须是两段真实分离的 surface，不能再用一条连续轨道加渐变或覆盖色模拟。静止 thumb 必须是圆形并位于轨道断口中央；面向 thumb 的中断面保留方切，不使用 radius，只有轨道最外侧端点保持 full radius。

## 18.15.5 物理层级、Fill 与 Step

Slider 的物理隐喻固定为：

```text
inactive track = 凹陷槽
active fill    = 从槽中抬起的实体 surface
thumb          = 与 active track 同层级的圆形可抓取实体
thumb dot      = thumb 中心常驻对比 dot，与 step 是否开启无关
step dot       = 沿轨道明确标记每一个有效离散 step
```

inactive track 复用 Switch 的 inset track shadow；active track 不使用 inset shadow，并在 Switch thumb 的 raised shadow 基础上叠加 0.125rem（2px）的实体 depth，使 active surface 高于凹槽但不达到 Button 的强突起。thumb 默认与 active track 使用同一 active color，并使用 raised shadow。因此 active / inactive 不是一条轨道上的两种颜色，而是两个不同 Z 层级的表面。active / inactive 在 thumb 两侧断开，中间 gap 由 thumb 的实体占位与 M3 gap 共同形成。

Slider 的已选轨道由当前值计算：

```text
progress = (value - min) / (max - min)
```

已选部分使用 `fillColor`；未选部分使用 `trackColor`。当 `max <= min` 时 progress 固定为 0。progress 表示 thumb 中心位置；active / inactive track 的内侧边界必须分别从该位置减去 / 加上 `thumbSize / 2 + thumbTrackGap`，保证视觉上始终存在真实断口。到达 max 时 inactive track 必须收敛为 0 宽，不得在 thumb 右侧残留凹槽。

当调用方显式传入 `step > 0` 且范围有效时，Slider 进入离散视觉，每个从 `min` 到 `max` 的 step 都必须有明确 dot；未显式传 `step` 时完全不渲染 dot，包括 max 端。medium 的 dot 为 4px（track 高度的 1/4），small / large 按 track 比例缩放。dot 垂直严格居中；step dot 与 thumb 必须共享完全相同的 value axis，禁止再对 dot 容器做第二层左右内缩、clamp 或独立位置映射。同一个数值对应的 step dot 中心必须与该数值下的 thumb 中心完全重合，前后相邻 step 到 thumb 的中心距离必须相等。离散视觉下，两段轨道的最外侧圆角端帽圆心必须分别与 `min` / `max` 端点 step dot 的中心重合，因此轨道在对应 value axis 之外最多延伸 `trackHeight / 2`。这样端点 dot 完整位于圆角端帽中央，而不是与端帽边缘相切；该延伸不得改变 value axis、thumb gap 或内侧断口，并在对应轨道收敛为 0 时同步收敛为 0。active tick 使用 active surface 的对比色；inactive tick 使用 active color。

Slider 默认不复制一套独立的轨道视觉。未显式覆盖 Slider theme 时：

```text
trackColor  = theme.components.Switch.base.background
trackShadow = theme.components.Switch.base.trackShadow
fillColor   = theme.components.Switch.states.checked.background
```

因此 light / dark mode 与后续 Switch 视觉调整会直接传递到 Slider，避免两个基础输入控件逐渐形成平行设计语言。

## 18.15.6 Thumb 与状态

默认 thumb 将 active color 与 Weave 的实体 depth 合并：

```text
background  = Slider.fillColor
shadow      = theme.components.Switch.base.thumbShadow
hoverShadow = theme.components.Switch.base.thumbHoverShadow
borderWidth = 0
centerDot   = activeDotColor / 与 step dot 同尺寸
```

thumb 中心 dot 必须始终显示，无论调用方是否显式传入 `step`；它属于 thumb 本身，不计入 step dot 数量。它直接复用 active step dot 的同一基础 dot 样式与 active 对比色，不维护第二套尺寸、圆角或颜色定义。

Slider 仍允许通过自身 theme 覆盖这些值。

Slider 的 thumb motion 必须复用 Switch 的同一 shape 算法，而不是简单 `scale()`：

```text
rest         → 圆形
pointer down → 无论命中 thumb 还是 track，都按 Switch.thumbDragShrink 同比收缩
drag         → 高度保持收缩值，宽度按 Switch.thumbDragMaxWidth 有上限地横向拉长
step drag    → 显式 step 时不关闭位置 transition；thumb 与两段 track 在跨 step 时继续使用 motion.spring.snappy，从当前 step 带阻尼地吸附到下一 step
continuous drag → 未显式 step 时仍关闭位置 transition，保持直接跟手
release      → 只有松手时才使用 motion.spring.snappy 恢复完整圆形
keyboard / track jump → 非 pointer interaction 状态下用同一 snappy spring 移动 active fill 与 thumb
reduced motion → 取消上述 transition
```

focus-visible 使用统一 `focus` outline。

disabled：

```text
opacity = 0.5
cursor  = not-allowed
```

## 18.15.7 Theme

默认主题来自：

```text
theme.components.Slider
```

字段：

```text
base.fieldGap
base.width
base.trackColor
base.trackShadow
base.fillColor
base.thumbBackground
base.thumbBorderColor
base.thumbBorderWidth
base.thumbShadow
base.thumbHoverShadow
base.thumbPressShadow
base.activeTrackShadow
base.cursor
base.focusOutlineWidth
base.focusOutlineColor
base.focusOutlineStyle
base.focusOutlineOffset

sizes.small.trackHeight / thumbSize / thumbTrackGap
sizes.medium.trackHeight / thumbSize / thumbTrackGap
sizes.large.trackHeight / thumbSize / thumbTrackGap

states.disabled.opacity
```

---

# 18.15A `RangeSlider`

`RangeSlider` 是双 thumb、水平范围滑块。它不是另一套 Slider 视觉或交互系统，而是直接复用 `Slider` 已冻结的视觉、Theme、thumb shape、step axis 与 motion，并使用两个真实 `<input type="range">` 保留浏览器原生键盘、拖动、focus 与 form participation。

## 18.15A.1 API

```tsx
<RangeSlider />
<RangeSlider value={[start, end]} onChange={setRange} />
<RangeSlider min={0} max={100} step={5} defaultValue={[20, 80]} />
```

公开高层属性：

```text
value?: [number, number]
defaultValue?: [number, number]
onChange?: (value: [number, number]) => void
startName?: string
endName?: string
startLabel?: string
endLabel?: string
min?: number
max?: number
step?: number
disabled?: boolean
label?: ReactNode
size?: "small" | "medium" | "large"
viewProps
```

默认值：

```text
min = 0
max = 100
step = 1
defaultValue = [min, max]
size = "medium"
```

RangeSlider 支持 controlled / uncontrolled 两种状态。渲染值先 clamp 到 `min..max`，再规范为 `start <= end`。

`viewProps` 作为两个真实 range input 的共享 ViewHost 配置；因为 RangeSlider 内部必须拥有两个不同的原生 host，RangeSlider 的 `viewProps` 不开放单一 `id / ref` 覆盖。

## 18.15A.2 Native interaction 与 thumb 边界

两个 thumb 都继续由真实 `<input type="range">` 提供：

```text
track click
thumb drag
Arrow keys
Home / End
PageUp / PageDown
focus
native form participation
```

不创建自定义 ARIA slider 状态机。

start thumb 不能越过 end thumb；end thumb 不能越过 start thumb。拖动或键盘操作到另一端当前值时直接停住，不交换两个 thumb 的身份。

track 点击必须由离点击位置最近的 thumb 接管。框架按两个 thumb 当前中心的中点划分两个原生 range 的 pointer hit region；实际数值跳转与后续 drag 仍由命中的原生 range 自己处理，不另造 pointer-value 映射。

两个 thumb 的实体圆形区域发生重叠时，重叠命中区域由 start thumb（较小值语义）优先接管；完全重合时整枚重合 thumb 的 pointer 命中也归 start。end thumb 仍可通过正常键盘 focus 独立操作。

## 18.15A.3 Visual

RangeSlider **完整复用 Slider 视觉体系**，不新增 `RangeSliderTheme`，全部视觉读取：

```text
theme.components.Slider
```

因此以下内容与 Slider 完全相同：

```text
small / medium / large
trackHeight
thumbSize
thumbTrackGap
trackColor / trackShadow
fillColor / activeTrackShadow
thumb background / border / shadow
hover / press
Switch thumbDragShrink / thumbDragMaxWidth
focus outline
disabled opacity
step dot / center dot
motion.spring.snappy
reduced motion
fieldGap
```

几何关系固定为：

```text
inactive track
→ gap
→ start thumb
→ gap
→ active raised track
→ gap
→ end thumb
→ gap
→ inactive track
```

start 到 end 之间是 Slider 的 active raised surface；两侧是 Slider 的 inactive recessed track。thumb 两侧都使用同一 `thumbTrackGap`，两个 thumb 都使用 Slider 同一圆形实体、center dot、shadow 与抓取 shape。

RangeSlider 与 Slider 共用同一个 value axis。显式 `step > 0` 时，共用 Slider 的 step dot 尺寸、端点规则与位置映射；落在闭区间 `[start, end]` 内的 dot 使用 active 状态，区间外使用 inactive 状态。未显式传入 `step` 时不渲染 step dot。

## 18.15A.4 Label 与 accessibility

高层 `label` 与 Slider 一样，是旁边的普通可见文本，不建立原生 `<label htmlFor>` 激活关系，并继续使用 `theme.components.Slider.base.fieldGap`。

两个原生 range 需要能被辅助技术分别区分：

```text
startLabel -> start range 的附加 accessible name
endLabel   -> end range 的附加 accessible name
```

RangeSlider 为这两个字符串建立 visually-hidden 文本并通过 `aria-labelledby` 与公共 `label` / FormField label / `viewProps.labelledBy` 合并；不使用第二套 ARIA slider role。

## 18.15A.5 FormData / reset

```text
startName -> start 原生 range input 的 name
endName   -> end 原生 range input 的 name
```

因此两个值直接按两个真实 range input 参与 FormData。disabled 时遵循原生 disabled form-control 语义。

uncontrolled RangeSlider 必须响应真实 `form.reset()` / `<button type="reset">`，恢复 `defaultValue`；未提供 `defaultValue` 时恢复 `[min, max]`。

---

# 18.16 `Accordion`

`Accordion` 是用于组织可展开内容区块的组合组件。

组合 API：

```tsx
<Accordion>
  <AccordionItem value="account">
    <AccordionTrigger>Account</AccordionTrigger>
    <AccordionPanel>...</AccordionPanel>
  </AccordionItem>

  <AccordionItem value="security">
    <AccordionTrigger>Security</AccordionTrigger>
    <AccordionPanel>...</AccordionPanel>
  </AccordionItem>
</Accordion>
```

组件组成：

```text
Accordion
AccordionItem
AccordionTrigger
AccordionPanel
```

## 18.16.1 状态模型

默认：

```text
multiple = false
collapsible = true
```

single 模式一次只能展开一个 item。非受控且没有显式 `defaultValue` 时，默认展开第一个未 disabled 的 item。

single 模式默认允许通过再次激活当前 trigger 把全部 item 收起。只有显式 `collapsible = false` 时，当前已展开的最后一个 item 才不能被再次激活关闭。

multiple 模式允许同时展开多个 item，并允许分别关闭所有 item；multiple 模式不使用 `collapsible`。

受控 / 非受控 API：

```ts
// single
value?: string | null
defaultValue?: string | null
onValueChange?: (value: string | null) => void

// multiple
multiple: true
value?: readonly string[]
defaultValue?: readonly string[]
onValueChange?: (value: string[]) => void
```

single 与 multiple 必须使用 discriminated union，不能把公开 value 简化成 `string | string[]`。

`AccordionItem.value` 在同一个 Accordion 中必须唯一。

## 18.16.2 disabled

`Accordion.disabled` 禁用整个 Accordion 的 trigger 交互。

`AccordionItem.disabled` 只禁用对应 item。

disabled 不强制关闭已经展开的内容，只阻止用户改变该 item 的展开状态。

## 18.16.3 Trigger、图标与键盘

`AccordionTrigger` 使用真实 `<button type="button">`。

公开属性：

```ts
children: ReactNode
expandIcon?: IconComponent | IconSvg
collapseIcon?: IconComponent | IconSvg
viewProps?: AccordionTriggerViewProps
```

默认展开 / 收起指示图标使用 chevron：收起状态为向右 chevron（`›`），展开状态为向下 chevron（`⌄`）。调用方可以分别通过 `expandIcon` 与 `collapseIcon` 替换关闭状态与展开状态显示的图标。

键盘保持原生 button 行为：

```text
Tab / Shift+Tab -> 浏览器原生焦点顺序
Enter / Space   -> 展开 / 收起
```

第一版不增加 ArrowUp / ArrowDown / Home / End 的 roving focus。

## 18.16.4 Panel、Presence 与 ARIA

DOM 语义：

```text
Accordion       -> div
AccordionItem   -> div
AccordionTrigger -> button
AccordionPanel  -> div role="region"
```

每个 item 使用稳定 id 建立：

```text
Trigger aria-expanded -> 当前展开状态
Trigger aria-controls -> 对应 Panel id
Panel aria-labelledby -> 对应 Trigger id
```

Panel 收起后不能继续参与 Tab 顺序。进入 closing 状态时立即设置 `inert` 并从可访问树隐藏；Panel semantic host 保持挂载，以便 AccordionItem 的第二条 grid row 从 `1fr` 连续过渡到 `0fr`，内部内容则通过现有 `Presence` 完成 exit 后卸载。展开时该 row 从 `0fr` 连续过渡到 `1fr`。这只使用 ViewHost 已有 transition 通道、Theme motion token 与 Presence，不建立 Accordion 私有 JavaScript 高度测量或另一套 motion runtime。

默认内容 motion 使用现有 `fade-down` enter 与 `fade-up` exit，并使用 Theme 的 `gentle` physical spring；AccordionItem 的 `grid-template-rows` 也直接通过现有 View `transition` + `gentle` spring 驱动，因此内容透明度 / 位移与真实布局高度连续变化，而不是在开关时瞬间跳变。调用方可以通过 `AccordionPanel.viewProps.enter / exit` 覆盖内容 motion，也可以通过 `AccordionItem.viewProps.transition` 覆盖布局 motion；reduced motion 继续由 View motion runtime 统一处理，默认 chevron 的 CSS transition 也必须关闭。

## 18.16.5 默认视觉

Accordion 默认背景透明，不提供默认 Card / raised surface / 外层边框。

Item 之间只使用现有 Divider 视觉语言进行分隔。

Trigger：
- 整行都是点击区域；
- 默认背景透明；
- 展开状态使用 `triggerOpenBackground`，默认映射现有 `surfaceHover` color token；
- hover / press 只使用轻量 surface feedback；
- 不使用 Button 的 raised physical surface；
- 文本使用 Theme typography；
- focus-visible 使用统一 focus outline。

Panel 只提供内容 padding，不额外套 Card。对应 Item 展开时，Panel 内容区域与 Trigger 一样使用 `triggerOpenBackground`；收起状态不保留该展开背景。

默认 chevron 位于 trigger 尾部。默认图标使用同一个向右 chevron，并在展开时平滑旋转 90° 成向下状态；当调用方提供 `expandIcon` / `collapseIcon` 时按状态替换自定义图标，不附加默认旋转。

## 18.16.6 Theme

```ts
components.Accordion.base
```

支持：

```text
dividerColor
triggerBackground
triggerHoverBackground
triggerOpenBackground
triggerPressedBackground
triggerColor
triggerPaddingX
triggerPaddingY
panelPaddingX
panelPaddingY
radius
typo
disabledOpacity
focusOutlineWidth
focusOutlineColor
focusOutlineStyle
focusOutlineOffset
indicatorSize
```

---

# 18.17 `Form`

`Form` 是 Weave 的原生表单结构层。它不实现 form store，不维护 touched / dirty / submitted 状态，也不替代浏览器 constraint validation。

组件组成：

```text
Form
FormField
FormLabel
FormDescription
FormError
FormFieldset
FormLegend
```

基本用法：

```tsx
<Form onSubmit={handleSubmit}>
  <FormField
    label="Email"
    description="Used for account notifications."
    error={emailError}
    required
  >
    <Input name="email" type="email" />
  </FormField>

  <FormField label="Country">
    <Select name="country">...</Select>
  </FormField>

  <FormField label="Notifications">
    <Switch name="notifications" value="enabled" />
  </FormField>

  <Button type="submit" text="Save" />
  <Button type="reset" variant="ghost" text="Reset" />
</Form>
```

## 18.17.1 原生表单边界

`Form` 必须渲染真实 `<form>`。

```text
Form -> form
FormField -> div
FormFieldset -> fieldset
FormLegend -> legend
```

`Form.onSubmit` 与 `Form.onReset` 直接接收 React 对真实 form event 的封装。默认不设置 `noValidate`，因此浏览器原生 constraint validation 保持开启。

Weave 不生成浏览器验证错误文案，也不根据 `ValidityState` 自动生成 `FormError`。原生 required / type / pattern / minLength / maxLength 等仍由对应真实原生控件负责。

`Button.type` 支持 `button / submit / reset`，默认仍为 `button`。

## 18.17.2 FormField

`FormField` 负责字段的结构与无障碍关联，而不是数据状态。

公开属性：

```ts
children: ReactNode
label?: ReactNode
description?: ReactNode
error?: ReactNode
required?: boolean
viewProps?: FormFieldViewProps
```

`error` 只要存在就立即显示；Form 不维护 touched / submitted 状态，也不延迟错误显示。

当 error 存在时，该字段内接入 FormField context 的 Weave control 必须得到 `aria-invalid="true"`。

当 description / error 存在时，control 的现有 `aria-describedby` 必须与 FormField 生成的 description / error id 合并，不能覆盖调用方已有关系。

当 label 存在时，control 的现有 `aria-labelledby` 必须与 FormField label id 合并。

`required` 必须传递到 control 的 required 语义；对于真实 constraint-validation candidate（Input / textarea / range / radio / checkbox）同时使用真实 native `required`。

FormField 的 convenience 属性与显式 part 可以二选一：

```tsx
<FormField label="Email" description="..." error="...">
  <Input />
</FormField>
```

或：

```tsx
<FormField>
  <FormLabel>Email</FormLabel>
  <Input />
  <FormDescription>...</FormDescription>
  <FormError>...</FormError>
</FormField>
```

同一个 part 不能同时通过 convenience prop 与显式子组件重复提供。

## 18.17.3 FormLabel / Description / Error

`FormLabel`、`FormDescription`、`FormError` 必须在 `FormField` 内使用，并使用 FormField 生成的稳定 id。

默认视觉：

```text
FormLabel       -> label-medium / tertiary
required marker -> danger
FormDescription -> body-small / secondary
FormError       -> body-small / danger
```

它们只提供文本语义与 Theme 样式，不增加 field surface。

## 18.17.4 Fieldset / Legend

`FormFieldset` 使用真实 `<fieldset>`，默认透明、无额外 border / Card surface。

`FormLegend` 使用真实 `<legend>`，默认 `label-large / tertiary`。

## 18.17.5 FormData participation

原生 Input / textarea / range / radio / checkbox 继续直接依赖浏览器原生 form participation。

新增：

```text
Slider.name
RangeSlider.startName
RangeSlider.endName
Select.name
Combobox.name
Switch.name
Switch.value
```

`Slider.name` 直接设置真实 range input 的 name。

`RangeSlider.startName / endName` 分别设置两个真实 range input 的 name；两个值独立参与 FormData。

`Select` 有已选择 value 且设置了 `name` 时，通过原生 hidden input 向 FormData 提交 selected value；未选择时不提交该 name；disabled 时不提交。

`Combobox` 有 committed value 且设置了 `name` 时，通过原生 hidden input 向 FormData 提交 committed value。用户当前输入文本不作为 form value；只有提交 option 后改变 committed value。没有 committed value 时不提交该 name；disabled 时不提交。

`Switch` 与原生 checkbox 的 form value 语义一致：checked 时提交 `name=value`，unchecked 时不提交，默认 `value="on"`。

Select / Combobox / Switch 的 hidden form proxy 只承担 FormData participation；`type="hidden"` 本身不是浏览器 constraint-validation candidate。因此 `FormField.required` 对这类非原生交互 host 保留 required ARIA 语义，但不由 hidden proxy 伪造浏览器 required 校验。

## 18.17.6 Reset

真实 `<button type="reset">` / `form.reset()` 必须恢复 uncontrolled Weave form controls 的默认值。

当前覆盖 Input、Slider、RangeSlider、Select、Combobox、Switch；Radio / Checkbox 直接依赖浏览器原生 reset。

controlled control 继续由调用方拥有状态；native reset 不得擅自改变 controlled value，也不得触发其 value-change callback。

Combobox reset 必须同时恢复 committed value 与 uncontrolled input text。

## 18.17.7 Theme

```ts
components.Form.base
```

支持：

```text
formGap
fieldGap
fieldsetGap
labelColor
labelTypo
descriptionColor
descriptionTypo
errorColor
errorTypo
legendColor
legendTypo
```

默认 Form / FormField / FormFieldset 全部透明，不拥有 Card / raised surface。默认 gap 复用现有全局 spacing token；颜色与 typography 通过 Form Theme 映射现有 color / type scale。

---

# 18.18 `SplitBox`

`SplitBox` 是双 Pane 可调整布局组件。它只负责布局、separator 交互、尺寸约束与折叠，不给 Pane 提供任何默认 surface 视觉。

基本用法：

```tsx
<SplitBox
  defaultSize="35%"
  minStart={12}
  minEnd={16}
  collapsible="both"
  collapseThreshold={2}
  expandThreshold={4}
>
  <SplitBoxPane>...</SplitBoxPane>
  <SplitBoxPane>...</SplitBoxPane>
</SplitBox>
```

只支持两个直接 `SplitBoxPane`。需要 N Pane 时通过嵌套多个 SplitBox 实现，不增加 N-pane value model。

## 18.18.1 Direction 与 size

```text
horizontal -> 左右布局
vertical   -> 上下布局
```

默认 `direction="horizontal"`。

`size / defaultSize` 表示 start Pane 的尺寸，并使用现有 `Length` 语义。controlled 模式使用 `size`，uncontrolled 模式必须提供 `defaultSize`；不定义隐式 50/50 默认值。

`onChange` 返回当前 start Pane 的 CSS px size string。pointer resize 过程中会持续通知；跨过 collapse / expand 阈值时立即通知吸附后的值，pointer release 只提交当前最终值。

约束：

```text
minStart
maxStart
minEnd
maxEnd
```

全部使用现有 `Length`。正常布局与容器尺寸变化必须持续遵守这些约束。

## 18.18.2 Splitter

Splitter 使用真实 focusable separator 语义：

```text
role="separator"
horizontal pane layout -> aria-orientation="vertical"
vertical pane layout   -> aria-orientation="horizontal"
aria-valuemin=0
aria-valuemax=100
aria-valuenow=当前 start Pane 百分比
```

键盘：

```text
horizontal -> ArrowLeft / ArrowRight
vertical   -> ArrowUp / ArrowDown
```

默认 `step = 0.5rem`，并允许通过 `step?: Length` 覆盖。

Splitter 的视觉 thickness 与 pointer hit area 必须分离。`thickness?: Length` 控制 rest 状态的可见分隔线，并允许显式设为 `0`；thickness 为 0 时透明 hit area 仍存在且仍可拖动。`thickness = 0` 只表示 rest 状态不可见；hover / active / drag 时仍必须显示 Splitter Theme 的交互反馈线与对应 pointer 状态颜色，而且反馈线不得改变 Pane 的布局尺寸。

默认视觉 thickness 为 1px。默认 hit area 复用现有 Scrollbar hit-size 量级，为 1rem。

## 18.18.3 Collapse

```ts
collapsible?: false | 'start' | 'end' | 'both'
collapsed?: false | 'start' | 'end'
defaultCollapsed?: false | 'start' | 'end'
onCollapsedChange?: (collapsed: false | 'start' | 'end') => void
collapseThreshold?: Length
expandThreshold?: Length
disabled?: boolean
```

默认 `collapsible = false`。`collapsed / defaultCollapsed / onCollapsedChange` 提供受控 / 非受控折叠状态；`collapsible` 只决定用户是否能通过 splitter 把对应 Pane 拖入折叠状态，不限制外部受控状态。`collapseThreshold` 默认 0；设置正值后，pointer 拖动可以越过正常 min 约束进入 collapse zone。`expandThreshold` 是折叠 Pane 重新展开的独立阈值；未显式提供时默认复用 `collapseThreshold`。

collapse 在 pointer move 跨过阈值时立即判定：

- start Pane raw size <= `collapseThreshold` 且 start 可折叠 -> start 立即吸附到 0；
- end Pane raw size <= `collapseThreshold` 且 end 可折叠 -> end 立即吸附到 0；
- pointer 可以继续越过正常 min 向 collapse threshold 移动，但 Pane 的视觉尺寸必须锁在当前合法最小尺寸，不得继续缩小；只有 raw pointer 跨过 collapse threshold 时才瞬间吸附到 0。反向展开同理：折叠态在 expand threshold 以内视觉保持 0，跨过 threshold 才瞬间吸附到当前合法最小尺寸。

折叠 Pane 不卸载。Pane DOM 与 React subtree 保留，grid track 尺寸为 0，Pane 本身设置 `display: none` 与 `inert`；折叠 Pane 及其后代不得继续在 SplitBox 外绘制，splitter hit area 保留在边缘，因此可以直接拖回展开。

从折叠状态往外拖时，在 `expandThreshold` 以内 Pane 保持 0，不提前展开；一旦跨过阈值，立即退出 collapsed 状态，并吸附到该侧当前合法的最小尺寸（start 使用当前 lower bound，end 使用当前 upper bound 对应的最小 end 尺寸）。跨过后继续拖动按正常 resize 规则处理。若未跨过 `expandThreshold` 就释放 pointer，则保持折叠。`collapseThreshold` 与 `expandThreshold` 都是 pointer move 上的实时吸附阈值，两者形成独立 hysteresis。

不增加默认 expand button，也不定义双击折叠。

键盘方向键只执行正常 resize clamp；collapse / expand threshold 只属于 pointer drag，不由键盘触发。已经折叠时，朝展开方向的键盘 resize 会恢复到合法范围。

`disabled=true` 只禁用 splitter interaction：splitter 仍保留视觉与 `role="separator"`，但移出 Tab 顺序、标记 `aria-disabled=true`，并禁用 pointer / keyboard resize。

## 18.18.4 SplitBoxPane

`SplitBoxPane` 只是布局槽位。框架只允许以下为 SplitBox 正常布局所必需的样式：

```text
min-width: 0
min-height: 0
overflow: auto
collapsed -> display: none; overflow: hidden
```

SplitBoxPane 默认使用 `overflow: auto` 约束内容绘制范围；当内容超过 Pane 实际尺寸时由 Pane 自己形成滚动容器，不能把内容绘制到相邻 Pane 或 SplitBox 外部。和普通 `View overflow="auto"` 一样，原生 scrollbar 视觉必须隐藏，并自动挂载现有 Weave `Scrollbar`；`viewProps.scrollbar` 继续配置该自动 Scrollbar。折叠状态覆盖为 `display: none; overflow: hidden`，并不挂载 Pane 自身的 Scrollbar；Pane DOM 与 React subtree 仍然保留。

SplitBoxPane **不得**提供默认 background、border、padding、radius、shadow、typography 或任何 Card / panel surface。需要这些视觉时必须由调用方通过 Pane `viewProps` 或 Pane 内部自己的 View / Card 明确提供。

## 18.18.5 Theme

```ts
components.SplitBox.base
```

只控制 splitter，不控制 Pane：

```text
thickness
hitSize
color
hoverColor
activeColor
focusOutlineWidth
focusOutlineColor
focusOutlineStyle
focusOutlineOffset
```

---

# 19. `ToolTip`

`ToolTip` 是目标附着的辅助说明组件。

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

ToolTip 由框架内部管理 portal，普通用户不创建 portal root。页面没有打开的 modal Dialog 时默认 portal 到 `document.body`；由 modal Dialog 子树触发时，ToolTip 必须 portal 到与该 modal 关联的非模态 top-layer portal host。该 host 在 DOM / flat tree 中属于对应 `<dialog>` 的子树，从而不会被 modal inert；同时 host 自己通过原生 Popover top layer 呈现，因此不受 Dialog surface 的 overflow / motion 坐标系裁切。React context 仍按原组件树继承；portal 内重新建立当前 ThemeProvider 的 CSS 变量作用域，因此主题 token 与局部主题不会丢失。

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
enterScale
exitScale
typo
```

通用视觉覆盖继续通过 `viewProps` 使用；ToolTip 自己拥有 `role` 与 fixed positioning 语义。

---

# 19.5 `Popover`

`Popover` 是交互式锚定浮层组件。它和 `ToolTip` 的职责不同：ToolTip 是不可交互的辅助说明；Popover 可以承载 Button、Link、表单控件等交互内容；正式的命令菜单由 `Menu` 提供，后续 Select 等组件也可以继续复用同一套锚定浮层基础设施。

## 19.5.1 API

```tsx
<Popover
  placement="bottom-left"
  content={
    <Column gap={0.5}>
      <Text typo="label-medium">Account</Text>
      <Button text="Settings" />
    </Column>
  }
>
  <Button text="Open" />
</Popover>
```

当前公开属性：

```text
children
content
placement
offset
viewportPadding
open
defaultOpen
onOpenChange
autoFocus
restoreFocus
viewProps
```

`children` 是唯一 trigger；`content` 是 portal 内的交互式浮层内容。

### placement

支持八个方向：

```text
top-left
top
top-right
right
bottom-right
bottom
bottom-left
left
```

默认 `bottom`。

`placement` 是首选方向，不是绝对保证。框架在主轴发生 viewport collision 时会比较相反方向的可用空间；相反方向明显更好时自动 flip。最终位置随后执行 shift，确保 panel 尽量保持在 viewport 的 `viewportPadding` 范围内。

默认：

```text
offset = 0.5rem
viewportPadding = 0.5rem
```

定位使用 trigger 的实时 `getBoundingClientRect()` 与 panel 实际尺寸；viewport resize、任意祖先 scroll、trigger resize / mutation / interaction transition，以及 panel ResizeObserver 都会触发重新定位。相同的 anchor tracker 同时提供 viewport-exit dismiss，因此定位与“anchor 是否仍可见”不是两套监听系统。业务代码不提供 left / top 坐标。

## 19.5.2 打开、关闭与 focus

默认行为：

- click trigger 切换 open；
- trigger 使用 `aria-haspopup="dialog"`、`aria-controls` 与 `aria-expanded`；
- panel 使用 `role="dialog"`；
- 点击 / pointer down 到 trigger 与 panel 之外时关闭；
- `Escape` 关闭；
- 默认 `autoFocus=true`，打开后聚焦 panel 内第一个可聚焦元素；若没有，则聚焦 panel 本身；
- 默认 `restoreFocus=true`；Escape、程序化关闭等场景下，如果 focus 仍在 panel / body，关闭后恢复到 trigger；
- outside pointer dismiss 不抢回 focus，让用户刚点击的外部目标正常获得 focus；
- anchored-overlay 基础规则：anchor 只要仍与 viewport 有交集就保持打开；anchor 完全离开 viewport 后自动 dismiss，并且不把 focus 强行恢复到已经离屏的 anchor；
- controlled `open / onOpenChange` 与 uncontrolled `defaultOpen` 都支持；
- exit transition 完成前 panel 保留在 DOM 中，随后才卸载；
- `prefers-reduced-motion: reduce` 时跳过退出等待与位移 / scale motion。

Popover 不实现 modal 语义。非模态 `Dialog` 直接封装 Popover，继续使用同一套 trigger、placement、collision、outside dismiss 与 focus restore；`Dialog modal` 才使用浏览器原生 `<dialog>.showModal()` 提供 top layer、背景 inert 与 focus containment，不由 Weave 手写第二套 focus trap。

## 19.5.3 Portal、collision 与视觉

Popover 由框架内部管理 portal：普通上下文默认挂到 `document.body`；由 modal Dialog 子树触发时挂到与该 modal 关联的非模态 top-layer portal host。host 在 DOM / flat tree 中仍是 `<dialog>` 子节点，因此保持可交互；其自身进入原生 Popover top layer，所以 anchored overlay 不受 Dialog surface 的 overflow / motion 坐标系影响。portal 内重新建立当前 ThemeProvider，因此局部主题不会丢失。默认 semantic layer 为 `overlay`，不是 `tooltip` 或 `modal`。

Popover enter / exit motion 按**最终 resolved placement** 决定方向：从靠近 trigger 的方向轻微展开，关闭时沿相反过程收回。collision 导致 flip 后，motion 方向也跟随实际 placement。

默认视觉来自：

```text
theme.components.Popover.base
```

当前可主题化字段：

```text
background
color
borderColor
borderWidth
radius
paddingX
paddingY
minWidth
maxWidth
shadow
motionOffset
enterScale
exitScale
```

Popover 使用 surface / outline / ambient shadow 表达可交互浮层材质；不复用 ToolTip 的 primary 气泡造型，也不使用 Button 的实体按压深度。通用视觉覆盖继续通过 `viewProps` 使用，但 fixed positioning、dialog role 与 collision 坐标由 Popover 自己拥有。

---

# 19.6 `Menu`

`Menu` 是命令菜单组件，建立在 Weave 的 overlay / collision 基础设施之上，但拥有独立的 menu 语义、键盘导航与递归子菜单模型。它不是 `List` 的另一种皮肤：List 表示持久数据与 selection；Menu 表示短暂打开的命令集合。

## 19.6.1 组合 API

```tsx
<Menu
  trigger={<Button text="Actions" />}
>
  <MenuItem
    text="Edit"
    onSelect={edit}
  />

  <MenuItem
    text="Share"
    submenu={
      <>
        <MenuItem text="Copy link" />
        <MenuItem
          text="Export"
          submenu={
            <>
              <MenuItem text="PDF" />
              <MenuItem text="PNG" />
            </>
          }
        />
      </>
    }
  />

  <Divider gap={0.25} />
  <MenuItem text="Delete" danger />
</Menu>
```

`Menu`：

```text
trigger
children
placement
offset
overlapTrigger
submenuOffset
viewportPadding
open
defaultOpen
onOpenChange
closeOnSelect
viewProps
```

`MenuItem`：

```text
text
secondaryText
icon
disabled
danger
onSelect
closeOnSelect
submenu
viewProps
```

Menu 不定义私有 separator 组件。需要分组时直接插入通用 `Divider`；Menu 通常使用带 gap 的 Divider，例如 `<Divider gap={0.25} />`。

`submenu` 接收普通 ReactNode，因此 `MenuItem` 可以递归包含新的 `MenuItem / Divider`，框架不限制嵌套层数，也不引入第二套 SubMenu 组件。

## 19.6.2 语义与 focus

- trigger 使用 `aria-haspopup="menu" / aria-controls / aria-expanded`；
- 每个菜单 surface 使用 `role="menu"`；
- 命令项使用 `role="menuitem"`；
- separator 使用 `role="separator"`；
- 有子菜单的 item 使用 `aria-haspopup="menu" / aria-controls / aria-expanded`；
- disabled item 使用 disabled 语义并从键盘导航序列中跳过；
- focus 使用 roving tabindex：当前聚焦项为 `tabIndex=0`，同 level 其他可用项为 `-1`；
- root menu 关闭后默认恢复 trigger focus；outside pointer dismiss 不抢走用户刚点中的外部目标 focus。

## 19.6.3 键盘模型

trigger：

```text
click                 → toggle
ArrowDown             → open + focus first enabled item
ArrowUp               → open + focus last enabled item
Enter / Space         → open + focus first enabled item
```

菜单项：

```text
ArrowDown / ArrowUp   → 同 level 循环移动，跳过 disabled
Home / End            → first / last enabled item
Enter / Space         → 激活普通项；对子菜单父项则进入 submenu
ArrowRight            → 打开 submenu 并聚焦第一个可用子项
ArrowLeft             → 关闭当前 submenu 并把 focus 还给父项
Escape                → 优先关闭当前 submenu level；root level 再关闭整个 Menu
```

若父 item 的 submenu 已经打开，而 focus 仍停在父 item，`ArrowLeft / Escape` 只关闭这个 submenu，不会直接关闭整个 root menu。

## 19.6.4 Pointer 与子菜单树

- pointer 进入 submenu parent 时打开对应 submenu；
- pointer/focus 移到同 level 的普通项或其他 submenu parent 时，之前的 sibling submenu 关闭；
- submenu 使用同一套框架 portal host：普通上下文默认挂到 `document.body`，modal Dialog 子树内则挂到该 modal 对应的非模态 top-layer portal host；root Menu 使用同一个 root id 把所有 submenu portal 视为同一棵菜单树，因此在 submenu 内点击不会被 root outside-dismiss 误判成外部点击；
- 普通 item 激活后默认关闭整棵菜单树；`Menu.closeOnSelect=false` 或单个 `MenuItem.closeOnSelect=false` 可以保留菜单。

## 19.6.5 定位与 collision

root Menu 使用和 Popover 相同的八向 placement / flip / shift 几何；默认：

```text
placement = bottom-left
offset = 0.375rem
overlapTrigger = false
submenuOffset = 0.25rem
viewportPadding = 0.5rem
```

root Menu 可选 `overlapTrigger=true`：此时主轴定位基准改为 trigger 自身，因此默认 `bottom-left` 会让 menu 从 trigger 左上角开始覆盖，而不是从 trigger 下方开始；未显式传 `offset` 时 overlap 模式使用 0。submenu 不受该 root 开关影响。

submenu 使用 side-start 语义：默认从父 item 右侧、顶部对齐展开；右侧空间不足时自动 flip 到左侧，并沿纵轴 shift 保持在 viewport 内。submenu 不维护第二套 positioning engine，而是直接复用 Popover 的 placement / flip / shift resolver，并只把 cross-axis alignment 设为 `start`。任意祖先 scroll、viewport resize、anchor / panel resize 或视觉动画变化都会重新定位。root Menu 不自己实现 viewport-exit 判断，而是继承 anchored-overlay 的统一 anchor-hidden dismiss：trigger 仍与 viewport 有交集时保持打开，完全离开 viewport 后关闭整棵菜单树，并且不把 focus 强行拉回已经离屏的 trigger。

root 和所有 submenu 都使用同一个 semantic `overlay` layer、ThemeProvider 上下文与 exit-presence 生命周期。collision flip 后 motion 方向跟随最终实际方向。

## 19.6.6 Theme

默认视觉来自：

```text
theme.components.Menu.base
theme.components.Menu.item
```

`base` 控制 surface / border / radius / padding / minWidth / maxWidth / shadow / motionOffset / enterScale / exitScale；`item` 控制普通、hover、active、danger、disabled、icon、`textGap`、typography 与 focus ring。分割线不属于 MenuTheme，由通用 `Divider` 自己负责。

`viewProps` 仍是通用 escape hatch，但 `role`、fixed positioning、collision 坐标和菜单键盘语义由 Menu 自己拥有。

---
# 19.7 `Dialog`

`Dialog` 有两条明确分支，但只公开一个组件名：

```text
modal=false
→ Popover wrapper

modal=true
→ 原生 <dialog>.showModal()
```

Weave 不另外公开 `Modal` 组件，也不再使用 `<dialog>.show()` 实现 non-modal Dialog。

## 19.7.1 Non-modal Dialog = Popover wrapper

非模态 Dialog 必须直接复用公开 `Popover`，不能复制一套定位、collision、outside dismiss、Escape、focus restore 或 portal 系统。

```tsx
<Dialog
  trigger={<Button text="Reference" />}
  placement="bottom-left"
>
  <Column gap={1}>
    <Text typo="title-medium">Reference</Text>
    <Text>Background work can continue.</Text>
  </Column>
</Dialog>
```

此时：

```text
trigger
children
placement
offset
viewportPadding
open
defaultOpen
onOpenChange
autoFocus
restoreFocus
viewProps
```

分别直接映射到 Popover 的 trigger / content 与同名 props。

因此 non-modal Dialog：

- 不默认放在屏幕中央；
- 相对 `trigger` 定位；
- 使用 Popover 的 8 向 placement 与 viewport flip / shift collision；
- 使用 Popover 的 click toggle、outside dismiss、Escape 与 focus restore；
- surface 宿主仍是 Popover 的 `<div role="dialog">`；
- 不创建原生 `<dialog>`；
- 不进入 top layer；
- 不产生 `::backdrop`；
- 不让背景 inert；
- 不提供 modal focus containment。

`Dialog` 的 non-modal 分支本身不维护第二套主题、motion 或定位实现；这些全部以 Popover 为单一实现来源。

## 19.7.2 Modal Dialog = native showModal()

Modal 分支：

```tsx
<Dialog
  modal
  open={confirming}
  onOpenChange={setConfirming}
>
  <Column gap={1}>
    <Text typo="title-medium">Delete item?</Text>
    <Button text="Delete" variant="danger" />
  </Column>
</Dialog>
```

公开 modal 专属属性：

```text
modal = true
children
open
defaultOpen
onOpenChange
closeOnEscape
closeOnBackdrop
initialFocus
restoreFocus
viewProps
```

默认值：

```text
closeOnEscape = true
closeOnBackdrop = false
restoreFocus = true
```

Modal 固定使用浏览器原生 `<dialog>.showModal()`：

- 浏览器负责 top layer；
- 浏览器负责背景 inert；
- 浏览器负责 modal focus containment；
- 浏览器提供 `::backdrop`；
- Escape 产生原生 `cancel` 事件。

禁止为了 modal 再实现一套 div + portal + inert + focus trap。

## 19.7.3 Modal 打开、关闭与事件

`open / defaultOpen / onOpenChange` 使用与其他受控组件一致的模型。父级拒绝一次受控请求时，下一次相同请求仍必须正常发出。

Escape 使用原生 `cancel` 事件：

- Weave 始终 `preventDefault()` 阻止浏览器绕过 React 状态直接关闭；
- `closeOnEscape=true` 时请求 `onOpenChange(false)`；
- `closeOnEscape=false` 时保持打开；
- `viewProps.onCancel` 先执行；用户已经 `preventDefault()` 时，框架不再发关闭请求。

原生 `close` 事件（包括调用 dialog.close() 或原生 dialog form 流程）必须同步回 `onOpenChange(false)`。对于仍保持 `open=true` 的受控 Dialog，框架重新调用 `showModal()`，不能让 DOM 与受控 prop 永久分叉。

## 19.7.4 Modal Backdrop

`closeOnBackdrop=false` 是默认值，避免确认删除、登录和必须完成的步骤因误点遮罩消失。

显式开启后：

```tsx
<Dialog modal closeOnBackdrop />
```

只有真正落在 Dialog surface 外部 backdrop 区域的点击才请求关闭。用户 `viewProps.onClick` 已经 `preventDefault()` 时不执行框架默认关闭。

## 19.7.5 Focus

Non-modal 的 autofocus / restoreFocus 完全复用 Popover。

Modal 打开前记录当前 active element。提供 `initialFocus` 时，在原生 `showModal()` 完成后显式聚焦该目标；不提供时不重写浏览器自身的 dialog focusing steps。关闭并完成 exit 后，`restoreFocus=true` 时恢复之前的 active element。

Modal 的 focus containment 本身由浏览器提供。Weave 不维护 tabbable 列表，不监听 Tab 循环，也不向页面其他节点手工写 `inert`。

## 19.7.6 Modal Portal、Layer、Geometry 与 Motion

Modal Dialog portal 到 `document.body`，portal 内重新建立当前 ThemeProvider；默认 semantic layer 为 `modal`，真正的模态堆叠仍以浏览器 top layer 为权威。

Modal 使用 ViewHost，因此 stylesheet 必须显式提供不会被通用 View style declaration 重置掉的居中几何 fallback：

```text
display: block
position: fixed
inset: 0
margin: auto
height: fit-content
```

关闭时不能立即调用原生 `close()`：先进入 `closing` 视觉状态并保持 `<dialog open>`，完成 exit transition 后才调用 `close()` 并卸载。Reduced Motion 下跳过等待并立即完成关闭。

Modal 默认视觉来自：

```text
theme.components.Dialog.base
```

Modal surface 复用 Button 的 `feedback.restDepth` 表达静态“突起”实体厚度，但它不是可点击 surface，因此 hover 与 press 都不能改变几何或深度：

```text
rest
→ 使用 feedback.restDepth 形成方向性实体厚度

hover
→ 不抬起、不缩放、不改变 depth

press / :active
→ 不下沉、不缩放、不改变 depth
```

Dialog 不使用 `hoverLift / hoverScale / hoverDepth / pressOffset / pressScale / pressDepth`。它自己只提供 `depthColor`，同时保留原有 ambient `shadow`。

当前可主题化字段：

```text
background
color
borderColor
borderWidth
radius
paddingX
paddingY
width
maxWidth
maxHeight
shadow
depthColor
backdropColor
motionOffset
enterScale
exitScale
```

这些 Dialog theme 字段只作用于 modal 原生 Dialog；non-modal 直接继承 Popover 的 theme 与 stylesheet。

---
# 19.8 `Drawer`

`Drawer` 是同一份 drawer content 在 modal / non-modal 两种布局模型之间切换的响应式容器。它不是单纯的 overlay。

```tsx
<Drawer
  drawer={<Navigation />}
  open={open}
  onOpenChange={setOpen}
>
  <MainContent />
</Drawer>
```

`children` 始终是主视图，`drawer` 始终是 Drawer 内容。

## 19.8.1 Mode 与 breakpoint

```ts
mode?: 'auto' | 'modal' | 'non-modal'
breakpoint?: string
side?: 'left' | 'right' | 'top' | 'bottom'
```

默认：

```text
mode = auto
breakpoint = md
side = right
```

`auto` 使用当前 Theme breakpoint：viewport 小于 breakpoint 时为 modal，大于等于 breakpoint 时为 non-modal。默认主题下 `md = 48rem`。显式 `mode="modal"` 或 `mode="non-modal"` 时忽略 breakpoint。

SSR / 没有 `matchMedia` 时先按 modal 处理。`auto` 指定当前 Theme 中不存在的 breakpoint 时直接抛出明确错误，不静默 fallback。modal ↔ non-modal 切换不改变 `open`，也不触发 `onOpenChange`。

## 19.8.2 Open 与 size

```ts
open?: boolean
defaultOpen?: boolean
onOpenChange?: (open: boolean) => void

size?: Length
defaultSize?: Length
onSizeChange?: (size: string) => void
minSize?: Length
```

`open` 使用标准受控 / 非受控模型。non-modal 下 `open=false` 等价于 Drawer 侧 Pane 折叠到 0；Drawer 内容保持 mounted 并 inert。重新打开时继续使用之前保存的 Drawer size。

`size / defaultSize / onSizeChange` 控制 Drawer 自身沿 `side` 主轴的尺寸。都未提供时默认 `20rem`；`minSize` 默认 `12rem`。left/right 控制宽度，top/bottom 控制高度。auto 模式切换时保留当前 resize 后的尺寸；modal 下尺寸受 viewport 上限约束。

## 19.8.3 Non-modal = SplitBox

non-modal Drawer 必须直接复用 `SplitBox`，不能复制 splitter、键盘 resize、collapse 或 threshold 实现。

```ts
resizable?: boolean
collapseThreshold?: Length
expandThreshold?: Length
```

默认：

```text
resizable = true
collapseThreshold = 2rem
expandThreshold = 4rem
```

Drawer 位于 left/top 时复用 start Pane，位于 right/bottom 时复用 end Pane。拖动进入 `collapseThreshold` 时立即吸附关闭并请求 `onOpenChange(false)`；从折叠状态向外拖过 `expandThreshold` 时立即吸附到 `minSize` 并请求 `onOpenChange(true)`，之后继续按正常 SplitBox resize。

`resizable=false` 映射到 SplitBox `disabled`：splitter 元素仍保留，但 non-modal Drawer 固定 `thickness=0`，且不能 pointer / keyboard resize，也不进入 Tab 顺序。

non-modal 不产生 backdrop、不让主内容 inert、不做 focus containment。surface 默认不使用 ambient shadow，也不由 Drawer 自己添加任何 border；只有调用方通过 `drawerViewProps` 显式配置时才可以出现 border。Drawer 与主视图的可拖边界只由 SplitBox splitter 表达。non-modal Drawer 的 splitter `thickness` 固定为 0，只保留 hit area 与 hover / active feedback。

non-modal 的 `SplitBoxPane` 必须继续保持纯布局槽位，Drawer surface 必须作为 Pane 内部的独立元素存在，不能把 surface 的 padding / border / background 直接施加到 Pane 本身。Pane 折叠时由 SplitBoxPane 的 collapsed `display: none` 完整移出布局与绘制，关闭状态不得残留任何 Drawer padding、border、内容或 Scrollbar 绘制。

## 19.8.4 Modal = native Dialog

modal Drawer 直接复用 modal `Dialog` 的原生 `<dialog>.showModal()` 基础：top layer、背景 inert、focus containment、Escape、backdrop 与 restoreFocus 不另造第二套。

默认：

```text
closeOnEscape = true
closeOnBackdrop = true
restoreFocus = true
```

支持 `initialFocus`。Drawer content 在 modal / non-modal 切换时不会重新创建 React subtree；同一 content host 在两个宿主之间移动，因此内部 React state 必须保持。模式切换本身不执行 restoreFocus。

modal surface 贴对应 viewport edge；只有朝内容侧的两个角使用 Drawer radius，贴 viewport 的两个角为 0。modal Drawer 必须复用 modal Dialog 的 depth 强度与 `depthColor`，但 depth 方向跟随打开方向：left 向右、right 向左、top 向下、bottom 向上。

## 19.8.5 Modal surface drag / swipe close

modal Drawer 不提供独立 handle。用户直接在 Drawer surface 上起手拖动 / swipe；点击 backdrop 空白区域则按 `closeOnBackdrop` 关闭。surface drag / swipe-to-close 只在 viewport 小于 Theme `md` breakpoint 时生效；达到或超过 `md` 后即使显式 `mode="modal"`，也不得通过滑动关闭。

```ts
closeThreshold?: Length
```

默认 `closeThreshold = 4rem`。mouse / pen / touch 统一使用 pointer gesture：

- left 向左拖关闭；
- right 向右拖关闭；
- top 向上拖关闭；
- bottom 向下拖关闭。

Drawer surface 跟随 pointer 移动；release 时距离达到 threshold 就请求关闭，否则吸附回完全打开位置。pointer cancel 也回到打开位置。不增加 velocity / fling 判定。left/right Drawer 保留纵向滚动手势，top/bottom Drawer 保留横向滚动手势。

## 19.8.6 Overflow 与 Theme

Drawer surface 内容溢出时必须使用现有 Weave AutoScrollbar，隐藏浏览器原生 scrollbar。`drawerViewProps.scrollbar` 继续配置该 scrollbar。

Drawer 默认视觉来自：

```text
theme.components.Drawer.base
```

字段：

```text
background
color
borderColor
borderWidth
radius
paddingX
paddingY
shadow
backdropColor
```

默认视觉与 modal Dialog 的 surface 色系一致：`surface / tertiary / outline / 1px / 1rem padding / large shadow / 0.48 backdrop`。large shadow 只作用于 modal；non-modal 不使用 backdrop 与 ambient shadow。

`viewProps` 配置 Drawer 的整体布局 root；`drawerViewProps` 配置 Drawer surface。

## 19.8.7 Implementation correction record — 2026-10-01

以下错误曾经进入实现，后续不得再次引入：

- 曾擅自让 non-modal Drawer surface 继承 Drawer 默认 border，并只取消与主视图相接的一侧。正确行为是 Drawer 自己不给 non-modal surface 添加 border；只有调用方通过 `drawerViewProps` 显式配置时才允许出现 border，可拖边界只由 `SplitBox` splitter 表达。
- 曾让 SplitBox 在合法最小尺寸与 collapse threshold 之间继续改变 Pane 的视觉尺寸。正确行为是 pointer 可以继续移动，但 Pane 视觉尺寸锁在合法最小尺寸，直到跨阈值才瞬间吸附；展开方向同理。
- 曾让折叠 Pane 只缩到 0 并使用 `overflow: hidden`，但 Pane 后代的 portal 型 Scrollbar 仍可能按折叠前几何绘制到 Pane 外。折叠 Pane 必须保留 DOM / React subtree，同时自身 `display: none`，并且不挂载 Pane 自身 Scrollbar。
- 曾让 modal Drawer 的 content host 在打开时没有及时挂入 dialog，造成打开期间内容缺失、退出阶段才出现。
- 曾擅自增加 `DrawerHandle` 作为 modal swipe-to-close 起手区。该组件和相关公开 API 已删除；正确交互是直接滑动 Drawer surface，或点击 backdrop 空白区域关闭。
- 曾让 modal Drawer 的 surface drag / swipe-to-close 在所有 viewport 生效。正确范围仅为 Theme `md` 以下；`md` 及以上即使显式 modal 也禁用滑动关闭。
- 曾遗漏 modal Drawer 按打开方向呈现 modal Dialog 同款 depth。Drawer depth 必须朝内容侧投射。
- 旧自动化测试曾在上述交互明显错误时仍全部通过，形成假阳性验证。按项目决定，仓库自动化测试套件于 2026-10-01 删除；此类交互不得再以 synthetic test 通过作为正确性的替代证据。

---
# 20. `Snack`

`Snack` 同时提供：

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

不传 `container` 时，Snack region 在没有 modal Dialog 时挂到 `document.body`；存在 modal Dialog 时挂到当前最上层 modal 对应的非模态 top-layer portal host，仍按 viewport placement 语义定位，从而按 `snack` layer 保持在 modal 之上。

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

- 未传 `container`：没有 modal 时挂到 `document.body`；存在 modal 时挂到当前最上层 modal 对应的非模态 top-layer portal host，region 继续使用 viewport 定位；
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
→ 显式 container / 默认 portal host（document.body 或当前最上层 modal 的 top-layer portal host）
  → top-left region
  → top-center region
  → top-right region
  → bottom-left region
  → bottom-center region
  → bottom-right region
```

不传 `container` 时 mount scope 是框架默认 portal host：通常为 `document.body`，modal 打开期间为当前最上层 modal 对应的非模态 top-layer portal host；指定 `container` 时 mount scope 是该 HTMLElement。

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

A 移除后的 B / C 使用 FLIP / layout animation 从旧位置平滑补位；快速连续变化时新布局从当前视觉值接管，不排动画队列。Snack 自身 enter / exit 的视觉 transform 与 FIFO 补位的 layout transform 必须由不同的 DOM transform owner 承担，layout measurement 不得把正在进行的 enter / exit 位移误判成布局变化。

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

`List` 不是“一个纵向 View”。

它是一个真正的数据列表组合控件。

结构：

```text
List
└─ ListItem × N
   ├─ Icon?
   ├─ Text
   └─ trailing?
```

`ListItem` 直接复用已有的文字、图标和 trailing 交互组件。

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

List 默认在相邻 item 之间插入通用 `Divider`，并固定使用 `gap={0}`，因此分割线不会额外撑开 item 间距；需要无分割线列表时使用：

```tsx
<List items={items} noDividers />
```

`noDividers` 只控制 item 之间是否渲染 Divider，不改变 ListItem 的选择、焦点、虚拟化或布局语义。

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
- ListItem 是连续 row，不是彼此独立的卡片或大胶囊；默认行不设圆角，产品需要时再通过 `theme.components.ListItem.base.radius` 显式配置；
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
textGap
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
Select
Switch
Radio
Checkbox
Progress
Scrollbar
ToolTip
Popover
Menu
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
    Select: { ... },
    Combobox: { ... },
    Slider: { ... },
    Switch: { ... },
    Avatar: { ... },
    Skeleton: { ... },
    Progress: { ... },
    Scrollbar: { ... },
    ToolTip: { ... },
    Popover: { ... },
    Menu: { ... },
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

深色模式必须保持与浅色模式相同的组件设计语言，而不是另起一套“加边框提高对比度”的规则。Button 继续沿用同一套 variant 配方与实体厚度：rest 有 depth，hover 抬起并增加 depth，press 下沉并收缩 depth；dark 只替换语义 token 和必要的阴影颜色。Input / Select / Combobox 继续使用同一套 Input field-surface 几何；Dark 保持现有凹陷视觉不变，Light 向该基准对齐，不能再使用更浅、更扁的另一套 field surface。Switch 继续保持“track 凹陷、thumb 凸起”的独立物理层级：track 与 Input / Select / Combobox 只共用 Input surface 的 border color / width，不再共享 background / shadow；Switch track 自己用方向性 inset shadow 表达凹槽；on track 使用 primary；thumb 用外部投影与顶部高光表达突起。

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

运行时主题可以直接增加任意 token 名；组件的颜色类属性继续接受这些字符串值。TypeScript 不能从运行时 `ThemeProvider` 所引用的某个对象反向改变全局 JSX 组件类型，因此自定义 token 的静态自动补全通过 Weave 的类型注册表显式声明，而不是伪装成 `createTheme()` 的跨树类型推导。

例如：

```ts
declare global {
  namespace Weave {
    interface ColorTokenRegistry {
      brand: true
    }
  }
}

const theme = createTheme({
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

`brand` 会进入 Weave 的已注册颜色 token 类型与 IDE 补全；运行时仍由当前 ThemeProvider 提供实际 token 值。注册表只负责静态名称，不复制主题值，也不建立第二套主题来源。

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

组件主题使用一组统一的概念词汇，但每个组件只暴露自己真正需要的子结构；不能为了形式统一而制造空层级。常见入口是：

```text
ComponentTheme
├─ base       // 组件共有视觉
├─ sizes?     // 有尺寸语义的组件
├─ variants?  // 有视觉变体的组件
├─ states?    // 多个尺寸 / variant 共用的持久或交互状态
└─ 组件专属结构（例如 Select.listbox / option）
```

具体字段由组件自己的公开 Theme 类型决定，组件章节中的 Theme API 与 TypeScript 类型是同一套结构，不再额外套通用 `viewProps` 包装层。

## 23.1 base

所有实例共有的默认样式。例如 Button 的 `base.radius / borderWidth / focusOutline*`。

## 23.2 sizes

尺寸不是单一高度，而是一整套协调设计。例如当前 Button：

```ts
Button: {
  sizes: {
    small: {
      minHeight: 2,
      paddingX: 0.75,
      paddingY: 0.5,
      gap: 0.375,
      typo: "label-small",
    },
    medium: {
      minHeight: 2.5,
      paddingX: 1,
      paddingY: 0.625,
      gap: 0.5,
      typo: "label-medium",
    },
    large: {
      minHeight: 3,
      paddingX: 1.25,
      paddingY: 0.75,
      gap: 0.625,
      typo: "label-large",
    },
  },
}
```

## 23.3 variants

`variant` 不是单纯颜色别名，而是该组件的一组完整变体语义。状态相关值可以直接属于 variant，例如 Button 当前使用 `hoverBackground` / `activeBackground`；不再声明一套不存在的通用 `variant.base.viewProps / variant.hover.viewProps` 嵌套协议。

```ts
Button: {
  variants: {
    primary: {
      background: "primary",
      color: "onPrimary",
      borderColor: "primary",
      depthColor: "primaryActive",
      hoverBackground: "primaryHover",
      activeBackground: "primaryActive",
    },
  },
}
```

## 23.4 states

`states` 用于不依赖具体 variant 的共享状态；各组件只声明自己实际支持的状态。例如 Button 当前的 disabled：

```ts
Button: {
  states: {
    disabled: {
      opacity: 0.5,
    },
  },
}
```

所有 Weave 组件一旦进入 disabled 状态，最终计算 CSS cursor 必须为 `not-allowed`。这是 ViewHost 层的全局规则；组件主题可以继续定义 disabled opacity 等视觉属性，但不能把 disabled cursor 改回 `default`、`pointer` 或其他值。关联 label / field wrapper 也必须保持 `not-allowed`。

若以后某组件确实需要“variant 专属状态覆盖”，必须在该组件自己的 Theme 类型与组件章节中显式增加，不能假定所有组件都存在一个隐藏的通用 variant-state 层。

---

## 23.5 样式优先级

当前统一顺序：

```text
defaultTheme
→ 当前 ThemeProvider 的组件主题
→ component base
→ size（若存在）
→ variant（若存在，包含该 variant 自己声明的交互字段）
→ shared state（若存在）
→ instance props
→ responsive overrides
→ className
→ style
```

其中 defaultTheme 与应用 / 局部 ThemeProvider 先经过主题继承与深合并，再由组件按照自己公开的 Theme 类型解析有效结构。

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
Select  默认 focusable（focus 保持在 combobox trigger）
Combobox 默认 focusable（真实 input 保持 DOM focus）
Switch  默认 focusable
AccordionTrigger 默认 focusable（真实 button）

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

`Select` 自己保证 select-only combobox 键盘模型；DOM focus 保持在 trigger，候选浏览状态通过 `aria-activedescendant` 表达，只有提交 option 才改变 `value`。

`Combobox` 保证 editable combobox 键盘模型；DOM focus 保持在真实 input，输入文本只影响 `inputValue` / filtering，提交 option 才改变 `value`。

`AccordionTrigger` 使用原生 button 的 Tab / Shift+Tab / Enter / Space 行为，不增加 roving focus；展开状态通过 `aria-expanded` 与对应 Panel 关联。

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

Dialog
→ 非模态默认 layer="overlay"
→ modal 默认 layer="modal"

Snack
→ 默认 layer="snack"
```

开发者不需要显式创建 portal 根节点。

React 结构归属仍在原组件树中，但视觉上由框架进入对应浮层层级。原生 modal `<dialog>.showModal()` 进入浏览器 top layer 后，普通 `document.body` portal 的 `z-index` 无法越过该 top layer；同时 modal 打开时，除该 `<dialog>` flat-tree 子树外的文档节点会被浏览器设为 inert。因此每个打开的 Weave modal 必须拥有一个 DOM 上属于该 `<dialog>` 子树、但自身通过 `popover="manual"` 在该 modal 之后进入 top layer 的非模态 portal host。modal 子树里的 `overlay / tooltip` 等框架浮层进入对应 modal 的 portal host；全局 Snack 在 modal 打开期间进入当前最上层 modal 的 portal host；modal 自身仍 portal 到 `document.body` 并由浏览器决定 modal 之间的 top-layer 堆叠顺序。由于 portal host 自己处于 Popover top layer，它不受 Dialog surface 的 overflow、translate 或 scale 绘制约束。AutoScrollbar 同样按目标元素所在 modal 选择对应 portal host，不能固定 portal 到 body。

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
├─ 公开组件
│  ├─ Text / Code / Image / Icon / Avatar
│  ├─ Input / Button / Link / Card / AppBar
│  ├─ Slider / RangeSlider / Switch / Radio / Checkbox
│  ├─ Progress / Skeleton / Divider
│  ├─ Badge / ToolTip / Popover / Dialog
│  ├─ Select / SelectOption
│  ├─ Combobox / ComboboxOption
│  ├─ Menu / MenuItem
│  ├─ Form / FormField / FormLabel / FormDescription / FormError / FormFieldset / FormLegend
│  ├─ SplitBox / SplitBoxPane
│  │   └─ 双 Pane 可调整布局；N Pane 通过嵌套 SplitBox
│  ├─ Accordion / AccordionItem / AccordionTrigger / AccordionPanel
│  ├─ Tabs / TabList / Tab / TabPanel
│  ├─ Snack
│  └─ List / ListItem
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
└─ 需要承载自身 DOM 的组件
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

内部实现按职责继续拆分而不是形成新的集中式 god-file：静态 framework stylesheet 共享统一安装器，动态 runtime class 与 breakpoint stylesheet 共享 retain / release 生命周期注册器；CSS 名称转换只保留单一内部 helper；组件主题解析按 controls / actions / progress / overlays / lists 分域；List 的内容归一化、selection、roving focus 与 virtualization layout 分离；Select / Combobox 共用 option navigation、active-option 滚动同步与 option-listbox host，但保留各自不同的 value / input / typeahead 语义；Menu 与 option navigation 只共享无语义的循环索引计算；公开 `Presence` 与 Badge / ToolTip / Popover / Snack / Menu / Select / Combobox 共用同一个 exit-presence 生命周期引擎及 transition-end glue；`Presence` 通过注册的子宿主协调多项 exit，其余组件通过自身 transition / animation 完成信号与 timeout fallback 结束退出，Badge / ToolTip / Popover / Menu / Select / Combobox 的锚点更新复用统一的 rAF / observer 跟踪基础设施，但 Badge 单独启用实时视觉 transform 跟随，anchored overlay 不跟随 hover / press 等瞬时视觉 transform；Popover / Menu root / Select / Combobox 进一步共用 anchored-overlay 的 viewport-exit dismiss helper，组件层只决定 dismiss 后的 focus / selection 语义，不重复判断 anchor visibility；Snack 的 lifetime、内容渲染、队列策略与 region registry / host positioning 保持独立职责；队列补位直接复用 `View.layoutAnimation`，不维护 Snack 私有 FLIP 引擎。公开 API 不暴露这些内部 helper。

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
8. 不以“基础 / 组合”组件层级限制复用；已有公开组件的语义与 API 匹配时直接复用。
9. 只有现有公开组件、internal helper 与浏览器原生能力都不能表达需求时，才允许新增实现或抽象。
10. 不得因为组件分类重新实现已有组件已经提供的 DOM / 样式 / 交互能力。
11. 不暴露 `as`、`asChild` 或底层 HTML 标签选择权。
12. CSS 是内部实现与语义基础，但公开 API 应提供高层、语义化属性。
13. `style` 保留为原始 CSS 逃生口。
14. 除 `style` 与组件规范明确声明的像素单位例外外，所有表示尺度的无单位数字统一按 `rem`；当前像素例外只有 `Divider.size` 与 `Tabs.indicatorThickness`。
15. 所有表示时间的裸数字统一按毫秒（`ms`）。
16. 组件公开 `size` 只接受该组件定义的语义尺寸值，不接受数字。
17. 样式最终优先级为 `style > className > 属性体系`。
18. 通用布局、视觉、状态样式、响应式、动画与通用事件能力属于 `ViewProps`；具体组件可以提供自身更自然的高层语义属性。
19. DOM + CSS 是唯一渲染路径，不维护第二套组件 renderer。
20. 组件视觉、布局、状态与交互必须以真实 DOM / CSS / 浏览器语义为唯一真值。
21. 布局、文本、表单、事件、焦点、滚动与可访问性必须继续由浏览器 HTML / CSS / DOM 负责，禁止平行重复实现。
22. 框架自身不提供 Canvas UI 渲染后端；业务自行使用普通 Web `<canvas>` 不改变 Weave 的 DOM 渲染模型。
23. Scrollbar 复用 ViewHost 通用能力，不是伪元素样式。
24. Scrollbar 由框架自动插入，不要求开发者显式使用。
25. `selectable` 是 `ViewProps` 通用能力，不是 Text 专属。
26. `Image` 不提供 `decorative`，且遵循对应 DOM 内容模型，不接受 `children`。
27. `Progress` 用 `undetermined` 明确表示未知进度，用 `progress` 表示确定进度。
28. 主题语义值、组件变体、状态样式、响应式覆盖、`className` 和 `style` 有明确优先级。
29. 组件默认承担正确可访问性和键盘语义，不把标准行为推给业务开发者。
30. 浮层使用语义 layer，普通用户不需要手工管理 portal 或全局 z-index。
31. 具体组件已经提供同义语义状态属性时，该状态不在其 `viewProps` 中重复暴露，组件属性作为唯一真值。
32. 框架自身的 playground、示例与组件实现必须优先 dogfood 已有 Weave 语义组件；已有 `Text`、`Progress` 等能力时，不再平行维护裸 DOM / 私有 CSS 的同义实现。
33. 组件复用其他组件的视觉或交互能力时，外层组件仍承担自己的高层语义；不得因此重复暴露冲突的 ARIA 角色。
34. `Text.typo` 必须来自主题中的完整 type scale；不能退回 renderer 内部的少量硬编码 preset。
35. Scrollbar 只绘制 thumb，不提供 tracked / trackColor；带圆角宿主必须把圆角曲线区域排除出 thumb 的运动区。
36. 所有框架拥有的文字视觉必须选择或继承 `theme.tokens.typography.styles` 中的 typo；Button、Input 等组件不得平行维护 `fontSize / fontWeight / lineHeight / letterSpacing`。
37. 普通 View 继承当前排版上下文；根节点与 ThemeProvider 默认建立 `body-large` 上下文，允许 Button 等组件建立自己的 typo 上下文后由内部 Text 继承。
38. API 的目标是：AI 易写易读，同时人类易读。
