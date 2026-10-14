# Weave 浏览器性能与兼容性基线

此基线仅用于比较**同一机器、同一浏览器、同一构建模式**上的性能变化。滚动帧间隔来自 `requestAnimationFrame`，不等同于完整的端到端渲染延迟；不要把下列数值当作跨机器 CI 门限。

## 复测方法

1. 在 Weave 仓库运行 `pnpm dev`，保留文档服务。
2. 使用已获授权的 Junius Playwright CLI 以 **headless Chrome** 打开 `http://127.0.0.1:5173/docs/components/Button`（本机端口如不同，请替换）。
3. 在同一浏览器会话中执行 `playwright-cli run-code --filename scripts/browser-performance-baseline.playwright.txt`。此脚本直接使用 CLI 的 `page`，**不需要安装依赖或自行启动浏览器进程**。
4. 连续运行至少 3 次，记录每轮完整结果及 Chrome 版本、DPR、视口和构建模式；优先比较每轮的 P95、超过 25 ms 的帧数和 DOM/编辑器正确性。
5. 如果需要测量生产文档，请先由现有构建工具生成独立的文档生产站点，并使用预览服务；不要把库构建 `pnpm build` 的产物当作文档站点。

脚本覆盖 Button 文档 110 帧滚动、DataGrid 的 95 帧虚拟表格滚动、首次把合法 TSX 代码粘贴式替换为具有可见变化的示例、预览与 Shiki 高亮更新、无效 TypeScript 语法诊断、Reset，以及动态溢出的新增／缩短／恢复／移除与 Shadow DOM 新增／移除。兼容性断言为 `false` 或出现未处理页面异常时**直接失败**。输出含 `p50Ms`、`p95Ms`、`over25Ms`、渲染行数、输入动作到预览／高亮完成的累计耗时。**首次编辑耗时包含 Playwright 自动化与 React 预览／高亮工作，不等于 TypeScript 编译器的独立耗时。**

异步 TypeScript Worker 的回归检查单独执行 `playwright-cli run-code --filename scripts/documentation-worker-regression.playwright.txt`：它人为延迟 Worker 资源请求，断言全部 9 个编辑框在初始化期间禁用、就绪后启用且共享一个 Worker，随后覆盖快速连续编辑、语法错误和编译尚未完成时的 Reset。此脚本是**交互正确性测试**，人为延迟的加载时间不得计入性能基线。

## 2026-10-13 开发环境参考样本

Windows、**HeadlessChrome 154**、1280×720 CSS 像素、DPR 1、Vite 开发服务；同一会话重复三轮。

| 指标 | 第 1 轮 | 第 2 轮 | 第 3 轮 |
|---|---:|---:|---:|
| Button 滚动 P95 | 16.8 ms | 17.2 ms | 17.3 ms |
| Button 超过 25 ms 的帧 | 1 | 1 | 1 |
| DataGrid 滚动 P95 | 16.8 ms | 33.3 ms | 16.8 ms |
| DataGrid 超过 25 ms 的帧 | 0 | 6 | 0 |
| 首次编辑输入动作耗时 | 162 ms | 102 ms | 102 ms |
| 代码 Reset 恢复原文 | 通过 | 通过 | 通过 |
| 动态滚动宿主／Shadow DOM 七项断言 | 全通过 | 全通过 | 全通过 |
| 未处理页面脚本异常 | 0 | 0 | 0 |

## 2026-10-13 完整实时预览回归样本

上述旧样本只输入一个字符；下表改为**一次粘贴式替换**，并等待实际渲染的预览按钮、Shiki 高亮、无效 TSX 诊断与 Reset，不能直接比较两套首次编辑动作的耗时。环境同为 Windows、HeadlessChrome 154、1280×720 CSS 像素、DPR 1、Vite 开发服务。

