[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)


# 示例：结合OpenAPI的类型化原生Fetch

本项目演示如何从OpenAPI规范生成TypeScript类型，并结合类型安全的原生`fetch`封装进行使用。

## 项目结构

- `src/` – 应用源代码
  - `api/` – API客户端和类型
    - `client.ts` – 基于原生fetch的类型安全API客户端
    - `types/` – 生成的和自定义的TypeScript类型
  - `App.tsx`, `index.tsx` – React应用入口
- `specs/` – OpenAPI规范文件
  - `openapi.json` – 原始OpenAPI规范
  - `prepared-openapi.json` – 经过脚本处理后的OpenAPI规范
- `openapi-modifier.config.ts` – OpenAPI规范修改配置
- `simple-text-file-modifier.config.ts` – 类型文件修改配置

## 可用的npm脚本

- `generate-types` – 从处理后的OpenAPI规范生成TypeScript类型并应用修改。
- `prepare-generated-types` – 修改生成的类型（如添加警告注释）。
- `prepare-openapi` – 使用CLI工具`openapi-modifier`修改OpenAPI规范。
- `mock:api` – 使用处理后的OpenAPI规范启动mock服务器。
- `dev` – 同时运行mock API服务器和React应用。

## 工作原理

### 从OpenAPI生成类型
- `prepare-openapi`脚本使用`openapi-modifier`修改原始OpenAPI规范（如更改base path、过滤接口）。
- `generate-types`脚本用`dtsgenerator`从修改后的OpenAPI规范生成TypeScript类型。
- `prepare-generated-types`脚本对生成的类型做进一步处理（如添加警告注释）。

### 类型安全的原生Fetch封装
- `src/api/client.ts`中的`ApiClient`类基于生成的类型实现了类型安全的原生fetch封装。

### Mock服务器
- `mock:api`脚本结合`@stoplight/prism-cli`和处理后的OpenAPI规范启动mock服务器，便于本地测试，无需真实后端。

### 类型和OpenAPI规范的修改
- 类型文件通过简单文本修改器进行后处理（见`simple-text-file-modifier.config.ts`）。
- OpenAPI规范通过`openapi-modifier.config.ts`中定义的规则流水线进行修改（如更改base path、过滤接口、移除未使用组件）。 