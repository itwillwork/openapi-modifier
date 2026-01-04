[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)


# 示例：结合Orval的类型化原生Fetch

本项目演示如何使用Orval从OpenAPI规范生成TypeScript类型和API客户端函数，并结合类型安全的原生`fetch`封装进行使用。

## 项目结构

- `src/` – 应用源代码
  - `api/` – API客户端和类型
    - `generated/` – Orval生成的API客户端和类型
  - `App.tsx`, `index.tsx` – React应用入口
- `specs/` – OpenAPI规范文件
  - `openapi.json` – 原始OpenAPI规范
  - `prepared-openapi.json` – 经过脚本处理后的OpenAPI规范
- `openapi-modifier.config.ts` – OpenAPI规范修改配置
- `orval.config.ts` – Orval代码生成配置

## 可用的npm脚本

- `generate-types` – 使用Orval从处理后的OpenAPI规范生成TypeScript类型和API客户端函数。
- `prepare-openapi` – 使用CLI工具`openapi-modifier`修改OpenAPI规范。
- `mock:api` – 使用处理后的OpenAPI规范启动mock服务器。
- `dev` – 同时运行mock API服务器和React应用。

## 工作原理

### 从OpenAPI生成类型和客户端
- `prepare-openapi`脚本使用`openapi-modifier`修改原始OpenAPI规范（如更改base path、过滤接口）。
- `generate-types`脚本用`orval`从修改后的OpenAPI规范生成TypeScript类型和API客户端函数。
- Orval生成类型安全的API函数，这些函数直接使用原生`fetch` API。

### 类型安全的原生Fetch
- Orval生成API函数（如`getPetById`），这些函数使用原生`fetch`，为请求和响应提供完整的类型安全。
- 基础URL在`orval.config.ts`中配置，并自动包含在所有API调用中。

### Mock服务器
- `mock:api`脚本结合`@stoplight/prism-cli`和处理后的OpenAPI规范启动mock服务器，便于本地测试，无需真实后端。

### OpenAPI规范的修改
- OpenAPI规范通过`openapi-modifier.config.ts`中定义的规则流水线进行修改（如更改base path、过滤接口、移除未使用组件）。