| 指标 | 第 1 轮 | 第 2 轮 | 第 3 轮 |
|---|---:|---:|---:|
| Button 滚动 P95 | 16.9 ms | 17.2 ms | 16.8 ms |
| Button 超过 25 ms 的帧 | 2 | 0 | 0 |
| DataGrid 滚动 P95 | 33.4 ms | 33.3 ms | 16.8 ms |
| DataGrid 超过 25 ms 的帧 | 9 | 8 | 0 |
| 单次替换动作耗时 | 191 ms | 194 ms | 135 ms |
| 从替换开始到实际预览更新 | 258 ms | 265 ms | 178 ms |
| 从替换开始到 Shiki 高亮更新 | 285 ms | 292 ms | 216 ms |
| TypeScript 语法错误可见、Reset 后预览恢复 | 通过 | 通过 | 通过 |
| 动态溢出及 Shadow DOM 七项断言 | 全通过 | 全通过 | 全通过 |
| 未处理页面脚本异常 | 0 | 0 | 0 |

## 2026-10-13 功能修复后滚动性能复测

修复提交 `bc70d23` 后，沿用 `scripts/browser-performance-baseline.playwright.txt` 在 Windows、HeadlessChrome 154、1280×720、DPR 1、Vite 开发服务上连续运行三轮。数据是同环境观测值，不能充当跨机器门限。

| 指标 | 第 1 轮 | 第 2 轮 | 第 3 轮 |
|---|---:|---:|---:|
| Button 滚动 P95 | 17.2 ms | 17.0 ms | 17.1 ms |
| Button 超过 25 ms 的帧 | 0 | 1 | 0 |
| DataGrid 滚动 P95 | 33.3 ms | 33.4 ms | 33.4 ms |
| DataGrid 超过 25 ms 的帧 | 5 | 15 | 7 |
| 从编辑开始到预览更新 | 272 ms | 292 ms | 275 ms |
| 从编辑开始到代码高亮更新 | 290 ms | 332 ms | 312 ms |
| 动态滚动宿主及 Shadow DOM 七项断言 | 全通过 | 全通过 | 全通过 |
| 未处理页面脚本异常 | 0 | 0 | 0 |

**冷热对照：**每次重新导航到 DataGrid，等待 Shiki 就绪后再等待 350ms，分别测得滚动 P95 33.2/33.2ms、超过 25ms 的帧 5/5；把额外等待延长到 2800ms，分别为 16.8/16.9ms、2/2 帧。因此短时掉帧与页面初次稳定阶段有关，不能直接推断为持续滚动性能。

**调用归因：**对 DataGrid 约 95 帧滚动期间的浏览器方法进行临时插桩，观察到约 5.6 万次 `getComputedStyle` 调用；每 100 次采样一次调用栈，约 90% 来自 `scrollbar-geometry.ts`，约 10% 来自 `scroll-host-discovery.ts`。同次测量中 Document 层 `querySelectorAll('*')` 仅调用 2 次，选择器执行本身约 0.2ms（**不含**遍历和后续样式读取）；不能据此认定全局扫描是 33ms 帧的主因。单独将 AutoScrollbar MutationObserver 的同步 geometry 更新改为已有逐帧调度后，样式读取次数及 P95 未获明显改善，因此已撤销试验改动，未保留未经验证的性能补丁。

## 2026-10-14 AutoScrollbar 目标变更观察去重

AutoScrollbar 原先通过自身的 MutationObserver 和共享 `trackVisualAnchor` **同时**观察同一目标子树，两条路径都同步计算 scrollbar geometry。现在保留 AutoScrollbar 自身的目标子树观察与子节点 ResizeObserver 维护，改为逐帧合并该路径的几何更新；共享 tracker 仍观察祖先属性、尺寸与 CSS 动画，并在挂载时同步计算。

HeadlessChrome 154、1280×720、DPR 1 下，对虚拟 DataGrid 的 95 帧滚动临时计数：先前 `getComputedStyle` 约 5.6 万次；优化后观察到约 2.9–3.3 万次，约减少 40%–48%。这是样式查询次数的下降，**不是**帧耗时减少同等比例的证明；计数时的 JS 包装也会影响运行时间。

