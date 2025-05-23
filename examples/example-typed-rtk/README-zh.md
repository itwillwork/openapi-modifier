[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# OpenAPI + RTK Query 类型生成示例

本示例演示了如何在 React 应用程序中使用 OpenAPI 规范生成 TypeScript 类型并将其与 RTK Query 集成。

## 功能特点

1. **OpenAPI 类型生成**
   - 使用 `dtsgenerator` 从 OpenAPI 规范生成 TypeScript 类型
   - 自动生成 API 请求和响应的类型定义
   - 使用 `openapi-modifier` 进行自定义类型修改

2. **RTK Query 集成**
   - 演示如何将生成的类型与 RTK Query 一起使用
   - 提供类型安全的 API 调用和响应
   - 展示查询钩子和突变的正确类型定义

3. **模拟服务器**
   - 使用 Prism CLI 基于 OpenAPI 规范创建模拟服务器
   - 为开发和测试模拟 API 响应
   - 与开发服务器并行运行

4. **类型修改**
   - 展示如何向生成的类型添加警告注释
   - 使用 `openapi-modifier` 对生成的类型进行后处理
   - 演示自定义类型转换

5. **OpenAPI 规范修改**
   - 使用 `openapi-modifier` 转换 OpenAPI 规范
   - 为所有端点添加 basePath 以实现统一的 API 路径处理
   - 允许在类型生成之前对 API 规范进行自定义修改
   - 通过配置支持各种转换规则

## 开始使用

1. 安装依赖：
   ```bash
   npm install
   ```

2. 生成 API 类型：
   ```bash
   npm run generate-types
   ```

3. 启动开发环境：
   ```bash
   npm run dev
   ```
   这将同时启动模拟服务器和 React 开发服务器。

## 项目结构

- `specs/counter-api.yaml` - OpenAPI 规范
- `src/api/types/` - 生成的 TypeScript 类型
- `src/api/counterApi.ts` - RTK Query API 定义
- `src/App.tsx` - 使用 API 的 React 组件示例

## 可用脚本

- `npm run dev` - 启动模拟服务器和 React 开发服务器
- `npm run mock-api` - 仅启动模拟服务器
- `npm run prepare-openapi-types` - 通过为所有端点添加 basePath 来准备 OpenAPI 规范
- `npm run generate-types` - 从 OpenAPI 规范生成 TypeScript 类型
- `npm run prepare-generated-types` - 对生成的类型进行后处理

## 工作原理

1. **OpenAPI 规范准备**
   - 原始 OpenAPI 规范位于 `specs/counter-api.yaml`
   - 使用 `openapi-modifier` 通过为所有端点添加 basePath 来准备规范
   - 准备好的规范保存在 `specs/prepared-counter-api.yaml`
   - 此步骤确保在整个应用程序中统一处理 API 路径

2. **类型生成**
   - 准备好的 OpenAPI 规范定义 API 结构
   - `dtsgenerator` 将规范转换为 TypeScript 类型
   - `openapi-modifier` 添加自定义类型修改

3. **RTK Query 设置**
   - 使用生成的类型定义 API 端点
   - 自动创建类型安全的查询钩子
   - 从 OpenAPI 规范推断响应类型

4. **模拟服务器**
   - Prism CLI 读取 OpenAPI 规范
   - 基于规范生成模拟响应
   - 提供真实的开发环境

## 类型安全

该示例展示了如何实现完整的类型安全：
- API 请求/响应类型从 OpenAPI 规范生成
- RTK Query 端点正确类型化
- TypeScript 提供编译时类型检查
- IDE 自动完成 API 调用和响应

