# Semicons 项目 TODO 列表

> 最后更新: 2024-01-20

本文档记录 semicons 项目所有待推进的任务，按优先级分组。

---

## P0（本周必须完成）

**目标：打通 CLI → registry → React 运行时**

### P0-1: packages/react 创建 icons.generated 自动导入

- **文件**: `packages/react/src/icons.generated/index.ts` (新建)
- **内容**: 从 `inline.ts` 导入 `INLINE_ICONS`，从 `types.ts` 导入 `ICON_META`，在模块加载时自动调用 `setInlineIcons()` 和 `setIconMeta()`
- **效果**: 用户在业务代码只需 `<Icon name="status.error" />`，无需手动初始化
- **状态**: ✅ 已完成 (2024-01-20)

### P0-2: packages/react 添加类型导出

- **文件**: `packages/react/src/index.ts`
- **内容**: 导出 `IconName` 类型 (从生成的 types.ts 或手动重导出)
- **效果**: 支持 `<Icon name={...} />` 的类型检查
- **状态**: ✅ 已完成 (2024-01-20)

### P0-3: 补充 React 快速开始文档

- **文件**: `apps/docs/src/pages/docs/framework/react-quickstart.astro`
- **内容**: 展示如何安装、配置、生成图标、使用组件
- **效果**: 用户能根据文档跑通完整流程
- **状态**: ✅ 已完成 (2024-01-20)

### P0-4: packages/react 运行构建验证

- **操作**: `cd packages/react && pnpm build`
- **检查**: `dist/index.js` 和 `dist/index.d.ts` 是否正确生成
- **状态**: ✅ 已完成 (2024-01-20)

### P0-5: packages/cli 为 inline.ts 添加类型声明

- **文件**: `packages/cli/src/index.ts` (修改 `cmdGenerate` 函数)
- **问题**: 当前 inline.ts 是 JS，没有 .d.ts
- **方案**: 同时生成 `inline.ts` 和 `inline.d.ts`，同时为 `types.ts` 添加 `.d.ts`
- **状态**: ✅ 已完成 (2024-01-20)

### P0-6: 根目录运行完整构建验证链路

- **操作**: `pnpm build && pnpm typecheck`
- **预期**: 所有包构建成功，类型检查通过
- **状态**: ✅ 已完成 (2024-01-20)

---

## P1（下周可以推进）

**目标：IDE/Lint 集成可用 + 最小 docs 站**

### P1-1: packages/eslint-plugin 自动发现 registry.json

- **文件**: `packages/eslint-plugin/src/rules/valid-icon-token.ts`
- **改动**: 支持从 `process.cwd()` 向上搜索 `icons.generated/registry.json`
- **效果**: 用户无需配置 `registryPath`，开箱即用
- **状态**: ✅ 已完成 (2024-01-20)

### P1-2: packages/eslint-plugin 添加配置项到 recommended config

- **文件**: `packages/eslint-plugin/src/index.ts:11-22`
- **改动**: 为 recommended 配置添加 `{ registryPath: 'src/icons.generated/registry.json' }`
- **效果**: 用户只需启用 recommended config
- **状态**: ✅ 已完成 (2024-01-20)

### P1-3: packages/vscode 添加 Webview Preview 功能

- **文件**: `packages/vscode/src/views/previewWebview.ts` (已存在)
- **检查**: 确认 `previewIcon` 命令能正常显示 SVG
- **效果**: 用户 hover 时可点击预览 icon
- **状态**: ✅ 已完成 (2024-01-20) - 功能已完整实现

### P1-4: apps/docs 补充 Vue 快速开始文档

- **文件**: `apps/docs/src/pages/docs/framework/vue-quickstart.astro`
- **参考**: React 文档结构
- **状态**: ✅ 已完成 (2024-01-20)

### P1-5: apps/docs 补充 CLI 高级用法文档

- **文件**: `apps/docs/src/pages/docs/cli-advanced.astro` (新建)
- **内容**: scan/doctor 命令、strict 模式、theme 配置、CI/CD 集成
- **状态**: ✅ 已完成 (2024-01-20)

### P1-6: 根目录添加 CI 验证构建

- **文件**: `.github/workflows/ci.yml` (新建)
- **内容**: `pnpm install → pnpm build → pnpm typecheck → pnpm test`
- **效果**: 每次 PR 自动验证构建
- **状态**: ✅ 已完成 (2024-01-20)

---

## P2（后续迭代）

### P2-1: packages/vue 创建 icons.generated 集成

- **文件**: `packages/vue/src/icons.generated/index.ts` (新建)
- **内容**: 同 P0-1，为 Vue 包添加自动导入，提供 `initFromGenerated()` 函数
- **效果**: 用户在 Vue 应用中只需 `<Icon name="status.error" />`，无需手动初始化
- **状态**: ✅ 已完成 (2024-01-20)

### P2-2: packages/cli 添加 --watch 模式

- **内容**: 热更新生成图标
- **状态**: 待开始

### P2-3: apps/docs 添加交互式 Playground

- **内容**: 在线尝试 Icon 组件
- **状态**: 待开始

### P2-4: packages/core 添加完整的测试覆盖

- **内容**: 当前 0 测试，需要补充
- **状态**: 待开始

### P2-5: packages/cli 支持远程 registry

- **内容**: 从 URL 获取配置
- **状态**: 待开始

### P2-6: packages/eslint-plugin 添加 auto-fix

- **内容**: 自动修复 valid-token 错误
- **状态**: 待开始

---

## 已完成

### 2024-01-20

- 完成仓库全面分析
- 识别各模块角色和状态
- 确定核心 domain 和契约
- 分析 CLI → 运行时链路
- 评估 IDE & Lint 集成现状
- 检查工程化配置
- 生成此 TODO 文档