完整回归脚本优化后三轮：Button P95 16.9/16.9/16.9ms，DataGrid P95 33.4/16.9/33.3ms，DataGrid 超过 25ms 的帧数 9/3/7。各轮编辑、语法诊断、Reset、动态溢出及 Shadow DOM 七项检查通过，页面脚本异常为 0。DataGrid 初始化期的偶发 33ms 帧**尚未根治**，需进一步隔离初始化／调度压力。

独立的实际 DOM 检查：滚动宿主的祖先平移 72×38px 后，portal scrollbar 的位移一致，祖先裁剪从 `inset(0px 0px 40px)` 更新到 `inset(0px)`；CSS transition 和 CSS keyframes 动画期间相对位置的抽样误差为 0px。独立观察到直接由 Web Animations API 启动、未伴随属性变更的祖先动画没有同步 portal scrollbar；这一行为未做优化前版本对照，不能当作本次修改引入的回归，也不属于此轮 CPU 去重的已解决范围。

## 2026-10-14 Web Animations API 祖先动画跟随回归

`trackVisualAnchor` 以前只在 DOM 变更、CSS transition/animation 事件或 ResizeObserver 等已有信号后进入逐帧同步。直接 `element.animate()` 启动的 WAAPI 动画不产生上述 CSS 动画事件，因此当 tracker 空闲时，祖先在运动但 portal scrollbar 停留在旧位置。

现有 visual-anchor tracker 现在为启用 `continuousAnimations` 的调用方在每个动画帧轻量探测活动动画，**仅在确有动画时**恢复既有逐帧几何同步。AutoScrollbar 使用原有 IntersectionObserver 的可视区域状态，避免对离屏目标持续执行昂贵的 `getAnimations()` 查询；对多宿主的空闲探测仍有运行开销，并非零成本。HeadlessChrome 154、1280×720 的 DataGrid 插桩观察到每 95 帧约 6900 次动画查询、查询本身累计约 17ms，此数值是临时包装器下的诊断值，不能当作准确无插桩耗时。

通过已授权的 headless Chrome 使用 Playwright CLI 的 `run-code --filename` 执行 `scripts/scrollbar-waapi-regression.playwright.txt`（传入其**仓库绝对路径**，浏览器会话的当前目录可能不是仓库），实际 WAAPI 祖先 `transform` 100px/460ms 动画，14 次位置采样的最大 scrollbar 对齐误差约 0.01px，页面异常 0。验证脚本保存在项目中，可重复执行。原有 CSS transition、CSS keyframes、祖先裁剪与动态溢出/Shadow DOM 测试仍覆盖各自不同的行为。

**DataGrid 冷态掉帧仍未稳定修复：** 主线程 Trace 在一次冷态滚动中观察到 133ms 的 React 调度任务，但不能证明所有 33ms 帧来自同一来源。曾尝试跳过虚拟窗口不变的 viewport 状态、以及复用已有 overscan 增加重渲染缓冲；在 Headless Chrome 冷态测试中仍偶发 33ms P95，且直接 DOM 行增删约 84–85 条，与原实现几乎相同。恢复原始 DataGrid 源码后仍观测到 16.8–16.9ms 与 33ms 不同批次。因未证实持续改善，两个 DataGrid 试验均已撤销。保留 WAAPI 修复后的完整浏览器回归三轮：Button P95 16.8/17.0/16.8ms，DataGrid P95 33.3/33.4/33.4ms；动态溢出与 Shadow DOM 七项断言全部通过、未处理异常均为 0。不得将回归通过解读为 DataGrid 的冷态掉帧已消除。

## 2026-10-14 DataGrid 虚拟窗口更新调度修复

