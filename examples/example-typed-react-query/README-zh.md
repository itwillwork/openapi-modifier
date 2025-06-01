[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)


# 示例：OpenAPI 类型生成 + React Query

本项目演示如何从 OpenAPI 规范生成 TypeScript 类型，并在 React 应用中结合 [react-query](https://tanstack.com/query/latest) 使用。

## 项目结构

```
examples/example-typed-react-query/
├── public/                  # 静态资源
├── specs/                   # OpenAPI 规范（原始和处理后）
│   ├── openapi.json         # 原始 OpenAPI 规范
│   └── prepared-openapi.json# 用于代码生成/Mock 的处理后规范
├── src/
│   ├── api/
│   │   ├── fetchPetById.ts  # 使用生成类型的 API 示例
│   │   └── types/
│   │       ├── generated-api-types.d.ts # 从 OpenAPI 生成的类型
│   │       └── models.ts    # 供应用使用的类型别名
│   ├── App.tsx              # 集成 react-query 的主 React 应用
│   └── ...
├── openapi-modifier.config.ts           # OpenAPI 规范修改配置
├── simple-text-file-modifier.config.ts  # 生成类型后处理配置
├── package.json
└── ...
```

## 可用 npm 脚本

- `generate-types` — 从 OpenAPI (`specs/prepared-openapi.json`) 生成 TypeScript 类型并进行后处理
- `prepare-generated-types` — 为生成的类型文件添加警告头
- `prepare-openapi` — 使用 `openapi-modifier` CLI 修改原始 OpenAPI 规范
- `mock:api` — 使用 [Prism](https://github.com/stoplightio/prism) 启动 Mock 服务器
- `dev` — 同时启动 Mock 服务器和 React 应用

## 工作流程说明

### 1. OpenAPI 规范修改
- 原始规范（`specs/openapi.json`）通过 `openapi-modifier`（见 `openapi-modifier.config.ts`）处理。
- 示例：更改 base path、过滤接口、移除未用组件。
- 输出：`specs/prepared-openapi.json`。

### 2. 类型生成
- 使用 `dtsgenerator` 从处理后的 OpenAPI 规范生成类型。
- 输出：`src/api/types/generated-api-types.d.ts`。
- 通过 `simple-text-file-modifier` 添加警告头。

### 3. 与 React Query 集成
- API 函数（如 `fetchPetById`）使用生成类型实现类型安全。
- React 组件通过 `@tanstack/react-query` 获取和缓存数据。

### 4. Mock 服务器
- Mock 服务器（`mock:api`）通过 Prism 提供处理后的 OpenAPI 规范。
- 便于本地开发和测试，无需真实后端。

### 5. 类型和规范的修改
- 类型可通过 `simple-text-file-modifier` 进行后处理（如添加注释等）。
- OpenAPI 规范可通过 `openapi-modifier` CLI 和配置文件进行程序化修改。

---

欢迎查阅代码和配置文件了解更多细节！ 