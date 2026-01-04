[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md) | [🇨🇳 中文](./README-zh.md)


# 示例：使用 express-openapi-validator 的 Express 服务器

本项目演示了如何在 Express 服务器中使用 `express-openapi-validator` 来验证请求和响应，并使用 `openapi-modifier` 修改 OpenAPI 规范。

## 项目结构

- `src/` – 应用程序源代码
  - `routes/` – Express 路由处理器
  - `services/` – 业务逻辑服务
  - `index.ts` – Express 应用程序入口点
- `specs/` – OpenAPI 规范
  - `openapi.json` – 原始 OpenAPI 规范
  - `prepared-openapi.json` – 修改后的 OpenAPI 规范（运行脚本后）
- `openapi-modifier.config.ts` – OpenAPI 规范修改配置

## 可用的 npm 脚本

- `prepare-openapi` – 使用 CLI 工具 `openapi-modifier` 修改 OpenAPI 规范。
- `start` – 使用 `ts-node` 启动 Express 服务器。
- `dev` – 使用 `ts-node-dev` 在开发模式下启动 Express 服务器，支持热重载。
- `build` – 将 TypeScript 编译为 JavaScript。

## 工作原理

### OpenAPI 规范修改
- 脚本 `prepare-openapi` 使用 `openapi-modifier` 修改原始 OpenAPI 规范（例如，更改基础路径、过滤端点）。
- 修改后的规范保存到 `specs/prepared-openapi.json`，供 `express-openapi-validator` 使用。

### 请求和响应验证
- `express-openapi-validator` 根据 OpenAPI 规范验证传入的请求。
- 启用响应验证以确保响应符合规范。
- 无效的请求或响应会自动返回适当的错误响应。

### Express 路由
- 路由在 `src/routes/` 中定义，使用经过验证的请求/响应对象。
- 验证器在运行时确保类型安全和模式合规性。

### 错误处理
- 自定义错误处理程序格式化验证错误并以一致的格式返回它们。

## 使用方法

1. 安装依赖：
```bash
npm install
```

2. 准备 OpenAPI 规范：
```bash
npm run prepare-openapi
```

3. 启动服务器：
```bash
npm start
```

或在开发模式下使用热重载：
```bash
npm run dev
```

4. 测试 API：
```bash
# 通过 ID 获取宠物
curl http://localhost:3000/api/v3/pet/1

# 查看 API 规范
curl http://localhost:3000/spec
```

## API 示例

### 成功请求

成功请求示例：
```bash
curl -X GET "http://localhost:3000/api/v3/pet/1"
```

响应：
```json
{"id":1,"name":"sparky","status":"available","photoUrls":["https://example.com/sparky.jpg"],"tags":[{"name":"sweet"}]}
```

### 验证错误

因验证失败而被拒绝的请求示例：
```bash
curl -X GET "http://localhost:3000/api/v3/pet/not-a-number"
```

响应：
```json
{"message":"request/params/petId must be integer","errors":[{"path":"/params/petId","message":"must be integer","errorCode":"type.openapi.validation"}]}
```

## OpenAPI 规范修改

OpenAPI 规范使用 `openapi-modifier.config.ts` 中定义的规则管道进行修改：
- 将基础路径从 `/` 更改为 `/api/v3/`
- 过滤端点以仅包含 `GET /api/v3/pet/{petId}`
- 删除未使用的组件以保持规范最小化

