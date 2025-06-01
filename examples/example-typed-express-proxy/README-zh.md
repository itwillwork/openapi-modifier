[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)


# example-typed-express-proxy

本项目演示了如何在 Node.js 中使用 OpenAPI 和 TypeScript 实现强类型的 Express 代理应用。

## 项目结构

- `src/` — 应用源代码
  - `index.ts` — 入口文件，路由注册，控制器，mock 生成
  - `middlewares/` — 自定义中间件（日志、响应处理）
  - `services/petstore/generated-api-types.d.ts` — 由 OpenAPI 生成的 TypeScript 类型
  - `@types/` — 自定义类型定义（包括 TypedController）
  - `errors.ts` — 自定义错误类
  - `example.test.ts` — mock/sample 生成的测试示例
- `specs/` — OpenAPI 规范
  - `petstore.json` — 原始 OpenAPI 规范
  - `prepared-petstore.json` — 修改后的规范（经 openapi-modifier 处理）
- `openapi-modifier.config.ts` — OpenAPI 规范修改配置
- `simple-text-file-modifier.config.ts` — 生成类型的后处理配置
- `package.json` — 项目配置和脚本

## 可用 npm 脚本

- `start` — 启动 Express 代理服务器
- `prepare-openapi-spec` — 使用 openapi-modifier 修改 OpenAPI 规范
- `generate-types` — 从 OpenAPI 生成 TypeScript 类型（含后处理）
- `prepare-generated-types` — 对生成的类型进行命名一致性处理
- `test` — 运行测试（Jest）

## 工作原理

### 从 OpenAPI 生成类型
- OpenAPI 规范（`specs/petstore.json`）通过 `openapi-modifier`（见 `openapi-modifier.config.ts`）修改后保存为 `specs/prepared-petstore.json`。
- 使用 `dtsgenerator` 从准备好的规范生成类型，并通过后处理保证命名一致性。
- 最终在 `src/services/petstore/generated-api-types.d.ts` 中获得强类型的 API 合同。

### 通过 TypedController 实现控制器类型化
- 控制器通过 `TypedController<T>` 接口进行类型化，`T` 描述每个 endpoint 的请求/响应结构。
- 这样可为请求参数、body、query 及响应（包括错误处理）提供完整类型安全。

### 通过 getMockFromOpenApi 生成 endpoint mock 响应
- 工具函数 `getMockFromOpenApi` 通过将 OpenAPI schema 转为 JSON Schema 并用 `json-schema-faker` 生成 mock 响应。
- 可为规范中定义的任意 endpoint/响应即时生成 mock 数据。

### 在测试中生成实体/响应样本
- 工具函数 `createEndpointResponseSampleFromOpenApi` 和 `createEntitySampleFromOpenApi` 用于在测试中生成 endpoint 和实体的样本数据，采用同样的 OpenAPI → JSON Schema 转换和 json-schema-faker 逻辑。

### 使用 openapi-modifier 修改 OpenAPI 规范
- CLI 工具 `openapi-modifier` 用于预处理 OpenAPI 规范（如移除 operationId 以便更好地生成类型）。
- 修改流程通过 `openapi-modifier.config.ts` 中的 pipeline 配置。

---

更多细节请参见源码及各文件注释。 