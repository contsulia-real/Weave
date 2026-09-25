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
LoadingIndicator
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