HeadlessChrome 154、Windows、1280×720、DPR 1 下，在相同的 DataGrid 文档页、Shiki 就绪后再等待 350ms 的冷态基准中，先用原实现进行多轮对照：实际滚动 DataGrid 会间歇出现 P95 约 33.2–33.4ms，而同页面空闲帧与普通原生滚动容器大体保持在 16.8–16.9ms。Chrome Long Animation Frame 曾记录 140–158ms 的 React 调度任务；取消 DataGrid 自身的 scroll 监听会消除大多数慢帧，但让虚拟列表显示空白，不能作为修复。单独取消 AutoScrollbar 的 scroll 监听未消除慢帧。

尝试过的全局滚动宿主发现缓存、行尺寸冗余测量清理、根据首个测量结果调整虚拟行估算高度，以及复用 Documentation 预览元素，都没有稳定消除慢帧或出现其他回退，已撤销。单纯在全部滚动状态更新上应用 `startTransition` 曾造成大幅跳转时空白，同样不保留。

最终只调整 DataGrid 视口状态的 React 调度：**常规短距离滚动**使用 `startTransition`，让浏览器有绘制机会；**首次尺寸变化及相对上次已提交视口偏移超过半个 viewport 的跳转**使用普通更新优先级，避免越过原有半视口 overscan 后发生空白。没有改变行索引选择、overscan 数值、组件 API、滚动宿主或样式设计。

| 无头 Chrome 复测 | 结果 |
|---|---|
| 新浏览器会话：冷态 350ms 六轮 P95 | 16.8–16.9ms（超过 25ms 的帧每轮 0–2） |
| 热态 2800ms 一轮 P95 | 16.8ms |
| 完整 `browser-performance-baseline.playwright.txt` 三轮：DataGrid P95 | 16.9 / 16.9 / 16.9ms |
| 完整基准三轮：Button P95 | 16.8 / 16.8 / 16.9ms |
| 编辑、诊断、Reset、动态溢出及 Shadow DOM 七项断言 | 每轮全部通过，脚本异常 0 |
| `data-grid-scroll-regression.playwright.txt` | 8 个大幅跳转正常；65 轮快速滚动空白帧 0；动态行高调整及恢复正常；选择状态离屏后恢复正常；页面异常 0 |

另通过浏览器动态挂载 240 行的 `stickyHeader=false` 真实 DataGrid，验证外层 View 作为滚动宿主时 7 个跳转位置均有可见行，60 轮快速滚动空白帧为 0；测试组件已卸载清理。

以上是本机实测结果，**不构成跨设备固定性能门限**。新的独立正确性回归脚本使用授权 Playwright CLI 的 `run-code --filename`，文件为 `scripts/data-grid-scroll-regression.playwright.txt`，调用时传入其仓库绝对路径。

## 浏览器兼容性状态

- **Chrome 原生 500% 网页缩放**：通过 Playwright CLI 启动的**无头持久化 Chrome**，在 `chrome://settings/appearance` 的“网页缩放”选项中选择 `500%`；页面报告 DPR 5、256×144 CSS 视口，9 个 Button 代码示例正常加载且容器可滚动到 `scrollTop=120`。这是真正的浏览器网页缩放设置，不是 `deviceScaleFactor` 模拟。尚不表示所有 500% 交互状态均完成视觉验收。
- **Firefox**：系统浏览器已安装于 `D:\Softwares\Firefox\firefox.exe`。当前 Junius Playwright CLI 默认缓存版本缺失；显式指定该 Firefox 可执行文件后，进程以 `-headless -juggler-pipe` 启动但在握手前退出。**因此 Firefox 页面兼容性仍未实测**，不能写为失败，也不能写成本机未安装 Firefox。不要在未获授权时自行下载安装另一个浏览器。
- **Chrome Shadow DOM 与动态溢出**：在无头 Chrome 中实际创建、滚动、缩短、恢复并移除宿主；Shadow DOM 的滚动宿主新增和移除被正确发现，三轮测试全部通过。

目前没有自动性能门限或定时监控；此记录提供可复测的基线与兼容性缺口，不声称能自动检测所有未来回退。
